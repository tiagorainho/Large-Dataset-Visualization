const baseUrl = "http://127.0.0.1:5500";

let genres = [];
let occupations = [];
let dataset = [];
let ratingsPerGenre = {};

async function fetchGenres() {
  const genresCsv = await (await fetch(`${baseUrl}/dataset/u.genre`)).text();
  let genres = Papa.parse(genresCsv, { header: true }).data.filter(
    (g) => g.name !== "unknown" || g.name === ""
  );
  return genres
}

async function fetchDataset() {
  const moviesCsv = await (await fetch(`${baseUrl}/dataset/u.item`)).text();
  const ratingsCsv = await (await fetch(`${baseUrl}/dataset/u.data`)).text();
  const usersCsv = await (await fetch(`${baseUrl}/dataset/u.user`)).text();
  const genresCsv = await (await fetch(`${baseUrl}/dataset/u.genre`)).text();
  const occupationsCsv = await (await fetch(`${baseUrl}/dataset/u.occupation`)).text();

  movies = Papa.parse(moviesCsv, { header: true }).data;
  ratings = Papa.parse(ratingsCsv, { header: true }).data;
  users = Papa.parse(usersCsv, { header: true }).data;
  genres = Papa.parse(genresCsv, { header: true }).data.filter(
    (g) => g.name !== "unknown" || g.name === ""
  );
  occupations = Papa.parse(occupationsCsv, { header: true }).data.filter((o) => o !== "none");

  for (const rating of ratings) {
    const user = users.find((u) => u.id === rating.user_id);
    const movie = movies.find((m) => m.id === rating.item_id);
    if (!movie) continue;
    const _genres = genres.filter((g) => movie[g.name] === "1");

    dataset.push({
      user,
      movie,
      rating: rating.rating,
      genres: _genres.map((g) => g.name),
    });
  }
}

window.addEventListener("load", async () => {
  await fetchDataset();
  var event = new CustomEvent("dataset-ready");
  document.dispatchEvent(event);
});
