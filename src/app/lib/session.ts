import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { SessionPayload } from '@/app/lib/definitions';
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('7d')
		.sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
	try {
		const { payload } = await jwtVerify(session, encodedKey, {
			algorithms: ['HS256'],
		});
		return payload;
	} catch (error) {
		console.log('Failed to verify session');
	}
}

export async function createSession(userId: string, username: string) {

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    const session = await encrypt({ id: userId, username: username, iat: new Date(Date.now()).getTime() , exp: Math.floor(expiresAt.getTime() / 1000) });
    const cookieStore = await cookies();

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}