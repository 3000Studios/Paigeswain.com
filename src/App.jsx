import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import About from "./pages/About"
import Gallery from "./pages/Gallery"
import Blog from "./pages/Blog"
import MessageBoard from "./pages/MessageBoard"
import ProtectedRoute from "./components/ProtectedRoute"

import Dashboard from "./dashboard/Dashboard"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/message-board" element={<MessageBoard />} />
        <Route
          path="/family-dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
