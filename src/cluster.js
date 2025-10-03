// multiproceso con cluster (arranca N workers)
const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  const cpus = os.cpus().length;
  console.log(`Master ${process.pid} running — forking ${cpus} workers`);
  for (let i = 0; i < cpus; i++) cluster.fork();

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died (${code}). Forking new worker.`);
    cluster.fork();
  });
} else {
  // cada worker arranca el servidor HTTP
  require('./server');
}
