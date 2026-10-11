/* ============================================================
   ZYANIX — Contact Form Submission Engine
   Always visible, robust validation, multi-tier delivery.
   ============================================================ */
(function () {
  'use strict';

  var config = window.ZYANIX_CONFIG || {};
  var form = document.getElementById('project-form');
  var statusEl = document.getElementById('form-status');
  var fallback = document.getElementById('form-fallback');
  if (!form) return;

  // Ensure form is always visible
  form.hidden = false;
  if (fallback) fallback.hidden = true;

  var button = form.querySelector('button[type="submit"]');
  var fields = ['name', 'email', 'topic', 'message'];

  function setStatus(message, isError) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.toggle('error', Boolean(isError));
  }

  function validate() {
    for (var i = 0; i < fields.length; i++) {
      var field = form.elements[fields[i]];
      if (!field || String(field.value).trim() === '') {
        field.focus();
        setStatus('Please fill in every required field.', true);
        return false;
      }
    }
    var email = form.elements.email ? form.elements.email.value.trim() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (form.elements.email) form.elements.email.focus();
      setStatus('Please enter a valid work email address.', true);
      return false;
    }
    return true;
  }

  function formatEnquiry() {
    return [
      '--- ZYANIX PROJECT ENQUIRY ---',
      'Name: ' + (form.elements.name ? form.elements.name.value.trim() : ''),
      'Email: ' + (form.elements.email ? form.elements.email.value.trim() : ''),
      'Company: ' + (form.elements.company && form.elements.company.value.trim() ? form.elements.company.value.trim() : '—'),
      'Capability: ' + (form.elements.topic ? form.elements.topic.value : 'General'),
      '',
      'Project Details:',
      (form.elements.message ? form.elements.message.value.trim() : '')
    ].join('\n');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!validate()) return;

    var endpoint = form.getAttribute('action') || config.formspreeEndpoint;

    // 1. If Formspree endpoint is configured, send via fetch AJAX
    if (endpoint && endpoint.trim() !== '') {
      button.disabled = true;
      var originalBtnHtml = button.innerHTML;
      button.textContent = 'Sending…';

      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Submission failed');
          form.reset();
          setStatus('Thank you! Your enquiry has been sent directly to Founder & CEO Shubham Pathak. We will respond within 24 hours.');
        })
        .catch(function () {
          // Fallback to mailto if fetch fails
          var targetEmail = config.contactEmail || 'ceo@zyanxi.xyz';
          var subject = encodeURIComponent('New ZYANIX Project Enquiry — ' + (form.elements.name ? form.elements.name.value.trim() : ''));
          var body = encodeURIComponent(formatEnquiry());
          setStatus('Opening your email app to send enquiry directly to ' + targetEmail + '…');
          window.location.href = 'mailto:' + targetEmail + '?subject=' + subject + '&body=' + body;
        })
        .then(function () {
          button.disabled = false;
          button.innerHTML = originalBtnHtml;
        });
      return;
    }

    // 2. Default delivery: Mailto with prefilled formatted data
    var targetEmail = config.contactEmail || 'ceo@zyanxi.xyz';
    var name = form.elements.name ? form.elements.name.value.trim() : '';
    var subject = encodeURIComponent('New ZYANIX Project Enquiry — ' + name);
    var body = encodeURIComponent(formatEnquiry());

    setStatus('Opening your email client to send enquiry to ' + targetEmail + '…');
    window.location.href = 'mailto:' + targetEmail + '?subject=' + subject + '&body=' + body;
  });

  setStatus('Tell us about your project — every enquiry is reviewed personally.');
})();
