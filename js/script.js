'use strict';

/**
 * Candlemen - Main JavaScript
 * Handles form validation, mobile navigation, and UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initMobileNavigation();
    initSmoothScrolling();
    initContactForm();
    initScrollAnimations();
    initHeaderScroll();
});

/**
 * Mobile Navigation Toggle
 * Handles the hamburger menu for mobile devices
 */
function initMobileNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (!mobileMenuBtn || !navLinks) return;

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animate hamburger to X
        const spans = mobileMenuBtn.querySelectorAll('span');
        mobileMenuBtn.classList.toggle('active');
        
        if (mobileMenuBtn.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking on a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

/**
 * Smooth Scrolling
 * Adds smooth scroll behavior for anchor links
 */
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Contact Form Validation
 * Validates and handles form submission
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');

    // Validation patterns
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\d\s\-\+\(\)]+$/
    };

    // Real-time validation
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            validateField(emailInput, patterns.email.test(emailInput.value), 'Please enter a valid email address');
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('blur', () => {
            if (phoneInput.value.trim()) {
                const cleaned = phoneInput.value.replace(/[\s\-\+\(\)]/g, '');
                if (cleaned.length < 10) {
                    showError(phoneInput, 'Please enter a valid phone number');
                } else {
                    showSuccess(phoneInput);
                }
            }
        });
    }

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;

        // Validate name
        if (nameInput) {
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Please enter your name');
                isValid = false;
            } else if (nameInput.value.trim().length < 2) {
                showError(nameInput, 'Name must be at least 2 characters');
                isValid = false;
            } else {
                showSuccess(nameInput);
            }
        }

        // Validate email
        if (emailInput) {
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Please enter your email');
                isValid = false;
            } else if (!patterns.email.test(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                showSuccess(emailInput);
            }
        }

        // Validate message
        if (messageInput) {
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Please enter your message');
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                showError(messageInput, 'Message must be at least 10 characters');
                isValid = false;
            } else {
                showSuccess(messageInput);
            }
        }

        // Validate phone (optional but validated if provided)
        if (phoneInput && phoneInput.value.trim()) {
            const cleaned = phoneInput.value.replace(/[\s\-\+\(\)]/g, '');
            if (cleaned.length < 10) {
                showError(phoneInput, 'Please enter a valid phone number');
                isValid = false;
            } else {
                showSuccess(phoneInput);
            }
        }

        if (isValid) {
            // Show success message
            showFormSuccess(form);
            
            // Here you would typically send the data to a server
            // For now, we'll just log it and show a success message
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput ? phoneInput.value.trim() : '',
                message: messageInput.value.trim()
            };
            
            console.log('Form submitted:', formData);
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
                clearValidationStates(form);
            }, 3000);
        }
    });

    // Clear validation on input
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            clearFieldValidation(input);
        });
    });
}

/**
 * Show error message for a field
 */
function showError(input, message) {
    clearFieldValidation(input);
    input.classList.add('error');
    
    // Remove existing error message
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
}

/**
 * Show success state for a field
 */
function showSuccess(input) {
    clearFieldValidation(input);
    input.classList.add('success');
}

/**
 * Clear validation state for a field
 */
function clearFieldValidation(input) {
    input.classList.remove('error', 'success');
    const errorMessage = input.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

/**
 * Clear all validation states in a form
 */
function clearValidationStates(form) {
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        clearFieldValidation(input);
    });
    
    const successMessage = form.querySelector('.form-success-message');
    if (successMessage) {
        successMessage.remove();
    }
}

/**
 * Show form success message
 */
function showFormSuccess(form) {
    // Remove existing success message
    const existingSuccess = form.querySelector('.form-success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success-message';
    successDiv.style.cssText = `
        background-color: #7CB342;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        text-align: center;
        font-weight: 500;
        animation: fadeInUp 0.5s ease;
    `;
    successDiv.textContent = 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.';
    
    form.insertBefore(successDiv, form.firstChild);
}

/**
 * Scroll Animations
 * Adds fade-in animations when elements come into view
 */
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
}

/**
 * Header Scroll Effect
 * Adds shadow to header on scroll
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 12px rgba(44, 24, 16, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 4px rgba(44, 24, 16, 0.1)';
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);