import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import Nav from "../components/Nav";
import { getBlog, sendMessage } from "../lib/api";

export default function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getBlog().then((data) => setPosts(data ?? []));
  }, []);

  const cheer = async () => {
    await sendMessage("This blog page is sparkling with kindness!", "family").catch(() => {});
  };

  return (
    <div className="min-h-screen bg-cream text-slate-900">
      <Nav />
      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-slate-500">Family Blog</p>
          <h1 className="text-4xl font-bold text-forest">Weekly Sunshine Journal</h1>
          <p className="text-sm text-slate-600">
            Fresh articles auto-populated from the Worker cron straight into the story feed. Share encouragement below to brighten the writers.
          </p>
        </header>
        <div className="flex justify-end">
          <button
            onClick={cheer}
            className="rounded-full border border-forest px-4 py-2 text-xs uppercase tracking-[0.4em] text-forest"
          >
            Leave encouragement
          </button>
        </div>
        <div className="space-y-6">
          {posts.length ? (
            posts.map((post) => <BlogCard key={`blog-${post.id}`} post={post} />)
          ) : (
            <p className="rounded-2xl border border-dashed border-forest/40 bg-white/70 p-6 text-base text-slate-600">
              Blog posts will appear once the cron adds fresh content.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
