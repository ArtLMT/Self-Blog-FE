// =============================================================================
// Lib: API Server Fetch Helper
// =============================================================================
// Light wrapper around standard fetch() specifically for Next.js Server
// Components. Since Server Components execute on the server, they bypass
// browser client state (Axios, Zustand) and must fetch directly.
// =============================================================================

import { cookies, headers } from 'next/headers';
import { API_BASE_URL } from './constants';
import type { ApiResponse } from '@/types/auth.type';

/**
 * Perform a server-side API request.
 * Automatically resolves endpoint URL, sets Content-Type, and parses JSON wrapper.
 *
 * @param path Endpoint path, e.g., '/public/arcs'
 * @param options Standard RequestInit options for fetch
 */
export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  let url = `${API_BASE_URL}${cleanPath}`;

  // Read preferred language from incoming request cookies/headers
  let lang = 'EN';
  try {
    const cookieStore = await cookies();
    const langCookie = cookieStore.get('selfblog_language')?.value;
    if (langCookie === 'EN' || langCookie === 'VN') {
      lang = langCookie;
    } else {
      // Fallback: check Accept-Language header
      const headersList = await headers();
      const acceptLang = headersList.get('accept-language');
      if (acceptLang && acceptLang.toLowerCase().startsWith('vi')) {
        lang = 'VN';
      }
    }
  } catch {
    // Suppress warning if cookies/headers are not available (e.g., static build-time generation)
  }

  const backendLang = lang === 'VN' ? 'VI' : 'EN';
  
  // Explicitly append the lang query parameter (highest priority lookup on backend)
  const hasParams = url.includes('?');
  url = `${url}${hasParams ? '&' : '?'}lang=${backendLang}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': backendLang === 'VI' ? 'vi' : 'en',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      let apiError: ApiResponse<unknown> | undefined;
      try {
        apiError = await res.json();
      } catch {
        // Response is not JSON
      }

      throw new Error(
        apiError?.message || `API Request failed with HTTP Status ${res.status}`
      );
    }

    const jsonResponse: ApiResponse<T> = await res.json();
    return jsonResponse;
  } catch (error) {
    console.error(`[Server Fetch Error] Failed requesting: ${url}`, error);
    throw error;
  }
}
