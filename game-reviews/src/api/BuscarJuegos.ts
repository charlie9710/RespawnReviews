export interface Game {
  id: number;
  name: string;
  released: string;
  rating: number;
  background_image: string;
}

export async function fetchGames(
  searchParam = "",
  paginaActual: Number,
  paginas: Number
): Promise<Game[]> {
  const clientId = import.meta.env.VITE_APP_RAWG_API_KEY;
  const url =
    searchParam != ""
      ? `https://api.rawg.io/api/games?key=${clientId}&search=${searchParam}
 &ordering=-added&page=${paginaActual}&page_size=${paginas} `
      : `https://api.rawg.io/api/games?key=${clientId}&search_precise=true&search_exact=true&ordering=-added&page=${paginaActual}&page_size=${paginas}}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results;
}

export async function fetchGamesPublish(searchParam = ""): Promise<Game[]> {
  const clientId = import.meta.env.VITE_APP_RAWG_API_KEY;
  const url =
    searchParam != ""
      ? `https://api.rawg.io/api/games?key=${clientId}&search=${searchParam}
 &search_exact=true`
      : `https://api.rawg.io/api/games?key=${clientId}&search_precise=true&search_exact=true&search_exact=true}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results;
}
