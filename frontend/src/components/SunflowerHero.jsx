import { useEffect, useState } from "react";
import BirdAnimation from "./BirdAnimation";

const QUOTES = [
  "Sunshine, smiles, and family vibes only.",
  "Every small ritual is a mini vacation.",
  "Laugh louder than the alarm clock.",
  "Adventure is a family value tag-line.",
];

export default function SunflowerHero({ dadJoke }) {
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
        <div className="flex flex-wrap gap-4">
          <div className="rounded-2xl bg-white/80 p-4 text-sm text-slate-700 shadow-inner">
            <p className="text-xs uppercase tracking-[0.35em] text-sunflower-soft">Floating quote</p>
            <p className="text-xl font-semibold text-forest">{quote}</p>
          </div>
          <div className="rounded-2xl bg-forest/90 p-4 text-cream shadow-lg">
            <p className="text-xs font-medium uppercase tracking-[0.4em] text-cream/70">Dad joke</p>
            <p className="mt-1 text-base font-semibold text-cream">{dadJoke ?? "Brewing kindness in progress..."}</p>
          </div>
        </div>
      </div>
      <div className="absolute right-6 top-6 h-48 w-48 rounded-3xl bg-sunflower/60 blur-3xl"></div>
      <div className="absolute left-8 bottom-10 h-32 w-32 rounded-full bg-cream/70 blur-xl"></div>
    </section>
  );
}
