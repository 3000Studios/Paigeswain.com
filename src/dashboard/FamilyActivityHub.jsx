import { useState } from "react"

import { fetchJson } from "../utils/api"
import { formatDate } from "../utils/formatDate"

const familyMembers = ["Paige", "Dad", "Jadon", "Jerica"]
const groceryCategories = ["Produce", "Pantry", "Drinks", "Snacks", "Frozen", "Household"]

export default function FamilyActivityHub({ onRefresh, overview, user }) {
  const isAdmin = user.role === "super-admin" || user.role === "admin"
  const [busyKey, setBusyKey] = useState("")
  const [notice, setNotice] = useState("")
  const [choreForm, setChoreForm] = useState({
    assignedTo: "Jadon",
    dueLabel: "Due today",
    rewardStars: "2",
    title: "",
  })
  const [dinnerForm, setDinnerForm] = useState({ groceryHint: "", title: "" })
  const [groceryForm, setGroceryForm] = useState({ category: "Produce", name: "" })
  const [requestForm, setRequestForm] = useState({ body: "", title: "" })

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
          <span className="panel-badge">Active Chores</span>
          <strong>{overview.stats.activeChores}</strong>
          <p>Still waiting to be finished</p>
        </article>
        <article className="metric-card">
          <span className="panel-badge">Dinner Votes</span>
          <strong>{overview.stats.topDinnerVotes}</strong>
          <p>Top vote count on the board</p>
        </article>
        <article className="metric-card">
          <span className="panel-badge">Groceries Left</span>
          <strong>{overview.stats.groceryLeft}</strong>
          <p>Items still to pick up</p>
        </article>
        <article className="metric-card">
          <span className="panel-badge">Open Requests</span>
          <strong>{overview.stats.openRequests}</strong>
          <p>Family asks waiting for follow-through</p>
        </article>
      </div>

      {notice ? <p className="studio-feedback">{notice}</p> : null}

      <div className="activity-grid">
        <section className="dashboard-card studio-card">
          <span className="panel-badge">Schedule Snapshot</span>
          <h2>Today and tonight</h2>
          <div className="compact-list">
            {overview.schedule.map((event) => (
              <article className="compact-item" key={event.id}>
                <div className="compact-item-copy">
                  <strong>{event.title}</strong>
                  <p>{event.details}</p>
                </div>
                <span>{event.timeLabel}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-card studio-card">
          <span className="panel-badge">Gold Stars</span>
          <h2>Family reward board</h2>
          <div className="compact-list">
            {overview.rewards.map((entry) => (
              <article className="compact-item" key={entry.name}>
                <div className="compact-item-copy">
                  <strong>{entry.name}</strong>
                  <p>Stars earned through chores and follow-through</p>
                </div>
                <span>{entry.stars} stars</span>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-card studio-card">
          <span className="panel-badge">Activity Feed</span>
          <h2>What the family has been doing</h2>
          <div className="compact-list">
            {overview.activityFeed.map((entry) => (
              <article className="compact-item" key={entry.id}>
                <div className="compact-item-copy">
                  <p>{entry.message}</p>
                </div>
                <span>{formatDate(entry.createdAt)}</span>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="studio-grid activity-grid-large">
        <section className="dashboard-card studio-card">
          <span className="panel-badge">Chores</span>
          <h2>{isAdmin ? "Assign chores and track completions" : "Your current chore board"}</h2>

          {isAdmin ? (
            <form
              className="stacked-form"
              onSubmit={(event) => {
                event.preventDefault()
                runAction("assign-chore", "New chore assigned.", async () => {
                  await fetchJson("/api/family/activity/chores", {
                    body: {
                      ...choreForm,
                      rewardStars: Number(choreForm.rewardStars),
                    },
                    method: "POST",
                  })
                  setChoreForm({
                    assignedTo: "Jadon",
                    dueLabel: "Due today",
                    rewardStars: "2",
                    title: "",
                  })
                })
              }}
            >
              <input
                className="text-input"
                disabled={busyKey === "assign-chore"}
                placeholder="Chore title"
                value={choreForm.title}
                onChange={(event) => setChoreForm((current) => ({ ...current, title: event.target.value }))}
              />
              <div className="form-split">
                <select
                  className="select-input"
                  disabled={busyKey === "assign-chore"}
                  value={choreForm.assignedTo}
                  onChange={(event) =>
                    setChoreForm((current) => ({ ...current, assignedTo: event.target.value }))
                  }
                >
                  {familyMembers.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
                <input
                  className="text-input"
                  disabled={busyKey === "assign-chore"}
                  placeholder="Due label"
                  value={choreForm.dueLabel}
                  onChange={(event) =>
                    setChoreForm((current) => ({ ...current, dueLabel: event.target.value }))
                  }
                />
                <select
                  className="select-input"
                  disabled={busyKey === "assign-chore"}
                  value={choreForm.rewardStars}
                  onChange={(event) =>
                    setChoreForm((current) => ({ ...current, rewardStars: event.target.value }))
                  }
                >
                  <option value="1">1 star</option>
                  <option value="2">2 stars</option>
                  <option value="3">3 stars</option>
                </select>
              </div>
              <button className="button-primary" disabled={busyKey === "assign-chore"} type="submit">
                Assign Chore
              </button>
            </form>
          ) : null}

          <div className="compact-list">
            {overview.chores.map((chore) => {
              const canComplete = !chore.completed && (isAdmin || chore.assignedTo === user.name)

              return (
                <article className="compact-item" key={chore.id}>
                  <div className="compact-item-copy">
                    <strong>{chore.title}</strong>
                    <p>
                      {chore.assignedTo} · {chore.dueLabel} · {chore.rewardStars} stars
                    </p>
                  </div>
                  {canComplete ? (
                    <button
                      className="button-secondary moderation-button"
                      disabled={busyKey === `complete-${chore.id}`}
                      type="button"
                      onClick={() =>
                        runAction(`complete-${chore.id}`, "Chore marked complete.", () =>
                          fetchJson(`/api/family/activity/chores/${chore.id}/complete`, {
                            method: "POST",
                          }),
                        )
                      }
                    >
                      Complete
                    </button>
                  ) : (
                    <span>{chore.completed ? "Done" : chore.assignedTo}</span>
                  )}
                </article>
              )
            })}
          </div>
        </section>

        <section className="dashboard-card studio-card">
          <span className="panel-badge">Dinner Planner</span>
          <h2>Suggest dinner and vote together</h2>
          <form
            className="stacked-form"
            onSubmit={(event) => {
              event.preventDefault()
              runAction("add-dinner", "Dinner idea added.", async () => {
                await fetchJson("/api/family/activity/dinners", {
                  body: dinnerForm,
                  method: "POST",
                })
                setDinnerForm({ groceryHint: "", title: "" })
              })
            }}
          >
            <input
              className="text-input"
              disabled={busyKey === "add-dinner"}
              placeholder="Dinner idea"
              value={dinnerForm.title}
              onChange={(event) => setDinnerForm((current) => ({ ...current, title: event.target.value }))}
            />
            <input
              className="text-input"
              disabled={busyKey === "add-dinner"}
              placeholder="Optional grocery hint"
              value={dinnerForm.groceryHint}
              onChange={(event) =>
                setDinnerForm((current) => ({ ...current, groceryHint: event.target.value }))
              }
            />
            <button className="button-primary" disabled={busyKey === "add-dinner"} type="submit">
              Add Dinner Idea
            </button>
          </form>

          <div className="compact-list">
            {overview.dinnerIdeas.map((idea) => (
              <article className="compact-item" key={idea.id}>
                <div className="compact-item-copy">
                  <strong>{idea.title}</strong>
                  <p>
                    {idea.createdBy} · {idea.voteCount} votes · {idea.groceryHint || "No grocery hint yet"}
                  </p>
                </div>
                <button
                  className="button-secondary moderation-button"
                  disabled={idea.hasVoted || busyKey === `vote-${idea.id}`}
                  type="button"
                  onClick={() =>
                    runAction(`vote-${idea.id}`, "Dinner vote counted.", () =>
                      fetchJson(`/api/family/activity/dinners/${idea.id}/vote`, {
                        method: "POST",
                      }),
                    )
                  }
                >
                  {idea.hasVoted ? "Voted" : "Vote"}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-card studio-card">
          <span className="panel-badge">Groceries</span>
          <h2>Shared family list</h2>
          <form
            className="stacked-form"
            onSubmit={(event) => {
              event.preventDefault()
              runAction("add-grocery", "Grocery item added.", async () => {
                await fetchJson("/api/family/activity/groceries", {
                  body: groceryForm,
                  method: "POST",
                })
                setGroceryForm({ category: "Produce", name: "" })
              })
            }}
          >
            <div className="form-split form-split--two">
              <input
                className="text-input"
                disabled={busyKey === "add-grocery"}
                placeholder="Item name"
                value={groceryForm.name}
                onChange={(event) =>
                  setGroceryForm((current) => ({ ...current, name: event.target.value }))
                }
              />
              <select
                className="select-input"
                disabled={busyKey === "add-grocery"}
                value={groceryForm.category}
                onChange={(event) =>
                  setGroceryForm((current) => ({ ...current, category: event.target.value }))
                }
              >
                {groceryCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <button className="button-primary" disabled={busyKey === "add-grocery"} type="submit">
              Add Grocery Item
            </button>
          </form>

          <div className="compact-list">
            {overview.groceryItems.map((item) => (
              <article className="compact-item" key={item.id}>
                <div className="compact-item-copy">
                  <strong>{item.name}</strong>
                  <p>
                    {item.category} · Added by {item.addedBy}
                  </p>
                </div>
                <button
                  className="button-secondary moderation-button"
                  disabled={busyKey === `toggle-${item.id}`}
                  type="button"
                  onClick={() =>
                    runAction(
                      `toggle-${item.id}`,
                      item.purchased ? "Item returned to the list." : "Item marked purchased.",
                      () =>
                        fetchJson(`/api/family/activity/groceries/${item.id}/toggle`, {
                          method: "POST",
                        }),
                    )
                  }
                >
                  {item.purchased ? "Unmark" : "Purchased"}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-card studio-card">
          <span className="panel-badge">Requests</span>
          <h2>Rides, ideas, and little asks</h2>
          <form
            className="stacked-form"
            onSubmit={(event) => {
              event.preventDefault()
              runAction("add-request", "Request added to the board.", async () => {
                await fetchJson("/api/family/activity/requests", {
                  body: requestForm,
                  method: "POST",
                })
                setRequestForm({ body: "", title: "" })
              })
            }}
          >
            <input
              className="text-input"
              disabled={busyKey === "add-request"}
              placeholder="Request title"
              value={requestForm.title}
              onChange={(event) => setRequestForm((current) => ({ ...current, title: event.target.value }))}
            />
            <textarea
              className="text-area"
              disabled={busyKey === "add-request"}
              placeholder="What do you need help with?"
              rows={4}
              value={requestForm.body}
              onChange={(event) => setRequestForm((current) => ({ ...current, body: event.target.value }))}
            />
            <button className="button-primary" disabled={busyKey === "add-request"} type="submit">
              Add Request
            </button>
          </form>

          <div className="compact-list">
            {overview.requests.map((request) => (
              <article className="compact-item" key={request.id}>
                <div className="compact-item-copy">
                  <strong>{request.title}</strong>
                  <p>
                    {request.createdBy} · {request.body}
                  </p>
                </div>
                {request.status === "resolved" ? (
                  <span>Resolved</span>
                ) : isAdmin ? (
                  <button
                    className="button-secondary moderation-button"
                    disabled={busyKey === `resolve-${request.id}`}
                    type="button"
                    onClick={() =>
                      runAction(`resolve-${request.id}`, "Request resolved.", () =>
                        fetchJson(`/api/family/activity/requests/${request.id}/resolve`, {
                          method: "POST",
                        }),
                      )
                    }
                  >
                    Resolve
                  </button>
                ) : (
                  <span>Open</span>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
