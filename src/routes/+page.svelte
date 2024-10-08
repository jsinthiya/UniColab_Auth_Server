<script lang="ts">
	import { goto } from '$app/navigation';
   
   import * as Avatar from "$lib/components/ui/avatar";
    import { BACKEND_URL } from "@/constant/base.js";
    import { redirect } from "@sveltejs/kit";
    import { Toaster } from "svelte-sonner";
    import { toast } from "svelte-sonner";

    export let data;
    const {user,refreshToken} = data;
    
</script>

<style>

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
    width: 700px;
    height: 500px;
    border:  3px solid rgba(238, 229, 229, 0.734);
    background: #ffffff40;
    border-radius: 30px;
    backdrop-filter: blur(20px);
    overflow: hidden;
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

</style>
<Toaster position="top-center" richColors />
<main>
    <!-- Form Container -->
 
        <div class="form-container flex flex-col p-[10%]  h-full w-full bg-transparent items-center justify-center">
            <Avatar.Root class="w-40 h-40 border-2 border-white ">
                <Avatar.Image src={`${BACKEND_URL}/${user.avatar}`} alt="@shadcn" />
                <Avatar.Fallback>CN</Avatar.Fallback>
              </Avatar.Root>
            <p class="font-serif font-bold mt-3">{user.name}</p>
            <p class="font-mono">{user.email}</p>
            <p class="text-orange-600">@{user.username}</p>
            <button class="btn btn-1 mt-3" on:click={
                async ()=>{
                    const res = await fetch(`${BACKEND_URL}/v1/auth/logout`,{
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${refreshToken}`
                        }
                    });
                    const result = await res.json();
                    console.log(result);
                    if(res.ok){
                        //delete cookies
                        document.cookie = "accesstoken"+'=; Max-Age=-99999999;';  
                        document.cookie = "refreshtoken"+'=; Max-Age=-99999999;';
                        document.cookie = "user"+'=; Max-Age=-99999999;';
                        window.location.href = "/auth";
                    }
                    else{
                        toast.error("Something went wrong");
                    }
                }
            }>
                Logout
            </button>
    
    </div>
</main>