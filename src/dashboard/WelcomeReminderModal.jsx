export default function WelcomeReminderModal({ onClose, reminder }) {
  if (!reminder) return null

  const jumpTo = (target) => {
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" })
    onClose()
  }

  return (
    <div className="login-modal-backdrop" onClick={onClose} role="presentation">
      <div
        aria-labelledby="family-welcome-title"
        aria-modal="true"
        className="dashboard-welcome-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <p className="eyebrow">Family Reminder</p>
        <h2 id="family-welcome-title">{reminder.title}</h2>
        <p>{reminder.body}</p>

        <div className="login-actions">
          <button className="button-secondary" onClick={onClose} type="button">
            Close
          </button>
          <button
            className="button-secondary"
            onClick={() => jumpTo(reminder.secondaryAction.target)}
            type="button"
          >
            {reminder.secondaryAction.label}
          </button>
          <button
            className="button-primary"
            onClick={() => jumpTo(reminder.primaryAction.target)}
            type="button"
          >
            {reminder.primaryAction.label}
          </button>
        </div>
      </div>
    </div>
  )
}
