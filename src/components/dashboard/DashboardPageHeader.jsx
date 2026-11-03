import './DashboardPageHeader.css'

export function DashboardPageHeader({ eyebrow, title, description, action }) {
  return (
    <header className="dashboard-page-header">
      <div>
        {eyebrow && <p className="dashboard-page-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="dashboard-page-description">{description}</p>}
      </div>
      {action && <div className="dashboard-page-action">{action}</div>}
    </header>
  )
}
