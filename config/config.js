module.exports = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  HOST: process.env.HOST || '0.0.0.0',
  STORAGE: {
    IMAGES: './storage/images',
    PDFS: './storage/pdfs',
    LARGE: './storage/large'
  },
  LOG_PATH: './logs/app.log',
  DB: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'panaderia',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }
};
