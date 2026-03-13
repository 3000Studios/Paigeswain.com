import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import SunflowerScene from "../components/SunflowerScene"
import { useAuth } from "../context/AuthContext"
import { fetchJson } from "../utils/api"
import FamilyActivityHub from "./FamilyActivityHub"
import FamilyCommunicationHub from "./FamilyCommunicationHub"
import FamilyContentStudio from "./FamilyContentStudio"
import WelcomeReminderModal from "./WelcomeReminderModal"

export default function Dashboard() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [contentOverview, setContentOverview] = useState(null)
  const [activityOverview, setActivityOverview] = useState(null)
  const [communicationOverview, setCommunicationOverview] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [showReminder, setShowReminder] = useState(false)

  useEffect(() => {
    let active = true

    const loadDashboard = async () => {
      try {
        const [
          homeData,
          nextContentOverview,
          nextActivityOverview,
          nextCommunicationOverview,
        ] = await Promise.all([
          fetchJson("/api/dashboard/home"),
          fetchJson("/api/family/content/overview"),
          fetchJson("/api/family/activity/overview"),
          fetchJson("/api/family/communication/overview"),
        ])

        if (!active) return

        setDashboardData(homeData)
        setContentOverview(nextContentOverview)
        setActivityOverview(nextActivityOverview)
        setCommunicationOverview(nextCommunicationOverview)
        setError("")
        setShowReminder(true)
      } catch (caughtError) {
        if (active) {
          setError(caughtError.message)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [])

  const refreshContentOverview = async () => {
    const nextOverview = await fetchJson("/api/family/content/overview")
    setContentOverview(nextOverview)
  }

  const refreshActivityOverview = async () => {
    const nextOverview = await fetchJson("/api/family/activity/overview")
    setActivityOverview(nextOverview)
  }

  const refreshCommunicationOverview = async () => {
    const nextOverview = await fetchJson("/api/family/communication/overview")
    setCommunicationOverview(nextOverview)
  }

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  if (loading) {
    return (
      <div className="route-gate">
        <div className="route-gate-card">
          <p className="eyebrow">Building Family Dashboard</p>
          <h1>Setting out the notes, stars, and schedule cards.</h1>
          <p>Your private family dashboard is getting ready.</p>
        </div>
      </div>
    )
  }

  if (error || !dashboardData || !contentOverview || !activityOverview || !communicationOverview) {
    return (
      <div className="route-gate">
        <div className="route-gate-card">
          <p className="eyebrow">Dashboard Unavailable</p>
          <h1>The family hub could not load just yet.</h1>
          <p>{error || "Please try again in a moment."}</p>
          <div className="login-actions">
            <button className="button-secondary" onClick={() => navigate("/")} type="button">
              Back Home
            </button>
            <button className="button-primary" onClick={() => window.location.reload()} type="button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-layout">
      <div className="scene-shell" aria-hidden="true">
        <SunflowerScene lighting="night" />
      </div>

      <div className="scene-wash" aria-hidden="true" />

      <div className="dashboard-shell">
        <div className="dashboard-toolbar">
          <Link className="button-secondary dashboard-toolbar-link" to="/">
            Back to Public Site
          </Link>
          <button className="button-secondary dashboard-toolbar-link" onClick={handleLogout} type="button">
            Sign Out
          </button>
        </div>

        <section className="dashboard-hero">
          <p className="eyebrow">Private Family Portal</p>
          <h1>{dashboardData.reminder.title}</h1>
          <p>
            Signed in as {user.name} with the <strong>{user.role}</strong> role. This
            portal is now session-backed and actively running family publishing and
            household coordination tools.
          </p>

          <div className="dashboard-digest-list">
            {dashboardData.digest.map((item) => (
              <article className="dashboard-digest-card" key={item}>
                <span className="panel-badge">Today's Note</span>
                <p>{item}</p>
              </article>
            ))}
          </div>

          <div className="permission-chip-row">
            {dashboardData.permissions.map((permission) => (
              <span className="permission-chip" key={permission}>
                {permission}
              </span>
            ))}
          </div>
        </section>

        <div className="dashboard-grid">
          {dashboardData.sections.map((section) => (
            <section className="dashboard-card" id={section.id} key={section.id}>
              <span className="panel-badge">Family Hub Section</span>
              <h2>{section.title}</h2>
              <p>{section.description}</p>
            </section>
          ))}
        </div>

        <FamilyActivityHub
          overview={activityOverview}
          onRefresh={refreshActivityOverview}
          user={user}
        />
        <FamilyCommunicationHub
          overview={communicationOverview}
          onRefresh={refreshCommunicationOverview}
          user={user}
        />
        <FamilyContentStudio
          overview={contentOverview}
          onRefresh={refreshContentOverview}
          user={user}
        />
      </div>

      {showReminder ? (
        <WelcomeReminderModal
          onClose={() => setShowReminder(false)}
          reminder={dashboardData.reminder}
        />
      ) : null}
    </div>
  )
}
