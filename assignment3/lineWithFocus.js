d3.csv("https://raw.githubusercontent.com/jamesypeng/mids-w209-assignments/master/assignment3/data2.csv", function(error, data) {
	console.log(data);

	/**************************************
	 * Simple test data generator
	 */

	// create an empty object that nv is expecting
	var dataset = [
		{
			key: "heart_rate(09-01)",
			values: []
		},
		{
			key: "heart_rate(09-02)",
			values: []
		},
		{
			key: "heart_rate(09-03)",
			values: []
		},

	];
	function act_data(x,y) {
		this.x = x;
		this.y = y;
	}

	//data["0"]["09-01"]

	// populate the empty object with your data
	data.forEach(function (d,i) {
		dataset[0].values.push(new act_data(i, d["09-01"]))
		dataset[1].values.push(new act_data(i, d["09-02"]))
		dataset[2].values.push(new act_data(i, d["09-03"]))
	});


	nv.addGraph(function () {
		var maxY = 170;
		var chart = nv.models.lineWithFocusChart()
			.useInteractiveGuideline(true)
			.focusEnable(false) // disable focus
			.showYAxis(true)
			.forceY([0,maxY]);


		chart.xAxis
			.ticks(20)
			.tickFormat(function(d) {
			    console.log(data[d]["time"]);
		 		return data[d]["time"];
		 	});

		chart.x2Axis
			.ticks(20)
			.tickFormat(function(d) {
				return data[d]["time"];
			});

		chart.yAxis
			.axisLabel('Heart Rate (bpm)')
			.tickFormat(d3.format(',.f'));


		chart.y2Axis
			.tickFormat(d3.format(',.f'));

		d3.select('#chart svg')
			.datum(dataset)
			.transition().duration(500)
			.call(chart);

		nv.utils.windowResize(chart.update);

		return chart;
	});

});
