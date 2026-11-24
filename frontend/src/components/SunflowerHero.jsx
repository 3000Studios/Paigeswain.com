import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BirdAnimation from "./BirdAnimation";

const QUOTES = [
  "Sunshine, smiles, and family vibes only.",
  "Every small ritual is a mini vacation.",
  "Laugh louder than the alarm clock.",
  "Adventure is a family value tag-line.",
];

export default function SunflowerHero() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % QUOTES.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const quote = QUOTES[index];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-sunflower-soft bg-gradient-to-br from-sky/60 via-cream/80 to-sunflower-soft/40 p-8 shadow-[0_20px_60px_rgba(15,73,27,0.25)]">
      <BirdAnimation />
      <div className="relative max-w-5xl space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-700">Family sunshine ritual</p>
        <h1 className="text-5xl font-extrabold text-forest drop-shadow-lg">Paige Swain&apos;s Sunlit Home</h1>
        <p className="text-lg text-slate-800 leading-relaxed">{quote}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/kitchen"
            className="rounded-full bg-forest px-5 py-2.5 text-xs font-bold uppercase tracking-[0.3em] text-cream shadow-lg transition hover:bg-forest/90"
          >
            Visit Paige&apos;s Kitchen
          </Link>
          <Link
            to="/blog"
            className="rounded-full border border-forest/60 bg-white/70 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.3em] text-forest transition hover:bg-white"
          >
            Read the journal
          </Link>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="rounded-2xl bg-white/80 p-4 text-sm text-slate-700 shadow-inner">
            <p className="text-xs uppercase tracking-[0.35em] text-amber-800">Floating quote</p>
            <p className="text-xl font-semibold text-forest">{quote}</p>
          </div>
        </div>
      </div>
      <div className="absolute right-6 top-6 h-48 w-48 rounded-3xl bg-[radial-gradient(circle,rgba(255,199,44,0.55),transparent_70%)]"></div>
      <div className="absolute left-8 bottom-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(255,248,225,0.8),transparent_70%)]"></div>
    </section>
  );
}
