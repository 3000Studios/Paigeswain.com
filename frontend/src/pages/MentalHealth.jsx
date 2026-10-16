import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { usePageMeta } from "../hooks/usePageMeta";
import { getBlog } from "../lib/api";
import EditorialSection, { MENTAL_ARTICLES } from "../components/EditorialSection";

export default function MentalHealth() {
  usePageMeta({
    title: "Mental Health — Family Breathing Library",
    description:
      "Gentle weekly mental-health exercises for the whole family — breathing, gratitude, and calm routines from Paige's Corner.",
  });
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getBlog("mental-health").then((data) => setPosts(data ?? []));
  }, []);

  return (
    <div className="min-h-screen bg-cream text-slate-900">
      <Nav />
      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <header>
          <p className="text-xs uppercase tracking-[0.5em] text-slate-500">Mental Health</p>
          <h1 className="text-4xl font-bold text-forest">Family breathing library</h1>
          <p className="text-sm text-slate-600">Weekly exercises that promote calm, gratitude, and closeness.</p>
        </header>
        <div className="space-y-6">
          {posts.map((post) => (
            <BlogCard key={`mental-${post.id}`} post={post} />
          ))}
        </div>
        <EditorialSection articles={MENTAL_ARTICLES} heading="Start with these family practices" />
      </main>
      <Footer />
    </div>
  );
}
