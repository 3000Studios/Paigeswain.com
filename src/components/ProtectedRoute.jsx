import { Navigate } from "react-router-dom"

import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, status } = useAuth()

  if (status === "loading") {
    return (
      <div className="route-gate">
        <div className="route-gate-card">
          <p className="eyebrow">Opening Family Portal</p>
          <h1>Checking your sunflower gate session.</h1>
          <p>Please wait just a second while Paige's Corner confirms your access.</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/" />
  }

  return children
}
