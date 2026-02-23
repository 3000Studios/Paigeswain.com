import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import { useAuth } from "../hooks/useAuth";
import { getLeaderboard, getMessages, sendMessage, spinWheel } from "../lib/api";

const games = [
  { name: "Memory Match", route: "/game/memory" },
  { name: "Reaction Test", route: "/game/reaction" },
  { name: "Math Blaster", route: "/game/math" },
  { name: "Space Runner", route: "/game/space" },
  { name: "Trivia Arena", route: "/game/trivia" },
];

export default function FamilyZone() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [messages, setMessages] = useState([]);
  const [spinResult, setSpinResult] = useState("");
  const [messageDraft, setMessageDraft] = useState("");

  const refreshLeaderboard = () => {
    getLeaderboard().then((data) => setLeaderboard(data ?? []));
  };

  const refreshMessages = () => {
    getMessages("family").then((data) => setMessages(data ?? []));
  };

  useEffect(() => {
    refreshLeaderboard();
    refreshMessages();
  }, []);

  const handleSpin = async () => {
    try {
      const data = await spinWheel();
      setSpinResult(data?.reward ?? "Spin again later");
    } catch (error) {
      setSpinResult(error.message || "Spin blocked");
    }
  };

  const handleMessage = async (event) => {
    event.preventDefault();
    if (!messageDraft.trim()) return;
    await sendMessage(messageDraft, "family");
    setMessageDraft("");
    refreshMessages();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky to-cream text-slate-900">
      <Nav />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-slate-600">Family Game Universe</p>
          <h1 className="text-4xl font-bold text-forest">Family Zone</h1>
          <p className="text-sm text-slate-600">
            {user?.name ? `Hi ${user.name},` : "Hi Family friend,"} shared scores, leaderboards, and a prize wheel keep the household playing.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-forest">Game Hub</h2>
            <div className="grid gap-3">
              {games.map((game) => (
                <Link
                  key={game.name}
                  to={game.route}
                  className="rounded-2xl border border-forest/20 bg-forest/10 px-4 py-3 font-semibold text-forest transition hover:border-forest hover:bg-forest/20"
                >
                  🎮 {game.name}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.4em] text-slate-500">
              <span>Prize Wheel</span>
              <button
                onClick={handleSpin}
                className="rounded-full border border-forest px-4 py-1 text-forest hover:bg-forest/10"
              >
                Spin (top fan only)
              </button>
            </div>
            {spinResult && <p className="text-sm text-forest">Result: {spinResult}</p>}
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-forest">Leaderboard</h2>
            <ol className="mt-3 space-y-3 text-sm text-slate-600">
              {leaderboard.map((row, index) => (
                <li key={`leader-${row.user}`} className="flex items-center justify-between rounded-2xl border border-dashed border-slate-200 px-4 py-3">
                  <span className="font-semibold text-forest">{index + 1}. {row.user}</span>
                  <span className="text-xs uppercase tracking-[0.4em]">{row.total_points} pts</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-forest">Family message board</h2>
            <form className="space-y-3" onSubmit={handleMessage}>
              <textarea
                value={messageDraft}
                onChange={(event) => setMessageDraft(event.target.value)}
                placeholder="Share a high-five, encouragement, or a quick celebration."
                className="w-full rounded-2xl border border-slate-300 bg-cream/80 px-4 py-3 text-sm focus:border-forest focus:outline-none"
                rows={3}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-full bg-forest px-4 py-2 text-xs uppercase tracking-[0.4em] text-cream"
                >
                  Post message
                </button>
              </div>
            </form>
            <div className="space-y-2">
              {messages.slice(0, 6).map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-sky/20 px-4 py-3 text-sm text-slate-700">
                  <p className="font-semibold text-forest">{item.user}</p>
                  <p className="text-xs text-slate-600">{item.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/70 bg-gradient-to-br from-sky/40 to-sunflower/30 p-6 shadow-lg text-forest">
            <h2 className="text-2xl font-semibold">Warp Tunnel</h2>
            <p className="mt-3 text-sm">
              After login, the warp transition stretches into the Family Zone. Explore cosmic visuals, prize wheel, and future mini-games.
            </p>
            <Link
              to="/warp"
              className="mt-4 inline-flex rounded-full border border-forest px-4 py-2 text-xs uppercase tracking-[0.4em] text-forest transition hover:bg-forest/20"
            >
              Enter warp
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
