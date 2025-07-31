import { create } from 'zustand';
import { apiService, User } from '@/lib/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUserCredits: (credits: number) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      await apiService.login(email, password);
      const user = await apiService.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const user = await apiService.signup(email, password);
      // Auto-login after signup
      await apiService.login(email, password);
      const updatedUser = await apiService.getCurrentUser();
      set({ user: updatedUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    apiService.logout();
    set({ user: null, isAuthenticated: false });
  },

  refreshUser: async () => {
    try {
      const user = await apiService.getCurrentUser();
      set({ user, isAuthenticated: true });
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    }
  },

  updateUserCredits: (credits: number) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, credits } });
    }
  },
}));