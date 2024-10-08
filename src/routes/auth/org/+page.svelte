<script>
	import { BACKEND_URL } from './../../../lib/constant/base.js';
    // @ts-ignore
    import { onMount } from 'svelte';

// @ts-nocheck

    import '../../../assets/login/css/plugins.bundle.css';
    import '../../../assets/login/css/style.bundle.css';

    import Swal from 'sweetalert2';
    const formData = {
        account_type: '',
        account_name: '',
        university_type: '',
        website: '',
        business_description: '',
        business_email: '',
        password: '',
        confirm_password: ''
    }
    const validateData = async() => {
        if (formData.password == '' || formData.confirm_password == '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'All fields are required!',
            })
            return false;
        } else {
            if (formData.password !== formData.confirm_password) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Password and Confirm Password do not match!',
                })
            } else {
                const formSubmitButton = document.querySelector('[data-kt-stepper-action="submit"]');
        // Disable button to avoid multiple click 
					// @ts-ignore
					formSubmitButton.disabled = true;

					// Show loading indication
					// @ts-ignore
					formSubmitButton.setAttribute('data-kt-indicator', 'on');

                    //submit data to server by calling submitData function promise resolve and reject handled
                        
                        try {
                            // @ts-ignore
							if(formData.account_type == 'University') {
                            const data = await submitUniversity();
							}
							else{
								const data = await submitOrganization();
							}
                            // @ts-ignore
                            formSubmitButton.removeAttribute('data-kt-indicator');

                            // Enable button
                            // @ts-ignore
                            formSubmitButton.disabled = false;
                            document.querySelector('#kt_create_account_form > div.d-flex.flex-stack.pt-15')?.remove();
                            // remove pending class name from stepper-item class list 4th element and  add completed class name to it
                            document.querySelectorAll('.stepper-item')[3].classList.remove('pending');
                            document.querySelectorAll('.stepper-item')[3].classList.add('completed');
                            // remove current class name from stepper-item class list 4th element and  add current class name to it
                            const current = document.querySelector('#kt_create_account_form > div.current');
                            current?.classList.remove('current');
                            current?.classList.add('completed');
                            current?.nextElementSibling?.classList.remove('pending');
                            current?.nextElementSibling?.classList.add('current');
                            document.querySelectorAll('.stepper-item')[3].classList.remove('current');
                            document.querySelectorAll('.stepper-item')[4].classList.add('completed');
                            // remove current class name from stepper-item class list 3rd element and  add current class name to it
                        } catch (error) {
                            // @ts-ignore
                            formSubmitButton.removeAttribute('data-kt-indicator');
                            // @ts-ignore
                            formSubmitButton.disabled = false;
                            // document.querySelector('#kt_create_account_form > div.current > div > div.mb-0 > div')?.classList.add('text-danger');
                            // document.querySelector('#kt_create_account_form > div.current > div > div.mb-0 > div').innerText = "Something went wrong! Please try again."
                            // document.querySelector('#kt_create_account_form > div.current > div > div.pb-8.pb-lg-10 > div').remove();
                            // document.querySelector('#kt_create_account_form > div.current > div > div.mb-0 > div.notice.d-flex.bg-light-warning.rounded.border-warning.border.border-dashed.p-6 > div > div > div').innerText = error.error.message;
                        }
                    


					// Simulate form submission
					// setTimeout(async function() {
					// 	// Hide loading indication
					// 	// @ts-ignore
					// 	formSubmitButton.removeAttribute('data-kt-indicator');

					// 	// Enable button
					// 	// @ts-ignore
					// 	formSubmitButton.disabled = false;
                    //     document.querySelector('#kt_create_account_form > div.d-flex.flex-stack.pt-15')?.remove();
					// 	// @ts-ignore
					// }, 2000);
            

                   
            }
            return false;
        }
    }
    const submitUniversity = async() => {
        const reqData = {
            name: formData.account_name,
            type: formData.university_type,
            email: formData.business_email,
            password: formData.password,
            website: formData.website,
            description: formData.business_description,
        };
        if(reqData.description == '') {
            // @ts-ignore
            delete reqData.description;
        }
        console.log(reqData);

        try {
            const response = await fetch(`${BACKEND_URL}/v1/university/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqData)
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Account Created!',
                    text: data.message,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.error.message,
                });
            }

            return new Promise((resolve, reject) => {
                if (response.ok) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        } catch (error) {
            console.log(error);
        }
    
    }

	const submitOrganization = async() => {
        const reqData = {
            name: formData.account_name,
            email: formData.business_email,
            password: formData.password,
            website: formData.website,
            description: formData.business_description,
        };
        if(reqData.description == '') {
            // @ts-ignore
            delete reqData.description;
        }
        console.log(reqData);

        try {
            const response = await fetch(`${BACKEND_URL}/v1/org/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqData)
            });

            const data = await response.json();

            if (response.status == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Account Created!',
                    text: data.message,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.error.message,
                });
            }

            return new Promise((resolve, reject) => {
                if (response.ok) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        } catch (error) {
            console.log(error);
        }
    
    }
	
</script>
<body id="kt_body" class="app-blank">
		<!--begin::Theme mode setup on page load-->
		<script>var defaultThemeMode = "light"; var themeMode; if ( document.documentElement ) { if ( document.documentElement.hasAttribute("data-bs-theme-mode")) { themeMode = document.documentElement.getAttribute("data-bs-theme-mode"); } else { if ( localStorage.getItem("data-bs-theme") !== null ) { themeMode = localStorage.getItem("data-bs-theme"); } else { themeMode = defaultThemeMode; } } if (themeMode === "system") { themeMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } document.documentElement.setAttribute("data-bs-theme", themeMode); }</script>
		<!--end::Theme mode setup on page load-->
		<!--begin::Root-->
		<div class="d-flex flex-column flex-root" id="kt_app_root">
			<!--begin::Authentication - Multi-steps-->
			<div class="d-flex flex-column flex-lg-row flex-column-fluid stepper stepper-pills stepper-column stepper-multistep" id="kt_create_account_stepper">
				<!--begin::Aside-->
				<div class="d-flex flex-column flex-lg-row-auto w-lg-350px w-xl-500px">
					<div class="d-flex flex-column position-lg-fixed top-0 bottom-0 w-lg-350px w-xl-500px scroll-y bgi-size-cover bgi-position-center" style="background: rgb(54,120,93);
background: linear-gradient(0deg, rgba(54,120,93,0.5775560224089635) 0%, rgba(21,21,33,1) 100%);">
						<!--begin::Header-->
						<div class="d-flex flex-center py-10 py-lg-20 mt-lg-20">
							<!--begin::Logo-->
							<a href="index.html">
								<img alt="Logo" src="../logo-light.png" class="h-70px" />
							</a>
							<!--end::Logo-->
						</div>
						<!--end::Header-->
						<!--begin::Body-->
						<div class="d-flex flex-row-fluid justify-content-center p-10">
							<!--begin::Nav-->
							<div class="stepper-nav">
								<!--begin::Step 1-->
								<div class="stepper-item current" data-kt-stepper-element="nav">
									<!--begin::Wrapper-->
									<div class="stepper-wrapper">
										<!--begin::Icon-->
										<div class="stepper-icon rounded-3">
											<i class="ki-outline ki-check fs-2 stepper-check"></i>
											<span class="stepper-number">1</span>
										</div>
										<!--end::Icon-->
										<!--begin::Label-->
										<div class="stepper-label">
											<h3 class="stepper-title fs-2">Account Type</h3>
											<div class="stepper-desc fw-normal">Select your account type</div>
										</div>
										<!--end::Label-->
									</div>
									<!--end::Wrapper-->
									<!--begin::Line-->
									<div class="stepper-line h-40px"></div>
									<!--end::Line-->
								</div>
								<!--end::Step 1-->
								<!--begin::Step 2-->
								<div class="stepper-item" data-kt-stepper-element="nav">
									<!--begin::Wrapper-->
									<div class="stepper-wrapper">
										<!--begin::Icon-->
										<div class="stepper-icon rounded-3">
											<i class="ki-outline ki-check fs-2 stepper-check"></i>
											<span class="stepper-number">2</span>
										</div>
										<!--end::Icon-->
										<!--begin::Label-->
										<div class="stepper-label">
											<h3 class="stepper-title fs-2">Account Info</h3>
											<div class="stepper-desc fw-normal">Setup your account settings</div>
										</div>
										<!--end::Label-->
									</div>
									<!--end::Wrapper-->
									<!--begin::Line-->
									<div class="stepper-line h-40px"></div>
									<!--end::Line-->
								</div>
								<!--end::Step 2-->
								<!--begin::Step 3-->
								<div class="stepper-item" data-kt-stepper-element="nav">
									<!--begin::Wrapper-->
									<div class="stepper-wrapper">
										<!--begin::Icon-->
										<div class="stepper-icon">
											<i class="ki-outline ki-check fs-2 stepper-check"></i>
											<span class="stepper-number">3</span>
										</div>
										<!--end::Icon-->
										<!--begin::Label-->
										<div class="stepper-label">
											<h3 class="stepper-title fs-2">Business Details</h3>
											<div class="stepper-desc fw-normal">Setup your business details</div>
										</div>
										<!--end::Label-->
									</div>
									<!--end::Wrapper-->
									<!--begin::Line-->
									<div class="stepper-line h-40px"></div>
									<!--end::Line-->
								</div>
								<!--end::Step 3-->
								<!--begin::Step 4-->
								<div class="stepper-item" data-kt-stepper-element="nav">
									<!--begin::Wrapper-->
									<div class="stepper-wrapper">
										<!--begin::Icon-->
										<div class="stepper-icon">
											<i class="ki-outline ki-check fs-2 stepper-check"></i>
											<span class="stepper-number">4</span>
										</div>
										<!--end::Icon-->
										<!--begin::Label-->
										<div class="stepper-label">
											<h3 class="stepper-title">Credentials</h3>
											<div class="stepper-desc fw-normal">Provide your credentials info</div>
										</div>
										<!--end::Label-->
									</div>
									<!--end::Wrapper-->
									<!--begin::Line-->
									<div class="stepper-line h-40px"></div>
									<!--end::Line-->
								</div>
								<!--end::Step 4-->
								<!--begin::Step 5-->
								<div class="stepper-item" data-kt-stepper-element="nav">
									<!--begin::Wrapper-->
									<div class="stepper-wrapper">
										<!--begin::Icon-->
										<div class="stepper-icon">
											<i class="ki-outline ki-check fs-2 stepper-check"></i>
											<span class="stepper-number">5</span>
										</div>
										<!--end::Icon-->
										<!--begin::Label-->
										<div class="stepper-label">
											<h3 class="stepper-title">Completed</h3>
											<div class="stepper-desc fw-normal">Your account is created</div>
										</div>
										<!--end::Label-->
									</div>
									<!--end::Wrapper-->
								</div>
								<!--end::Step 5-->
							</div>
							<!--end::Nav-->
						</div>
						<!--end::Body-->

					</div>
				</div>
				<!--begin::Aside-->
				<!--begin::Body-->
				<div class="d-flex flex-column flex-lg-row-fluid py-10">
					<!--begin::Content-->
					<div class="d-flex flex-center flex-column flex-column-fluid">
						<!--begin::Wrapper-->
						<div class="w-lg-650px w-xl-700px p-10 p-lg-15 mx-auto">
							<!--begin::Form-->
							<form on:submit|preventDefault={validateData} class="my-auto pb-5" novalidate="novalidate" id="kt_create_account_form">
								<!--begin::Step 1-->
								<div class="current" data-kt-stepper-element="content">
									<!--begin::Wrapper-->
									<div class="w-100">
										<!--begin::Heading-->
										<div class="pb-10 pb-lg-15">
											<!--begin::Title-->
											<h2 class="fw-bold d-flex align-items-center text-gray-900">Choose Account Type 
											<span class="ms-1" data-bs-toggle="tooltip" title="Billing is issued based on your selected account typ">
												<i class="ki-outline ki-information-5 text-gray-500 fs-6"></i>
											</span></h2>
											<!--end::Title-->
											<!--begin::Notice-->
											<div class="text-muted fw-semibold fs-6">If you need more info, please check out 
											<a href="#" class="link-primary fw-bold">Help Page</a>.</div>
											<!--end::Notice-->
										</div>
										<!--end::Heading-->
										<!--begin::Input group-->
										<div class="fv-row">
											<!--begin::Row-->
											<div class="row">
												<!--begin::Col-->
												<div class="col-lg-6">
													<!--begin::Option-->
													<input bind:group={formData.account_type} type="radio" class="btn-check" name="account_type" value="University" id="kt_create_account_form_account_type_personal" />
													<label class="btn btn-outline btn-outline-dashed btn-active-light-primary p-7 d-flex align-items-center mb-10" for="kt_create_account_form_account_type_personal">
														<i class="ki-outline ki-teacher fs-3x me-5"></i>
														<!--begin::Info-->
														<span class="d-block fw-semibold text-start">
															<span class="text-gray-900 fw-bold d-block fs-4 mb-2">University Account</span>
														</span>
														<!--end::Info-->
													</label>
													<!--end::Option-->
												</div>
												<!--end::Col-->
												<!--begin::Col-->
												<div class="col-lg-6">
													<!--begin::Option-->
													<input bind:group={formData.account_type} type="radio" class="btn-check" name="account_type" value="Organization" id="kt_create_account_form_account_type_corporate" />
													<label class="btn btn-outline btn-outline-dashed btn-active-light-primary p-7 d-flex align-items-center" for="kt_create_account_form_account_type_corporate">
														<i class="ki-outline ki-briefcase fs-3x me-5"></i>
														<!--begin::Info-->
														<span class="d-block fw-semibold text-start">
															<span class="text-gray-900 fw-bold d-block fs-4 mb-2">Organization Account</span>
														</span>
														<!--end::Info-->
													</label>
													<!--end::Option-->
												</div>
												<!--end::Col-->
											</div>
											<!--end::Row-->
										</div>
										<!--end::Input group-->
									</div>
									<!--end::Wrapper-->
								</div>
								<!--end::Step 1-->
								<!--begin::Step 2-->
								<div class="" data-kt-stepper-element="content">
									<!--begin::Wrapper-->
									<div class="w-100">
										<!--begin::Heading-->
										<div class="pb-10 pb-lg-15">
											<!--begin::Title-->
											<h2 class="fw-bold text-gray-900">Account Info</h2>
											<!--end::Title-->
											<!--begin::Notice-->
											<div class="text-muted fw-semibold fs-6">If you need more info, please check out 
											<a href="#" class="link-primary fw-bold">Help Page</a>.</div>
											<!--end::Notice-->
										</div>
										<!--end::Heading-->
									
										<!--begin::Input group-->
										<div class="mb-10 fv-row">
											<!--begin::Label-->
											<label class="form-label mb-3 required">{formData.account_type} Name</label>
											<!--end::Label-->
											<!--begin::Input-->
<input bind:value={formData.account_name} type="text" class="form-control form-control-lg form-control-solid" name="account_name" placeholder={`${formData.account_type} Name`} />
											<!--end::Input-->
										</div>
										<!--end::Input group-->
                                        {#if formData.account_type === 'University'}
										<!--begin::Input group-->
										<div class="mb-0 fv-row">
											<!--begin::Label-->
											<label class="d-flex align-items-center form-label mb-5">Select University Type 
											<span class="ms-1" data-bs-toggle="tooltip" title="Provide a catagory of your university">
												<i class="ki-outline ki-information-5 text-gray-500 fs-6"></i>
											</span></label>
											<!--end::Label-->
											<!--begin::Options-->
											<div class="mb-0">
												<!--begin:Option-->
												<label class="d-flex flex-stack mb-5 cursor-pointer">
													<!--begin:Label-->
													<span class="d-flex align-items-center me-2">
														<!--begin::Icon-->
														<span class="symbol symbol-50px me-6">
															<span class="symbol-label">
																<i class="ki-outline ki-bank fs-1 text-gray-600"></i>
															</span>
														</span>
														<!--end::Icon-->
														<!--begin::Description-->
														<span class="d-flex flex-column">
															<span class="fw-bold text-gray-800 text-hover-primary fs-5">Public University</span>
															<span class="fs-6 fw-semibold text-muted">Select this option if you are a public university</span>
														</span>
														<!--end:Description-->
													</span>
													<!--end:Label-->
													<!--begin:Input-->
													<span class="form-check form-check-custom form-check-solid">
														<input bind:group={formData.university_type} class="form-check-input" type="radio" name="university_type" value="public" />
													</span>
													<!--end:Input-->
												</label>
												<!--end::Option-->
												<!--begin:Option-->
												<label class="d-flex flex-stack mb-5 cursor-pointer">
													<!--begin:Label-->
													<span class="d-flex align-items-center me-2">
														<!--begin::Icon-->
														<span class="symbol symbol-50px me-6">
															<span class="symbol-label">
																<i class="ki-outline ki-chart fs-1 text-gray-600"></i>
															</span>
														</span>
														<!--end::Icon-->
														<!--begin::Description-->
														<span class="d-flex flex-column">
															<span class="fw-bold text-gray-800 text-hover-primary fs-5">Private University</span>
															<span class="fs-6 fw-semibold text-muted">Select this option if you are a private university</span>
														</span>
														<!--end:Description-->
													</span>
													<!--end:Label-->
													<!--begin:Input-->
													<span class="form-check form-check-custom form-check-solid">
														<input  bind:group={formData.university_type} class="form-check-input" type="radio" checked="checked" name="university_type" value="private" />
													</span>
													<!--end:Input-->
												</label>
												<!--end::Option-->
                                                <!--begin:Option-->
												<label class="d-flex flex-stack mb-5 cursor-pointer">
													<!--begin:Label-->
													<span class="d-flex align-items-center me-2">
														<!--begin::Icon-->
														<span class="symbol symbol-50px me-6">
															<span class="symbol-label">
																<i class="ki-outline ki-bank fs-1 text-gray-600"></i>
															</span>
														</span>
														<!--end::Icon-->
														<!--begin::Description-->
														<span class="d-flex flex-column">
															<span class="fw-bold text-gray-800 text-hover-primary fs-5">National University</span>
															<span class="fs-6 fw-semibold text-muted">Select this option if you are a national university</span>
														</span>
														<!--end:Description-->
													</span>
													<!--end:Label-->
													<!--begin:Input-->
													<span class="form-check form-check-custom form-check-solid">
														<input  bind:group={formData.university_type} class="form-check-input" type="radio" name="university_type" value="national" />
													</span>
													<!--end:Input-->
												</label>
												<!--end::Option-->
												<!--begin:Option-->
												<label class="d-flex flex-stack mb-0 cursor-pointer">
													<!--begin:Label-->
													<span class="d-flex align-items-center me-2">
														<!--begin::Icon-->
														<span class="symbol symbol-50px me-6">
															<span class="symbol-label">
																<i class="ki-outline ki-chart-pie-4 fs-1 text-gray-600"></i>
															</span>
														</span>
														<!--end::Icon-->
														<!--begin::Description-->
														<span class="d-flex flex-column">
															<span class="fw-bold text-gray-800 text-hover-primary fs-5">International University</span>
															<span class="fs-6 fw-semibold text-muted">Select this option if you are an international university</span>
														</span>
														<!--end:Description-->
													</span>
													<!--end:Label-->
													<!--begin:Input-->
													<span class="form-check form-check-custom form-check-solid">
														<input  bind:group={formData.university_type} class="form-check-input" type="radio" name="university_type" value="international" />
													</span>
													<!--end:Input-->
												</label>
												<!--end::Option-->
											</div>
											<!--end::Options-->
										</div>
										<!--end::Input group-->
                                        {/if}

									</div>
									<!--end::Wrapper-->
								</div>
								<!--end::Step 2-->
								<!--begin::Step 3-->
								<div class="" data-kt-stepper-element="content">
									<!--begin::Wrapper-->
									<div class="w-100">
										<!--begin::Heading-->
										<div class="pb-10 pb-lg-12">
											<!--begin::Title-->
											<h2 class="fw-bold text-gray-900">{formData.account_type} Details</h2>
											<!--end::Title-->
											<!--begin::Notice-->
											<div class="text-muted fw-semibold fs-6">If you need more info, please check out 
											<a href="#" class="link-primary fw-bold">Help Page</a>.</div>
											<!--end::Notice-->
										</div>
										<!--end::Heading-->
										<!--begin::Input group-->
										<div class="fv-row mb-10">
											<!--begin::Label-->
											<label class="form-label required">{formData.account_type} Website</label>
											<!--end::Label-->
											<!--begin::Input-->
<input name="website" bind:value={formData.website} class="form-control form-control-lg form-control-solid" placeholder="domain.com" />
											<!--end::Input-->
										</div>
										<!--end::Input group-->
										
										<!--begin::Input group-->
										<div class="fv-row mb-10">
											<!--end::Label-->
											<label class="form-label">{formData.account_type} Description</label>
											<!--end::Label-->
											<!--begin::Input-->
											<textarea name="business_description" bind:value={formData.business_description} class="form-control form-control-lg form-control-solid" placeholder={`${formData.account_type} Description`} rows="3"></textarea>
											<!--end::Input-->
										</div>
										<!--end::Input group-->
										<!--begin::Input group-->
										<div class="fv-row mb-0">
											<!--begin::Label-->
											<label class="fs-6 fw-semibold form-label required">{formData.account_type} Email</label>
											<!--end::Label-->
											<!--begin::Input-->
<input name="business_email" bind:value={formData.business_email} class="form-control form-control-lg form-control-solid" placeholder="someone@domain.com" />
											<!--end::Input-->
										</div>
										<!--end::Input group-->
									</div>
									<!--end::Wrapper-->
								</div>
								<!--end::Step 3-->
								<!--begin::Step 4-->
								<div class="" data-kt-stepper-element="content">
									<!--begin::Wrapper-->
									<div class="w-100">
										<!--begin::Heading-->
										<div class="pb-10 pb-lg-15">
											<!--begin::Title-->
											<h2 class="fw-bold text-gray-900">Credentials</h2>
											<!--end::Title-->
											<!--begin::Notice-->
											<div class="text-muted fw-semibold fs-6">If you need more info, please check out 
											<a href="#" class="text-primary fw-bold">Help Page</a>.</div>
											<!--end::Notice-->
										</div>
										<!--end::Heading-->
										<!--begin::Input group-->
										<div class="d-flex flex-column mb-7 fv-row">
											<!--begin::Label-->
											<label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
												<span class="required">Password</span>
												<span class="ms-1" data-bs-toggle="tooltip" title="Enter your Password">
													<i class="ki-outline ki-information-5 text-gray-500 fs-6"></i>
												</span>
											</label>
											<!--end::Label-->
<input type="password" bind:value={formData.password} class="form-control form-control-solid" placeholder="Enter Your Password" name="password" />
										</div>
										<!--end::Input group-->
										<!--begin::Input group-->
										<div class="d-flex flex-column mb-7 fv-row">
											<!--begin::Label-->
											<label class="required fs-6 fw-semibold form-label mb-2">Confirm Password</label>
											<!--end::Label-->
											<!--begin::Input wrapper-->
											<div class="position-relative">
												<!--begin::Input-->
<input type="password" bind:value={formData.confirm_password} class="form-control form-control-solid" placeholder="Re-Enter Your Password" name="confirm_password" />
												<!--end::Input-->
		
											</div>
											<!--end::Input wrapper-->
										</div>
										<!--end::Input group-->
							
									</div>
									<!--end::Wrapper-->
								</div>
								<!--end::Step 4-->
								<!--begin::Step 5-->
								<div class="" data-kt-stepper-element="content">
									<!--begin::Wrapper-->
									<div class="w-100">
										<!--begin::Heading-->
										<div class="pb-8 pb-lg-10">
											<!--begin::Title-->
											<h2 class="fw-bold text-gray-900">Your Are Done!</h2>
											<!--end::Title-->
											<!--begin::Notice-->
											<div class="text-muted fw-semibold fs-6">If you need more info, please 
											<a href="/auth" class="link-primary fw-bold">Sign In</a>.</div>
											<!--end::Notice-->
										</div>
										<!--end::Heading-->
										<!--begin::Body-->
										<div class="mb-0">
											<!--begin::Text-->
											<div class="fs-6 text-gray-600 mb-5">Your account has been successfully created!🎉 We'll contract you for verification process.</div>
											<!--end::Text-->
											<!--begin::Alert-->
											<!--begin::Notice-->
											<div class="notice d-flex bg-light-warning rounded border-warning border border-dashed p-6">
												<!--begin::Icon-->
												<i class="ki-outline ki-information fs-2tx text-warning me-4"></i>
												<!--end::Icon-->
												<!--begin::Wrapper-->
												<div class="d-flex flex-stack flex-grow-1">
													<!--begin::Content-->
													<div class="fw-semibold">
														<h4 class="text-gray-900 fw-bold">We need your attention!</h4>
														<div class="fs-6 text-gray-700">Your {formData.account_type} has been created, please, 
														<a href="/" class="fw-bold">Contact Us</a></div>
													</div>
													<!--end::Content-->
												</div>
												<!--end::Wrapper-->
											</div>
											<!--end::Notice-->
											<!--end::Alert-->
										</div>
										<!--end::Body-->
									</div>
									<!--end::Wrapper-->
								</div>
								<!--end::Step 5-->
								<!--begin::Actions-->
								<div class="d-flex flex-stack pt-15">
									<div class="mr-2">
										<button type="button" class="btn btn-lg btn-light-primary me-3" data-kt-stepper-action="previous">
										<i class="ki-outline ki-arrow-left fs-4 me-1"></i>Previous</button>
									</div>
									<div>
										<button type="submit" class="btn btn-lg btn-primary" data-kt-stepper-action="submit">
											<span class="indicator-label">Submit 
											<i class="ki-outline ki-arrow-right fs-4 ms-2"></i></span>
											<span class="indicator-progress">Please wait... 
											<span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
										</button>
										<button type="button" class="btn btn-lg btn-primary" data-kt-stepper-action="next">Continue 
										<i class="ki-outline ki-arrow-right fs-4 ms-1"></i></button>
									</div>
								</div>
								<!--end::Actions-->
							</form>
							<!--end::Form-->
						</div>
						<!--end::Wrapper-->
					</div>
					<!--end::Content-->
				</div>
				<!--end::Body-->
			</div>
			<!--end::Authentication - Multi-steps-->
		</div>
		<!--end::Root-->
		<!--begin::Javascript-->
		<!--begin::Global Javascript Bundle(mandatory for all pages)-->
		<script src="../login/js/plugins.bundle.js"></script>
		<script src="../login/js/scripts.bundle.js"></script>
		<!--end::Global Javascript Bundle-->
		<!--begin::Custom Javascript(used for this page only)-->
		<script src="../login/js/create-account.js"></script>
		<!--end::Custom Javascript-->
		<!--end::Javascript-->
		
	</body>
