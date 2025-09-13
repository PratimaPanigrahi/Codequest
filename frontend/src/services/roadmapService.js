// src/services/roadmapService.js
import api from '../api/axios.js'
import { handleError } from '../utils/handleError.js'
import { getToken, setToken, removeToken } from '../utils/tokenHelper.js'

const roadmapService = {}

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

// Refresh token support
const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem('refreshToken')
    if (!refresh) throw new Error('No refresh token found')

    const response = await api.post('/auth/refresh', { token: refresh })
    const { token, expiresIn, newRefreshToken } = response.data

    setToken(token, expiresIn)
    if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken)

    return token
  } catch (err) {
    removeToken()
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
    throw { message: 'Session expired. Please login again.', type: 'auth' }
  }
}

// -------------------------
// Get all roadmaps
// -------------------------
roadmapService.getRoadmaps = async () => {
  try {
    const response = await api.get('/roadmaps')
    return response.data
  } catch (error) {
    const { message, type } = handleError(error)
    if (type === 'auth') await refreshToken()
    throw { message, type }
  }
}

// -------------------------
// Get roadmap by ID
// -------------------------
roadmapService.getRoadmapById = async (id) => {
  try {
    const response = await api.get(`/roadmaps/${id}`)
    return response.data
  } catch (error) {
    const { message, type } = handleError(error)
    if (type === 'auth') await refreshToken()
    throw { message, type }
  }
}

// -------------------------
// Create roadmap (admin only)
// -------------------------
roadmapService.createRoadmap = async (data) => {
  try {
    if (!hasRole(['admin'])) throw { message: 'Insufficient permissions', type: 'auth' }

    const token = getToken()
    const response = await api.post('/roadmaps', data, {
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
// Update roadmap (admin only)
// -------------------------
roadmapService.updateRoadmap = async (id, data) => {
  try {
    if (!hasRole(['admin'])) throw { message: 'Insufficient permissions', type: 'auth' }

    const token = getToken()
    const response = await api.put(`/roadmaps/${id}`, data, {
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
// Delete roadmap (admin only)
// -------------------------
roadmapService.deleteRoadmap = async (id) => {
  try {
    if (!hasRole(['admin'])) throw { message: 'Insufficient permissions', type: 'auth' }

    const token = getToken()
    const response = await api.delete(`/roadmaps/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    const { message, type } = handleError(error)
    if (type === 'auth') await refreshToken()
    throw { message, type }
  }
}

export default roadmapService
