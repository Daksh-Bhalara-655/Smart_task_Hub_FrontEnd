import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
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

export default api
