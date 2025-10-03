const { Worker } = require('worker_threads');
const path = require('path');

function createWorker(type, data) {
  let file;
  if (type === 'pdf') file = path.join(__dirname, '../workers/pdfWorker.js');
  else if (type === 'image') file = path.join(__dirname, '../workers/imageWorker.js');
  else throw new Error('Worker type not supported');

  const worker = new Worker(file, { workerData: data });

  worker.on('message', msg => {
    console.log('Worker message:', msg);
  });
  worker.on('error', err => console.error('Worker error:', err));
  worker.on('exit', code => {
    if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
  });
  return worker;
}

module.exports = { createWorker };
