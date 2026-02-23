import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const links = [
  { label: "Home", path: "/home" },
  { label: "Blog", path: "/blog" },
  { label: "Mental Health", path: "/mental" },
  { label: "Healthy Food", path: "/healthy" },
  { label: "Paige’s Kitchen", path: "/kitchen" },
  { label: "Paige’s Shorts", path: "/shorts" },
  { label: "Family Login", path: "/login" },
  { label: "Family Zone", path: "/family" },
];

export default function Nav() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-cream/80 backdrop-blur sticky top-0 z-40 border-b border-sunflower-soft shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3 gap-4 flex-wrap">
        <Link to="/home" className="text-2xl font-bold tracking-wide text-forest">
          🌻 Paige Swain
        </Link>
        <div className="flex flex-wrap gap-3 text-sm uppercase tracking-[0.2em] text-forest">
          {links.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="rounded-full px-4 py-1 transition-shadow border border-transparent hover:border-sunflower hover:shadow-[0_0_15px_rgba(255,199,44,0.5)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs">
          {user ? (
            <>
              <span className="text-forest/80 font-semibold">Family: {user.name}</span>
              <button
                onClick={signOut}
                className="px-3 py-1 rounded-full text-slate-700 bg-sunflower/80 hover:bg-sunflower focus:outline-none"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="px-3 py-1 rounded-full text-forest border border-forest/50">
              Family Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
