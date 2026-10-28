import express from 'express';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const distPath = path.resolve(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

// Ensure dist directory and index.html exist before starting
if (!fs.existsSync(distPath) || !fs.existsSync(indexPath)) {
  console.log('[Production Server] dist/ not found. Running build automatically...');
  try {
    execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
    console.log('[Production Server] Build completed successfully.');
  } catch (err) {
    console.error('[Production Server] Build failed during startup:', err);
  }
}

// Global security & SEO headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Health check endpoints for Cloud Run & load balancers
app.get(['/healthz', '/_health', '/ping', '/api/health'], (req, res) => {
  res.status(200).send('OK');
});

// Cache control for hashed static assets
app.use('/assets', express.static(path.join(distPath, 'assets'), {
  maxAge: '1y',
  immutable: true
}));

// Serve static assets from dist
app.use(express.static(distPath, {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    } else if (filePath.endsWith('.webp') || filePath.endsWith('.png') || filePath.endsWith('.jpg') || filePath.endsWith('.svg')) {
      res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    }
  }
}));

// Route handler for pre-rendered pages & SPA fallback
app.get('*', (req, res) => {
  const reqPath = req.path.replace(/^\/+|\/+$/g, '');

  if (reqPath) {
    // 1. Check if a directory with index.html exists for this route (e.g. dist/services/index.html)
    const dirIndexPath = path.join(distPath, reqPath, 'index.html');
    if (fs.existsSync(dirIndexPath)) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      return res.sendFile(dirIndexPath);
    }

    // 2. Check if a standalone html file exists (e.g. dist/services.html)
    const fileHtmlPath = path.join(distPath, `${reqPath}.html`);
    if (fs.existsSync(fileHtmlPath)) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      return res.sendFile(fileHtmlPath);
    }
  }

  // 3. Fallback to dist/index.html for client-side routing
  if (fs.existsSync(indexPath)) {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    return res.sendFile(indexPath);
  }

  res.status(404).send('Not Found');
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Production Server] Royal Aesthetic & Laser Clinic serving dist on port ${PORT}`);
});

const handleShutdown = (signal) => {
  console.log(`[Production Server] ${signal} signal received: closing HTTP server`);
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

export default app;
