const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'crossover.proxy.rlwy.net',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'MvOVbhrwgsGEHJsgNClqWkjdsJRHdVtY',
    database: process.env.DB_NAME || 'railway',
    port: parseInt(process.env.DB_PORT) || 14238,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

module.exports = pool;
