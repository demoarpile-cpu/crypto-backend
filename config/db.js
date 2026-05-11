const mysql = require('mysql2/promise');
require('dotenv').config();

// Priority: 1. DB_HOST (Manual) 2. MYSQLHOST (Railway Default) 3. Hardcoded Proxy
const pool = mysql.createPool({
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'crossover.proxy.rlwy.net',
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || 'MvOVbhrwgsGEHJsgNClqWkjdsJRHdVtY',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway',
    port: parseInt(process.env.MYSQLPORT) || parseInt(process.env.DB_PORT) || 14238,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

module.exports = pool;
