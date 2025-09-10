import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../services/api';
import { cookieUtils } from '../utils/cookies';

interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: 'customer' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isVerifying: boolean;
}

const initialState: AuthState = {
  user: cookieUtils.getUser(),
  token: cookieUtils.getToken() || null,
  loading: false,
  error: null,
  isVerifying: false,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await authAPI.login({ email, password });
    cookieUtils.setToken(response.data.token);
    cookieUtils.setUser(response.data.user);
    return response.data;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; phone: string; password: string }) => {
    const response = await authAPI.register(userData);
    cookieUtils.setToken(response.data.token);
    cookieUtils.setUser(response.data.user);
    return response.data;
  }
);

export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async () => {
    const token = cookieUtils.getToken();
    if (!token) throw new Error('No token found');
    const response = await authAPI.verifyToken();
    cookieUtils.setUser(response.data.user);
    return response.data;
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async () => {
    await authAPI.logout();
    cookieUtils.clearAll();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      cookieUtils.clearAll();
      // Clear cart from localStorage when user logs out
      localStorage.removeItem('cart');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(verifyToken.pending, (state) => {
        state.isVerifying = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isVerifying = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(verifyToken.rejected, (state) => {
        state.isVerifying = false;
        state.user = null;
        state.token = null;
        cookieUtils.clearAll();
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        // Clear cart from localStorage when user logs out
        localStorage.removeItem('cart');
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;