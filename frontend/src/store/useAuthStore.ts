import { create } from 'zustand';
import { getCurrentUser, login as apiLogin, logout as apiLogout, register as apiRegister } from '../services/authService';

export interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  matric_number?: string;
  phone?: string;
  faculty?: string;
  department?: string;
  is_active: boolean;
  role: { id: number; name: string; display_name: string };
}

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await getCurrentUser();
      if (user) {
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiLogin(credentials);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      const msg = error?.message || error?.response?.data?.message || 'Login failed';
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await apiRegister(data);
      set({ isLoading: false });
    } catch (error: any) {
      const msg = error?.message || 'Registration failed';
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await apiLogout();
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
