const width = 1250;
const height = 750;
const stockList = document.getElementById('stock-list');

const socket = io.connect(location.host);

const handleSubmit = event => {
	
	socket.emit('stock', {
		stock: event.target.stock.value
	})
	event.preventDefault();
};

socket.on('stock', data => {
	stockList.innerHTML += `<p>${data.stock}</p>`
});