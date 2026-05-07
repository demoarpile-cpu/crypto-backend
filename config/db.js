const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: 'crossover.proxy.rlwy.net',
    user: 'root',
    password: 'MvOVbhrwgsGEHJsgNClqWkjdsJRHdVtY',
    database: 'railway',
    port: 14238,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

module.exports = pool;
