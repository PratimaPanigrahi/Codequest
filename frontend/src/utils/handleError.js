import { handleError } from '../utils/handleError.js'

try {
  const data = await api.get('/lessons')
  return data
} catch (err) {
  const { message, type, status } = handleError(err)
  
  if (type === 'auth') {
    // redirect to login or clear token
  } else if (type === 'validation') {
    // show form validation errors
  } else if (type === 'server') {
    // show server error toast
  }

  throw { message, type, status } // propagate for components if needed
}
