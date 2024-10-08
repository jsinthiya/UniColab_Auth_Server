import { redirect } from '@sveltejs/kit';

// @ts-ignore
export const handle = async ({ event, resolve }) => {
	let refreshtoken = event.cookies.get('refreshtoken')
	if (event.url.pathname.startsWith("/auth") && !event.url.pathname.startsWith("/auth/logout") && refreshtoken) {
		throw redirect(301,'./');
	}

	const response = await resolve(event) 


	return response
}