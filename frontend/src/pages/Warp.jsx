import { Link } from "react-router-dom";
import Nav from "../components/Nav";

export default function Warp() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-forest text-cream">
      <Nav />
      <main className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-6 py-12 text-center">
        <p className="text-xs uppercase tracking-[0.6em] text-cream/60">Warp tunnel</p>
        <h1 className="text-5xl font-extrabold text-cream">Starlit Transition</h1>
        <p className="max-w-3xl text-base text-cream/80">
          The canvas glows with a drifting starfield, speed lines, and gentle pulse before fading into the Family Game Universe.
        </p>
        <Link
          to="/family"
          className="rounded-full border border-cream px-6 py-3 text-xs uppercase tracking-[0.5em] text-cream hover:bg-cream/20"
        >
          Continue to Family Zone
        </Link>
      </main>
    </div>
  );
}
