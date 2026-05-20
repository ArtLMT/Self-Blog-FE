// =============================================================================
// Providers: TanStack Query
// =============================================================================
// Client Component wrapper that provides TanStack Query context to the app.
// Must be a Client Component because it uses React context internally.
// Placed in the root layout to make queries available everywhere.
// =============================================================================

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
  // Create the QueryClient inside useState to avoid re-creating it on every render
  // while still ensuring each request gets its own client in SSR
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Don't refetch on window focus in development (less noisy)
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
            // Retry failed requests once
            retry: 1,
            // Consider data stale after 30 seconds
            staleTime: 30 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
