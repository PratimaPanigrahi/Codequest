// src/services/authService.js
import api from '../api/axios.js'
import { setToken, removeToken } from '../utils/tokenHelper.js'
import { handleError } from '../utils/handleError.js'

const authService = {}

// -------------------------
// Login user
// -------------------------
authService.login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password })
    const { token, refreshToken, user, expiresIn } = response.data

    // Save token with optional expiry
    setToken(token, expiresIn || 3600)

    // Optionally store refreshToken in localStorage/sessionStorage
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken)

    return { user, token }
  } catch (error) {
    const { message, type } = handleError(error)
    throw { message, type }
  }
}

// -------------------------
// Register user
// -------------------------
authService.register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData)
    const { token, refreshToken, user, expiresIn } = response.data

    setToken(token, expiresIn || 3600)
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken)

    return { user, token }
  } catch (error) {
    const { message, type } = handleError(error)
    throw { message, type }
  }
}

// -------------------------
// Get user profile
// -------------------------
authService.getProfile = async () => {
  try {
    const response = await api.get('/auth/profile')
    return response.data
  } catch (error) {
    const { message, type } = handleError(error)
    throw { message, type }
  }
}

// -------------------------
// Update user profile
// -------------------------
authService.updateProfile = async (updates) => {
  try {
    const response = await api.put('/auth/profile', updates)
    return response.data
  } catch (error) {
    const { message, type } = handleError(error)
    throw { message, type }
  }
}

// -------------------------
// Update password
// -------------------------
authService.updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/auth/password', { currentPassword, newPassword })
    return response.data
  } catch (error) {
    const { message, type } = handleError(error)
    throw { message, type }
  }
}

// -------------------------
// Refresh token
// -------------------------
authService.refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) throw new Error('No refresh token available')

    const response = await api.post('/auth/refresh', { refreshToken })
    const { token, expiresIn } = response.data

    setToken(token, expiresIn || 3600)
    return token
  } catch (error) {
    removeToken()
    localStorage.removeItem('refreshToken')
    const { message, type } = handleError(error)
    throw { message, type }
  }
}

// -------------------------
// Password reset (request & confirm)
// -------------------------
authService.requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/auth/password-reset/request', { email })
    return response.data
  } catch (error) {
    const { message, type } = handleError(error)
    throw { message, type }
  }
}

authService.confirmPasswordReset = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/password-reset/confirm', { token, newPassword })
    return response.data
  } catch (error) {
    const { message, type } = handleError(error)
    throw { message, type }
  }
}

// -------------------------
// Logout user
// -------------------------
authService.logout = () => {
  removeToken()
  localStorage.removeItem('refreshToken')
}

export default authService
