/**
 * Utility Functions for Landing Page
 * Provides common validation, DOM manipulation, and animation helpers
 */

/**
 * Email validation using regex pattern
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Phone validation using regex pattern
 * Accepts formats: (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone is valid
 */
function isValidPhone(phone) {
  if (typeof phone !== 'string') return false;
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.trim());
}

/**
 * Safe DOM element selector
 * @param {string} selector - CSS selector
 * @param {Element} [context=document] - Context element to search within
 * @returns {Element|null} Found element or null
 */
function select(selector, context = document) {
  try {
    return context.querySelector(selector);
  } catch (error) {
    console.error(`Selector error: ${selector}`, error);
    return null;
  }
}

/**
 * Safe DOM elements selector (multiple)
 * @param {string} selector - CSS selector
 * @param {Element} [context=document] - Context element to search within
 * @returns {Element[]} Array of found elements
 */
function selectAll(selector, context = document) {
  try {
    return Array.from(context.querySelectorAll(selector));
  } catch (error) {
    console.error(`Selector error: ${selector}`, error);
    return [];
  }
}

/**
 * Debounce function for performance optimization
 * Delays execution until after specified wait time has elapsed since last call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
  let timeoutId;

  return function debounced(...args) {
    const context = this;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Check if user prefers reduced motion
 * Respects prefers-reduced-motion media query for accessibility
 * @returns {boolean} True if reduced motion is preferred
 */
function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (error) {
    console.error('Error checking reduced motion preference:', error);
    return false;
  }
}

/**
 * Get safe animation duration based on user preferences
 * @param {number} defaultDuration - Default duration in milliseconds
 * @returns {number} Duration (0 if reduced motion preferred)
 */
function getAnimationDuration(defaultDuration) {
  return prefersReducedMotion() ? 0 : defaultDuration;
}

/**
 * Add class with optional animation delay
 * @param {Element} element - Target element
 * @param {string} className - Class name to add
 * @param {number} [delay=0] - Delay in milliseconds
 */
function addClassWithDelay(element, className, delay = 0) {
  if (!element || typeof className !== 'string') {
    console.error('Invalid element or className for addClassWithDelay');
    return;
  }

  const actualDelay = getAnimationDuration(delay);

  setTimeout(() => {
    element.classList.add(className);
  }, actualDelay);
}

/**
 * Safe event listener attachment with error handling
 * @param {Element} element - Target element
 * @param {string} event - Event name
 * @param {Function} handler - Event handler function
 * @param {Object} [options={}] - Event listener options
 * @returns {Function|null} Cleanup function or null
 */
function addEventListener(element, event, handler, options = {}) {
  if (!element || typeof event !== 'string' || typeof handler !== 'function') {
    console.error('Invalid parameters for addEventListener');
    return null;
  }

  try {
    element.addEventListener(event, handler, options);

    // Return cleanup function
    return () => {
      element.removeEventListener(event, handler, options);
    };
  } catch (error) {
    console.error(`Error attaching event listener: ${event}`, error);
    return null;
  }
}

/**
 * Log structured error with context
 * @param {string} message - Error message
 * @param {Error} [error] - Error object
 * @param {Object} [context={}] - Additional context
 */
function logError(message, error, context = {}) {
  const errorData = {
    message,
    timestamp: new Date().toISOString(),
    context,
    ...(error && {
      errorMessage: error.message,
      errorStack: error.stack
    })
  };

  console.error('Application Error:', errorData);
}

/**
 * Validate required field
 * @param {string} value - Field value
 * @returns {boolean} True if field has value
 */
function isRequired(value) {
  if (typeof value !== 'string') return false;
  return value.trim().length > 0;
}

/**
 * Sanitize string input (basic XSS prevention)
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return '';

  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
