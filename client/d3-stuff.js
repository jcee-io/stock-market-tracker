const width = 1100;
const height = 500;
const padding = 40;
let stockData;
let timeLength;
let timeScale;
let yScale;


const svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height);

const formatXAxis = (timeExtent, timeFormat) => {
	timeExtent.forEach((d, i) => timeExtent[i] = new Date(d));
	
	svg.selectAll('.x-axis')
	  .remove();

	timeScale = d3.scaleTime()
	  .domain(timeExtent)
	  .range([padding, width - padding]);

	const xAxis = d3.axisBottom(timeScale)
	  .tickFormat(d3.timeFormat(timeFormat));

	svg.append('g')
		.classed('x-axis', true)
	  .attr('transform', `translate(0, ${height - padding})`)
	  .call(xAxis);
};

const formatYAxis = (highest = 100) => {
	svg.selectAll('.y-axis')
	  .remove();

	yScale = d3.scaleLinear()
	  .domain([0, highest])
	  .range([height - padding, padding]);

	const yAxis = d3.axisLeft(yScale);

	svg.append('g')
		.classed('y-axis', true)
	  .attr('transform', `translate(${padding}, 0)`)
	  .call(yAxis);
};

const formatLines = (data = []) => {
	for(let symbol in data) {
		const line = d3.line()
		  .x(d => timeScale(new Date(d.date)))
		  .y(d => yScale(d['1. open']));

		svg.select(`.${symbol}`)
		  .remove();

		svg.append('path')
		  .classed(symbol, true)
		  .classed('lines', true)
		  .datum(data[symbol].dates)
		  .attr('fill', 'none')
		  .attr('stroke', 'steelblue')
		  .attr('d', line);
	}
};

const initialize = async event => {
	const now = new Date();
	timeLength = event ? event.target.textContent.split(' ') : ['1', 'M'];
	const timeValue = Number(timeLength[0]);
	const timeFactor = timeLength[1];
	const oldDOMDate = document.getElementById('old-date');
	const thisYear = now.getFullYear();
	const thisMonth = now.getMonth() + 1;
	const thisDate = now.getDate();
	const currentDate = new Date(`${thisMonth} ${thisDate} ${thisYear}`);
	
	let timeFormat = '%b %Y';

	if(timeFactor === 'M') {
		const tempMonth = thisMonth - timeValue;
		const selectedMonth = tempMonth <= 0 ? 12 + tempMonth : tempMonth;
		const selectedYear = tempMonth <= 0 ? thisYear - 1 : thisYear;
		if(timeValue === 1) {
			timeFormat = '%b %d';
		}

		oldDOMDate.textContent = `${selectedMonth}-${thisDate}-${selectedYear}`;
		olderDate = new Date(`${selectedMonth} ${thisDate} ${selectedYear}`);
	} else {
		const selectedYear = thisYear - timeValue;
		oldDOMDate.textContent = `${thisMonth}-${thisDate}-${selectedYear}`;
		olderDate = new Date(`${thisMonth} ${thisDate} ${selectedYear}`);
	};

	formatXAxis([olderDate, currentDate], timeFormat);

	if(stocks.length === 0) {
		await initializeStocks();
	};


	if(stocks.length === 0){
		formatYAxis();
		return;
	}

	const data = await getData(olderDate, timeLength);
	
	formatYAxis(data.highest);
	formatLines(data.result);
};


initialize();
