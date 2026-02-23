import { useState, useRef } from "react";
import { Play, Pause, Music, Volume2 } from "lucide-react";

export default function FloatingMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="group relative flex items-center gap-3 rounded-full bg-white/90 p-2 shadow-2xl backdrop-blur-md transition-all hover:pr-6 border border-pink-100">
        <button
          onClick={togglePlay}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-400 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
        
        <div className="flex flex-col overflow-hidden transition-all max-w-0 group-hover:max-w-[150px]">
          <span className="whitespace-nowrap text-sm font-bold text-rose-600">Love & Sunshine</span>
          <span className="whitespace-nowrap text-xs text-rose-400">Now Playing</span>
        </div>

        <Music className={`text-rose-300 transition-all ${isPlaying ? 'animate-bounce' : ''}`} size={20} />
        
        <audio
          ref={audioRef}
          loop
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Placeholder music, user can change
        />
      </div>
    </div>
  );
}
