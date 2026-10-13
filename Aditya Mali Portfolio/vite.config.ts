import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

/**
 * Built-in Backend API Plugin
 * Automatically provides local REST endpoints to permanently store portfolio
 * data in data/portfolio.json and uploaded certificate/profile photos in public/uploads/
 */
function backendApiPlugin(): Plugin {
  return {
    name: 'backend-api-plugin',
    configureServer(server) {
      const rootDir = import.meta.dirname;
      const dataDir = path.resolve(rootDir, 'data');
      const portfolioFile = path.join(dataDir, 'portfolio.json');
      const publicDir = path.resolve(rootDir, 'public');
      const uploadsDir = path.join(publicDir, 'uploads');

      // Ensure folders exist
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
      if (!fs.existsSync(path.join(uploadsDir, 'certificates'))) {
        fs.mkdirSync(path.join(uploadsDir, 'certificates'), { recursive: true });
      }
      if (!fs.existsSync(path.join(uploadsDir, 'photos'))) {
        fs.mkdirSync(path.join(uploadsDir, 'photos'), { recursive: true });
      }

      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();

        // 1. GET /api/portfolio
        if (req.url === '/api/portfolio' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          if (fs.existsSync(portfolioFile)) {
            const data = fs.readFileSync(portfolioFile, 'utf-8');
            res.end(data);
          } else {
            res.end(JSON.stringify(null));
          }
          return;
        }

        // 2. POST /api/portfolio
        if (req.url === '/api/portfolio' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              fs.writeFileSync(portfolioFile, body, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
          return;
        }

        // 3. POST /api/upload
        if (req.url === '/api/upload' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { image, filename = 'upload', folder = 'certificates' } = JSON.parse(body);
              if (!image) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'No image data provided' }));
                return;
              }

              // Extract base64 payload
              const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
              const base64Data = matches ? matches[2] : image;
              const ext = matches && matches[1].includes('png') ? '.png' : '.jpg';

              const cleanName = filename.replace(/[^a-zA-Z0-9_-]/g, '_');
              const targetFolder = path.join(uploadsDir, folder);
              if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

              const hasExt = cleanName.endsWith('.jpg') || cleanName.endsWith('.png') || cleanName.endsWith('.jpeg');
              const finalFileName = `${folder}_${Date.now()}_${cleanName}${hasExt ? '' : ext}`;
              const filePath = path.join(targetFolder, finalFileName);

              fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

              const publicUrl = `/uploads/${folder}/${finalFileName}`;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, url: publicUrl }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
          return;
        }

        // 4. GET /uploads/* -> directly serve uploaded images with proper MIME type headers
        if (req.url.startsWith('/uploads/') && req.method === 'GET') {
          const cleanPath = req.url.split('?')[0];
          const subPath = cleanPath.replace(/^\/uploads\//, '');
          const filePath = path.join(uploadsDir, subPath);

          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes: Record<string, string> = {
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.png': 'image/png',
              '.webp': 'image/webp',
              '.svg': 'image/svg+xml',
              '.gif': 'image/gif',
              '.pdf': 'application/pdf',
            };
            const contentType = mimeTypes[ext] || 'application/octet-stream';

            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), backendApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: {
        ignored: ['**/data/**', '**/public/uploads/**', '**/.env*', '**/dist/**'],
      },
    },
  };
});
