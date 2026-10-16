import { useEffect } from "react"
import { useLocation } from "react-router-dom"

// AdSense policy fix (2026-10-16): "Google-served ads on screens without
// publisher-content" + "Low value content".
// The AdSense loader used to sit in index.html, so it loaded on EVERY screen —
// including the login-gated family dashboard and the message board, which carry
// no publisher content. The loader is now injected only on the public editorial
// routes (home, about, blog, gallery), and Google auto-placement containers are
// force-hidden anywhere else in the app.
const PUBLIC_CONTENT_ROUTES = new Set(["/", "/about", "/blog", "/gallery"])
const SCRIPT_ID = "adsense-loader"
const SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5800977493749262"

export default function AdSenseGate() {
  const { pathname } = useLocation()

  useEffect(() => {
    const isPublic = PUBLIC_CONTENT_ROUTES.has(pathname)
    document.body.classList.toggle("ads-off", !isPublic)
    if (isPublic && !document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script")
      script.id = SCRIPT_ID
      script.async = true
      script.src = SRC
      script.crossOrigin = "anonymous"
      document.head.appendChild(script)
    }
  }, [pathname])

  return null
}
