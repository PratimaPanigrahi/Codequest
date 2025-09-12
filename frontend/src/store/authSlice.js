import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios.js'
import { setToken, removeToken, getToken } from '../utils/tokenHelper.js'
import { handleError } from '../utils/handleError.js'

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials)
      const { token, user } = response.data

      // Save token to localStorage
      setToken(token)

      return { token, user }
    } catch (error) {
      return rejectWithValue(handleError(error))
    }
  }
)

// Async thunk for logout
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  removeToken()
  return null
})

// Async thunk for fetching current user
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      return rejectWithValue(handleError(error))
    }
  }
)

// Async thunk for updating user profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/auth/profile', profileData)
      return response.data
    } catch (error) {
      return rejectWithValue(handleError(error))
    }
  }
)

const initialState = {
  user: null,        // includes role
  token: getToken(), // restore token if available
  loading: false,
  error: null,
}

// Helper to auto logout if token expired
const checkTokenExpiry = () => {
  const token = getToken()
  if (!token) {
    return true // expired
  }
  return false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null
      state.token = null
    })

    // Fetch current user
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      // Auto logout if token expired
      if (checkTokenExpiry()) {
        state.user = null
        state.token = null
        removeToken()
      } else {
        state.loading = false
        state.user = action.payload
      }
    })
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // Update profile
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload
    })
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
  },
})

export default authSlice.reducer
