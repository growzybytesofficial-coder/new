import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import connectDB from './config/db.js';
import app, { setupFrontendRouting } from './app.js';

// Load environment variables
dotenv.config();

// Global crash resilience: catch unhandled errors so server does not exit abruptly
process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception captured:', err?.message || err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
});

async function startServer() {
  // Connect to MongoDB asynchronously without blocking startup
  connectDB().catch((err) => {
    console.error('Database connection initialization warning:', err?.message || err);
  });

  // Setup routing and middleware
  try {
    await setupFrontendRouting(app);
  } catch (err) {
    console.error('⚠️ Warning setting up frontend routing:', err?.message || err);
  }

  // Determine host and port strictly as required by Google Cloud Run:
  // 1. Host MUST strictly be 0.0.0.0 for container ingress
  const host = '0.0.0.0';

  // 2. Port determination:
  // - In AI Studio sandboxed container: Nginx runs on NGINX_PORT (8080) and proxies exclusively to port 3000.
  //   Node server must bind to port 3000 (DEFAULT_APP_PORT).
  // - In standalone environment without Nginx: bind to process.env.PORT.
  const portArgIndex = process.argv.indexOf('--port');
  let targetPort;

  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    targetPort = parseInt(process.argv[portArgIndex + 1], 10);
  } else if (process.env.NGINX_PORT || process.env.DEFAULT_APP_PORT) {
    targetPort = parseInt(process.env.DEFAULT_APP_PORT || '3000', 10);
  } else if (process.env.PORT) {
    targetPort = parseInt(process.env.PORT, 10);
  } else {
    targetPort = 3000;
  }

  // Create single authoritative HTTP server
  const server = http.createServer(app);

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Target port ${targetPort} is occupied.`);
      if (targetPort !== 3000) {
        console.log('Falling back to listener on port 3000...');
        server.listen(3000, host, () => {
          console.log(`🚀 Fallback listener running on http://${host}:3000`);
        });
        return;
      }
    }
    console.error(`Fatal server listener error on port ${targetPort}:`, err.message);
    process.exit(1);
  });

  // Strictly bind single listener to host 0.0.0.0 and targetPort
  server.listen(targetPort, host, () => {
    console.log(`====================================================`);
    console.log(`📡 IT SAATHI Server running in ${process.env.NODE_ENV || 'production'} mode`);
    console.log(`🚀 Strictly bound to: http://${host}:${targetPort}`);
    console.log(`====================================================`);
  });

  // Graceful shutdown handlers for Cloud Run container lifecycle
  const handleShutdown = (signal) => {
    console.log(`Received ${signal}, closing server gracefully...`);
    server.close(() => {
      console.log('HTTP server closed successfully.');
      process.exit(0);
    });
    setTimeout(() => {
      console.warn('Forcefully exiting after timeout');
      process.exit(0);
    }, 5000);
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
