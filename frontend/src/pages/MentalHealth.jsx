import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import Nav from "../components/Nav";
import { getBlog } from "../lib/api";

export default function MentalHealth() {
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
          {posts.length ? (
            posts.map((post) => <BlogCard key={`mental-${post.id}`} post={post} />)
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-400 bg-white/70 p-6 text-slate-600">
              Mental health routines are being generated every Sunday.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
