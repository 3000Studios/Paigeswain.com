import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/Nav";
import { useAuth } from "../../hooks/useAuth";
import { postScore } from "../../lib/api";

export default function ReactionTest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [waiting, setWaiting] = useState(false);
  const [targetTime, setTargetTime] = useState(0);
  const [reaction, setReaction] = useState(null);
  const [message, setMessage] = useState("");

  const begin = () => {
    setReaction(null);
    setWaiting(true);
    const delay = 1500 + Math.random() * 2500;
    setTimeout(() => setTargetTime(Date.now() + delay), delay);
  };

  const handleClick = async () => {
    if (!targetTime) return;
    const now = Date.now();
    const time = now - targetTime;
    setReaction(time);
    setTargetTime(0);
    setWaiting(false);
    if (!user) {
      setMessage("Sign in to store your score.");
      return;
    }
    try {
      await postScore("reaction", Math.max(0, 1000 - time));
      setMessage("Score saved! Spin the wheel on the Family Zone page.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Score failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-blue-900 text-cream">
      <Nav />
      <main className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-4xl font-bold">Reaction Test</h1>
        <p className="text-sm text-cream/80">Tap as soon as the screen lights up. Scores push the leaderboard.</p>
        <div
          className="h-64 w-64 cursor-pointer rounded-3xl border border-cream/40 bg-gradient-to-br from-sky to-forest p-4 text-3xl font-semibold shadow-lg"
          role="button"
          onClick={handleClick}
        >
          <div className="flex h-full flex-col items-center justify-center gap-2">
            {waiting ? <span>Wait for green…</span> : <span>Tap when ready</span>}
            {reaction !== null && <span className="text-xl">{reaction} ms</span>}
          </div>
        </div>
        <button
          onClick={begin}
          className="rounded-full border border-cream px-6 py-3 text-xs uppercase tracking-[0.4em]"
        >
          Start
        </button>
        {message && <p className="max-w-md text-sm text-cream/80">{message}</p>}
        {!user && (
          <button
            onClick={() => navigate("/login")}
            className="rounded-full bg-sunflower px-5 py-2 text-xs uppercase tracking-[0.35em] text-forest"
          >
            Log in to save points
          </button>
        )}
      </main>
    </div>
  );
}
