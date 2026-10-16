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

        <RevealSection className="feature-panel">
          <h2>Why a sunflower sanctuary?</h2>
          <p>
            Sunflowers run this family's year. They go into Georgia soil in spring,
            tower over the fence by July, feed the bees and goldfinches all summer,
            and leave behind seed heads that carry next year's garden. A sunflower
            does one thing beautifully: it turns toward the light and grows anyway.
            That is the spirit of this site — a public porch where the good stuff is
            shared (garden notes, recipes, stories, photos) and a private family
            home right behind it where the everyday planning happens.
          </p>
          <p>
            The public side of Paige's Corner is written for anyone who finds it
            useful: how we grow sunflowers in Georgia's red clay and long summers,
            the recipes that actually make it to our table on busy weeknights, and
            the small systems — a message board, a shared gallery, a family
            dashboard — that keep a household of school days, practices, and
            projects running without the chaos.
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

          <RevealSection className="feature-panel">
            <h2>What you will find here</h2>
            <p>
              <strong>The Blog</strong> — garden journal entries, family recipes with
              the scaling and printing tools to actually cook from them, and stories
              worth pinning down. <strong>The Gallery</strong> — photographs from the
              garden and family life. <strong>The Message Board</strong> — a public
              corkboard for kind notes and encouragement. And behind a family login,
              the dashboard: chores, grocery planning, dinner votes, achievements,
              and reminders that keep the household in sync.
            </p>
          </RevealSection>

          <RevealSection className="feature-panel">
            <h2>Who runs the Corner</h2>
            <p>
              Paige's Corner is a family project from Acworth, Georgia — built and
              maintained by the Swain family with help from 3000 Studios. The public
              pages are for everyone; the recipes are the ones we cook, the garden
              notes are the ones we learned in our own beds, and the stories are
              ours. Thanks for stopping by the porch.
            </p>
          </RevealSection>
        </div>
      </div>
    </PublicLayout>
  )
}
