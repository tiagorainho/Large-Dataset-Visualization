function renderVisualization3(genre = "Action") {
  let width = 600;
  let height = 600;
  const margin = { top: 50, bottom: 20, left: 50, right: 25 };
  const filters = document.createElement("div");
  const select = document.createElement("select");
  const toggle = document.createElement("button");
  const input = document.createElement("input");
  const title = document.createElement("h1");
  let data = getMoviesAverageRatingPerGenre(genre, [0, 10]);

  input.type = "number";
  input.min = 10;
  input.value = 10;
  input.max = 30;
  input.classList.add("bg-gray-100", "border", "border-purple-600", "ml-3", "rounded-md", "w-32");
  title.classList.add("text-gray-900", "text-3xl", "px-8", "pt-4");
  title.innerText = "Movies Average Rating";
  filters.classList.add("absolute", "flex", "right-4", "top-4");
  toggle.classList.add("bg-gray-200", "rounded-md", "px-2");
  select.classList.add("mr-4");
  toggle.innerText = "Descending";

  toggle.onclick = (e) => {
    toggle.innerText = toggle.innerText === "Descending" ? "Ascending" : "Descending";
    data = getMoviesAverageRatingPerGenre(
      select.value,
      [0, input.value],
      toggle.innerText === "Ascending"
    );
    update(data);
  };

  select.onchange = (e) => {
    data = getMoviesAverageRatingPerGenre(
      select.value,
      [0, input.value],
      toggle.innerText === "Ascending"
    );
    update(data);
  };

  input.onchange = (e) => {
    data = getMoviesAverageRatingPerGenre(
      select.value,
      [0, input.value],
      toggle.innerText === "Ascending"
    );
    update(data);
  };

  for (const genre of genres) {
    if (genre.name === "" || genre.name === "unknown") continue;
    const option = document.createElement("option");
    option.value = genre.name;
    option.defaultSelected = genre.name === "Action";
    option.innerHTML = genre.name;
    select.add(option);
  }

  filters.append(select);
  filters.append(toggle);
  filters.append(input);
  document.getElementById("d3").append(title);
  document.getElementById("d3").append(filters);

  const svg = d3
    .select("#d3")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  width = 600 - margin.left - margin.right;
  height = 300 - margin.top - margin.bottom;

  const x = d3.scaleLinear().domain([0, 5]).range([0, width]);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .style("font-size", 4)
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  svg
    .append("text")
    .style("font-size", 8)
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 25)
    .text("Rating");

  const y = d3
    .scaleBand()
    .range([0, height])
    .domain(data.map((d) => d[0].split("(")[0].slice(0, 15)))
    .padding(0.1);

  const yAxis = svg.append("g").style("font-size", 4).call(d3.axisLeft(y));

  const tooltip = d3
    .select("#d3")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("position", "absolute")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  const mouseover = function (event, d) {
    tooltip
      .html(`Movie: ${d[0]} <br> Average Rating: ${Math.floor(d[1] * 100) / 100}`)
      .style("opacity", 1);
    d3.select(this).style("stroke", "black").style("stroke-width", "1px");
  };

  const mousemove = function (event, d) {
    tooltip
      .style("transform", "translateY(-55%)")
      .style("left", event.x / 2 + "px")
      .style("top", event.y / 2 - 30 + "px");
  };

  const mouseleave = function (event, d) {
    tooltip.style("opacity", 0);
    d3.select(this).style("stroke", "none");
  };

  function update(data) {
    svg.selectAll("rect").remove();
    var u = svg.selectAll("rect").data(data);

    y.domain(data.map((d) => d[0].split("(")[0].slice(0, 15)));
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    u.enter()
      .append("rect")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .merge(u)
      .transition()
      .duration(1000)
      .attr("x", x(0))
      .attr("y", (d) => y(d[0].split("(")[0].slice(0, 15)))
      .attr("width", (d) => x(d[1]))
      .attr("height", y.bandwidth())
      .attr("fill", "rgb(99, 102, 241)");
  }

  update(data);
}

function getMoviesAverageRatingPerGenre(genre, filter, ascending = false) {
  const data = {};
  const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

  for (const entry of dataset) {
    if (!entry.genres.includes(genre)) continue;
    data[entry.movie.title] = data[entry.movie.title]
      ? [...data[entry.movie.title], parseInt(entry.rating)]
      : [parseInt(entry.rating)];
  }

  for (const key in data) {
    data[key] = average(data[key]);
  }

  return Object.entries(data)
    .sort((a, b) => (ascending ? a[1] - b[1] : b[1] - a[1]))
    .slice(filter[0], filter[1]);
}
