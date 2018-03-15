const stockList = document.getElementById('stock-list');

const socket = io.connect(location.host);
let stocks = [];

const initializeStocks = async () => {
	const { data } = await axios.get('/api/stocks');
	stocks = data.stocks;

	for(let stock of stocks) {
		stockList.innerHTML += `
			<div id="${stock}">
		    <p>${stock}</p>
		 	  <button onclick="removeStock(event)" name="${stock}">Remove</button>
		  </div>
		`;
	}
};

const removeStock = event => {
	socket.emit('remove-stock', {
		stock: event.target.name
	});

};

socket.on('remove-stock', async data => {
	const node = $(`#${data.stock}`)[0];
	const line = svg.select(`.${data.stock}`);

	node.remove();
	line.remove();

	const result = await getData(olderDate, timeLength);
	formatYAxis(result.highest);
	formatLines(result.result);
});

const handleSubmit = event => {
	event.preventDefault();

	if(stocks.indexOf(event.target.stock.value) > -1)  {
		event.target.stock.value = '';
		return;
	}

	socket.emit('stock', {
		stock: event.target.stock.value
	})	
	event.target.stock.value = '';
};

const getData = async (timeFrame, timeLength) => {
	const MM = timeFrame.getMonth() + 1;
	const YYYY = timeFrame.getFullYear();
	const DD = timeFrame.getDate();
	const format = `${YYYY}-${MM}-${DD}`;


	if(timeLength[1] === 'Y' || timeLength[0] === '6') {
		var { data } = await axios.get('/api/weekly', { params: {
			format,
			stocks
		}});


	} else {
		var { data } = await axios.get('/api/daily', { params: {
			format,
			stocks
		}});
	}

	return data;
};


socket.on('stock', async data => {
	stockList.innerHTML += `
		<div id="${data.stock}">
	    <p>${data.stock}</p>
	 	  <button onclick="removeStock(event)" name="${data.stock}">Remove</button>
	  </div>
	`;

	stocks.push(data.stock);
	const result = await getData(olderDate, timeLength);
	formatYAxis(result.highest);
	formatLines(result.result);
});
