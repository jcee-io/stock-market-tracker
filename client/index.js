const stockList = document.getElementById('stock-list');

const socket = io.connect(location.host);

const handleSubmit = event => {
	socket.emit('stock', {
		stock: event.target.stock.value
	})
	event.preventDefault();
};

socket.on('stock', data => {
	stockList.innerHTML += `
		<div>
	    <p>${data.stock}</p>
	 	  <button>Remove</button>
	  </div>
	`;
});