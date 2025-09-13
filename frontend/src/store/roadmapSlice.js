// src/store/roadmapSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios.js'
import { handleError } from '../utils/handleError.js'
import { removeToken } from '../utils/tokenHelper.js'

// ------------------------
// Async Thunks
// ------------------------

// Fetch all roadmap items
export const fetchRoadmap = createAsyncThunk(
  'roadmap/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/roadmap')
      return data
    } catch (err) {
      const { message, type } = handleError(err)
      if (type === 'auth') removeToken()
      return rejectWithValue({ message, type })
    }
  }
)

// Add a roadmap item (admin only)
export const addRoadmapItem = createAsyncThunk(
  'roadmap/add',
  async ({ roadmapData, role }, { rejectWithValue }) => {
    try {
      if (role !== 'admin') {
        return rejectWithValue({ message: 'Unauthorized: Admin only', type: 'auth' })
      }
      const { data } = await api.post('/roadmap', roadmapData)
      return data
    } catch (err) {
      const { message, type } = handleError(err)
      if (type === 'auth') removeToken()
      return rejectWithValue({ message, type })
    }
  }
)

// Update a roadmap item (admin only)
export const updateRoadmapItem = createAsyncThunk(
  'roadmap/update',
  async ({ id, roadmapData, role }, { rejectWithValue }) => {
    try {
      if (role !== 'admin') {
        return rejectWithValue({ message: 'Unauthorized: Admin only', type: 'auth' })
      }
      const { data } = await api.put(`/roadmap/${id}`, roadmapData)
      return data
    } catch (err) {
      const { message, type } = handleError(err)
      if (type === 'auth') removeToken()
      return rejectWithValue({ message, type })
    }
  }
)

// Delete a roadmap item (admin only)
export const deleteRoadmapItem = createAsyncThunk(
  'roadmap/delete',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      if (role !== 'admin') {
        return rejectWithValue({ message: 'Unauthorized: Admin only', type: 'auth' })
      }
      const { data } = await api.delete(`/roadmap/${id}`)
      return { id }
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
const roadmapSlice = createSlice({
  name: 'roadmap',
  initialState: {
    roadmapList: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearRoadmapError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch roadmap
      .addCase(fetchRoadmap.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRoadmap.fulfilled, (state, action) => {
        state.loading = false
        state.roadmapList = action.payload
      })
      .addCase(fetchRoadmap.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Add roadmap
      .addCase(addRoadmapItem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addRoadmapItem.fulfilled, (state, action) => {
        state.loading = false
        state.roadmapList.push(action.payload)
      })
      .addCase(addRoadmapItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update roadmap
      .addCase(updateRoadmapItem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateRoadmapItem.fulfilled, (state, action) => {
        state.loading = false
        const index = state.roadmapList.findIndex(r => r._id === action.payload._id)
        if (index !== -1) state.roadmapList[index] = action.payload
      })
      .addCase(updateRoadmapItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete roadmap
      .addCase(deleteRoadmapItem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteRoadmapItem.fulfilled, (state, action) => {
        state.loading = false
        state.roadmapList = state.roadmapList.filter(r => r._id !== action.payload.id)
      })
      .addCase(deleteRoadmapItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearRoadmapError } = roadmapSlice.actions
export default roadmapSlice.reducer
