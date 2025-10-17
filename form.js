alert("Welcome onboard");

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#registrationForm");
    const emailInput = document.querySelector("#email");
    const countryInput = document.querySelector("#country");
    const postalCodeInput = document.querySelector("#postalCode");
    const passwordInput = document.querySelector("#password");
    const passwordConfirmationInput = document.querySelector("#passwordConfirmation");
    const errorSummary = document.querySelector("#errorSummary");
    const successMessage = document.querySelector("#successMessage");
    const passwordStrength = document.querySelector("#passwordStrength");

    // Email validation
    emailInput.addEventListener("input", validateEmail);
    countryInput.addEventListener("change", validateCountry);
    postalCodeInput.addEventListener("input", validatePostalCode);
    passwordInput.addEventListener("input", () => {
        validatePassword();
        updatePasswordStrength();
        validatePasswordConfirmation();
    });
    passwordConfirmationInput.addEventListener("input", validatePasswordConfirmation);

    // Form submission
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const isEmailValid = validateEmail();
        const isCountryValid = validateCountry();
        const isPostalCodeValid = validatePostalCode();
        const isPasswordValid = validatePassword();
        const isPasswordConfirmationValid = validatePasswordConfirmation();

        if (isEmailValid && isCountryValid && isPostalCodeValid && isPasswordValid && isPasswordConfirmationValid) {
            successMessage.style.display = "block";
            errorSummary.style.display = "none";

            setTimeout(() => {
                form.reset();
                successMessage.style.display = "none";

                document.querySelectorAll("input").forEach(input => {
                    input.classList.remove("valid", "invalid");
                });
                document.querySelectorAll(".error-message").forEach(error => {
                    error.style.display = "none";
                });
                passwordStrength.className = "password-strength";
            }, 3000);
        } else {
            errorSummary.style.display = "block";
            errorSummary.textContent = "Please fix the errors above before submitting the form.";
            successMessage.style.display = "none";
        }
    });

    // Validation functions
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailError = document.querySelector("#emailError");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === "") {
            showError(emailInput, emailError, "Email is required");
            return false;
        } else if (!emailRegex.test(email)) {
            showError(emailInput, emailError, "Please enter a valid email address");
            return false;
        } else {
            showSuccess(emailInput, emailError);
            return true;
        }
    }

    function validateCountry() {
        const country = countryInput.value;
        const countryError = document.querySelector("#countryError");
        if (country === "") {
            showError(countryInput, countryError, "Please select a country");
            return false;
        } else {
            showSuccess(countryInput, countryError);
            return true;
        }
    }

    function validatePostalCode() {
        const postalCode = postalCodeInput.value.trim();
        const country = countryInput.value;
        const postalCodeError = document.querySelector("#postalCodeError");

        if (postalCode === "") {
            showError(postalCodeInput, postalCodeError, "Postal code is required");
            return false;
        }

        let isValid = false;
        let errorMessage = "Please enter a valid postal code";

        switch (country) {
            case "US":
                isValid = /^\d{5}(-\d{4})?$/.test(postalCode);
                errorMessage = "Please enter a valid US ZIP code (e.g., 90210 or 90210-1234)";
                break;
            case "CA":
                isValid = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(postalCode);
                errorMessage = "Please enter a valid Canadian postal code (e.g., M5V 2T6)";
                break;
            case "UK":
                isValid = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/.test(postalCode.toUpperCase());
                errorMessage = "Please enter a valid UK postcode (e.g., SW1A 1AA)";
                break;
            case "AU":
                isValid = /^\d{4}$/.test(postalCode);
                errorMessage = "Please enter a valid Australian postcode (4 digits)";
                break;
            case "DE":
            case "FR":
                isValid = /^\d{5}$/.test(postalCode);
                errorMessage = `Please enter a valid ${country === "DE" ? "German" : "French"} postal code (5 digits)`;
                break;
            case "JP":
                isValid = /^\d{3}-?\d{4}$/.test(postalCode);
                errorMessage = "Please enter a valid Japanese postal code (e.g., 123-4567)";
                break;
            case "NG":
                isValid = /^\d{6}$/.test(postalCode);
                errorMessage = "Please enter a valid Nigerian postal code (6 digits)";
                break;
            default:
                isValid = postalCode.length > 0;
        }

        if (!isValid) {
            showError(postalCodeInput, postalCodeError, errorMessage);
            return false;
        } else {
            showSuccess(postalCodeInput, postalCodeError);
            return true;
        }
    }

    function validatePassword() {
        const password = passwordInput.value;
        const passwordError = document.querySelector("#passwordError");

        if (password === "") {
            showError(passwordInput, passwordError, "Password is required");
            return false;
        } else if (password.length < 8) {
            showError(passwordInput, passwordError, "Password must be at least 8 characters long");
            return false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            showError(passwordInput, passwordError, "Need upperCase, lowercase and a number");
            return false;
        } else {
            showSuccess(passwordInput, passwordError);
            return true;
        }
    }

    function validatePasswordConfirmation() {
        const password = passwordInput.value;
        const confirmPassword = passwordConfirmationInput.value;
        const passwordConfirmationError = document.querySelector("#passwordConfirmationError");

        if (confirmPassword === "") {
            showError(passwordConfirmationInput, passwordConfirmationError, "Please confirm your password");
            return false;
        } else if (password !== confirmPassword) {
            showError(passwordConfirmationInput, passwordConfirmationError, "Passwords do not match");
            return false;
        } else {
            showSuccess(passwordConfirmationInput, passwordConfirmationError);
            return true;
        }
    }

    function updatePasswordStrength() {
        const password = passwordInput.value;
        passwordStrength.className = "password-strength";

        if (password.length === 0) return;

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        if (strength < 4) {
            passwordStrength.className = "password-strength strength-weak";
        } else if (strength < 6) {
            passwordStrength.className = "password-strength strength-medium";
        } else {
            passwordStrength.className = "password-strength strength-strong";
        }
    }

    function showError(input, errorElement, message) {
        input.classList.remove("valid");
        input.classList.add("invalid");
        errorElement.textContent = message;
        errorElement.style.display = "block";
    }

    function showSuccess(input, errorElement) {
        input.classList.remove("invalid");
        input.classList.add("valid");
        errorElement.style.display = "none";
    }
});
