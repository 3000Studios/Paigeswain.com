const crypto = require("crypto")

const SESSION_COOKIE_NAME = "paiges_corner_session"
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7
const LOGIN_WINDOW_MS = 15 * 60 * 1000
const LOGIN_MAX_ATTEMPTS = 8
const DEFAULT_SESSION_SECRET = "paiges-corner-local-session-secret"

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

const loginAttempts = new Map()

function getSecret() {
  return process.env.SESSION_SECRET || DEFAULT_SESSION_SECRET
}

function sha256Hex(value) {
  return crypto.createHash("sha256").update(value).digest("hex")
}

function base64UrlEncode(value) {
  return Buffer.from(value).toString("base64url")
}

function base64UrlDecode(value) {
  return Buffer.from(value, "base64url").toString("utf8")
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url")
}

function parseCookies(cookieHeader = "") {
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

function createSessionToken(user) {
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    exp: now + SESSION_TTL_SECONDS,
    iat: now,
    name: user.name,
    role: user.role,
    sub: user.email,
  }

  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  return `${encodedPayload}.${sign(encodedPayload)}`
}

function createCookie(token, maxAge = SESSION_TTL_SECONDS) {
  return `${SESSION_COOKIE_NAME}=${token}; Max-Age=${maxAge}; Path=/; HttpOnly; SameSite=Lax`
}

function clearCookie() {
  return `${SESSION_COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`
}

function readSession(req) {
  const cookie = parseCookies(req.headers.cookie)[SESSION_COOKIE_NAME]

  if (!cookie) return null

  const [encodedPayload, signature] = cookie.split(".")
  if (!encodedPayload || !signature) return null

  const expectedSignature = sign(encodedPayload)

  if (signature.length !== expectedSignature.length) return null
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return null

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload))
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

function isAdmin(user) {
  return Boolean(user && (user.role === "super-admin" || user.role === "admin"))
}

function pruneAttempts(ip) {
  const now = Date.now()
  const recent = (loginAttempts.get(ip) ?? []).filter((timestamp) => now - timestamp < LOGIN_WINDOW_MS)
  loginAttempts.set(ip, recent)
  return recent
}

function isRateLimited(ip) {
  return pruneAttempts(ip).length >= LOGIN_MAX_ATTEMPTS
}

function recordFailure(ip) {
  const attempts = pruneAttempts(ip)
  attempts.push(Date.now())
  loginAttempts.set(ip, attempts)
}

function clearFailures(ip) {
  loginAttempts.delete(ip)
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

async function login(req, res) {
  const ip = req.ip || req.headers["x-forwarded-for"] || "local"

  if (isRateLimited(ip)) {
    res.status(429).json({ error: "Too many login attempts. Please wait a few minutes." })
    return
  }

  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : ""
  const password = typeof req.body?.password === "string" ? req.body.password.trim() : ""

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." })
    return
  }

  const account = accounts[email]

  if (!account || sha256Hex(password) !== account.passwordHash) {
    recordFailure(ip)
    res.status(401).json({ error: "Invalid email or password." })
    return
  }

  clearFailures(ip)

  const user = {
    email: account.email,
    name: account.name,
    role: account.role,
  }

  res.setHeader("Set-Cookie", createCookie(createSessionToken(user)))
  res.json({ user })
}

function session(req, res) {
  res.json({ user: readSession(req) })
}

function logout(_req, res) {
  res.setHeader("Set-Cookie", clearCookie())
  res.json({ success: true })
}

function dashboard(req, res) {
  const user = readSession(req)

  if (!user) {
    res.status(401).json({ error: "Sign in to access the family dashboard." })
    return
  }

  res.json(buildDashboardHome(user))
}

module.exports = {
  dashboard,
  isAdmin,
  login,
  logout,
  readSession,
  session,
}
