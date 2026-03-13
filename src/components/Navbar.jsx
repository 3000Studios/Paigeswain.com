import { NavLink, useNavigate } from "react-router-dom"

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

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="nav-brand-mark">PC</span>
        <div>
          <p className="nav-brand-kicker">Swain Family Portal</p>
          <strong>Paige's Corner</strong>
        </div>
      </div>

      <div className="nav-links">
        {links.map((link) => (
          <NavLink
            className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
            end={link.end}
            key={link.to}
            to={link.to}
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="nav-actions">
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
    </nav>
  )
}
