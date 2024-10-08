import { APP_URL, AUTH_URL, BACKEND_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '@/constant/.base';
import { redirect } from '@sveltejs/kit';

export const load = (async ({request,cookies}) => {
  
    const REDIRECT_URI = `${AUTH_URL}/auth/google/callback`;
   const code  = new URL(request.url).searchParams.get('code');
   const url = `https://oauth2.googleapis.com/token?code=${code}&client_id=${GOOGLE_CLIENT_ID}&client_secret=${GOOGLE_CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&grant_type=authorization_code`;
    const response = await fetch(url, { method: 'POST' });
    const data = await response.json();
    const { access_token } = data;
    const user = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
        headers: {
        Authorization: `Bearer ${access_token}`,
        },
    });
    const userData = await user.json();

        const result = await fetch(
            `${BACKEND_URL}/v1/auth/google`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            },
        );
        const resData = await result.json();
        console.log(resData);
 
       const redirectURL = new URL(`${cookies.get("redirectURL")}`)

        const identityURL= `${redirectURL.origin}/identity?refreshtoken=${resData.refreshToken}&redirect=${redirectURL.href}`

        throw redirect(301,identityURL);

})