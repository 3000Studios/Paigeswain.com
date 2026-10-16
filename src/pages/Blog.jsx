import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import PublicLayout from "../components/PublicLayout"
import RevealSection from "../components/RevealSection"
import { useAuth } from "../context/AuthContext"
import { fetchJson } from "../utils/api"
import { formatDate } from "../utils/formatDate"

const JOURNAL_POSTS = [
  {
    id: "journal-sunflowers-georgia",
    category: "Garden Journal",
    title: "How We Grow Sunflowers in Georgia (Zone 8): What Actually Works",
    author: "Paige's Corner",
    dateLabel: "Garden Journal",
    body: [
      "Sunflowers are the most forgiving flower a Georgia gardener can plant — and still, the first year ours barely cleared the fence. What changed was not effort; it was timing and soil. Here is the version of the method we actually use now, learned in our own beds in Acworth.",
      "Start with the soil. Northwest Georgia clay holds water like a bowl and bakes like a brick, sometimes in the same week. Sunflowers tolerate it better than most flowers, but they reward one afternoon of work: loosen the planting row a full foot deep and mix in compost until the clay breaks up. You do not need raised beds or bagged soil for the whole row — just give the roots a loosened channel to run down. Sunflowers send a taproot deep; that taproot is why mature plants laugh at August droughts that wilt everything else.",
      "Timing is the second lesson. Sow seed directly in the ground after the last frost — for us, mid-April is safe most years — and then sow again every two weeks through June. That succession sowing is the whole trick to a sunflower season instead of a sunflower week: the April plants bloom in late June, the June plants carry the show through September. Planting everything at once gives you ten glorious days and then stalks.",
      "Spacing matters more than fertilizer. Mammoth types want 18 to 24 inches between plants; branching varieties want more. Crowded sunflowers grow tall and thin and lodge (fall over) in the first summer storm. If you feed at all, feed once, early, with a balanced fertilizer — too much nitrogen gives you enormous leaves and late, small flowers.",
      "Water deeply and rarely while they establish, then mostly leave them alone. The pests are mostly friends: bees work the flowers from dawn, goldfinches strip the seed heads in fall, and both are worth more than a tidy garden. We leave the spent heads standing through winter for the birds and cut them down in spring. Save seed from your best plant each year — by year three, you are growing sunflowers selected for your own yard, and it shows.",
    ],
  },
  {
    id: "journal-weeknight-recipes",
    category: "From Our Kitchen",
    title: "The Weeknight Recipe Rule: Five Ingredients, One Pan, No Complaints",
    author: "Paige's Corner",
    dateLabel: "From Our Kitchen",
    body: [
      "Every family has two recipe collections: the aspirational one (the screenshots, the saved videos, the cookbook with the ribbon in it) and the real one — the short list of dinners that can survive a Tuesday. School, practice, homework, and a workday all land on the same evening, and dinner still has to happen. Our rule for the real list is strict: five main ingredients, one pan when possible, on the table in about thirty minutes, and eaten without negotiation.",
      "The structure matters more than the specific dishes. A protein, a starch, a vegetable that cooks in the same pan, a sauce or seasoning with actual flavor, and one fresh thing on top. Sheet-pan sausage with sweet potatoes and green beans hits all five. So does a skillet of ground turkey, rice, frozen peas, and soy-ginger sauce with green onions over the top. Once the pattern is in your head, the grocery list writes itself and the 5 p.m. 'what's for dinner' spiral disappears.",
      "Two habits keep the system running. First, cook double whenever the recipe allows it — tonight's extra rice is tomorrow's fried rice, and tonight's extra chicken is tomorrow's quesadillas. Second, keep a written list of the wins on the fridge. Families forget what worked; the list does not. The recipe shelf on this site exists for exactly that — our real list, with the scaler and print view we use at home so a recipe written for four can feed whoever is actually at the table.",
      "None of this is fancy, and that is the point. The goal of a weeknight dinner is a fed family and a cook who is not resentful. Save the aspirational cookbook for Sunday.",
    ],
  },
  {
    id: "journal-garden-journal",
    category: "Garden Journal",
    title: "Keeping a Garden Journal: The Notebook That Makes Next Year Easier",
    author: "Paige's Corner",
    dateLabel: "Garden Journal",
    body: [
      "Every gardener swears they will remember what they planted where, and every gardener is wrong by October. A garden journal — ours is a battered notebook plus the posts in this blog — is the difference between repeating the same experiments every year and actually compounding what you learn.",
      "The entries that pay off are unglamorous: the date seed went in the ground, the date it sprouted, the date of first harvest or bloom, and one honest sentence about how it did. That is enough. With three years of those notes you know your yard's real last-frost date (not the almanac's), which corner stays wet after rain, and which variety of tomato your soil loves. You stop buying plants your yard has already voted against.",
      "Photograph the same bed on the first of every month. Memory edits; photos do not. The sunflower wall that felt sparse in May is a jungle by July, and the photo sequence is both the proof and the best winter reading there is. Ours live in the gallery here, dated, so next spring's planning starts from evidence instead of optimism.",
      "Start this week, with whatever is in the ground right now. One page, four dates, one honest sentence. Future you — standing in the garden center next spring, holding two seed packets and no memory at all — says thanks.",
    ],
  },
]

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
          {JOURNAL_POSTS.map((post) => (
            <RevealSection className="feature-panel blog-post-card" key={post.id}>
              <span className="panel-badge">{post.category}</span>
              <h2>{post.title}</h2>
              {post.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              <div className="inline-meta">
                <span>{post.author}</span>
                <span>{post.dateLabel}</span>
              </div>
            </RevealSection>
          ))}
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
