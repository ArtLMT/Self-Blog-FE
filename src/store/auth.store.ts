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

// No unused imports
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
  initialize: () => Promise<void>;
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
      const response = await authService.login(credentials);
      const authData = response.data.data;
      if (!authData) {
        throw new Error('Invalid credentials');
      }
      const userObj = {
        username: authData.username,
        role: authData.role,
      };
      localStorage.setItem('selfblog_user_session', JSON.stringify(userObj));
      if (typeof document !== 'undefined') {
        document.cookie = 'selfblog_logged_in=true; path=/; max-age=86400; SameSite=Lax';
      }
      set({ user: userObj, isLoading: false });
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
      const response = await authService.register(data);
      const authData = response.data.data;
      if (!authData) {
        throw new Error('Registration failed');
      }
      const userObj = {
        username: authData.username,
        role: authData.role,
      };
      localStorage.setItem('selfblog_user_session', JSON.stringify(userObj));
      if (typeof document !== 'undefined') {
        document.cookie = 'selfblog_logged_in=true; path=/; max-age=86400; SameSite=Lax';
      }
      set({ user: userObj, isLoading: false });
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
      // Ignore errors — we clear session regardless
    } finally {
      localStorage.removeItem('selfblog_user_session');
      if (typeof document !== 'undefined') {
        document.cookie = 'selfblog_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      }
      set({ user: null });
    }
  },

  initialize: async () => {
    if (typeof window === 'undefined') {
      set({ isInitialized: true });
      return;
    }
    const hasCookie = document.cookie.includes('selfblog_logged_in=true');
    const sessionStr = localStorage.getItem('selfblog_user_session');

    if (hasCookie && sessionStr) {
      try {
        await authService.refreshToken({});
        const userObj = JSON.parse(sessionStr);
        set({ user: userObj });
      } catch {
        localStorage.removeItem('selfblog_user_session');
        document.cookie = 'selfblog_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
        set({ user: null });
      }
    } else {
      localStorage.removeItem('selfblog_user_session');
      document.cookie = 'selfblog_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      set({ user: null });
    }
    
    set({ isInitialized: true });
  },

  clearError: () => set({ error: null }),
}));
