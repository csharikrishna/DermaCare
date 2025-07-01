// appointment.js

// This script handles the appointment form submission, validation, and UI interactions

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('appointmentForm');
    const dateInput = document.getElementById('preferredDate');
    const phoneInput = document.getElementById('phone');

    // Set minimum date to today to prevent past date selection
    const today = new Date().toISOString().split('T')[0];
    if (dateInput) {
        dateInput.setAttribute('min', today);
    }

    // Format phone number as (XXX) XXX-XXXX
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';

            if (value.length > 0) {
                if (value.length <= 3) {
                    formattedValue = `(${value}`;
                } else if (value.length <= 6) {
                    formattedValue = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    formattedValue = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }

            e.target.value = formattedValue;
        });
    }

    // Handle form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const appointmentData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                dateOfBirth: formData.get('dateOfBirth'),
                gender: formData.get('gender'),
                appointmentType: formData.get('appointmentType'),
                preferredDoctor: formData.get('preferredDoctor'),
                preferredDate: formData.get('preferredDate'),
                preferredTime: formData.get('preferredTime'),
                visitType: formData.get('visitType'),
                urgency: formData.get('urgency'),
                insurance: formData.get('insurance'),
                memberId: formData.get('memberId'),
                reasonForVisit: formData.get('reasonForVisit'),
                additionalNotes: formData.get('additionalNotes')
            };

            // Basic validation
            if (!appointmentData.firstName || !appointmentData.lastName || !appointmentData.email || !appointmentData.phone) {
                alert('Please fill in all required fields.');
                return;
            }

            if (!appointmentData.appointmentType) {
                alert('Please select an appointment type.');
                return;
            }

            if (!appointmentData.preferredDate) {
                alert('Please select a preferred date.');
                return;
            }

            if (!appointmentData.reasonForVisit) {
                alert('Please provide a reason for your visit.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(appointmentData.email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Phone validation (must have 10 digits)
            const phoneDigits = appointmentData.phone.replace(/\D/g, '');
            if (phoneDigits.length !== 10) {
                alert('Please enter a valid 10-digit phone number.');
                return;
            }

            // Date validation (cannot be in the past)
            const selectedDate = new Date(appointmentData.preferredDate);
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            
            if (selectedDate < todayDate) {
                alert('Please select a future date for your appointment.');
                return;
            }

            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Booking Appointment...';
            submitButton.disabled = true;

            // Simulate API call (replace with actual appointment booking logic)
            setTimeout(() => {
                // Success message
                showSuccessMessage(appointmentData);

                // Reset form
                form.reset();

                // Reset minimum date again after reset
                if (dateInput) {
                    dateInput.setAttribute('min', today);
                }

                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;

                // Scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

            }, 2000); // Simulate 2 second processing time
        });
    }

    // Handle appointment type selection
    const appointmentTypeRadios = document.querySelectorAll('input[name="appointmentType"]');
    appointmentTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const selectedType = this.value;
            updateDoctorOptions(selectedType);
        });
    });

    // Handle urgency selection for styling
    const urgencyRadios = document.querySelectorAll('input[name="urgency"]');
    urgencyRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const selectedUrgency = this.value;
            updateUrgencyDisplay(selectedUrgency);
        });
    });
});

// Function to show success message
function showSuccessMessage(appointmentData) {
    const message = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            text-align: center;
            max-width: 500px;
            width: 90%;
        ">
            <div style="
                width: 60px;
                height: 60px;
                background: #27ae60;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1rem;
                color: white;
                font-size: 1.5rem;
            ">
                ✓
            </div>
            <h3 style="color: #2c3e50; margin-bottom: 1rem;">Appointment Request Submitted!</h3>
            <p style="color: #5d6d7e; margin-bottom: 1.5rem;">
                Thank you, ${appointmentData.firstName}! We have received your appointment request for ${appointmentData.appointmentType} on ${formatDate(appointmentData.preferredDate)}.
            </p>
            <p style="color: #5d6d7e; margin-bottom: 2rem;">
                We will contact you within 24 hours to confirm your appointment.
            </p>
            <button onclick="closeSuccessMessage()" style="
                background: #2c5aa0;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
            ">
                Close
            </button>
        </div>
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
        " onclick="closeSuccessMessage()"></div>
    `;

    const messageDiv = document.createElement('div');
    messageDiv.id = 'success-message';
    messageDiv.innerHTML = message;
    document.body.appendChild(messageDiv);
}

// Function to close success message
function closeSuccessMessage() {
    const messageDiv = document.getElementById('success-message');
    if (messageDiv) {
        messageDiv.remove();
    }
}

// Function to update doctor options based on appointment type
function updateDoctorOptions(appointmentType) {
    const doctorSelect = document.getElementById('preferredDoctor');
    if (!doctorSelect) return;

    // Clear current options except "No Preference"
    doctorSelect.innerHTML = '<option value="">No Preference</option>';

    const doctorOptions = {
        'consultation': [
            { value: 'dr-smith', text: 'Dr. Sarah Smith (Medical Dermatology)' },
            { value: 'dr-davis', text: 'Dr. Emily Davis (Pediatric Dermatology)' }
        ],
        'followup': [
            { value: 'dr-smith', text: 'Dr. Sarah Smith (Medical Dermatology)' },
            { value: 'dr-johnson', text: 'Dr. Michael Johnson (Cosmetic Dermatology)' },
            { value: 'dr-davis', text: 'Dr. Emily Davis (Pediatric Dermatology)' }
        ],
        'cosmetic': [
            { value: 'dr-johnson', text: 'Dr. Michael Johnson (Cosmetic Dermatology)' }
        ],
        'screening': [
            { value: 'dr-smith', text: 'Dr. Sarah Smith (Medical Dermatology)' }
        ]
    };

    const options = doctorOptions[appointmentType] || doctorOptions['consultation'];
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        doctorSelect.appendChild(optionElement);
    });
}

// Function to update urgency display
function updateUrgencyDisplay(urgency) {
    const urgencyLabels = document.querySelectorAll('.urgency-label');
    urgencyLabels.forEach(label => {
        label.style.fontWeight = 'normal';
    });

    const selectedLabel = document.querySelector(`input[value="${urgency}"] + .urgency-label`);
    if (selectedLabel) {
        selectedLabel.style.fontWeight = 'bold';
    }

    // Show different messages based on urgency
    let urgencyMessage = '';
    switch(urgency) {
        case 'urgent':
            urgencyMessage = 'We will prioritize your appointment request.';
            break;
        case 'asap':
            urgencyMessage = 'We will contact you within 4 hours during business hours.';
            break;
        default:
            urgencyMessage = 'We will contact you within 24 hours.';
    }

    // Update or create urgency message display
    let messageElement = document.getElementById('urgency-message');
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'urgency-message';
        messageElement.style.cssText = `
            margin-top: 0.5rem;
            padding: 0.5rem;
            background: #e3f2fd;
            border-radius: 5px;
            font-size: 0.9rem;
            color: #2c5aa0;
            text-align: center;
        `;
        document.querySelector('.urgency-options').parentNode.appendChild(messageElement);
    }
    messageElement.textContent = urgencyMessage;
}

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Additional utility functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneDigits = phone.replace(/\D/g, '');
    return phoneDigits.length === 10;
}

// Export functions for testing (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        validatePhone,
        formatDate
    };
}
