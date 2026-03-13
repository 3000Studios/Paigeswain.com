import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/gallery">Gallery</Link>
      <Link to="/blog">Blog</Link>
      <Link to="/message-board">Message Board</Link>
    </nav>
  )
}
