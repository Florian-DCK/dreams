import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/app/lib/session';
import { cookies } from 'next/headers';

const protectedRoutes = ['/'];
const publicRoutes = ['/login', '/register', '/welcome'];

export default async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(path);
	const isPublicRoute = publicRoutes.includes(path);

	const cookie = (await cookies()).get('session')?.value;
	const session = await decrypt(cookie);

	if (isProtectedRoute && !session?.id) {
		return NextResponse.redirect(new URL('/welcome', req.nextUrl));
	}

	// if (
	// 	isPublicRoute &&
	// 	session?.id &&
	// 	!req.nextUrl.pathname.startsWith('/dashboard')
	// ) {
	// 	return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
	// }

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
