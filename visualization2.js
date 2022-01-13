function renderVisualization2() {
  let width = 600;
  let height = 600;
  const margin = { top: 50, bottom: 20, left: 50, right: 25 };
  const title = document.createElement("h1");
  const data = getRatingsAveragePerGenreAndOccupation();
  const label = document.createElement("div");
  const labelBg = document.createElement("div");
  const labelMin = document.createElement("h1");
  const labelMax = document.createElement("h1");

  labelMin.innerText = "2.5";
  labelMax.innerText = "5.0";
  label.classList.add("flex", "ml-8", "mt-4", "items-center");
  labelBg.classList.add(
    "mx-2",
    "w-24",
    "h-8",
    "rounded-md",
    "border",
    "border-gray-800",
    "bg-gradient-to-r",
    "from-[#f7fcf0]",
    "via-[#91d4bd]",
    "to-[#08488a]"
  );
  title.classList.add("text-gray-900", "text-3xl", "px-8", "pt-8");
  title.innerText = "Occupations Average Rating";

  label.append(labelMin);
  label.append(labelBg);
  label.append(labelMax);
  document.getElementById("d3").append(title);
  document.getElementById("d3").append(label);

  const svg = d3
    .select("#d3")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  width = 600 - margin.left - margin.right;
  height = 300 - margin.top - margin.bottom;

  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(occupations.map((o) => o.name))
    .padding(0.01);

  svg
    .append("g")
    .style("font-size", 4)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain")
    .remove();

  svg
    .append("text")
    .style("font-size", 8)
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 20)
    .text("Occupation");

  const y = d3
    .scaleBand()
    .range([height, 0])
    .domain(genres.map((g) => g.name))
    .padding(0.05);

  svg
    .append("text")
    .style("font-size", 8)
    .attr("text-anchor", "end")
    .attr("y", -10)
    .attr("x", 0)
    .text("Genre");

  svg.append("g").style("font-size", 4).call(d3.axisLeft(y).tickSize(0)).select(".domain").remove();

  const color = d3.scaleSequential().interpolator(d3.interpolateGnBu).domain([2.5, 4]);

  const tooltip = d3
    .select("#d3")
    .append("div")
    .style("opacity", 1)
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  const mouseover = function (d) {
    tooltip.style("opacity", 1);
    d3.select(this).style("stroke", "black").style("stroke-width", "1px").style("opacity", 1);
  };

  const mousemove = function (event, d) {
    tooltip
      .html(
        `Occupation: ${d[0].split("$")[0]} <br> Genre: ${d[0].split("$")[1]} <br> Average Rating: ${
          Math.round(d[1] * 100) / 100
        }`
      )
      .style("left", event.x / 2 + "px")
      .style("top", event.y / 2 + "px");
  };

  const mouseleave = function (d) {
    tooltip.style("opacity", 0);
    d3.select(this).style("stroke", "none").style("opacity", 0.8);
  };

  svg
    .selectAll()
    .data(Object.entries(data))
    .enter()
    .append("rect")
    .attr("x", (d) => x(d[0].split("$")[0]))
    .attr("y", (d) => y(d[0].split("$")[1]))
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", (d) => color(d[1]))
    .style("stroke-width", 4)
    .style("stroke", "none")
    .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
}

function getRatingsAveragePerGenreAndOccupation() {
  let data = {};
  const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

  for (const occupation of occupations) {
    for (const genre of genres) {
      data[`${occupation.name}$${genre.name}`] = [];
    }
  }

  for (const entry of dataset) {
    for (const genre of entry.genres) {
      data[`${entry.user.occupation}$${genre}`].push(parseInt(entry.rating));
    }
  }

  for (const key in data) {
    data[key] = average(data[key]);
  }

  return data;
}
