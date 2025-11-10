import { useState, useEffect } from "react";

import { fetchGamesPublish, type Game } from "../api/BuscarJuegos";
import DOMPurify from "dompurify";
import Tiptap from "../components/Tiptap";

import { getUserFromToken } from "../contexts/JwtContext";

export default function Publicar() {
  const [content, setContent] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [mensaje, setMensaje] = useState("");

  const options = ["review", "curiosity", "guide"];

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchTerm.trim().length > 0) {
        searchGames();
      } else {
        setGames([]);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const searchGames = async () => {
    setIsLoading(true);
    try {
      const results = await fetchGamesPublish(searchTerm);
      setGames(results);
      setIsDropdownOpen(true);
    } catch (error) {
      console.error("Error al buscar juegos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    setSearchTerm(game.name);
    setIsDropdownOpen(false);
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

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRating(Number(e.target.value));
  };

  const onClick = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!title.trim()) {
      setMensaje("Porfavor ingresa un título.");
      setIsOpen(true);
      return;
    }

    if (!selectedGame) {
      setMensaje("Porfavor selecciona un juego.");
      setIsOpen(true);
      return;
    }

    if (!selectedOption) {
      setMensaje("Porfavor selecciona un tipo de contenido.");
      setIsOpen(true);
      return;
    }

    if (!content.trim()) {
      setMensaje("Porfavor ingresa el contenido");
      setIsOpen(true);
      return;
    }
    if (rating !== null && (rating < 0 || rating > 10)) {
      setMensaje("Porfavor ingresa un calificación de 0 a 10.");
      setIsOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const sanitizedContent = DOMPurify.sanitize(content, {
        ADD_TAGS: ["iframe"],
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
          /^https:\/\/(www\.youtube\.com|www\.youtube\-nocookie\.com)\/embed\//,
      });
      const userToken = getUserFromToken();
      if (userToken == null) return;
      const form = new FormData();
      form.append("userId", String(userToken.id));
      form.append("title", title);
      form.append("content", sanitizedContent);
      form.append("type", selectedOption);
      form.append("gameId", selectedGame.id.toString());
      form.append("gameName", selectedGame.name);
      form.append("releaseDate", selectedGame.released);
      if (imageFile) {
        form.append("image", imageFile);
      }
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Respuesta del servidor:", errorText);

        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(
            `Error al crear el post: ${errorJson.Error || errorText}`
          );
        } catch {
          throw new Error(`Error al crear el post: ${errorText}`);
        }
      } else {
        if (rating) {
          const formRating = new FormData();
          formRating.append("userId", String(userToken.id));
          formRating.append("score", String(rating));
          formRating.append("gameName", selectedGame.name);
          formRating.append("gameId", selectedGame.id.toString());
          const responseRating = await fetch(
            `http://localhost:8080/api/rating`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formRating,
            }
          );
          if (!responseRating.ok) {
            const errorText = await response.text();
            console.error("Respuesta del servidor:", errorText);

            try {
              const errorJson = JSON.parse(errorText);
              throw new Error(
                `Error al crear el rating: ${errorJson.Error || errorText}`
              );
            } catch {
              throw new Error(`Error al crear el rating: ${errorText}`);
            }
          }
        }
      }

      setMensaje("Post creado exitosamente.");
      setIsOpen(true);

      setTitle("");
      setContent("");
      setSelectedOption("");
      setImagePreview(null);
      setImageFile(null);
      setSelectedGame(null);
      setSearchTerm("");
    } catch (error) {
      console.error("Error al enviar el post:", error);
      setMensaje("Error al crear el post, porfavor intenta denuevo.");
      setIsOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
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
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
          Publica el contenido del juego que quieras!
        </h1>

        <form
          className="rounded-lg shadow-md p-6 md:p-8 bg-red-900"
          onSubmit={onClick}
        >
          {/* Selector de Juego con Buscador */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Buscar Juego *
            </label>

            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.trim().length > 0) {
                    setIsDropdownOpen(true);
                  }
                }}
                onFocus={() => {
                  if (games.length > 0) setIsDropdownOpen(true);
                }}
                placeholder="Busca un juego..."
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-transparent text-gray-300 placeholder-gray-300 focus:outline-none focus:border-gray-300 transition-colors"
              />

              {isLoading && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-transparent rounded-full"></div>
                </div>
              )}

              {/* Dropdown de resultados */}
              {isDropdownOpen && games.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-red-950 border-2 border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                  {games.map((game) => (
                    <div
                      key={game.id}
                      onClick={() => handleGameSelect(game)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0"
                    >
                      <img
                        src={game.background_image}
                        alt={game.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">
                          {game.name}
                        </h3>
                        <p className="text-sm text-white">{game.released}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Juego seleccionado */}
            {selectedGame && (
              <div className="mt-4 p-4 bg-transparent rounded-lg border-2 border-gray-300">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedGame.background_image}
                    alt={selectedGame.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-300 text-lg">
                      {selectedGame.name}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {selectedGame.released}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGame(null);
                      setSearchTerm("");
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Selector de Categoría */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Selecciona el tipo de contenido *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelectedOption(option)}
                  className={`
                    px-4 py-3 rounded-lg border-2 transition-all font-medium
                    ${
                      selectedOption === option
                        ? "border-white text-white"
                        : "border-gray-300 text-gray-300"
                    }
                  `}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col border-gray-300 my-4 gap-2 ">
            <label htmlFor="Title" className="text-gray-300 font-semibold mb-2">
              Ingresa tu titulo *
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              id="Title"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-transparent text-gray-300 placeholder-gray-300 focus:outline-none focus:border-gray-300 transition-colors"
              placeholder="Título del post"
            />
          </div>
          {selectedOption === "review" && (
            <div className=" my-4 gap-2 ">
              <label htmlFor="rating" className="font-semibold text-gray-300">
                Ingresa la calificación
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                id="rating"
                value={rating ?? ""}
                onChange={handleRatingChange}
                placeholder="1-10"
                className="pl-2 ml-2 font-semibold text-gray-300"
              />
            </div>
          )}

          {/* Subida de Imagen */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Imagen de Post
            </label>

            {!imagePreview ? (
              <div className="border-2 border-gray-300 rounded-lg p-8 text-center hover:border-gray-300 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg
                    className="w-12 h-12 text-gray-300 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-gray-300 mb-1">
                    Haz clic para subir una imagen
                  </span>
                  <span className="text-xs text-gray-300">
                    PNG, JPG, GIF hasta 10MB
                  </span>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-gray-300 p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Editor de Contenido */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Contenido *
            </label>
            <Tiptap content={content} onChange={setContent} />
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                bg-red-950 text-white font-semibold px-8 py-3 rounded-lg 
                transition-colors duration-200 shadow-md hover:shadow-lg
                ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-red-900"
                }
              `}
            >
              {isSubmitting ? "Guardando..." : "Guardar Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
