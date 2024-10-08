import { APP_URL, AUTH_URL, GOOGLE_CLIENT_ID } from '@/constant/.base';
import { redirect } from '@sveltejs/kit';

export async function load() {
    
    const REDIRECT_URI = `${AUTH_URL}/auth/google/callback`;
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
    throw redirect(302, url)
};