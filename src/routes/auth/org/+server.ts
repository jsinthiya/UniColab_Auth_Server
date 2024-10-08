import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {

    const accessToken = cookies.get('accesstoken');
    const refreshToken = cookies.get('refreshtoken');

    if (accessToken) {            
            throw redirect(301, '/home')
        }
    return {};
};


/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({request}) => {
      
	const data = await request.formData();  
    console.log(data)
    }
}