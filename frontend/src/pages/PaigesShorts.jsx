import { useEffect, useState } from "react";
import JournalCard from "../components/JournalCard";
import Nav from "../components/Nav";
import { useAuth } from "../hooks/useAuth";
import { getJournal, publishJournal } from "../lib/api";

export default function PaigesShorts() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    getJournal().then((data) => setEntries(data ?? []));
  }, [status]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setStatus("Saving...");
    try {
      await publishJournal(draft.trim());
      setDraft("");
      setStatus("Journal posted!");
    } catch (error) {
      setStatus(error.message || "Could not save.");
    }
  };

  return (
    <div className="min-h-screen bg-cream text-slate-900">
      <Nav />
      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <header>
          <p className="text-xs uppercase tracking-[0.5em] text-slate-500">Paige’s Shorts</p>
          <h1 className="text-4xl font-bold text-forest">Journal & reflections</h1>
          <p className="text-sm text-slate-600">Soft beige backgrounds and elegant serif fonts cradle Paige’s writing.</p>
        </header>
        {user && (user.role === "paige" || user.role === "admin") ? (
          <section className="rounded-3xl border border-forest/20 bg-white/80 p-6 shadow-lg">
            <form className="space-y-3" onSubmit={handleSubmit}>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={6}
                className="w-full rounded-2xl border border-slate-300 bg-cream/80 p-4 text-sm font-serif leading-relaxed text-slate-800 focus:border-forest focus:outline-none"
                placeholder="Write a warm memory, a little love note, or a spontaneous poem."
              />
              <button
                type="submit"
                className="rounded-full border border-forest px-5 py-2 text-xs uppercase tracking-[0.4em] text-forest"
              >
                Save entry
              </button>
            </form>
            {status && <p className="mt-3 text-sm text-forest">{status}</p>}
          </section>
        ) : (
          <p className="rounded-3xl border border-dashed border-slate-400 bg-white/70 p-6 text-sm text-slate-600">
            Only Paige can edit Shorts right now.
          </p>
        )}

        <section className="space-y-4">
          {entries.map((entry) => (
            <JournalCard key={`short-${entry.id}`} entry={entry} />
          ))}
        </section>
      </main>
    </div>
  );
}
