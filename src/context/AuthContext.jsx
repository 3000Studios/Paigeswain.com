import { createContext, useContext, useEffect, useMemo, useState } from "react"

import { fetchJson } from "../utils/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [status, setStatus] = useState("loading")
  const [user, setUser] = useState(null)

  const refreshSession = async () => {
    try {
      const data = await fetchJson("/api/auth/session")
      setUser(data?.user ?? null)
    } catch {
      setUser(null)
    } finally {
      setStatus("ready")
    }
  }

  useEffect(() => {
    refreshSession()
  }, [])

  const login = async (email, password) => {
    const data = await fetchJson("/api/auth/login", {
      body: { email, password },
      method: "POST",
    })

    setUser(data.user)
    setStatus("ready")
    return data.user
  }

  const logout = async () => {
    try {
      await fetchJson("/api/auth/logout", { method: "POST" })
    } finally {
      setUser(null)
      setStatus("ready")
    }
  }

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      login,
      logout,
      refreshSession,
      status,
      user,
    }),
    [status, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.")
  }

  return context
}
