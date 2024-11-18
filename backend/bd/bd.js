const mysql = require('mysql2/promise')
const conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'codeux',
    waitForConnections: true,
    password: '',
    queueLimit: 0
})

module.exports = conn