import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

export default function WebsiteOpener({ onComplete }) {
  const [show, setShow] = useState(true);
  const videoRef = useRef(null);

  const handleComplete = () => {
    setShow(false);
    setTimeout(() => {
      onComplete();
    }, 1000); // Wait for fade out
  };

  useEffect(() => {
    const playAttempt = setInterval(() => {
        if (videoRef.current) {
            videoRef.current.play().then(() => {
                clearInterval(playAttempt);
            }).catch(e => console.log("Waiting for user interaction to play video..."));
        }
    }, 500);

    return () => clearInterval(playAttempt);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            backgroundColor: "#000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
          onClick={handleComplete}
        >
          <video
            ref={videoRef}
            src="/SunFlower_opener.mp4"
            autoPlay
            playsInline
            muted={true}
            controls={false}
            onEnded={handleComplete}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              pointerEvents: "none" // Let clicks fall through to the container
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
