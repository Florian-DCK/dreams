// /api/auth/session
import { verifySession } from '@/app/lib/dal';
import { NextResponse } from 'next/server';

/**
 * 
 * @returns JSON response with the current session information.
 * If the user is authenticated, it returns their session data.
 * 
 */
export async function GET() {
        const session = await verifySession();
        return NextResponse.json(session);
}
