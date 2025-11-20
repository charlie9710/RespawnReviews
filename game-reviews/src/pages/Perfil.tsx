import { useEffect, useState } from "react";
import Button from "../components/Button";

import { getUserFromToken } from "../contexts/JwtContext";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

interface Usuario {
  id?: number;
  username: string;
  name: string;
  avatarUrl: string;
  phone_number: number;
  email: string;
  password: string;
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

export default function Perfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState<Usuario | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [posts, setPosts] = useState<post[]>([]);

  const [isOpen, setIsOpen] = useState(false);

  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate();

  const formateo = (format: string) => {
    const isoString = format;
    const date = new Date(isoString);

    const formatted = date.toLocaleString();
    return formatted;
  };

  useEffect(() => {
    const json = getUserFromToken();
    if (json == null) return;
    fetch(`http://localhost:8080/api/users/${json.id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener el usuario");
        }
        return res.json();
      })
      .then((data) => {
        setUsuario(data);
        setFormData(data);
      })
      .catch((error) => console.error(error));

    fetch(`http://localhost:8080/api/posts/user/${json.id}`, {
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

  if (!usuario || !formData)
    return (
      <div className="text-center text-2xl w-full my-8">
        <p>Cargando...</p>
      </div>
    );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleGuardar = () => {
    const json = getUserFromToken();
    if (formData.password != null) {
      if (formData.password.length < 6 && formData.password.length > 0) {
        setMensaje("El password debe tener al menos 6 caracteres");
        setIsOpen(true);
        return;
      }
    }
    if (!formData?.id) return;

    if (formData.username == "") {
      setMensaje("No se puede ingresar un usuario vacio.");
      setIsOpen(true);
      return;
    }
    if (formData.name == "") {
      setMensaje("No se puede ingresar un nombre vacio.");
      setIsOpen(true);
      return;
    }

    const formDataToSend = new FormData();
    if (formData.username) formDataToSend.append("username", formData.username);

    if (formData.name) formDataToSend.append("name", formData.name);

    if (formData.phone_number)
      formDataToSend.append("phone_number", formData.phone_number.toString());

    if (formData.email) formDataToSend.append("email", formData.email);
    if (formData.password) formDataToSend.append("password", formData.password);
    if (imageFile) formDataToSend.append("avatar", imageFile);
    if (json == null) return;
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/api/users/${json.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataToSend,
    })
      .then((res) => {
        if (!res.ok) {
          setMensaje("Error al actualizar el perfil");
          setIsOpen(true);
        }
        return res.json();
      })
      .then((data) => {
        setUsuario(data);
        setEditando(false);
        setMensaje("Perfil actualizado");
        setIsOpen(true);
        localStorage.setItem("token", data.token);
        navigate("/");
      })
      .catch((error) => console.error(error));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center md:items-left mt-8 bg-red-900 p-8 rounded-lg w-3/4 mx-auto md:w-1/2 text-base md:text-2xl">
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
      {editando ? (
        <>
          <label className="flex flex-col w-50 lg:w-70">
            <p>Username:</p>
            <input
              className="border px-2 py-1 rounded w-full"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </label>
          <label className="flex flex-col w-50 lg:w-70">
            <p>Nombre:</p>
            <input
              className="border px-2 py-1 rounded w-full"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>

          <label className="flex flex-col w-50 lg:w-70">
            <p>Imagen de perfil</p>
            <input
              className="border px-2 py-1 rounded w-full"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              name="avatar"
            />
            {imagePreview ? (
              <img className="mt-3" src={imagePreview}></img>
            ) : (
              <></>
            )}
          </label>

          <label className="flex flex-col w-50 lg:w-70 ">
            <p>Telefono</p>
            <input
              className="border px-2 py-1 rounded w-full"
              type="number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </label>
          <label className="flex flex-col w-50 lg:w-70">
            <p>Password</p>
            <input
              className="border px-2 py-1 rounded w-full"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>

          <div className="flex gap-4 mt-4">
            <Button onClick={handleGuardar}>Guardar perfil</Button>
            <Button onClick={() => setEditando(false)}>Cancelar</Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-center w-full">
            <div className="flex flex-col items-left w-1/2">
              <p className="my-3">Usario: {usuario.username}</p>
              <p className="my-3">Nombre: {usuario.name}</p>
              <p className="my-3">Email: {usuario.email}</p>
              <p className="my-3">Teléfono: {usuario.phone_number}</p>
              <div className="flex">
                <Button onClick={() => setEditando(true)}>Editar perfil</Button>
              </div>
            </div>
            <div className="flex flex-col items-center w-full md:w-1/2 mt-10 md:mt-0">
              <img
                src={"http://localhost:8080/uploads/" + usuario.avatarUrl}
                className="w-24 h-24 xl:w-32 xl:h-32 ml-4 rounded-full object-cover"
                alt=""
              />
            </div>
          </div>
        </>
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
                <h1 className="mt-2 text-xl lg:text-5xl font-bold">
                  {post.title}
                </h1>
                <h3 className="mt-1 text-sm">{post.gameName}</h3>
                <img
                  src={`http://localhost:8080/uploads/${encodeURIComponent(
                    post.img.replace(/^uploads\//, "")
                  )}`}
                  alt=""
                  className="w-60 h-60 xl:w-120 xl:h-100 object-cover rounded-2xl mt-2"
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
  );
}
