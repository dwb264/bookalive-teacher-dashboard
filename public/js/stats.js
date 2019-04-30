
function makeChart(data) {
  var margin = {top: 50, right: 50, bottom: 50, left: 50}
    , width = Math.min(1100, window.innerWidth) - margin.left - margin.right // Use the window's width
    , height = 500 - margin.top - margin.bottom; // Use the window's height

  // The number of datapoints
  dataset = [];
  dataset_split = {}; // Dataset split by subject
  console.log(data);
  for(var i in data) {
      console.log(i, data[i]);
      dataset.push([i, data[i]]);

      if (data[i]["subject"] in dataset_split) {
        dataset_split[data[i]["subject"]].push([i, data[i]]);
      } else {
        dataset_split[data[i]["subject"]] = [[i, data[i]]];
      }
  }
  console.log(dataset, dataset_split);

  // 5. X scale will use the index of our data
  var xScale = d3.scaleTime()
      .domain([new Date(dataset[0][0]), new Date(dataset[dataset.length-1][0])]) // input
      .range([0, width]); // output

  // 6. Y scale will use the randomly generate number
  var yScale = d3.scaleLinear()
      .domain([0, 100]) // input
      .range([height, 0]); // output

  // 7. d3's line generator
  var line = d3.line()
      .x(function(d) { return xScale(new Date(d[0])); }) // set the x values for the line generator
      .y(function(d) { return yScale(d[1]["score"]); }) // set the y values for the line generator
      //.curve(d3.curveMonotoneX) // apply smoothing to the line


  // 1. Add the SVG to the page and employ #2
  var svg = d3.select("#stats").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // 3. Call the x axis in a group tag
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

  // 4. Call the y axis in a group tag
  svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

  // 9. Append the path, bind the data, and call the line generator
  Object.keys(dataset_split).forEach(function(subject) {
    svg.append("path")
        .datum(dataset_split[subject]) // 10. Binds data to the line
        .attr("class", "line " + subject) // Assign a class for styling
        .attr("d", line) // 11. Calls the line generator
        .attr("stroke", function() {
          if (subject == "History") {
            return "#ffab00";
          } else if (subject == "Math") {
            return "#f4428f";
          } else if (subject == "Geography") {
            return "#418cf4";
          }
        });
  })


  // 12. Appends a circle for each datapoint
  svg.selectAll(".dot")
      .data(dataset)
    .enter().append("circle") // Uses the enter().append() method
      .attr("class", function(d) { return "dot " + d[1].subject; }) // Assign a class for styling
      .attr("cx", function(d) { return xScale(new Date(d[0])) })
      .attr("cy", function(d) { return yScale(d[1]["score"]) })
      .attr("fill", function(d) {
        if (d[1].subject == "History") {
          return "#ffab00";
        } else if (d[1].subject == "Math") {
          return "#f4428f";
        } else if (d[1].subject == "Geography") {
          return "#418cf4";
        }
      })
      .attr("r", 5)
        .on("mouseover", function(d) {
          details.attr("display", "inline-block");
          details.attr("transform", function() {
            if (xScale(new Date(d[0])) < (width - 250)) {
              return "translate(" + xScale(new Date(d[0])) + "," + yScale(d[1]["score"]) + ")";
            } else {
              return "translate(" + (xScale(new Date(d[0]))-250) + "," + yScale(d[1]["score"]) + ")";
            }
          });

    			module.text("Module: " + d[1]["module"]);
          score.text("Score: " + d[1]["score"]);

          if (d[1]["durationSec"] < 60) {
            duration = d[1]["durationSec"] + "s";
          } else {
            min = parseInt(d[1]["durationSec"] / 60);
            s = d[1]["durationSec"] - (min * 60);
            duration = min + "min " + s + "s"
          }
          timeSpent.text("Time Spent: " + duration);
  		}).on("mouseout", function() {
        details.attr("display", "none");
      })

// Show details about score
  var details = svg.append("g")
    .attr("opacity", 0.8)
    .attr("display", "none")
    .attr("pointer-events", "none");

  details.append("rect")
    .attr("width", 250)
    .attr("height", 110)
    .attr("fill", "#d8d8d8");

  var module = details.append("text")
    .attr("x", 20)
    .attr("y", 30)
    .attr("fill", "#000")
    .attr('font-family', 'Montserrat');

  var score = details.append("text")
    .attr("x", 20)
    .attr("y", 60)
    .attr("fill", "#000")
    .attr('font-family', 'Montserrat');

  var timeSpent = details.append("text")
    .attr("x", 20)
    .attr("y", 90)
    .attr("fill", "#000")
    .attr('font-family', 'Montserrat');


}
