/**
 * Kabod Crest - Hospitality & Food Services Controller
 * Handles light-touch inquiry submissions, inline specific validation, and direct WhatsApp trade desk follow-up.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('hospitality-inquiry-form');
  const formCard = document.getElementById('hosp-form-card');
  const successCard = document.getElementById('hosp-success-card');
  const successNameEl = document.getElementById('hosp-success-name');
  const whatsappLink = document.getElementById('hosp-whatsapp-link');
  const resetBtn = document.getElementById('btn-hosp-reset');

  if (!form) return;

  const requiredFieldIds = ['hosp-name', 'hosp-email', 'hosp-phone', 'hosp-message'];

  function validateHospitalityField(id) {
    const el = document.getElementById(id);
    const errEl = document.getElementById(`${id}-error`);
    if (!el) return true;

    const val = el.value.trim();
    let message = '';

    if (id === 'hosp-name') {
      if (!val) {
        message = 'Please enter your full name';
      } else if (val.length < 2) {
        message = 'Full name must be at least 2 characters';
      }
    } else if (id === 'hosp-email') {
      if (!val) {
        message = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        message = 'Please enter a valid email address (e.g. name@example.com)';
      }
    } else if (id === 'hosp-phone') {
      if (!val) {
        message = 'Phone or WhatsApp number is required';
      } else if (val.replace(/[\s()+-]/g, '').length < 7) {
        message = 'Please enter a valid phone number (at least 7 digits)';
      }
    } else if (id === 'hosp-message') {
      if (!val) {
        message = 'Please enter a message or describe your area of interest';
      } else if (val.length < 10) {
        message = 'Please provide at least 10 characters describing your interest';
      }
    }

    if (message) {
      el.classList.add('is-invalid');
      if (errEl) {
        errEl.textContent = message;
        errEl.classList.add('visible');
      }
      return false;
    } else {
      el.classList.remove('is-invalid');
      if (errEl) {
        errEl.textContent = '';
        errEl.classList.remove('visible');
      }
      return true;
    }
  }

  // Real-time clearing as user types
  requiredFieldIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => validateHospitalityField(id));
      el.addEventListener('blur', () => validateHospitalityField(id));
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    let firstInvalidEl = null;

    requiredFieldIds.forEach(id => {
      const valid = validateHospitalityField(id);
      if (!valid) {
        isValid = false;
        if (!firstInvalidEl) firstInvalidEl = document.getElementById(id);
      }
    });

    // If validation fails, preserve all entered data (never clear) and focus first invalid field
    if (!isValid) {
      if (firstInvalidEl) {
        firstInvalidEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => firstInvalidEl.focus(), 200);
      }
      return;
    }

    const inquiry = {
      id: `HOSP-${Date.now()}`,
      createdAt: new Date().toISOString(),
      name: document.getElementById('hosp-name').value.trim(),
      email: document.getElementById('hosp-email').value.trim(),
      phone: document.getElementById('hosp-phone').value.trim(),
      organization: document.getElementById('hosp-org').value.trim() || 'Private Guest / Partner',
      message: document.getElementById('hosp-message').value.trim()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('kabod_hospitality_inquiries') || '[]');
      existing.push(inquiry);
      localStorage.setItem('kabod_hospitality_inquiries', JSON.stringify(existing));
    } catch (err) {
      console.warn('Unable to persist hospitality inquiry', err);
    }

    if (successNameEl) {
      successNameEl.textContent = inquiry.name;
    }

    if (whatsappLink) {
      const orgText = inquiry.organization !== 'Private Guest / Partner' ? ` (${inquiry.organization})` : '';
      const text = `Hello Kabod Crest Hospitality Desk, my name is *${inquiry.name}*${orgText}.%0A%0AI would like to connect regarding future hospitality concepts:%0A"${inquiry.message}"`;
      whatsappLink.href = `https://wa.me/2349053807722?text=${encodeURIComponent(text)}`;
    }

    form.style.display = 'none';
    if (successCard) {
      successCard.style.display = 'block';
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      requiredFieldIds.forEach(id => {
        const el = document.getElementById(id);
        const errEl = document.getElementById(`${id}-error`);
        if (el) el.classList.remove('is-invalid');
        if (errEl) {
          errEl.textContent = '';
          errEl.classList.remove('visible');
        }
      });
      form.style.display = 'block';
      if (successCard) {
        successCard.style.display = 'none';
      }
    });
  }
});
