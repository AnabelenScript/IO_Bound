const db = require('../../config/db');
const path = require('path');
const fileStorage = require('./fileStorage.service');
const workerFactory = require('../utils/workerFactory');
const { STORAGE } = require('../../config/config');

async function createOrder({ cliente, producto, cantidad }) {
  const [result] = await db.query(
    'INSERT INTO orders (cliente, producto, cantidad) VALUES (?, ?, ?)',
    [cliente, producto, cantidad]
  );
  const id = result.insertId;
  const order = { id, cliente, producto, cantidad, fecha: new Date().toISOString() };

  // spawn worker to generate invoice (I/O-bound write)
  workerFactory.createWorker('pdf', order);

  return order;
}

async function streamOrdersCsv(res) {
  // stream rows from DB and pipe CSV lines to res
  const conn = await db.getConnection();
  try {
    const query = conn.queryStream('SELECT id, cliente, producto, cantidad, fecha FROM orders');
    res.write('id,cliente,producto,cantidad,fecha\n');
    query.on('data', row => {
      res.write(`${row.id},"${row.cliente}","${row.producto}",${row.cantidad},"${row.fecha}"\n`);
    });
    query.on('end', () => {
      res.end();
      conn.release();
    });
    query.on('error', err => {
      res.end();
      conn.release();
    });
  } catch (err) {
    conn.release();
    throw err;
  }
}

module.exports = { createOrder, streamOrdersCsv };
