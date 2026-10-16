import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { usePageMeta } from "../hooks/usePageMeta";
import { getBlog } from "../lib/api";
import EditorialSection, { HEALTHY_ARTICLES } from "../components/EditorialSection";

export default function HealthyFood() {
  usePageMeta({
    title: "Healthy Food — Kitchen Stories & Quick Meals",
    description:
      "Budget-friendly healthy dinners, smoothie boosts, and snack stations the kids can help build — healthy food ideas from Paige's Corner.",
  });
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
          {posts.map((post) => (
            <BlogCard key={`healthy-${post.id}`} post={post} />
          ))}
        </div>
        <EditorialSection articles={HEALTHY_ARTICLES} heading="Kitchen guides from the Corner" />
      </main>
      <Footer />
    </div>
  );
}
