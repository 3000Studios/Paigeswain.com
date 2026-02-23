import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Blog from "./pages/Blog";
import FamilyZone from "./pages/FamilyZone";
import HealthyFood from "./pages/HealthyFood";
import Home from "./pages/Home";
import Intro from "./pages/Intro";
import Login from "./pages/Login";
import MentalHealth from "./pages/MentalHealth";
import PaigesKitchen from "./pages/PaigesKitchen";
import PaigesShorts from "./pages/PaigesShorts";
import Warp from "./pages/Warp";
import ReactionTest from "./pages/game/ReactionTest";
import GameShell from "./pages/game/GameShell";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
