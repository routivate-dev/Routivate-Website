/* ===============================
   MOBILE MENU TOGGLE
================================= */
let mobileMenuToggle;
let navContainer;

document.addEventListener("DOMContentLoaded", () => {
    mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    navContainer = document.querySelector('.nav-container');
    
    mobileMenuToggle?.addEventListener('click', () => {
        navContainer.classList.toggle('active');
        const isOpen = navContainer.classList.contains('active');
        mobileMenuToggle.textContent = isOpen ? '✕' : '☰';
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navContainer?.classList.contains('active') && 
        !navContainer.contains(e.target) && 
        e.target !== mobileMenuToggle) {
        navContainer.classList.remove('active');
        mobileMenuToggle.textContent = '☰';
        document.body.style.overflow = '';
    }
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navContainer?.classList.contains('active')) {
        navContainer.classList.remove('active');
        mobileMenuToggle.textContent = '☰';
        document.body.style.overflow = '';
    }
});

// Close menu when a nav link is clicked (for mobile)
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        if (navContainer?.classList.contains('active')) {
            navContainer.classList.remove('active');
            mobileMenuToggle.textContent = '☰';
            document.body.style.overflow = '';
        }
        
        // Allow normal navigation for internal links
        const href = link.getAttribute("href");
        if (href.endsWith('.html')) {
            window.location.href = href; // Allow navigation to HTML pages
            return; // Ensure we exit after navigation
        }
    });
});

/* ===============================
   THEME TOGGLE (Light / Dark)
================================= */
const htmlEl = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");

// Persist theme across visits
const savedTheme = localStorage.getItem("routivate_theme");
if (savedTheme === "dark" || savedTheme === "light") {
    htmlEl.setAttribute("data-theme", savedTheme);
    themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
} else {
    htmlEl.setAttribute("data-theme", "light");
    themeToggle.textContent = "🌙";
}

themeToggle.addEventListener("click", () => {
    const current = htmlEl.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    htmlEl.setAttribute("data-theme", next);
    localStorage.setItem("routivate_theme", next);
    themeToggle.textContent = next === "dark" ? "☀️" : "🌙";
    routeFlash(); // show thunder when theme changes
});

/* ===============================
   ROUTE OVERLAY (Thunder flash)
================================= */
const overlay = document.getElementById("route-overlay");
let overlayLock = false; // prevent spamming

function routeFlash(callback) {
    if (overlayLock) return;
    overlayLock = true;
    overlay.classList.add("active");
    // Overlay animation is ~700ms; let it sit a touch longer:
    setTimeout(() => {
        overlay.classList.remove("active");
        overlayLock = false;
        if (typeof callback === "function") callback();
    }, 820);
}

/* ===============================
   SCROLL-SPY + TITLE SYNC
================================= */
const links = document.querySelectorAll(".nav-link");
const sections = [...document.querySelectorAll("section.section")];

// Map id -> link
const linkMap = {};
links.forEach(l => linkMap[l.getAttribute("href").slice(1)] = l);

// IntersectionObserver to detect active section (center focus)
let currentActiveId = "home";
const io = new IntersectionObserver((entries) => {
    // Find the entry most in view
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id !== currentActiveId) {
                currentActiveId = id;

                // highlight nav
                links.forEach(a => a.classList.remove("active"));
                const active = linkMap[id];
                if (active) active.classList.add("active");

                // change <title>
                const niceTitle = entry.target.dataset.title || id;
                document.title = `Routivate - ${niceTitle}`;
            }
        }
    });
}, { root: null, rootMargin: "-45% 0px -45% 0px", threshold: 0.01 });

sections.forEach(sec => io.observe(sec));

/* ===============================
   NAV CLICK -> Smooth scroll + flash
================================= */
links.forEach(link => {
    link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href.endsWith('.html')) {
            // Allow normal navigation for external pages
            window.location.href = href; // Allow navigation to HTML pages
            return;
        }
        e.preventDefault();
        const targetId = href.slice(1);
        const el = document.getElementById(targetId);
        if (!el) return;

        // Show flash, then scroll after the flash peaks
        routeFlash(() => {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
});

/* ===============================
   PRICING TOGGLE FUNCTIONALITY
================================= */
// Hero section animations
function initHeroAnimations() {
    const animatedElements = document.querySelectorAll('.animate-text');
    
    animatedElements.forEach((element, index) => {
        const delay = parseFloat(element.getAttribute('data-delay') || 0) * 1000;
        setTimeout(() => {
            element.classList.add('visible');
        }, delay);
    });
}

// Statistics counter animation
function initStatisticsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const steps = 60; // 60 frames
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.round(current);
        }, duration / steps);
    });
}

// Testimonials carousel functionality
function initTestimonialsCarousel() {
    const testimonials = document.querySelectorAll('.testimonial');
    const nextButton = document.querySelector('.carousel-next');
    const prevButton = document.querySelector('.carousel-prev');
    
    let currentIndex = 0;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = (i === index) ? 'block' : 'none';
        });
    }

    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }
    
    function prevTestimonial() {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentIndex);
    }

    nextButton.addEventListener('click', nextTestimonial);
    prevButton.addEventListener('click', prevTestimonial);

    // Autoplay functionality
    setInterval(nextTestimonial, 5000); // Change testimonial every 5 seconds

    showTestimonial(currentIndex); // Show the first testimonial
}

// Scroll animation observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate progress bars when service cards become visible
                if (entry.target.id === 'services') {
                    setTimeout(() => {
                        animateServiceProgressBars();
                    }, 500);
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// Animate service progress bars
function animateServiceProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.setProperty('--progress-width', `${progress}%`);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Initialize hero animations
    initHeroAnimations();
    initStatisticsCounter();
    initScrollAnimations();
    initTestimonialsCarousel();
    
    // Pricing toggle functionality
    const pricingToggle = document.getElementById("pricing-toggle");
    if (pricingToggle) {
        pricingToggle.addEventListener("change", function() {
            const isAnnual = this.checked;
            updatePrices(isAnnual);
            updateToggleText(isAnnual);
        });

        // Initialize pricing
        updatePrices(pricingToggle.checked);
        updateToggleText(pricingToggle.checked);
    }

    function updatePrices(isAnnual) {
        const priceElements = document.querySelectorAll('.amount');
        priceElements.forEach(element => {
            const monthlyPrice = element.getAttribute('data-monthly');
            const annualPrice = element.getAttribute('data-annual');
            const periodElement = element.nextElementSibling;
            
            if (isAnnual) {
                element.textContent = annualPrice;
                periodElement.textContent = '/month (annual billing)';
            } else {
                element.textContent = monthlyPrice;
                periodElement.textContent = '/month';
            }
        });
    }

    function updateToggleText(isAnnual) {
        const monthlyText = document.querySelector('.pricing-toggle span:first-child');
        const annualText = document.querySelector('.pricing-toggle span:last-child');
        
        if (isAnnual) {
            monthlyText.style.opacity = '0.6';
            annualText.style.opacity = '1';
            annualText.style.fontWeight = '700';
            monthlyText.style.fontWeight = '500';
        } else {
            monthlyText.style.opacity = '1';
            annualText.style.opacity = '0.6';
            monthlyText.style.fontWeight = '700';
            annualText.style.fontWeight = '500';
        }
    }

    console.log("DOM fully loaded and parsed");
    
    // Enhanced contact form handling
    const form = document.getElementById("contactForm");
    if (form) {
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            // Validate all fields
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField({ target: input })) {
                    isValid = false;
                }
            });

            if (!isValid) {
                showMessage('Please fix the errors above.', 'error');
                return;
            }

            // Show loading state
            setLoadingState(true);
            
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const mobile = document.getElementById("mobile").value.trim();
            const message = document.getElementById("message").value.trim();

            try {
                // Simulate API call with timeout
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                const entry = { 
                    name, 
                    email, 
                    mobile, 
                    message, 
                    at: new Date().toISOString() 
                };
                
                const prev = JSON.parse(localStorage.getItem("routivate_contacts") || "[]");
                prev.push(entry);
                localStorage.setItem("routivate_contacts", JSON.stringify(prev));

                showMessage('✅ Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.', 'success');
                form.reset();
                
                // Clear message after 5 seconds
                setTimeout(() => {
                    const msg = document.getElementById("formMessage");
                    if (msg) msg.textContent = '';
                }, 5000);
                
            } catch (error) {
                showMessage('❌ Sorry, there was an error sending your message. Please try again.', 'error');
                console.error('Form submission error:', error);
            } finally {
                setLoadingState(false);
            }
        });
    } else {
        console.error("Form not found! Check the ID in the HTML.");
    }

    // Validation functions
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        clearFieldError({ target: field });

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value && !isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }

        // Mobile validation
        if (field.id === 'mobile' && value && !isValidMobile(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }

        if (!isValid) {
            showFieldError(field, errorMessage);
        }

        return isValid;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidMobile(mobile) {
        // Basic mobile validation - allows various formats
        const mobileRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return mobileRegex.test(mobile.replace(/[\s\-\(\)]/g, ''));
    }

    function showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        // Remove existing error
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) existingError.remove();

        // Add error class to field
        field.classList.add('error');

        // Create error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.cssText = `
            color: var(--error);
            font-size: 0.9rem;
            margin-top: 0.5rem;
            font-weight: 500;
        `;
        errorElement.textContent = message;
        
        formGroup.appendChild(errorElement);
    }

    function clearFieldError(e) {
        const field = e.target;
        field.classList.remove('error');
        
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        const errorElement = formGroup.querySelector('.field-error');
        if (errorElement) errorElement.remove();
    }

    function showMessage(message, type) {
        const msgElement = document.getElementById("formMessage");
        if (msgElement) {
            msgElement.textContent = message;
            msgElement.className = `form-message ${type}`;
            
            // Auto-hide success messages
            if (type === 'success') {
                setTimeout(() => {
                    msgElement.textContent = '';
                    msgElement.className = 'form-message';
                }, 5000);
            }
        }
    }

    function setLoadingState(loading) {
        const button = document.querySelector('#contactForm button[type="submit"]');
        const btnText = button.querySelector('.btn-text');
        const btnLoading = button.querySelector('.btn-loading');
        
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }
});

// Handle floating labels
function initFloatingLabels() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');
        
        if (input && label) {
            // Check if input has value on page load
            if (input.value.trim() !== '') {
                label.classList.add('active');
            }
            
            // Handle focus and blur events
            input.addEventListener('focus', () => {
                label.classList.add('active');
            });
            
            input.addEventListener('blur', () => {
                if (input.value.trim() === '') {
                    label.classList.remove('active');
                }
            });
            
            // Handle input events
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            });
        }
    });
}

// Initialize floating labels when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initFloatingLabels();
    // ... rest of your existing DOMContentLoaded code
});

