const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io');

const app = express();


app.use(express.static('client'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('*', (req, res) => res.redirect('/'));



const server = app.listen(process.env.PORT || 3000);
const io = socket(server);

io.on('connection', socket => {
	console.log('made socket connection', socket.id);

	socket.on('stock', data => {
		io.sockets.emit('stock', data);
	});
});