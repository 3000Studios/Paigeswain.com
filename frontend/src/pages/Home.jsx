import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import Nav from "../components/Nav";
import RecipeCard from "../components/RecipeCard";
import SunflowerHero from "../components/SunflowerHero";
import JournalCard from "../components/JournalCard";
import { getBlog, getCompliment, getDadJoke, getJournal, getRecipes } from "../lib/api";

export default function Home() {
  const [mentalFeed, setMentalFeed] = useState([]);
  const [healthyFeed, setHealthyFeed] = useState([]);
  const [latestRecipe, setLatestRecipe] = useState(null);
  const [journals, setJournals] = useState([]);
  const [dadJoke, setDadJoke] = useState("");
  const [smileChallenge, setSmileChallenge] = useState("");

  useEffect(() => {
    getBlog("mental-health").then((data) => setMentalFeed(data ?? []));
    getBlog("healthy-food").then((data) => setHealthyFeed(data ?? []));
    getRecipes(true).then((data) => setLatestRecipe(data?.[0] ?? null));
    getJournal().then((data) => setJournals(data ?? []));
    getDadJoke().then((data) => setDadJoke(data?.joke ?? "")).catch(() => {});
    getCompliment().then((data) => setSmileChallenge(data?.compliment ?? "")).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-cream text-slate-900">
      <Nav />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <SunflowerHero dadJoke={dadJoke} />

        <section className="space-y-6 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg">
          <h2 className="text-3xl font-semibold text-forest">Family Fun Section</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-forest/20 bg-sky/20 p-4">
              <p className="text-sm uppercase tracking-[0.4em] text-forest/70">Birds</p>
              <p className="mt-3 text-lg font-semibold text-forest">Animated SVG birds keep the homepage playful.</p>
            </div>
            <div className="rounded-2xl border border-forest/20 bg-white/80 p-4">
              <p className="text-sm uppercase tracking-[0.4em] text-forest/70">Family Values</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>🌻 Kindness First</li>
                <li>🌞 Gratitude Daily</li>
                <li>🌈 Growth Together</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-forest/20 bg-forest/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-forest/60">Today&apos;s Smile Challenge</p>
              <p className="mt-2 text-lg font-semibold text-forest">{smileChallenge || "Send a hug emoji to someone you love."}</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-forest">Auto-populated blog</h2>
            <span className="text-xs uppercase tracking-[0.4em] text-forest/50">Updated weekly</span>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-forest">Mental Health Exercises</h3>
              {mentalFeed.slice(0, 2).map((post) => (
                <BlogCard key={`mental-${post.id}`} post={post} />
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-forest">Healthy Food Section</h3>
              {healthyFeed.slice(0, 2).map((post) => (
                <BlogCard key={`healthy-${post.id}`} post={post} />
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold text-forest">Paige’s Kitchen</h2>
            {latestRecipe ? (
              <RecipeCard recipe={latestRecipe} />
            ) : (
              <p className="mt-3 text-sm text-slate-700">No saved recipes yet—Paige can publish one any time.</p>
            )}
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-forest">Paige’s Shorts</h2>
            <div className="mt-4 space-y-4">
              {journals.slice(0, 2).map((entry) => (
                <JournalCard key={`journal-${entry.id}`} entry={entry} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
