import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// Modulepreload the Home route + shared Nav chunks from index.html, so a
// direct visit to /home fetches them in parallel with the entry bundle
// instead of waiting for React.lazy to discover them after first parse.
function preloadRouteChunks() {
  const wanted = ["src/pages/Home.jsx", "src/components/Nav.jsx"];
  return {
    name: "preload-route-chunks",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        if (!ctx.bundle) return html;
        const tags = [];
        for (const file of Object.values(ctx.bundle)) {
          if (
            file.type === "chunk" &&
            file.facadeModuleId &&
            wanted.some((w) => file.facadeModuleId.endsWith(w))
          ) {
            tags.push({
              tag: "link",
              attrs: { rel: "modulepreload", crossorigin: true, href: `/${file.fileName}` },
              injectTo: "head",
            });
          }
        }
        return tags.length ? { html, tags } : html;
      },
    },
  };
}

export default defineConfig({
  // The restored sunflower experience lives in the legacy frontend source tree.
  // Keep the deployment artifact at the repository root for the Cloudflare Worker.
  root: "frontend",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  plugins: [react(), preloadRouteChunks()],
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
