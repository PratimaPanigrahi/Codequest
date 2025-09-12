// Save token to localStorage with optional expiry (in seconds)
export const setToken = (token, expiresIn = 3600) => { // default 1 hour
  if (token) {
    const expiryTime = new Date().getTime() + expiresIn * 1000
    const tokenData = {
      token,
      expiry: expiryTime,
    }
    localStorage.setItem('token', JSON.stringify(tokenData))
  }
}

// Get token from localStorage (checks expiry)
export const getToken = () => {
  const tokenString = localStorage.getItem('token')
  if (!tokenString) return null

  try {
    const { token, expiry } = JSON.parse(tokenString)
    if (new Date().getTime() > expiry) {
      removeToken() // token expired
      return null
    }
    return token
  } catch (error) {
    console.error('Error parsing token:', error)
    removeToken()
    return null
  }
}

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem('token')
}

// Check if user is logged in (token exists and not expired)
export const isLoggedIn = () => {
  return !!getToken()
}
