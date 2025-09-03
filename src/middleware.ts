import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Check if user is authenticated by looking for the session cookie
	const hasSession = request.cookies.has('session')

	// Public routes that don't require authentication
	const publicRoutes = ['/login', '/register', '/api/login', '/api/users']

	// Check if current route is public
	const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

	// If route requires authentication and user is not authenticated
	if (!isPublicRoute && !hasSession) {
		// Redirect to login page
		const loginUrl = new URL('/login', request.url)
		loginUrl.searchParams.set('redirect', pathname)
		return NextResponse.redirect(loginUrl)
	}

	// If user is authenticated and trying to access login or register page, redirect to home
	if ((pathname === '/login' || pathname === '/register') && hasSession) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (auth API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
}
