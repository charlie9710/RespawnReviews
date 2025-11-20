import { useEffect, useState } from "react";
import { Noticias, type Noticia } from "../api/NoticiasVideojuegos";
import React from "react";

export default function Home() {
  const [news, setNews] = useState<Noticia[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    Noticias(paginaActual, 10).then(setNews);
  }, [paginaActual]);

  const addPage = () => {
    setPaginaActual(paginaActual + 1);
  };
  const deletePage = () => {
    if (paginaActual < 1) return;
    setPaginaActual(paginaActual - 1);
  };

  return (
    <React.Fragment>
      <ul className=" mx-8 md:mx-40 lg:mx-56 xl:mx-96 bg-red-900 py-8 my-8 rounded-lg">
        {news.map((noticia) => (
          <li
            key={noticia.url + noticia.title}
            className="flex flex-col items-center mt-8 text-center mx-10"
          >
            <a
              href={noticia.url}
              className="flex flex-col items-center"
              target="_blank"
            >
              <img
                src={noticia.urlToImage || "#"}
                alt=""
                className="w-64 rounded-xl hidden md:block md:opacity-100"
              />
              <h1 className="text-2xl font-bold">{noticia.title || ""}</h1>
              <p className="text-justify">{noticia.body || ""}</p>
            </a>
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
    </React.Fragment>
  );
}
