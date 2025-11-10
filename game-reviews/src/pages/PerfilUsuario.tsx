import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface usuario {
  username: string;
  avatarUrl: string;
}

interface post {
  title: string;
  img: string;
  fechaCreacion: string;
  id: number;
  content: string;
  type: string;
  gameName: string;
}

export default function PerfilUsuario() {
  const formateo = (format: string) => {
    const isoString = format;
    const date = new Date(isoString);

    const formatted = date.toLocaleString();
    return formatted;
  };

  const { id } = useParams();

  const [user, setUser] = useState<usuario>();

  const [posts, setPosts] = useState<post[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudo traer al usuario");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
      });
    fetch(`http://localhost:8080/api/posts/user/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudo traer los posts del usuario");
        }
        return res.json();
      })
      .then((data) => {
        setPosts(data);
      });
  }, []);
  return (
    <>
      <div className="flex flex-col gap-4 items-center md:items-left mt-8 bg-red-900 p-8 rounded-lg w-3/4 mx-auto md:w-1/2 text-base md:text-2xl">
        {user ? (
          <div className="flex flex-col items-center">
            <img
              src={`http://localhost:8080/uploads/${encodeURIComponent(
                user.avatarUrl.replace(/^uploads\//, "")
              )}`}
              alt=""
              className=" w-24 h-24 object-cover rounded-full mt-2"
            />
            <h1 className="font-bold">{user.username}</h1>
          </div>
        ) : (
          <p>El usuario no existe</p>
        )}
        {posts ? (
          posts.map((post) => {
            return (
              <li
                key={post.id}
                className="list-none flex flex-col items-center mt-5"
              >
                <Link
                  to={`/post/${post.id}`}
                  state={{
                    image: `http://localhost:8080/uploads/${encodeURIComponent(
                      post.img.replace(/^uploads\//, "")
                    )}`,
                    title: post.title,
                    content: post.content,
                    id_post: post.id,
                  }}
                  className=" flex flex-col items-center"
                >
                  <h1 className="mt-2 text-xl lg:text-5xl">{post.title}</h1>
                  <h3 className="mt-1 text-sm">{post.gameName}</h3>
                  <img
                    src={`http://localhost:8080/uploads/${encodeURIComponent(
                      post.img.replace(/^uploads\//, "")
                    )}`}
                    alt=""
                    className="w-36 h-36 object-cover rounded-full mt-2"
                  />
                  <h3 className="mt-1 text-sm">{post.type}</h3>
                  <p className="text-sm">{formateo(post.fechaCreacion)}</p>
                </Link>
              </li>
            );
          })
        ) : (
          <p>El usuario no existe</p>
        )}
      </div>
    </>
  );
}
