import { useEffect, useState } from "react";

const EMOJIS = ["❤️", "💖", "✨", "🌸", "💕", "💘", "🌹", "🌻"];

export default function LoveEmojiParticles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      const left = Math.random() * 100;
      const duration = 5 + Math.random() * 10;
      const size = 1 + Math.random() * 2;

      setParticles((prev) => [
        ...prev,
        { id, emoji, left, duration, size },
      ]);

      // Remove particle after animation
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, duration * 1000);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-[-50px] animate-float-up text-center opacity-0"
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            fontSize: `${p.size}rem`,
          }}
        >
          {p.emoji}
        </div>
      ))}
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-110vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation-name: float-up;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}
