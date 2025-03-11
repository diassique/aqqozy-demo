import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/edge-auth';

export async function middleware(request: NextRequest) {
  // Add pathname to headers for layout detection
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Only protect /admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return response;
  }

  // Don't protect the login page
  if (request.nextUrl.pathname === '/admin/login') {
    return response;
  }

  const session = await getSession();

  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 