// =============================================================================
// Features: Auth - TanStack Query Hooks
// =============================================================================
// Feature-based organization: each feature folder contains its own
// query hooks, components, and utilities. This keeps related code together
// and makes features easy to find, modify, or remove.
//
// TanStack Query handles:
// - Server state caching and synchronization
// - Automatic refetching and background updates
// - Loading/error states without manual management
// - Optimistic updates and mutation invalidation
// =============================================================================

'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/lib/constants';
import { useAuthStore } from '@/store/auth.store';
import type { LoginRequest, RegisterRequest } from '@/types/auth.type';

/**
 * Hook for handling login mutation with TanStack Query.
 * Provides loading state, error handling, and automatic redirect on success.
 */
export function useLoginMutation() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (credentials: LoginRequest) => login(credentials),
    onSuccess: () => {
      router.push(ROUTES.ADMIN.DASHBOARD);
    },
  });
}

/**
 * Hook for handling registration mutation.
 */
export function useRegisterMutation() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: () => {
      router.push(ROUTES.ADMIN.DASHBOARD);
    },
  });
}
