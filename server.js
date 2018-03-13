const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const key = process.env.API_KEY || require('./stock-api.js');
const alpha = require('alphavantage')({ key });
const Promise = require('bluebird');

const app = express();


app.use(express.static('client'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/weekly', async (req, res) => {
	const dateLimit = new Date(req.query.format);
	const stockPromises = [];
	const result = {};
	const highs = [];

	for(let stock of req.query.stocks) {
		stockPromises.push(alpha.data.weekly(stock));
	}

	//Weekly Time Series

	const data = await Promise.all(stockPromises);

	for(let dataset of data) {
		const symbol = dataset['Meta Data']['2. Symbol'];
		
		const dates = Object.keys(dataset['Weekly Time Series'])
		  .filter(date => dateLimit < new Date(date))
		  .map(date => {
		  	dataset['Weekly Time Series'][date].date = date;

		  	return dataset['Weekly Time Series'][date];
			});

		console.log(dates);
		const high = Math.max(...dates.map(d => d['2. high'])) || 0; 
		highs.push(high);

		result[symbol] = { high, dates }
	}

	const highest = Math.max(...highs);

	res.send({ highest, result });


});

app.get('/api/daily', async (req, res) => {
	const dateLimit = new Date(req.query.format);
	const stockPromises = [];
	const result = {};
	const highs = [];

	for(let stock of req.query.stocks) {
		stockPromises.push(alpha.data.daily(stock));
	}

	const data = await Promise.all(stockPromises);


	for(let dataset of data) {
		const symbol = dataset['Meta Data']['2. Symbol'];

		
		const dates = Object.keys(dataset['Time Series (Daily)'])
		  .filter(date => dateLimit < new Date(date))
		  .map(date => {
		  	dataset['Time Series (Daily)'][date].date = date;
		  	return dataset['Time Series (Daily)'][date];
			});

		const high = Math.max(...dates.map(d => d['2. high'])) || 0; 
		highs.push(high);

		result[symbol] = { high, dates }
	}

	const highest = Math.max(...highs);

	res.send({ highest, result });
});

app.get('*', (req, res) => res.redirect('/'));



const server = app.listen(process.env.PORT || 3000);
const io = socket(server);

io.on('connection', socket => {
	console.log('made socket connection', socket.id);

	socket.on('stock', data => {
		io.sockets.emit('stock', data);
	});

});