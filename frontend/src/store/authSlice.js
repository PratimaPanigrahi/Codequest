import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios.js";
import { setToken, removeToken, getToken } from "../utils/tokenHelper.js";
import { handleError } from "../utils/handleError.js";

// --- REGISTER USER ---
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", credentials);
      const { token, name, email, role } = response.data;

      setToken(token);

      const user = { name, email, role, selectedCourses: [] };
      localStorage.setItem("user", JSON.stringify(user));

      return { token, user };
    } catch (error) {
      return rejectWithValue(handleError(error).message);
    }
  }
);

// --- LOGIN USER ---
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const { token, name, email, role, selectedCourses } = response.data;

      setToken(token);

      const user = { name, email, role, selectedCourses: selectedCourses || [] };
      localStorage.setItem("user", JSON.stringify(user));

      return { token, user };
    } catch (error) {
      return rejectWithValue(handleError(error).message);
    }
  }
);

// --- LOGOUT USER ---
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  removeToken();
  localStorage.removeItem("user");
  return null;
});

// --- INITIAL STATE ---
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: getToken(),
  isAuthenticated: !!getToken(),
  loading: false,
  error: null,
};

// --- SLICE ---
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Add a course to user's enrolled courses
    updateUserCourse: (state, action) => {
      if (!state.user) return;

      const { course, date } = action.payload;

      // Initialize array if it doesn't exist
      if (!state.user.selectedCourses) state.user.selectedCourses = [];

      // Prevent duplicate enrollment
      const exists = state.user.selectedCourses.find((c) => c.course === course);
      if (!exists) {
        state.user.selectedCourses.push({ course, date });
      }

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    // REGISTER
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
    });

    // LOGIN
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
    });

    // LOGOUT
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    });
  },
});

export const { updateUserCourse } = authSlice.actions;
export default authSlice.reducer;
