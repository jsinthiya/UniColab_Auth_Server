<script lang="ts">
	import { message } from 'sveltekit-superforms/server';
	import { error, redirect } from '@sveltejs/kit';
    import { onMount } from 'svelte';
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms';
    import { toast } from "svelte-sonner";
    import { Toaster } from "$lib/components/ui/sonner";
    import { BACKEND_URL } from '@/constant/base';
    import Swal from 'sweetalert2';
    import { goto } from '$app/navigation';


    export let data;
    export let form;

    const {redirectURL} = data



    // $: console.log(form)

    const { form: loginForm, errors: loginErrors,enhance:loginEnhance } = superForm(data.loginForm);
    const { form: registerForm, errors: registerErrors,enhance:registerEnhance } = superForm(data.registerForm);
    


    const formData = {
        name: "",
        email: "",
        password: "",
    };

    const validateLogin = async () => {
        delete formData?.name
        if (formData.email === "" || formData.password === "") {
           Swal.fire({
                title: "Login Falied!",
                text: "Please fill all fields!",
                iconHtml: `<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.0//EN'  'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'><svg height="50" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:#D72828;"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg>`,
                showCancelButton: false,
                heightAuto: true,
                customClass: {
                    container: "bg-white",
                    popup: "bg-[#ffffff99] backdrop-blur-lg rounded-lg shadow-lg h-fit w-[25%]",
                    title: "text-[#21264D] font-bold text-lg",
                    icon: "border-0",
                    confirmButton: "bg-[#21264D] text-white px-4 py-2 rounded-lg",
                    denyButton: "bg-[#21264D] text-white px-4 py-2 rounded-lg",
                    closeButton: "bg-[#21264D] text-white px-4 py-2 rounded-lg",
                    cancelButton: "bg-[#21264D] text-white px-4 py-2 rounded-lg",

                },
            });
        } else {
            try {
                const result = await fetch(
                    `${BACKEND_URL}/v1/auth/login`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    },
                );
                const resData = await result.json();

                if (result.status === 200) {
                    // Calculate expiration times
                    const accessTokenExpires = new Date();
                    accessTokenExpires.setTime(
                        accessTokenExpires.getTime() + 15 * 60 * 1000,
                    ); // 15 minutes in milliseconds

                    const refreshTokenExpires = new Date();
                    refreshTokenExpires.setTime(
                        refreshTokenExpires.getTime() +
                            30 * 24 * 60 * 60 * 1000,
                    ); // 30 days in milliseconds

                    // Set cookies with expiration times
                    document.cookie = `accesstoken=${resData.accessToken}; expires=${accessTokenExpires.toUTCString()}; path=/`;
                    document.cookie = `refreshtoken=${resData.refreshToken}; expires=${refreshTokenExpires.toUTCString()}; path=/`;
                    document.cookie = `user=${JSON.stringify(resData.user)}; expires=${accessTokenExpires.toUTCString()}; path=/`;
                    const url = new URL(`${redirectURL}`)

                    const identityURL= `${url.origin}/identity?refreshtoken=${resData.refreshToken}&redirect=${url.href}`
                    window.location.href = identityURL
                } else {
                    Swal.fire({
                        title: "Login Falied!",
                        text: resData.error.message,
                        iconHtml: `<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.0//EN'  'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'><svg height="50" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:#D72828;"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg>`,
                showCancelButton: false,
                heightAuto: true,
                customClass: {
                    container: "bg-white",
                    popup: "bg-[#ffffff99] backdrop-blur-lg rounded-lg shadow-lg h-fit w-[25%]",
                    title: "text-[#21264D] font-bold text-lg",
                    icon: "border-0",
                    confirmButton: "bg-[#21264D] text-white px-4 py-2 rounded-lg",
                    denyButton: "bg-[#21264D] text-white px-4 py-2 rounded-lg",
                    closeButton: "bg-[#21264D] text-white px-4 py-2 rounded-lg",
                    cancelButton: "bg-[#21264D] text-white px-4 py-2 rounded-lg",
                    
                },
                    });
                }
            } catch (error) {}
        }
        formData.name = ""
    };
    const validateRegister = async () => {
        
        if (formData.name == "" || formData.email === "" || formData.password === "") {
           Swal.fire({
                title: "Register Falied!",
                text: "Please fill all fields!",
                iconHtml: `<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.0//EN'  'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'><svg height="50" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:#D72828;"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg>`,
                showCancelButton: false,
                heightAuto: true,
                customClass: {
                    container: "bg-white",
                    popup: "bg-[#ffffff99] backdrop-blur-lg rounded-lg shadow-lg h-fit w-[25%]",
                    title: "text-[#21264D] font-bold text-lg",
                    icon: "border-0",
                    confirmButton: "bg-[#21264D] text-white px-4 py-2 rounded-lg",
                    denyButton: "bg-[#21264D] text-white px-4 py-2 rounded-lg",
                    closeButton: "bg-[#21264D] text-white px-4 py-2 rounded-lg",
                    cancelButton: "bg-[#21264D] text-white px-4 py-2 rounded-lg",

                },
            });
        } else {
            try {
                const result = await fetch(
                    `${BACKEND_URL}/v1/auth/register`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    },
                );
                const resData = await result.json();

                if (result.status === 200) {
                    // Calculate expiration times
                    const accessTokenExpires = new Date();
                    accessTokenExpires.setTime(
                        accessTokenExpires.getTime() + 15 * 60 * 1000,
                    ); // 15 minutes in milliseconds

                    const refreshTokenExpires = new Date();
                    refreshTokenExpires.setTime(
                        refreshTokenExpires.getTime() +
                            30 * 24 * 60 * 60 * 1000,
                    ); // 30 days in milliseconds

                    // Set cookies with expiration times
                    document.cookie = `accesstoken=${resData.accessToken}; expires=${accessTokenExpires.toUTCString()}; path=/`;
                    document.cookie = `refreshtoken=${resData.refreshToken}; expires=${refreshTokenExpires.toUTCString()}; path=/`;
                    document.cookie = `user=${JSON.stringify(resData.user)}; expires=${accessTokenExpires.toUTCString()}; path=/`;
                    const url = new URL(`${redirectURL}`)

                    const identityURL= `${url.origin}/identity?refreshtoken=${resData.refreshToken}&redirect=${url.href}`
                    window.location.href = identityURL
                } else {
                    Swal.fire({
                        title: "Register Falied!",
                        text: resData.error.message,
                        iconHtml: `<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.0//EN'  'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'><svg height="50" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:#D72828;"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg>`,
                showCancelButton: false,
                heightAuto: true,
                customClass: {
                    container: "bg-white",
                    popup: "bg-[#ffffff99] backdrop-blur-lg rounded-lg shadow-lg h-fit w-[25%]",
                    title: "text-[#21264D] font-bold text-lg",
                    icon: "border-0",
                    confirmButton: "bg-[#21264D] text-white px-4 py-2 rounded-lg",
                    denyButton: "bg-[#21264D] text-white px-4 py-2 rounded-lg",
                    closeButton: "bg-[#21264D] text-white px-4 py-2 rounded-lg",
                    cancelButton: "bg-[#21264D] text-white px-4 py-2 rounded-lg",
                    
                },
                    });
                }
            } catch (error) {}
        }
    };
    
    onMount(() => {
 
        // Variable Declaration

    const loginBtn = document.querySelector("#login") as HTMLButtonElement;
    const registerBtn = document.querySelector("#register") as HTMLButtonElement;
    const loginForm = document.querySelector(".login-form") as HTMLDivElement;
    const registerForm = document.querySelector(".register-form")  as HTMLDivElement;
    const col1 = document.querySelector(".col-1") as HTMLDivElement;

// Login button function
loginBtn.addEventListener("click", () => {
    loginBtn.style.backgroundColor = "#21264D";
    registerBtn.style.backgroundColor = "rgba(255,255,255,0.2)";

    loginForm.style.left = "50%";
    registerForm.style.left = "-50%";

    loginForm.style.opacity = "1";
    registerForm.style.opacity = "0";

    col1.style.borderRadius = "0 30% 30% 0";
});

// Register button function

registerBtn.addEventListener("click", () => {
    loginBtn.style.backgroundColor = "rgba(255,255,255,0.2)";
    registerBtn.style.backgroundColor = "#21264D";

    loginForm.style.left = "150%";
    registerForm.style.left = "50%";

    loginForm.style.opacity = "0";
    registerForm.style.opacity = "1";

    col1.style.borderRadius = "0 25% 25% 0";

});
    });

</script>

<style>
    /* POPPINS FONT */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* ====== BASE ===== */
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}

/* ====== Body ===== */

main{
    /* background: url("./auth/img/1.jpg"); */
    background: linear-gradient(79deg, rgb(136, 189, 189) 0%, rgb(152, 185, 150) 21%, rgb(159, 166, 196) 48%, rgb(127, 166, 171) 78%, rgb(136, 128, 172) 100%);
    background-position:  center;
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;

    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 0 20px;
}

/* ====== Form container ===== */

.form-container{
    display: flex;
    width: 1000px;
    height: 650px;
    border:  3px solid rgba(255,255,255,0.3);
    border-radius: 30px;
    backdrop-filter: blur(20px);
    overflow: hidden;
}

/* ====== First Column ===== */

.col-1{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 55%;
    background: rgba(255,255,255,0.3);
    backdrop-filter: blur(30px);
    border-radius: 0 30% 30% 0;
    transition: border-radius 0.3s;

}

.image-layer{
    position: relative;

}
.form-image-main{
    width: 400px;
    animation: scale-up 3s ease-in-out alternate infinite;
}
.form-image{
    position: absolute;
    left: 0;
    top: 0;
    width: 400px;
}

.coin{
    animation: scale-down 3s ease-in-out alternate infinite;
}
.rocket{
    animation: up-down 3s ease-in-out alternate infinite;
}
.cloud{
    animation: left-right 3s ease-in-out alternate infinite;
}
.stars{
    animation: right-left 3s ease-in-out alternate infinite;
}

@keyframes left-right{
    to{
        transform: translateX(20px);
    }
}
@keyframes up-down{
    to{
        transform: translateY(20px);
    }
}
@keyframes scale-down{
    to{
        transform: scale(0.95);
    }
}
@keyframes scale-up{
    to{
        transform: scale(1.05);
    }
}
/* ====== Form Image Animation ===== */



/* ====== Featured Words ===== */

.featured-words{
    text-align: center;
    color: #fff;
    width: 300px;
}

.featured-words span{
    font-weight: 600;
    color: #21264D;
}
/* ====== Second Column ===== */

.col-2{
    position: relative;
    width: 45%;
    padding: 20px;
    overflow: hidden;
}
.btn-box{
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
}
.btn{
    font-weight: 500;
    padding: 5px 20px;
    border: none;
    border-radius: 30px;
    background: rgba(255,255,255,0.2);
    color: #ffffff;
    box-shadow: 0 5px 10px rgba(0,0,0,0.2);
    cursor: pointer;
    transition: .2s;
}

.btn-1{
    background: #21264D;
}
.btn:hover{
    opacity: 0.85;
}
.login-form{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 0 4vw;
    transition: .3s;
}
.register-form{
    position: absolute;
    left: -50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 0 4vw;
    transition: .3s;
}
.register-form .form-title{
    margin-block: 40px 20px;
}
.form-title{
    margin: 40px 0;
    color: #21264d;
    font-size: 28px;
    font-weight: 600;
}
.form-inputs{
    width: 100%;
}
.input-box{
    position: relative;
}
.input-field{
    width: 100%;
    height: 55px;
    padding: 0 15px;
    margin: 10px 0;
    color: #21264d;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 10px;
    outline: none;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
}
::placeholder{
    color: #21264d;
    font-size: 15px;
}
.input-box .icon{
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    color: #21264d;
}
.forget-pass {
    color: #21264d;
    text-decoration: none;
    font-size: 14px;
}
.forget-pass:hover{
    text-decoration: underline;
}
.input-submit{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    height: 55px;
    padding: 0 15px;
    margin: 10px 0;
    color: #fff;
    background: #21264D;
    border: none;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    cursor: pointer;
    transition: .2s; 
}
.input-submit:hover{
    gap:15px;
}
.social-login{
    display: flex;
    gap: 20px;
    margin-top: 20px;
}
.social-login a{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 40px;
    color: #21264d;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    transition: .2s;
}

.social-login a:hover{
    transform: scale(0.9);
}

.invalid-password,
.invalid-email{
    display: none;
    color: red;
    font-size: 12px;
    margin-top: 5px;

}
/*  ======= Login Form ========  */


/*  ======= Register Form ========  */


/* ======== Responsive ======== */

@media (max-width: 892px){
    .form-container{
        width: 400px;
    }
    .col-1{
        display: none;
    }
    .col-2{
        width: 100%;
    }
}
</style>
<Toaster richColors closeButton position="top-center" />

<main>
    <!-- Form Container -->
    <div class="form-container">
        <div class="col col-1">
            <div class="w-[70%] rounded-lg backdrop-blur-lg flex flex-col items-center ">
                <img src="./logo-dark.png" width="100px" alt="">
                <p class="text-gray-600 font-extralight text-xs"><span class="text-[#0d6e6e]">Unite</span>, <span class="text-[#d06c98]">Innovate</span> , <span class="text-[#2e4fc6]">Succeed</span></p>
            </div>
            <div class="image-layer">
                <img src="./auth/img/white-outline.png" class="form-image-main">
                <img src="./auth/img/2.png" class="form-image rocket">
                <img src="./auth/img/cloud.png" class="form-image cloud">
                <img src="./auth/img/stars.png" class="form-image stars">
            </div>
            <!-- <p class="featured-words">You Are Few Minutes Way to boost your skills with <span>UniColab</span></p> -->
        </div>
        <div class="col col-2">
            <div class="btn-box">
                <button class="btn btn-1" id="login">Sign In</button>
                <button class="btn btn-2" id="register">Sign Up</button>
            </div>
          <!-- Login Form Container -->

            <div class="login-form">
                <div class="form-title">
                    <span>Sign In</span>
                </div>
                <form method="POST" on:submit|preventDefault={validateLogin} class="form-inputs">
                    <div class="input-box">
                        <input type="text" name="email"  class="input-field" placeholder="Email Address" 
                        bind:value={formData.email}
                        >
                        <i class="bx bx-user icon"></i>
                    </div>
               
                    
                    <div class="input-box">
                        <input type="password" name="password" class="input-field" placeholder="Password"
                        bind:value={formData.password}
                                        >
                        <i class="bx bx-lock-alt icon"></i>
                    </div>
               
                    <div class="forget-pass">
                        <a href="#">Forget Password?</a>
                    </div>

                    <div class="input-box">
                        <button type="submit" class="input-submit">
                            <span>Sign In</span>
                            <i class="bx bxx-right-arrow-alt"></i>
                        </button>
                    </div>
                
                </form>
                <div class="social-login">
                    <a href="/auth/google">
                        <i class="bx bxl-google" ></i>
                    </a>
                    <a href="/auth/github">
                        <i class="bx bxl-github"></i>
                    </a>
                </div>
            </div>

          <!-- Register Form Container -->

          <div class="register-form">
            <div class="flex flex-col justify-center items-center form-title">
                <span>Create Account</span>
                <a href="/auth/org" target="_blank" class="text-sm">Need University or Organization Account?</a>

            </div>
            <form method="POST" on:submit|preventDefault={validateRegister} class="form-inputs">
                <div class="input-box">
                    <input type="text" name="name" bind:value={formData.name} class="input-field" placeholder="Name">
                    <i class="bx bx-user icon"></i>
                </div>
    
                <div class="input-box">
                    <input type="text" name="email" bind:value={formData.email}  class="input-field" placeholder="Email Address">
                    <i class="bx bx-envelope icon"></i>
                </div>
           
                <div class="input-box">
                    <input type="password" name="password" bind:value={formData.password} class="input-field" placeholder="Password">
                    <i class="bx bx-lock-alt icon"></i>
                </div>
      
                <div class="input-box">
                    <button type="submit" class="input-submit">
                        <span>Sign Up</span>
                        <i class="bx bxx-right-arrow-alt"></i>
                    </button>
                </div>
            
            </form>
            <div class="social-login">
                <a href="/google">
                    <i class="bx bxl-google" ></i>
                </a>
                <a href="/github">
                    <i class="bx bxl-github"></i>
                </a>
            </div>
        </div>
        </div>
    </div>
</main>