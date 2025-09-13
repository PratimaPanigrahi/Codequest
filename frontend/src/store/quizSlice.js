// src/store/quizSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios.js'
import { handleError } from '../utils/handleError.js'
import { removeToken } from '../utils/tokenHelper.js'

// ------------------------
// Async Thunks for CRUD
// ------------------------

// Fetch all quizzes
export const fetchQuizzes = createAsyncThunk(
  'quizzes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/quizzes')
      return data
    } catch (err) {
      const { message, type } = handleError(err)
      if (type === 'auth') removeToken()
      return rejectWithValue({ message, type })
    }
  }
)

// Create a quiz (admin only)
export const createQuiz = createAsyncThunk(
  'quizzes/create',
  async (quizData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/quizzes', quizData)
      return data
    } catch (err) {
      const { message, type } = handleError(err)
      if (type === 'auth') removeToken()
      return rejectWithValue({ message, type })
    }
  }
)

// Update a quiz (admin only)
export const updateQuiz = createAsyncThunk(
  'quizzes/update',
  async ({ id, quizData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/quizzes/${id}`, quizData)
      return data
    } catch (err) {
      const { message, type } = handleError(err)
      if (type === 'auth') removeToken()
      return rejectWithValue({ message, type })
    }
  }
)

// Delete a quiz (admin only)
export const deleteQuiz = createAsyncThunk(
  'quizzes/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/quizzes/${id}`)
      return id
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
const quizSlice = createSlice({
  name: 'quizzes',
  initialState: {
    quizzes: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearQuizError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch quizzes
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false
        state.quizzes = action.payload
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create quiz
      .addCase(createQuiz.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.loading = false
        state.quizzes.push(action.payload)
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update quiz
      .addCase(updateQuiz.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.loading = false
        const index = state.quizzes.findIndex(q => q._id === action.payload._id)
        if (index !== -1) state.quizzes[index] = action.payload
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete quiz
      .addCase(deleteQuiz.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.loading = false
        state.quizzes = state.quizzes.filter(q => q._id !== action.payload)
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearQuizError } = quizSlice.actions
export default quizSlice.reducer
