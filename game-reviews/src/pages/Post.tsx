import { Link, useLocation } from "react-router-dom";
import DOMPurify from "dompurify";

import "../styles/Post.css";
import { useEffect, useState } from "react";

import { getUserFromToken } from "../contexts/JwtContext";

interface comments {
  id: number;
  text: string;
  createdAt: string;
  userId: number;
  username: string;
  imageUrl: string;
}

export default function Post() {
  const location = useLocation();
  const { image, title, content, id_post } = location.state || {};

  const [comments, setComments] = useState<comments[]>([]);

  const [text, setText] = useState("");

  const [state, setState] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [mensaje, setMensaje] = useState("");

  const formateo = (format: string) => {
    const isoString = format;
    const date = new Date(isoString);

    const formatted = date.toLocaleString();
    return formatted;
  };

  useEffect(() => {
    if (id_post != null) {
      fetch(`http://localhost:8080/api/comment/${id_post}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error("Error al ingresar un comentario");
          }
          const text = await res.text(); // primero obtén el texto
          return text ? JSON.parse(text) : [];
        })
        .then((data) => {
          setComments(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [id_post, state]);

  const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    setText(e.target.value);
  };

  const submitComment = () => {
    const user = getUserFromToken();
    const token = localStorage.getItem("token");
    if (user == null) return;
    const comment = {
      text: text,
      user: { id: user.id },
      post: { id: id_post },
    };

    fetch(`http://localhost:8080/api/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(comment),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al ingresar un commentario");
        }
        return res.json();
      })
      .then(() => {
        setMensaje("Comentario creado");
        setIsOpen(true);
        setText("");
        if (state) {
          setState(false);
        } else {
          setState(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  let fixedContent = (content || "").replace(
    /<img\s+([^>]*?)src=["'](?!https?:\/\/)([^"']+)["']/g,
    `<img $1src="http://localhost:8080/uploads/$2"`
  );

  let safeHTML = DOMPurify.sanitize(fixedContent, {
    ADD_TAGS: ["iframe", "img"],
    ADD_ATTR: [
      "allow",
      "allowfullscreen",
      "frameborder",
      "src",
      "width",
      "height",
      "autoplay",
    ],
    ALLOWED_URI_REGEXP:
      /^(https?:\/\/localhost(:\d+)?\/uploads\/|https:\/\/(www\.youtube\.com|www\.youtube\-nocookie\.com)\/embed\/)/,
  });

  return (
    <>
      <div className="flex flex-col w-3/4 md:w-1/2 rounded-md mx-auto items-center mt-8 bg-red-900 text-center">
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
        <h1 className="font-bold mt-4 md:text-4xl text-2xl">{title}</h1>
        <img
          className="w-full mt-4 object-cover px-4"
          src={image && `${image}`}
          alt=""
        />
        <div
          className="protected-content text-center mt-8 flex flex-col  items-center w-full px-8 py/4  bg-black-1/4 list-with-content "
          dangerouslySetInnerHTML={{ __html: safeHTML }}
        ></div>
      </div>
      <div className="flex flex-col w-3/4 md:w-1/2 rounded-md mx-auto items-center mt-5">
        <textarea
          onChange={handleChangeText}
          placeholder="Agregar un comentario"
          value={text}
          className="w-full min-h-[40px] max-h-[150px] p-2 bg-transparent border-none outline-none resize-none overflow-y-auto rounded-md"
        />
        <button
          onClick={submitComment}
          className="bg-red-950 py-1 px-3 rounded-sm mt-3"
        >
          Agregar
        </button>
      </div>
      {/* Lista de comentarios */}
      <div className="flex flex-col w-3/4 md:w-1/2 rounded-md mx-auto items-start mt-5">
        {comments.length === 0 ? (
          <p className="text-white p-2">Sin comentarios aún</p>
        ) : (
          comments.map((comment) => (
            <li key={comment.id} className="mb-2 text-white list-none p-2">
              <div className="flex flex-row items-start justify-start">
                <Link to={`/perfilUsuario/${comment.userId}`}>
                  <img
                    src={`http://localhost:8080/uploads/${encodeURIComponent(
                      comment.imageUrl.replace(/^uploads\//, "")
                    )}`}
                    alt=""
                    className=" w-12 h-12 object-cover rounded-full mt-2"
                  />
                </Link>
                <div className="flex flex-col ml-5">
                  <strong>{comment.username || "Usuario"}</strong>
                  <h1 className="whitespace-pre-wrap">{comment.text}</h1>
                  <h6 className="text-sm">{formateo(comment.createdAt)}</h6>
                </div>
              </div>
            </li>
          ))
        )}
      </div>
    </>
  );
}
