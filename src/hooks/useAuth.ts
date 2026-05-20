// =============================================================================
// Hooks: useAuth
// =============================================================================
// Convenience hook that wraps the Zustand auth store.
// Provides a clean API for components to interact with auth state.
//
// WHY A WRAPPER HOOK?
// - Components don't need to know about Zustand internals
// - Easy to add derived state (e.g., isAdmin, isAuthenticated)
// - Single import for all auth-related functionality
// =============================================================================

'use client';

import { useAuthStore } from '@/store/auth.store';

export function useAuth() {
  const {
    user,
    isInitialized,
    isLoading,
    error,
    login,
    register,
    logout,
    initialize,
    clearError,
  } = useAuthStore();

  return {
    // State
    user,
    isInitialized,
    isLoading,
    error,

    // Derived state
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',

    // Actions
    login,
    register,
    logout,
    initialize,
    clearError,
  };
}
