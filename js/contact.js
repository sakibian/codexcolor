// Contact Form Validation and Submission Handler
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.querySelector('#submitBtn span');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');

  // Form validation state
  let formSubmitting = false;

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Service-specific questions and lead quality scoring
  const serviceQuestions = {
    mobile: {
      question: "What's your current mobile website load time and any mobile-specific issues you're facing?",
      placeholder: "e.g. Our site takes 8-10 seconds to load on mobile, poor user experience on phones..."
    },
    analytics: {
      question: "Do you currently use Google Analytics or any other analytics tools? Any specific analytics challenges?",
      placeholder: "e.g. We have GA4 but don't understand the data, or currently have no analytics setup..."
    },
    conversion: {
      question: "What's your biggest conversion tracking challenge or goal?",
      placeholder: "e.g. Facebook pixels not firing, Google Ads data incorrect, or not tracking form conversions..."
    },
    performance: {
      question: "What Core Web Vitals scores (LCP, FID, CLS) are you currently getting, and what's your goal?",
      placeholder: "e.g. LCP 4.5s, CLS 0.25, FID 350ms - want to get Good scores..."
    }
  };

  // Real-time validation for email
  const emailInput = document.getElementById('email');
  emailInput.addEventListener('blur', validateEmail);
  emailInput.addEventListener('input', clearEmailError);

  // Dynamic required fields based on service selection
  let requiredFields = ['firstName', 'lastName', 'email', 'message'];
  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    field.addEventListener('blur', () => validateRequiredField(fieldId));
    field.addEventListener('input', () => clearFieldError(fieldId));
  });

  // Service selection handler for dynamic questions
  const serviceSelect = document.getElementById('service');
  if (serviceSelect) {
    serviceSelect.addEventListener('change', handleServiceChange);
    // Initialize for any pre-selected service (URL parameters)
    handleServiceChange();
  }

  // Form submission
  contactForm.addEventListener('submit', handleFormSubmission);

  // Lead quality scoring function
  function calculateLeadQuality(formData) {
    let score = 50; // Base score

    // Service interest adds points
    if (formData.service && formData.service !== '') score += 15;

    // Budget information adds points
    if (formData.budget && formData.budget !== '' && formData.budget !== 'over-25k') score += 10;

    // Company information adds points
    if (formData.company && formData.company.trim() !== '') score += 5;

    // Phone number adds points
    if (formData.phone && formData.phone.trim() !== '') score += 5;

    // Message length affects score
    const messageLength = formData.message ? formData.message.length : 0;
    if (messageLength > 100) score += 10;
    else if (messageLength > 50) score += 5;

    // Service-specific responses add quality points
    if (formData.service_challenges && formData.service_challenges.trim() !== '') score += 20;

    return Math.min(score, 100); // Cap at 100
  }

  // Handle service selection change
  function handleServiceChange() {
    const selectedService = serviceSelect.value;
    const form = document.querySelector('.service-specific-question-group');

    // Remove any existing service-specific question
    if (form) {
      form.remove();
    }

    // Add new service-specific question if service is selected
    if (selectedService && serviceQuestions[selectedService]) {
      const serviceQuestion = serviceQuestions[selectedService];

      // Create the service-specific question group
      const questionGroup = document.createElement('div');
      questionGroup.className = 'service-specific-question-group';

      questionGroup.innerHTML = `
        <div>
          <label for="service_challenges" class="block text-sm font-medium text-gray-700 mb-2">
            Service-Specific Details *
          </label>
          <textarea
            id="service_challenges"
            name="service_challenges"
            rows="3"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fulvous-500 focus:border-fulvous-500 transition-colors"
            placeholder="${serviceQuestion.placeholder}"
          ></textarea>
          <p class="text-sm text-gray-600 mt-1">${serviceQuestion.question}</p>
        </div>
      `;

      // Insert before the message field
      const messageField = document.querySelector('#message').closest('div');
      messageField.parentNode.insertBefore(questionGroup, messageField);

      // Track service selection
      window.gtag('event', 'service_selected', {
        'event_category': 'Form',
        'event_label': selectedService,
        'value': 1
      });
    }
  }

  function validateEmail() {
    const email = emailInput.value.trim();
    const errorDiv = document.querySelector('#email + .error-message');

    if (!email) {
      showFieldError('email', 'Email address is required');
      return false;
    } else if (!emailRegex.test(email)) {
      showFieldError('email', 'Please enter a valid email address');
      return false;
    } else {
      clearFieldError('email');
      return true;
    }
  }

  function clearEmailError() {
    if (emailRegex.test(emailInput.value.trim()) || emailInput.value.trim() === '') {
      clearFieldError('email');
    }
  }

  function validateRequiredField(fieldId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();

    if (!value) {
      const label = field.previousElementSibling.textContent.replace(' *', '');
      showFieldError(fieldId, `${label} is required`);
      return false;
    } else {
      clearFieldError(fieldId);
      return true;
    }
  }

  function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = field.parentElement.querySelector('.error-message');

    if (errorDiv) {
      errorDiv.classList.add('hidden');
    }

    field.classList.remove('border-red-500');
    field.classList.add('border-gray-300', 'focus:border-fulvous-500');
  }

  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = field.parentElement.querySelector('.error-message');

    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.classList.remove('hidden');
    }

    field.classList.remove('border-gray-300', 'focus:border-fulvous-500');
    field.classList.add('border-red-500');
  }

  function hideMessages() {
    successMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');
    // Clear service-specific message
    const serviceMessage = document.querySelector('.service-specific-message');
    const defaultMessage = document.querySelector('.default-message');
    if (serviceMessage) serviceMessage.textContent = '';
    if (defaultMessage) defaultMessage.style.display = 'block';
  }

  function showSuccess() {
    hideMessages();
    successMessage.classList.remove('hidden');
    setTimeout(() => {
      successMessage.classList.add('hidden');
    }, 5000);
  }

  // Service-specific success messages
  function showServiceSpecificSuccess(service, leadScore) {
    hideMessages();

    const serviceMessages = {
      mobile: `Mobile audit scheduled! Our experts will analyze your site's performance and provide a custom optimization plan within 24 hours.`,
      analytics: `GA4 assessment underway! We'll review your current setup and recommend a complete analytics implementation strategy.`,
      conversion: `Conversion audit started! Our team will identify tracking gaps and create a comprehensive tracking strategy.`,
      performance: `Performance audit initiated! We'll deliver a detailed Core Web Vitals optimization roadmap within 48 hours.`
    };

    const serviceMessage = service && serviceMessages[service] ? serviceMessages[service] : null;

    if (serviceMessage) {
      const serviceMsgEl = document.querySelector('.service-specific-message');
      const defaultMsgEl = document.querySelector('.default-message');
      if (serviceMsgEl) serviceMsgEl.textContent = serviceMessage;
      if (defaultMsgEl) defaultMsgEl.style.display = 'none';

      // Track lead quality
      window.gtag('event', 'lead_score_achieved', {
        'event_category': 'Lead Generation',
        'event_label': `Score: ${leadScore}`,
        'value': leadScore
      });
    }

    successMessage.classList.remove('hidden');
    setTimeout(() => {
      successMessage.classList.add('hidden');
    }, 7000); // Show longer for service-specific messages
  }

  function showError() {
    hideMessages();
    errorMessage.classList.remove('hidden');
    setTimeout(() => {
      errorMessage.classList.add('hidden');
    }, 5000);
  }

  function setSubmitting(isSubmitting) {
    formSubmitting = isSubmitting;

    if (isSubmitting) {
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
      submitBtnText.textContent = 'Sending...';
      loadingSpinner.classList.remove('hidden');
    } else {
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      submitBtnText.textContent = 'Send Message';
      loadingSpinner.classList.add('hidden');
    }
  }

  function validateForm() {
    let isValid = true;

    // Reset all errors first
    const allErrorMessages = document.querySelectorAll('.error-message');
    allErrorMessages.forEach(errorDiv => {
      errorDiv.classList.add('hidden');
    });

    const allFields = document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select');
    allFields.forEach(field => {
      field.classList.remove('border-red-500');
      field.classList.add('border-gray-300', 'focus:border-fulvous-500');
    });

    // Validate required fields
    requiredFields.forEach(fieldId => {
      if (!validateRequiredField(fieldId)) {
        isValid = false;
      }
    });

    // Validate email specifically
    if (!validateEmail()) {
      isValid = false;
    }

    // Validate privacy policy checkbox
    const privacyCheckbox = document.getElementById('privacy');
    if (!privacyCheckbox.checked) {
      isValid = false;
      alert('Please agree to the Privacy Policy before submitting.');
    }

    return isValid;
  }

  async function handleFormSubmission(e) {
    e.preventDefault();

    if (formSubmitting) {
      return; // Prevent double submission
    }

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      hideMessages();

      // Collect form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      // Analytics tracking
      window.gtag('event', 'form_submit', {
        'event_category': 'Contact',
        'event_label': 'contact_form',
        'value': 1
      });

      console.log('Form data:', data);

      // Simulate API call (replace with actual endpoint)
      const response = await simulateFormSubmission(data);

      if (response.success) {
        // Calculate lead quality and show service-specific success
        const leadQualityScore = calculateLeadQuality(data);

        window.gtag('event', 'form_success', {
          'event_category': 'Contact',
          'event_label': 'contact_form_success',
          'value': leadQualityScore
        });

        contactForm.reset();

        // Show service-specific success message
        if (data.service && data.service !== '') {
          showServiceSpecificSuccess(data.service, leadQualityScore);
        } else {
          showSuccess();
        }
      } else {
        throw new Error('Form submission failed');
      }

    } catch (error) {
      console.error('Form submission error:', error);

      // Analytics tracking for failed submission
      window.gtag('event', 'form_error', {
        'event_category': 'Contact',
        'event_label': 'contact_form_error',
        'value': 1
      });

      showError();
    } finally {
      setSubmitting(false);
    }
  }

  // Simulate form submission (replace with actual API endpoint)
  async function simulateFormSubmission(data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate random success/failure (for demo purposes)
    const success = Math.random() > 0.1; // 90% success rate

    if (success) {
      // In a real implementation, you would send the data to your server
      console.log('Form would be submitted to server:', data);
      return { success: true, message: 'Message sent successfully' };
    } else {
      throw new Error('Server error');
    }
  }

  // Clear form state on page load
  hideMessages();
  setSubmitting(false);

  // Track form engagement analytics
  const formFields = document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select');
  formFields.forEach(field => {
    field.addEventListener('focus', function() {
      window.gtag('event', 'form_field_focus', {
        'event_category': 'Contact',
        'event_label': this.name,
        'value': 1
      });
    });

    field.addEventListener('change', function() {
      if (this.type !== 'text' && this.tagName !== 'TEXTAREA') {
        window.gtag('event', 'form_field_change', {
          'event_category': 'Contact',
          'event_label': this.name,
          'value': 1
        });
      }
    });
  });
});
