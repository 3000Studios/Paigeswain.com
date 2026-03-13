const crypto = require("crypto")

const seed = require("../database/schema/familyActivitySeed.json")

function cloneSeed() {
  return JSON.parse(JSON.stringify(seed))
}

const store = cloneSeed()

function nowIso() {
  return new Date().toISOString()
}

function sortByNewest(items) {
  return [...items].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
}

function addFeedEntry(message) {
  store.activityFeed.unshift({
    id: crypto.randomUUID(),
    message,
    createdAt: nowIso(),
  })
}

function ensureRewardProfile(name) {
  let profile = store.rewards.find((entry) => entry.name === name)

  if (!profile) {
    profile = { name, stars: 0 }
    store.rewards.push(profile)
  }

  return profile
}

function getOverview(user) {
  return {
    activityFeed: sortByNewest(store.activityFeed).slice(0, 8),
    chores: sortByNewest(store.chores),
    dinnerIdeas: sortByNewest(store.dinnerIdeas).map((entry) => ({
      ...entry,
      hasVoted: entry.votes.includes(user.name),
      voteCount: entry.votes.length,
    })),
    groceryItems: sortByNewest(store.groceryItems),
    requests: sortByNewest(store.requests),
    rewards: [...store.rewards].sort((left, right) => right.stars - left.stars),
    schedule: store.schedule,
    stats: {
      activeChores: store.chores.filter((chore) => !chore.completed).length,
      groceryLeft: store.groceryItems.filter((item) => !item.purchased).length,
      openRequests: store.requests.filter((request) => request.status === "open").length,
      topDinnerVotes:
        store.dinnerIdeas.reduce((maxVotes, entry) => Math.max(maxVotes, entry.votes.length), 0) || 0,
    },
  }
}

function addChore({ assignedBy, assignedTo, dueLabel, rewardStars, title }) {
  const chore = {
    id: crypto.randomUUID(),
    title,
    assignedTo,
    assignedBy,
    dueLabel,
    rewardStars,
    completed: false,
    createdAt: nowIso(),
  }

  store.chores.unshift(chore)
  addFeedEntry(`${assignedBy} assigned "${title}" to ${assignedTo}.`)
  return chore
}

function completeChore(id, completedBy) {
  const chore = store.chores.find((entry) => entry.id === id)

  if (!chore || chore.completed) return null

  chore.completed = true
  chore.completedAt = nowIso()
  chore.completedBy = completedBy

  const rewardProfile = ensureRewardProfile(chore.assignedTo)
  rewardProfile.stars += chore.rewardStars

  addFeedEntry(
    `${chore.assignedTo} finished "${chore.title}" and earned ${chore.rewardStars} star${chore.rewardStars === 1 ? "" : "s"}.`,
  )

  return chore
}

function addDinnerIdea({ createdBy, groceryHint, title }) {
  const idea = {
    id: crypto.randomUUID(),
    title,
    createdBy,
    groceryHint,
    votes: [createdBy],
    createdAt: nowIso(),
  }

  store.dinnerIdeas.unshift(idea)
  addFeedEntry(`${createdBy} suggested ${title} for dinner.`)
  return idea
}

function voteDinnerIdea(id, voterName) {
  const idea = store.dinnerIdeas.find((entry) => entry.id === id)

  if (!idea) return null
  if (!idea.votes.includes(voterName)) {
    idea.votes.push(voterName)
    addFeedEntry(`${voterName} voted for ${idea.title}.`)
  }

  return idea
}

function addGroceryItem({ addedBy, category, name }) {
  const item = {
    id: crypto.randomUUID(),
    name,
    category,
    addedBy,
    purchased: false,
    createdAt: nowIso(),
  }

  store.groceryItems.unshift(item)
  addFeedEntry(`${addedBy} added ${name} to the grocery list.`)
  return item
}

function toggleGroceryItem(id, actorName) {
  const item = store.groceryItems.find((entry) => entry.id === id)

  if (!item) return null

  item.purchased = !item.purchased

  if (item.purchased) {
    item.purchasedAt = nowIso()
    item.purchasedBy = actorName
    addFeedEntry(`${actorName} marked ${item.name} as purchased.`)
  } else {
    delete item.purchasedAt
    delete item.purchasedBy
    addFeedEntry(`${actorName} put ${item.name} back on the grocery list.`)
  }

  return item
}

function addRequest({ body, createdBy, title }) {
  const request = {
    id: crypto.randomUUID(),
    title,
    body,
    createdBy,
    status: "open",
    createdAt: nowIso(),
  }

  store.requests.unshift(request)
  addFeedEntry(`${createdBy} added a new request: ${title}.`)
  return request
}

function resolveRequest(id, resolvedBy) {
  const request = store.requests.find((entry) => entry.id === id)

  if (!request || request.status === "resolved") return null

  request.status = "resolved"
  request.resolvedAt = nowIso()
  request.resolvedBy = resolvedBy
  addFeedEntry(`${resolvedBy} resolved the request "${request.title}".`)
  return request
}

module.exports = {
  addChore,
  addDinnerIdea,
  addGroceryItem,
  addRequest,
  completeChore,
  getOverview,
  resolveRequest,
  toggleGroceryItem,
  voteDinnerIdea,
}
