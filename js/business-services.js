/**
 * Kabod Crest - Business Services Controller
 * Handles lead capture inquiry validation, inline specific errors, submission confirmation, and WhatsApp outreach.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('business-inquiry-form');
  const formCard = document.getElementById('inquiry-form-card');
  const successCard = document.getElementById('inquiry-success-card');
  const successNameEl = document.getElementById('success-client-name');
  const whatsappLink = document.getElementById('success-whatsapp-link');
  const resetBtn = document.getElementById('btn-submit-another');

  if (!form) return;

  const requiredFieldIds = ['inq-name', 'inq-email', 'inq-phone', 'inq-message'];

  function validateInquiryField(id) {
    const el = document.getElementById(id);
    const errEl = document.getElementById(`${id}-error`);
    if (!el) return true;

    const val = el.value.trim();
    let message = '';

    if (id === 'inq-name') {
      if (!val) {
        message = 'Please enter your full name';
      } else if (val.length < 2) {
        message = 'Full name must be at least 2 characters';
      }
    } else if (id === 'inq-email') {
      if (!val) {
        message = 'Corporate email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        message = 'Please enter a valid email address (e.g. name@company.com)';
      }
    } else if (id === 'inq-phone') {
      if (!val) {
        message = 'Phone or WhatsApp number is required';
      } else if (val.replace(/[\s()+-]/g, '').length < 7) {
        message = 'Please enter a valid phone number (at least 7 digits)';
      }
    } else if (id === 'inq-message') {
      if (!val) {
        message = 'Please describe your business inquiry or collaboration idea';
      } else if (val.length < 10) {
        message = 'Please provide at least 10 characters describing your inquiry';
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

  // Real-time validation listeners: clear errors immediately as user corrects input
  requiredFieldIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => validateInquiryField(id));
      el.addEventListener('blur', () => validateInquiryField(id));
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    let firstInvalidEl = null;

    requiredFieldIds.forEach(id => {
      const valid = validateInquiryField(id);
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
      id: `INQ-${Date.now()}`,
      createdAt: new Date().toISOString(),
      name: document.getElementById('inq-name').value.trim(),
      company: document.getElementById('inq-company').value.trim() || 'Independent Partner',
      email: document.getElementById('inq-email').value.trim(),
      phone: document.getElementById('inq-phone').value.trim(),
      message: document.getElementById('inq-message').value.trim()
    };

    // Save locally for lead persistence
    try {
      const existing = JSON.parse(localStorage.getItem('kabod_inquiries') || '[]');
      existing.push(inquiry);
      localStorage.setItem('kabod_inquiries', JSON.stringify(existing));
    } catch (err) {
      console.warn('Unable to persist inquiry to localStorage', err);
    }

    // Update success view
    if (successNameEl) {
      successNameEl.textContent = inquiry.name;
    }

    if (whatsappLink) {
      const companyNote = inquiry.company !== 'Independent Partner' ? ` from ${inquiry.company}` : '';
      const text = `Hello Kabod Crest Limited, my name is *${inquiry.name}*${companyNote}.%0A%0AI am reaching out regarding strategic business collaboration:%0A"${inquiry.message}"%0A%0APlease let me know when convenient to schedule an exploratory discussion.`;
      whatsappLink.href = `https://wa.me/2349053807722?text=${encodeURIComponent(text)}`;
    }

    // Toggle UI views
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
