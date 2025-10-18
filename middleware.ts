import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Check if user is authenticated
  if (!token) {
    // Allow access to signin page
    if (pathname === '/signin') {
      return NextResponse.next()
    }
    // Redirect to signin for protected routes
    const protectedRoutes = [
      '/dashboard',
      '/documentation',
      '/training',
      '/risk',
      '/nonconformance',
      '/equipment',
      '/calibration',
      '/registers',
      '/contract-review',
      '/customer-satisfaction',
      '/waste-management',
      '/audits',
      '/employees',
      '/ohs',
      '/objectives',
      '/profile',
      '/settings',
      '/onboarding'
    ]
    
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
    return NextResponse.next()
  }

  // Check if user has completed setup - DISABLED
  // if (token.hasCompletedSetup === false && pathname !== '/onboarding') {
  //   // Allow access to onboarding page, dashboard, and API routes
  //   if (pathname === '/onboarding' || pathname === '/dashboard' || pathname.startsWith('/api/')) {
  //     return NextResponse.next()
  //   }
  //   // Redirect to onboarding for incomplete setup
  //   return NextResponse.redirect(new URL('/onboarding', request.url))
  // }

  // If user has completed setup and tries to access onboarding, redirect to dashboard
  if (token.hasCompletedSetup === true && pathname === '/onboarding') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/documentation/:path*',
    '/training/:path*',
    '/risk/:path*',
    '/nonconformance/:path*',
    '/equipment/:path*',
    '/calibration/:path*',
    '/registers/:path*',
    '/contract-review/:path*',
    '/customer-satisfaction/:path*',
    '/waste-management/:path*',
    '/audits/:path*',
    '/employees/:path*',
    '/ohs/:path*',
    '/objectives/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/onboarding/:path*',
    '/signin/:path*',
  ],
}

