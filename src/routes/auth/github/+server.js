import { APP_URL, AUTH_URL, GITHUB_CLIENT_ID } from '@/constant/.base';
import { redirect } from '@sveltejs/kit';

export async function GET() {
    const GITHUB_REDIRECT_URL = `${AUTH_URL}/auth/github/callback`;
    const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URL}&scope=read:user user:email`;
    throw redirect(302, url);
};