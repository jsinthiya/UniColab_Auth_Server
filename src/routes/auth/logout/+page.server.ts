import { AUTH_URL, BACKEND_URL } from '@/constant/.base';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({cookies,url}) => {
    const refreshToken = cookies.get('refreshtoken')
    const res = await fetch(`${BACKEND_URL}/v1/auth/logout`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`
        }
    });
    cookies.set('accesstoken', '', {
        maxAge: -1,
        path: '/'
    });
    cookies.set('refreshtoken', '', {
        maxAge: -1,
        path: '/'
    });
    cookies.set('user', '', {
        maxAge: -1,
        path: '/'
    });
    throw redirect(301,`/auth?redirect=${url.searchParams.get('redirect') || AUTH_URL}`);
    return {};
}) satisfies PageServerLoad;