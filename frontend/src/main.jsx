import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Intro from "./pages/Intro";
import AdSenseGate from "./components/AdSenseGate";
import "./index.css";

// Route-level code splitting: each page ships as its own chunk so the
// first paint only pays for the page actually being visited.
const Home = lazy(() => import("./pages/Home"));
const Blog = lazy(() => import("./pages/Blog"));
const FamilyZone = lazy(() => import("./pages/FamilyZone"));
const HealthyFood = lazy(() => import("./pages/HealthyFood"));
const Login = lazy(() => import("./pages/Login"));
const MentalHealth = lazy(() => import("./pages/MentalHealth"));
const PaigesKitchen = lazy(() => import("./pages/PaigesKitchen"));
const PaigesShorts = lazy(() => import("./pages/PaigesShorts"));
const Warp = lazy(() => import("./pages/Warp"));
const ReactionTest = lazy(() => import("./pages/game/ReactionTest"));
const GameShell = lazy(() => import("./pages/game/GameShell"));
const LoveEmojiParticles = lazy(() => import("./components/LoveEmojiParticles"));
const FloatingMusicPlayer = lazy(() => import("./components/FloatingMusicPlayer"));

function PageFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-cream px-6 text-center">
      <p role="status" className="font-serif text-2xl font-semibold text-forest">
        🌻 Opening the garden…
      </p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Suspense fallback={null}>
        <LoveEmojiParticles />
        <FloatingMusicPlayer />
      </Suspense>
      <BrowserRouter>
        <AdSenseGate />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Navigate to="/intro" replace />} />
            <Route path="/intro" element={<Intro />} />
            <Route path="/home" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/mental" element={<MentalHealth />} />
            <Route path="/healthy" element={<HealthyFood />} />
            <Route path="/kitchen" element={<PaigesKitchen />} />
            <Route path="/shorts" element={<PaigesShorts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/family" element={<FamilyZone />} />
            <Route path="/warp" element={<Warp />} />
            <Route path="/game/reaction" element={<ReactionTest />} />
            <Route path="/game/:slug" element={<GameShell />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
