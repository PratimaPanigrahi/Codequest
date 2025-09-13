// src/store/lessonSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios.js'
import { handleError } from '../utils/handleError.js'
import { getToken, removeToken } from '../utils/tokenHelper.js'

// ------------------------
// Async Thunks for CRUD
// ------------------------

// Fetch all lessons
export const fetchLessons = createAsyncThunk(
  'lessons/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/lessons')
      return data
    } catch (err) {
      const { message, type } = handleError(err)
      if (type === 'auth') removeToken()
      return rejectWithValue({ message, type })
    }
  }
)

// Create a lesson (admin only)
export const createLesson = createAsyncThunk(
  'lessons/create',
  async (lessonData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/lessons', lessonData)
      return data
    } catch (err) {
      const { message, type } = handleError(err)
      if (type === 'auth') removeToken()
      return rejectWithValue({ message, type })
    }
  }
)

// Update a lesson (admin only)
export const updateLesson = createAsyncThunk(
  'lessons/update',
  async ({ id, lessonData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/lessons/${id}`, lessonData)
      return data
    } catch (err) {
      const { message, type } = handleError(err)
      if (type === 'auth') removeToken()
      return rejectWithValue({ message, type })
    }
  }
)

// Delete a lesson (admin only)
export const deleteLesson = createAsyncThunk(
  'lessons/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/lessons/${id}`)
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
const lessonSlice = createSlice({
  name: 'lessons',
  initialState: {
    lessons: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearLessonError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch lessons
      .addCase(fetchLessons.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLessons.fulfilled, (state, action) => {
        state.loading = false
        state.lessons = action.payload
      })
      .addCase(fetchLessons.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create lesson
      .addCase(createLesson.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        state.loading = false
        state.lessons.push(action.payload)
      })
      .addCase(createLesson.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update lesson
      .addCase(updateLesson.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        state.loading = false
        const index = state.lessons.findIndex(l => l._id === action.payload._id)
        if (index !== -1) state.lessons[index] = action.payload
      })
      .addCase(updateLesson.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete lesson
      .addCase(deleteLesson.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.loading = false
        state.lessons = state.lessons.filter(l => l._id !== action.payload)
      })
      .addCase(deleteLesson.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearLessonError } = lessonSlice.actions
export default lessonSlice.reducer
