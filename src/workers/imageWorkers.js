const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const { STORAGE } = require('../../config/config');

(async () => {
  try {
    const { id, filename } = workerData;
    const src = path.join(STORAGE.IMAGES, filename);
    const dst = path.join(STORAGE.IMAGES, `thumb-${filename}`);
    if (!fs.existsSync(src)) {
      parentPort.postMessage({ status: 'error', message: 'Source missing' });
      return;
    }
    const buffer = fs.readFileSync(src);
    // Operación simulada: reducir tamaño truncando bytes (no es real thumbnailing)
    const thumb = buffer.slice(0, Math.floor(buffer.length / 2));
    fs.writeFileSync(dst, thumb);
    parentPort.postMessage({ status: 'done', id, thumb: `thumb-${filename}` });
  } catch (err) {
    parentPort.postMessage({ status: 'error', error: String(err) });
  }
})();
