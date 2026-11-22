import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Live sunflower-scene wallpaper for the public pages: a fixed, full-screen
 * video of the sunflower field (lightweight derivative of the opener clip)
 * under a warm cream scrim, so page text keeps WCAG AA contrast against its
 * effective background.
 *
 * The still poster paints first; the video fades in only once the browser
 * is idle, so it never competes with the page's real content for the CPU.
 * With prefers-reduced-motion, the poster is shown instead of the video.
 */
export default function SunflowerBackdrop() {
  const reduceMotion = usePrefersReducedMotion();
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const start = () => setShowVideo(true);
    if ("requestIdleCallback" in window) {
      const handle = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback(handle);
    }
    const timer = window.setTimeout(start, 1500);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {showVideo && !reduceMotion ? (
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/sunflower-field-poster.jpg"
        >
          <source src="/sunflower-field-bg.mp4" type="video/mp4" />
        </video>
      ) : (
        <img
          src="/images/sunflower-field-poster.jpg"
          alt=""
          className="h-full w-full object-cover"
        />
      )}
      {/* Readability scrim: warm cream wash over the scene. */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8E1]/88 via-[#FFF8E1]/76 to-[#FFF1C4]/88" />
    </div>
  );
}
