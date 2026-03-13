import { createFamilyContentStore } from "./familyContent.js"
import { createFamilyActivityStore } from "./familyActivity.js"

const SESSION_COOKIE_NAME = "paiges_corner_session"
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7
const LOGIN_WINDOW_MS = 15 * 60 * 1000
const LOGIN_MAX_ATTEMPTS = 8
const DEFAULT_SESSION_SECRET = "paiges-corner-worker-session-secret"

const encoder = new TextEncoder()
const decoder = new TextDecoder()
const loginAttempts = new Map()
const contentStore = createFamilyContentStore()
const activityStore = createFamilyActivityStore()

const accounts = {
  "paigeswain3000@gmail.com": {
    email: "paigeswain3000@gmail.com",
    name: "Paige",
    passwordHash: "3eac49138be02ab6aca5f647f8d118bcf5aee1d72c27eec97391f47873a5ed22",
    role: "super-admin",
  },
  "mr.jwswain@gmail.com": {
    email: "mr.jwswain@gmail.com",
    name: "Dad",
    passwordHash: "8ebed71d46f2f416e7d2afe64cf11414984abcbfd43851ba78d3f73855876d1b",
    role: "admin",
  },
  "jadon3000son@gmail.com": {
    email: "jadon3000son@gmail.com",
    name: "Jadon",
    passwordHash: "f61a93ac6db54f19bcdc3abdf8f4056beb3030612ed67ec4301106911b4a7f77",
    role: "member",
  },
  "itisjerica@gmail.com": {
    email: "itisjerica@gmail.com",
    name: "Jerica",
    passwordHash: "ac7775c45b9868e744ae2b321b98023943820b659130d3d229749f378469299c",
    role: "member",
  },
}

function getSessionSecret(env) {
  return env.SESSION_SECRET || DEFAULT_SESSION_SECRET
}

function jsonResponse(body, init = {}) {
  const headers = new Headers(init.headers)
  headers.set("cache-control", "no-store")
  headers.set("content-type", "application/json")

  return new Response(JSON.stringify(body), {
    ...init,
    headers,
  })
}

function parseCookies(request) {
  const cookieHeader = request.headers.get("cookie") ?? ""

  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=")
        return index === -1 ? [part, ""] : [part.slice(0, index), part.slice(index + 1)]
      }),
  )
}

function base64UrlEncodeBytes(bytes) {
  let binary = ""
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function base64UrlEncodeText(value) {
  return base64UrlEncodeBytes(encoder.encode(value))
}

function base64UrlDecodeText(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4))
  const binary = atob(normalized + padding)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return decoder.decode(bytes)
}

function cookieSecuritySegment(request) {
  const { hostname, protocol } = new URL(request.url)
  const isLocalhost =
    hostname === "127.0.0.1" || hostname === "localhost" || hostname.endsWith(".localhost")

  return protocol === "https:" && !isLocalhost ? "; Secure" : ""
}

function createSessionCookie(request, token, maxAge = SESSION_TTL_SECONDS) {
  return `${SESSION_COOKIE_NAME}=${token}; Max-Age=${maxAge}; Path=/; HttpOnly; SameSite=Lax${cookieSecuritySegment(request)}`
}

function clearSessionCookie(request) {
  return `${SESSION_COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${cookieSecuritySegment(request)}`
}

function pruneLoginAttempts(ip) {
  const now = Date.now()
  const recent = (loginAttempts.get(ip) ?? []).filter((timestamp) => now - timestamp < LOGIN_WINDOW_MS)
  loginAttempts.set(ip, recent)
  return recent
}

function isRateLimited(ip) {
  return pruneLoginAttempts(ip).length >= LOGIN_MAX_ATTEMPTS
}

function recordFailure(ip) {
  const attempts = pruneLoginAttempts(ip)
  attempts.push(Date.now())
  loginAttempts.set(ip, attempts)
}

function clearFailures(ip) {
  loginAttempts.delete(ip)
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")
}

async function sign(value, env) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSessionSecret(env)),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign"],
  )

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value))
  return base64UrlEncodeBytes(new Uint8Array(signature))
}

function secureCompare(left, right) {
  if (left.length !== right.length) return false

  let mismatch = 0
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }

  return mismatch === 0
}

async function createSessionToken(user, env) {
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    exp: now + SESSION_TTL_SECONDS,
    iat: now,
    name: user.name,
    role: user.role,
    sub: user.email,
  }

  const encodedPayload = base64UrlEncodeText(JSON.stringify(payload))
  const signature = await sign(encodedPayload, env)
  return `${encodedPayload}.${signature}`
}

async function readSession(request, env) {
  const token = parseCookies(request)[SESSION_COOKIE_NAME]

  if (!token) return null

  const [encodedPayload, signature] = token.split(".")
  if (!encodedPayload || !signature) return null

  const expectedSignature = await sign(encodedPayload, env)
  if (!secureCompare(signature, expectedSignature)) return null

  try {
    const payload = JSON.parse(base64UrlDecodeText(encodedPayload))
    const now = Math.floor(Date.now() / 1000)

    if (!payload?.sub || !payload?.exp || now > payload.exp) return null

    const account = accounts[payload.sub]
    if (!account) return null

    return {
      email: account.email,
      name: account.name,
      role: account.role,
    }
  } catch {
    return null
  }
}

function buildDashboardHome(user) {
  const isAdmin = user.role === "super-admin" || user.role === "admin"

  return {
    digest: isAdmin
      ? [
          "Review the public message board before dinner.",
          "Homepage highlights are ready for the next family update.",
          "The gallery and blog rails are prepared for new posts.",
        ]
      : [
          "You can jump into messages, chores, and game night from here.",
          "Dinner voting and grocery planning are ready for family input.",
          "Achievements and compliments will show up in this home hub.",
        ],
    permissions: isAdmin
      ? ["Edit public content", "Moderate family spaces", "Manage announcements"]
      : ["Send messages", "Add ideas", "Upload memories"],
    reminder: {
      body: isAdmin
        ? "Check the message board, then swing by the family schedule so the whole house stays in sync."
        : "Take a peek at messages first, then check the schedule so you don't miss anything important.",
      primaryAction: {
        label: "Read Messages",
        target: "messages",
      },
      secondaryAction: {
        label: "Check Schedule",
        target: "schedule",
      },
      title: `Welcome back, ${user.name}.`,
    },
    sections: [
      {
        description: "Private messages, encouragement, and family updates all land here first.",
        id: "messages",
        title: "Messages",
      },
      {
        description: "School plans, dinner timing, rides, and reminders live in one shared view.",
        id: "schedule",
        title: "Schedule",
      },
      {
        description: "Track chores, stars, praise, and the gentle accountability systems planned in the workbook.",
        id: "chores",
        title: "Chores and Rewards",
      },
      {
        description: "Suggest meals, gather votes, and connect grocery needs to dinner plans.",
        id: "dinner",
        title: "Dinner and Groceries",
      },
      {
        description: "Art uploads, game night, the meeting room, and playful family surprises belong here.",
        id: "play",
        title: "Creativity and Play",
      },
      {
        description: isAdmin
          ? "Moderation, homepage posts, and family announcements will land in this admin area."
          : "Requests, ideas, and family contributions will collect here for the adults to review.",
        id: "control",
        title: isAdmin ? "Admin Controls" : "Ideas and Requests",
      },
    ],
    user,
  }
}

async function handleLogin(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") ?? "local"

  if (isRateLimited(ip)) {
    return jsonResponse(
      { error: "Too many login attempts. Please wait a few minutes." },
      { status: 429 },
    )
  }

  const body = await request.json().catch(() => null)
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""
  const password = typeof body?.password === "string" ? body.password.trim() : ""

  if (!email || !password) {
    return jsonResponse({ error: "Email and password are required." }, { status: 400 })
  }

  const account = accounts[email]
  const passwordHash = account ? await sha256Hex(password) : null

  if (!account || !secureCompare(passwordHash, account.passwordHash)) {
    recordFailure(ip)
    return jsonResponse({ error: "Invalid email or password." }, { status: 401 })
  }

  clearFailures(ip)

  const user = {
    email: account.email,
    name: account.name,
    role: account.role,
  }

  return jsonResponse(
        { user },
        {
          headers: {
            "Set-Cookie": createSessionCookie(request, await createSessionToken(user, env)),
          },
        },
      )
}

async function handleDashboardHome(request, env) {
  const user = await readSession(request, env)

  if (!user) {
    return jsonResponse({ error: "Sign in to access the family dashboard." }, { status: 401 })
  }

  return jsonResponse(buildDashboardHome(user))
}

function isAdmin(user) {
  return Boolean(user && (user.role === "super-admin" || user.role === "admin"))
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : ""
}

async function requireUser(request, env) {
  const user = await readSession(request, env)

  if (!user) {
    return {
      errorResponse: jsonResponse({ error: "Sign in to continue." }, { status: 401 }),
      user: null,
    }
  }

  return { errorResponse: null, user }
}

async function requireAdmin(request, env) {
  const result = await requireUser(request, env)

  if (result.errorResponse) {
    return result
  }

  if (!isAdmin(result.user)) {
    return {
      errorResponse: jsonResponse({ error: "Only Paige and Dad can do that." }, { status: 403 }),
      user: result.user,
    }
  }

  return result
}

async function handleGuestMessageCreate(request) {
  const body = await request.json().catch(() => null)
  const name = normalizeText(body?.name)
  const message = normalizeText(body?.message)

  if (!name || !message) {
    return jsonResponse({ error: "Name and message are required." }, { status: 400 })
  }

  if (name.length > 50 || message.length > 400) {
    return jsonResponse(
      { error: "Keep names under 50 characters and messages under 400." },
      { status: 400 },
    )
  }

  contentStore.addGuestMessage({ message, name })

  return jsonResponse(
    {
      success: true,
      message: "Thanks for the note. Paige or Dad will review it before it appears publicly.",
    },
    { status: 201 },
  )
}

async function handleFamilyOverview(request, env) {
  const result = await requireUser(request, env)
  if (result.errorResponse) return result.errorResponse

  return jsonResponse(contentStore.getFamilyOverview(result.user))
}

async function handleHighlightCreate(request, env) {
  const result = await requireAdmin(request, env)
  if (result.errorResponse) return result.errorResponse

  const body = await request.json().catch(() => null)
  const title = normalizeText(body?.title)
  const copy = normalizeText(body?.body)

  if (!title || !copy) {
    return jsonResponse({ error: "Title and highlight copy are required." }, { status: 400 })
  }

  return jsonResponse(
    contentStore.addHomeHighlight({
      author: result.user.name,
      body: copy,
      title,
    }),
    { status: 201 },
  )
}

async function handleBlogCreate(request, env) {
  const result = await requireAdmin(request, env)
  if (result.errorResponse) return result.errorResponse

  const body = await request.json().catch(() => null)
  const title = normalizeText(body?.title)
  const copy = normalizeText(body?.body)
  const category = normalizeText(body?.category) || "Family Update"

  if (!title || !copy) {
    return jsonResponse({ error: "Title and post body are required." }, { status: 400 })
  }

  return jsonResponse(
    contentStore.addBlogPost({
      author: result.user.name,
      body: copy,
      category,
      title,
    }),
    { status: 201 },
  )
}

async function handleGalleryCreate(request, env) {
  const result = await requireUser(request, env)
  if (result.errorResponse) return result.errorResponse

  const body = await request.json().catch(() => null)
  const title = normalizeText(body?.title)
  const caption = normalizeText(body?.caption)
  const imageUrl = normalizeText(body?.imageUrl)

  if (!title || !caption || !imageUrl) {
    return jsonResponse(
      { error: "Title, caption, and an image URL are required." },
      { status: 400 },
    )
  }

  return jsonResponse(
    contentStore.addGalleryItem({
      caption,
      imageUrl,
      title,
      uploadedBy: result.user.name,
    }),
    { status: 201 },
  )
}

async function handleApproveMessage(request, env) {
  const result = await requireAdmin(request, env)
  if (result.errorResponse) return result.errorResponse

  const { pathname } = new URL(request.url)
  const match = pathname.match(/^\/api\/family\/content\/message-board\/([^/]+)\/approve$/)
  const postId = match?.[1]

  if (!postId) {
    return jsonResponse({ error: "That message could not be found." }, { status: 404 })
  }

  const post = contentStore.approveMessage(postId, result.user.name)

  if (!post) {
    return jsonResponse({ error: "That message could not be found." }, { status: 404 })
  }

  return jsonResponse(post)
}

async function handleActivityOverview(request, env) {
  const result = await requireUser(request, env)
  if (result.errorResponse) return result.errorResponse

  return jsonResponse(activityStore.getOverview(result.user))
}

async function handleChoreCreate(request, env) {
  const result = await requireAdmin(request, env)
  if (result.errorResponse) return result.errorResponse

  const body = await request.json().catch(() => null)
  const title = normalizeText(body?.title)
  const assignedTo = normalizeText(body?.assignedTo)
  const dueLabel = normalizeText(body?.dueLabel)
  const rewardStars = Number(body?.rewardStars)

  if (!title || !assignedTo || !dueLabel || !Number.isFinite(rewardStars) || rewardStars < 1) {
    return jsonResponse(
      { error: "Title, assignee, due label, and reward stars are required." },
      { status: 400 },
    )
  }

  return jsonResponse(
    activityStore.addChore({
      assignedBy: result.user.name,
      assignedTo,
      dueLabel,
      rewardStars,
      title,
    }),
    { status: 201 },
  )
}

async function handleChoreComplete(request, env) {
  const result = await requireUser(request, env)
  if (result.errorResponse) return result.errorResponse

  const { pathname } = new URL(request.url)
  const match = pathname.match(/^\/api\/family\/activity\/chores\/([^/]+)\/complete$/)
  const choreId = match?.[1]
  const overview = activityStore.getOverview(result.user)
  const chore = overview.chores.find((entry) => entry.id === choreId)

  if (!chore) {
    return jsonResponse({ error: "That chore could not be found." }, { status: 404 })
  }

  if (!isAdmin(result.user) && chore.assignedTo !== result.user.name) {
    return jsonResponse({ error: "You can only complete your own chores." }, { status: 403 })
  }

  const completed = activityStore.completeChore(choreId, result.user.name)

  if (!completed) {
    return jsonResponse({ error: "That chore has already been completed." }, { status: 400 })
  }

  return jsonResponse(completed)
}

async function handleDinnerCreate(request, env) {
  const result = await requireUser(request, env)
  if (result.errorResponse) return result.errorResponse

  const body = await request.json().catch(() => null)
  const title = normalizeText(body?.title)
  const groceryHint = normalizeText(body?.groceryHint)

  if (!title) {
    return jsonResponse({ error: "Dinner title is required." }, { status: 400 })
  }

  return jsonResponse(
    activityStore.addDinnerIdea({
      createdBy: result.user.name,
      groceryHint,
      title,
    }),
    { status: 201 },
  )
}

async function handleDinnerVote(request, env) {
  const result = await requireUser(request, env)
  if (result.errorResponse) return result.errorResponse

  const { pathname } = new URL(request.url)
  const match = pathname.match(/^\/api\/family\/activity\/dinners\/([^/]+)\/vote$/)
  const dinnerId = match?.[1]
  const idea = activityStore.voteDinnerIdea(dinnerId, result.user.name)

  if (!idea) {
    return jsonResponse({ error: "That dinner idea could not be found." }, { status: 404 })
  }

  return jsonResponse(idea)
}

async function handleGroceryCreate(request, env) {
  const result = await requireUser(request, env)
  if (result.errorResponse) return result.errorResponse

  const body = await request.json().catch(() => null)
  const name = normalizeText(body?.name)
  const category = normalizeText(body?.category)

  if (!name || !category) {
    return jsonResponse({ error: "Item name and category are required." }, { status: 400 })
  }

  return jsonResponse(
    activityStore.addGroceryItem({
      addedBy: result.user.name,
      category,
      name,
    }),
    { status: 201 },
  )
}

async function handleGroceryToggle(request, env) {
  const result = await requireUser(request, env)
  if (result.errorResponse) return result.errorResponse

  const { pathname } = new URL(request.url)
  const match = pathname.match(/^\/api\/family\/activity\/groceries\/([^/]+)\/toggle$/)
  const groceryId = match?.[1]
  const item = activityStore.toggleGroceryItem(groceryId, result.user.name)

  if (!item) {
    return jsonResponse({ error: "That grocery item could not be found." }, { status: 404 })
  }

  return jsonResponse(item)
}

async function handleRequestCreate(request, env) {
  const result = await requireUser(request, env)
  if (result.errorResponse) return result.errorResponse

  const body = await request.json().catch(() => null)
  const title = normalizeText(body?.title)
  const copy = normalizeText(body?.body)

  if (!title || !copy) {
    return jsonResponse({ error: "Request title and details are required." }, { status: 400 })
  }

  return jsonResponse(
    activityStore.addRequest({
      body: copy,
      createdBy: result.user.name,
      title,
    }),
    { status: 201 },
  )
}

async function handleRequestResolve(request, env) {
  const result = await requireAdmin(request, env)
  if (result.errorResponse) return result.errorResponse

  const { pathname } = new URL(request.url)
  const match = pathname.match(/^\/api\/family\/activity\/requests\/([^/]+)\/resolve$/)
  const requestId = match?.[1]
  const requestEntry = activityStore.resolveRequest(requestId, result.user.name)

  if (!requestEntry) {
    return jsonResponse({ error: "That request could not be found." }, { status: 404 })
  }

  return jsonResponse(requestEntry)
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url)

    if (pathname === "/api/status") {
      return jsonResponse({ status: "running" })
    }

    if (pathname === "/api/auth/login" && request.method === "POST") {
      return handleLogin(request, env)
    }

    if (pathname === "/api/auth/session" && request.method === "GET") {
      return jsonResponse({ user: await readSession(request, env) })
    }

    if (pathname === "/api/auth/logout" && request.method === "POST") {
      return jsonResponse(
        { success: true },
        {
          headers: {
            "Set-Cookie": clearSessionCookie(request),
          },
        },
      )
    }

    if (pathname === "/api/dashboard/home" && request.method === "GET") {
      return handleDashboardHome(request, env)
    }

    if (pathname === "/api/public/home" && request.method === "GET") {
      return jsonResponse(contentStore.getPublicHome())
    }

    if (pathname === "/api/public/blog" && request.method === "GET") {
      return jsonResponse(contentStore.getPublicBlog())
    }

    if (pathname === "/api/public/gallery" && request.method === "GET") {
      return jsonResponse(contentStore.getPublicGallery())
    }

    if (pathname === "/api/public/message-board" && request.method === "GET") {
      return jsonResponse(contentStore.getPublicMessageBoard())
    }

    if (pathname === "/api/public/message-board" && request.method === "POST") {
      return handleGuestMessageCreate(request)
    }

    if (pathname === "/api/family/content/overview" && request.method === "GET") {
      return handleFamilyOverview(request, env)
    }

    if (pathname === "/api/family/activity/overview" && request.method === "GET") {
      return handleActivityOverview(request, env)
    }

    if (pathname === "/api/family/content/highlights" && request.method === "POST") {
      return handleHighlightCreate(request, env)
    }

    if (pathname === "/api/family/content/blog" && request.method === "POST") {
      return handleBlogCreate(request, env)
    }

    if (pathname === "/api/family/content/gallery" && request.method === "POST") {
      return handleGalleryCreate(request, env)
    }

    if (
      pathname.startsWith("/api/family/content/message-board/") &&
      pathname.endsWith("/approve") &&
      request.method === "POST"
    ) {
      return handleApproveMessage(request, env)
    }

    if (pathname === "/api/family/activity/chores" && request.method === "POST") {
      return handleChoreCreate(request, env)
    }

    if (
      pathname.startsWith("/api/family/activity/chores/") &&
      pathname.endsWith("/complete") &&
      request.method === "POST"
    ) {
      return handleChoreComplete(request, env)
    }

    if (pathname === "/api/family/activity/dinners" && request.method === "POST") {
      return handleDinnerCreate(request, env)
    }

    if (
      pathname.startsWith("/api/family/activity/dinners/") &&
      pathname.endsWith("/vote") &&
      request.method === "POST"
    ) {
      return handleDinnerVote(request, env)
    }

    if (pathname === "/api/family/activity/groceries" && request.method === "POST") {
      return handleGroceryCreate(request, env)
    }

    if (
      pathname.startsWith("/api/family/activity/groceries/") &&
      pathname.endsWith("/toggle") &&
      request.method === "POST"
    ) {
      return handleGroceryToggle(request, env)
    }

    if (pathname === "/api/family/activity/requests" && request.method === "POST") {
      return handleRequestCreate(request, env)
    }

    if (
      pathname.startsWith("/api/family/activity/requests/") &&
      pathname.endsWith("/resolve") &&
      request.method === "POST"
    ) {
      return handleRequestResolve(request, env)
    }

    if (pathname.startsWith("/api/")) {
      return jsonResponse({ error: "Not found" }, { status: 404 })
    }

    return env.ASSETS.fetch(request)
  },
}
