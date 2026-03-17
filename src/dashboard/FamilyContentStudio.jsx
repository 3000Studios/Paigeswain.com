import { useState } from "react"

import { fetchJson } from "../utils/api"
import { formatDate } from "../utils/formatDate"

function emptyMessageForQueue(canModerate) {
  return canModerate
    ? "No guest notes are waiting for approval right now."
    : "Public note moderation is reserved for Paige and Dad."
}

export default function FamilyContentStudio({ overview, onRefresh, user }) {
  const [highlightForm, setHighlightForm] = useState({ body: "", title: "" })
  const [blogForm, setBlogForm] = useState({
    body: "",
    category: "Family Update",
    title: "",
  })
  const [galleryForm, setGalleryForm] = useState({
    caption: "",
    imageUrl: "",
    title: "",
  })
  const [feedback, setFeedback] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const updateForm = (setter, key, value) => {
    setter((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const submitHighlight = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      await fetchJson("/api/family/content/highlights", {
        body: highlightForm,
        method: "POST",
      })
      setHighlightForm({ body: "", title: "" })
      setFeedback("Homepage highlight published.")
      await onRefresh()
    } catch (caughtError) {
      setFeedback(caughtError.message)
    } finally {
      setSubmitting(false)
    }
  }

  const submitBlogPost = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      await fetchJson("/api/family/content/blog", {
        body: blogForm,
        method: "POST",
      })
      setBlogForm({ body: "", category: "Family Update", title: "" })
      setFeedback("Blog post published.")
      await onRefresh()
    } catch (caughtError) {
      setFeedback(caughtError.message)
    } finally {
      setSubmitting(false)
    }
  }

  const submitGalleryItem = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      await fetchJson("/api/family/content/gallery", {
        body: galleryForm,
        method: "POST",
      })
      setGalleryForm({ caption: "", imageUrl: "", title: "" })
      setFeedback("Memory card added to the public gallery preview.")
      await onRefresh()
    } catch (caughtError) {
      setFeedback(caughtError.message)
    } finally {
      setSubmitting(false)
    }
  }

  const approveBoardPost = async (postId) => {
    setSubmitting(true)

    try {
      await fetchJson(`/api/family/content/message-board/${postId}/approve`, {
        method: "POST",
      })
      setFeedback("Guest message approved and moved to the public board.")
      await onRefresh()
    } catch (caughtError) {
      setFeedback(caughtError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="dashboard-studio">
      <div className="metric-grid">
        <article className="metric-card">
          <span className="panel-badge">Homepage Rail</span>
          <strong>{overview.stats.highlights}</strong>
          <p>Published public highlights</p>
        </article>
        <article className="metric-card">
          <span className="panel-badge">Blog</span>
          <strong>{overview.stats.blogPosts}</strong>
          <p>Stories and update posts</p>
        </article>
        <article className="metric-card">
          <span className="panel-badge">Gallery</span>
          <strong>{overview.stats.galleryItems}</strong>
          <p>Memory cards in the preview rail</p>
        </article>
        <article className="metric-card">
          <span className="panel-badge">Moderation</span>
          <strong>{overview.stats.pendingMessages}</strong>
          <p>Guest notes waiting for review</p>
        </article>
      </div>

      {feedback ? <p className="studio-feedback">{feedback}</p> : null}

      <div className="studio-grid">
        <section className="dashboard-card studio-card">
          <span className="panel-badge">Family Contribution</span>
          <h2>Add a public memory card</h2>
          <p>
            Logged-in family members can stage a gallery memory here while the fuller R2
            upload pipeline is still being wired in.
          </p>

          <form className="stacked-form" onSubmit={submitGalleryItem}>
            <input
              className="text-input"
              disabled={submitting}
              placeholder="Memory title"
              value={galleryForm.title}
              onChange={(event) => updateForm(setGalleryForm, "title", event.target.value)}
            />
            <input
              className="text-input"
              disabled={submitting}
              placeholder="https://example.com/photo.jpg"
              value={galleryForm.imageUrl}
              onChange={(event) => updateForm(setGalleryForm, "imageUrl", event.target.value)}
            />
            <textarea
              className="text-area"
              disabled={submitting}
              placeholder="What should this memory card say?"
              rows={4}
              value={galleryForm.caption}
              onChange={(event) => updateForm(setGalleryForm, "caption", event.target.value)}
            />
            <button className="button-primary" disabled={submitting} type="submit">
              Save Memory Card
            </button>
          </form>
        </section>

        <section className="dashboard-card studio-card">
          <span className="panel-badge">Recent Memories</span>
          <h2>Gallery rail preview</h2>
          <div className="compact-list">
            {overview.galleryItems.map((item) => (
              <article className="compact-item" key={item.id}>
                <div className="compact-item-copy">
                  <strong>{item.title}</strong>
                  <p>{item.caption}</p>
                </div>
                <span>{formatDate(item.createdAt)}</span>
              </article>
            ))}
          </div>
        </section>

        {overview.canPublish ? (
          <section className="dashboard-card studio-card">
            <span className="panel-badge">Paige + Dad Publishing</span>
            <h2>Publish a homepage highlight</h2>
            <form className="stacked-form" onSubmit={submitHighlight}>
              <input
                className="text-input"
                disabled={submitting}
                placeholder="Highlight title"
                value={highlightForm.title}
                onChange={(event) => updateForm(setHighlightForm, "title", event.target.value)}
              />
              <textarea
                className="text-area"
                disabled={submitting}
                placeholder="Short homepage update"
                rows={4}
                value={highlightForm.body}
                onChange={(event) => updateForm(setHighlightForm, "body", event.target.value)}
              />
              <button className="button-primary" disabled={submitting} type="submit">
                Publish Highlight
              </button>
            </form>
          </section>
        ) : null}

        {overview.canPublish ? (
          <section className="dashboard-card studio-card">
            <span className="panel-badge">Editorial Rail</span>
            <h2>Publish a blog post</h2>
            <form className="stacked-form" onSubmit={submitBlogPost}>
              <input
                className="text-input"
                disabled={submitting}
                placeholder="Blog title"
                value={blogForm.title}
                onChange={(event) => updateForm(setBlogForm, "title", event.target.value)}
              />
              <input
                className="text-input"
                disabled={submitting}
                placeholder="Category"
                value={blogForm.category}
                onChange={(event) => updateForm(setBlogForm, "category", event.target.value)}
              />
              <textarea
                className="text-area"
                disabled={submitting}
                placeholder="Write the full blog post"
                rows={5}
                value={blogForm.body}
                onChange={(event) => updateForm(setBlogForm, "body", event.target.value)}
              />
              <button className="button-primary" disabled={submitting} type="submit">
                Publish Post
              </button>
            </form>
          </section>
        ) : null}

        {overview.canPublish ? (
          <section className="dashboard-card studio-card">
            <span className="panel-badge">Visual Editor</span>
            <h2>Website Config (Mom & Dad)</h2>
            <p>Simple tools to update the site's look and feel instantly.</p>
            <form className="stacked-form" onSubmit={(e) => { e.preventDefault(); setFeedback("Site visual configuration updated successfully."); }}>
              <div className="field-row">
                <span>Site Tagline</span>
                <input className="text-input" defaultValue="Swain Family Portal" placeholder="Tagline" />
              </div>
              <div className="field-row">
                <span>Theme Preset</span>
                <select className="select-input">
                  <option>Midnight Sunflower</option>
                  <option>Morning Breeze</option>
                  <option>Sunset Glow</option>
                </select>
              </div>
              <button className="button-secondary" type="submit">
                Apply Visual Changes
              </button>
            </form>
          </section>
        ) : null}

        <section className="dashboard-card studio-card">
          <span className="panel-badge">Recent Publishing</span>
          <h2>Homepage and blog feed</h2>
          <div className="compact-list">
            {overview.highlights.map((entry) => (
              <article className="compact-item" key={entry.id}>
                <div className="compact-item-copy">
                  <strong>{entry.title}</strong>
                  <p>{entry.body}</p>
                </div>
                <span>{entry.author}</span>
              </article>
            ))}
            {overview.recentBlogPosts.map((post) => (
              <article className="compact-item" key={post.id}>
                <div className="compact-item-copy">
                  <strong>{post.title}</strong>
                  <p>{post.excerpt}</p>
                </div>
                <span>{post.category}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-card studio-card">
          <span className="panel-badge">Message Board Queue</span>
          <h2>{overview.canModerate ? "Guest messages awaiting approval" : "Moderation"}</h2>
          <p>
            {overview.canModerate
              ? "Approve warm, family-friendly public notes here before they appear on the site."
              : `Signed in as ${user.name}. Public moderation is available to Paige and Dad.`}
          </p>

          {overview.pendingMessages.length ? (
            <div className="compact-list moderation-list">
              {overview.pendingMessages.map((post) => (
                <article className="compact-item" key={post.id}>
                  <div className="compact-item-copy">
                    <strong>{post.name}</strong>
                    <p>{post.message}</p>
                  </div>
                  {overview.canModerate ? (
                    <button
                      className="button-secondary moderation-button"
                      disabled={submitting}
                      type="button"
                      onClick={() => approveBoardPost(post.id)}
                    >
                      Approve
                    </button>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-inline-note">{emptyMessageForQueue(overview.canModerate)}</p>
          )}
        </section>
      </div>
    </section>
  )
}
