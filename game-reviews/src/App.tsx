import Header from "./components/Header";
import Footer from "./components/Footer";
import Juegos from "./pages/Analisis";
import Home from "./pages/Home";
import Guias from "./pages/Guias";

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Curiosidades from "./pages/Curiosidades";
import Perfil from "./pages/Perfil";
import Publicar from "./pages/Publicar";
import PublicacionesJuego from "./pages/PublicacionesJuego";
import Post from "./pages/Post";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import PerfilUsuario from "./pages/PerfilUsuario";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/juegos" element={<Juegos />} />
            <Route path="/" element={<Home />} />
            <Route path="/publicar" element={<Publicar />} />
            <Route path="/game/:id" element={<PublicacionesJuego />} />
            <Route path="/Curiosidades" element={<Curiosidades />} />
            <Route path="/Guias" element={<Guias />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/perfilUsuario/:id" element={<PerfilUsuario />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
