module.exports = async connection => {
  try {
   await connection.connect(); 
  } catch (err) {
    console.log(err);
  }
	
	if(process.env.NODE_ENV !== 'production') {
    await connection.queryAsync('CREATE DATABASE IF NOT EXISTS Stocks');
    await connection.queryAsync('USE Stocks'); 
  }

	await connection.queryAsync(
		`CREATE TABLE IF NOT EXISTS Stocks (
			id INTEGER PRIMARY KEY AUTO_INCREMENT,
			name VARCHAR(255) NOT NULL
		)`
	);

};