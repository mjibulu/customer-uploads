import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// APP_PORT defaults to 5173 for local development.
const port = Number(process.env.APP_PORT) || 5173;

const basePath = process.env.BASE_PATH ?? "/";

// API_SERVER_URL defaults to localhost:API_PORT (or 2002).
// Override with API_SERVER_URL if the API is hosted elsewhere.
const apiPort = Number(process.env.API_PORT) || 2002;
const apiServerUrl = process.env.API_SERVER_URL ?? `http://localhost:${apiPort}`;


export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
   
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "../../dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    proxy: {
      "/api": {
        target: apiServerUrl,
        changeOrigin: true,
      },
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});

function isProduction() {
  return process.env.NODE_ENV === "production";
}
