import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import About from "./pages/About"
import Gallery from "./pages/Gallery"
import Blog from "./pages/Blog"
import MessageBoard from "./pages/MessageBoard"
import ProtectedRoute from "./components/ProtectedRoute"
import DaisyBot from "./components/DaisyBot"
import BackgroundMusic from "./components/BackgroundMusic"
import WebsiteOpener from "./components/WebsiteOpener"

import Dashboard from "./dashboard/Dashboard"

export default function App() {
  const [showOpener, setShowOpener] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the opener this session
    if (!sessionStorage.getItem('hasSeenOpener')) {
      setShowOpener(true);
    }

    const playBeeSound = () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        
        const audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(80, audioCtx.currentTime); 
        oscillator.frequency.exponentialRampToValueAtTime(140, audioCtx.currentTime + 0.05);
        oscillator.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.15);
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.15);
      } catch (e) {
        console.error(e);
      }
    };

    document.addEventListener('click', playBeeSound);
    return () => document.removeEventListener('click', playBeeSound);
  }, []);

  const handleOpenerComplete = () => {
    sessionStorage.setItem('hasSeenOpener', 'true');
    setShowOpener(false);
  };

  return (
    <BrowserRouter>
      {showOpener && <WebsiteOpener onComplete={handleOpenerComplete} />}
      <div style={{ display: showOpener ? "none" : "block" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/message-board" element={<MessageBoard />} />
          <Route
            path="/family-dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <BackgroundMusic />
        <DaisyBot />
      </div>
    </BrowserRouter>
  )
}
