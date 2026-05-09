const mysql = require('mysql2/promise');
require('dotenv').config();

// Priority: 1. DB_HOST (Manual) 2. MYSQLHOST (Railway Default) 3. Hardcoded Proxy
const pool = mysql.createPool({
    host: process.env.DB_HOST || process.env.MYSQLHOST || 'crossover.proxy.rlwy.net',
    user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || 'MvOVbhrwgsGEHJsgNClqWkjdsJRHdVtY',
    database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'railway',
    port: parseInt(process.env.DB_PORT) || parseInt(process.env.MYSQLPORT) || 14238,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

module.exports = pool;
