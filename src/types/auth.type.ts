// =============================================================================
// Types: Authentication
// =============================================================================
// Centralized auth-related type definitions.
// Keep all API contract types here for single-source-of-truth.
// =============================================================================

/** User role enumeration matching backend roles */
export type UserRole = 'ADMIN' | 'USER';

/** Core user representation used across the application */
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
}

/** Login request payload */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Registration request payload */
export interface RegisterRequest {
  email: string;
  username: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}

/** Authentication response from the API */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/** Token refresh request */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/** Token refresh response */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
