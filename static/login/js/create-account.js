"use strict";

// Class definition
var KTCreateAccount = function () {
	// Elements
	var modal;	
	var modalEl;

	var stepper;
	var form;
	var formSubmitButton;
	var formContinueButton;

	// Variables
	var stepperObj;
	var validations = [];

	// Private Functions
	var initStepper = function () {
		// Initialize Stepper
		stepperObj = new KTStepper(stepper);

		// Stepper change event
		stepperObj.on('kt.stepper.changed', function (stepper) {
			if (stepperObj.getCurrentStepIndex() === 4) {
				formSubmitButton.classList.remove('d-none');
				formSubmitButton.classList.add('d-inline-block');
				formContinueButton.classList.add('d-none');
			} else if (stepperObj.getCurrentStepIndex() === 5) {
				formSubmitButton.classList.add('d-none');
				formContinueButton.classList.add('d-none');
			} else {
				formSubmitButton.classList.remove('d-inline-block');
				formSubmitButton.classList.remove('d-none');
				formContinueButton.classList.remove('d-none');
			}
		});

		// Validation before going to next page
		stepperObj.on('kt.stepper.next', function (stepper) {
			console.log('stepper.next');

			// Validate form before change stepper step
			var validator = validations[stepper.getCurrentStepIndex() - 1]; // get validator for currnt step

			if (validator) {
				validator.validate().then(function (status) {
					console.log('submitedd!');

					if (status == 'Valid') {
						stepper.goNext();

						KTUtil.scrollTop();
					} else {
						Swal.fire({
							text: "Sorry, looks like there are some errors detected, please try again.",
							icon: "error",
							buttonsStyling: false,
							confirmButtonText: "Ok, got it!",
							customClass: {
								confirmButton: "btn btn-light"
							}
						}).then(function () {
							KTUtil.scrollTop();
						});
					}
				});
			} else {
				stepper.goNext();

				KTUtil.scrollTop();
			}
		});

	

		// Prev event
		stepperObj.on('kt.stepper.previous', function (stepper) {
			console.log('stepper.previous');

			stepper.goPrevious();
			KTUtil.scrollTop();
		});
	}

	var handleForm = function() {
		// formSubmitButton.addEventListener('click', function (e) {
		// 	// Validate form before change stepper step
		// 	var validator = validations[3]; // get validator for last form

		// 	validator.validate().then(async function(status) {
			

		// 		if (status == 'Valid') {
		// 			// Prevent default button action
		// 			e.preventDefault();

		// 			// Disable button to avoid multiple click 
		// 			formSubmitButton.disabled = true;

		// 			// Show loading indication
		// 			formSubmitButton.setAttribute('data-kt-indicator', 'on');

		// 			// Simulate form submission
		// 			setTimeout(async function() {
		// 				// Hide loading indication
		// 				formSubmitButton.removeAttribute('data-kt-indicator');

		// 				// Enable button
		// 				formSubmitButton.disabled = false;
		// 				stepperObj.goNext();
		// 			}, 2000);
		// 		} else {
		// 			Swal.fire({
		// 				text: "Sorry, looks like there are some errors detected, please try again.",
		// 				icon: "error",
		// 				buttonsStyling: false,
		// 				confirmButtonText: "Ok, got it!",
		// 				customClass: {
		// 					confirmButton: "btn btn-light"
		// 				}
		// 			}).then(function () {
		// 				KTUtil.scrollTop();
		// 			});
		// 		}
		// 	});
		// });

		// Expiry month. For more info, plase visit the official plugin site: https://select2.org/
        $(form.querySelector('[name="password"]')).on('change', function() {
            // Revalidate the field when an option is chosen
            validations[3].revalidateField('Password must be at least 6 characters long');
        });

		// Expiry year. For more info, plase visit the official plugin site: https://select2.org/
        $(form.querySelector('[name="confirm_password"]')).on('change', function() {
            // Revalidate the field when an option is chosen
            validations[3].revalidateField('Password and confirm password must be same');
        });

		// Expiry year. For more info, plase visit the official plugin site: https://select2.org/
        $(form.querySelector('[name="business_type"]')).on('change', function() {
            // Revalidate the field when an option is chosen
            validations[2].revalidateField('business_type');
        });
	}

	var initValidation = function () {
		// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
		// Step 1
		validations.push(FormValidation.formValidation(
			form,
			{
				fields: {
					account_type: {
						validators: {
							notEmpty: {
								message: 'Account type is required'
							}
						}
					}
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap5({
						rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
					})
				}
			}
		));

		// Step 2
		validations.push(FormValidation.formValidation(
			form,
			{
				fields: {
					'account_name': {
						validators: {
							notEmpty: {
								message: 'Account name is required'
							}
						}
					},
					'university_type': {
						validators: {
							notEmpty: {
								message: 'University type is required'
							}
						}
					}
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					// Bootstrap Framework Integration
					bootstrap: new FormValidation.plugins.Bootstrap5({
						rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
					})
				}
			}
		));

		// Step 3
		validations.push(FormValidation.formValidation(
			form,
			{
				fields: {
					'website': {
						validators: {
							notEmpty: {
								message: 'Website is required'
							},
							uri: {
								message: 'The value is not a valid URL',
								allowEmptyProtocol: true
							
							}
						}
					},
					'business_descriptor': {
						validators: {
							notEmpty: {
								message: 'Busines descriptor is required'
							}
						}
					},
					'business_email': {
						validators: {
							notEmpty: {
								message: 'Busines email is required'
							},
							emailAddress: {
								message: 'The value is not a valid email address'
							}
						}
					}
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					// Bootstrap Framework Integration
					bootstrap: new FormValidation.plugins.Bootstrap5({
						rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
					})
				}
			}
		));

		// Step 4
		validations.push(FormValidation.formValidation(
			form,
			{
				fields: {
					'password': {
						validators: {
							notEmpty: {
								message: 'Password is required'
							}
						}
					},
					'confirm_password': {
						validators: {
							notEmpty: {
								message: 'Confirm Password is required'
							},
							identical: {
								compare: function () {
									return form.querySelector('[name="password"]').value;
								},
								message: 'The password and its confirm are not the same',
							},
						}
					},
					
				},

				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					// Bootstrap Framework Integration
					bootstrap: new FormValidation.plugins.Bootstrap5({
						rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
					})
				}
			}
		));
	}

	return {
		// Public Functions
		init: function () {
			// Elements
			modalEl = document.querySelector('#kt_modal_create_account');

			if ( modalEl ) {
				modal = new bootstrap.Modal(modalEl);	
			}					

			stepper = document.querySelector('#kt_create_account_stepper');

			if ( !stepper ) {
				return;
			}

			form = stepper.querySelector('#kt_create_account_form');
			formSubmitButton = stepper.querySelector('[data-kt-stepper-action="submit"]');
			formContinueButton = stepper.querySelector('[data-kt-stepper-action="next"]');

			initStepper();
			initValidation();
			handleForm();
		}
	};
}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTCreateAccount.init();
});