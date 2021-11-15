const http = require('http');

const PORT = 5000;

const ip = 'localhost';

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    if (req.url === '/lower') {
      let data = '';
      req.on('data', chunk => {
        data = data + chunk;
      });
      req.on('end', () => {
        data = data.toLowerCase();
        res.writeHead(201, defaultCorsHeader);
        res.end(data);
      });
    } else if (req.url === '/upper') {
      let data = '';
      req.on('data', chunk => {
        data = data + chunk;
      });
      req.on('end', () => {
        data = data.toUpperCase();
        res.writeHead(201, defaultCorsHeader);
        res.end(data);
      });
    } else {
      res.writeHead(404, defaultCorsHeader);
      res.end();
    }
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(200, defaultCorsHeader);
    res.end();
  }
});

server.listen(PORT, ip, () => {
  console.log(`http server listen on ${ip}:${PORT}`);
});

const defaultCorsHeader = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Access-Control-Max-Age': 10
};
