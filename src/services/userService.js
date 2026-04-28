import api, { buildAuthConfig, getApiErrorMessage } from './api'

export async function getUsers(token) {
  try {
    const response = await api.get('/users', buildAuthConfig(token))
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to fetch users.'))
  }
}
