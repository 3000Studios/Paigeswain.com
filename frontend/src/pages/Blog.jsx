import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import SunflowerBackdrop from "../components/SunflowerBackdrop";
import { usePageMeta } from "../hooks/usePageMeta";
import { getBlog, sendMessage } from "../lib/api";
import EditorialSection, { BLOG_ARTICLES } from "../components/EditorialSection";

export default function Blog() {
  usePageMeta({
    title: "Weekly Sunshine Journal — Family Blog",
    description:
      "The Weekly Sunshine Journal: family stories, encouragement, and fresh posts from Paige's Corner, updated every week.",
  });
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getBlog().then((data) => setPosts(data ?? []));
  }, []);

  const cheer = async () => {
    await sendMessage("This blog page is sparkling with kindness!", "family").catch(() => {});
  };

  return (
    <div className="relative min-h-screen text-slate-900">
      <SunflowerBackdrop />
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
          {posts.map((post) => (
            <BlogCard key={`blog-${post.id}`} post={post} />
          ))}
        </div>
        <EditorialSection articles={BLOG_ARTICLES} heading="From the Sunshine Journal" />
      </main>
      <Footer />
    </div>
  );
}
