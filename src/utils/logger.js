const fs = require('fs');
const { LOG_PATH } = require('../../config/config');

function log(line) {
  const l = `[${new Date().toISOString()}] ${line}\n`;
  fs.appendFile(LOG_PATH, l, () => {});
  // también imprimir en consola
  console.log(l.trim());
}

module.exports = { log };
