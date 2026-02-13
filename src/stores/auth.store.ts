import { create } from 'zustand';
import type { AuthUser } from '@/types/auth';
import { authService } from '@/services/auth.service';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isHydrated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
  hydrate: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isHydrated: false,

  setAuth: (token: string, user: AuthUser) => {
    authService.setSession(token, user);
    set({ token, user });
  },

  clearAuth: () => {
    authService.logout();
    set({ token: null, user: null });
  },

  hydrate: () => {
    const token = authService.getToken();
    const user = authService.getUser();
    set({ token, user, isHydrated: true });
  },

  isAuthenticated: () => {
    return !!get().token && authService.isAuthenticated();
  },
}));
