// =============================================================================
// Services: Auth Service
// =============================================================================
// API calls related to authentication.
// Service files are thin wrappers around apiClient — they define
// the contract between frontend and backend, nothing more.
// =============================================================================

import apiClient from '@/services/axios';
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
} from '@/types/auth.type';

const AUTH_PREFIX = '/auth';

export const authService = {
  /** Authenticate user and receive tokens */
  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>(`${AUTH_PREFIX}/login`, data),

  /** Register a new user account */
  register: (data: RegisterRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>(`${AUTH_PREFIX}/register`, data),

  /** Refresh the access token using a valid refresh token */
  refreshToken: (data: RefreshTokenRequest) =>
    apiClient.post<ApiResponse<RefreshTokenResponse>>(`${AUTH_PREFIX}/refresh`, data),

  /** Invalidate the current session */
  logout: () => apiClient.post<ApiResponse<unknown>>(`${AUTH_PREFIX}/logout`),
};
