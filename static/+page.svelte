<script>
    import { onMount } from "svelte";
    /** @type {import('./$types').PageData} */
    import ProfileNav from "../../../../components/ProfileNav.svelte";
    import Swal from "sweetalert2";
    import { goto } from "$app/navigation";
    import { API_URL } from "$lib/constant";

    export let data;

    const { user,accessToken } = data;
    console.log(user)

    onMount(() => {
        // Get all radio button labels
var labels = document.querySelectorAll('.btn.btn-outline.btn-outline-dashed.btn-active-light-primary');

// Loop through each label
labels.forEach(function(label) {
    // Add click event listener to each label
    label.addEventListener('click', function() {
        // Remove 'active' class from all labels
        labels.forEach(function(l) {
            l.classList.remove('active');
        });
        // Add 'active' class to the clicked label
        this.classList.add('active');
    });
});

    });

    const upload = async()=>{
        const form = document.getElementById('form');
        console.log(form)
        // @ts-ignore
        const fd = new FormData(form);

        const req  = await fetch(`${API_URL}/v1/project/create`,{
            headers: {
                // @ts-ignore
                'Authorization': 'Bearer '+accessToken,
            },
            method:"POST",
            body: fd
        }
        )
          // @ts-ignore
          const res = await req.json()
        if(req.status !== 200){
            Swal.fire({
                title: 'Error!',
                text: res.error.message,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        }
        else{
            goto(`/${user.student_username}/projects`)
        }
      
    }
</script>
<svelte:head>
    <title>Create | Projects</title>
</svelte:head>
 <!--begin::Navbar-->
 <ProfileNav user={user} activeTab={"Projects"} />

 <form id="form" method="post" on:submit|preventDefault={upload}>

    <input type="text" name="owner" value={user.stuID} style="display: none;">
 <!--end::Navbar-->
 <div class="card">
    <!--begin::Card header-->
    <div class="card-header">
        <!--begin::Card header-->
        <div class="card-title fs-3 fw-bold">New Project</div>
        <!--end::Card header-->
    </div>
    <!--end::Card header-->
    <!--begin::Card body-->
    <div class="card-body">
        
        <div class="row mb-8">
            <!--begin::Col-->
            <div class="col-xl-3">
                <div class="fs-6 fw-semibold mt-2 mb-3">Project Logo</div>
            </div>
            <!--end::Col-->
            <!--begin::Col-->
            <div class="col-lg-8">
                <!--begin::Image input-->
                <div class="image-input image-input-outline" data-kt-image-input="true" style="background-image: url('assets/media/svg/avatars/blank.svg')">
                    <!--begin::Preview existing avatar-->
                    <div class="image-input-wrapper w-125px h-125px bgi-position-center" style="background-size: 75%; background-image: url('assets/media/svg/brand-logos/volicity-9.svg')"></div>
                    <!--end::Preview existing avatar-->
                    <!--begin::Label-->
                    <label class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-white shadow" data-kt-image-input-action="change" data-bs-toggle="tooltip" aria-label="Change avatar" data-bs-original-title="Change avatar" data-kt-initialized="1">
                        <i class="ki-outline ki-pencil fs-7"></i>
                        <!--begin::Inputs-->
                        <input type="file" name="logo" accept=".png, .jpg, .jpeg">
                        <input type="hidden" name="avatar_remove">
                        <!--end::Inputs-->
                    </label>
                    <!--end::Label-->
                    <!--begin::Cancel-->
                    <span class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-white shadow" data-kt-image-input-action="cancel" data-bs-toggle="tooltip" aria-label="Cancel avatar" data-bs-original-title="Cancel avatar" data-kt-initialized="1">
                        <i class="ki-outline ki-cross fs-2"></i>
                    </span>
                    <!--end::Cancel-->
                    <!--begin::Remove-->
                    <span class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-white shadow" data-kt-image-input-action="remove" data-bs-toggle="tooltip" aria-label="Remove avatar" data-bs-original-title="Remove avatar" data-kt-initialized="1">
                        <i class="ki-outline ki-cross fs-2"></i>
                    </span>
                    <!--end::Remove-->
                </div>
                <!--end::Image input-->
                <!--begin::Hint-->
                <div class="form-text">Allowed file types: png, jpg, jpeg.</div>
                <!--end::Hint-->
            </div>
            <!--end::Col-->
        </div>
        <!--begin::Row-->
        <div class="row mb-8">
            <!--begin::Col-->
            <div class="col-xl-3">
                <div class="fs-6 fw-semibold mt-2 mb-3">Project Title</div>
            </div>
            <!--end::Col-->
            <!--begin::Col-->
            <div class="col-xl-9">
                <input type="text" name="title" placeholder="Project Title" class="form-control form-control-solid" rows="5">
            </div>
            <!--end::Col-->
        </div>
        <!--end::Row-->

        <div class="row mb-8">
            <!--begin::Col-->
            <div class="col-xl-3">
                <div class="fs-6 fw-semibold mt-2 mb-3">Privacy</div>
            </div>
            <!--end::Col-->
            <!--begin::Col-->
            <div class="col-xl-9">
                <!--begin::Row-->
                <div class="row g-9">
                    <!--begin::Col-->
                    <div class="col-md-4 col-lg-12 col-xxl-4">
                        <label class="btn btn-outline btn-outline-dashed btn-active-light-primary active d-flex text-start p-6">
                            <!--begin::Radio button-->
                            <span class="form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1">
                                <input class="form-check-input" type="radio" name="privacy" value="public" checked>
                            </span>
                            <!--end::Radio button-->
                            <span class="ms-5">
                                <span class="fs-4 fw-bold mb-1 d-block">Public</span>
                                <span class="fw-semibold fs-7 text-gray-600 h-10">All users can view this project. <br><br><br></span>
                            </span>
                        </label>
                    </div>
                    <!--end::Col-->
                    <!--begin::Col-->
                    <div class="col-md-4 col-lg-12 col-xxl-4">
                        <label class="btn btn-outline btn-outline-dashed btn-active-light-primary d-flex text-start p-6" data-kt-button="true">
                            <!--begin::Radio button-->
                            <span class="form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1">
                                <input class="form-check-input" type="radio" name="privacy" value="private">
                            </span>
                            <!--end::Radio button-->
                            <span class="ms-5">
                                <span class="fs-4 fw-bold mb-1 d-block">Private</span>
                                <span class="fw-semibold fs-7 text-gray-600">Only Specific users can view and manage this project. <br><br></span>
                            </span>
                        </label>
                    </div>
                    <!--end::Col-->
                    <!--begin::Col-->
                    <div class="col-md-4 col-lg-12 col-xxl-4">
                        <label class="btn btn-outline btn-outline-dashed btn-active-light-primary d-flex text-start p-6" data-kt-button="true">
                            <!--begin::Radio button-->
                            <span class="form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1">
                                <input class="form-check-input" type="radio" name="privacy" value="3">
                            </span>
                            <!--end::Radio button-->
                            <span class="ms-5">
                                <span class="fs-4 fw-bold mb-1 d-block">Protected</span>
                                <span class="fw-semibold fs-7 text-gray-600">Only specific student of a university/club can view or manage this project.</span>
                            </span>
                        </label>
                    </div>
                    <!--end::Col-->
                </div>
                <!--end::Row-->
            </div>
            <!--end::Col-->
        </div>
        <!--end::Row-->
          <!--begin::Row-->
          <div class="row mb-8">
            <!--begin::Col-->
            <div class="col-xl-3">
                <div class="fs-6 fw-semibold mt-2 mb-3">Short Description</div>
            </div>
            <!--end::Col-->
            <!--begin::Col-->
            <div class="col-xl-9">
                <textarea name="shortDescription" placeholder="Short Description" class="form-control form-control-solid" rows="5"></textarea>
            </div>
            <!--end::Col-->
        </div>
        <!--end::Row-->
        <!--begin::Row-->
        <div class="row mb-8">
            <!--begin::Col-->
            <div class="col-xl-3">
                <div class="fs-6 fw-semibold mt-2 mb-3">Description</div>
            </div>
            <!--end::Col-->
            <!--begin::Col-->
            <div class="col-xl-9">
                <textarea name="description" class="form-control form-control-solid" placeholder="Long Description" rows="5"></textarea>
            </div>
            <!--end::Col-->
        </div>
        <!--end::Row-->
        <!--begin::Row-->
        <div class="row mb-8">
            <!--begin::Col-->
            <div class="col-xl-3">
                <div class="fs-6 fw-semibold mt-2 mb-3">Git Link</div>
            </div>
            <!--end::Col-->
            <!--begin::Col-->
            <div class="col-xl-9">
                <input type="text" name="gitLink" placeholder="Git Link" class="form-control form-control-solid" rows="5">
            </div>
            
            <!--end::Col-->
        </div>
        <!--end::Row-->
    
    </div>
    <!--end::Card body-->
    <!--begin::Card footer-->
    <div class="card-footer d-flex justify-content-end py-6">
        <button type="reset" class="btn btn-light btn-active-light-primary me-2">Discard</button>
        <button type="submit" class="btn btn-primary">Save Changes</button>
    </div>
    <!--end::Card footer-->
</div>
</form>