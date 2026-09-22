const http = require('http');
const fs = require('fs');
const path = require('path');

let PORT = parseInt(process.env.PORT, 10) || 3030;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

function createServer() {
  const server = http.createServer((req, res) => {
    let reqPath = decodeURIComponent(req.url.split('?')[0]);

    // Health check endpoint for container probes and load balancers
    if (reqPath === '/health' || reqPath === '/api/health') {
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        ...SECURITY_HEADERS
      });
      res.end(JSON.stringify({
        status: 'ok',
        service: 'kabod-crest-web',
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
      }));
      return;
    }

    if (reqPath === '/' || reqPath === '') {
      if (fs.existsSync(path.join(PUBLIC_DIR, 'index.html'))) {
        reqPath = '/index.html';
      } else {
        reqPath = '/shop.html';
      }
    }

    const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(PUBLIC_DIR, safePath);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        res.writeHead(404, {
          'Content-Type': 'text/plain; charset=utf-8',
          ...SECURITY_HEADERS
        });
        res.end(`404 Not Found: ${reqPath}`);
        return;
      }

      if (stats.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const isStaticAsset = ['.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.ico'].includes(ext);
      const cacheControl = isStaticAsset
        ? 'public, max-age=86400'
        : 'no-cache, must-revalidate';

      fs.readFile(filePath, (readErr, data) => {
        if (readErr) {
          res.writeHead(500, {
            'Content-Type': 'text/plain; charset=utf-8',
            ...SECURITY_HEADERS
          });
          res.end('500 Internal Server Error');
          return;
        }

        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': cacheControl,
          ...SECURITY_HEADERS
        });
        res.end(data);
      });
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${PORT} in use, trying ${PORT + 1}...`);
      PORT++;
      server.listen(PORT, '127.0.0.1');
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(PORT, '127.0.0.1', () => {
    console.log(`Kabod Crest dev server active at: http://127.0.0.1:${PORT}/shop.html`);
    console.log(`Product detail active at: http://127.0.0.1:${PORT}/product-detail.html?id=dehydrated-ugwu`);
  });
}

createServer();
