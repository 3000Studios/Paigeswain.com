import seed from "../database/schema/familyContentSeed.json"

function cloneSeed() {
  return JSON.parse(JSON.stringify(seed))
}

function sortByNewest(items) {
  return [...items].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
}

function excerptFrom(body) {
  const trimmed = body.trim()
  if (trimmed.length <= 140) return trimmed
  return `${trimmed.slice(0, 137).trimEnd()}...`
}

export function createFamilyContentStore() {
  const store = cloneSeed()

  return {
    addBlogPost({ author, body, category, title }) {
      const post = {
        id: crypto.randomUUID(),
        title,
        category,
        excerpt: excerptFrom(body),
        body,
        author,
        createdAt: new Date().toISOString(),
      }

      store.blogPosts.unshift(post)
      return post
    },

    addGalleryItem({ caption, imageUrl, title, uploadedBy }) {
      const item = {
        id: crypto.randomUUID(),
        title,
        caption,
        imageUrl,
        uploadedBy,
        createdAt: new Date().toISOString(),
        likes: 0,
        commentCount: 0,
      }

      store.galleryItems.unshift(item)
      return item
    },

    addGuestMessage({ message, name }) {
      const post = {
        id: crypto.randomUUID(),
        name,
        message,
        approved: false,
        createdAt: new Date().toISOString(),
      }

      store.messageBoardPosts.unshift(post)
      return post
    },

    addHomeHighlight({ author, body, title }) {
      const entry = {
        id: crypto.randomUUID(),
        title,
        body,
        author,
        createdAt: new Date().toISOString(),
      }

      store.homeHighlights.unshift(entry)
      return entry
    },

    approveMessage(id, moderatorName) {
      const post = store.messageBoardPosts.find((entry) => entry.id === id)
      if (!post) return null

      post.approved = true
      post.moderatedBy = moderatorName
      post.moderatedAt = new Date().toISOString()
      return post
    },

    getFamilyOverview(user) {
      const isAdmin = user.role === "super-admin" || user.role === "admin"

      return {
        canModerate: isAdmin,
        canPublish: isAdmin,
        galleryItems: sortByNewest(store.galleryItems).slice(0, 3),
        highlights: sortByNewest(store.homeHighlights).slice(0, 3),
        pendingMessages: isAdmin
          ? sortByNewest(store.messageBoardPosts.filter((post) => !post.approved))
          : [],
        recentBlogPosts: sortByNewest(store.blogPosts).slice(0, 3),
        stats: {
          blogPosts: store.blogPosts.length,
          galleryItems: store.galleryItems.length,
          highlights: store.homeHighlights.length,
          pendingMessages: store.messageBoardPosts.filter((post) => !post.approved).length,
        },
      }
    },

    getPublicBlog() {
      return {
        posts: sortByNewest(store.blogPosts),
      }
    },

    getPublicGallery() {
      return {
        items: sortByNewest(store.galleryItems),
      }
    },

    getPublicHome() {
      return {
        highlights: sortByNewest(store.homeHighlights).slice(0, 4),
        latestBlogPost: sortByNewest(store.blogPosts)[0] ?? null,
        stats: {
          galleryItems: store.galleryItems.length,
          publicMessages: store.messageBoardPosts.filter((post) => post.approved).length,
        },
      }
    },

    getPublicMessageBoard() {
      return {
        posts: sortByNewest(store.messageBoardPosts.filter((post) => post.approved)),
      }
    },
  }
}
