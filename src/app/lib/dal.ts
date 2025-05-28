import { redirect } from 'next/navigation'
import { cache } from 'react'
import 'server-only'

import { cookies } from 'next/headers'
import { decrypt } from './session'


/**
 * This function verifies the current session by checking the cookies.
 * If a valid session is found, it returns the user ID and username.
 * If no session is found, it redirects to the login page.
 * 
 * @returns {Promise<{isAuth: boolean, userId: string, username: string}>}
 */
export const verifySession = cache(async() => {
    const cookieStore = await cookies()
    const cookie = cookieStore.get('session')
    if (!cookie) {
        return { isAuth: false, userId: '', username: '' }
    }
    const session = await decrypt(cookie?.value)
    if (!session?.id) {
        redirect('/login')
    }

    return {isAuth: true, userId: session.id, username: session.username}
})