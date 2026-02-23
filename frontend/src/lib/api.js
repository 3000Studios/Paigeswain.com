const API_BASE = import.meta.env.VITE_API_BASE ?? "";

function buildUrl(path) {
  if (!path.startsWith("/")) {
    return path;
  }
  if (!API_BASE) return path;
  return `${API_BASE.replace(/\/$/, "")}${path}`;
}

async function request(path, options = {}) {
  const url = buildUrl(path);
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return null;
  }

  return response.json();
}

export function getBlog(category) {
  return request(`/api/blog${category ? `?category=${category}` : ""}`);
}

export function getDadJoke() {
  return request("/api/joke");
}

export function getCompliment() {
  return request("/api/compliment");
}

export function getRecipes(latest = false) {
  return request(`/api/recipes${latest ? "/latest" : ""}`);
}

export function publishRecipe(payload) {
  return request("/api/recipes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function uploadRecipeImage(file) {
  const form = new FormData();
  form.append("image", file);
  const response = await fetch(buildUrl("/api/upload"), {
    method: "POST",
    body: form,
    credentials: "include",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to upload");
  }
  return response.json();
}

export function getJournal() {
  return request("/api/journal");
}

export function publishJournal(content) {
  return request("/api/journal", {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export function login(name) {
  return request("/api/login", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function logout() {
  return request("/api/logout", {
    method: "POST",
  });
}

export function getSession() {
  return request("/api/session");
}

export function postScore(game, points) {
  return request("/api/score", {
    method: "POST",
    body: JSON.stringify({ game, points }),
  });
}

export function getLeaderboard() {
  return request("/api/leaderboard");
}

export function sendMessage(message, game = "family") {
  return request("/api/message", {
    method: "POST",
    body: JSON.stringify({ message, game }),
  });
}

export function getMessages(game) {
  return request(`/api/message${game ? `?game=${game}` : ""}`);
}

export function spinWheel() {
  return request("/api/spin", { method: "POST" });
}
