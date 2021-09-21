const mysql = require('mysql')
let dbconfig = {
    host: 'localhost',
    user: 'root',
    password: '4msys',
    database: 'bems'
}
const connection = mysql.createConnection(dbconfig);
connection.connect();

const Database = {
    
}
module.exports = Database