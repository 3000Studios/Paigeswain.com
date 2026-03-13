const express = require("express")
const cors = require("cors")

const {
  addBlogPost,
  addGalleryItem,
  addGuestMessage,
  addHomeHighlight,
  approveMessage,
  getFamilyOverview,
  getPublicBlog,
  getPublicGallery,
  getPublicHome,
  getPublicMessageBoard,
} = require("./familyContent")
const {
  addChore,
  addDinnerIdea,
  addGroceryItem,
  addRequest,
  completeChore,
  getOverview,
  resolveRequest,
  toggleGroceryItem,
  voteDinnerIdea,
} = require("./familyActivity")
const { dashboard, isAdmin, login, logout, readSession, session } = require("./familyAuth")

const app = express()

app.use(cors())
app.use(express.json())

function requireUser(req, res, next) {
  const user = readSession(req)

  if (!user) {
    res.status(401).json({ error: "Sign in to continue." })
    return
  }

  req.user = user
  next()
}

function requireAdmin(req, res, next) {
  const user = readSession(req)

  if (!user) {
    res.status(401).json({ error: "Sign in to continue." })
    return
  }

  if (!isAdmin(user)) {
    res.status(403).json({ error: "Only Paige and Dad can do that." })
    return
  }

  req.user = user
  next()
}

app.get("/api/public/home", (_req, res) => {
  res.json(getPublicHome())
})

app.get("/api/public/blog", (_req, res) => {
  res.json(getPublicBlog())
})

app.get("/api/public/gallery", (_req, res) => {
  res.json(getPublicGallery())
})

app.get("/api/public/message-board", (_req, res) => {
  res.json(getPublicMessageBoard())
})

app.post("/api/public/message-board", (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : ""
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : ""

  if (!name || !message) {
    res.status(400).json({ error: "Name and message are required." })
    return
  }

  if (name.length > 50 || message.length > 400) {
    res.status(400).json({ error: "Keep names under 50 characters and messages under 400." })
    return
  }

  addGuestMessage({ message, name })
  res.status(201).json({
    success: true,
    message: "Thanks for the note. Paige or Dad will review it before it appears publicly.",
  })
})

app.post("/api/auth/login", login)
app.post("/api/auth/logout", logout)
app.get("/api/auth/session", session)
app.get("/api/dashboard/home", dashboard)
app.get("/api/family/content/overview", requireUser, (req, res) => {
  res.json(getFamilyOverview(req.user))
})

app.get("/api/family/activity/overview", requireUser, (req, res) => {
  res.json(getOverview(req.user))
})

app.post("/api/family/content/highlights", requireAdmin, (req, res) => {
  const title = typeof req.body?.title === "string" ? req.body.title.trim() : ""
  const body = typeof req.body?.body === "string" ? req.body.body.trim() : ""

  if (!title || !body) {
    res.status(400).json({ error: "Title and highlight copy are required." })
    return
  }

  res.status(201).json(
    addHomeHighlight({
      author: req.user.name,
      body,
      title,
    }),
  )
})

app.post("/api/family/content/blog", requireAdmin, (req, res) => {
  const title = typeof req.body?.title === "string" ? req.body.title.trim() : ""
  const body = typeof req.body?.body === "string" ? req.body.body.trim() : ""
  const category = typeof req.body?.category === "string" ? req.body.category.trim() : "Family Update"

  if (!title || !body) {
    res.status(400).json({ error: "Title and post body are required." })
    return
  }

  res.status(201).json(
    addBlogPost({
      author: req.user.name,
      body,
      category,
      title,
    }),
  )
})

app.post("/api/family/content/gallery", requireUser, (req, res) => {
  const title = typeof req.body?.title === "string" ? req.body.title.trim() : ""
  const caption = typeof req.body?.caption === "string" ? req.body.caption.trim() : ""
  const imageUrl = typeof req.body?.imageUrl === "string" ? req.body.imageUrl.trim() : ""

  if (!title || !caption || !imageUrl) {
    res.status(400).json({ error: "Title, caption, and an image URL are required." })
    return
  }

  res.status(201).json(
    addGalleryItem({
      caption,
      imageUrl,
      title,
      uploadedBy: req.user.name,
    }),
  )
})

app.post("/api/family/content/message-board/:id/approve", requireAdmin, (req, res) => {
  const post = approveMessage(req.params.id, req.user.name)

  if (!post) {
    res.status(404).json({ error: "That message could not be found." })
    return
  }

  res.json(post)
})

app.post("/api/family/activity/chores", requireAdmin, (req, res) => {
  const title = typeof req.body?.title === "string" ? req.body.title.trim() : ""
  const assignedTo = typeof req.body?.assignedTo === "string" ? req.body.assignedTo.trim() : ""
  const dueLabel = typeof req.body?.dueLabel === "string" ? req.body.dueLabel.trim() : ""
  const rewardStars = Number(req.body?.rewardStars)

  if (!title || !assignedTo || !dueLabel || !Number.isFinite(rewardStars) || rewardStars < 1) {
    res.status(400).json({ error: "Title, assignee, due label, and reward stars are required." })
    return
  }

  res.status(201).json(
    addChore({
      assignedBy: req.user.name,
      assignedTo,
      dueLabel,
      rewardStars,
      title,
    }),
  )
})

app.post("/api/family/activity/chores/:id/complete", requireUser, (req, res) => {
  const overview = getOverview(req.user)
  const chore = overview.chores.find((entry) => entry.id === req.params.id)

  if (!chore) {
    res.status(404).json({ error: "That chore could not be found." })
    return
  }

  if (!isAdmin(req.user) && chore.assignedTo !== req.user.name) {
    res.status(403).json({ error: "You can only complete your own chores." })
    return
  }

  const completed = completeChore(req.params.id, req.user.name)

  if (!completed) {
    res.status(400).json({ error: "That chore has already been completed." })
    return
  }

  res.json(completed)
})

app.post("/api/family/activity/dinners", requireUser, (req, res) => {
  const title = typeof req.body?.title === "string" ? req.body.title.trim() : ""
  const groceryHint =
    typeof req.body?.groceryHint === "string" ? req.body.groceryHint.trim() : ""

  if (!title) {
    res.status(400).json({ error: "Dinner title is required." })
    return
  }

  res.status(201).json(
    addDinnerIdea({
      createdBy: req.user.name,
      groceryHint,
      title,
    }),
  )
})

app.post("/api/family/activity/dinners/:id/vote", requireUser, (req, res) => {
  const idea = voteDinnerIdea(req.params.id, req.user.name)

  if (!idea) {
    res.status(404).json({ error: "That dinner idea could not be found." })
    return
  }

  res.json(idea)
})

app.post("/api/family/activity/groceries", requireUser, (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : ""
  const category = typeof req.body?.category === "string" ? req.body.category.trim() : ""

  if (!name || !category) {
    res.status(400).json({ error: "Item name and category are required." })
    return
  }

  res.status(201).json(
    addGroceryItem({
      addedBy: req.user.name,
      category,
      name,
    }),
  )
})

app.post("/api/family/activity/groceries/:id/toggle", requireUser, (req, res) => {
  const item = toggleGroceryItem(req.params.id, req.user.name)

  if (!item) {
    res.status(404).json({ error: "That grocery item could not be found." })
    return
  }

  res.json(item)
})

app.post("/api/family/activity/requests", requireUser, (req, res) => {
  const title = typeof req.body?.title === "string" ? req.body.title.trim() : ""
  const body = typeof req.body?.body === "string" ? req.body.body.trim() : ""

  if (!title || !body) {
    res.status(400).json({ error: "Request title and details are required." })
    return
  }

  res.status(201).json(
    addRequest({
      body,
      createdBy: req.user.name,
      title,
    }),
  )
})

app.post("/api/family/activity/requests/:id/resolve", requireAdmin, (req, res) => {
  const requestEntry = resolveRequest(req.params.id, req.user.name)

  if (!requestEntry) {
    res.status(404).json({ error: "That request could not be found." })
    return
  }

  res.json(requestEntry)
})

app.get("/api/status", (req, res) => {
  res.json({ status: "running" })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
