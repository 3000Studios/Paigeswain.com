import { useState } from "react"

import Footer from "./Footer"
import LoginModal from "./LoginModal"
import Navbar from "./Navbar"
import SunflowerScene from "./SunflowerScene"

export default function PublicLayout({ children, lighting = "morning" }) {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <div className={`public-layout public-layout--${lighting}`}>
      <div className="scene-shell" aria-hidden="true">
        <SunflowerScene lighting={lighting} />
      </div>

      <div className="scene-wash" aria-hidden="true" />

      <Navbar onOpenLogin={() => setLoginOpen(true)} />

      <main className="public-main">{children}</main>

      <Footer />

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  )
}
