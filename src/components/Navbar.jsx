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
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  const toggleMenu = () => setMenuOpen(!menuOpen)

  // Motion variants for the expanding menu
  const menuVariants = {
    closed: {
      width: "60px",
      height: "60px",
      borderRadius: "30px",
      padding: "0px",
      backgroundColor: "rgba(13, 26, 46, 0.8)",
      transition: { duration: 0.5, type: "spring", stiffness: 200, damping: 25 }
    },
    open: {
      width: "auto",
      height: "auto",
      borderRadius: "20px",
      padding: "1.5rem",
      backgroundColor: "rgba(13, 26, 46, 0.95)",
      transition: { duration: 0.5, type: "spring", stiffness: 200, damping: 25 }
    }
  }

  return (
    <nav className="fixed-navbar-wrapper" style={{ position: "fixed", top: "20px", right: "20px", zIndex: 100 }}>
      <motion.div 
        className="sunflower-nav-container"
        initial="closed"
        animate={menuOpen ? "open" : "closed"}
        variants={menuVariants}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: menuOpen ? "flex-start" : "center",
          justifyContent: menuOpen ? "flex-start" : "center",
          overflow: "hidden",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          {menuOpen && (
             <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '2rem' }}>
              <span className="nav-brand-mark" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ffbe3b' }}>PC</span>
              <div style={{ lineHeight: '1.2' }}>
                <p className="nav-brand-kicker" style={{ fontSize: '0.7rem', color: '#aaa', margin: 0 }}>Swain Family Portal</p>
                <strong style={{ color: 'white', whiteSpace: 'nowrap' }}>Paige's Corner</strong>
              </div>
            </div>
          )}

          <motion.button 
            className="sunflower-menu-btn"
            onClick={toggleMenu}
            animate={{ rotate: menuOpen ? 180 : 0, scale: menuOpen ? 1 : 0.9 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            style={{
              background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
              width: "60px", height: "60px", zIndex: 50, flexShrink: 0, outline: 'none'
            }}
          >
            {/* SVG representation of a sunflower */}
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        </div>
        
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className="popout-links"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: "1.5rem" }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "flex", flexDirection: "column", gap: "1rem", width: "100%", paddingRight: "1rem"
              }}
            >
              {links.map((link) => (
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
                  end={link.end}
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem', transition: 'color 0.2s', padding: '0.5rem', borderRadius: '8px' }}
                >
                  {link.label} {link.label === "About Us" || link.label === "Blog" ? "▼" : ""}
                </NavLink>
              ))}
              <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />
              {isAuthenticated ? (
                <>
                  <NavLink className="nav-login nav-dashboard-link" to="/family-dashboard" onClick={() => setMenuOpen(false)}>
                    {user?.name || 'Admin'}'s Dashboard
                  </NavLink>
                  <button className="nav-logout" onClick={() => { handleLogout(); setMenuOpen(false); }} type="button" style={{ textAlign: 'left', background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '1.1rem', padding: '0.5rem' }}>
                    Sign Out
                  </button>
                </>
              ) : (
                <button className="nav-login" onClick={() => { onOpenLogin(); setMenuOpen(false); }} type="button" style={{ textAlign: 'left', background: 'none', border: 'none', color: '#ffbe3b', cursor: 'pointer', fontSize: '1.1rem', padding: '0.5rem' }}>
                  Login
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  )
}
