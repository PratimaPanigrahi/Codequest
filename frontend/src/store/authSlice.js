// src/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios.js";
import { setToken, removeToken, getToken } from "../utils/tokenHelper.js";
import { handleError } from "../utils/handleError.js";

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", credentials);
      const { token, name, email, role } = response.data;
      setToken(token);
      return { token, user: { name, email, role } };
    } catch (error) {
      return rejectWithValue(handleError(error)); // Pass the full object
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const { token, name, email, role } = response.data;
      setToken(token);
      return { token, user: { name, email, role } };
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  removeToken();
  return null;
});

const initialState = {
  user: null,
  token: getToken(),
  isAuthenticated: !!getToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
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
      state.error = action.payload; // now an object {message, type}
      state.isAuthenticated = false;
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

export default authSlice.reducer;
