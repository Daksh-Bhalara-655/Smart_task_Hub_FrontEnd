import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import {
  FiLock,
  FiLogIn,
  FiMail,
  FiRefreshCw,
  FiShield,
  FiUser,
  FiUserPlus,
  FiUsers,
} from 'react-icons/fi'
import Button from '../components/Button'
import { loginUser, registerUser } from '../services/authService'

const initialFormState = {
  name: '',
  email: '',
  password: '',
}

const authPoints = [
  {
    icon: FiShield,
    title: 'Protected entry',
    text: 'Only authenticated users can reach the task dashboard, so the workspace stays scoped correctly.',
  },
  {
    icon: FiRefreshCw,
    title: 'Session restore',
    text: 'Login details are remembered locally, making refreshes and return visits much smoother.',
  },
  {
    icon: FiUsers,
    title: 'Role-aware access',
    text: 'Admins manage assignment and creation while standard users focus on the work assigned to them.',
  },
]

export default function LoginPage({ onAuthSuccess, session }) {
  const [mode, setMode] = useState('login')
  const [formState, setFormState] = useState(initialFormState)
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (session?.token) {
    return <Navigate replace to="/tasks" />
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormState((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setFeedback('')

    try {
      const action =
        mode === 'login'
          ? loginUser({
              email: formState.email,
              password: formState.password,
            })
          : registerUser(formState)

      const nextSession = await action
      onAuthSuccess(nextSession)
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-layout">
      <aside className="panel auth-sidecard">
        <p className="eyebrow">Secure access</p>
        <h1>Enter the workspace with context already in place.</h1>
        <p className="hero-copy">
          The authentication view now matches the rest of the product, with a
          cleaner split between trust, flow, and action.
        </p>

        <div className="auth-point-list">
          {authPoints.map((point) => (
            <article className="auth-point" key={point.title}>
              <point.icon aria-hidden="true" />
              <div>
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="auth-sidecard__footer">
          <span className="status-dot"></span>
          Sessions are restored automatically after refresh, so the dashboard
          can stay one step away.
        </div>
      </aside>

      <section className="panel auth-panel">
        <div className="auth-panel__header">
          <p className="eyebrow">Authentication</p>
          <h1>{mode === 'login' ? 'Welcome back.' : 'Create your account.'}</h1>
          <p>
            {mode === 'login'
              ? 'Sign in to continue into the task board.'
              : 'Register a new account and step directly into the protected workspace.'}
          </p>
        </div>

        <div className="auth-switch">
          <button
            className={mode === 'login' ? 'is-active' : ''}
            onClick={() => {
              setMode('login')
              setFeedback('')
            }}
            type="button"
          >
            Login
          </button>
          <button
            className={mode === 'register' ? 'is-active' : ''}
            onClick={() => {
              setMode('register')
              setFeedback('')
            }}
            type="button"
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' ? (
            <label className="field-block">
              <span>
                <FiUser aria-hidden="true" />
                Full name
              </span>
              <input
                className="form-control"
                name="name"
                onChange={handleChange}
                placeholder="Aarav Sharma"
                required
                type="text"
                value={formState.name}
              />
            </label>
          ) : null}

          <label className="field-block">
            <span>
              <FiMail aria-hidden="true" />
              Email
            </span>
            <input
              className="form-control"
              name="email"
              onChange={handleChange}
              placeholder="name@example.com"
              required
              type="email"
              value={formState.email}
            />
          </label>

          <label className="field-block">
            <span>
              <FiLock aria-hidden="true" />
              Password
            </span>
            <input
              className="form-control"
              minLength="6"
              name="password"
              onChange={handleChange}
              placeholder="Enter your password"
              required
              type="password"
              value={formState.password}
            />
          </label>

          {feedback ? <div className="alert alert-danger mb-0">{feedback}</div> : null}

          <Button
            className="w-100 justify-content-center"
            disabled={submitting}
            icon={mode === 'login' ? FiLogIn : FiUserPlus}
            type="submit"
          >
            {submitting
              ? 'Submitting...'
              : mode === 'login'
                ? 'Sign in'
                : 'Create account'}
          </Button>
        </form>
      </section>
    </div>
  )
}
