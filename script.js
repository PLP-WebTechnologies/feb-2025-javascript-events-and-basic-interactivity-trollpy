// DOM Elements
const profileForm = document.getElementById('profileForm');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const bio = document.getElementById('bio');
const interests = document.querySelectorAll('input[name="interests"]');
const togglePasswordBtn = document.getElementById('togglePassword');
const charCount = document.getElementById('char-count');
const formResult = document.getElementById('formResult');
const profileSummary = document.getElementById('profileSummary');
const resetBtn = document.getElementById('resetBtn');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.querySelector('.strength-text');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Form submission event
    profileForm.addEventListener('submit', validateAndSubmit);
    
    // Password toggle visibility
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    
    // Password strength meter
    password.addEventListener('input', updatePasswordStrength);
    
    // Character counter for bio
    bio.addEventListener('input', updateCharacterCount);
    
    // Reset form button
    resetBtn.addEventListener('click', resetForm);
    
    // Live validation on blur
    username.addEventListener('blur', () => validateField(username, validateUsername));
    email.addEventListener('blur', () => validateField(email, validateEmail));
    password.addEventListener('blur', () => validateField(password, validatePassword));
    
    // Focus effects
    const formFields = profileForm.querySelectorAll('input, textarea');
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        field.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});

// Toggle password visibility
function togglePasswordVisibility() {
    if (password.type === 'password') {
        password.type = 'text';
        togglePasswordBtn.textContent = 'Hide';
    } else {
        password.type = 'password';
        togglePasswordBtn.textContent = 'Show';
    }
}

// Update password strength indicator
function updatePasswordStrength() {
    const value = password.value;
    
    // Remove previous classes
    strengthBar.className = 'strength-bar';
    
    if (value.length === 0) {
        strengthText.textContent = '';
        return;
    }
    
    let strength = 0;
    
    // Check for various criteria
    if (value.length > 7) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/[0-9]/.test(value)) strength++;
    if (/[^A-Za-z0-9]/.test(value)) strength++;
    
    // Update UI based on strength score
    if (strength <= 1) {
        strengthBar.classList.add('weak');
        strengthText.textContent = 'Weak password';
        strengthText.style.color = '#e74c3c';
    } else if (strength <= 3) {
        strengthBar.classList.add('medium');
        strengthText.textContent = 'Medium password';
        strengthText.style.color = '#f39c12';
    } else {
        strengthBar.classList.add('strong');
        strengthText.textContent = 'Strong password';
        strengthText.style.color = '#2ecc71';
    }
}

// Update character count for bio
function updateCharacterCount() {
    const count = bio.value.length;
    charCount.textContent = `${count}/200`;
    
    if (count > 200) {
        charCount.classList.add('limit');
    } else {
        charCount.classList.remove('limit');
    }
}

// Validation functions
function validateUsername(value) {
    if (value.trim() === '') return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters';
    return '';
}

function validateEmail(value) {
    if (value.trim() === '') return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return '';
}

function validatePassword(value) {
    if (value.trim() === '') return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    return '';
}

function validateBio(value) {
    if (value.length > 200) return 'Bio cannot exceed 200 characters';
    return '';
}

function validateInterests() {
    let checked = false;
    interests.forEach(interest => {
        if (interest.checked) checked = true;
    });
    return checked ? '' : 'Please select at least one interest';
}

// Generic field validation helper
function validateField(field, validationFunction) {
    const error = validationFunction(field.value);
    const errorElement = document.getElementById(`${field.id}-error`);
    
    if (error) {
        field.classList.add('error');
        errorElement.textContent = error;
        return false;
    } else {
        field.classList.remove('error');
        errorElement.textContent = '';
        return true;
    }
}

// Form submission handler
function validateAndSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const usernameValid = validateField(username, validateUsername);
    const emailValid = validateField(email, validateEmail);
    const passwordValid = validateField(password, validatePassword);
    const bioValid = validateField(bio, validateBio);
    
    // Validate interests
    const interestsError = validateInterests();
    const interestsErrorElement = document.getElementById('interests-error');
    const interestsValid = interestsError === '';
    
    if (!interestsValid) {
        interestsErrorElement.textContent = interestsError;
    } else {
        interestsErrorElement.textContent = '';
    }
    
    // If all validations pass
    if (usernameValid && emailValid && passwordValid && bioValid && interestsValid) {
        // Collect selected interests
        const selectedInterests = [];
        interests.forEach(interest => {
            if (interest.checked) {
                selectedInterests.push(interest.nextElementSibling.textContent);
            }
        });
        
        // Display result
        profileForm.classList.add('hidden');
        formResult.classList.remove('hidden');
        
        // Create summary content
        profileSummary.innerHTML = `
            <p><strong>Username:</strong> ${username.value}</p>
            <p><strong>Email:</strong> ${email.value}</p>
            <p><strong>Bio:</strong> ${bio.value}</p>
            <p><strong>Interests:</strong> ${selectedInterests.join(', ')}</p>
        `;
    }
}

// Reset form
function resetForm() {
    profileForm.reset();
    
    // Reset all error messages
    document.querySelectorAll('.error-message').forEach(element => {
        element.textContent = '';
    });
    
    // Reset form fields classes
    document.querySelectorAll('.error').forEach(element => {
        element.classList.remove('error');
    });
    
    // Reset password strength indicator
    strengthBar.className = 'strength-bar';
    strengthText.textContent = '';
    
    // Reset character count
    charCount.textContent = '0/200';
    charCount.classList.remove('limit');
    
    // Show form, hide result
    profileForm.classList.remove('hidden');
    formResult.classList.add('hidden');
}