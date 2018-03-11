const stockList = document.getElementById('stock-list');

const socket = io.connect(location.host);

const handleSubmit = event => {
	socket.emit('stock', {
		stock: event.target.stock.value
	})
	event.preventDefault();
};

const publishXAxis = (timeExtent, timeFormat) => {
	socket.emit('x-axis', { timeExtent, timeFormat });
};



socket.on('stock', data => {
	stockList.innerHTML += `
		<div>
	    <p>${data.stock}</p>
	 	  <button>Remove</button>
	  </div>
	`;
});

socket.on('x-axis', ({ timeExtent, timeFormat }) => {
	formatXAxis(timeExtent, timeFormat);
});