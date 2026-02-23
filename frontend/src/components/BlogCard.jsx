import { useMemo } from "react";

export default function BlogCard({ post }) {
  const published = useMemo(() => {
    if (!post?.created_at) return "Sunshine edition";
    return new Date(post.created_at).toLocaleDateString();
  }, [post]);

  return (
    <article className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-forest/70">
        <span>{post.category ?? "Family"} </span>
        <span>{published}</span>
      </div>
      <h3 className="mt-3 text-2xl font-semibold text-forest">{post.title}</h3>
      <p className="mt-2 text-sm text-slate-700 leading-relaxed max-w-prose">
        {post.content?.slice(0, 220) ?? "Paige is writing fresh thoughts..."}
      </p>
    </article>
  );
}
