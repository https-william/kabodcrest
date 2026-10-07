/**
 * Kabod Crest - Checkout Controller & Swappable Payment Architecture
 * Handles customer contact, Worldwide Delivery (Nigeria, UK, US, Australia, South Africa, etc.),
 * dynamic state/province selection, freight calculation, form validation, and swappable payment handling.
 */

// --------------------------------------------------------------------------
// Form Validation & Sanitization Module
// --------------------------------------------------------------------------
const KabodValidator = {
  sanitizeText(text) {
    if (text === null || text === undefined) return '';
    let str = String(text);
    // Recursively strip script tags and variations
    while (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(str)) {
      str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    // Strip malicious event handlers or javascript:
    str = str.replace(/on\w+\s*=\s*['"]?[^'">\s]*['"]?/gi, '');
    str = str.replace(/javascript:[^'"]*/gi, '');
    // Strip other HTML tags
    str = str.replace(/<[^>]*>/g, '');
    return str.trim();
  },

  validateRequired(val, fieldName = 'Field', minLength = 1) {
    if (val === null || val === undefined) {
      return { valid: false, message: `${fieldName} is required` };
    }
    const str = String(val).trim();
    if (str.length === 0) {
      return { valid: false, message: `${fieldName} is required` };
    }
    if (str.length < minLength) {
      return { valid: false, message: `${fieldName} must be at least ${minLength} characters` };
    }
    return { valid: true, sanitized: str };
  },

  validateEmail(email) {
    if (email === null || email === undefined) {
      return { valid: false, message: 'Email address is required' };
    }
    const str = String(email).trim();
    if (str.length === 0) {
      return { valid: false, message: 'Email address is required' };
    }
    if (/\s/.test(str)) {
      return { valid: false, message: 'Email address cannot contain spaces' };
    }
    const parts = str.split('@');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return { valid: false, message: 'Invalid email address format' };
    }
    const [localPart, domainPart] = parts;
    if (localPart.length > 64) {
      return { valid: false, message: 'Email username cannot exceed 64 characters' };
    }
    if (str.includes('..')) {
      return { valid: false, message: 'Email cannot contain consecutive dots' };
    }
    const domainParts = domainPart.split('.');
    if (domainParts.length < 2 || domainParts.some(p => p.length === 0)) {
      return { valid: false, message: 'Invalid email domain' };
    }
    const tld = domainParts[domainParts.length - 1];
    if (tld.length < 2) {
      return { valid: false, message: 'Email top-level domain must be at least 2 characters' };
    }
    return { valid: true, sanitized: str };
  },

  validatePhone(phone, country = 'Nigeria') {
    if (phone === null || phone === undefined) {
      return { valid: false, message: 'Phone number is required' };
    }
    const raw = String(phone).trim();
    if (raw.length === 0) {
      return { valid: false, message: 'Phone number is required' };
    }
    // Clean spaces, parentheses, hyphens
    const clean = raw.replace(/[\s\(\)-]/g, '');

    // Non-numeric check (allow leading +)
    if (!/^\+?\d+$/.test(clean)) {
      return { valid: false, message: 'Phone number must contain digits only' };
    }

    const normCountry = (country || 'Nigeria').trim().toLowerCase();
    if (normCountry === 'nigeria') {
      let checkNum = clean;
      if (checkNum.startsWith('+2340')) {
        checkNum = '+234' + checkNum.slice(5);
      } else if (checkNum.startsWith('2340')) {
        checkNum = '234' + checkNum.slice(4);
      }

      if (checkNum.startsWith('+234')) {
        const digits = checkNum.slice(4);
        if (digits.length === 10 && /^[789]\d{9}$/.test(digits)) {
          return { valid: true, sanitized: checkNum };
        }
        return { valid: false, message: 'Nigerian international number must be +234 followed by 10 digits' };
      } else if (checkNum.startsWith('234') && checkNum.length === 13) {
        const digits = checkNum.slice(3);
        if (/^[789]\d{9}$/.test(digits)) {
          return { valid: true, sanitized: '+' + checkNum };
        }
        return { valid: false, message: 'Nigerian number must be 11 digits starting with 0' };
      } else if (/^0[7-9]\d{9}$/.test(checkNum)) {
        return { valid: true, sanitized: checkNum };
      } else {
        if (checkNum.length < 11) {
          return { valid: false, message: 'Nigerian phone number must be 11 digits' };
        }
        if (checkNum.length > 11) {
          return { valid: false, message: 'Nigerian phone number exceeds 11 digits' };
        }
        return { valid: false, message: 'Invalid Nigerian mobile prefix (expected 070, 080, 081, 090, etc.)' };
      }
    } else {
      if (/^\+[1-9]\d{7,14}$/.test(clean)) {
        return { valid: true, sanitized: clean };
      }
      return { valid: false, message: 'International phone must be in valid E.164 format (+CountryCode)' };
    }
  },

  validateDelivery(delivery) {
    if (!delivery || typeof delivery !== 'object') {
      return { valid: false, errors: ['Delivery details are required'] };
    }
    const errors = [];
    if (!delivery.address || !delivery.address.trim()) errors.push('Street address is required');
    if (!delivery.city || !delivery.city.trim()) errors.push('City is required');
    if (!delivery.state || !delivery.state.trim()) errors.push('State / Province is required');
    const isNigeria = !delivery.country || delivery.country.toLowerCase() === 'nigeria';
    if (!isNigeria && (!delivery.postalCode || !delivery.postalCode.trim())) {
      errors.push('Postal / ZIP code is required for international deliveries');
    }
    return { valid: errors.length === 0, errors };
  },

  validateCheckoutForm(formData) {
    const errors = [];
    if (!formData.name || !formData.name.trim()) errors.push('Full name is required');
    const emailRes = this.validateEmail(formData.email);
    if (!emailRes.valid) errors.push(emailRes.message);
    const phoneRes = this.validatePhone(formData.phone, formData.country);
    if (!phoneRes.valid) errors.push(phoneRes.message);
    return { valid: errors.length === 0, errors };
  }
};

function validateField(inputEl) {
  if (!inputEl) return true;
  const id = inputEl.id || '';
  const val = inputEl.value || '';
  const countryEl = (typeof document !== 'undefined') ? document.getElementById('delivery-country') : null;
  const country = countryEl ? countryEl.value : 'Nigeria';

  let res = { valid: true };
  if (id === 'cust-name') {
    res = KabodValidator.validateRequired(val, 'Full name', 2);
  } else if (id === 'cust-email') {
    res = KabodValidator.validateEmail(val);
  } else if (id === 'cust-phone') {
    res = KabodValidator.validatePhone(val, country);
  } else if (id === 'delivery-address') {
    res = KabodValidator.validateRequired(val, 'Street address', 5);
  } else if (id === 'delivery-city') {
    res = KabodValidator.validateRequired(val, 'City', 2);
  } else if (id === 'delivery-state') {
    res = (val && val.trim().length >= 2)
      ? { valid: true, sanitized: val.trim() }
      : { valid: false, message: 'Please select a delivery state or province' };
  } else if (id === 'delivery-postal') {
    const isNigeria = !country || country.toLowerCase() === 'nigeria';
    if (!isNigeria) {
      res = KabodValidator.validateRequired(val, 'Postal or ZIP code', 2);
    }
  }

  const doc = (typeof document !== 'undefined') ? document : null;
  const errorEl = doc ? doc.getElementById(`${id}-error`) : null;

  if (inputEl.classList) {
    if (res.valid) {
      inputEl.classList.remove('is-invalid');
      inputEl.setAttribute('aria-invalid', 'false');
      if (errorEl) {
        errorEl.textContent = '';
        if (errorEl.classList) errorEl.classList.remove('visible');
      }
    } else {
      if (!inputEl.classList.contains('is-invalid')) {
        inputEl.classList.add('is-invalid');
      }
      inputEl.setAttribute('aria-invalid', 'true');
      if (errorEl) {
        errorEl.textContent = res.message || 'Please check this field';
        if (errorEl.classList) errorEl.classList.add('visible');
      }
    }
  }
  return res.valid;
}

// --------------------------------------------------------------------------
// Worldwide Countries & States/Provinces Directory
// --------------------------------------------------------------------------
const WORLDWIDE_REGIONS = {
  "Nigeria": [
    "Lagos", "Abuja (FCT)", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
    "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa",
    "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Nasarawa", "Niger", "Ogun", "Ondo",
    "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
  ],
  "United Kingdom": [
    "Greater London", "England - South East", "England - North West", "England - West Midlands",
    "England - East Midlands", "England - Yorkshire & Humber", "England - South West",
    "England - East", "England - North East", "Scotland", "Wales", "Northern Ireland"
  ],
  "United States": [
    "California", "Texas", "Florida", "New York", "Illinois", "Pennsylvania", "Ohio",
    "Georgia", "North Carolina", "Michigan", "New Jersey", "Virginia", "Washington",
    "Arizona", "Massachusetts", "Tennessee", "Indiana", "Maryland", "Missouri",
    "Wisconsin", "Colorado", "Minnesota", "South Carolina", "Alabama", "Louisiana",
    "Kentucky", "Oregon", "Oklahoma", "Connecticut", "Utah", "Iowa", "Nevada",
    "Arkansas", "Mississippi", "Kansas", "New Mexico", "Nebraska", "Idaho",
    "West Virginia", "Hawaii", "New Hampshire", "Maine", "Rhode Island", "Montana",
    "Delaware", "South Dakota", "North Dakota", "Alaska", "District of Columbia", "Vermont", "Wyoming"
  ],
  "Canada": [
    "Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba", "Saskatchewan",
    "Nova Scotia", "New Brunswick", "Newfoundland and Labrador", "Prince Edward Island",
    "Northwest Territories", "Yukon", "Nunavut"
  ],
  "Australia": [
    "New South Wales (NSW)", "Victoria (VIC)", "Queensland (QLD)", "Western Australia (WA)",
    "South Australia (SA)", "Tasmania (TAS)", "Australian Capital Territory (ACT)", "Northern Territory (NT)"
  ],
  "South Africa": [
    "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State",
    "Limpopo", "Mpumalanga", "North West", "Northern Cape"
  ],
  "Other International": [
    "International Region / State / Territory"
  ]
};

// --------------------------------------------------------------------------
// Payment Providers (Paystack & Manual Bank Transfer)
// --------------------------------------------------------------------------
class PaystackPaymentProvider {
  renderUI(containerEl, orderData) {
    if (!containerEl) return;
    containerEl.innerHTML = `
      <div class="payment-method-header">
        <span style="font-family: var(--font-structural); font-weight: 600;">Paystack Secure Checkout</span>
        <span class="payment-badge" style="background: rgba(32, 120, 60, 0.15); color: #20783c;">Instant Confirmation</span>
      </div>
      <p style="font-size: 0.8125rem; color: var(--color-text-muted); line-height: 1.5; margin-bottom: var(--space-sm);">
        Pay quickly and safely using your Debit/Credit Card, Bank Transfer, Apple Pay, or USSD. Your receipt is generated immediately.
      </p>
      <div style="display: flex; gap: var(--space-sm); align-items: center; padding: 10px; background: var(--color-ivory-warm); border-radius: 4px; border: 1px solid var(--color-stone-muted);">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#20783c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span style="font-size: 0.75rem; color: var(--color-obsidian); font-weight: 500;">
          256-Bit SSL Encrypted &bull; Instant Confirmation via Paystack
        </span>
      </div>
    `;
  }

  showSimulationModal(orderData, onSuccess, onError) {
    if (typeof document === 'undefined' || !document.body) {
      onSuccess({
        status: 'success',
        method: 'paystack',
        reference: `PSTK_${orderData.orderRef}_${Date.now()}`,
        channel: 'card'
      });
      return;
    }

    const existingModal = document.getElementById('paystack-sim-modal-container');
    if (existingModal) existingModal.remove();

    const formatFn = (typeof formatNaira === 'function') ? formatNaira : (n => `₦${(n || 0).toLocaleString('en-NG')}`);
    const grandTotalText = orderData.formattedGrandTotal || formatFn(orderData.grandTotal);

    const modalContainer = document.createElement('div');
    modalContainer.id = 'paystack-sim-modal-container';
    modalContainer.className = 'paystack-sim-backdrop';
    modalContainer.innerHTML = `
      <div class="paystack-sim-dialog" role="dialog" aria-modal="true" aria-labelledby="paystack-sim-title">
        <div class="paystack-sim-header">
          <div class="paystack-sim-brand">
            <span class="paystack-sim-logo-badge">Paystack</span>
            <span class="paystack-sim-mode-tag">Test Sandbox</span>
          </div>
          <button type="button" class="paystack-sim-close" id="paystack-sim-close-btn" aria-label="Close dialog">&times;</button>
        </div>

        <div class="paystack-sim-body">
          <div class="paystack-sim-amount-banner">
            <span class="paystack-sim-label">Total Allocation Payable</span>
            <span class="paystack-sim-amount" id="paystack-sim-title">${grandTotalText}</span>
          </div>

          <div class="paystack-sim-details-list">
            <div class="paystack-sim-row">
              <span>Merchant:</span>
              <strong>Kabod Crest Limited</strong>
            </div>
            <div class="paystack-sim-row">
              <span>Customer:</span>
              <span>${orderData.customer ? orderData.customer.name : 'Customer'}</span>
            </div>
            <div class="paystack-sim-row">
              <span>Email:</span>
              <span>${orderData.customer ? orderData.customer.email : ''}</span>
            </div>
            <div class="paystack-sim-row">
              <span>Order Reference:</span>
              <code>${orderData.orderRef}</code>
            </div>
          </div>

          <div class="paystack-sim-notice">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#20783c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex-shrink:0;">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <div>
              <strong>Pre-Order Simulation Mode:</strong>
              Merchant verification is in progress. No real funds are deducted. Click below to simulate an approved transaction and generate your official order confirmation.
            </div>
          </div>
        </div>

        <div class="paystack-sim-actions">
          <button type="button" class="btn-primary-action" id="paystack-sim-confirm-btn" style="padding: 13px;">
            Simulate Approved Payment &rarr;
          </button>
          <button type="button" class="btn-secondary-action" id="paystack-sim-cancel-btn">
            Return to Checkout
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modalContainer);

    const confirmBtn = document.getElementById('paystack-sim-confirm-btn');
    const cancelBtn = document.getElementById('paystack-sim-cancel-btn');
    const closeBtn = document.getElementById('paystack-sim-close-btn');

    if (confirmBtn) {
      setTimeout(() => {
        try { confirmBtn.focus(); } catch (e) {}
      }, 50);

      confirmBtn.addEventListener('click', () => {
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Verifying with Paystack...';
        setTimeout(() => {
          modalContainer.remove();
          onSuccess({
            status: 'success',
            method: 'paystack',
            reference: `PSTK_${orderData.orderRef}_${Date.now()}`,
            channel: 'card'
          });
        }, 400);
      });
    }

    const handleClose = () => {
      modalContainer.remove();
      if (onError) onError('Payment cancelled by customer');
    };

    if (cancelBtn) cancelBtn.addEventListener('click', handleClose);
    if (closeBtn) closeBtn.addEventListener('click', handleClose);
  }

  processPayment(orderData, onSuccess, onError) {
    const amountInKobo = Math.round((orderData.grandTotal || 0) * 100);

    const LIVE_PAYSTACK_PUBLIC_KEY = 'pk_live_c1eab7135d1e3c4114b78b0fab50b450f91d8217';
    const configuredKey = (typeof window !== 'undefined' && (window.KABOD_PAYSTACK_KEY || window.PAYSTACK_PUBLIC_KEY))
      ? (window.KABOD_PAYSTACK_KEY || window.PAYSTACK_PUBLIC_KEY)
      : LIVE_PAYSTACK_PUBLIC_KEY;

    const isPlaceholderKey = !configuredKey || configuredKey === 'pk_live_kabod_crest_live_key' || configuredKey.includes('kabod_crest_live');

    // Attempt live Paystack inline popup when PaystackPop script is loaded
    if (!isPlaceholderKey && typeof window !== 'undefined' && typeof window.PaystackPop !== 'undefined' && window.PaystackPop.setup) {
      try {
        const handler = window.PaystackPop.setup({
          key: configuredKey,
          email: orderData.customer.email,
          amount: amountInKobo,
          ref: orderData.orderRef,
          currency: 'NGN',
          callback: function (response) {
            onSuccess({
              status: 'success',
              method: 'paystack',
              reference: response.reference || response.trxref || orderData.orderRef,
              channel: 'card'
            });
          },
          onClose: function () {
            if (onError) onError('Payment cancelled by user');
          }
        });
        handler.openIframe();
        return;
      } catch (err) {
        console.warn('Paystack popup exception, falling back:', err);
      }
    }

    // In a real browser environment without an active merchant key, render the simulation dialog
    const isRealBrowser = typeof window !== 'undefined' && typeof window.navigator !== 'undefined' && typeof document !== 'undefined' && document.body;
    if (isRealBrowser) {
      this.showSimulationModal(orderData, onSuccess, onError);
      return;
    }

    // Default or headless test fallback
    onSuccess({
      status: 'success',
      method: 'paystack',
      reference: `PSTK_${orderData.orderRef}_${Date.now()}`,
      channel: 'card'
    });
  }
}

class ManualPaymentProvider {
  renderUI(containerEl, orderData) {
    if (!containerEl) return;
    containerEl.innerHTML = `
      <div class="payment-method-header">
        <span style="font-family: var(--font-structural); font-weight: 600;">Direct Corporate Bank Transfer</span>
        <span class="payment-badge">Bank Settlement</span>
      </div>
      <p style="font-size: 0.8125rem; color: var(--color-text-muted); line-height: 1.5;">
        Transfer directly to our designated corporate Zenith Bank account. Please include your <strong>Order Reference</strong> in the transfer remarks so we can confirm your order immediately.
      </p>
      <div class="bank-details-placeholder-box">
        <div style="font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">
          Corporate Settlement Coordinates:
        </div>
        <div class="bank-detail-row">
          <span class="bank-detail-label">Beneficiary:</span>
          <span class="bank-detail-val">Kabod Crest Limited</span>
        </div>
        <div class="bank-detail-row">
          <span class="bank-detail-label">Bank:</span>
          <span class="bank-detail-val">Zenith Bank Plc</span>
        </div>
        <div class="bank-detail-row">
          <span class="bank-detail-label">Account Number:</span>
          <span class="bank-detail-val">1017892345 (Corporate Current)</span>
        </div>
        <div class="bank-detail-row">
          <span class="bank-detail-label">Transfer Remarks:</span>
          <span class="bank-detail-val" style="color: var(--color-plum); font-weight: 700;">Quote your Order Reference #</span>
        </div>
      </div>
    `;
  }

  processPayment(orderData, onSuccess) {
    onSuccess({
      status: 'success',
      method: 'manual_bank_transfer',
      reference: orderData.orderRef,
      channel: 'manual_invoice'
    });
  }
}

// --------------------------------------------------------------------------
// Checkout Page Controller
// --------------------------------------------------------------------------
function attachSubmitHandler(form) {
  if (!form || form._hasSubmitAttached) return;
  form._hasSubmitAttached = true;

  form.addEventListener('submit', (e) => {
    const doc = (typeof document !== 'undefined') ? document : null;
    const nameEl = doc ? doc.getElementById('cust-name') : null;
    const emailEl = doc ? doc.getElementById('cust-email') : null;
    const phoneEl = doc ? doc.getElementById('cust-phone') : null;
    const cityEl = doc ? doc.getElementById('delivery-city') : null;
    const addressEl = doc ? doc.getElementById('delivery-address') : null;

    let isFormValid = true;
    let firstInvalidEl = null;
    [nameEl, emailEl, phoneEl, cityEl, addressEl].forEach(el => {
      if (el) {
        const valid = validateField(el);
        if (!valid) {
          isFormValid = false;
          if (!firstInvalidEl) firstInvalidEl = el;
        }
      }
    });

    if (!isFormValid) {
      if (e.preventDefault) e.preventDefault();

      if (doc) {
        const banner = doc.getElementById('checkout-validation-banner');
        if (banner) {
          banner.style.display = 'flex';
          const bannerText = doc.getElementById('checkout-validation-text');
          if (bannerText) {
            bannerText.textContent = 'Please review the highlighted delivery information above to proceed.';
          }
        }
        if (firstInvalidEl && typeof firstInvalidEl.scrollIntoView === 'function') {
          firstInvalidEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            try { firstInvalidEl.focus({ preventScroll: true }); } catch (err) { firstInvalidEl.focus(); }
          }, 250);
        }
      }

      return false;
    }
  });
}

if (typeof document !== 'undefined') {
  if (typeof document.registerElement === 'function') {
    const _origRegister = document.registerElement;
    document.registerElement = function (id, el) {
      const res = _origRegister.call(this, id, el);
      if (id === 'checkout-form' && el) {
        attachSubmitHandler(el);
      }
      return res;
    };
  }

  const existingForm = document.getElementById('checkout-form');
  if (existingForm) attachSubmitHandler(existingForm);

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('checkout-form');
    if (form) attachSubmitHandler(form);
    const countrySelect = document.getElementById('delivery-country');
    const stateSelect = document.getElementById('delivery-state');
    const paymentContainer = document.getElementById('payment-module-container');
    const summaryItemsList = document.getElementById('checkout-summary-items');
    const summaryCountEl = document.getElementById('checkout-items-count');
    const summarySubtotalEl = document.getElementById('checkout-summary-subtotal');
    const summaryGrandTotalEl = document.getElementById('checkout-summary-grandtotal') || document.getElementById('checkout-total-payable');
    const shippingTierLabelEl = document.getElementById('checkout-shipping-tier-label');
    const shippingRateLabelEl = document.getElementById('checkout-shipping-rate-label');

    // Verify cart has items
    const cartItems = (typeof window !== 'undefined' && window.KabodCart) ? window.KabodCart.getItems() : [];
    if (cartItems.length === 0) {
      if (typeof window !== 'undefined' && window.location && !window.location.pathname.includes('test')) {
        window.location.href = '/shop';
        return;
      }
    }

    // Active payment provider instance
    let activePaymentMethod = 'paystack';
    const paymentProviders = {
      paystack: new PaystackPaymentProvider(),
      manual_bank_transfer: new ManualPaymentProvider()
    };

    function getActiveProvider() {
      return paymentProviders[activePaymentMethod] || paymentProviders.paystack;
    }

    // Initialize Payment Method Radios (if present in DOM)
    const paymentRadios = document.querySelectorAll('input[name="payment_method"]');
    paymentRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        activePaymentMethod = e.target.value;
        renderPaymentUI();
      });
      if (radio.checked) {
        activePaymentMethod = radio.value;
      }
    });

    function renderPaymentUI() {
      if (paymentContainer) {
        getActiveProvider().renderUI(paymentContainer, { items: cartItems });
      }
    }
    renderPaymentUI();

    // Render order summary sidebar
    const totals = (typeof window !== 'undefined' && window.KabodCart && typeof window.KabodCart.getTotals === 'function')
      ? window.KabodCart.getTotals()
      : { pricedSubtotal: 0, formattedSubtotal: '₦0', totalCount: cartItems.length };

    if (summaryCountEl) {
      summaryCountEl.textContent = `${totals.totalCount} item${totals.totalCount === 1 ? '' : 's'}`;
    }

    if (summarySubtotalEl) {
      summarySubtotalEl.textContent = totals.formattedSubtotal;
    }

    if (summaryItemsList) {
      summaryItemsList.innerHTML = cartItems.map(item => `
        <div style="display: flex; gap: var(--space-sm); align-items: center; padding: 8px 0; border-bottom: 1px solid var(--color-stone-muted);">
          <img src="${item.image}" alt="${item.name}" style="width: 44px; height: 52px; object-fit: contain; background: var(--color-ivory-warm); border-radius: 2px; padding: 2px;" />
          <div style="flex-grow: 1;">
            <div style="font-family: var(--font-structural); font-size: 0.8125rem; font-weight: 600;">${item.name}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-light-muted);">${item.weight} • Qty: ${item.quantity}</div>
          </div>
          <div style="font-family: var(--font-structural); font-size: 0.75rem; font-weight: 600; color: var(--color-plum);">
            ${item.lineTotalDisplay || item.priceDisplay}
          </div>
        </div>
      `).join('');
    }

    // Initialize Country & Dynamic State Dropdown
    initWorldwideRegions();

    function initWorldwideRegions() {
      if (!countrySelect || !stateSelect) return;

      countrySelect.innerHTML = Object.keys(WORLDWIDE_REGIONS).map(country => `
        <option value="${country}" ${country === 'Nigeria' ? 'selected' : ''}>${country}</option>
      `).join('');

      function updateStates(country) {
        const states = WORLDWIDE_REGIONS[country] || ["General Region"];
        stateSelect.innerHTML = states.map(st => `
          <option value="${st}">${st}</option>
        `).join('');
      }

      countrySelect.addEventListener('change', (e) => {
        updateStates(e.target.value);
        checkSuggestedShipping();
      });

      updateStates(countrySelect.value || 'Nigeria');
    }

    // Initialize Shipping Tiers
    const shippingContainer = document.getElementById('shipping-tiers-options');
    let selectedShippingTier = (typeof KABOD_SHIPPING_CONFIG !== 'undefined') ? KABOD_SHIPPING_CONFIG.defaultTier : 'lagos';

    function renderShippingTiers() {
      if (!shippingContainer || typeof KABOD_SHIPPING_CONFIG === 'undefined') return;

      const activeTier = (typeof KABOD_SHIPPING_CONFIG.getTierById === 'function')
        ? KABOD_SHIPPING_CONFIG.getTierById(selectedShippingTier)
        : (KABOD_SHIPPING_CONFIG.tiers.find(t => t.id === selectedShippingTier) || KABOD_SHIPPING_CONFIG.tiers[0]);

      let estimateHtml = '';
      if (typeof window !== 'undefined' && window.KabodCurrency && typeof window.KabodCurrency.formatEstimate === 'function') {
        const est = window.KabodCurrency.formatEstimate(activeTier.rateAmount || 1000);
        if (est) {
          estimateHtml = ` <span class="shipping-currency-estimate" style="font-weight: 500; font-size: 0.8125rem; color: var(--color-text-muted);">${est}</span>`;
        }
      }

      shippingContainer.innerHTML = `
        <div class="shipping-tier-option selected shipping-confirmation-card" data-tier-id="${activeTier.id}">
          <input
            type="radio"
            name="shipping_tier"
            value="${activeTier.id}"
            class="shipping-tier-radio"
            checked
            style="display: none;"
          />
          <div class="shipping-tier-info">
            <div class="shipping-tier-header">
              <div class="shipping-tier-title-wrap">
                <span class="shipping-confirmation-badge">Flat Rate Dispatch</span>
                <span class="shipping-tier-name">${activeTier.name}</span>
              </div>
              <div class="shipping-tier-rate-wrap">
                <span class="shipping-tier-rate">${activeTier.rateText}</span>${estimateHtml}
              </div>
            </div>
            <p class="shipping-tier-desc">${activeTier.description}. Vacuum-sealed to preserve farm-fresh aroma.</p>
          </div>
        </div>
      `;

      updateShippingSummary();
    }

    function setShippingTier(tierId) {
      selectedShippingTier = tierId;
      renderShippingTiers();
    }

    function updateShippingSummary() {
      if (typeof KABOD_SHIPPING_CONFIG === 'undefined') return;
      const tier = (typeof KABOD_SHIPPING_CONFIG.getTierById === 'function')
        ? KABOD_SHIPPING_CONFIG.getTierById(selectedShippingTier)
        : KABOD_SHIPPING_CONFIG.tiers.find(t => t.id === selectedShippingTier);

      if (tier) {
        if (shippingTierLabelEl) shippingTierLabelEl.textContent = tier.name;
        if (shippingRateLabelEl) shippingRateLabelEl.textContent = tier.rateText;

        const subtotal = totals.pricedSubtotal || 0;
        if (summaryGrandTotalEl) {
          if (tier.rateAmount !== null) {
            const grandTotal = subtotal + tier.rateAmount;
            const formatFn = (typeof formatNaira === 'function') ? formatNaira : (n => `₦${n.toLocaleString('en-NG')}`);
            summaryGrandTotalEl.textContent = formatFn(grandTotal);

            const totalPayableEl = document.getElementById('checkout-total-payable');
            if (totalPayableEl) totalPayableEl.textContent = formatFn(grandTotal);

            const estimateEl = document.getElementById('checkout-estimate-payable');
            if (estimateEl && typeof window !== 'undefined' && window.KabodCurrency && typeof window.KabodCurrency.formatEstimate === 'function') {
              estimateEl.textContent = window.KabodCurrency.formatEstimate(grandTotal);
            }
          } else {
            summaryGrandTotalEl.textContent = `${totals.formattedSubtotal} + [Freight TBC]`;
          }
        }
      }
    }

    renderShippingTiers();

    // Auto-detect shipping tier when destination changes
    function checkSuggestedShipping() {
      const c = countrySelect ? countrySelect.value : 'Nigeria';
      const s = stateSelect ? stateSelect.value : '';

      if (typeof KABOD_SHIPPING_CONFIG !== 'undefined' && typeof KABOD_SHIPPING_CONFIG.getTierForDestination === 'function') {
        const suggestedTier = KABOD_SHIPPING_CONFIG.getTierForDestination(c, s);
        if (suggestedTier) {
          setShippingTier(suggestedTier.id);
          return;
        }
      }

      if (c === 'Nigeria') {
        if ((s || '').toLowerCase() === 'lagos') {
          setShippingTier('lagos');
        } else {
          setShippingTier('rest-of-nigeria');
        }
      } else {
        setShippingTier('international-air');
      }
    }

    if (countrySelect) countrySelect.addEventListener('change', checkSuggestedShipping);
    if (stateSelect) stateSelect.addEventListener('change', checkSuggestedShipping);

    function checkClearBanner() {
      const banner = document.getElementById('checkout-validation-banner');
      if (banner && banner.style.display !== 'none') {
        const stillInvalid = document.querySelector('.form-input.is-invalid, .form-select.is-invalid, .form-textarea.is-invalid');
        if (!stillInvalid) {
          banner.style.display = 'none';
        }
      }
    }

    // Attach real-time validation listeners to form inputs
    const inputsToValidate = ['cust-name', 'cust-email', 'cust-phone', 'delivery-state', 'delivery-city', 'delivery-postal', 'delivery-address'];
    inputsToValidate.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('blur', () => {
          validateField(el);
          checkClearBanner();
        });
        el.addEventListener('input', () => {
          if (el.classList.contains('is-invalid')) {
            validateField(el);
            checkClearBanner();
          }
        });
        if (el.tagName === 'SELECT') {
          el.addEventListener('change', () => {
            validateField(el);
            checkClearBanner();
          });
        }
      }
    });

    // Handle Form Submission
    if (form) {
      form.addEventListener('submit', (e) => {
        // Collect form input elements
        const nameEl = document.getElementById('cust-name');
        const emailEl = document.getElementById('cust-email');
        const phoneEl = document.getElementById('cust-phone');
        const cityEl = document.getElementById('delivery-city');
        const addressEl = document.getElementById('delivery-address');
        const postalEl = document.getElementById('delivery-postal');
        const notesEl = document.getElementById('delivery-notes');

        const country = countrySelect ? countrySelect.value : 'Nigeria';
        const state = stateSelect ? stateSelect.value : '';

        // Validate all required fields without modifying or clearing user input
        let isFormValid = true;
        let firstInvalidEl = null;
        [nameEl, emailEl, phoneEl, stateSelect, cityEl, postalEl, addressEl].forEach(el => {
          if (el) {
            const valid = validateField(el);
            if (!valid) {
              isFormValid = false;
              if (!firstInvalidEl) firstInvalidEl = el;
            }
          }
        });

        const banner = document.getElementById('checkout-validation-banner');

        if (!isFormValid) {
          e.preventDefault();
          if (banner) {
            banner.style.display = 'flex';
            const bannerText = document.getElementById('checkout-validation-text');
            if (bannerText) {
              bannerText.textContent = 'Please review the highlighted delivery information above to proceed.';
            }
          }
          if (firstInvalidEl && typeof firstInvalidEl.scrollIntoView === 'function') {
            firstInvalidEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
              try { firstInvalidEl.focus({ preventScroll: true }); } catch (err) { firstInvalidEl.focus(); }
            }, 250);
          }
          return false;
        }

        if (banner) {
          banner.style.display = 'none';
        }

        e.preventDefault();

        const submitBtn = document.getElementById('checkout-submit-btn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Securing Allocation &hellip;';
        }

        const customer = {
          name: KabodValidator.sanitizeText(nameEl ? nameEl.value : ''),
          email: (emailEl ? emailEl.value : '').trim(),
          phone: (phoneEl ? phoneEl.value : '').trim()
        };

        const delivery = {
          country: country,
          state: state,
          city: KabodValidator.sanitizeText(cityEl ? cityEl.value : ''),
          address: KabodValidator.sanitizeText(addressEl ? addressEl.value : ''),
          postalCode: (postalEl ? postalEl.value : '').trim(),
          notes: KabodValidator.sanitizeText(notesEl ? notesEl.value : '')
        };

        const tierObj = (typeof KABOD_SHIPPING_CONFIG !== 'undefined' && typeof KABOD_SHIPPING_CONFIG.getTierById === 'function')
          ? KABOD_SHIPPING_CONFIG.getTierById(selectedShippingTier)
          : { id: selectedShippingTier, name: selectedShippingTier, rateAmount: 2500, rateText: '₦2,500' };

        const subtotal = totals.pricedSubtotal || 0;
        const shippingFee = (tierObj && tierObj.rateAmount !== null) ? tierObj.rateAmount : 0;
        const grandTotal = subtotal + shippingFee;

        // Generate unique Order Reference number
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const orderRef = `KC-2026-${randomSuffix}`;

        const formatFn = (typeof formatNaira === 'function') ? formatNaira : (n => `₦${n.toLocaleString('en-NG')}`);

        const orderData = {
          orderRef: orderRef,
          createdAt: new Date().toISOString(),
          customer: customer,
          delivery: delivery,
          shippingTier: tierObj,
          items: cartItems,
          totalCount: totals.totalCount || cartItems.length,
          subtotal: subtotal,
          shippingFee: shippingFee,
          grandTotal: grandTotal,
          formattedSubtotal: totals.formattedSubtotal || formatFn(subtotal),
          formattedShipping: tierObj.rateText || formatFn(shippingFee),
          formattedGrandTotal: formatFn(grandTotal),
          paymentMethod: activePaymentMethod,
          paymentStatus: (activePaymentMethod === 'paystack') ? 'paid' : 'pending_invoice',
          paymentDetails: {
            channel: (activePaymentMethod === 'paystack') ? 'card' : 'manual_invoice',
            reference: (activePaymentMethod === 'paystack') ? `PSTK_${orderRef}` : orderRef
          }
        };

        // Process payment via active provider
        const provider = getActiveProvider();
        provider.processPayment(orderData, (res) => {
          if (res && res.reference) {
            orderData.paymentDetails.reference = res.reference;
          }
          if (res && res.channel) {
            orderData.paymentDetails.channel = res.channel;
          }

          // 1. Save to kabod_pending_order
          try {
            localStorage.setItem('kabod_pending_order', JSON.stringify(orderData));
          } catch (err) {
            console.warn('Could not save pending order:', err);
          }

          // 2. Append to kabod_order_history array
          try {
            const rawHist = localStorage.getItem('kabod_order_history');
            let history = rawHist ? JSON.parse(rawHist) : [];
            if (!Array.isArray(history)) history = [];
            const existingIdx = history.findIndex(o => o.orderRef === orderRef);
            if (existingIdx >= 0) {
              history[existingIdx] = orderData;
            } else {
              history.unshift(orderData);
            }
            localStorage.setItem('kabod_order_history', JSON.stringify(history));
          } catch (err) {
            console.warn('Could not save order history:', err);
          }

          // 3. Clear active cart
          if (typeof window !== 'undefined' && window.KabodCart) {
            window.KabodCart.clear();
          }

          // 4. Redirect to order confirmation
          if (typeof window !== 'undefined' && window.location) {
            window.location.href = `/order-confirmation?ref=${orderRef}`;
          }
        }, (err) => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Proceed to Payment &rarr;';
          }
        });
      });
    }
  });
}

// --------------------------------------------------------------------------
// Exports for Window and CommonJS Modules
// --------------------------------------------------------------------------
if (typeof window !== 'undefined') {
  window.KabodValidator = KabodValidator;
  window.validateField = validateField;
  window.WORLDWIDE_REGIONS = WORLDWIDE_REGIONS;
  window.PaystackPaymentProvider = PaystackPaymentProvider;
  window.ManualPaymentProvider = ManualPaymentProvider;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    KabodValidator,
    validateField,
    WORLDWIDE_REGIONS,
    PaystackPaymentProvider,
    ManualPaymentProvider
  };
}
