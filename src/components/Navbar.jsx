import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

import { useAuth } from "../context/AuthContext"

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About Us" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "Blog" },
  { to: "/message-board", label: "Message Board" },
]

export default function Navbar({ onOpenLogin }) {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="nav-brand-mark">PC</span>
        <div>
          <p className="nav-brand-kicker">Swain Family Portal</p>
          <strong>Paige's Corner</strong>
        </div>
      </div>

      <div className="nav-links desktop-only">
        {links.map((link) => (
          <NavLink
            className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
            end={link.end}
            key={link.to}
            to={link.to}
          >
            {link.label} {link.label === "About Us" || link.label === "Blog" ? "▼" : ""}
          </NavLink>
        ))}
      </div>

      <div className="nav-actions desktop-only">
        {isAuthenticated ? (
          <>
            <NavLink className="nav-login nav-dashboard-link" to="/family-dashboard">
              {user?.name}'s Dashboard
            </NavLink>
            <button className="nav-logout" onClick={handleLogout} type="button">
              Sign Out
            </button>
          </>
        ) : (
          <button className="nav-login" onClick={onOpenLogin} type="button">
            Login
          </button>
        )}
      </div>

      {/* Mobile Sunflower Navigation */}
      <div className="mobile-nav-container">
        <motion.button 
          className="sunflower-menu-btn"
          onClick={toggleMenu}
          animate={{ rotate: mobileMenuOpen ? 180 : 0, scale: mobileMenuOpen ? 1 : 0.8 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          style={{
            background: "none", border: "none", cursor: "pointer", zIndex: 50, position: "relative"
          }}
        >
          {/* SVG representation of a sunflower */}
          <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="15" fill="#5c3815" />
            <path d="M50 15C55 25 65 35 50 35C35 35 45 25 50 15Z" fill="#ffbe3b" />
            <path d="M50 85C45 75 35 65 50 65C65 65 55 75 50 85Z" fill="#ffbe3b" />
            <path d="M15 50C25 45 35 35 35 50C35 65 25 55 15 50Z" fill="#ffbe3b" />
            <path d="M85 50C75 55 65 65 65 50C65 35 75 45 85 50Z" fill="#ffbe3b" />
            <path d="M25 25C35 30 40 40 37 45C30 40 25 35 25 25Z" fill="#ffcd58" />
            <path d="M75 75C65 70 60 60 63 55C70 60 75 65 75 75Z" fill="#ffcd58" />
            <path d="M75 25C65 30 60 40 63 45C70 40 75 35 75 25Z" fill="#ffcd58" />
            <path d="M25 75C35 70 40 60 37 55C30 60 25 65 25 75Z" fill="#ffcd58" />
          </svg>
        </motion.button>
        
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="mobile-popout-menu"
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3, type: "spring" }}
              style={{
                position: "absolute", top: "70px", right: "20px", 
                background: "rgba(13, 26, 46, 0.95)", backdropFilter: "blur(10px)",
                padding: "1rem", borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", flexDirection: "column", gap: "1rem", minWidth: "200px", zIndex: 40
              }}
            >
              {links.map((link) => (
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
                  end={link.end}
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label} {link.label === "About" ? "▼" : ""}
                </NavLink>
              ))}
              <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
              {isAuthenticated ? (
                <>
                  <NavLink className="nav-login nav-dashboard-link" to="/family-dashboard" onClick={() => setMobileMenuOpen(false)}>
                    Admin Dashboard
                  </NavLink>
                  <button className="nav-logout" onClick={() => { handleLogout(); setMobileMenuOpen(false); }} type="button">
                    Sign Out
                  </button>
                </>
              ) : (
                <button className="nav-login" onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }} type="button">
                  Login
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .mobile-nav-container { display: none; }
        }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
