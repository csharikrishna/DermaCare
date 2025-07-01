// utils.js
// Common utility functions for DermaCare Dermatology Website

'use strict';

// ===== EMAIL & PHONE VALIDATION =====

/**
 * Validates email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(email).toLowerCase());
}

/**
 * Formats phone number to (XXX) XXX-XXXX format
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
function formatPhoneNumber(phone) {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
}

/**
 * Validates US phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid 10-digit US phone
 */
function validatePhone(phone) {
    const phoneDigits = phone.replace(/\D/g, '');
    return phoneDigits.length === 10;
}

// ===== PERFORMANCE UTILITIES =====

/**
 * Debounces function calls to improve performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttles function calls to improve performance
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} - Throttled function
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

// ===== DOM UTILITIES =====

/**
 * Checks if an element is in the viewport
 * @param {Element} element - DOM element to check
 * @returns {boolean} - True if element is visible in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Smooth scroll to element
 * @param {string} elementId - ID of target element
 * @param {number} offset - Offset from top (default: 80px for header)
 */
function scrollToElement(elementId, offset = 80) {
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Gets scroll percentage of page
 * @returns {number} - Scroll percentage (0-100)
 */
function getScrollPercentage() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return Math.round((scrollTop / scrollHeight) * 100);
}

// ===== DATE & TIME UTILITIES =====

/**
 * Formats date to readable string
 * @param {string|Date} date - Date to format
 * @param {object} options - Formatting options
 * @returns {string} - Formatted date string
 */
function formatDate(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const formatOptions = { ...defaultOptions, ...options };
    return new Date(date).toLocaleDateString('en-US', formatOptions);
}

/**
 * Gets business days between two dates (excluding weekends)
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {number} - Number of business days
 */
function getBusinessDaysBetween(startDate, endDate) {
    let count = 0;
    const curDate = new Date(startDate);
    
    while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip Sunday (0) and Saturday (6)
            count++;
        }
        curDate.setDate(curDate.getDate() + 1);
    }
    return count;
}

/**
 * Checks if a date is a business day (Mon-Fri)
 * @param {Date} date - Date to check
 * @returns {boolean} - True if business day
 */
function isBusinessDay(date) {
    const day = date.getDay();
    return day >= 1 && day <= 5; // Monday = 1, Friday = 5
}

// ===== STORAGE UTILITIES =====

/**
 * Safe localStorage setter with error handling
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} - True if successfully stored
 */
function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.warn('localStorage not available:', error);
        return false;
    }
}

/**
 * Safe localStorage getter with error handling
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key not found
 * @returns {any} - Retrieved value or default
 */
function getLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn('localStorage not available:', error);
        return defaultValue;
    }
}

/**
 * Removes item from localStorage
 * @param {string} key - Storage key to remove
 */
function removeLocalStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.warn('localStorage not available:', error);
    }
}

// ===== MEDICAL/DERMATOLOGY SPECIFIC UTILITIES =====

/**
 * Validates age for medical forms
 * @param {string} dateOfBirth - Date of birth in YYYY-MM-DD format
 * @returns {number|null} - Age in years or null if invalid
 */
function calculateAge(dateOfBirth) {
    if (!dateOfBirth) return null;
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age >= 0 ? age : null;
}

/**
 * Formats medical record number
 * @param {string} mrn - Medical record number
 * @returns {string} - Formatted MRN
 */
function formatMRN(mrn) {
    const cleaned = mrn.replace(/\D/g, '');
    if (cleaned.length >= 6) {
        return cleaned.substring(0, 3) + '-' + cleaned.substring(3, 6) + 
               (cleaned.length > 6 ? '-' + cleaned.substring(6) : '');
    }
    return cleaned;
}

/**
 * Validates insurance member ID format
 * @param {string} memberId - Insurance member ID
 * @returns {boolean} - True if valid format
 */
function validateInsuranceMemberId(memberId) {
    // Basic validation - at least 6 characters, alphanumeric
    const cleanId = memberId.replace(/\s/g, '');
    return cleanId.length >= 6 && /^[A-Za-z0-9]+$/.test(cleanId);
}

// ===== FORM UTILITIES =====

/**
 * Validates required form fields
 * @param {object} formData - Form data object
 * @param {array} requiredFields - Array of required field names
 * @returns {object} - Validation result with isValid and errors
 */
function validateRequiredFields(formData, requiredFields) {
    const errors = [];
    
    requiredFields.forEach(field => {
        if (!formData[field] || formData[field].toString().trim() === '') {
            errors.push(`${field} is required`);
        }
    });
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Sanitizes text input to prevent XSS
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== API UTILITIES =====

/**
 * Makes a safe API request with error handling
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise} - Promise resolving to response data
 */
async function makeAPIRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    try {
        const response = await fetch(url, { ...defaultOptions, ...options });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// ===== NOTIFICATION UTILITIES =====

/**
 * Shows toast notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info, warning)
 * @param {number} duration - Duration in milliseconds (default: 5000)
 */
function showNotification(message, type = 'info', duration = 5000) {
    // Remove existing notifications
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-message">${sanitizeText(message)}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getToastColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        font-family: var(--font-primary, 'Inter', sans-serif);
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, duration);
    }
}

/**
 * Gets color for toast notification based on type
 * @param {string} type - Notification type
 * @returns {string} - CSS color value
 */
function getToastColor(type) {
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#2c5aa0'
    };
    return colors[type] || colors.info;
}

// ===== MEDICAL DISCLAIMER UTILITIES =====

/**
 * Shows medical disclaimer modal
 * @param {string} content - Disclaimer content
 * @param {Function} onAccept - Callback when user accepts
 */
function showMedicalDisclaimer(content, onAccept) {
    const modal = document.createElement('div');
    modal.className = 'medical-disclaimer-modal';
    modal.innerHTML = `
        <div class="disclaimer-overlay">
            <div class="disclaimer-content">
                <h3><i class="fas fa-exclamation-triangle"></i> Medical Disclaimer</h3>
                <div class="disclaimer-text">${content}</div>
                <div class="disclaimer-buttons">
                    <button class="btn-accept" onclick="acceptDisclaimer()">I Understand</button>
                    <button class="btn-cancel" onclick="cancelDisclaimer()">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(modal);
    
    // Add global functions for buttons
    window.acceptDisclaimer = function() {
        modal.remove();
        if (onAccept) onAccept();
        delete window.acceptDisclaimer;
        delete window.cancelDisclaimer;
    };
    
    window.cancelDisclaimer = function() {
        modal.remove();
        delete window.acceptDisclaimer;
        delete window.cancelDisclaimer;
    };
}

// ===== ACCESSIBILITY UTILITIES =====

/**
 * Manages focus for accessibility
 * @param {Element} element - Element to focus
 */
function manageFocus(element) {
    if (element && typeof element.focus === 'function') {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/**
 * Announces content to screen readers
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ===== EXPORT FOR MODULE SYSTEMS =====

// Export functions if using ES6 modules or CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        formatPhoneNumber,
        validatePhone,
        debounce,
        throttle,
        isInViewport,
        scrollToElement,
        getScrollPercentage,
        formatDate,
        getBusinessDaysBetween,
        isBusinessDay,
        setLocalStorage,
        getLocalStorage,
        removeLocalStorage,
        calculateAge,
        formatMRN,
        validateInsuranceMemberId,
        validateRequiredFields,
        sanitizeText,
        makeAPIRequest,
        showNotification,
        showMedicalDisclaimer,
        manageFocus,
        announceToScreenReader
    };
}

// ===== GLOBAL UTILITIES =====

// Add CSS for animations if not already present
if (!document.querySelector('#utils-css')) {
    const style = document.createElement('style');
    style.id = 'utils-css';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
        
        .toast-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        }
        
        .toast-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
        
        .medical-disclaimer-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
        }
        
        .disclaimer-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }
        
        .disclaimer-content {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 500px;
            text-align: center;
        }
        
        .disclaimer-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 1.5rem;
        }
        
        .btn-accept, .btn-cancel {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        }
        
        .btn-accept {
            background: #2c5aa0;
            color: white;
        }
        
        .btn-cancel {
            background: #e74c3c;
            color: white;
        }
    `;
    document.head.appendChild(style);
}

console.log('DermaCare utils.js loaded successfully');
