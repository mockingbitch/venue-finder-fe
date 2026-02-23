import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_PATHS = ['/admin', '/admin/dashboard'];
const PUBLIC_PATHS = ['/login', '/'];

function isAdminPath(pathname: string): boolean {
  return ADMIN_PATHS.some((path) => pathname.startsWith(path));
}

function isPublicPath(pathname: string): boolean {
  return pathname === '/' || pathname === '/login' || pathname === '/venues';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // Đã login thì không cho vào /login — redirect về admin hoặc redirect param
  if (pathname === '/login' && token) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/admin/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // Admin routes require auth
  if (isAdminPath(pathname)) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
