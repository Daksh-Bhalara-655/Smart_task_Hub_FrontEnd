import api, { getApiErrorMessage } from './api'

const SESSION_KEY = 'smart-task-hub-session'

export async function loginUser(credentials) {
  try {
    const response = await api.post('/auth/login', credentials)
    storeSession(response.data)
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to sign in.'))
  }
}

export async function registerUser(payload) {
  try {
    const response = await api.post('/auth/register', payload)
    storeSession(response.data)
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to create account.'))
  }
}

export function getStoredSession() {
  if (typeof window === 'undefined') {
    return null
  }

  const savedSession = window.localStorage.getItem(SESSION_KEY)

  if (!savedSession) {
    return null
  }

  try {
    return JSON.parse(savedSession)
  } catch {
    window.localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function storeSession(session) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearStoredSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(SESSION_KEY)
}
