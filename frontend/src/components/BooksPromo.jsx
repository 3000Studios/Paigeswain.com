/**
 * "Paige's Books" promotion block, placed directly under the hero on Home.
 * Book data (titles, descriptions, Amazon links, covers) is Paige's own,
 * carried verbatim from the site's original footer feature.
 */
const books = [
  {
    title: "Sunlit Stories",
    description: "Paige's first featured book.",
    link: "https://a.co/d/0fybDKJ3",
    cover: "/book1_cover.png",
    coverWebp: "/images/book1_cover.webp",
  },
  {
    title: "Kitchen Garden Notes",
    description: "Recipes, reflections, homegrown encouragement.",
    link: "https://a.co/d/0hfuLYUK",
    cover: "/book2_cover.png",
    coverWebp: "/images/book2_cover.webp",
  },
];

export default function BooksPromo() {
  return (
    <section
      aria-labelledby="books-promo-heading"
      className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/85 p-6 shadow-lg sm:p-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-800">
            📚 Paige&apos;s Books
          </p>
          <h2
            id="books-promo-heading"
            className="mt-2 font-serif text-3xl font-bold text-forest sm:text-4xl"
          >
            Stories, wisdom, and warm little windows into the family world.
          </h2>
        </div>
        <span className="rounded-full bg-sunflower px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#2a1802]">
          Now Available
        </span>
      </div>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-700">
        You can grab a copy of our latest releases straight from Amazon below!
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {books.map((book) => (
          <a
            key={book.title}
            href={book.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-5 rounded-2xl border border-forest/15 bg-cream/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-cream hover:shadow-xl"
          >
            <picture>
              <source srcSet={book.coverWebp} type="image/webp" />
              <img
                src={book.cover}
                alt={`${book.title} — book cover`}
                width="640"
                height="640"
                loading="lazy"
                decoding="async"
                className="h-28 w-28 shrink-0 rounded-xl object-cover shadow-md ring-1 ring-forest/10 sm:h-32 sm:w-32"
              />
            </picture>
            <span className="min-w-0">
              <span className="block font-serif text-2xl font-bold leading-tight text-forest">
                {book.title}
              </span>
              <span className="mt-1.5 block text-sm leading-relaxed text-slate-700">
                {book.description}
              </span>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-cream transition group-hover:bg-forest/90">
                Get it on Amazon
                <span aria-hidden="true">→</span>
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
