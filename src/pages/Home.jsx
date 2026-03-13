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

            <article className="feature-panel highlight-panel">
              <span className="panel-badge">Front Door Experience</span>
              <h2>Hero video, animated sunflower world, and a warm way into the family hub.</h2>
              <p>
                The public site is the scrapbook cover: bright, welcoming, and layered
                with motion, depth, and personality.
              </p>
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

          <RevealSection className="feature-panel">
            <p className="eyebrow">Design direction</p>
            <h2>Morning light, translucent flowers, and a wallpaper that moves with you.</h2>
            <p>
              The sunflower environment is shared across the public site, with each page
              shifting the time of day and the mood of the garden.
            </p>
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
