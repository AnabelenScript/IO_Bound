const url = require('url');
const { StringDecoder } = require('string_decoder');

const productsHandler = require('./handlers/products.handler');
const ordersHandler = require('./handlers/orders.handler');
const externalHandler = require('./handlers/external.handler');
const streamHandler = require('./handlers/stream.handler');

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const decoder = new StringDecoder('utf8');
    let buffer = '';
    req.on('data', chunk => (buffer += decoder.write(chunk)));
    req.on('end', () => {
      buffer += decoder.end();
      if (!buffer) return resolve({});
      try {
        const contentType = (req.headers['content-type'] || '').includes('application/json');
        resolve(contentType ? JSON.parse(buffer) : { raw: buffer });
      } catch (err) {
        reject(err);
      }
    });
  });
}

exports.route = async (req, res) => {
  const parsed = url.parse(req.url, true);
  const path = parsed.pathname.replace(/^\/+|\/+$/g, '');
  const method = req.method.toUpperCase();

  // products
  if (path === 'products' && method === 'POST') {
    const body = await parseBody(req);
    return productsHandler.create(req, res, body);
  }
  if (path.match(/^products\/\d+\/image$/) && method === 'GET') {
    const id = path.split('/')[1];
    return productsHandler.getImage(req, res, id);
  }

  // orders
  if (path === 'orders' && method === 'POST') {
    const body = await parseBody(req);
    return ordersHandler.create(req, res, body);
  }
  if (path === 'orders/export' && method === 'GET') {
    return ordersHandler.export(req, res);
  }

  // external APIs aggregator
  if (path === 'external' && method === 'GET') {
    return externalHandler.aggregate(req, res);
  }

  // streaming large files
  if (path.match(/^stream\/.+$/) && method === 'GET') {
    const name = path.split('/')[1];
    return streamHandler.streamFile(req, res, name);
  }

  // health / metrics
  if ((path === '' || path === 'health') && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok', pid: process.pid }));
  }

  // not found
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
};
