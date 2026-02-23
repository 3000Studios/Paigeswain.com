import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Intro() {
  const navigate = useNavigate();

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
    <div className="h-screen w-screen bg-black flex items-center justify-center">
      <video autoPlay muted className="absolute w-full h-full object-cover">
        <source src="https://storage.coverr.co/videos/coverr-sunflower-field-1359/1080p.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
