import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import PublicLayout from "../components/PublicLayout"
import RevealSection from "../components/RevealSection"
import { fetchJson } from "../utils/api"
import { formatDate } from "../utils/formatDate"

export default function Home() {
  const [homeData, setHomeData] = useState({
    highlights: [],
    latestBlogPost: null,
    stats: {
      galleryItems: 0,
      publicMessages: 0,
    },
  })

  useEffect(() => {
    let active = true

    fetchJson("/api/public/home")
      .then((data) => {
        if (active) {
          setHomeData(data)
        }
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [])

  return (
    <PublicLayout lighting="morning">
      <div className="page-shell">
        <RevealSection className="hero-shell">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Swain Family Portal</p>
              <h1 className="hero-title">Paige's Corner</h1>
              <p className="hero-body">
                A sunflower-lit digital home for messages, memories, planning, games,
                encouragement, and the everyday magic of being a family.
              </p>
              <div className="hero-actions">
                <Link className="button-primary" to="/gallery">
                  Explore the Gallery
                </Link>
                <Link className="button-secondary" to="/about">
                  Read the Family Story
                </Link>
              </div>
            </div>

            <article className="feature-panel highlight-panel" style={{ padding: 0, overflow: 'hidden', position: 'relative', minHeight: '300px' }}>
              <video 
                src="https://assets.mixkit.co/videos/preview/mixkit-little-girl-playing-with-a-dog-in-the-park-343-large.mp4"
                autoPlay loop muted playsInline
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '15px', backdropFilter: 'blur(5px)' }}>
                <span className="panel-badge" style={{ color: '#ffbe3b' }}>Front Door Experience</span>
                <h2 style={{ fontSize: '1.2rem', margin: '5px 0 0', color: 'white' }}>Warm moments from the family hub.</h2>
              </div>
            </article>
          </div>
        </RevealSection>

        <div className="content-grid">
          <RevealSection className="feature-panel">
            <p className="eyebrow">What lives here</p>
            <h2>Planning, praise, play, and a place to keep family memories alive.</h2>
            <p>
              The private dashboard is designed as a family command center with chat,
              chores, grocery planning, dinner votes, achievements, and more.
            </p>
          </RevealSection>

          <RevealSection className="feature-panel" style={{ padding: 0, overflow: 'hidden', position: 'relative', minHeight: '250px' }}>
            <video 
              src="https://assets.mixkit.co/videos/preview/mixkit-happy-family-playing-with-their-dog-in-a-cornfield-4322-large.mp4"
              autoPlay loop muted playsInline
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
             <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, background: 'rgba(0,0,0,0.5)', padding: '10px 15px', borderRadius: '15px', backdropFilter: 'blur(5px)' }}>
                <p className="eyebrow" style={{ color: '#ffbe3b' }}>Living memories</p>
                <h2 style={{ fontSize: '1.2rem', margin: '5px 0 0', color: 'white' }}>Capturing every moment together.</h2>
             </div>
          </RevealSection>
        </div>

        <RevealSection className="page-header content-rail-shell">
          <p className="eyebrow">Under the Hero</p>
          <h2>Fresh from the family front porch.</h2>
          <p>
            These highlights are now powered by the shared content rail Paige and Dad can
            publish to from the family dashboard.
          </p>

          <div className="metric-strip">
            <div className="metric-pill">
              <strong>{homeData.stats.galleryItems}</strong>
              <span>Gallery memories</span>
            </div>
            <div className="metric-pill">
              <strong>{homeData.stats.publicMessages}</strong>
              <span>Public notes</span>
            </div>
          </div>

          <div className="content-grid home-highlight-grid">
            {homeData.highlights.map((entry) => (
              <article className="feature-panel content-rail-card" key={entry.id}>
                <span className="panel-badge">{entry.author}</span>
                <h2>{entry.title}</h2>
                <p>{entry.body}</p>
                <small>{formatDate(entry.createdAt)}</small>
              </article>
            ))}
          </div>
        </RevealSection>

        {homeData.latestBlogPost ? (
          <RevealSection className="feature-panel featured-story-card">
            <span className="panel-badge">Latest Story</span>
            <h2>{homeData.latestBlogPost.title}</h2>
            <p>{homeData.latestBlogPost.excerpt}</p>
            <div className="hero-actions">
              <Link className="button-secondary" to="/blog">
                Read the Blog
              </Link>
              <span className="inline-meta">
                {homeData.latestBlogPost.author} · {formatDate(homeData.latestBlogPost.createdAt)}
              </span>
            </div>
          </RevealSection>
        ) : null}
      </div>
    </PublicLayout>
  )
}
