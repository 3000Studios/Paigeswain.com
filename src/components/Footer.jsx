const books = [
  {
    title: "Sunlit Stories",
    description: "Placeholder spotlight for Paige's first featured book.",
  },
  {
    title: "Kitchen Garden Notes",
    description: "Room for recipes, reflections, and homegrown encouragement.",
  },
  {
    title: "Honeycomb Letters",
    description: "A third featured title card ready for links later on.",
  },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-copy">
          <p className="footer-kicker">Paige's Books</p>
          <h2>Stories, wisdom, and warm little windows into the family world.</h2>
          <p>
            These book cards are placeholders for the links Jeremy and Paige will add later.
          </p>
        </div>

        <div className="footer-book-grid">
          {books.map((book) => (
            <article className="book-card" key={book.title}>
              <span className="book-pill">Coming Soon</span>
              <h3>{book.title}</h3>
              <p>{book.description}</p>
            </article>
          ))}
        </div>

        <div className="footer-meta">
          <span>Paige's Corner</span>
          <span>Family Links</span>
          <span>Contact details can be added here later</span>
        </div>
      </div>
    </footer>
  )
}
