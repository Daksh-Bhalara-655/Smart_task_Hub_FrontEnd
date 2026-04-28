import {
  FiArrowRight,
  FiBarChart2,
  FiClock,
  FiLayers,
  FiShield,
} from 'react-icons/fi'
import Button from '../components/Button'

const featureCards = [
  {
    icon: FiLayers,
    title: 'Organized building blocks',
    text: 'Components, pages, services, and styles are already separated, so new UI features slot in cleanly.',
  },
  {
    icon: FiBarChart2,
    title: 'Backend-aware data flow',
    text: 'The frontend is already wired to auth, tasks, and users through the Express API and proxy setup.',
  },
  {
    icon: FiShield,
    title: 'Role-based movement',
    text: 'Protected routes and stored sessions keep admins and team members in the right workflow automatically.',
  },
]

const workflowPoints = [
  {
    title: 'Sign in without friction',
    text: 'The auth view is connected and ready, so account creation and login lead directly into the protected workspace.',
  },
  {
    title: 'Route work with clarity',
    text: 'Tasks can be filtered, searched, updated, and viewed through a single board instead of scattered screens.',
  },
  {
    title: 'Scale the experience',
    text: 'Because the frontend structure is already modular, adding analytics, detail views, and new workflows stays manageable.',
  },
]

const quickFacts = [
  { label: 'Stack', value: 'React + Vite' },
  { label: 'Routing', value: 'Role-aware flow' },
  { label: 'Sync path', value: '/api to :5000' },
]

const previewRows = [
  { label: 'Task intake', value: 'Create and assign work', state: 'Admin ready' },
  { label: 'Board control', value: 'Filter by status and search', state: 'Live view' },
  { label: 'Session memory', value: 'Restore login after refresh', state: 'Stored locally' },
]

export default function HomePage({ session }) {
  return (
    <div className="page-stack">
      <section className="hero-panel panel">
        <div className="hero-panel__content">
          <p className="eyebrow">Workflow control room</p>
          <h1>Run tasks like a shared operating system for your team.</h1>
          <p className="hero-copy">
            Smart Task Hub now looks and feels like a real workspace instead of
            a starter template, with a cleaner dashboard rhythm for planning,
            assigning, and tracking work.
          </p>

          <div className="hero-actions">
            <Button
              icon={FiArrowRight}
              to={session ? '/tasks' : '/login'}
            >
              {session ? 'Open task board' : 'Enter the workspace'}
            </Button>
            <Button to="/tasks" variant="secondary">
              Preview the board
            </Button>
          </div>

          <div className="hero-fact-grid">
            {quickFacts.map((item) => (
              <article className="hero-fact-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
        </div>

        <aside className="hero-panel__sidebar">
          <div className="hero-preview">
            <div className="hero-preview__header">
              <p className="eyebrow">Today&apos;s board</p>
              <h2>What this UI is optimized for</h2>
            </div>

            <div className="hero-preview__list">
              {previewRows.map((item) => (
                <article className="hero-preview__item" key={item.label}>
                  <div>
                    <span className="hero-preview__item-label">{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                  <span className="hero-preview__item-badge">{item.state}</span>
                </article>
              ))}
            </div>

            <p className="hero-preview__footer">
              {session
                ? `Signed in as ${session.name}.`
                : 'Guest preview active.'}{' '}
              The UI is already connected to the backend request flow.
            </p>
          </div>
        </aside>
      </section>

      <section className="content-grid content-grid--home">
        <div className="panel surface-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Built for growth</p>
              <h2>Sharper structure, smoother delivery.</h2>
              <p className="section-lead">
                The frontend is set up to support real project work, not just a
                welcome screen.
              </p>
            </div>
          </div>
          <div className="feature-grid">
            {featureCards.map((card) => (
              <article className="feature-card" key={card.title}>
                <card.icon className="feature-card__icon" aria-hidden="true" />
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="panel surface-card">
          <p className="eyebrow">Flow</p>
          <h2>How the workspace now feels</h2>
          <div className="timeline-list">
            {workflowPoints.map((point, index) => (
              <article className="timeline-item" key={point.title}>
                <span className="timeline-item__step">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3>{point.title}</h3>
                  <p>{point.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="hero-preview__footer">
            <FiClock aria-hidden="true" /> Routes, services, and styling are in
            place so the next UI pass can go deeper without restructuring first.
          </div>
        </aside>
      </section>
    </div>
  )
}
