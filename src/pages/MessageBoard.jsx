import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import PublicLayout from "../components/PublicLayout"
import RevealSection from "../components/RevealSection"
import { useAuth } from "../context/AuthContext"
import { fetchJson } from "../utils/api"
import { formatDate } from "../utils/formatDate"

export default function MessageBoard() {
  const { user } = useAuth()
  const [board, setBoard] = useState({ posts: [] })
  const [form, setForm] = useState({ message: "", name: "" })
  const [feedback, setFeedback] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true

    fetchJson("/api/public/message-board")
      .then((data) => {
        if (active) {
          setBoard(data)
        }
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [])

  const canModerate = user?.role === "super-admin" || user?.role === "admin"

  const submitPost = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetchJson("/api/public/message-board", {
        body: form,
        method: "POST",
      })
      setFeedback(response.message)
      setForm({ message: "", name: "" })
    } catch (caughtError) {
      setFeedback(caughtError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PublicLayout lighting="night">
      <div className="page-shell">
        <RevealSection className="page-header">
          <p className="eyebrow">Message Board</p>
          <h1>Friendly notes for the family, moderated with warmth and care.</h1>
          <p>
            Night-sky lighting and firefly accents give this page a more intimate mood for
            guest messages, gratitude, and loving shout-outs.
          </p>
          {canModerate ? (
            <div className="hero-actions">
              <Link className="button-secondary" to="/family-dashboard">
                Open Moderation Queue
              </Link>
            </div>
          ) : null}
        </RevealSection>

        <div className="content-grid board-layout">
          <RevealSection className="feature-panel board-form-card">
            <span className="panel-badge">Leave a Note</span>
            <h2>Send the family a warm public message.</h2>
            <p>
              Guest posts are reviewed before going live, which keeps the board friendly
              and family-safe.
            </p>

            <form className="stacked-form" onSubmit={submitPost}>
              <input
                className="text-input"
                disabled={submitting}
                placeholder="Your name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              />
              <textarea
                className="text-area"
                disabled={submitting}
                placeholder="Write a kind note"
                rows={5}
                value={form.message}
                onChange={(event) =>
                  setForm((current) => ({ ...current, message: event.target.value }))
                }
              />
              {feedback ? <p className="studio-feedback">{feedback}</p> : null}
              <button className="button-primary" disabled={submitting} type="submit">
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </RevealSection>

          <div className="board-post-list">
            {board.posts.map((post) => (
              <RevealSection className="feature-panel board-post" key={post.id}>
                <span className="panel-badge">{post.name}</span>
                <p>{post.message}</p>
                <small>{formatDate(post.createdAt)}</small>
              </RevealSection>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
