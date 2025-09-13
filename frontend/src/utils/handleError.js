

export const handleError = (error) => {
  if (!error) return { message: 'Unknown error', type: 'unknown' }

  let message = ''
  let type = 'unknown'

  // Axios errors
  if (error.response) {
    const status = error.response.status
    const data = error.response.data

    if (status >= 500) {
      type = 'server'
      message = data?.message || 'Server error. Please try again later.'
    } else if (status === 401 || status === 403) {
      type = 'auth'
      message = data?.message || 'Unauthorized. Please login again.'
      // Optional: auto-logout on auth error
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpiry')
    } else if (status >= 400) {
      type = 'validation'
      message = data?.message || 'Request validation failed.'
    } else {
      type = 'unknown'
      message = data?.message || 'An error occurred.'
    }
  } else if (error.request) {
    // Request made but no response
    type = 'network'
    message = 'No response from server. Please check your connection.'
  } else {
    // Other errors
    message = error.message || 'Something went wrong.'
  }

  return { message, type }
}
