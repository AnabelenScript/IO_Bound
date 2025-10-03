const productsService = require('../services/products_service');

exports.create = async (req, res, body) => {
  // body: { name, imageBase64 }  -> imageBase64 puede ser grande
  try {
    const { name, imageBase64 } = body || {};
    if (!name || !imageBase64) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Missing name or imageBase64' }));
    }
    const product = await productsService.createProduct(name, imageBase64);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Product created', product }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
};

exports.getImage = async (req, res, id) => {
  try {
    const streamInfo = await productsService.getProductImageStream(id);
    if (!streamInfo) {
      res.writeHead(404);
      return res.end('Not found');
    }
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600'
    });
    streamInfo.stream.pipe(res);
  } catch (err) {
    res.writeHead(500);
    res.end(String(err));
  }
};
