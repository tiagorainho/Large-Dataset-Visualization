const visualization = [
  {
    id: "vis1",
    render: renderVisualization1,
  },
  {
    id: "vis2",
    render: renderVisualization2,
  },
  {
    id: "vis3",
    render: renderVisualization3,
  },
  {
    id: "vis4",
    render: renderVisualization4,
  },
];

let activeVisualization = visualization[0];

function setActiveVisualization(index) {
  document.getElementById("d3").innerHTML = "";
  const previousNavItem = document.getElementById(activeVisualization.id);
  previousNavItem.classList.remove("bg-indigo-100", "text-stone-700");
  previousNavItem.classList.add("text-stone-400");

  if (index < visualization.length) {
    activeVisualization = visualization[index];
  }

  const currentNavItem = document.getElementById(activeVisualization.id);
  currentNavItem.classList.remove("text-stone-400");
  currentNavItem.classList.add("bg-indigo-100", "text-stone-700");

  activeVisualization.render();
}

document.addEventListener("dataset-ready", function (e) {
  activeVisualization.render();
});
