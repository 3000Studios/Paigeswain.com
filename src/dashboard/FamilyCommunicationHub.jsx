import { useState } from "react"

import { fetchJson } from "../utils/api"
import { formatDate } from "../utils/formatDate"

const audiences = ["Everyone", "Parents", "Kids", "Paige", "Dad", "Jadon", "Jerica"]
const familyMembers = ["Paige", "Dad", "Jadon", "Jerica"]

export default function FamilyCommunicationHub({ onRefresh, overview, user }) {
  const isAdmin = user.role === "super-admin" || user.role === "admin"
  const [busyKey, setBusyKey] = useState("")
  const [notice, setNotice] = useState("")
  const [messageForm, setMessageForm] = useState({ audience: "Everyone", body: "" })
  const [announcementForm, setAnnouncementForm] = useState({ body: "", title: "" })
  const [complimentForm, setComplimentForm] = useState({ body: "", target: "Paige" })

  const runAction = async (key, successMessage, action) => {
    setBusyKey(key)

    try {
      await action()
      setNotice(successMessage)
      await onRefresh()
    } catch (caughtError) {
      setNotice(caughtError.message)
    } finally {
      setBusyKey("")
    }
  }

  return (
    <section className="dashboard-studio">
      <div className="metric-grid">
        <article className="metric-card">
          <span className="panel-badge">Announcements</span>
          <strong>{overview.stats.announcements}</strong>
          <p>Parent-published family notices</p>
        </article>
        <article className="metric-card">
          <span className="panel-badge">Family Messages</span>
          <strong>{overview.stats.messages}</strong>
          <p>Private notes across the family rail</p>
        </article>
        <article className="metric-card">
          <span className="panel-badge">Compliments</span>
          <strong>{overview.stats.compliments}</strong>
          <p>Encouragement cards in the private feed</p>
        </article>
      </div>

      {notice ? <p className="studio-feedback">{notice}</p> : null}

      <div className="activity-grid">
        <section className="dashboard-card studio-card">
          <span className="panel-badge">Daily Digest</span>
          <h2>What needs attention first</h2>
          <div className="compact-list">
            {overview.digest.map((entry) => (
              <article className="compact-item" key={entry.id}>
                <div className="compact-item-copy">
                  <strong>{entry.title}</strong>
                  <p>{entry.text}</p>
                </div>
                <span>{formatDate(entry.createdAt)}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-card studio-card">
          <span className="panel-badge">Announcement Rail</span>
          <h2>Family-wide notes</h2>
          <div className="compact-list">
            {overview.announcements.map((announcement) => (
              <article className="compact-item" key={announcement.id}>
                <div className="compact-item-copy">
                  <strong>{announcement.title}</strong>
                  <p>{announcement.body}</p>
                </div>
                <span>{announcement.author}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-card studio-card">
          <span className="panel-badge">Compliment Wall</span>
          <h2>Encouragement that sticks around</h2>
          <div className="compact-list">
            {overview.compliments.map((entry) => (
              <article className="compact-item" key={entry.id}>
                <div className="compact-item-copy">
                  <strong>
                    {entry.author} to {entry.target}
                  </strong>
                  <p>{entry.body}</p>
                </div>
                <span>{formatDate(entry.createdAt)}</span>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="studio-grid activity-grid-large">
        <section className="dashboard-card studio-card">
          <span className="panel-badge">Private Message Feed</span>
          <h2>Send a message into the family rail</h2>
          <form
            className="stacked-form"
            onSubmit={(event) => {
              event.preventDefault()
              runAction("send-message", "Family message sent.", async () => {
                await fetchJson("/api/family/communication/messages", {
                  body: messageForm,
                  method: "POST",
                })
                setMessageForm({ audience: "Everyone", body: "" })
              })
            }}
          >
            <select
              className="select-input"
              disabled={busyKey === "send-message"}
              value={messageForm.audience}
              onChange={(event) =>
                setMessageForm((current) => ({ ...current, audience: event.target.value }))
              }
            >
              {audiences.map((audience) => (
                <option key={audience} value={audience}>
                  {audience}
                </option>
              ))}
            </select>
            <textarea
              className="text-area"
              disabled={busyKey === "send-message"}
              placeholder="Write a private family note"
              rows={4}
              value={messageForm.body}
              onChange={(event) =>
                setMessageForm((current) => ({ ...current, body: event.target.value }))
              }
            />
            <button className="button-primary" disabled={busyKey === "send-message"} type="submit">
              Send Message
            </button>
          </form>

          <div className="compact-list">
            {overview.messages.map((message) => (
              <article className="compact-item" key={message.id}>
                <div className="compact-item-copy">
                  <strong>
                    {message.author} → {message.audience}
                  </strong>
                  <p>{message.body}</p>
                </div>
                <span>{formatDate(message.createdAt)}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-card studio-card">
          <span className="panel-badge">Compliment Builder</span>
          <h2>Leave a little encouragement</h2>
          <form
            className="stacked-form"
            onSubmit={(event) => {
              event.preventDefault()
              runAction("send-compliment", "Compliment delivered.", async () => {
                await fetchJson("/api/family/communication/compliments", {
                  body: complimentForm,
                  method: "POST",
                })
                setComplimentForm({ body: "", target: "Paige" })
              })
            }}
          >
            <select
              className="select-input"
              disabled={busyKey === "send-compliment"}
              value={complimentForm.target}
              onChange={(event) =>
                setComplimentForm((current) => ({ ...current, target: event.target.value }))
              }
            >
              {familyMembers.map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>
            <textarea
              className="text-area"
              disabled={busyKey === "send-compliment"}
              placeholder="Write something kind"
              rows={4}
              value={complimentForm.body}
              onChange={(event) =>
                setComplimentForm((current) => ({ ...current, body: event.target.value }))
              }
            />
            <button className="button-primary" disabled={busyKey === "send-compliment"} type="submit">
              Send Compliment
            </button>
          </form>
        </section>

        {isAdmin ? (
          <section className="dashboard-card studio-card">
            <span className="panel-badge">Parent Announcement Studio</span>
            <h2>Publish a family announcement</h2>
            <form
              className="stacked-form"
              onSubmit={(event) => {
                event.preventDefault()
                runAction("add-announcement", "Announcement published.", async () => {
                  await fetchJson("/api/family/communication/announcements", {
                    body: announcementForm,
                    method: "POST",
                  })
                  setAnnouncementForm({ body: "", title: "" })
                })
              }}
            >
              <input
                className="text-input"
                disabled={busyKey === "add-announcement"}
                placeholder="Announcement title"
                value={announcementForm.title}
                onChange={(event) =>
                  setAnnouncementForm((current) => ({ ...current, title: event.target.value }))
                }
              />
              <textarea
                className="text-area"
                disabled={busyKey === "add-announcement"}
                placeholder="What should the family know?"
                rows={4}
                value={announcementForm.body}
                onChange={(event) =>
                  setAnnouncementForm((current) => ({ ...current, body: event.target.value }))
                }
              />
              <button className="button-primary" disabled={busyKey === "add-announcement"} type="submit">
                Publish Announcement
              </button>
            </form>
          </section>
        ) : null}
      </div>
    </section>
  )
}
