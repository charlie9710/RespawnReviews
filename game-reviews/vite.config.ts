import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://api.rawg.io/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/news": {
        target: "https://newsapi.org/v2",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/news/, ""),
      },
    },
  },
});
