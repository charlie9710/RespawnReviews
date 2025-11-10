import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import { getUserFromToken } from "../contexts/JwtContext";

const Header = () => {
  const { isAuthenticated } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const json = getUserFromToken();

  const goLogout = () => {
    logout();
  };
  return (
    <header className="bg-rose-600 text-white shadow-md max-w-full mt-8 px-10 rounded-xl mx-5">
      <nav className="containe mx-auto flex flex-col lg:flex-row  justify-between p-4 max-w-full items-center">
        <Link to="/">
          <h1 className="text-xl font-bold text-rose-50 mb-8 md:mb-0">
            Respawn Review
          </h1>
        </Link>
        <ul className="flex flex-col md:flex-row gap-6 text-center list-none !important items-center">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-rose-50 font-semibold " : "hover:text-rose-50 "
              }
            >
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/juegos"
              className={({ isActive }) =>
                isActive ? "text-rose-50 font-semibold " : "hover:text-rose-50 "
              }
            >
              Análisis
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/curiosidades"
              className={({ isActive }) =>
                isActive ? "text-rose-50 font-semibold " : "hover:text-rose-50 "
              }
            >
              Curiosidades
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/guias"
              className={({ isActive }) =>
                isActive ? "text-rose-50 font-semibold " : "hover:text-rose-50 "
              }
            >
              Guías
            </NavLink>
          </li>
          {isAuthenticated && (
            <li>
              <NavLink
                to="/publicar"
                className={({ isActive }) =>
                  isActive
                    ? "text-rose-50 font-semibold "
                    : "hover:text-rose-50 "
                }
              >
                Publicar
              </NavLink>
            </li>
          )}
          {isAuthenticated && (
            <li>
              <NavLink
                to="/perfil"
                className={({ isActive }) =>
                  isActive
                    ? "text-rose-50 font-semibold "
                    : "hover:text-rose-50 "
                }
              >
                Perfil
              </NavLink>
            </li>
          )}
          {isAuthenticated && (
            <li>
              <NavLink
                to="/perfil"
                className={({ isActive }) =>
                  isActive
                    ? "text-rose-50 font-semibold "
                    : "hover:text-rose-50 "
                }
              >
                <img
                  src={`${json.img}`}
                  alt=""
                  className="rounded-full w-15 h-15 object-cover"
                />
              </NavLink>
            </li>
          )}
          {!isAuthenticated && (
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "text-rose-50 font-semibold "
                    : "hover:text-rose-50 "
                }
              >
                Iniciar Sesión
              </NavLink>
            </li>
          )}
          {!isAuthenticated && (
            <li>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive
                    ? "text-rose-50 font-semibold "
                    : "hover:text-rose-50 "
                }
              >
                Registrate
              </NavLink>
            </li>
          )}
          {isAuthenticated && (
            <li
              onClick={() => {
                goLogout();
                navigate("/");
              }}
              className="cursor-pointer hover:text-rose-50"
            >
              Salir
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
