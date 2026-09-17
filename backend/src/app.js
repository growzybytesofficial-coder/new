import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const getDirname = () => {
  try {
    if (typeof __dirname !== 'undefined') return __dirname;
    return path.dirname(fileURLToPath(import.meta.url));
  } catch (_) {
    return process.cwd();
  }
};
const __dirnameResolved = getDirname();


import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimitMiddleware.js';

const app = express();

// Enable trust proxy for express-rate-limit when running behind proxies
app.set('trust proxy', 1);

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Turn off CSP for easy integration with third party APIs in preview
}));

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  process.env.ADMIN_URL || 'http://localhost:3000/admin',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    // and allow all incoming origins in preview / production Cloud Run deployments
    return callback(null, true);
  },
  credentials: true,
}));

// Body Parsers & Cookie Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploads static files
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// Request logging (Morgan)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Backend API Health-check (supports Cloud Run, App Engine, and standard probes)
// Must be registered BEFORE rate limiters to guarantee 100% reliable health responses
app.get(['/health', '/api/health', '/_ah/health', '/_ah/start'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    success: true,
    message: 'IT SAATHI Backend API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Endpoint to download the full project source code as a ZIP archive
app.get(['/download-zip', '/api/download-zip', '/it-saathi-project.zip'], (req, res) => {
  const candidatePaths = [
    path.resolve(process.cwd(), 'dist', 'it-saathi-project.zip'),
    path.resolve(process.cwd(), 'frontend', 'public', 'it-saathi-project.zip'),
    path.resolve(process.cwd(), 'it-saathi-project.zip'),
  ];
  const zipFile = candidatePaths.find((p) => fs.existsSync(p));
  if (zipFile) {
    res.setHeader('Content-Type', 'application/zip');
    res.download(zipFile, 'it-saathi-project.zip');
  } else {
    res.status(404).json({ success: false, message: 'ZIP archive not found' });
  }
});

// Global API rate limiting
app.use('/api', apiLimiter);

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/enquiries', enquiryRoutes);

// Catch-all 404 for unhandled API requests
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found`,
  });
});

// Centralized error handler for all /api endpoints - GUARANTEES JSON responses
app.use('/api', (err, req, res, next) => {
  console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err.message);
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : (err.statusCode || 500);

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
  } else if (err.code === 11000) {
    statusCode = 400;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Setup Full-Stack development / production routing
export const setupFrontendRouting = async (targetApp = app) => {
  // Resolve static directories with robust fallbacks
  const candidateAdminDirs = [
    path.resolve(process.cwd(), 'dist', 'admin'),
    path.resolve(__dirnameResolved, 'admin'),
    path.resolve(__dirnameResolved, '..', 'dist', 'admin'),
    path.resolve(process.cwd(), 'admin', 'dist'),
    path.resolve(process.cwd(), 'admin', 'build'),
  ];
  let adminDist = candidateAdminDirs.find((dir) => fs.existsSync(path.join(dir, 'index.html'))) || candidateAdminDirs[0];

  const candidateFrontendDirs = [
    path.resolve(process.cwd(), 'dist'),
    path.resolve(__dirnameResolved),
    path.resolve(__dirnameResolved, '..', 'dist'),
    path.resolve(process.cwd(), 'frontend', 'dist'),
    path.resolve(process.cwd(), 'frontend', 'build'),
  ];
  let frontendDist = candidateFrontendDirs.find((dir) => fs.existsSync(path.join(dir, 'index.html'))) || candidateFrontendDirs[0];

  const hasFrontendDist = fs.existsSync(path.join(frontendDist, 'index.html'));
  const isBundled = typeof __filename !== 'undefined' && (__filename.includes('dist') || __filename.endsWith('.cjs'));

  // Production condition:
  // 1. Explicitly NODE_ENV === 'production'
  // 2. Bundled CJS executable (dist/server.cjs)
  // 3. Frontend static build exists in dist/
  // 4. Or running in Cloud Run container (K_SERVICE is set)
  const isProduction =
    isBundled ||
    process.env.NODE_ENV === 'production' ||
    hasFrontendDist ||
    Boolean(process.env.K_SERVICE);

  if (!isProduction) {
    console.log('🚀 Setting up Vite development middleware...');
    try {
      const { createServer: createViteServer } = await import('vite');

      // Setup admin Vite middleware at /admin
      const adminVite = await createViteServer({
        root: path.resolve(process.cwd(), 'admin'),
        base: '/admin/',
        server: { 
          middlewareMode: true,
          hmr: false,
          ws: false,
        },
        appType: 'spa',
      });
      targetApp.use('/admin', adminVite.middlewares);

      // Setup frontend Vite middleware
      const vite = await createViteServer({
        root: path.resolve(process.cwd(), 'frontend'),
        server: { 
          middlewareMode: true,
          hmr: false,
          ws: false,
        },
        appType: 'spa',
      });
      targetApp.use(vite.middlewares);
      return;
    } catch (err) {
      console.warn('⚠️ Vite development middleware failed, falling back to static build:', err.message);
    }
  }

  // Serve static production builds
  console.log(`📦 Serving admin build from: ${adminDist}`);
  console.log(`📦 Serving production build from: ${frontendDist}`);
  
  targetApp.use('/admin', express.static(adminDist));
  targetApp.use(express.static(frontendDist));
  
  // Serve admin app for admin paths (/admin and /admin/*)
  targetApp.get(['/admin', '/admin/*'], (req, res) => {
    const adminIndex = path.join(adminDist, 'index.html');
    if (fs.existsSync(adminIndex)) {
      res.sendFile(adminIndex);
    } else {
      res.status(200).send('<!DOCTYPE html><html><head><title>IT SAATHI Admin</title></head><body><div id="root"><h1>IT SAATHI Admin</h1><p>Admin panel initializing...</p></div></body></html>');
    }
  });

  // Serve frontend client for all non-API paths
  targetApp.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health' || req.path.startsWith('/_ah/')) {
      return next();
    }
    const frontendIndex = path.join(frontendDist, 'index.html');
    if (fs.existsSync(frontendIndex)) {
      res.sendFile(frontendIndex);
    } else {
      res.status(200).send('<!DOCTYPE html><html><head><title>IT SAATHI</title></head><body><div id="root"><h1>IT SAATHI</h1><p>Application initializing...</p></div></body></html>');
    }
  });

  // 404 Route handler
  targetApp.use(notFound);

  // Centralized error handler
  targetApp.use(errorHandler);
};

export default app;
