import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [telefono, setTelefono] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const [mensaje, setMensaje] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  var phone = 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    phone = Number(e.target.value);
    setTelefono(phone);
  };
  const onClick = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (username == "") {
      setMensaje("Ingresa un usuario valido");
      setIsOpen(true);
      return;
    }
    if (password == "" || password.length < 6) {
      setMensaje("Ingresa una contraseña mínima de 6 dígitos.");
      setIsOpen(true);
      return;
    }
    if (email == "") {
      setMensaje("Ingresa un email válido");
      setIsOpen(true);
      return;
    }
    if (name == "") {
      setMensaje("Ingresa tu nombre.");
      setIsOpen(true);
      return;
    }
    try {
      const form = new FormData();
      form.append("username", username);
      form.append("name", name);
      form.append("email", email);
      form.append("password", password);

      if (telefono != 0) {
        form.append("phone_number", telefono.toString());
      }
      if (file) {
        form.append("avatarUrl", file);
      }

      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      } else {
        setUsername("");
        setPassword("");
        setEmail("");
        setName("");
        setTelefono(0);
        const result = await response.json();
        login(result.token);
        navigate("/");
      }
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : String(error));
      setIsOpen(true);
    }
  };
  return (
    <div className="flex items-center justify-center mt-20">
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
      <div className="bg-black/50  w-11/12 md:w-1/2 rounded-lg text-white items-center justify-center">
        <h1 className="pt-10 text-center font-bold">REGISTRO</h1>
        <div className="px-20 items-center justify-center">
          <form
            action="POST"
            className="flex flex-col items-left"
            onSubmit={onClick}
          >
            <label htmlFor="username" className="mt-10">
              Usuario:
            </label>
            <input
              type="text"
              placeholder="Ingresa tu nombre de usuario"
              id="username"
              className="mt-5 p-1"
              onChange={handleUsernameChange}
            />
            <label htmlFor="password" className="mt-10">
              Contraseña:
            </label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              id="password"
              className="mt-5 p-1"
              onChange={handlePasswordChange}
            />
            <label htmlFor="email" className="mt-10">
              Email:
            </label>
            <input
              type="email"
              placeholder="Ingresa tu email"
              id="email"
              className="mt-5 p-1"
              onChange={handleEmailChange}
            />
            <label htmlFor="name" className="mt-10">
              Nombre:
            </label>
            <input
              type="text"
              placeholder="Ingresa tu nombre"
              id="name"
              className="mt-5 p-1"
              onChange={handleNameChange}
            />
            <label htmlFor="telefono" className="mt-10">
              Telefono (opcional):
            </label>
            <input
              type="number"
              placeholder="Ingresa tu número"
              id="telefono"
              className="mt-5 p-1"
              onChange={handlePhoneChange}
            />
            <label htmlFor="image" className="mt-10">
              Selecciona una imagen:
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              className="mt-5 p-1"
              onChange={handleFileChange}
            />
            {preview && (
              <div>
                <h4>Vista previa:</h4>
                <img
                  src={preview}
                  alt="preview"
                  style={{
                    width: "200px",
                    marginTop: "10px",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}
            <div className="w-full flex flex-col items-center">
              <button
                type="submit"
                className="mt-5 mb-5 bg-amber-800 p-2 rounded-md lg:w-100 w-50"
              >
                Registrate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
