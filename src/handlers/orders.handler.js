const ordersService = require('../services/orders.service');

exports.create = async (req, res, body) => {
  try {
    const { cliente, producto, cantidad } = body || {};
    if (!cliente || !producto || !cantidad) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Missing fields' }));
    }
    const order = await ordersService.createOrder({ cliente, producto, cantidad });
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Order created', order }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
};

exports.export = async (req, res) => {
  try {
    // export as streaming CSV from DB
    res.writeHead(200, {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="orders.csv"'
    });
    // ordersService.streamOrdersCsv writes directly to res
    await ordersService.streamOrdersCsv(res);
  } catch (err) {
    res.writeHead(500);
    res.end(String(err));
  }
};
