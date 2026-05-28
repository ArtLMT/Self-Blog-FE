// =============================================================================
// Middleware: Route Protection
// =============================================================================
// Next.js middleware runs on the Edge Runtime BEFORE a page renders.
// It's ideal for:
// - Authentication checks (redirect unauthenticated users)
// - Redirecting authenticated users away from login/register
// - Internationalization (locale detection)
//
// IMPORTANT: Middleware runs on every matched request, so keep it lightweight.
// It cannot access React state or Zustand stores — it reads cookies/headers.
//
// For this boilerplate, we check for the access token in cookies.
// In production, consider using httpOnly cookies set by the backend
// instead of localStorage tokens for better security.
// =============================================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { PROTECTED_ROUTES, AUTH_ROUTES, ROUTES } from '@/lib/constants';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read refresh token from HTTP-only cookie set by the server, fallback to client-side session cookie
  const token = request.cookies.get('refreshToken')?.value 
    || request.cookies.get('refresh_token')?.value
    || request.cookies.get('selfblog_logged_in')?.value;

  // Check if the current route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current route is an auth route (login/register)
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !token) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL(ROUTES.ADMIN.WORKSPACE, request.url));
  }

  return NextResponse.next();
}

/**
 * Matcher configuration
 *
 * Only run middleware on routes that need it.
 * Excludes static files, images, and API routes for performance.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
