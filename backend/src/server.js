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

  // Determine host and ports strictly as required by Google Cloud Run:
  // Host MUST strictly be 0.0.0.0 for container ingress
  const host = '0.0.0.0';

  // Determine all candidate ports to ensure zero-downtime container readiness:
  // 1. Mandatory Cloud Run port: process.env.PORT (Cloud Run container health check targets this)
  // 2. Command line argument --port (e.g. --port 3000)
  // 3. AI Studio sandboxed container proxy port: DEFAULT_APP_PORT or 3000
  const portsToListen = new Set();

  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const cliPort = parseInt(process.argv[portArgIndex + 1], 10);
    if (!isNaN(cliPort) && cliPort > 0) {
      portsToListen.add(cliPort);
    }
  }

  if (process.env.PORT) {
    const envPort = parseInt(process.env.PORT, 10);
    if (!isNaN(envPort) && envPort > 0) {
      portsToListen.add(envPort);
    }
  }

  if (process.env.DEFAULT_APP_PORT) {
    const defaultPort = parseInt(process.env.DEFAULT_APP_PORT, 10);
    if (!isNaN(defaultPort) && defaultPort > 0) {
      portsToListen.add(defaultPort);
    }
  }

  // Always ensure port 3000 is included for reverse proxy / local ingress
  portsToListen.add(3000);

  const activeServers = [];

  for (const port of portsToListen) {
    const srv = http.createServer(app);

    srv.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`ℹ️ Port ${port} is occupied (e.g. reverse proxy or active listener).`);
        return;
      }
      console.error(`⚠️ Server listener notice on port ${port}:`, err.message);
    });

    try {
      srv.listen(port, host, () => {
        console.log(`====================================================`);
        console.log(`📡 IT SAATHI Server bound to http://${host}:${port}`);
        console.log(`🚀 Mode: ${process.env.NODE_ENV || 'production'}`);
        console.log(`====================================================`);
      });
      activeServers.push(srv);
    } catch (listenErr) {
      console.warn(`⚠️ Could not listen on port ${port}:`, listenErr.message);
    }
  }

  // Graceful shutdown handlers for Cloud Run container lifecycle
  const handleShutdown = (signal) => {
    console.log(`Received ${signal}, closing all HTTP listeners gracefully...`);
    activeServers.forEach((srv) => {
      try {
        srv.close();
      } catch (_) {}
    });
    setTimeout(() => {
      process.exit(0);
    }, 2000).unref();
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
