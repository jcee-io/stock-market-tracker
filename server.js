const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const key = process.env.API_KEY || require('./stock-api.js');
const alpha = require('alphavantage')({ key });
const app = express();


app.use(express.static('client'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/weekly/:stock', async (req, res) => {
	const data = await alpha.data.weekly(req.params.stock, null, 6);

	res.send(data);
});

app.get('/api/daily/:stock', async (req, res) => {
	let stopFlag = false;
	console.log(new Date().getMonth());
	const data = await alpha.data.daily(req.params.stock);

	res.send(data['Time Series (Daily)']);
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