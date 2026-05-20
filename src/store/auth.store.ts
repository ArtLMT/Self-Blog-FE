// =============================================================================
// Store: Auth Store (Zustand)
// =============================================================================
// Global authentication state management.
//
// ARCHITECTURE DECISION: Zustand over Redux because:
// - Minimal boilerplate (no actions, reducers, dispatch)
// - No provider wrapper needed (works outside React tree)
// - Built-in TypeScript support
// - Tiny bundle size (~1kb)
//
// The store handles:
// - Current user state
// - Login/logout/register flows
// - Token persistence in localStorage
// - Hydration from localStorage on app load
// =============================================================================

import { create } from 'zustand';

import { STORAGE_KEYS } from '@/lib/constants';
import { authService } from '@/services/auth.service';
import type { LoginRequest, RegisterRequest, User } from '@/types/auth.type';

interface AuthState {
  /** Current authenticated user (null when logged out) */
  user: User | null;
  /** Whether the initial hydration check has completed */
  isInitialized: boolean;
  /** Loading state for auth operations */
  isLoading: boolean;
  /** Error message from the last failed operation */
  error: string | null;
}

interface AuthActions {
  /** Authenticate with email/password */
  login: (credentials: LoginRequest) => Promise<void>;
  /** Create a new account */
  register: (data: RegisterRequest) => Promise<void>;
  /** Clear session and tokens */
  logout: () => Promise<void>;
  /** Restore user from persisted tokens (called on app mount) */
  initialize: () => void;
  /** Clear any auth errors */
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  user: null,
  isInitialized: false,
  isLoading: false,
  error: null,

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authService.login(credentials);
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
      set({ user: data.user, isLoading: false });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Login failed. Please try again.';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { data: response } = await authService.register(data);
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      set({ user: response.user, isLoading: false });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Registration failed. Please try again.';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore errors — we clear tokens regardless
    } finally {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      set({ user: null });
    }
  },

  initialize: () => {
    if (typeof window === 'undefined') {
      set({ isInitialized: true });
      return;
    }
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      // TODO: Optionally call a /me endpoint to validate token + get user data
      // For now, we just mark as initialized; the 401 interceptor handles expiry
    }
    set({ isInitialized: true });
  },

  clearError: () => set({ error: null }),
}));
