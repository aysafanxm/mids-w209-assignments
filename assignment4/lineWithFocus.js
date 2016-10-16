d3.csv("https://raw.githubusercontent.com/jamesypeng/mids-w209-assignments/master/assignment3/data2.csv", function(error, csv) {
	if (error)
		return console.log("there was an error loading the csv: " + error);
	console.log("there are " + csv.length + " elements in my csv set");

	var dataset = [
		{
			key: "heart_rate(09-01)",
			area: false,
			values: []
		},
		{
			key: "heart_rate(09-02)",
			area: false,
			values: []
		},
		{
			key: "heart_rate(09-03)",
			area: false,
			values: []
		},

	];

	function act_data(x, y) {
		this.x = x;
		this.y = y;
	}


	// populate the empty object with your data
	csv.forEach(function (d, i) {

		dataset[0].values.push(new act_data(i, +d["09-01"]));
		console.log(dataset[0].values[i])


		dataset[1].values.push(new act_data(i, +d["09-02"]));
		dataset[2].values.push(new act_data(i, +d["09-03"]));
	});


	nv.addGraph(function() {
		var maxY = 170;
		var chart = nv.models.lineWithFocusChart()
						.useInteractiveGuideline(true)
						.forceY([0,maxY]);



		chart.xAxis
			.axisLabel("Hours of the Day")
			.tickFormat(function(d) {
					console.log(csv[d][""]);
					return csv[d]["time"];
			});

		chart.x2Axis.tickFormat(d3.format(',f'));

		chart.yTickFormat(d3.format(',.2f'));

		chart.yAxis
			.axisLabel('Heart Rate (bpm)');


		chart.brushExtent([1,127]);

		d3.select('#chart svg')
			.datum(dataset)
			.call(chart);

		nv.utils.windowResize(chart.update);

		return chart;
	});

/*	function testData() {
		return stream_layers(3,128,100).map(function(data, i) {
			var stream_data = {
				key: 'Stream'+i,
				area: false,  //i == 1, enable the area shade
				values: data
			};
			console.log(stream_data.values);
			stream_data = dataset[i];
			return stream_data;
		});
	}*/
});


/*
d3.csv("https://raw.githubusercontent.com/jamesypeng/mids-w209-assignments/master/assignment3/data2.csv", function(error, csv) {
	if (error)
		return console.log("there was an error loading the csv: " + error);
	console.log("there are " + csv.length + " elements in my csv set");

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

	function act_data(x, y) {
		this.x = x;
		this.y = y;
 }


	// populate the empty object with your data
	csv.forEach(function (d, i) {
		dataset[0].values.push(new act_data(i, d["09-01"]))
		dataset[1].values.push(new act_data(i, d["09-02"]))
		dataset[2].values.push(new act_data(i, d["09-03"]))
	});

	nv.addGraph(function () {

		var maxY = 170;
		var chart = nv.models.lineWithFocusChart()
			        .useInteractiveGuideline(true)
		            .focusEnable(true) // disable focus
		            .showYAxis(true)
		            .margin({bottom: 60})
		            .forceY([0,maxY]);


		 chart.xAxis
		 .axisLabel('Hours of the Day')
		 .tickFormat(function(d) {
		 console.log(csv[d][""]);
		 return csv[d]["time"];
		 });

		 chart.x2Axis
		 .tickFormat(function(d) {
		 return csv[d]["time"];
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


*/
