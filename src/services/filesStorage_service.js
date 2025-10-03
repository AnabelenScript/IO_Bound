const fs = require('fs');
const path = require('path');
const { STORAGE } = require('../../config/config');

class FileStorage {
  ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  async saveBuffer(dir, filename, buffer) {
    this.ensureDir(dir);
    const p = path.join(dir, filename);
    await fs.promises.writeFile(p, buffer);
    return p;
  }

  readStream(dir, filename) {
    const p = path.join(dir, filename);
    if (!fs.existsSync(p)) return null;
    return fs.createReadStream(p);
  }
}

module.exports = new FileStorage();
