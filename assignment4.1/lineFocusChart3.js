//    var main_margin = {top: 20, right: 80, bottom: 100, left: 40},
//            mini_margin = {top: 430, right: 80, bottom: 20, left: 40},
//            main_width = 960 - main_margin.left - main_margin.right,
//            main_height = 500 - main_margin.top - main_margin.bottom,
//            mini_height = 500 - mini_margin.top - mini_margin.bottom;

// # 0 - show 0901
// # 1 - show 0902
// # 2 - show both
var show_dates = 2;

var overall_box_height = 600;
var var_mini_box_beight = 120;

var main_margin = {top: 10, right: 40, bottom: var_mini_box_beight - 20, left: 40};
var main_width = 960 - main_margin.left - main_margin.right;
var main_height = overall_box_height - main_margin.top - main_margin.bottom;

var mini_margin = {top: main_height + main_margin.top + 20, right: 40, bottom: 20, left: 40};

var mini_height = (main_height + main_margin.top + main_margin.bottom ) - mini_margin.top - mini_margin.bottom;

var formatDate = d3.time.format("%H:%M"),
	parseDate = formatDate.parse,
	bisectDate = d3.bisector(function (d) {
		return d.time;
	}).left,
	formatOutput0 = function (d) {
		return "09/01 " + formatDate(d.time) + ": " + d.Day0901 + " (bpm)";
	},
	formatOutput1 = function (d) {
		return "09/02 " + formatDate(d.time) + ": " + d.Day0902 + " (bpm)";
	};

var main_x = d3.time.scale()
	.range([0, main_width]),
	mini_x = d3.time.scale()
		.range([0, main_width]);

//    var main_y0 = d3.scale.sqrt()
//            .range([main_height, 0]),
//        main_y1 = d3.scale.sqrt()
//            .range([main_height, 0]),
//        mini_y0 = d3.scale.sqrt()
//                    .range([mini_height, 0]),
//        mini_y1 = d3.scale.sqrt()
//                    .range([mini_height, 0]);


var main_y0 = d3.scale.linear()
	.range([main_height, 0]);
var main_y1 = d3.scale.linear()
	.range([main_height, 0]);

var mini_y0 = d3.scale.linear()
	.range([mini_height, 0]);

var mini_y1 = d3.scale.linear()
	.range([mini_height, 0]);

var main_xAxis = d3.svg.axis()
	.scale(main_x)
	.tickFormat(d3.time.format("%H:%M"))
	.orient("bottom");

var mini_xAxis = d3.svg.axis()
	.scale(mini_x)
	.tickFormat(d3.time.format("%H:%M"))
	.orient("bottom");

var main_yAxisLeft = d3.svg.axis()
	.scale(main_y0)
	.orient("left");

//    main_yAxisRight = d3.svg.axis()
//            .scale(main_y1)
//            .orient("right");

var brush = d3.svg.brush()
	.x(mini_x)
	.on("brush", brush);

var main_line0 = d3.svg.line()
	.interpolate("cardinal")
	.x(function (d) {
		return main_x(d.time);
	})
	.y(function (d) {
		return main_y0(d.Day0901);
	});

var main_line1 = d3.svg.line()
	.interpolate("cardinal")
	.x(function (d) {
		return main_x(d.time);
	})
	.y(function (d) {
		return main_y1(d.Day0902);
	});

var mini_line0 = d3.svg.line()
	.x(function (d) {
		return mini_x(d.time);
	})
	.y(function (d) {
		return mini_y0(d.Day0901);
	});

var mini_line1 = d3.svg.line()
	.x(function (d) {
		return mini_x(d.time);
	})
	.y(function (d) {
		return mini_y1(d.Day0902);
	});

var svg = d3.select("body").append("svg")
	.attr("width", main_width + main_margin.left + main_margin.right)
	.attr("height", main_height + main_margin.top + main_margin.bottom);

svg.append("defs").append("clipPath")
	.attr("id", "clip")
	.append("rect")
	.attr("width", main_width)
	.attr("height", main_height);

var main = svg.append("g")
	.attr("transform", "translate(" + main_margin.left + "," + main_margin.top + ")");

var mini = svg.append("g")
	.attr("transform", "translate(" + mini_margin.left + "," + mini_margin.top + ")");


d3.csv("data2.csv", function (error, data) {
	data.forEach(function (d) {
		d.time = parseDate(d.time);
		d.Day0901 = +d.Day0901;
		d.Day0902 = +d.Day0902;
		d.Day0903 = +d.Day0903;
	});

	data.sort(function (a, b) {
		return a.time - b.time;
	});

	main_x.domain([data[0].time, data[data.length - 1].time]);
	//main_y0.domain(d3.extent(data, function(d) { return d.Day0901; }));
	main_y0.domain([50, 160]);
	//main_y1.domain(d3.extent(data, function(d) { return d.Day0902; }));
	main_y1.domain([50, 160]);

	mini_x.domain(main_x.domain());
//        mini_y0.domain(main_y0.domain());
//        mini_y1.domain(main_y1.domain());
	mini_y0.domain(d3.extent(data, function (d) {
		return d.Day0901;
	}));
	mini_y1.domain(d3.extent(data, function (d) {
		return d.Day0902;
	}));

	main.append("path")
		.datum(data)
		.attr("clip-path", "url(#clip)")
		.attr("class", "line line0")
		.attr("d", main_line0);

	main.append("path")
		.datum(data)
		.attr("clip-path", "url(#clip)")
		.attr("class", "line line1")
		.attr("d", main_line1);

	main.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + main_height + ")")
		.call(main_xAxis);

	main.append("g")
		.attr("class", "y axis axisLeft")
		.call(main_yAxisLeft)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text(" bpm");


	mini.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + mini_height + ")")
		.call(main_xAxis);

	mini.append("path")
		.datum(data)
		.attr("class", "line line0")
		.attr("d", mini_line0);

	mini.append("path")
		.datum(data)
		.attr("class", "line line1")
		.attr("d", mini_line1);

	mini.append("g")
		.attr("class", "x brush")
		.call(brush)
		.selectAll("rect")
		.attr("y", -6)
		.attr("height", mini_height + 7);

	var focus = main.append("g")
		.attr("class", "focus")
		.style("display", "none");


	focus.append("line")
		.attr("class", "x")
		.attr("y1", main_y0(0) - 6)
		.attr("y2", main_y0(0) + 6)


	focus.append("line")
		.attr("class", "y0")
		.attr("x1", main_width - 6)
		.attr("x2", main_width + 6);


	focus.append("line")
		.attr("class", "y1")
		.attr("x1", main_width - 6)
		.attr("x2", main_width + 6);

	focus.append("circle")
		.attr("class", "y0")
		.attr("r", 4);

	focus.append("text")
		.attr("class", "y0")
		.attr("dy", "-1em");

	focus.append("circle")
		.attr("class", "y1")
		.attr("r", 4);

	focus.append("text")
		.attr("class", "y1")
		.attr("dy", "-1em");

	main.append("rect")
		.attr("class", "overlay")
		.attr("width", main_width)
		.attr("height", main_height)
		.on("mouseover", function () {
			focus.style("display", null);
		})
		.on("mouseout", function () {
			focus.style("display", "none");
		})
		.on("mousemove", mousemove);

	function mousemove() {
		var x0 = main_x.invert(d3.mouse(this)[0]),
			i = bisectDate(data, x0, 1),
			d0 = data[i - 1],
			d1 = data[i],
			d = x0 - d0.time > d1.time - x0 ? d1 : d0;
		focus.select("circle.y0").attr("transform", "translate(" + main_x(d.time) + "," + main_y0(d.Day0901) + ")");
		focus.select("text.y0").attr("transform", "translate(" + main_x(d.time) + "," + main_y0(d.Day0901) + ")").text(formatOutput0(d));
		focus.select("circle.y1").attr("transform", "translate(" + main_x(d.time) + "," + main_y1(d.Day0902) + ")");
		focus.select("text.y1").attr("transform", "translate(" + main_x(d.time) + "," + main_y1(d.Day0902) + ")").text(formatOutput1(d));
		focus.select(".x").attr("transform", "translate(" + main_x(d.time) + ",0)");
		focus.select(".y0").attr("transform", "translate(" + main_width * -1 + ", " + main_y0(d.Day0901) + ")").attr("x2", main_width + main_x(d.time));
		focus.select(".y1").attr("transform", "translate(" + main_width * -1 + ", " + main_y0(d.Day0902) + ")").attr("x2", main_width + main_x(d.time));
		//focus.select(".y1").attr("transform", "translate(0, " + main_y1(d.Day0902) + ")").attr("x1", main_x(d.time));
	}

	///////////////////////////////////


//container for all buttons
	var allButtons = svg.append("g")
		.attr("id", "allButtons")

// button labels
	var labels = ['09/01', '09/2', 'Both'];

//colors for different button states
	var defaultColor = "#6ec6e2";  //"#7777BB" //"#5278a5", "#6ec6e2", "#5aa335"
	var hoverColor = "#0000ff";
	var pressedColor = "#000077";

//groups for each button (which will hold a rect and text)
	var buttonGroups = allButtons.selectAll("g.button")
		.data(labels)
		.enter()
		.append("g")
		.attr("class", "button")
		.style("cursor", "pointer")
		.on("click", function (d, i) {
			updateButtonColors(d3.select(this), d3.select(this.parentNode))
			//d3.select("#numberToggle").text(i+1)
			//d3.select("path").select("line line0").remove();
			main.select(".line0").remove();
			main.select(".line1").remove();
			show_dates = i
			if (show_dates == 0) {
				main.select(".line1").remove();

				// draw line0
				main.append("path")
					.datum(data)
					.attr("clip-path", "url(#clip)")
					.attr("class", "line line0")
					.attr("d", main_line0);

			}
			else if (show_dates == 1) {
				//draw line 1

				main.append("path")
					.datum(data)
					.attr("clip-path", "url(#clip)")
					.attr("class", "line line1")
					.attr("d", main_line1);
			}
			else {
				// draw line0 and 1
				main.append("path")
					.datum(data)
					.attr("clip-path", "url(#clip)")
					.attr("class", "line line0")
					.attr("d", main_line0);


				main.append("path")
					.datum(data)
					.attr("clip-path", "url(#clip)")
					.attr("class", "line line1")
					.attr("d", main_line1);


			}


		})
		.on("mouseover", function () {
			if (d3.select(this).select("rect").attr("fill") != pressedColor) {
				d3.select(this)
					.select("rect")
					.attr("fill", hoverColor);
			}
		})
		.on("mouseout", function () {
			if (d3.select(this).select("rect").attr("fill") != pressedColor) {
				d3.select(this)
					.select("rect")
					.attr("fill", defaultColor);
			}
		})

	var bWidth = 40; //button width
	var bHeight = 25; //button height
	var bSpace = 10; //space between buttons
	var x0 = main_width - (bWidth + bSpace) * 2; //x offset
	var y0 = 10; //y offset

//adding a rect to each toggle button group
//rx and ry give the rect rounded corner
	buttonGroups.append("rect")
		.attr("class", "buttonRect")
		.attr("width", bWidth)
		.attr("height", bHeight)
		.attr("x", function (d, i) {
			return x0 + (bWidth + bSpace) * i;
		})
		.attr("y", y0)
		.attr("rx", 5) //rx and ry give the buttons rounded corners
		.attr("ry", 5)
		.attr("fill", defaultColor)

//adding text to each toggle button group, centered
//within the toggle button rect
	buttonGroups.append("text")
		.attr("class", "buttonText")
		.attr("font-family", "FontAwesome")
		.attr("x", function (d, i) {
			return x0 + (bWidth + bSpace) * i + bWidth / 2;
		})
		.attr("y", y0 + bHeight / 2)
		.attr("text-anchor", "middle")
		.attr("dominant-baseline", "central")
		.attr("fill", "white")
		.text(function (d) {
			return d;
		})

	function updateButtonColors(button, parent) {
		parent.selectAll("rect")
			.attr("fill", defaultColor)

		button.select("rect")
			.attr("fill", pressedColor)
	}

//////////////////////////
});

function brush() {
	main_x.domain(brush.empty() ? mini_x.domain() : brush.extent());
	main.select(".line0").attr("d", main_line0);
	main.select(".line1").attr("d", main_line1);
	main.select(".x.axis").call(main_xAxis);
}
