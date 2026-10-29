// Stand-in for your application so the skeleton's tests pass offline on day one.
// Playwright starts it via `webServer` in config/default.ts. Delete this folder (and `webServer`)
// once baseUrl/apiBaseUrl point at your real application.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = Number(process.env.SANDBOX_PORT ?? 4173);
const indexHtml = fs.readFileSync(path.join(import.meta.dirname, 'index.html'));

http
  .createServer((req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(indexHtml);
    } else if (req.url === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ status: 'ok' }));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
    }
  })
  .listen(PORT, () => console.log(`sandbox app listening on http://localhost:${PORT}`));
