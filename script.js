/* ============================================================
   ZYANIX — Lightweight Interactive Core
   Zero-lag, zero-jank, sub-millisecond execution.
   ============================================================ */
(function () {
  'use strict';

  /* ----- 1. Mobile Menu Drawer ----- */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('nav-links');

  function closeMenu() {
    if (!nav) return;
    nav.classList.remove('open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Menu';
    }
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });
  }

  /* ----- 2. FAQ Accordion ----- */
  var faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      if (!item) return;
      var isActive = item.classList.contains('active');
      
      var parent = item.parentElement;
      if (parent) {
        parent.querySelectorAll('.faq-item').forEach(function (sibling) {
          if (sibling !== item) sibling.classList.remove('active');
        });
      }

      item.classList.toggle('active', !isActive);
      btn.setAttribute('aria-expanded', String(!isActive));
    });
  });

  /* ----- 3. Interactive Category Filters ----- */
  var filterButtons = document.querySelectorAll('.filter-btn');
  if (filterButtons.length > 0) {
    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var filter = button.getAttribute('data-filter') || 'all';
        var container = button.closest('.filter-container') || document;
        
        button.parentElement.querySelectorAll('.filter-btn').forEach(function (btn) {
          btn.classList.remove('active');
        });
        button.classList.add('active');

        var filterItems = container.querySelectorAll('[data-category]');
        filterItems.forEach(function (item) {
          var categories = (item.getAttribute('data-category') || '').split(' ');
          if (filter === 'all' || categories.indexOf(filter) !== -1) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ----- 4. Back to Top Button ----- */
  var backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Scroll to top');
  backToTop.innerHTML = '<span aria-hidden="true">↑</span>';
  document.body.appendChild(backToTop);

  var scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(function () {
        if (window.scrollY > 360) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ----- 5. Dynamic Copyright Year ----- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
