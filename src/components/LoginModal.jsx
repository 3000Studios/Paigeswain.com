import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../context/AuthContext"

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const helperText = useMemo(
    () => "Demo scaffold: use the family email and first-name password.",
    [],
  )

  useEffect(() => {
    if (!isOpen) {
      setEmail("")
      setPassword("")
      setError("")
      setSubmitting(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const submitLogin = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      await login(email, password)
      setError("")
      onClose?.()
      navigate("/family-dashboard")
    } catch (caughtError) {
      setError(caughtError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-modal-backdrop" onClick={onClose} role="presentation">
      <div
        aria-labelledby="family-login-title"
        aria-modal="true"
        className="login-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="login-modal-copy">
          <p className="eyebrow">Family Access</p>
          <h2 id="family-login-title">Welcome back to the sunflower gate.</h2>
          <p>{helperText}</p>
        </div>

        <form className="login-form" onSubmit={submitLogin}>
          <label className="field-row">
            <span>Email</span>
            <input
              autoComplete="username"
              placeholder="name@example.com"
              type="email"
              value={email}
              disabled={submitting}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="field-row">
            <span>Password</span>
            <input
              autoComplete="current-password"
              placeholder="First name"
              type="password"
              value={password}
              disabled={submitting}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <div className="login-actions">
            <button
              className="button-secondary"
              disabled={submitting}
              onClick={onClose}
              type="button"
            >
              Close
            </button>
            <button className="button-primary" disabled={submitting} type="submit">
              {submitting ? "Opening the gate..." : "Enter Family Dashboard"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
