const http = require('http');
const fs = require('fs');
const path = require('path');
const router = require('./router');

const port = 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    // Sirve index.html
    const file = fs.readFileSync(path.join(__dirname, 'public/index.html'));
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(file);
  } else if (req.url === '/app.js' && req.method === 'GET') {
    // Sirve app.js
    const file = fs.readFileSync(path.join(__dirname, 'public/app.js'));
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end(file);
  } else {
    // Pasar al router para manejar API REST
    router(req, res);
  }
});

server.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});
