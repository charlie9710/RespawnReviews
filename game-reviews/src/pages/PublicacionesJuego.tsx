import { Link, useLocation, useParams } from "react-router-dom";

import { fetchPosts, type publicacion } from "../api/BuscarPublicacion";
import { useEffect, useState } from "react";

import { getUserFromToken } from "../contexts/JwtContext";

import "../styles/PublicacionesJuego.css";

//Este es el componente para renderizar las reviews de un videojuego en especifico

export default function GameReviews() {
  const { id } = useParams();
  const location = useLocation();
  const { image, name, type } = location.state || {};

  const [score, setScore] = useState<number>(0);

  const [scoreStatic, setScoreStatic] = useState<number>(0);

  const [posts, setPosts] = useState<publicacion[]>([]);

  const [userAuthenthicated, setUserAuthenthicated] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [mensaje, setMensaje] = useState("");

  const changeScore = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScore(Number(e.target.value));
  };

  const onClick = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const userToken = getUserFromToken();
    if (userToken == null) return;
    const formRating = new FormData();
    formRating.append("userId", String(userToken.id));
    formRating.append("score", String(score));
    formRating.append("gameName", name);
    formRating.append("gameId", String(id));

    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/api/rating`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formRating,
    })
      .then((res) => {
        if (!res.ok) {
          setMensaje("Error al ingresar la calificación.");
          setIsOpen(true);
          throw new Error("Error al crear el ingresar el rating");
        }
        return res.json();
      })
      .then((data) => {
        setMensaje("Calificación actualizada.");
        setIsOpen(true);
        setScoreStatic(data.score);
      });
  };

  useEffect(() => {
    const idNumber = parseInt(id || "0", 10);
    const userToken = getUserFromToken();
    if (type && idNumber) {
      fetchPosts(type, idNumber).then((data) => {
        setPosts(data);
      });
      const token = localStorage.getItem("token");
      if (userToken != null) {
        setUserAuthenthicated(true);
        fetch(
          `http://localhost:8080/api/rating/gameuser/${idNumber}?userId=${userToken?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((res) => {
            if (!res.ok) {
              setScore(0);
              setScoreStatic(0);
              return null;
            }

            return res.json();
          })
          .then((data) => {
            if (!data) return;
            setScoreStatic(data.score);
            setScore(data.score);
          })
          .catch((err) => {
            console.error("Error al obtener rating:", err);
            setScore(0);
            setScoreStatic(0);
          });
      }
    }
  }, [id, type]);

  const formateo = (format: string) => {
    const isoString = format;
    const date = new Date(isoString);

    const formatted = date.toLocaleString();
    return formatted;
  };

  return (
    <div className=" flex flex-col items-center mt-8 bg-red-900 w-3/4 mx-auto md:w-1/2 rounded-md ">
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center font-medium">
          <div className="bg-red-900 p-5 rounded flex flex-col justify-center items-center gap-5">
            <p className="text-black">{mensaje}</p>
            <button
              onClick={() => setIsOpen(false)}
              className="text-black bg-rose-600 p-2 rounded-md"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
      <h1 className="font-bold mb-5 mt-5 text-base md:text-2xl lg:text-4xl">
        {type == "review"
          ? "Reseñas de "
          : type == "curiosity"
          ? "Curiosidades de "
          : "Guías de "}
        {name}
      </h1>
      <img
        className="lg:w-2/4 w-5/6"
        src={image}
        alt={name}
        width="600rem"
        style={{ borderRadius: "10px", marginBottom: "20px" }}
      />

      {posts.map((post, index) => (
        <Link
          key={index}
          to={`/post/${post.id}`}
          state={{
            image: `http://localhost:8080/uploads/${encodeURIComponent(
              post.img.replace(/^uploads\//, "")
            )}`,
            title: post.title,
            content: post.content,
            id_post: post.id,
          }}
          className="bg-red-900 p-4 rounded-lg mb-4 flex flex-col items-center lg:w-2/4 w-3/4 my-4 hover:bg-rose-600 transition-colors"
        >
          <h2 className="text-base md:text-3xl font-semibold text-white">
            {post.title}
          </h2>
          <p className="text-xs font-bold">{post.userName}</p>
          {post.img && (
            <img
              src={`http://localhost:8080/uploads/${encodeURIComponent(
                post.img.replace(/^uploads\//, "")
              )}`}
              alt={post.title}
              className=" max-w-60 lg:max-w-90 max-h-60 object-contain rounded-lg mt-2"
            />
          )}
          <div className="flex  items-left mt-1 max-w-60 lg:max-w-90 ">
            <p className="text-xs font-bold text-left">
              {formateo(post.fechaCreacion)}
            </p>
          </div>
        </Link>
      ))}
      {userAuthenthicated ? (
        scoreStatic === 0 ? (
          <div className="flex flex-col items-center mb-2">
            <div className="border-solid border-rose-600 border-1 rounded-2xl p-2">
              <p className="text-white mb-2 text-sm font-light">
                No hay calificación
              </p>
              <form className="rounded-lg pl-4 mb-5" onSubmit={onClick}>
                <input
                  type="number"
                  placeholder="0-10"
                  className="p-1 rounded-md text-white font-light border-none"
                  min="1"
                  max="10"
                  step="0.1"
                  onChange={changeScore}
                />
                <button
                  type="submit"
                  className="bg-red-950 text-white font-light px-2 py-1 ml-2 rounded-lg"
                >
                  Subir
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full mb-2">
            <div className="border-solid border-rose-600 border-1 rounded-2xl p-2">
              <h1 className="text-white mb-2 text-sm font-light">
                Tu calificación: {scoreStatic}
              </h1>
              <form className="rounded-lg pl-4 mb-5 " onSubmit={onClick}>
                <input
                  type="number"
                  value={score}
                  className="p-1 rounded-md text-white border-black font-light"
                  min="1"
                  max="10"
                  step="0.1"
                  onChange={changeScore}
                />
                <button
                  type="submit"
                  className="bg-red-950 text-white font-light px-2 py-1 ml-2 2xl:ml-2 rounded-lg mb-1"
                >
                  Subir
                </button>
              </form>
            </div>
          </div>
        )
      ) : (
        <p></p>
      )}
    </div>
  );
}
