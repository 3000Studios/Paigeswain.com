import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

const NICE_THINGS = [
  "You are a ray of sunshine in everyone's life.",
  "Your kindness is a gift to the world.",
  "The world is better because you are in it.",
  "You inspire me to be a better person every day.",
  "Your smile can light up the darkest room.",
  "You are loved more than you know.",
  "Thank you for being such a wonderful human being.",
  "You've got a heart of gold.",
  "You are stronger than you think.",
  "Every day is a better day with you."
];

export default function HeartfeltMessages() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % NICE_THINGS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-100 to-pink-100 p-8 shadow-inner border border-rose-200">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg animate-pulse">
          <Heart fill="currentColor" size={24} />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-500">A Little Love For You</p>
          <div className="relative h-12 overflow-hidden">
             <p key={index} className="animate-fade-in-up text-xl font-medium text-rose-700 italic">
               "{NICE_THINGS[index]}"
             </p>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
