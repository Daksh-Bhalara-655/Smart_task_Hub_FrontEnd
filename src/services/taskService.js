import api, { buildAuthConfig, getApiErrorMessage } from './api'

export async function getTasks(token) {
  try {
    const response = await api.get('/tasks', buildAuthConfig(token))
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to fetch tasks.'))
  }
}

export async function createTask(token, payload) {
  try {
    const response = await api.post('/tasks', payload, buildAuthConfig(token))
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to create task.'))
  }
}

export async function updateTask(token, taskId, payload) {
  try {
    const response = await api.put(
      `/tasks/${taskId}`,
      payload,
      buildAuthConfig(token),
    )
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to update task.'))
  }
}

export async function deleteTask(token, taskId) {
  try {
    const response = await api.delete(`/tasks/${taskId}`, buildAuthConfig(token))
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to delete task.'))
  }
}
