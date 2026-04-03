/**
 * Main JavaScript Entry Point
 * Initializes all functionality including smooth scroll, button interactions, and module coordination
 */

(function() {
  'use strict';

  /**
   * Initialize smooth scroll behavior for anchor links
   */
  function initSmoothScroll() {
    try {
      const anchorLinks = document.querySelectorAll('a[href^="#"]');

      anchorLinks.forEach(link => {
        link.addEventListener('click', function(event) {
          const href = this.getAttribute('href');

          // Skip if href is just '#'
          if (href === '#' || href === '#!') {
            event.preventDefault();
            return;
          }

          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            event.preventDefault();

            // Smooth scroll to target
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

            // Update URL without jumping
            if (history.pushState) {
              history.pushState(null, null, href);
            }

            // Focus target for accessibility
            targetElement.focus({ preventScroll: true });
          }
        });
      });

      console.log(`Smooth scroll initialized for ${anchorLinks.length} anchor links`);
    } catch (error) {
      console.error('Error initializing smooth scroll:', error);
    }
  }

  /**
   * Initialize mobile menu toggle functionality
   */
  function initMobileMenu() {
    try {
      const navToggle = document.querySelector('.nav-toggle');
      const navMenu = document.getElementById('nav-menu');

      if (!navToggle || !navMenu) {
        return;
      }

      navToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        const newState = !isExpanded;

        // Update aria-expanded
        this.setAttribute('aria-expanded', newState.toString());

        // Toggle menu visibility
        navMenu.classList.toggle('active');

        // Toggle body scroll lock on mobile
        if (newState && window.innerWidth < 768) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      });

      // Close menu when clicking a link
      const menuLinks = navMenu.querySelectorAll('a');
      menuLinks.forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });

      // Close menu on escape key
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
          navToggle.focus();
        }
      });

      // Reset menu state on window resize
      window.addEventListener('resize', debounce(() => {
        if (window.innerWidth >= 768) {
          navMenu.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      }, 250));

      console.log('Mobile menu initialized');
    } catch (error) {
      console.error('Error initializing mobile menu:', error);
    }
  }

  /**
   * Initialize button interactions (hover/focus effects)
   */
  function initButtonInteractions() {
    try {
      const buttons = document.querySelectorAll('button, .cta-primary, .submit-button');

      buttons.forEach(button => {
        // Add ripple effect on click
        button.addEventListener('click', function(event) {
          const ripple = document.createElement('span');
          ripple.classList.add('ripple');

          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = event.clientX - rect.left - size / 2;
          const y = event.clientY - rect.top - size / 2;

          ripple.style.width = ripple.style.height = size + 'px';
          ripple.style.left = x + 'px';
          ripple.style.top = y + 'px';

          this.appendChild(ripple);

          // Remove ripple after animation
          setTimeout(() => {
            ripple.remove();
          }, 600);
        });

        // Enhanced focus handling for accessibility
        button.addEventListener('focus', function() {
          this.classList.add('focused');
        });

        button.addEventListener('blur', function() {
          this.classList.remove('focused');
        });
      });

      console.log(`Button interactions initialized for ${buttons.length} buttons`);
    } catch (error) {
      console.error('Error initializing button interactions:', error);
    }
  }

  /**
   * Initialize CTA button scroll-to-contact functionality
   */
  function initCTAButtons() {
    try {
      const ctaButtons = document.querySelectorAll('.cta-primary');

      ctaButtons.forEach(button => {
        button.addEventListener('click', function(event) {
          event.preventDefault();

          const contactSection = document.getElementById('contact');

          if (contactSection) {
            contactSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

            // Focus first form input for better UX
            setTimeout(() => {
              const firstInput = document.getElementById('name');
              if (firstInput) {
                firstInput.focus();
              }
            }, 500);
          }
        });
      });

      console.log(`CTA buttons initialized: ${ctaButtons.length}`);
    } catch (error) {
      console.error('Error initializing CTA buttons:', error);
    }
  }

  /**
   * Add reveal attributes to sections for animation
   */
  function addRevealAttributes() {
    try {
      const sections = document.querySelectorAll('section:not(.hero-section)');

      sections.forEach((section, index) => {
        if (!section.hasAttribute('data-reveal')) {
          section.setAttribute('data-reveal', '');
        }
      });

      // Add reveal to benefit cards
      const benefitCards = document.querySelectorAll('.benefit-card');
      benefitCards.forEach(card => {
        if (!card.hasAttribute('data-reveal')) {
          card.setAttribute('data-reveal', '');
        }
      });

      // Add reveal to testimonial cards
      const testimonialCards = document.querySelectorAll('.testimonial-card');
      testimonialCards.forEach(card => {
        if (!card.hasAttribute('data-reveal')) {
          card.setAttribute('data-reveal', '');
        }
      });

      console.log('Reveal attributes added to elements');
    } catch (error) {
      console.error('Error adding reveal attributes:', error);
    }
  }

  /**
   * Debounce utility function
   * @param {Function} func
   * @param {number} wait
   * @returns {Function}
   */
  function debounce(func, wait = 300) {
    let timeoutId;
    return function debounced(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /**
   * Check for older browser compatibility
   * @returns {boolean}
   */
  function checkBrowserSupport() {
    const features = {
      intersectionObserver: 'IntersectionObserver' in window,
      fetch: 'fetch' in window,
      promise: 'Promise' in window,
      classList: 'classList' in document.createElement('div')
    };

    const unsupported = Object.entries(features)
      .filter(([_, supported]) => !supported)
      .map(([feature]) => feature);

    if (unsupported.length > 0) {
      console.warn('Unsupported features detected:', unsupported);
      return false;
    }

    return true;
  }

  /**
   * Provide fallbacks for older browsers
   */
  function applyFallbacks() {
    try {
      // Fallback for smooth scroll
      if (!('scrollBehavior' in document.documentElement.style)) {
        console.log('Smooth scroll not supported, using polyfill behavior');
        // Smooth scroll already handled with scrollIntoView fallback
      }

      // Add class for older browsers
      if (!checkBrowserSupport()) {
        document.documentElement.classList.add('legacy-browser');
      }
    } catch (error) {
      console.error('Error applying fallbacks:', error);
    }
  }

  /**
   * Handle module loading errors
   */
  function handleModuleErrors() {
    window.addEventListener('error', function(event) {
      // Check if error is from a script
      if (event.target && event.target.tagName === 'SCRIPT') {
        const scriptSrc = event.target.src;
        console.error(`Failed to load script: ${scriptSrc}`);

        // Notify user if critical module fails
        const isCritical = scriptSrc.includes('main.js') || scriptSrc.includes('utils.js');
        if (isCritical) {
          console.error('Critical module failed to load. Some features may not work.');
        }
      }
    }, true);
  }

  /**
   * Initialize application performance monitoring
   */
  function initPerformanceMonitoring() {
    try {
      if ('performance' in window && 'measure' in window.performance) {
        window.addEventListener('load', function() {
          setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
              console.log('Page Load Performance:', {
                domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                domInteractive: Math.round(perfData.domInteractive),
                loadComplete: Math.round(perfData.loadEventEnd - perfData.loadEventStart)
              });
            }
          }, 0);
        });
      }
    } catch (error) {
      console.error('Error initializing performance monitoring:', error);
    }
  }

  /**
   * Main initialization function
   */
  function init() {
    console.log('Initializing application...');

    try {
      // Check browser support and apply fallbacks
      applyFallbacks();

      // Handle module loading errors
      handleModuleErrors();

      // Initialize core features
      initSmoothScroll();
      initMobileMenu();
      initButtonInteractions();
      initCTAButtons();
      addRevealAttributes();

      // Initialize performance monitoring
      initPerformanceMonitoring();

      console.log('Application initialized successfully');
    } catch (error) {
      console.error('Error during application initialization:', error);
    }
  }

  /**
   * Initialize when DOM is ready
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
