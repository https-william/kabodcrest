/**
 * Kabod Crest - Hospitality & Food Services Controller
 * Handles light-touch inquiry submissions and direct WhatsApp trade desk follow-up.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('hospitality-inquiry-form');
  const formCard = document.getElementById('hosp-form-card');
  const successCard = document.getElementById('hosp-success-card');
  const successNameEl = document.getElementById('hosp-success-name');
  const whatsappLink = document.getElementById('hosp-whatsapp-link');
  const resetBtn = document.getElementById('btn-hosp-reset');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

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
      whatsappLink.href = `https://wa.me/?text=${encodeURIComponent(text)}`;
    }

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
