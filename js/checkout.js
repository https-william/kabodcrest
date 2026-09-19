/**
 * Kabod Crest - Checkout Controller & Swappable Payment Architecture
 * Handles customer contact, Worldwide Delivery (Nigeria, UK, US, Australia, South Africa, etc.),
 * dynamic state/province selection, and swappable payment handling.
 */

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
// Swappable Payment Module Architecture
// --------------------------------------------------------------------------
/**
 * SWAP-IN POINT FOR PAYSTACK / FLUTTERWAVE:
 * To activate live card/online payment in the future without altering checkout:
 *
 * class PaystackPaymentProvider {
 *   renderUI(containerEl, orderData) {
 *     containerEl.innerHTML = '<p>You will be securely redirected to Paystack...</p>';
 *   }
 *   processPayment(orderData, onSuccess, onError) {
 *     const handler = PaystackPop.setup({
 *       key: 'pk_live_your_key_here',
 *       email: orderData.customer.email,
 *       amount: orderData.amountInKobo,
 *       ref: orderData.orderRef,
 *       callback: (res) => onSuccess(res),
 *       onClose: () => onError('Transaction cancelled')
 *     });
 *     handler.openIframe();
 *   }
 * }
 */

class ManualPaymentProvider {
  renderUI(containerEl, orderData) {
    containerEl.innerHTML = `
      <div class="payment-method-header">
        <span style="font-family: var(--font-structural); font-weight: 600;">Manual Corporate Bank Transfer</span>
        <span class="payment-badge">Standard Pre-Order Mode</span>
      </div>
      <p style="font-size: 0.8125rem; color: var(--color-text-muted); line-height: 1.5;">
        Because unit rates for this harvest batch are being finalized, submitting this pre-order will immediately register your reservation and generate your unique <strong>Order Reference</strong>. 
        You will receive an official invoice with finalized batch rates and bank remittance instructions prior to dispatch.
      </p>
      <div class="bank-details-placeholder-box">
        <div style="font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">
          Settlement Account Details [Official details to be inserted upon commercial invoice release]:
        </div>
        <div class="bank-detail-row">
          <span class="bank-detail-label">Beneficiary:</span>
          <span class="bank-detail-val">Kabod Crest Limited</span>
        </div>
        <div class="bank-detail-row">
          <span class="bank-detail-label">Bank Institution:</span>
          <span class="bank-detail-val">[Designated Bank to be inserted]</span>
        </div>
        <div class="bank-detail-row">
          <span class="bank-detail-label">Account Number:</span>
          <span class="bank-detail-val">[Corporate NGN / FX Account to be inserted]</span>
        </div>
        <div class="bank-detail-row">
          <span class="bank-detail-label">Payment Narrative / Reference:</span>
          <span class="bank-detail-val" style="color: var(--color-plum);">Quote your Order Reference #</span>
        </div>
      </div>
    `;
  }

  processPayment(orderData, onSuccess) {
    // Manual transfer does not require external gateway handshake
    onSuccess({ status: 'success', method: 'manual_transfer' });
  }
}

// Active provider instance (change to new PaystackPaymentProvider() when ready)
const ActivePaymentProvider = new ManualPaymentProvider();

// --------------------------------------------------------------------------
// Checkout Page Controller
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkout-form');
  const countrySelect = document.getElementById('delivery-country');
  const stateSelect = document.getElementById('delivery-state');
  const paymentContainer = document.getElementById('payment-module-container');
  const summaryItemsList = document.getElementById('checkout-summary-items');
  const summaryCountEl = document.getElementById('checkout-items-count');

  // Verify cart has items
  const cartItems = window.KabodCart ? window.KabodCart.getItems() : [];
  if (cartItems.length === 0) {
    // If cart is empty, redirect back to shop
    window.location.href = 'shop.html';
    return;
  }

  // Render order summary sidebar
  if (summaryCountEl) {
    summaryCountEl.textContent = `${window.KabodCart.getTotalCount()} items`;
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
          ${item.priceDisplay}
        </div>
      </div>
    `).join('');
  }

  // Initialize Country & Dynamic State Dropdown
  initWorldwideRegions();

  function initWorldwideRegions() {
    if (!countrySelect || !stateSelect) return;

    // Populate country options
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
    });

    // Default trigger for initial selected country (Nigeria)
    updateStates(countrySelect.value);
  }

  // Render Payment Module UI
  if (paymentContainer) {
    ActivePaymentProvider.renderUI(paymentContainer, { items: cartItems });
  }

  // Initialize Shipping Tiers (Step 3)
  const shippingContainer = document.getElementById('shipping-tiers-options');
  const shippingTierLabelEl = document.getElementById('checkout-shipping-tier-label');
  const shippingRateLabelEl = document.getElementById('checkout-shipping-rate-label');
  let selectedShippingTier = (typeof KABOD_SHIPPING_CONFIG !== 'undefined') ? KABOD_SHIPPING_CONFIG.defaultTier : 'lagos';

  function renderShippingTiers() {
    if (!shippingContainer || typeof KABOD_SHIPPING_CONFIG === 'undefined') return;

    shippingContainer.innerHTML = KABOD_SHIPPING_CONFIG.tiers.map(tier => `
      <label class="shipping-tier-option ${tier.id === selectedShippingTier ? 'selected' : ''}" data-tier-id="${tier.id}">
        <input
          type="radio"
          name="shipping_tier"
          value="${tier.id}"
          class="shipping-tier-radio"
          ${tier.id === selectedShippingTier ? 'checked' : ''}
        />
        <div class="shipping-tier-info">
          <div class="shipping-tier-header">
            <span class="shipping-tier-name">${tier.name}</span>
            <span class="shipping-tier-rate">${tier.rateText}</span>
          </div>
          <p class="shipping-tier-desc">${tier.description}</p>
        </div>
      </label>
    `).join('');

    shippingContainer.querySelectorAll('.shipping-tier-option').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-tier-id');
        setShippingTier(id);
      });
    });

    updateShippingSummary();
  }

  function setShippingTier(tierId) {
    selectedShippingTier = tierId;
    if (shippingContainer) {
      shippingContainer.querySelectorAll('.shipping-tier-option').forEach(el => {
        const isTarget = el.getAttribute('data-tier-id') === tierId;
        el.classList.toggle('selected', isTarget);
        const radio = el.querySelector('input[type="radio"]');
        if (radio) radio.checked = isTarget;
      });
    }
    updateShippingSummary();
  }

  function updateShippingSummary() {
    if (typeof KABOD_SHIPPING_CONFIG === 'undefined') return;
    const tier = KABOD_SHIPPING_CONFIG.tiers.find(t => t.id === selectedShippingTier);
    if (tier) {
      if (shippingTierLabelEl) shippingTierLabelEl.textContent = tier.name;
      if (shippingRateLabelEl) shippingRateLabelEl.textContent = tier.rateText;
    }
  }

  renderShippingTiers();

  // Auto-suggest shipping tier when destination changes
  function checkSuggestedShipping() {
    const c = countrySelect ? countrySelect.value : 'Nigeria';
    const s = stateSelect ? stateSelect.value : '';

    if (c === 'Nigeria') {
      if (s === 'Lagos') {
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

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect form values
      const customer = {
        name: document.getElementById('cust-name').value.trim(),
        email: document.getElementById('cust-email').value.trim(),
        phone: document.getElementById('cust-phone').value.trim()
      };

      const delivery = {
        country: countrySelect ? countrySelect.value : 'Nigeria',
        state: stateSelect ? stateSelect.value : '',
        city: document.getElementById('delivery-city').value.trim(),
        address: document.getElementById('delivery-address').value.trim(),
        postalCode: document.getElementById('delivery-postal').value.trim(),
        notes: document.getElementById('delivery-notes') ? document.getElementById('delivery-notes').value.trim() : ''
      };

      const tierObj = (typeof KABOD_SHIPPING_CONFIG !== 'undefined')
        ? KABOD_SHIPPING_CONFIG.tiers.find(t => t.id === selectedShippingTier)
        : { id: selectedShippingTier, name: selectedShippingTier };

      // Generate unique Order Reference number
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderRef = `KC-2026-${randomSuffix}`;

      const orderData = {
        orderRef: orderRef,
        createdAt: new Date().toISOString(),
        customer: customer,
        delivery: delivery,
        shippingTier: tierObj,
        items: cartItems,
        totalCount: window.KabodCart.getTotalCount(),
        priceStatus: 'Price: [TBC - Official invoice confirmed prior to dispatch]'
      };

      // Process payment via swappable adapter
      ActivePaymentProvider.processPayment(orderData, (res) => {
        // Save pending order to localStorage for confirmation page
        localStorage.setItem('kabod_pending_order', JSON.stringify(orderData));

        // Clear active cart
        if (window.KabodCart) {
          window.KabodCart.clear();
        }

        // Redirect to order confirmation
        window.location.href = `order-confirmation.html?ref=${orderRef}`;
      });
    });
  }
});
