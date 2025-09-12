import axios from 'axios'

// Get base URL from .env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: add JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // or use your tokenHelper
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can customize error handling here
    console.error('API Error:', error.response || error)
    return Promise.reject(error)
  }
)

export default api
