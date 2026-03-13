# Paige's Corner
This repo holds the monolithic version of the Paige’s Corner experience: a Vite/React front end, a Tiny Express API, and a placeholder Cloudflare worker for quick deployment.

## Structure
- `public/` — static assets that ship with the front end.
- `src/` — React entry points, pages, components, and shared styles.
- `server/` — Express API plus MongoDB bootstrap logic.
- `database/schema/` — schema artifacts you can keep in sync with your Mongo instance.
- `worker/` — Cloudflare worker stub referenced by `wrangler.toml`.

## Getting started
1. `npm install` from the repo root (generates `package-lock.json`).
2. `npm run dev` to launch the Vite dev server.
3. `npm start` to run the Express API on `http://localhost:5000`.
4. `wrangler deploy` once you have a valid Cloudflare account configured.

## Configuration
- Copy `.env.example` to `.env` and set `MONGO_URI`, `PORT`, and any API secrets you need for the Express backend.
- Worker deploys via the root `wrangler.toml` file; update `compatibility_date` and credentials via the Cloudflare CLI login flow.

## Future work
- Hook the Express routes to real models, authentication, and Socket.IO events.
- Enhance the React pages with real content, uploads, and interactions.
- Replace the worker stub with live APIs once the portal is ready for Cloudflare deployment.
