d3.csv("https://raw.githubusercontent.com/jamesypeng/mids-w209-assignments/master/assignment3/data2.csv", function(error, csv) {
	if (error)
		return console.log("there was an error loading the csv: " + error);
	console.log("there are " + csv.length + " elements in my csv set");


	var dataset = [
		{
			key: "Heart Rate(09-01)",
			area: false,
			values: []
		}, {
			key: "Heart Rate(09-02)",
			area: false,
			values: []
		}, {
			key: "Heart Rate(09-03)",
			area: false,
			values: []
		}
	];

	function act_data(x, y) {
		this.x = x;
		this.y = y;
	}


	// populate the empty object with your data
	csv.forEach(function (d, i) {
		// the + will convertthe string to integer
		dataset[0].values.push(new act_data(i, +d["09-01"]));
		//console.log(dataset[0].values[i])

		dataset[1].values.push(new act_data(i, +d["09-02"]));
		dataset[2].values.push(new act_data(i, +d["09-03"]));
	});


	nv.addGraph(function() {
		var maxY = 160;
		var chart = nv.models.lineWithFocusChart();

		chart.useInteractiveGuideline(true)
			.forceY([0,maxY])
			.brushExtent([ 1, csv.length - 20])
			.height(600)
			.focusHeight(100);

		chart.xAxis
			.axisLabel("Hours of the Day")
			.tickFormat(function(d) {
					return csv[d]["time"];
			});

		chart.x2Axis
			.tickFormat(function(d) {
				return csv[d]["time"];
			});

		chart.yTickFormat(d3.format(',.f'));

		chart.yAxis
			.axisLabel('Heart Rate (bpm)');


		d3.select('#chart svg')
			.datum(dataset)
			.call(chart);

		nv.utils.windowResize(chart.update);

		return chart;
	});

});
