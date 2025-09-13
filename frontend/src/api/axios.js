// src/api/axios.js
import axios from 'axios'
import { handleError } from '../utils/handleError.js'
import { getToken, setToken, removeToken } from '../utils/tokenHelper.js'

// Get base URL from .env (fallback to local backend)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Flag to avoid multiple refresh calls at once
let isRefreshing = false
let refreshSubscribers = []

// Function to notify all subscribers when token is refreshed
const onTokenRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken))
  refreshSubscribers = []
}

// Function to add subscribers while waiting for refresh
const addRefreshSubscriber = (cb) => {
  refreshSubscribers.push(cb)
}

// Request interceptor: attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: centralized error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { type, message } = handleError(error)

    // If unauthorized, try refreshing token
    if (type === 'auth' && error.response?.status === 401) {
      const originalRequest = error.config

      if (!isRefreshing) {
        isRefreshing = true
        try {
          const refreshToken = localStorage.getItem('refreshToken')
          if (!refreshToken) throw new Error('No refresh token')

          // Call backend refresh API
          const res = await axios.post(`${API_URL}/auth/refresh`, {
            token: refreshToken,
          })

          const { token: newToken, expiresIn, newRefreshToken } = res.data

          // Save new tokens
          setToken(newToken, expiresIn)
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken)
          }

          // Retry all failed requests
          onTokenRefreshed(newToken)
          isRefreshing = false

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        } catch (refreshError) {
          isRefreshing = false
          removeToken()
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
          return Promise.reject({ type: 'auth', message: 'Session expired. Please login again.' })
        }
      }

      // If refresh is already happening, wait until it's done
      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          resolve(api(originalRequest))
        })
      })
    }

    return Promise.reject({ type, message })
  }
)

export default api
