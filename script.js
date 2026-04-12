/* ============================================================
   LKBR Marketing LLC — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     Active Nav Link
     ============================================================ */
  function setActiveNav() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === page || (page === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ============================================================
     Mobile Nav
     ============================================================ */
  function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.getElementById('mobileOverlay');
    const closeBtn = document.getElementById('overlayClose');

    if (!hamburger || !overlay) return;

    function openOverlay() {
      overlay.classList.add('open');
      document.body.classList.add('nav-open');
    }

    function closeOverlay() {
      overlay.classList.remove('open');
      document.body.classList.remove('nav-open');
    }

    hamburger.addEventListener('click', openOverlay);
    closeBtn && closeBtn.addEventListener('click', closeOverlay);

    overlay.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeOverlay();
      });
    });

    // Close on ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeOverlay();
    });
  }

  /* ============================================================
     Scroll Fade (IntersectionObserver)
     ============================================================ */
  function initFadeIn() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.fade-in').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.fade-in').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     Number Counter Animation (Home stats)
     ============================================================ */
  function animateCounter(el, target, prefix, suffix, duration) {
    var start = null;
    var startVal = 0;

    function step(timestamp) {
      if (!start) start = timestamp;
      var elapsed = timestamp - start;
      var progress = Math.min(elapsed / duration, 1);
      // Ease out
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = prefix + current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    var statsSection = document.querySelector('.section-stats');
    if (!statsSection) return;

    var counters = statsSection.querySelectorAll('.stat-num[data-target]');
    if (!counters.length) return;

    var triggered = false;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !triggered) {
            triggered = true;
            counters.forEach(function (el) {
              var target = parseInt(el.getAttribute('data-target'), 10);
              var prefix = el.getAttribute('data-prefix') || '';
              var suffix = el.getAttribute('data-suffix') || '';
              animateCounter(el, target, prefix, suffix, 1500);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(statsSection);
  }

  /* ============================================================
     FAQ Accordion
     ============================================================ */
  function initFAQ() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var btn = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');
      if (!btn || !answer) return;

      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        // Close all
        items.forEach(function (i) {
          i.classList.remove('open');
          var a = i.querySelector('.faq-answer');
          if (a) a.style.maxHeight = '0';
        });

        // Open clicked if it was closed
        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* ============================================================
     Contact Form Handler (Formspree via fetch)
     ============================================================ */
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var successDiv = document.getElementById('formSuccess');
    var errorDiv = document.getElementById('formError');
    var submitBtn = form.querySelector('.submit-btn');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (errorDiv) errorDiv.classList.remove('visible');
      if (submitBtn) {
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;
      }

      var data = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            form.style.display = 'none';
            if (successDiv) successDiv.classList.add('visible');
          } else {
            return response.json().then(function (json) {
              throw new Error(json.error || 'Submission failed');
            });
          }
        })
        .catch(function () {
          if (errorDiv) {
            errorDiv.textContent =
              'Something went wrong. Please email us directly at lkbr.marketing@gmail.com.';
            errorDiv.classList.add('visible');
          }
          if (submitBtn) {
            submitBtn.textContent = 'Send My Free Preview Request →';
            submitBtn.disabled = false;
          }
        });
    });
  }

  /* ============================================================
     Back to Top
     ============================================================ */
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     Smooth Scroll for Anchor Links
     ============================================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ============================================================
     Init on DOM Ready
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    setActiveNav();
    initMobileNav();
    initFadeIn();
    initCounters();
    initFAQ();
    initContactForm();
    initBackToTop();
    initSmoothScroll();
  });
})();
