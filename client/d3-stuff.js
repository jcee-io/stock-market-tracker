const width = 1100;
const height = 500;
const padding = 40;



const svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height);



const formatXAxis = (timeExtent, timeFormat) => {
	svg.selectAll('.x-axis')
	  .remove();

	const timeScale = d3.scaleTime()
	  .domain(timeExtent)
	  .range([padding, width - padding]);

	const xAxis = d3.axisBottom(timeScale)
	  .tickFormat(timeFormat);

	svg.append('g')
		.classed('x-axis', true)
	  .attr('transform', `translate(0, ${height - padding})`)
	  .call(xAxis);
};


const getDate = event => {
	const now = new Date();
	const timeLength = event ? event.target.textContent.split(' ') : ['1', 'M'];
	const timeValue = Number(timeLength[0]);
	const timeFactor = timeLength[1];

	const thisYear = now.getFullYear();
	const thisMonth = now.getMonth() + 1;
	const thisDate = now.getDate();
	const currentDate = new Date(`${thisMonth} ${thisDate} ${thisYear}`);
	let olderDate;
	let timeFormat = d3.timeFormat('%b %Y');

	if(timeFactor === 'M') {
		const tempMonth = thisMonth - timeValue;
		const selectedMonth = tempMonth <= 0 ? 12 + tempMonth : tempMonth;
		const selectedYear = tempMonth <= 0 ? thisYear - 1 : thisYear;
		if(timeValue === 1) {
			timeFormat = d3.timeFormat('%b %d')
		}

		olderDate = new Date(`${selectedMonth} ${thisDate} ${selectedYear}`);
	} else {
		const selectedYear = thisYear - timeValue;
		olderDate = new Date(`${thisMonth} ${thisDate} ${selectedYear}`);
	};


	formatXAxis([olderDate, currentDate], timeFormat);
};

getDate();