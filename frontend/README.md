# Paige’s Frontend

This folder houses the public sunshine experience powered by Vite + React + Tailwind. It connects to the Worker API through `VITE_API_BASE`.

## Development

1. `npm install`
2. `cp .env.example .env.local` and set `VITE_API_BASE` to your Worker endpoint (for example `https://api.paigeswain.com` during Pages deployment or `http://127.0.0.1:8787` during development).
3. `npm run dev` to launch the interactive frontend with HMR.

## Scripts

- `npm run dev` – starts Vite dev server.
- `npm run build` – produces the production build (output `dist`).
- `npm run lint` – runs the shared ESLint rules.
  
When deploying via Cloudflare Pages, point the build command at `npm run build` and the output directory at `dist`. Ensure `VITE_API_BASE` matches the Worker URL to avoid mixed origins.

## Design notes

- Tailwind configuration lives in `tailwind.config.js` and injects the sunflower palette + typography.
- Component structure: `src/components` for reusable UI, `src/pages/` for the actual screens, `src/lib/api.js` for API helpers, `src/context/AuthContext.jsx` for session state.
- The intro video is referenced from a CDN; replace the `source` URL in `Intro.jsx` with the cinematic `.mp4` file once available.
