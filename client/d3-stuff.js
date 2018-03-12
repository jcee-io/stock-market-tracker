const width = 1100;
const height = 500;
const padding = 40;



const svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height);



const formatXAxis = (timeExtent, timeFormat) => {
	timeExtent.forEach((d, i) => timeExtent[i] = new Date(d));
	
	svg.selectAll('.x-axis')
	  .remove();

	const timeScale = d3.scaleTime()
	  .domain(timeExtent)
	  .range([padding, width - padding]);

	const xAxis = d3.axisBottom(timeScale)
	  .tickFormat(d3.timeFormat(timeFormat));

	svg.append('g')
		.classed('x-axis', true)
	  .attr('transform', `translate(0, ${height - padding})`)
	  .call(xAxis);
};


const getDate = async event => {
	const now = new Date();
	const timeLength = event ? event.target.textContent.split(' ') : ['1', 'M'];
	const timeValue = Number(timeLength[0]);
	const timeFactor = timeLength[1];

	const thisYear = now.getFullYear();
	const thisMonth = now.getMonth() + 1;
	const thisDate = now.getDate();
	const currentDate = new Date(`${thisMonth} ${thisDate} ${thisYear}`);
	let olderDate;
	let timeFormat = '%b %Y';

	if(timeFactor === 'M') {
		const tempMonth = thisMonth - timeValue;
		const selectedMonth = tempMonth <= 0 ? 12 + tempMonth : tempMonth;
		const selectedYear = tempMonth <= 0 ? thisYear - 1 : thisYear;
		if(timeValue === 1) {
			timeFormat = '%b %d';
		}

		olderDate = new Date(`${selectedMonth} ${thisDate} ${selectedYear}`);
	} else {
		const selectedYear = thisYear - timeValue;
		olderDate = new Date(`${thisMonth} ${thisDate} ${selectedYear}`);
	};


	formatXAxis([olderDate, currentDate], timeFormat);
	getData(olderDate, timeLength);
};

getDate();