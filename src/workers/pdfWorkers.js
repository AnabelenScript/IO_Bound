const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const { STORAGE } = require('../../config/config');

(async () => {
  try {
    if (!fs.existsSync(STORAGE.PDFS)) fs.mkdirSync(STORAGE.PDFS, { recursive: true });
    const order = workerData;
    const content = [
      `FACTURA - Pedido #${order.id}`,
      `Cliente: ${order.cliente}`,
      `Producto: ${order.producto}`,
      `Cantidad: ${order.cantidad}`,
      `Fecha: ${order.fecha}`,
      '---',
      'Gracias por su compra.'
    ].join('\n');

    // simulamos PDF escribiendo .pdf con texto (para evitar dependencia)
    const filename = `order-${order.id}.pdf`;
    const filepath = path.join(STORAGE.PDFS, filename);
    // I/O write (sin bloquear el event loop del proceso principal)
    fs.writeFileSync(filepath, content, 'utf8');

    parentPort.postMessage({ status: 'done', file: filename });
  } catch (err) {
    parentPort.postMessage({ status: 'error', error: String(err) });
  }
})();
