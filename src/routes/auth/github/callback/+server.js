import { APP_URL, AUTH_URL, BACKEND_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '@/constant/.base.js';
import { json } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export async function GET({request,cookies}) {
    const GITHUB_REDIRECT_URL = `${AUTH_URL}/auth/github/callback`;
    const code  = new URL(request.url).searchParams.get('code');
    const url = `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&redirect_uri=${GITHUB_REDIRECT_URL}&code=${code}`
    const response = await fetch(url, {
        method: 'GET'});
    const data = await response.text();
    const params = new URLSearchParams(data);
    const accessToken = params.get('access_token');
    const user = await fetch('https://api.github.com/user', {
        headers: {
        Authorization: `token ${accessToken}`,
        },
    });
    const userData = await user.json();
    const result = await fetch(
        `${BACKEND_URL}/v1/auth/github`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        },
    );
    const resData = await result.json();
    const redirectURL = new URL(`${cookies.get("redirectURL")}`)

    const identityURL= `${redirectURL.origin}/identity?refreshtoken=${resData.refreshToken}&redirect=${redirectURL.href}`
    console.log(identityURL)
    throw redirect(301,identityURL);
};