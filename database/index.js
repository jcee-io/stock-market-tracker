const Promise = require('bluebird');
const db = Promise.promisifyAll(require('mysql2'));
const connection = db.createConnection(process.env.CLEARDB_DATABASE_URL || require('../connectionSQL'));
const schemaConstructor = require('./schema');

schemaConstructor(connection);

setInterval(function () {
    connection.query('SELECT 1');
}, 5000);

module.exports.getStocks = async () => {
	const data = await connection.queryAsync(`
		SELECT * FROM Stocks
	`);

	return data;
};

module.exports.addStocks = stock => {
	connection.queryAsync(`INSERT INTO Stocks (name) VALUES (?)`, stock);
};

module.exports.removeStocks = stock => {
	connection.queryAsync(`DELETE FROM Stocks WHERE name = ?`, stock);
};