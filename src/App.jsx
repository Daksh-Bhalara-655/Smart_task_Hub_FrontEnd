import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import TaskPage from './pages/TaskPage'
import {
  clearStoredSession,
  getStoredSession,
  storeSession,
} from './services/authService'

function ProtectedRoute({ children, session }) {
  if (!session?.token) {
    return <Navigate replace to="/login" />
  }

  return children
}

function App() {
  const [session, setSession] = useState(() => getStoredSession())

  function handleAuthSuccess(nextSession) {
    storeSession(nextSession)
    setSession(nextSession)
  }

  function handleLogout() {
    clearStoredSession()
    setSession(null)
  }

  return (
    <div className="site-shell">
      <Navbar onLogout={handleLogout} session={session} />
      <main className="site-main">
        <Routes>
          <Route element={<HomePage session={session} />} path="/" />
          <Route
            element={
              <LoginPage onAuthSuccess={handleAuthSuccess} session={session} />
            }
            path="/login"
          />
          <Route
            element={
              <ProtectedRoute session={session}>
                <TaskPage session={session} />
              </ProtectedRoute>
            }
            path="/tasks"
          />
          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </main>
    </div>
  )
}

export default App
