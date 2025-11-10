import { useEffect, useState } from "react";

import { fetchGames, type Game } from "../api/BuscarJuegos";
import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function Curiosidades() {
  const [games, setGames] = useState<Game[]>([]);
  const [query, setQuery] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await fetchGames(query, paginaActual, 10);
    setGames(result);
    setPaginaActual(1);
  };

  useEffect(() => {
    const cargarJuegosConRating = async () => {
      const juegos = await fetchGames(query, paginaActual, 10);

      const juegosConRating = await Promise.all(
        juegos.map(async (game) => {
          try {
            const res = await fetch(
              `http://localhost:8080/api/rating/game/${game.id}`
            );
            if (!res.ok) throw new Error("Sin rating");
            const rating = await res.json();
            return { ...game, rating };
          } catch {
            return { ...game, rating: 0 };
          }
        })
      );

      setGames(juegosConRating);
    };

    cargarJuegosConRating();
  }, [paginaActual, query]);
  const addPage = () => {
    setPaginaActual(paginaActual + 1);
  };
  const deletePage = () => {
    if (paginaActual < 1) return;
    setPaginaActual(paginaActual - 1);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-8">
        <h1 className="title mt-8 font-bold mx-4 fuente-posts-bold">
          Aquí encontrar las curiosidades de tus juegos favoritos!
        </h1>
        <form className="mr-4 flex items-center gap-3" onSubmit={handleSearch}>
          <input
            className="p-2"
            type="text"
            value={query}
            placeholder="Busca tu juego...."
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit">Buscar</Button>
        </form>
        <ul
          className="bg-red-900 w-5/6 lg:w-2/4 flex flex-col items-center p-8 rounded-md"
          style={{ listStyle: "none", padding: 0, marginTop: 2 }}
        >
          {games.map((game) => (
            <li
              key={game.id}
              style={{ marginBottom: "20px", marginTop: "20px" }}
            >
              <Link
                to={`/game/${game.id}`}
                state={{
                  image: game.background_image,
                  name: game.name,
                  type: "curiosity",
                }}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img
                  src={game.background_image}
                  alt={game.name}
                  width="500rem"
                  style={{ borderRadius: "10px" }}
                />
                <h1 className="font-semibold">{game.name}</h1>
                <h1 className="font-semibold font-sm">{game.rating}/10</h1>
              </Link>
            </li>
          ))}
          <div className="flex flex-row items-center justify-center mt-5">
            <button
              onClick={deletePage}
              className="bg-red-950 rounded-xl p-2 m-2"
              disabled={paginaActual === 1}
            >
              Atrás
            </button>
            <span className="font-bold">{paginaActual}</span>
            <button onClick={addPage} className="bg-red-950 rounded-xl p-2 m-2">
              Siguiente
            </button>
          </div>
        </ul>
      </div>
    </>
  );
}
