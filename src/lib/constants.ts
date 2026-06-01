// =============================================================================
// Lib: Constants
// =============================================================================
// Application-wide constants. Centralizing magic strings prevents typos
// and makes refactoring easier.
// =============================================================================

/** API base URL sourced from environment variables */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

/** App metadata */
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'SelfBlog';

/** Local storage keys for tokens */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'selfblog_access_token',
  REFRESH_TOKEN: 'selfblog_refresh_token',
} as const;

/** Route paths - single source of truth for navigation */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  BLOG: '/blog',
  ADMIN: {
    WORKSPACE: '/admin/workspace',

    USERS: '/admin/users',
  },
} as const;

/** Protected route prefixes that require authentication */
export const PROTECTED_ROUTES = ['/admin'] as const;

/** Public-only routes (redirect to dashboard if already authenticated) */
export const AUTH_ROUTES = ['/login', '/register'] as const;

/** Pagination defaults */
export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
} as const;
