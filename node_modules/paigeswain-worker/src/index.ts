import type { ExportedHandler, ScheduledEvent } from "@cloudflare/workers-types";

export interface Env {
  DB: D1Database;
  SESSION_KV: KVNamespace;
  RECIPES_BUCKET: R2Bucket;
  R2_PUBLIC_BASE: string;
}

type SessionData = {
  name: string;
  role: string;
  expires: number;
};

const USER_ROLES: Record<string, string> = {
  Dad: "admin",
  Paige: "paige",
  Jerica: "contributor",
  Jadon: "contributor",
};

const DAD_JOKES = [
  "Why did the sunflower blush? It saw the sun undressing.",
  "Dad powered by coffee and bad jokes.",
  "Why was the broom late? It overswept.",
];

const COMPLIMENTS = [
  "Your curiosity is your superpower today.",
  "The world is brighter knowing you keep showing up.",
  "You make the hard days feel a little lighter.",
];

const MENTAL_HEALTH_FEEDS = [
  {
    title: "Family Breathing Garden",
    tone: "calm",
    body:
      "Take five slow breaths together with nighttime tea. Inhale for four, hold for four, exhale for six—then share one thing you are grateful for.",
  },
  {
    title: "Gratitude Anchor Game",
    tone: "hopeful",
    body:
      "Take turns tossing a stuffed animal and naming one memory that made you feel warm this week. Listen to the slow drum in the background and savor the pause.",
  },
  {
    title: "Daily Reset Journal Prompt",
    tone: "soft",
    body:
      "What was one moment that made you smile today and why? Write it down, doodle a sunbeam next to it, then fold the page into a little surprise for tomorrow.",
  },
];

const HEALTHY_FEEDS = [
  {
    title: "Sunrise Smoothie Bash",
    tone: "cheerful",
    body: "Blend spinach, banana, mango, and a splash of coconut water. Top with crunchy seeds and serve with a little paper flag.",
  },
  {
    title: "Budget Rainbow Bowls",
    tone: "practical",
    body: "Roast whatever veggies are in the crisper, add toasted chickpeas, and drizzle herb yogurt. Every color tastes better with music.",
  },
  {
    title: "Snack Station Shuffle",
    tone: "playful",
    body: "Arrange labeled jars: nuts, apple slices, carrot smiles, popcorn. Everyone gets a sticker when they build a mini masterpiece.",
  },
];

const PRIZES = [
  "Pick Dinner",
  "Movie Night",
  "No Chores Pass",
  "$5 Treat",
  "Bonus 200 Points",
  "Mystery Surprise",
];

const JSON_HEADERS = {
  "content-type": "application/json",
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true",
};

function jsonResponse(
  payload: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {},
) {
  const headers = new Headers({
    ...JSON_HEADERS,
    ...CORS_HEADERS,
  });
  Object.entries(extraHeaders).forEach(([key, value]) => headers.set(key, value));
  return new Response(JSON.stringify(payload), { status, headers });
}

function errorResponse(message: string, status = 400) {
  return jsonResponse({ error: message }, status);
}

function parseCookies(cookieHeader?: string) {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((chunk) => chunk.trim().split("="))
      .map(([key, ...rest]) => [key, rest.join("=")]),
  );
}

function randomItem<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildRecipeUrl(key: string | null | undefined, env: Env) {
  if (!key) return null;
  if (env.R2_PUBLIC_BASE) {
    return `${env.R2_PUBLIC_BASE}/${encodeURIComponent(key)}`;
  }
  return key;
}

async function loadSession(request: Request, env: Env): Promise<SessionData | null> {
  const cookies = parseCookies(request.headers.get("cookie") ?? request.headers.get("Cookie") ?? undefined);
  const token = cookies.session;
  if (!token) return null;
  const stored = await env.SESSION_KV.get(token);
  if (!stored) return null;
  try {
    const parsed: SessionData = JSON.parse(stored);
    if (Date.now() > parsed.expires) {
      await env.SESSION_KV.delete(token);
      return null;
    }
    return { ...parsed, expires: parsed.expires };
  } catch {
    await env.SESSION_KV.delete(token);
    return null;
  }
}

async function createSession(name: string, role: string, env: Env) {
  const token = crypto.randomUUID();
  const expires = Date.now() + 86400 * 1000;
  const record: SessionData = { name, role, expires };
  await env.SESSION_KV.put(token, JSON.stringify(record), { expirationTtl: 86400 });
  await env.DB.prepare(
    "INSERT INTO sessions (token, name, role, expires) VALUES (?, ?, ?, ?)",
  )
    .bind(token, name, role, expires)
    .run();
  return { token, record };
}

async function deleteSession(request: Request, env: Env) {
  const cookies = parseCookies(request.headers.get("cookie") ?? request.headers.get("Cookie") ?? undefined);
  const token = cookies.session;
  if (token) {
    await env.SESSION_KV.delete(token);
    await env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
  }
}

async function handleLogin(request: Request, env: Env) {
  if (request.method !== "POST") return errorResponse("Method not allowed", 405);
  let payload: { name?: string } = {};
  try {
    payload = await request.json();
  } catch {
    return errorResponse("Invalid payload");
  }
  const { name } = payload;
  if (!name || typeof name !== "string" || !(name in USER_ROLES)) {
    return errorResponse("Unknown user", 401);
  }
  const role = USER_ROLES[name];
  const { token, record } = await createSession(name, role, env);
  const cookie = `session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`;
  return jsonResponse(
    {
      success: true,
      user: {
        name,
        role,
      },
    },
    200,
    {
      "Set-Cookie": cookie,
    },
  );
}

async function handleBlog(request: Request, env: Env) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  let builder = env.DB.prepare(
    "SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT 50",
  );
  if (category) {
    builder = env.DB.prepare(
      "SELECT * FROM blog_posts WHERE category = ? ORDER BY created_at DESC LIMIT 25",
    ).bind(category);
  }
  const { results = [] } = await builder.all();
  return jsonResponse(
    results.map((row) => ({
      ...row,
      category: row.category ?? category ?? "sunshine",
    })),
  );
}

async function handleRecipes(request: Request, env: Env) {
  const url = new URL(request.url);
  if (url.pathname.endsWith("/latest")) {
    const { results = [] } = await env.DB.prepare(
      "SELECT * FROM recipes ORDER BY created_at DESC LIMIT 1",
    ).all();
    const next = results[0];
    if (!next) {
      return jsonResponse([]);
    }
    return jsonResponse([
      {
        ...next,
        image_url: buildRecipeUrl(next.image_url, env),
      },
    ]);
  }
  const { results = [] } = await env.DB.prepare(
    "SELECT * FROM recipes ORDER BY created_at DESC LIMIT 10",
  ).all();
  return jsonResponse(
    results.map((row) => ({
      ...row,
      image_url: buildRecipeUrl(row.image_url, env),
    })),
  );
}

async function handleJournal(request: Request, env: Env) {
  if (request.method === "GET") {
    const { results = [] } = await env.DB.prepare(
      "SELECT * FROM journal ORDER BY created_at DESC LIMIT 8",
    ).all();
    return jsonResponse(results);
  }
  if (request.method === "POST") {
    const session = await loadSession(request, env);
    if (!session || (session.role !== "paige" && session.role !== "admin")) {
      return errorResponse("Unauthorized", 401);
    }
    const body = await request.json().catch(() => null);
    if (!body || typeof body.content !== "string") {
      return errorResponse("Journal content required");
    }
    await env.DB.prepare(
      "INSERT INTO journal (content) VALUES (?)",
    )
      .bind(body.content)
      .run();
    return jsonResponse({ success: true });
  }
  return errorResponse("Method not allowed", 405);
}

async function handleRecipePost(request: Request, env: Env) {
  if (request.method !== "POST") return errorResponse("Method not allowed", 405);
  const session = await loadSession(request, env);
  if (!session || (session.role !== "paige" && session.role !== "admin")) {
    return errorResponse("Unauthorized", 401);
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== "string") {
    return errorResponse("Recipe title required");
  }
  await env.DB.prepare(
    "INSERT INTO recipes (title, ingredients, instructions, image_url) VALUES (?, ?, ?, ?)",
  )
    .bind(
      body.title,
      body.ingredients || null,
      body.instructions || null,
      body.image_url || null,
    )
    .run();
  return jsonResponse({ success: true });
}

async function handleScore(request: Request, env: Env) {
  if (request.method !== "POST") return errorResponse("Method not allowed", 405);
  const session = await loadSession(request, env);
  if (!session) return errorResponse("Unauthorized", 401);
  const payload = await request.json().catch(() => null);
  if (
    !payload ||
    typeof payload.points !== "number" ||
    typeof payload.game !== "string"
  ) {
    return errorResponse("Invalid score payload");
  }
  const points = Math.max(0, Math.round(payload.points));
  await env.DB.prepare(
    "INSERT INTO scores (user, game, points) VALUES (?, ?, ?)",
  )
    .bind(session.name, payload.game, points)
    .run();
  await env.DB.prepare(
    "INSERT INTO weekly_totals (user, total_points) VALUES (?, ?) ON CONFLICT(user) DO UPDATE SET total_points = total_points + ?",
  )
    .bind(session.name, points, points)
    .run();
  return jsonResponse({ success: true });
}

async function handleLeaderboard(env: Env) {
  const { results = [] } = await env.DB.prepare(
    "SELECT * FROM weekly_totals ORDER BY total_points DESC LIMIT 10",
  ).all();
  return jsonResponse(results);
}

async function handleSpin(request: Request, env: Env) {
  if (request.method !== "POST") return errorResponse("Method not allowed", 405);
  const session = await loadSession(request, env);
  if (!session) return errorResponse("Unauthorized", 401);
  const { results = [] } = await env.DB.prepare(
    "SELECT user FROM weekly_totals ORDER BY total_points DESC LIMIT 1",
  ).all();
  if (!results.length || results[0].user !== session.name) {
    return errorResponse("Not eligible", 403);
  }
  const reward = randomItem(PRIZES);
  return jsonResponse({ reward });
}

async function handleMessages(request: Request, env: Env) {
  if (request.method === "GET") {
    const url = new URL(request.url);
    const game = url.searchParams.get("game");
    const builder = game
      ? env.DB.prepare(
          "SELECT * FROM game_messages WHERE game = ? ORDER BY created_at DESC LIMIT 30",
        ).bind(game)
      : env.DB.prepare(
          "SELECT * FROM game_messages ORDER BY created_at DESC LIMIT 30",
        );
    const { results = [] } = await builder.all();
    return jsonResponse(results);
  }
  if (request.method === "POST") {
    const session = await loadSession(request, env);
    if (!session) return errorResponse("Unauthorized", 401);
    const payload = await request.json().catch(() => null);
    if (!payload || typeof payload.message !== "string") {
      return errorResponse("Message required");
    }
    await env.DB.prepare(
      "INSERT INTO game_messages (user, game, message) VALUES (?, ?, ?)",
    )
      .bind(session.name, payload.game ?? "family", payload.message)
      .run();
    return jsonResponse({ success: true });
  }
  return errorResponse("Method not allowed", 405);
}

async function handleUpload(request: Request, env: Env) {
  if (request.method !== "POST") return errorResponse("Method not allowed", 405);
  const session = await loadSession(request, env);
  if (!session || session.role !== "paige") return errorResponse("Unauthorized");
  const form = await request.formData();
  const file = form.get("image");
  if (!(file instanceof File)) {
    return errorResponse("Image file is required");
  }
  const key = `recipes/${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-")}`;
  await env.RECIPES_BUCKET.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type || "application/octet-stream",
    },
  });
  return jsonResponse({
    key,
    image_url: buildRecipeUrl(key, env),
  });
}

async function handleCompliment() {
  return jsonResponse({
    compliment: randomItem(COMPLIMENTS),
  });
}

async function handleDadJoke() {
  return jsonResponse({
    joke: randomItem(DAD_JOKES),
  });
}

async function seedWeeklyBlog(env: Env) {
  for (const entry of MENTAL_HEALTH_FEEDS) {
    await env.DB.prepare(
      "INSERT INTO blog_posts (category, title, content, tone) VALUES (?, ?, ?, ?)",
    )
      .bind("mental-health", entry.title, entry.body, entry.tone)
      .run();
  }
  for (const entry of HEALTHY_FEEDS) {
    await env.DB.prepare(
      "INSERT INTO blog_posts (category, title, content, tone) VALUES (?, ?, ?, ?)",
    )
      .bind("healthy-food", entry.title, entry.body, entry.tone)
      .run();
  }
}

async function scheduledHandler(event: ScheduledEvent, env: Env) {
  if (event.cron?.includes("0 4 * * 0")) {
    await seedWeeklyBlog(env);
  }
  if (event.cron?.includes("0 5 * * 0")) {
    await env.DB.prepare("DELETE FROM weekly_totals").run();
    await env.DB.prepare("DELETE FROM scores").run();
  }
}

const handler: ExportedHandler<Env> = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
      return new Response(null, {
        status: 204,
        headers: {
          ...CORS_HEADERS,
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }
    if (url.pathname === "/api/login") {
      return handleLogin(request, env);
    }
    if (url.pathname === "/api/logout") {
      await deleteSession(request, env);
      return jsonResponse({ success: true });
    }
    if (url.pathname === "/api/session") {
      const session = await loadSession(request, env);
      return jsonResponse({ session });
    }
    if (url.pathname.startsWith("/api/blog")) {
      return handleBlog(request, env);
    }
    if (url.pathname.startsWith("/api/recipes")) {
      if (request.method === "POST") {
        return handleRecipePost(request, env);
      }
      return handleRecipes(request, env);
    }
    if (url.pathname === "/api/journal") {
      return handleJournal(request, env);
    }
    if (url.pathname === "/api/score") {
      return handleScore(request, env);
    }
    if (url.pathname === "/api/leaderboard") {
      return handleLeaderboard(env);
    }
    if (url.pathname === "/api/spin") {
      return handleSpin(request, env);
    }
    if (url.pathname === "/api/message") {
      return handleMessages(request, env);
    }
    if (url.pathname === "/api/upload") {
      return handleUpload(request, env);
    }
    if (url.pathname === "/api/compliment") {
      return handleCompliment();
    }
    if (url.pathname === "/api/joke") {
      return handleDadJoke();
    }
    return new Response("Not Found", { status: 404 });
  },

  async scheduled(event, env) {
    await scheduledHandler(event, env);
  },
};

export default handler;
