/**
 * Kabod Crest - Motion & Scroll System
 * Standards: elite-design-core, gsap-scrolltrigger, Quiet Authority
 *
 * Implements:
 * 1. Lenis smooth scroll synchronized with GSAP ScrollTrigger
 * 2. Gold hairline draw-in reveals under major section titles
 * 3. Parallax product photography (gentle scrub on hero & feature imagery)
 * 4. Staggered element reveals (80-120ms interval on card grids)
 * 5. Respects prefers-reduced-motion
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Accessibility check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 2. Initialize Lenis Smooth Scroll
    let lenisInstance = null;
    if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
      lenisInstance = new Lenis({
        lerp: 0.09,
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.4,
      });

      // Synchronize Lenis with GSAP ScrollTrigger
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        lenisInstance.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
          lenisInstance.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) {
          lenisInstance.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }

      window.KabodLenis = lenisInstance;
    }

    // 3. GSAP Scroll Animations (Skip if reduced motion or GSAP missing)
    if (prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // Ensure hairlines are visible by default if animations are bypassed
      document.querySelectorAll('.gold-hairline').forEach(el => {
        el.style.transform = 'scaleX(1)';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // A. Gold Hairline Reveal Under Major Headings
    gsap.utils.toArray('.gold-hairline').forEach((line) => {
      gsap.fromTo(
        line,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 0.95,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: line,
            start: 'top 90%',
            once: true
          }
        }
      );
    });

    // B. Parallax Product Photography (Subtle drift on scroll)
    const parallaxImages = document.querySelectorAll(
      '.hero-featured-image, .packaging-spotlight-img, .story-craft-image, .events-feature-image, .gastronomy-feature-img, .shop-packaging-feature-img'
    );

    parallaxImages.forEach((img) => {
      gsap.to(img, {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      });
    });

    // C. Staggered Reveals on Grids (80-120ms apart)
    const staggerConfigs = [
      { container: '.businesses-bento-grid', items: '.biz-card' },
      { container: '.businesses-grid', items: '.biz-card' },
      { container: '.spotlight-categories-grid', items: '.spotlight-cat-card' },
      { container: '.standard-grid', items: '.standard-card' },
      { container: '.vmv-triple-grid', items: '.vmv-card' },
      { container: '.values-grid', items: '.value-card' },
      { container: '.events-pillars-grid', items: '.event-pillar-card' },
      { container: '.concept-pillars-grid', items: '.concept-card' },
      { container: '.product-grid', items: '.product-card' }
    ];

    staggerConfigs.forEach((cfg) => {
      const containerEl = document.querySelector(cfg.container);
      if (!containerEl) return;

      const items = containerEl.querySelectorAll(cfg.items);
      if (!items || items.length === 0) return;

      gsap.fromTo(
        items,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power2.out',
          stagger: 0.09, // 90ms stagger interval
          scrollTrigger: {
            trigger: containerEl,
            start: 'top 85%',
            once: true
          }
        }
      );
    });
  });
})();
