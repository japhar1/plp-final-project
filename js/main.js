// ==========================================
// Professional Portfolio - Main JavaScript
// ==========================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // MOBILE NAVIGATION TOGGLE
    // ==========================================
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = mobileToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    }

    // ==========================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ==========================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only apply smooth scroll if target exists
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==========================================
    // SCROLL ANIMATIONS
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const animatedElements = document.querySelectorAll(
        '.intro-card, .service-card, .project-card, .about-content, .skills-container'
    );
    
    animatedElements.forEach(el => observer.observe(el));

    // ==========================================
    // SKILL BAR ANIMATIONS
    // ==========================================
    const skillBars = document.querySelectorAll('.skill-bar');
    
    if (skillBars.length > 0) {
        const skillObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target.querySelector('.progress');
                    const width = progressBar.style.width;
                    progressBar.style.width = '0%';
                    
                    setTimeout(() => {
                        progressBar.style.width = width;
                    }, 100);
                    
                    skillObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        skillBars.forEach(bar => skillObserver.observe(bar));
    }

    // ==========================================
    // CONTACT FORM VALIDATION & SUBMISSION
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Form validation patterns
        const validationRules = {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'Please enter a valid name (letters only, min 2 characters)'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            subject: {
                required: true,
                minLength: 3,
                message: 'Subject must be at least 3 characters long'
            },
            message: {
                required: true,
                minLength: 10,
                message: 'Message must be at least 10 characters long'
            }
        };

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.parentElement.classList.contains('error')) {
                    validateField(this);
                }
            });
        });

        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                submitForm();
            }
        });

        // Field validation function
        function validateField(field) {
            const formGroup = field.parentElement;
            const errorMessage = formGroup.querySelector('.error-message');
            const fieldName = field.name;
            const value = field.value.trim();
            const rules = validationRules[fieldName];

            // Clear previous error
            formGroup.classList.remove('error');
            errorMessage.textContent = '';

            // Check if required
            if (rules.required && !value) {
                showError(formGroup, errorMessage, 'This field is required');
                return false;
            }

            // Check minimum length
            if (rules.minLength && value.length < rules.minLength) {
                showError(formGroup, errorMessage, rules.message);
                return false;
            }

            // Check pattern
            if (rules.pattern && !rules.pattern.test(value)) {
                showError(formGroup, errorMessage, rules.message);
                return false;
            }

            return true;
        }

        // Show error function
        function showError(formGroup, errorElement, message) {
            formGroup.classList.add('error');
            errorElement.textContent = message;
        }

        // Submit form function
        function submitForm() {
            const formStatus = document.getElementById('formStatus');
            const submitButton = contactForm.querySelector('button[type="submit"]');
            
            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Get form data
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value
                };

                console.log('Form submitted:', formData);

                // Show success message
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Thank you! Your message has been sent successfully. I\'ll get back to you soon.';

                // Reset form
                contactForm.reset();

                // Reset button
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';

                // Hide success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);

            }, 1500);

            /* 
            // Example: Actual form submission to server
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    formStatus.className = 'form-status success';
                    formStatus.textContent = 'Message sent successfully!';
                    contactForm.reset();
                } else {
                    formStatus.className = 'form-status error';
                    formStatus.textContent = 'Failed to send message. Please try again.';
                }
            })
            .catch(error => {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'An error occurred. Please try again later.';
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            });
            */
        }
    }

    // ==========================================
    // NAVBAR BACKGROUND ON SCROLL
    // ==========================================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add shadow when scrolled
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });

    // ==========================================
    // PROJECT FILTER (if on projects page)
    // ==========================================
    const projectCards = document.querySelectorAll('.project-card');
    
    if (projectCards.length > 0) {
        // Add hover effect that slightly rotates cards
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) rotateZ(1deg)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) rotateZ(0)';
            });
        });
    }

    // ==========================================
    // BUTTON RIPPLE EFFECT
    // ==========================================
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ==========================================
    // SCROLL TO TOP BUTTON (Optional)
    // ==========================================
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);

    // Add styles for scroll to top button
    const scrollBtnStyle = document.createElement('style');
    scrollBtnStyle.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        .scroll-to-top:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
        }
    `;
    document.head.appendChild(scrollBtnStyle);

    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==========================================
    // CONSOLE MESSAGE (Easter Egg)
    // ==========================================
    console.log('%c👋 Hello Developer!', 'font-size: 20px; font-weight: bold; color: #6366f1;');
    console.log('%cLooking for the source code? Check out the project on GitHub!', 'font-size: 14px; color: #334155;');
    console.log('%cBuilt with ❤️ using HTML, CSS, and JavaScript', 'font-size: 12px; color: #8b5cf6;');

});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Debounce function for performance optimization
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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Format date (useful for blog/news sections)
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Truncate text with ellipsis
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// ==========================================
// PERFORMANCE OPTIMIZATIONS
// ==========================================

// Lazy load images (if you add images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ==========================================
// ACCESSIBILITY ENHANCEMENTS
// ==========================================

// Skip to main content link for keyboard navigation
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.textContent = 'Skip to main content';
skipLink.className = 'skip-link';
document.body.insertBefore(skipLink, document.body.firstChild);

// Add skip link styles
const skipLinkStyle = document.createElement('style');
skipLinkStyle.textContent = `
    .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: #6366f1;
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 9999;
    }
    .skip-link:focus {
        top: 0;
    }
`;
document.head.appendChild(skipLinkStyle);

// Announce page changes for screen readers
function announcePageChange(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ==========================================
// DYNAMIC YEAR IN FOOTER
// ==========================================
const footerYear = document.querySelector('.footer p');
if (footerYear && footerYear.textContent.includes('2025')) {
    const currentYear = new Date().getFullYear();
    footerYear.textContent = footerYear.textContent.replace('2025', currentYear);
}

// ==========================================
// PREFETCH PAGES FOR FASTER NAVIGATION
// ==========================================
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
        const href = this.getAttribute('href');
        if (href && !href.startsWith('#')) {
            const linkTag = document.createElement('link');
            linkTag.rel = 'prefetch';
            linkTag.href = href;
            document.head.appendChild(linkTag);
        }
    });
});

// ==========================================
// FORM AUTO-SAVE (Draft Feature)
// ==========================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    // Auto-save form data to memory (not localStorage as per restrictions)
    let formDraft = {};
    
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        // Load saved draft on page load
        if (formDraft[input.name]) {
            input.value = formDraft[input.name];
        }
        
        // Save draft on input change
        input.addEventListener('input', debounce(function() {
            formDraft[this.name] = this.value;
            console.log('Draft saved to memory');
        }, 500));
    });
    
    // Clear draft on successful submission
    contactForm.addEventListener('submit', function() {
        formDraft = {};
        console.log('Draft cleared');
    });
}

// ==========================================
// THEME TOGGLE (Optional Enhancement)
// ==========================================
/*
// Uncomment this section if you want to add dark mode functionality

function createThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    themeToggle.innerHTML = '🌙';
    document.body.appendChild(themeToggle);
    
    // Add theme toggle styles
    const themeStyle = document.createElement('style');
    themeStyle.textContent = `
        .theme-toggle {
            position: fixed;
            bottom: 30px;
            left: 30px;
            width: 50px;
            height: 50px;
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 999;
            transition: all 0.3s ease;
        }
        .theme-toggle:hover {
            transform: scale(1.1);
        }
        body.dark-mode {
            --light-color: #1e293b;
            --dark-color: #f8fafc;
            --text-color: #e2e8f0;
            --border-color: #334155;
        }
        body.dark-mode .navbar,
        body.dark-mode .intro-section,
        body.dark-mode .about-section,
        body.dark-mode .services-section,
        body.dark-mode .projects-section,
        body.dark-mode .contact-section {
            background: #0f172a;
            color: #e2e8f0;
        }
    `;
    document.head.appendChild(themeStyle);
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });
}

// createThemeToggle(); // Uncomment to enable
*/

// ==========================================
// ERROR HANDLING
// ==========================================
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
    // You can send error reports to your analytics service here
});

// ==========================================
// PRINT STYLES HANDLER
// ==========================================
window.addEventListener('beforeprint', function() {
    console.log('Page is being printed');
    // You can modify content before printing if needed
});

// ==========================================
// ONLINE/OFFLINE STATUS
// ==========================================
window.addEventListener('online', function() {
    console.log('Back online!');
    announcePageChange('Internet connection restored');
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
    announcePageChange('Internet connection lost');
});

// ==========================================
// INITIALIZATION COMPLETE
// ==========================================
console.log('%c✅ Portfolio Initialized Successfully', 'color: #10b981; font-weight: bold;');