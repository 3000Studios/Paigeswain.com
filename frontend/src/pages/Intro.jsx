import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Intro() {
  const navigate = useNavigate();

  const enter = () => {
    localStorage.setItem("hasSeenIntro", "true");
    navigate("/home", { replace: true });
  };

  useEffect(() => {
    const seen = localStorage.getItem("hasSeenIntro");
    if (seen) {
      navigate("/home", { replace: true });
    } else {
      const timer = setTimeout(() => {
        localStorage.setItem("hasSeenIntro", "true");
        navigate("/home", { replace: true });
      }, 8000); // 8 seconds, as per original spec
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-black">
      <video autoPlay muted playsInline className="absolute h-full w-full object-cover" aria-hidden="true">
        <source src="/SunFlower_opener.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" aria-hidden="true" />
      <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
        <p className="text-sm uppercase tracking-[0.5em] text-cream/90">Welcome to</p>
        <p className="font-serif text-5xl font-semibold text-white drop-shadow-lg">Paige&apos;s Corner 🌻</p>
        <button
          type="button"
          onClick={enter}
          className="mt-2 rounded-full bg-sunflower px-6 py-3 text-xs font-bold uppercase tracking-[0.35em] text-forest shadow-xl transition hover:bg-sunflower-soft"
        >
          Enter Paige&apos;s Corner
        </button>
      </div>
    </div>
  );
}
