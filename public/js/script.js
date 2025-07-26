const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

// Form validation rules
const validators = {
    firstName: (value) => value.trim().length >= 2,
    lastName: (value) => value.trim().length >= 2,
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    phone: (value) => !value || /^[\+]?[\d\s\-\(\)]{10,}$/.test(value),
    subject: (value) => value !== '',
    message: (value) => value.trim().length >= 10,
    terms: (checked) => checked
};

// Real-time validation
Object.keys(validators).forEach(fieldName => {
    const field = document.getElementById(fieldName);
    if (field) {
        field.addEventListener('input', () => validateField(fieldName));
        field.addEventListener('blur', () => validateField(fieldName));
    }
});

function validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldName + 'Error');
    const formGroup = field.closest('.form-group');
    
    let isValid;
    if (field.type === 'checkbox') {
        isValid = validators[fieldName](field.checked);
    } else {
        isValid = validators[fieldName](field.value);
    }

    if (isValid) {
        formGroup.classList.remove('error');
        errorElement.classList.remove('show');
    } else {
        formGroup.classList.add('error');
        errorElement.classList.add('show');
    }

    return isValid;
}

function validateForm() {
    let isFormValid = true;
    
    Object.keys(validators).forEach(fieldName => {
        if (!validateField(fieldName)) {
            isFormValid = false;
        }
    });

    return isFormValid;
}

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span>Sending...';
    submitBtn.disabled = true;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Show success message
    successMessage.style.display = 'block';
    successMessage.scrollIntoView({ behavior: 'smooth' });
    
    // Reset form
    form.reset();
    
    // Reset button
    submitBtn.innerHTML = 'Send Message';
    submitBtn.disabled = false;

    // Clear any error states
    document.querySelectorAll('.form-group.error').forEach(group => {
        group.classList.remove('error');
    });
    document.querySelectorAll('.error-message.show').forEach(msg => {
        msg.classList.remove('show');
    });

    // Hide success message after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
});

// Add smooth animations for form interactions
document.querySelectorAll('input, select, textarea').forEach(element => {
    element.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    element.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Phone number formatting
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{3})/, '($1) $2');
    }
    e.target.value = value;
});