import { Link, NavLink } from 'react-router-dom'
import {
  FiActivity,
  FiArrowUpRight,
  FiCheckSquare,
  FiLogOut,
  FiUser,
} from 'react-icons/fi'
import Button from './Button'

function getNavClassName({ isActive }) {
  return `nav-link-pill${isActive ? ' is-active' : ''}`
}

export default function Navbar({ onLogout, session }) {
  return (
    <header className="topbar">
      <div className="topbar__brand">
        <Link className="brand-block" to="/">
          <div className="brand-mark">
            <FiCheckSquare aria-hidden="true" />
          </div>
          <div>
            <p className="eyebrow">Smart Task Hub</p>
            <p className="brand-title">Operations Workspace</p>
          </div>
        </Link>
        <span className="brand-badge">
          <FiActivity aria-hidden="true" />
          Live board
        </span>
      </div>

      <nav aria-label="Primary" className="nav-cluster">
        <NavLink className={getNavClassName} to="/">
          Home
        </NavLink>
        <NavLink className={getNavClassName} to="/tasks">
          Tasks
        </NavLink>
        {!session ? (
          <NavLink className={getNavClassName} to="/login">
            Login
          </NavLink>
        ) : null}
      </nav>

      <div className="topbar__actions">
        {session ? (
          <>
            <div className="identity-chip">
              <span className="identity-chip__icon">
                <FiUser aria-hidden="true" />
              </span>
              <div>
                <strong>{session.name}</strong>
                <span>{session.role} access</span>
              </div>
            </div>
            <Button icon={FiLogOut} onClick={onLogout} variant="secondary">
              Log out
            </Button>
          </>
        ) : (
          <Button icon={FiArrowUpRight} to="/login">
            Launch App
          </Button>
        )}
      </div>
    </header>
  )
}
