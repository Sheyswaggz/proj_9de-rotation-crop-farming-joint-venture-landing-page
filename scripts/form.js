/**
 * Contact Form Validation and Submission Handler
 * Implements real-time validation, loading states, and user feedback
 */

(function() {
  'use strict';

  // Form state
  let isSubmitting = false;

  // Form elements
  let form = null;
  let nameInput = null;
  let emailInput = null;
  let phoneInput = null;
  let messageInput = null;
  let submitButton = null;
  let buttonText = null;
  let buttonLoader = null;

  // Validation patterns
  const VALIDATION = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  };

  /**
   * Initialize form handling
   */
  function initForm() {
    try {
      // Get form elements
      form = document.getElementById('contact-form');
      nameInput = document.getElementById('name');
      emailInput = document.getElementById('email');
      phoneInput = document.getElementById('phone');
      messageInput = document.getElementById('message');
      submitButton = form ? form.querySelector('.submit-button') : null;
      buttonText = submitButton ? submitButton.querySelector('.button-text') : null;
      buttonLoader = submitButton ? submitButton.querySelector('.button-loader') : null;

      if (!form) {
        console.log('Contact form not found on this page');
        return;
      }

      // Attach event listeners
      form.addEventListener('submit', handleSubmit);

      // Real-time validation on blur
      if (nameInput) {
        nameInput.addEventListener('blur', () => validateField(nameInput, validateName));
      }

      if (emailInput) {
        emailInput.addEventListener('blur', () => validateField(emailInput, validateEmail));
      }

      if (phoneInput) {
        phoneInput.addEventListener('blur', () => validateField(phoneInput, validatePhone));
      }

      if (messageInput) {
        messageInput.addEventListener('blur', () => validateField(messageInput, validateMessage));
      }

      console.log('Contact form initialized');
    } catch (error) {
      console.error('Error initializing form:', error);
    }
  }

  /**
   * Validate name field
   * @param {string} value
   * @returns {Object} Validation result
   */
  function validateName(value) {
    if (!value || value.trim().length === 0) {
      return { valid: false, message: 'Name is required' };
    }

    if (value.trim().length < 2) {
      return { valid: false, message: 'Name must be at least 2 characters' };
    }

    return { valid: true, message: '' };
  }

  /**
   * Validate email field
   * @param {string} value
   * @returns {Object} Validation result
   */
  function validateEmail(value) {
    if (!value || value.trim().length === 0) {
      return { valid: false, message: 'Email is required' };
    }

    if (!VALIDATION.email.test(value.trim())) {
      return { valid: false, message: 'Please enter a valid email address' };
    }

    return { valid: true, message: '' };
  }

  /**
   * Validate phone field (optional)
   * @param {string} value
   * @returns {Object} Validation result
   */
  function validatePhone(value) {
    // Phone is optional
    if (!value || value.trim().length === 0) {
      return { valid: true, message: '' };
    }

    if (!VALIDATION.phone.test(value.trim())) {
      return { valid: false, message: 'Please enter a valid phone number' };
    }

    return { valid: true, message: '' };
  }

  /**
   * Validate message field
   * @param {string} value
   * @returns {Object} Validation result
   */
  function validateMessage(value) {
    if (!value || value.trim().length === 0) {
      return { valid: false, message: 'Message is required' };
    }

    if (value.trim().length < 10) {
      return { valid: false, message: 'Message must be at least 10 characters' };
    }

    return { valid: true, message: '' };
  }

  /**
   * Validate single field and show/hide error
   * @param {Element} input
   * @param {Function} validator
   * @returns {boolean}
   */
  function validateField(input, validator) {
    try {
      const value = input.value;
      const result = validator(value);
      const errorElement = document.getElementById(`${input.id}-error`);

      if (result.valid) {
        input.classList.remove('error');
        input.classList.add('success');
        if (errorElement) {
          errorElement.textContent = '';
          errorElement.style.display = 'none';
        }
        return true;
      } else {
        input.classList.remove('success');
        input.classList.add('error');
        if (errorElement) {
          errorElement.textContent = result.message;
          errorElement.style.display = 'block';
        }
        return false;
      }
    } catch (error) {
      console.error('Error validating field:', error);
      return false;
    }
  }

  /**
   * Validate all form fields
   * @returns {boolean}
   */
  function validateAllFields() {
    let isValid = true;

    if (nameInput) {
      isValid = validateField(nameInput, validateName) && isValid;
    }

    if (emailInput) {
      isValid = validateField(emailInput, validateEmail) && isValid;
    }

    if (phoneInput && phoneInput.value.trim().length > 0) {
      isValid = validateField(phoneInput, validatePhone) && isValid;
    }

    if (messageInput) {
      isValid = validateField(messageInput, validateMessage) && isValid;
    }

    return isValid;
  }

  /**
   * Set loading state
   * @param {boolean} loading
   */
  function setLoadingState(loading) {
    try {
      isSubmitting = loading;

      if (submitButton) {
        submitButton.disabled = loading;
        submitButton.setAttribute('aria-busy', loading ? 'true' : 'false');
      }

      if (buttonText) {
        buttonText.textContent = loading ? 'Submitting...' : 'Submit Inquiry';
      }

      if (buttonLoader) {
        buttonLoader.style.display = loading ? 'inline-block' : 'none';
      }

      // Disable/enable form inputs
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.disabled = loading;
      });
    } catch (error) {
      console.error('Error setting loading state:', error);
    }
  }

  /**
   * Show success state
   */
  function showSuccessState() {
    try {
      // Update button to show success
      if (buttonText) {
        buttonText.innerHTML = '✓ Submitted Successfully!';
      }

      if (submitButton) {
        submitButton.classList.add('success');
      }

      // Reset form after delay
      setTimeout(() => {
        resetForm();
      }, 2000);
    } catch (error) {
      console.error('Error showing success state:', error);
    }
  }

  /**
   * Show error state
   * @param {string} message
   */
  function showErrorState(message) {
    try {
      if (buttonText) {
        buttonText.textContent = 'Submission Failed';
      }

      if (submitButton) {
        submitButton.classList.add('error');
      }

      // Show error message
      alert(`Error: ${message || 'Failed to submit form. Please try again.'}`);

      // Reset button state after delay
      setTimeout(() => {
        setLoadingState(false);

        if (submitButton) {
          submitButton.classList.remove('error');
        }

        if (buttonText) {
          buttonText.textContent = 'Submit Inquiry';
        }
      }, 2000);
    } catch (error) {
      console.error('Error showing error state:', error);
    }
  }

  /**
   * Reset form to initial state
   */
  function resetForm() {
    try {
      if (form) {
        form.reset();
      }

      // Clear validation states
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.classList.remove('error', 'success');
        input.disabled = false;
      });

      // Clear error messages
      const errorElements = form.querySelectorAll('.error-message');
      errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
      });

      // Reset button state
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.classList.remove('success', 'error');
        submitButton.setAttribute('aria-busy', 'false');
      }

      if (buttonText) {
        buttonText.textContent = 'Submit Inquiry';
      }

      if (buttonLoader) {
        buttonLoader.style.display = 'none';
      }

      isSubmitting = false;
    } catch (error) {
      console.error('Error resetting form:', error);
    }
  }

  /**
   * Submit form data (simulated API call)
   * @param {FormData} formData
   * @returns {Promise}
   */
  async function submitFormData(formData) {
    // Simulated API call using setTimeout
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 95% success rate
        if (Math.random() < 0.95) {
          console.log('Form submitted successfully:', Object.fromEntries(formData));
          resolve({ success: true, message: 'Form submitted successfully' });
        } else {
          reject(new Error('Network error: Unable to submit form'));
        }
      }, 2000);
    });

    // Future backend integration structure:
    /*
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData))
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
    */
  }

  /**
   * Handle form submission
   * @param {Event} event
   */
  async function handleSubmit(event) {
    event.preventDefault();

    // Prevent double submission
    if (isSubmitting) {
      console.log('Form is already being submitted');
      return;
    }

    try {
      // Validate all fields
      const isValid = validateAllFields();

      if (!isValid) {
        console.log('Form validation failed');
        return;
      }

      // Set loading state
      setLoadingState(true);

      // Collect form data
      const formData = new FormData(form);

      // Submit form
      await submitFormData(formData);

      // Show success state
      showSuccessState();
    } catch (error) {
      console.error('Form submission error:', error);
      showErrorState(error.message);
    }
  }

  /**
   * Initialize when DOM is ready
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initForm);
    } else {
      initForm();
    }
  }

  // Auto-initialize
  init();
})();
