// src/redux/lessonSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch lessons for a specific difficulty level
export const fetchLessonsByDifficulty = createAsyncThunk(
  "lessons/fetchByDifficulty",
  async (difficulty, thunkAPI) => {
    try {
      const response = await axios.get(`/api/lessons?difficulty=${difficulty}`);
      return response.data; // Array of lessons from backend
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const lessonSlice = createSlice({
  name: "lessons",
  initialState: {
    lessons: [],     // Holds lessons fetched from backend
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessonsByDifficulty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonsByDifficulty.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload; // Save fetched lessons
      })
      .addCase(fetchLessonsByDifficulty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch lessons";
      });
  },
});

export default lessonSlice.reducer;
