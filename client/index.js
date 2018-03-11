const width = 1250;
const height = 750;
const stockList = document.getElementById('stock-list');

const handleSubmit = event => {
	console.log(event.target.stock.value);
	event.preventDefault();
};
