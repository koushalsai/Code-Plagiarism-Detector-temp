import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath, URL } from "url";
import { cartographer } from "@replit/vite-plugin-cartographer";

const isReplitDev = process.env.NODE_ENV !== "production" && !!process.env.REPL_ID;

export default defineConfig({
  root: fileURLToPath(new URL("./client", import.meta.url)),
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(isReplitDev ? [cartographer()] : []),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./client/src", import.meta.url)),
      "@shared": fileURLToPath(new URL("./shared", import.meta.url)),
      "@assets": fileURLToPath(new URL("./attached_assets", import.meta.url)),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  optimizeDeps: {
    include: ["lucide-react"],
  },
  build: {
    outDir: fileURLToPath(new URL("./dist/public", import.meta.url)),
    emptyOutDir: true,
  },
  server: {
    host: true,
    hmr: {
      clientPort: 443,
    }
  }
});