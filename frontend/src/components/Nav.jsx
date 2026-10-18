import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import SunflowerMark from "./SunflowerMark";

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
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const reduceMotion = usePrefersReducedMotion();
  const triggerRef = useRef(null);
  const closeRef = useRef(null);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // While open: Escape closes, body scroll locks, focus moves into the
  // drawer and returns to the sunflower trigger on close.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [open ]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-sunflower-soft bg-cream/95 shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-2.5">
          <Link
            to="/home"
            className="flex items-center gap-2 font-serif text-2xl font-bold tracking-wide text-forest"
          >
            <SunflowerMark className="h-9 w-9" />
            Paige Swain
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <span className="hidden text-xs font-semibold text-forest/80 sm:block">
                Family: {user.name}
              </span>
            ) : (
              <Link
                to="/login"
                className="hidden rounded-full border border-forest/50 px-3 py-1 text-xs text-forest sm:block"
              >
                Family Login
              </Link>
            )}
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls="site-menu-drawer"
              aria-label="Open navigation menu"
              className="flex flex-col items-center rounded-full px-2 pb-1 pt-0.5 transition hover:bg-sunflower/30"
            >
              <span className="sunflower-trigger">
                <SunflowerMark className="h-14 w-14 drop-shadow-md" />
              </span>
              <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.25em] text-forest">
                Menu
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Scrim */}
      <div
        className={`menu-scrim fixed inset-0 z-[60] bg-[#1d1204]/60 backdrop-blur-[2px] ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Pop-out drawer over a live sunflower-field wallpaper */}
      <aside
        id="site-menu-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation menu"
        aria-hidden={!open}
        inert={!open}
        className={`menu-drawer fixed right-0 top-0 z-[70] h-dvh w-[86vw] max-w-sm overflow-hidden shadow-2xl ${
          open ? "open" : ""
        }`}
      >
        {/* Wallpaper: live video while open (poster still otherwise) + contrast scrim */}
        <div className="absolute inset-0" aria-hidden="true">
          {open && !reduceMotion ? (
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/images/sunflower-field-poster.jpg"
            >
              <source src="/sunflower-field-bg.mp4" type="video/mp4" />
            </video>
          ) : (
            <img
              src="/images/sunflower-field-poster.jpg"
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(36,21,3,0.93)] via-[rgba(36,21,3,0.84)] to-[rgba(20,38,15,0.95)]" />
        </div>

        <div className="relative flex h-full flex-col overflow-y-auto p-6">
          <div className="flex items-start justify-between gap-4">
            <p className="drawer-shadow font-serif text-2xl font-bold text-[#FFF6D8]">
              Paige&apos;s Corner
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation menu"
              tabIndex={open ? 0 : -1}
              className="rounded-full bg-cream/15 p-2 text-[#FFF6D8] ring-1 ring-cream/40 transition hover:bg-cream/30"
            >
              <X size={22} />
            </button>
          </div>
          <p className="drawer-shadow mt-1 text-sm text-[#FFEFC2]">
            Where would you like to wander?
          </p>

          <nav aria-label="Primary" className="mt-7">
            <ul className="space-y-1.5">
              {links.map((item, index) => (
                <li
                  key={item.path}
                  className="menu-item"
                  style={{ transitionDelay: open ? `${60 * index}ms` : "0ms" }}
                >
                  <NavLink
                    to={item.path}
                    onClick={() => setOpen(false)}
                    tabIndex={open ? 0 : -1}
                    className={({ isActive }) =>
                      `drawer-link block rounded-2xl px-4 py-2.5 font-serif text-[1.65rem] font-semibold leading-snug text-[#FFF6D8] transition hover:bg-white/10 hover:text-sunflower ${
                        isActive
                          ? "text-sunflower underline decoration-sunflower/70 underline-offset-8"
                          : ""
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto pt-10">
            {user ? (
              <div className="rounded-2xl bg-black/35 p-4 ring-1 ring-cream/25">
                <p className="text-sm font-semibold text-[#FFF6D8]">Family: {user.name}</p>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  tabIndex={open ? 0 : -1}
                  className="mt-3 rounded-full bg-sunflower px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#2a1802] transition hover:bg-[#ffd34d]"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <p className="drawer-shadow text-sm text-[#FFEFC2]">
                Family members: use Family Login above to reach the private zone.
              </p>
            )}
            <p className="mt-6 text-xs text-[#FFEFC2]/90">
              © {new Date().getFullYear()} Paige Swain • Sunflower Sanctuary
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
