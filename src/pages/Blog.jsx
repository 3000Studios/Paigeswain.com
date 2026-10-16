import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import PublicLayout from "../components/PublicLayout"
import RevealSection from "../components/RevealSection"
import { useAuth } from "../context/AuthContext"
import { fetchJson } from "../utils/api"
import { formatDate } from "../utils/formatDate"

export default function Blog() {
  const { isAuthenticated, user } = useAuth()
  const [blog, setBlog] = useState({ posts: [] })

  useEffect(() => {
    let active = true

    fetchJson("/api/public/blog")
      .then((data) => {
        if (active) {
          setBlog(data)
        }
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [])

  const canPublish = user?.role === "super-admin" || user?.role === "admin"

  return (
    <PublicLayout lighting="cloudy">
      <div className="page-shell">
        <RevealSection className="page-header">
          <p className="eyebrow">Blog</p>
          <h1>Stories, recipes, updates, and little memories worth pinning down.</h1>
          <p>
            Paige and Dad can now publish real posts from the family dashboard, and the
            latest story can surface on the homepage under the hero.
          </p>
          {isAuthenticated && canPublish ? (
            <div className="hero-actions">
              <Link className="button-secondary" to="/family-dashboard">
                Open the Publishing Studio
              </Link>
            </div>
          ) : null}
        </RevealSection>

        <div className="blog-post-grid">
          {blog.posts.map((post) => (
            <RevealSection className="feature-panel blog-post-card" key={post.id}>
              <span className="panel-badge">{post.category}</span>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
              <div className="inline-meta">
                <span>{post.author}</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </PublicLayout>
  )
}
