const stockList = document.getElementById('stock-list');

const socket = io.connect(location.host);
const stocks = ['msft', 'dow', 'amzn'];

const handleSubmit = event => {
	socket.emit('stock', {
		stock: event.target.stock.value
	})
	event.preventDefault();
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


socket.on('stock', data => {
	stockList.innerHTML += `
		<div>
	    <p>${data.stock}</p>
	 	  <button>Remove</button>
	  </div>
	`;
});
