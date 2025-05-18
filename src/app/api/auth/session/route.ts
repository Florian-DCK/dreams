// /api/auth/session
import { verifySession } from '@/app/lib/dal';
import { NextResponse } from 'next/server';

export async function GET() {
        const session = await verifySession();
        return NextResponse.json(session);
}
