import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import PublicLayout from "../components/PublicLayout"
import RevealSection from "../components/RevealSection"
import { useAuth } from "../context/AuthContext"
import { fetchJson } from "../utils/api"
import { formatDate } from "../utils/formatDate"

export default function Gallery() {
  const { isAuthenticated } = useAuth()
  const [gallery, setGallery] = useState({ items: [] })

  useEffect(() => {
    let active = true

    fetchJson("/api/public/gallery")
      .then((data) => {
        if (active) {
          setGallery(data)
        }
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [])

  return (
    <PublicLayout lighting="afternoon">
      <div className="page-shell">
        <RevealSection className="page-header">
          <p className="eyebrow">Gallery</p>
          <h1>Snapshots, art, voice notes, and all the little pieces of family life.</h1>
          <p>
            This gallery preview is now fed by the shared content store, with family-added
            memory cards ready to surface here.
          </p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <Link className="button-secondary" to="/family-dashboard">
                Add a Memory from the Dashboard
              </Link>
            ) : (
              <span className="inline-meta">Sign in to help curate the family memory rail.</span>
            )}
          </div>
        </RevealSection>

        <div className="gallery-card-grid">
          {gallery.items.map((item) => (
            <RevealSection className="gallery-card" key={item.id}>
              <img alt={item.title} className="gallery-card-image" src={item.imageUrl} />
              <div className="gallery-card-copy">
                <span className="panel-badge">{item.uploadedBy}</span>
                <h2>{item.title}</h2>
                <p>{item.caption}</p>
                <div className="gallery-card-meta">
                  <span>{item.likes} likes</span>
                  <span>{item.commentCount} comments</span>
                  <span>{formatDate(item.createdAt)}</span>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </PublicLayout>
  )
}
