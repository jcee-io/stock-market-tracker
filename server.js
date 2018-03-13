const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const key = process.env.API_KEY || require('./stock-api.js');
const alpha = require('alphavantage')({ key });
const app = express();


app.use(express.static('client'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/weekly', async (req, res) => {
	const dateLimit = new Date(req.query.format);
	const data = await alpha.data.weekly(req.query.stocks);
	const dates = Object.keys(data['Weekly Time Series'])
	  .filter(date => dateLimit < new Date(date))
	  .map(date => ({date,...data['Weekly Time Series'][date]}));
	const high = Math.max(...dates.map(d => d['2. high']));




	console.log(dates);
	res.send({ high, dates });
});

app.get('/api/daily', async (req, res) => {
	const dateLimit = new Date(req.query.format);
	const data = await alpha.data.daily(req.query.stocks);
	const dates = Object.keys(data['Time Series (Daily)'])
	  .filter(date => dateLimit < new Date(date))
	  .map(date => ({date,...data['Time Series (Daily)'][date]}));

	const high = Math.max(...dates.map(d => d['2. high']));

	console.log(dates);	
	res.send({ high, dates });
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