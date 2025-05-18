import { redirect } from 'next/navigation'
import { cache } from 'react'
import 'server-only'

import { cookies } from 'next/headers'
import { decrypt } from './session'

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