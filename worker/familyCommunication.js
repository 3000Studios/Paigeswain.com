import seed from "../database/schema/familyCommunicationSeed.json"

function cloneSeed() {
  return JSON.parse(JSON.stringify(seed))
}

function nowIso() {
  return new Date().toISOString()
}

function sortByNewest(items) {
  return [...items].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
}

export function createFamilyCommunicationStore() {
  const store = cloneSeed()

  function buildDigest(user) {
    const latestAnnouncement = sortByNewest(store.announcements)[0]
    const latestMessage = sortByNewest(store.messages).find(
      (entry) => entry.audience === "Everyone" || entry.audience === user.name,
    )
    const latestCompliment = sortByNewest(store.compliments).find(
      (entry) =>
        entry.target === user.name || user.role === "super-admin" || user.role === "admin",
    )

    return [latestAnnouncement, latestMessage, latestCompliment].filter(Boolean).map((entry) => ({
      createdAt: entry.createdAt,
      id: entry.id,
      text: entry.body,
      title: entry.title || `${entry.author} to ${entry.target || entry.audience}`,
      type: entry.title ? "announcement" : entry.target ? "compliment" : "message",
    }))
  }

  return {
    addAnnouncement({ author, body, title }) {
      const announcement = {
        id: crypto.randomUUID(),
        title,
        body,
        author,
        createdAt: nowIso(),
        pinned: false,
      }

      store.announcements.unshift(announcement)
      return announcement
    },

    addCompliment({ author, body, target }) {
      const compliment = {
        id: crypto.randomUUID(),
        author,
        target,
        body,
        createdAt: nowIso(),
      }

      store.compliments.unshift(compliment)
      return compliment
    },

    addMessage({ audience, author, body }) {
      const message = {
        id: crypto.randomUUID(),
        author,
        audience,
        body,
        createdAt: nowIso(),
      }

      store.messages.unshift(message)
      return message
    },

    getOverview(user) {
      const isAdmin = user.role === "super-admin" || user.role === "admin"

      return {
        announcements: sortByNewest(store.announcements),
        compliments: sortByNewest(
          store.compliments.filter(
            (entry) => entry.target === user.name || entry.author === user.name || isAdmin,
          ),
        ),
        digest: sortByNewest(buildDigest(user)),
        messages: sortByNewest(
          store.messages.filter(
            (entry) =>
              entry.audience === "Everyone" ||
              entry.audience === user.name ||
              (entry.audience === "Kids" && (user.name === "Jadon" || user.name === "Jerica")) ||
              (entry.audience === "Parents" && isAdmin),
          ),
        ).slice(0, 12),
        stats: {
          announcements: store.announcements.length,
          compliments: store.compliments.length,
          messages: store.messages.length,
        },
      }
    },
  }
}
