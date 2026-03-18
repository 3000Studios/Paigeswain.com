import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const jazzTracks = [
  "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=jazzy-abstract-beat-11254.mp3",
  "https://cdn.pixabay.com/download/audio/2022/10/25/audio_24a2cdc0fc.mp3?filename=smooth-jazz-117562.mp3",
  "https://cdn.pixabay.com/download/audio/2022/11/22/audio_732e7371c6.mp3?filename=jazz-lounge-113589.mp3",
  "https://cdn.pixabay.com/download/audio/2022/05/16/audio_f5572e428e.mp3?filename=modern-jazz-110057.mp3"
];

export default function BackgroundMusic() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);

  useEffect(() => {
    // Pick a random track index on load
    const randomIndex = Math.floor(Math.random() * jazzTracks.length);
    setCurrentTrackIndex(randomIndex);
    
    let audio = new Audio(jazzTracks[randomIndex]);
    audioRef.current = audio;

    // Move to next random song when ended
    const playNext = () => {
      let nextIndex = Math.floor(Math.random() * jazzTracks.length);
      while (nextIndex === randomIndex && jazzTracks.length > 1) {
        nextIndex = Math.floor(Math.random() * jazzTracks.length);
      }
      setCurrentTrackIndex(nextIndex);
      audio.src = jazzTracks[nextIndex];
      audio.play().catch(e => console.log(e));
    };
    
    audio.addEventListener('ended', playNext);
    audio.volume = 0.3; // So it's background music

    const tryPlay = () => {
      if (!isPlaying) {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(e => {
          console.log("Autoplay blocked, waiting for interaction.");
        });
      }
    };

    tryPlay();

    document.addEventListener("click", tryPlay);
    return () => {
      document.removeEventListener("click", tryPlay);
      audio.removeEventListener('ended', playNext);
      audio.pause();
    };
  }, []);

  return (
    <div style={{ position: "fixed", bottom: "20px", left: "20px", zIndex: 1000, display: "flex", alignItems: "center", gap: "10px", backgroundColor: "rgba(13, 26, 46, 0.8)", padding: "10px 15px", borderRadius: "20px", border: "1px solid rgba(255, 255, 255, 0.2)"}}>
      <motion.div 
        animate={isPlaying ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
        transition={isPlaying ? { repeat: Infinity, duration: 2 } : {}}
        style={{ fontSize: "1.2rem", cursor: "pointer" }}
        onClick={() => {
          if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
          } else {
            audioRef.current?.play();
            setIsPlaying(true);
          }
        }}
      >
        🎷
      </motion.div>
      <span style={{ color: "#ffbe3b", fontSize: "0.8rem", fontWeight: "bold" }}>
        {isPlaying ? "Playing Jazz" : "Paused"}
      </span>
    </div>
  );
}
