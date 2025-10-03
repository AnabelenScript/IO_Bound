const fs = require('fs');
const path = require('path');
const { STORAGE } = require('../../config/config');

exports.streamFile = (req, res, name) => {
  const filePath = path.join(STORAGE.LARGE, name);
  if (!fs.existsSync(filePath)) {
    res.writeHead(404); return res.end('Not found');
  }
  const stat = fs.statSync(filePath);
  res.writeHead(200, {
    'Content-Type': 'application/octet-stream',
    'Content-Length': stat.size,
    'Accept-Ranges': 'bytes'
  });
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
};
