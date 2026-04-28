import axios from 'axios'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.VITE_API_URL ||
  process.env.API_URL ||
  process.env.VITE_PUBLIC_API_URL ||
  '/api'

const api = axios.create({
  baseURL: API_URL,
})

export function buildAuthConfig(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export function getApiErrorMessage(
  error,
  fallback = 'Something went wrong. Please try again.',
) {
  return error.response?.data?.message || error.message || fallback
}

export { API_URL }

export default api
