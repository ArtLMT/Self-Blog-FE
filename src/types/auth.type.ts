// =============================================================================
// Types: Authentication
// =============================================================================
// Centralized auth-related type definitions.
// Keep all API contract types here for single-source-of-truth.
// =============================================================================

/** User role enumeration matching backend roles */
export type UserRole = 'GUEST' | 'USER' | 'ADMIN';

/** Core user representation used across the application */
export interface User {
  username: string;
  email?: string;
  role: UserRole;
  languagePreference?: 'EN' | 'VI';
}

/** Standard API Response Wrapper */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errorCode?: string;
  details?: Record<string, string>;
  timestamp?: string;
}

/** Login request payload */
export interface LoginRequest {
  username: string;
  password: string;
}

/** Registration request payload */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

/** Authentication response DTO from the API */
export interface AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
  username: string;
  role: UserRole;
}

export type AuthResponse = AuthResponseDTO;

/** Token refresh request (not needed if using cookies, but kept for type compatibility) */
export interface RefreshTokenRequest {
  refreshToken?: string;
}

/** Token refresh response */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

