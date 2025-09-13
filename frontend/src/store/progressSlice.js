// src/store/progressSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios.js'
import { handleError } from '../utils/handleError.js'
import { removeToken } from '../utils/tokenHelper.js'

// ------------------------
// Async Thunks
// ------------------------

// Fetch user progress
export const fetchProgress = createAsyncThunk(
  'progress/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/progress')
      return data
    } catch (err) {
      const { message, type } = handleError(err)
      if (type === 'auth') removeToken()
      return rejectWithValue({ message, type })
    }
  }
)

// Update progress (user-specific)
export const updateProgress = createAsyncThunk(
  'progress/update',
  async (progressData, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/progress', progressData)
      return data
    } catch (err) {
      const { message, type } = handleError(err)
      if (type === 'auth') removeToken()
      return rejectWithValue({ message, type })
    }
  }
)

// Reset progress (admin only)
export const resetProgress = createAsyncThunk(
  'progress/reset',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      if (role !== 'admin') {
        // Reject if user is not admin
        return rejectWithValue({ message: 'Unauthorized: Admin only', type: 'auth' })
      }
      const { data } = await api.delete(`/progress/${userId}`)
      return data
    } catch (err) {
      const { message, type } = handleError(err)
      if (type === 'auth') removeToken()
      return rejectWithValue({ message, type })
    }
  }
)

// ------------------------
// Slice
// ------------------------
const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    progressList: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearProgressError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch progress
      .addCase(fetchProgress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.loading = false
        state.progressList = action.payload
      })
      .addCase(fetchProgress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update progress
      .addCase(updateProgress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        state.loading = false
        const index = state.progressList.findIndex(p => p._id === action.payload._id)
        if (index !== -1) state.progressList[index] = action.payload
        else state.progressList.push(action.payload)
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Reset progress
      .addCase(resetProgress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetProgress.fulfilled, (state, action) => {
        state.loading = false
        state.progressList = state.progressList.filter(p => p.userId !== action.payload.userId)
      })
      .addCase(resetProgress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearProgressError } = progressSlice.actions
export default progressSlice.reducer
