// src/services/progressService.js
import api from '../api/axios.js'
import { handleError } from '../utils/handleError.js'
import { getToken, setToken, removeToken } from '../utils/tokenHelper.js'

const progressService = {}

// Helper to get current user role
const getUserRole = () => {
  const userString = localStorage.getItem('user')
  if (!userString) return null
  const user = JSON.parse(userString)
  return user.role
}

// Helper to check if user has required role
const hasRole = (roles = []) => {
  const role = getUserRole()
  return roles.includes(role)
}

// Optional: Refresh token support
const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem('refreshToken')
    if (!refresh) throw new Error('No refresh token found')
    const response = await api.post('/auth/refresh', { token: refresh })
    const { token, expiresIn } = response.data
    setToken(token, expiresIn)
    return token
  } catch (err) {
    removeToken()
    window.location.href = '/login'
    throw { message: 'Session expired. Please login again.', type: 'auth' }
  }
}

// -------------------------
// Get progress for current user
// -------------------------
progressService.getProgress = async () => {
  try {
    const response = await api.get('/progress')
    return response.data
  } catch (error) {
    const { message, type } = handleError(error)
    if (type === 'auth') await refreshToken()
    throw { message, type }
  }
}

// -------------------------
// Update progress (roles: user, admin)
// -------------------------
progressService.updateProgress = async (lessonId, progressData) => {
  try {
    if (!hasRole(['user', 'admin'])) throw { message: 'Insufficient permissions', type: 'auth' }

    const token = getToken()
    const response = await api.put(`/progress/${lessonId}`, progressData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    const { message, type } = handleError(error)
    if (type === 'auth') await refreshToken()
    throw { message, type }
  }
}

// -------------------------
// Reset progress (roles: admin only)
// -------------------------
progressService.resetProgress = async (userId) => {
  try {
    if (!hasRole(['admin'])) throw { message: 'Insufficient permissions', type: 'auth' }

    const token = getToken()
    const response = await api.delete(`/progress/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    const { message, type } = handleError(error)
    if (type === 'auth') await refreshToken()
    throw { message, type }
  }
}

export default progressService
