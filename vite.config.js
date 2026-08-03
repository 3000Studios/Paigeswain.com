import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  // The restored sunflower experience lives in the legacy frontend source tree.
  // Keep the deployment artifact at the repository root for the Cloudflare Worker.
  root: "frontend",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  plugins: [react()],
  optimizeDeps: {
    entries: ["index.html"],
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    proxy: {
      "/api": "http://127.0.0.1:5000",
    },
  },
})
