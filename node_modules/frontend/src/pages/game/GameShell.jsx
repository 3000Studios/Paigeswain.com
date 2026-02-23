import { useMemo } from "react";
import { useParams } from "react-router-dom";
import Nav from "../../components/Nav";

export default function GameShell() {
  const { slug } = useParams();
  const friendly = useMemo(() => {
    if (slug === "memory") return "Memory Match";
    if (slug === "math") return "Math Blaster";
    if (slug === "space") return "Space Runner";
    if (slug === "trivia") return "Trivia Arena";
    return "Family Game";
  }, [slug]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-forest text-cream">
      <Nav />
      <main className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.6em] text-cream/60">{friendly}</p>
        <h1 className="text-4xl font-extrabold text-cream">Coming soon</h1>
        <p className="max-w-2xl text-sm text-cream/80">
          This mini-game will add a new way to earn points, send messages for encouragement, and unlock more warp transitions.
        </p>
      </main>
    </div>
  );
}
