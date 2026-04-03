/**
 * Scroll-triggered Reveal Animations
 * Uses Intersection Observer API with stagger timing and reduced motion support
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px',
    staggerDelay: 150, // milliseconds between elements
  };

  let observer = null;
  const revealedElements = new WeakSet();

  /**
   * Check if user prefers reduced motion
   * @returns {boolean}
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
   * Handle intersection of elements
   * @param {IntersectionObserverEntry[]} entries
   */
  function handleIntersection(entries) {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting && !revealedElements.has(entry.target)) {
        revealElement(entry.target, index);
        revealedElements.add(entry.target);
      }
    });
  }

  /**
   * Reveal element with optional stagger delay
   * @param {Element} element
   * @param {number} index
   */
  function revealElement(element, index) {
    try {
      const reducedMotion = prefersReducedMotion();
      const delay = reducedMotion ? 0 : index * CONFIG.staggerDelay;

      setTimeout(() => {
        element.classList.add('revealed');

        // Dispatch custom event for tracking
        const event = new CustomEvent('element-revealed', {
          detail: { element, index }
        });
        element.dispatchEvent(event);
      }, delay);
    } catch (error) {
      console.error('Error revealing element:', error);
      // Fallback: reveal immediately without animation
      element.classList.add('revealed');
    }
  }

  /**
   * Initialize scroll reveal animations
   */
  function initScrollReveal() {
    try {
      // Check for IntersectionObserver support
      if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver not supported, revealing all elements');
        fallbackRevealAll();
        return;
      }

      // Find all elements with data-reveal attribute
      const revealElements = document.querySelectorAll('[data-reveal]');

      if (revealElements.length === 0) {
        console.log('No elements with data-reveal attribute found');
        return;
      }

      // If reduced motion, reveal all immediately
      if (prefersReducedMotion()) {
        revealElements.forEach(element => {
          element.classList.add('revealed');
        });
        return;
      }

      // Create intersection observer
      observer = new IntersectionObserver(handleIntersection, {
        threshold: CONFIG.threshold,
        rootMargin: CONFIG.rootMargin
      });

      // Observe all reveal elements
      revealElements.forEach(element => {
        observer.observe(element);
      });

      console.log(`Scroll reveal initialized for ${revealElements.length} elements`);
    } catch (error) {
      console.error('Error initializing scroll reveal:', error);
      fallbackRevealAll();
    }
  }

  /**
   * Fallback: Reveal all elements immediately
   */
  function fallbackRevealAll() {
    try {
      const elements = document.querySelectorAll('[data-reveal]');
      elements.forEach(element => {
        element.classList.add('revealed');
      });
    } catch (error) {
      console.error('Error in fallback reveal:', error);
    }
  }

  /**
   * Cleanup function to disconnect observer
   */
  function cleanup() {
    if (observer) {
      observer.disconnect();
      observer = null;
      console.log('Scroll reveal observer disconnected');
    }
  }

  /**
   * Refresh observer (useful for dynamic content)
   */
  function refresh() {
    try {
      if (!observer) {
        console.warn('Cannot refresh: observer not initialized');
        return;
      }

      const revealElements = document.querySelectorAll('[data-reveal]');

      revealElements.forEach(element => {
        if (!revealedElements.has(element)) {
          observer.observe(element);
        }
      });
    } catch (error) {
      console.error('Error refreshing scroll reveal:', error);
    }
  }

  /**
   * Initialize when DOM is ready
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initScrollReveal);
    } else {
      initScrollReveal();
    }
  }

  // Auto-initialize
  init();

  // Expose public API
  window.ScrollReveal = {
    refresh,
    cleanup
  };

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);
})();
