/**
 * Kabod Crest - Business Services Controller
 * Handles lead capture inquiry validation, submission confirmation, and WhatsApp outreach.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('business-inquiry-form');
  const formCard = document.getElementById('inquiry-form-card');
  const successCard = document.getElementById('inquiry-success-card');
  const successNameEl = document.getElementById('success-client-name');
  const whatsappLink = document.getElementById('success-whatsapp-link');
  const resetBtn = document.getElementById('btn-submit-another');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

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
      whatsappLink.href = `https://wa.me/?text=${encodeURIComponent(text)}`;
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
      form.style.display = 'block';
      if (successCard) {
        successCard.style.display = 'none';
      }
    });
  }
});
