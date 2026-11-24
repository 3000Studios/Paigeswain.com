import { Suspense, lazy, useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import Nav from "../components/Nav";
import SunflowerBackdrop from "../components/SunflowerBackdrop";
import BooksPromo from "../components/BooksPromo";
import RecipeCard from "../components/RecipeCard";
import SunflowerHero from "../components/SunflowerHero";
import JournalCard from "../components/JournalCard";
import Footer from "../components/Footer";

// Below-the-fold sections load after the hero + books have painted.
const HeartfeltMessages = lazy(() => import("../components/HeartfeltMessages"));
const AnimatedVideoSection = lazy(() => import("../components/AnimatedVideoSection"));
import { usePageMeta } from "../hooks/usePageMeta";
import { getBlog, getCompliment, getJournal, getRecipes } from "../lib/api";

export default function Home() {
  usePageMeta({
    title: "Paige's Corner • Paige Swain's Sunflower Sanctuary",
    description:
      "Welcome to Paige's Corner — Paige Swain's sunflower-themed family home: fresh recipes, a weekly sunshine journal, gentle wellness exercises, and healthy family food ideas.",
  });
  const [mentalFeed, setMentalFeed] = useState([]);
  const [healthyFeed, setHealthyFeed] = useState([]);
  const [latestRecipe, setLatestRecipe] = useState(null);
  const [journals, setJournals] = useState([]);
  const [smileChallenge, setSmileChallenge] = useState("");

  useEffect(() => {
    getBlog("mental-health").then((data) => setMentalFeed(data ?? []));
    getBlog("healthy-food").then((data) => setHealthyFeed(data ?? []));
    getRecipes(true)
      .then((data) => setLatestRecipe(data?.[0] ?? null))
      .catch(() => {});
    getJournal()
      .then((data) => setJournals(data ?? []))
      .catch(() => {});
    getCompliment().then((data) => setSmileChallenge(data?.compliment ?? "")).catch(() => {});
  }, []);

  return (
    <div className="relative min-h-screen text-slate-900">
      <SunflowerBackdrop />
      <Nav />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <SunflowerHero />

        <BooksPromo />

        <Suspense fallback={null}>
          <HeartfeltMessages />
        </Suspense>

        <Suspense fallback={null}>
          <AnimatedVideoSection />
        </Suspense>

        <section className="space-y-6 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg transition-transform hover:shadow-xl hover:scale-[1.01] duration-500">
          <h2 className="text-3xl font-semibold text-forest flex items-center gap-2">
            <span>Family Fun Section</span>
            <span className="text-rose-400">❤️</span>
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="group rounded-2xl border border-forest/20 bg-sky/20 p-4 transition-colors hover:bg-sky/30">
              <p className="text-sm uppercase tracking-[0.4em] text-forest/70">Birds</p>
              <p className="mt-3 text-lg font-semibold text-forest">Animated SVG birds reflect our playful spirit.</p>
              <div className="mt-2 text-2xl group-hover:animate-bounce">🐦</div>
            </div>
            <div className="group rounded-2xl border border-forest/20 bg-white/80 p-4 transition-colors hover:bg-rose-50/50">
              <p className="text-sm uppercase tracking-[0.4em] text-forest/70">Family Values</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2">🌻 <span className="group-hover:text-amber-600 transition-colors">Kindness First</span></li>
                <li className="flex items-center gap-2">🌞 <span className="group-hover:text-amber-600 transition-colors">Gratitude Daily</span></li>
                <li className="flex items-center gap-2">🌈 <span className="group-hover:text-amber-600 transition-colors">Growth Together</span></li>
              </ul>
            </div>
            <div className="group rounded-2xl border border-forest/20 bg-forest/10 p-4 transition-colors hover:bg-forest/20">
              <p className="text-xs uppercase tracking-[0.3em] text-forest">Today&apos;s Smile Challenge</p>
              <p className="mt-2 text-lg font-semibold text-forest">{smileChallenge || "Send a hug emoji to someone you love."}</p>
              <div className="mt-2 text-2xl group-hover:scale-125 transition-transform duration-300">🤗</div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-forest">Fresh from the journal</h2>
            <span className="text-xs uppercase tracking-[0.4em] text-forest/80">Updated weekly</span>
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
            <h2 className="text-3xl font-semibold text-forest flex items-center gap-2">
              <span>Paige’s Kitchen</span>
              <span className="text-2xl">👩‍🍳</span>
            </h2>
            {latestRecipe ? (
              <RecipeCard recipe={latestRecipe} />
            ) : (
              <p className="mt-3 text-sm text-slate-700">No saved recipes yet—Paige can publish one any time.</p>
            )}
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-forest flex items-center gap-2">
              <span>Paige’s Shorts</span>
              <span className="text-2xl">📽️</span>
            </h2>
            <div className="mt-4 space-y-4">
              {journals.slice(0, 2).map((entry) => (
                <JournalCard key={`journal-${entry.id}`} entry={entry} />
              ))}
            </div>
          </div>
        </section>
        <section className="space-y-4 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg">
          <h2 className="text-3xl font-semibold text-forest">Welcome to the Sunflower Sanctuary</h2>
          <p className="text-base leading-relaxed text-slate-700">
            Paige's Corner is the Swain family's home on the web, from Acworth, Georgia — part
            garden journal, part family kitchen, part front porch. The public pages are for
            anyone who finds them useful: how we grow sunflowers in Georgia clay and long
            summers, the weeknight recipes that actually survive a school night, gentle
            breathing and gratitude practices for the whole family, and the small systems
            that keep a busy household kind and running.
          </p>
          <p className="text-base leading-relaxed text-slate-700">
            Start with the <a className="font-semibold text-forest underline" href="/blog">Weekly Sunshine Journal</a> for
            garden notes and family stories, browse <a className="font-semibold text-forest underline" href="/kitchen">Paige's Kitchen</a> for
            recipes you can scale and print, visit the <a className="font-semibold text-forest underline" href="/mental">Breathing Library</a> for
            calm-down practices, or the <a className="font-semibold text-forest underline" href="/healthy">Healthy Food</a> pages for
            snack stations and smoothie formulas. Behind the family login is the private
            side — planning, messages, and memories just for us. The porch, though, is
            public, and you are welcome on it.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
