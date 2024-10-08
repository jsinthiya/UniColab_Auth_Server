import { redirect } from '@sveltejs/kit';
import { BACKEND_URL } from '@/constant/.base';

export const load = (async ({cookies}) => {

    const refreshToken = cookies.get('refreshtoken')
    if(!refreshToken)
        throw redirect(301,`/auth`);
    const res = await fetch(`${BACKEND_URL}/v1/auth/identity`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`
        }
    });
    const result = await res.json();
    console.log(result);
    if(!res.ok){
            cookies.set('accesstoken', '', { 
                maxAge: 0,
                path: '/'
             });
             cookies.set('refreshtoken', '', {
                maxAge: 0,
                path: '/'
             });
             cookies.set('user', '', {
                maxAge: 0,
                path: '/'
             });
             throw redirect(301,`/auth`);
        }
    return {
        user: result.user,
        refreshToken
    };
}) 