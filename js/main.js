// main.js

// This script handles basic site functionality such as navigation menu toggle and smooth scrolling

document.addEventListener('DOMContentLoaded', function() {
    // Navigation menu toggle for mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('nav-menu-active');
            hamburger.classList.toggle('is-active');
        });
    }

    // Smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('nav-menu-active')) {
                navMenu.classList.remove('nav-menu-active');
                hamburger.classList.remove('is-active');
            }
        });
    });

    // Add sticky header functionality
    const header = document.getElementById('header');
    const stickyOffset = header ? header.offsetTop : 0;

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > stickyOffset) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Highlight active nav link on scroll
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function() {
        let scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector('.nav-menu a[href*=' + sectionId + ']');

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    });

    // Fade in animations for elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Handle chatbot widget functionality
    const chatbotTrigger = document.getElementById('chatbot-trigger');
    if (chatbotTrigger) {
        chatbotTrigger.addEventListener('click', function() {
            // This will be handled by the Watson Assistant script
            console.log('Chatbot trigger clicked');
        });
    }

    // Form enhancements for better UX
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        // Add focus/blur effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value) {
                this.parentElement.classList.add('has-value');
            } else {
                this.parentElement.classList.remove('has-value');
            }
        });

        // Initialize has-value class for pre-filled inputs
        if (input.value) {
            input.parentElement.classList.add('has-value');
        }
    });

    // Back to top functionality
    const backToTopBtn = createBackToTopButton();
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    // Loading state management
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(element => {
        // Simulate loading completion
        setTimeout(() => {
            element.classList.remove('loading');
            element.classList.add('loaded');
        }, 1000);
    });
});

// Create back to top button
function createBackToTopButton() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    btn.className = 'back-to-top';
    btn.style.cssText = `
        position: fixed;
        bottom: 60px; /* Moved a bit further down */
        left: 40px;   /* Moved a bit more to the right */
        background: var(--primary-color);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(44, 90, 160, 0.3);
        transition: all 0.3s ease;
    `;

    btn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });

    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });

    document.body.appendChild(btn);
    return btn;
}

// Utility function to throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Enhanced scroll performance
const throttledScrollHandler = throttle(function() {
    // Any scroll-related functionality can be added here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Handle external links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.href && e.target.hostname !== window.location.hostname) {
        e.target.setAttribute('target', '_blank');
        e.target.setAttribute('rel', 'noopener noreferrer');
    }
});

// Handle keyboard navigation
document.addEventListener('keydown', function(e) {
    // Close mobile menu with escape key
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        
        if (navMenu && navMenu.classList.contains('nav-menu-active')) {
            navMenu.classList.remove('nav-menu-active');
            hamburger.classList.remove('is-active');
        }
    }
});

// Analytics and performance monitoring
function trackPageView() {
    // Add your analytics tracking code here
    console.log('Page viewed:', window.location.pathname);
}

// Initialize analytics
trackPageView();

// Export functions for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        throttle,
        createBackToTopButton,
        trackPageView
    };
}
