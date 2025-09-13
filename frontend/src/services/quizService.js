// src/services/quizService.js
import api from '../api/axios.js'
import { handleError } from '../utils/handleError.js'
import { getToken, setToken, removeToken } from '../utils/tokenHelper.js'

const quizService = {}

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

// -------------------------
// Optional: Refresh token support
// -------------------------
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
// Get all quizzes
// -------------------------
quizService.getQuizzes = async () => {
  try {
    const response = await api.get('/quizzes')
    return response.data
  } catch (error) {
    const { message, type } = handleError(error)
    // Optional: auto-refresh token on auth error
    if (type === 'auth') await refreshToken()
    throw { message, type }
  }
}

// -------------------------
// Get quiz by ID
// -------------------------
quizService.getQuizById = async (id) => {
  try {
    const response = await api.get(`/quizzes/${id}`)
    return response.data
  } catch (error) {
    const { message, type } = handleError(error)
    if (type === 'auth') await refreshToken()
    throw { message, type }
  }
}

// -------------------------
// Create quiz (roles: admin, moderator)
// -------------------------
quizService.createQuiz = async (quizData) => {
  try {
    if (!hasRole(['admin', 'moderator']))
      throw { message: 'Insufficient permissions', type: 'auth' }

    const token = getToken()
    const response = await api.post('/quizzes', quizData, {
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
// Update quiz (roles: admin, moderator)
// -------------------------
quizService.updateQuiz = async (id, updates) => {
  try {
    if (!hasRole(['admin', 'moderator']))
      throw { message: 'Insufficient permissions', type: 'auth' }

    const token = getToken()
    const response = await api.put(`/quizzes/${id}`, updates, {
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
// Delete quiz (roles: admin only)
// -------------------------
quizService.deleteQuiz = async (id) => {
  try {
    if (!hasRole(['admin'])) throw { message: 'Insufficient permissions', type: 'auth' }

    const token = getToken()
    const response = await api.delete(`/quizzes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    const { message, type } = handleError(error)
    if (type === 'auth') await refreshToken()
    throw { message, type }
  }
}

export default quizService
