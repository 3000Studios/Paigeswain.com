import { Link } from "react-router-dom";

const siteLinks = [
  { label: "Home", path: "/home" },
  { label: "Blog", path: "/blog" },
  { label: "Mental Health", path: "/mental" },
  { label: "Healthy Food", path: "/healthy" },
  { label: "Paige’s Kitchen", path: "/kitchen" },
  { label: "Paige’s Shorts", path: "/shorts" },
];

export default function Footer() {
  return (
    <footer className="border-t border-sunflower-soft bg-cream/90">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 py-10 text-center">
        <p className="font-serif text-2xl font-semibold text-forest">🌻 Paige&apos;s Corner</p>
        <p className="max-w-md text-sm text-slate-600">
          A sunflower-themed family home on the web — recipes, gentle wellness, and weekly sunshine, gathered with love.
        </p>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs uppercase tracking-[0.25em] text-forest">
          {siteLinks.map((item) => (
            <Link key={item.path} to={item.path} className="transition hover:text-amber-700">
              {item.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-slate-700">
          <a href="/privacy.html" className="transition hover:text-forest">
            Privacy Policy
          </a>
          <a href="/terms.html" className="transition hover:text-forest">
            Terms of Service
          </a>
          <a href="/contact.html" className="transition hover:text-forest">
            Contact
          </a>
        </nav>
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} Paige Swain • Sunflower Sanctuary</p>
      </div>
    </footer>
  );
}
