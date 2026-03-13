import PublicLayout from "../components/PublicLayout"
import RevealSection from "../components/RevealSection"

export default function About() {
  return (
    <PublicLayout lighting="sunset">
      <div className="page-shell">
        <RevealSection className="page-header">
          <p className="eyebrow">About Us</p>
          <h1>Built to feel like a digital scrapbook, kitchen table, and sunflower walk.</h1>
          <p>
            Paige's Corner is meant to hold family rhythm and family warmth in the same
            place, with a public front porch and a private home just behind it.
          </p>
        </RevealSection>

        <div className="content-grid">
          <RevealSection className="feature-panel">
            <h2>Family-first by design</h2>
            <p>
              The portal centers encouragement, routines, creativity, and playful
              togetherness instead of generic social-network mechanics.
            </p>
          </RevealSection>

          <RevealSection className="feature-panel">
            <h2>Sunflower atmosphere</h2>
            <p>
              Sunset lighting on the About page gives the story section a softer, more
              reflective tone while still keeping the world lively and interactive.
            </p>
          </RevealSection>
        </div>
      </div>
    </PublicLayout>
  )
}
