import {message, superValidate} from 'sveltekit-superforms/server';
import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { error, fail, redirect } from '@sveltejs/kit';
import {APP_URL, BACKEND_URL} from '@/constant/.base.js'
import { URL } from 'url'
import { stat } from 'fs';

const loginSchema = z.object({
    email: z.string({
        required_error: 'Email is required',
    }).email({
        message: 'Email Must be a valid Email.',
    }),
    password: z.string({
        required_error: 'Password is required',
    }).min(6, {
        message: 'Password must be at least 6 characters long',
    }),
    
});
const registerSchema = z.object({
    name: z.string({
        required_error: 'Name is required',
    }).min(3, {
        message: 'Name must be at least 3 characters long',
    }),
    email: z.string({
        required_error: 'Email is required',
    }).email({
        message: 'Email Must be a valid Email.',
    }),
    password: z.string({
        required_error: 'Password is required',
    }).min(6, {
        message: 'Password must be at least 6 characters long',
    }),
    
});
export const load = (async (event) => {
    const loginForm  = await superValidate(zod(loginSchema))
    const registerForm  = await superValidate(zod(registerSchema));
    event.setHeaders({
        "cache-control": "cache-control",
      });
    const redirectURL = event.url.search.split('?redirect=')[1];
        if(redirectURL){
            event.cookies.set("redirectURL",redirectURL,{
                path: "/auth",
                maxAge: 3600
            })
        }
        else{
            event.cookies.set("redirectURL",APP_URL,{
                path: "/auth",
                maxAge: 3600
            })
        }
   
    
    
    
    return {
        loginForm,
        registerForm,
        redirectURL: event.cookies.get('redirectURL')
    };
});

export const actions = {
    login: async ({request,cookies}) => {
        
        
        const loginForm = await superValidate(request,zod(loginSchema));
        if(!loginForm.valid){
            return fail(400,{
                loginForm
            })
        }


        const res = await fetch(`${BACKEND_URL}/v1/auth/login`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginForm.data)
        });
        const result = await res.json();
        console.log("result:", result)
        if(!res.ok){
             
            return fail(400,{
                loginForm,
                status: res.status,
                message: result.error.message
            })
        }

        
        cookies.set('accesstoken',result.accessToken,{
            path: '/',
            maxAge: 3600 // 1 hour
        })
        cookies.set('refreshtoken',result.refreshToken,{
            path: '/',
            maxAge: 3600 * 24 * 30 // 1 month
        })
        cookies.set('user',JSON.stringify(result.user),{
            path: '/',
            maxAge: 3600 // 1 hour
        })
        
        
        const redirectURL = new URL(`${cookies.get("redirectURL")}`)

        const identityURL= `${redirectURL.origin}/identity?refreshtoken=${result.refreshToken}&redirect=${redirectURL.href}`
        console.log("identityURL:", identityURL)
        return redirect(300,identityURL);

       
    },
    register: async ({request,cookies}) => {
        const registerForm = await superValidate(request,zod(registerSchema));
        
        if(!registerForm.valid){
            return fail(400,{
                registerForm
            })
        }

        
        const res = await fetch(`${BACKEND_URL}/v1/auth/register`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerForm.data)
        });
        const result = await res.json();
        
        if(!res.ok){
             
            return fail(400,{
                registerForm,
                status: res.status,
                message: result.error.message
            })
        }

        cookies.set('accesstoken',result.accessToken,{
            path: '/',
            maxAge: 3600 // 1 hour
        })
        cookies.set('refreshtoken',result.refreshToken,{
            path: '/',
            maxAge: 3600 * 24 * 30 // 1 month
        })
        cookies.set('user',JSON.stringify(result.user),{
            path: '/',
            maxAge: 3600 // 1 hour
        })
        
        const redirectURL = new URL(`${cookies.get("redirectURL")}`)

        const identityURL= `${redirectURL.origin}/identity?refreshtoken=${result.refreshToken}&redirect=${redirectURL.href}`
        return redirect(300,identityURL);
    }
}