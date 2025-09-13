// src/services/lessonService.js
import api from '../api/axios.js'
import { handleError } from '../utils/handleError.js'
import { getToken } from '../utils/tokenHelper.js'

const lessonService = {}

// Helper to check if current user is admin
const isAdmin = () => {
  const userString = localStorage.getItem('user')
  if (!userString) return false
  const user = JSON.parse(userString)
  return user.role === 'admin'
}

// -------------------------
// Get all lessons
// -------------------------
lessonService.getLessons = async () => {
  try {
    const response = await api.get('/lessons')
    return response.data
  } catch (error) {
    const { message, type } = handleError(error)
    throw { message, type }
  }
}

// -------------------------
// Get lesson by ID
// -------------------------
lessonService.getLessonById = async (id) => {
  try {
    const response = await api.get(`/lessons/${id}`)
    return response.data
  } catch (error) {
    const { message, type } = handleError(error)
    throw { message, type }
  }
}

// -------------------------
// Create a new lesson (admin only)
// -------------------------
lessonService.createLesson = async (lessonData) => {
  try {
    if (!isAdmin()) throw { message: 'Admin access required', type: 'auth' }

    const token = getToken()
    const response = await api.post('/lessons', lessonData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    const { message, type } = handleError(error)
    throw { message, type }
  }
}

// -------------------------
// Update lesson (admin only)
// -------------------------
lessonService.updateLesson = async (id, updates) => {
  try {
    if (!isAdmin()) throw { message: 'Admin access required', type: 'auth' }

    const token = getToken()
    const response = await api.put(`/lessons/${id}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    const { message, type } = handleError(error)
    throw { message, type }
  }
}

// -------------------------
// Delete lesson (admin only)
// -------------------------
lessonService.deleteLesson = async (id) => {
  try {
    if (!isAdmin()) throw { message: 'Admin access required', type: 'auth' }

    const token = getToken()
    const response = await api.delete(`/lessons/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    const { message, type } = handleError(error)
    throw { message, type }
  }
}

export default lessonService
