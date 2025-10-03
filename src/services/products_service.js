const db = require('../../config/db');
const path = require('path');
const fs = require('fs');
const fileStorage = require('./filesStorage_service');
const workerFactory = require('../utils/workerFactory');
const { STORAGE } = require('../../config/config');

async function createProduct(name, imageBase64) {
  // guardar imagen en disco
  const buffer = Buffer.from(imageBase64, 'base64');
  const [result] = await db.query('INSERT INTO products (name) VALUES (?)', [name]);
  const id = result.insertId;
  const filename = `${id}.png`;
  await fileStorage.saveBuffer(STORAGE.IMAGES, filename, buffer);

  // spawn worker to create thumbnail (I/O-bound image manipulation simulated)
  workerFactory.createWorker('image', { id, filename, bufferLength: buffer.length });

  // actualizar path en DB
  await db.query('UPDATE products SET image = ? WHERE id = ?', [filename, id]);
  return { id, name, image: filename };
}

function getProductImageStream(id) {
  return new Promise(async (resolve, reject) => {
    const [rows] = await db.query('SELECT image FROM products WHERE id = ?', [id]);
    if (!rows || rows.length === 0 || !rows[0].image) return resolve(null);
    const stream = fileStorage.readStream(STORAGE.IMAGES, rows[0].image);
    if (!stream) return resolve(null);
    resolve({ stream });
  });
}

module.exports = { createProduct, getProductImageStream };
