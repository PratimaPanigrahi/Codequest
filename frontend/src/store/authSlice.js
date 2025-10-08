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

      const user = { name, email, role, completedLessons: [], totalXP: 0 };
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
      const { token, name, email, role, completedLessons } = response.data;

      setToken(token);

      const user = { 
        name, email, role, 
        completedLessons: completedLessons || [], 
        totalXP: completedLessons?.reduce((a,b)=>a+b.xp,0) || 0
      };
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
    // Mark lesson as completed and add XP
    completeLesson: (state, action) => {
      if (!state.user) return;

      const { lessonId, xp, level } = action.payload;

      // Prevent duplicates
      const exists = state.user.completedLessons.find(l => l.lessonId === lessonId);
      if (!exists) {
        state.user.completedLessons.push({ lessonId, xp, level });
        state.user.totalXP += xp;
      }

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

export const { completeLesson } = authSlice.actions;
export default authSlice.reducer;
