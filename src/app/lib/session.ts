import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { SessionPayload } from '@/app/lib/definitions';
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);


/**
 * Encrypts a payload into a signed JWT string.
 * @param payload The payload to be encrypted, which should conform to the SessionPayload interface.
 * @returns A signed JWT string that contains the session information.
 */
export async function encrypt(payload: SessionPayload) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('7d')
		.sign(encodedKey);
}

/**
 * Decrypts a JWT string and verifies its validity.
 * @param session The JWT string to be decrypted. If undefined, it will return undefined.
 * @returns The decrypted payload if the JWT is valid, or undefined if the verification fails.
 */
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

/**
 * Creates a new session by encrypting the user ID and username into a JWT and setting it as a cookie.
 * The session will expire in 7 days.
 * @param userId 
 * @param username 
 */
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