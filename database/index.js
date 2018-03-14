const Promise = require('bluebird');
const db = Promise.promisifyAll(require('mysql2'));
const connection = db.createConnection(process.env.MARIADB_URL || require('../connectionSQL'));
const schemaConstructor = require('./schema');

schemaConstructor(connection);

setInterval(function () {
    connection.query('SELECT 1');
}, 5000);

