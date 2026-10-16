import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// AdSense policy fix (2026-10-16): the loader used to be a static tag in
// index.html, so Google-served ads could load on every screen — the intro
// video splash, the login page, the private family zone, and bare game
// screens — none of which carry publisher content. The loader is now injected
// only on the public editorial routes, and ad containers are force-hidden
// everywhere else.
const PUBLIC_CONTENT_ROUTES = new Set(["/home", "/blog", "/mental", "/healthy", "/kitchen", "/shorts"]);
const SCRIPT_ID = "adsense-loader";
const SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5800977493749262";

export default function AdSenseGate() {
  const { pathname } = useLocation();

  useEffect(() => {
    const isPublic = PUBLIC_CONTENT_ROUTES.has(pathname);
    document.body.classList.toggle("ads-off", !isPublic);
    if (isPublic && !document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.async = true;
      script.src = SRC;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
  }, [pathname]);

  return null;
}
