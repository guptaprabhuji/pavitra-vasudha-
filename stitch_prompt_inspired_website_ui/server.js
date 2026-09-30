/**
 * Civic Waste Portal - Local Web Server
 * Zero-dependency Node.js HTTP server.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  // Normalize URL
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Security check: prevent directory traversal
  let safePath = path.normalize(path.join(ROOT_DIR, pathname));
  if (!safePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // Handle directories and root
  if (fs.existsSync(safePath) && fs.statSync(safePath).isDirectory()) {
    safePath = path.join(safePath, 'index.html');
  }

  // If path doesn't have an extension and file doesn't exist, try appending .html
  if (!path.extname(safePath) && !fs.existsSync(safePath)) {
    if (fs.existsSync(safePath + '.html')) {
      safePath = safePath + '.html';
    } else {
      // SPA Fallback: route to index.html
      safePath = path.join(ROOT_DIR, 'index.html');
    }
  }

  // Check file existence
  if (!fs.existsSync(safePath)) {
    // If not found, fallback to index.html for SPA client-side routing
    safePath = path.join(ROOT_DIR, 'index.html');
  }

  const ext = path.extname(safePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(safePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(content);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`======================================================`);
  console.log(`  🌿 पवित्र वसुथा - Integrated Waste Management Portal`);
  console.log(`  🚀 Server is LIVE and listening on:`);
  console.log(`     👉 Local:    http://localhost:${PORT}`);
  console.log(`     👉 Network:  http://127.0.0.1:${PORT}`);
  console.log(`======================================================`);
});
