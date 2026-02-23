import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import Nav from "../components/Nav";
import { getBlog } from "../lib/api";

export default function HealthyFood() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getBlog("healthy-food").then((data) => setPosts(data ?? []));
  }, []);

  return (
    <div className="min-h-screen bg-cream text-slate-900">
      <Nav />
      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <header>
          <p className="text-xs uppercase tracking-[0.5em] text-slate-500">Healthy Food</p>
          <h1 className="text-4xl font-bold text-forest">Kitchen stories & quick meals</h1>
          <p className="text-sm text-slate-600">
            Budget-friendly dinners, smoothie boosts, and snack stations that the kids can help build.
          </p>
        </header>
        <div className="space-y-6">
          {posts.length ? (
            posts.map((post) => <BlogCard key={`healthy-${post.id}`} post={post} />)
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-400 bg-white/70 p-6 text-slate-600">
              Healthy menus are queued up every Sunday for the next week.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
