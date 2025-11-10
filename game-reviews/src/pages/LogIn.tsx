import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import GoogleLoginComponent from "../components/GoogleLoginComponent";
import { useNavigate } from "react-router-dom";

export default function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate();

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const onClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      setMensaje("Porfavor completa todos los campos");
      setIsOpen(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        navigate("/");
      } else {
        setMensaje("Error al iniciar sesión");
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error al iniciar sesión");
      setIsOpen(true);
    }
  };

  const changeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const changeUsernamePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="bg-black/50 h-125 w-100 rounded-lg text-white items-center justify-center">
        <h1 className="pt-10 text-center font-bold">LOGIN</h1>
        <div className="px-20 items-center justify-center">
          <form
            action="POST"
            onSubmit={onClick}
            className="flex flex-col items-left"
          >
            <label htmlFor="username" className="mt-10">
              Usuario:
            </label>
            <input
              type="text"
              onChange={changeUsername}
              placeholder="Ingresa tu usuario"
              id="username"
              className="mt-10 p-1"
            />
            <label htmlFor="password" className="mt-10">
              Contraseña:
            </label>
            <input
              type="password"
              onChange={changeUsernamePassword}
              placeholder="Ingresa tu contraseña"
              id="password"
              className="mt-10 p-1"
            />
            <button
              type="submit"
              className="mt-5 mb-5 bg-amber-800 p-2 rounded-md"
            >
              Iniciar sesión
            </button>
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
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleLoginComponent />
            </GoogleOAuthProvider>
          </form>
        </div>
      </div>
    </div>
  );
}
