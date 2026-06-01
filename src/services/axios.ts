// =============================================================================
// Services: Axios Instance
// =============================================================================
// Centralized Axios configuration with interceptors for:
// 1. Automatic token injection on every request
// 2. Automatic token refresh on 401 responses
// 3. Consistent error handling
//
// ARCHITECTURE DECISION: We use Axios instead of fetch() because:
// - Request/response interceptors simplify auth token management
// - Automatic JSON transformation
// - Better error handling with HTTP status codes
// - Request cancellation support
// =============================================================================

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { API_BASE_URL } from '@/lib/constants';

/**
 * Pre-configured Axios instance for all API calls.
 * All service files should import this instead of creating their own instances.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true, // Crucial for sending and receiving HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------------------------------------------------------------------------
// Request Interceptor: Left as pass-through or basic logger
// ---------------------------------------------------------------------------
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      let savedLang = 'EN';
      const match = document.cookie.match(/selfblog_language=(EN|VN)/);
      if (match) {
        savedLang = match[1];
      } else {
        savedLang = localStorage.getItem('selfblog_language') || 'EN';
      }
      
      const backendLang = savedLang === 'VN' ? 'VI' : 'EN';
      
      // 1. Set Accept-Language header for backend LanguageResolver
      config.headers['Accept-Language'] = backendLang === 'VI' ? 'vi' : 'en';

      // 2. Set explicit query parameter ?lang=... for high-priority resolution
      config.params = {
        lang: backendLang,
        ...config.params,
      };
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// Response Interceptor: Handle 401 errors with token refresh
// ---------------------------------------------------------------------------
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error: AxiosError) => void;
}> = [];

/** Process queued requests after a successful token refresh */
function processQueue(error: AxiosError | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If 401 and we haven't already retried this request, and it's not an auth endpoint
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        // Queue the request while a refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call the refresh endpoint directly to avoid interceptor loops
        // The refresh token is read from the cookie automatically by the server
        await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        processQueue(null);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);

        // Clear client user session and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('selfblog_user_session');
          document.cookie = 'selfblog_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
