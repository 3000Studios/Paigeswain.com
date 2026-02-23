export default function JournalCard({ entry }) {
  const created = entry?.created_at
    ? new Date(entry.created_at).toLocaleDateString()
    : "recent";

  return (
    <article className="rounded-2xl border border-forest/20 bg-white/80 p-4 shadow-sm">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-forest/60">
        <span>Journal</span>
        <span>{created}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-700 max-w-prose">{entry?.content ?? "Fresh words loading..."}</p>
    </article>
  );
}
