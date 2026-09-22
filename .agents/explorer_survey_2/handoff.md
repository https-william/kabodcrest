# Handoff Report: Survey of Requirement R2 (Freight Rates) & R4 (Form Validation)

**Agent**: `teamwork_preview_explorer_survey_2`  
**Date**: 2026-09-21T03:12:00Z  
**Scope**: Requirement R2 (Courier Freight Rate Integration) & Requirement R4 (Form Input Validation & Sanitization)  
**Status**: Survey Complete — Ready for Implementation Planning  

---

## 1. Observation

### 1.1 Files Examined
The following files were inspected directly with exact paths and line ranges:
1. `js/shipping-config.js` (lines 1–43): Delivery tier definitions, freight rates, and export bindings.
2. `js/checkout.js` (lines 1–326): Destination region mappings, shipping tier selection, payment adapters, form submission handler, order summary rendering.
3. `checkout.html` (lines 1–231): Form structure, input IDs/attributes, shipping tier options markup, summary sidebar elements.
4. `js/cart.js` (lines 1–238): CartStore implementation, reactive events (`kabod:cart-updated`), item data models.
5. `js/currency-service.js` (lines 1–180): Currency conversion service, NGN base anchor, secondary estimate formatter.
6. `js/order-confirmation.js` (lines 1–143): Receipt rendering, shipping tier metadata display, line item breakdown.
7. `order-confirmation.html` (lines 1–228): Confirmation receipt structure, shipping tier elements (`conf-shipping-name`, `conf-shipping-meta`).
8. `css/base.css` (lines 640–720): Form element styles (`.form-input`, `.form-select`, `.form-textarea`, `.form-hint`, `.required-mark`).
9. `css/cart.css` (lines 1–693): Cart and checkout styling (`.shipping-tier-option`, `.summary-box-card`, `.summary-total-row`).
10. `css/tokens.css` (lines 1–77): Color tokens, typography, border-radius, shadows, transitions.
11. `package.json` (lines 1–7): Project dependencies (`gsap`, `lenis`).

---

### 1.2 Verbatim Code Observations

#### A. Requirement R2: Shipping Freight Configuration (`js/shipping-config.js`)
Lines 7–35 in `js/shipping-config.js`:
```javascript
const KABOD_SHIPPING_CONFIG = {
  tiers: [
    {
      id: "lagos",
      name: "Lagos Delivery (Mainland & Island)",
      description: "Direct door-to-door dispatch within Lagos State",
      rateText: "Flat rate [TBC]",
      rateAmount: null, // Set number e.g. 2500 once finalized
      isTBC: true
    },
    {
      id: "rest-of-nigeria",
      name: "Rest of Nigeria (35 States & FCT)",
      description: "Nationwide regional courier network dispatch",
      rateText: "Flat rate [TBC]",
      rateAmount: null, // Set number e.g. 5000 once finalized
      isTBC: true
    },
    {
      id: "international-air",
      name: "International Freight (UK, US, Canada, AU, Worldwide)",
      description: "Priority international air cargo with tracking & export documentation",
      rateText: "Calculated prior to dispatch invoice [TBC]",
      rateAmount: null,
      isTBC: true
    }
  ],
  defaultTier: "lagos"
};
```
*Direct observation*: All three shipping tiers currently have `rateAmount: null`, `rateText: "Flat rate [TBC]"` (or `"[TBC]"`), and `isTBC: true`. Neither the Lagos flat rate of ₦2,500 nor the Rest of Nigeria flat rate of ₦4,500 are configured.

#### B. Requirement R2: Destination Auto-Selection & Grand Total Calculation (`js/checkout.js`)
Lines 240–269 in `js/checkout.js`:
```javascript
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
```
*Direct observation*:
1. `checkSuggestedShipping()` correctly identifies `'Lagos'` vs. other Nigerian states vs. international destinations.
2. `updateShippingSummary()` only modifies `#checkout-shipping-tier-label` and `#checkout-shipping-rate-label`.
3. `checkout-total-payable` (defined in `checkout.html:202`) is NEVER referenced in `checkout.js`.
4. There is no calculation that computes `itemsSubtotal + shippingRate = grandTotal`.
5. In `checkout.html:200-203`, the summary has only:
   ```html
   <div class="summary-total-row">
     <span>Payable at Dispatch:</span>
     <span id="checkout-total-payable">Price: [TBC]</span>
   </div>
   ```
   No item subtotal row exists in `checkout.html`, and `checkout-total-payable` is statically hardcoded to `Price: [TBC]`.
6. Lines 299–309 in `checkout.js` construct `orderData` with:
   ```javascript
   priceStatus: 'Price: [TBC - Official invoice confirmed prior to dispatch]'
   ```
   Omitting numerical subtotal, shipping freight, and payable grand total from persistent storage.

#### C. Requirement R4: Customer Form & Validation Markup (`checkout.html`)
Lines 82–138 in `checkout.html`:
```html
<div class="form-group">
  <label for="cust-name" class="form-label">Full Name / Corporate Entity <span class="required-mark">*</span></label>
  <input type="text" id="cust-name" class="form-input" placeholder="e.g. Olufunmi Adeleke" required />
</div>

<div class="form-grid-2">
  <div class="form-group">
    <label for="cust-email" class="form-label">Email Address <span class="required-mark">*</span></label>
    <input type="email" id="cust-email" class="form-input" placeholder="name@domain.com" required />
  </div>
  <div class="form-group">
    <label for="cust-phone" class="form-label">Phone / WhatsApp Number <span class="required-mark">*</span></label>
    <input type="tel" id="cust-phone" class="form-input" placeholder="e.g. +234 803 000 0000" required />
    <span class="form-hint">Please include country code for international destinations</span>
  </div>
</div>
...
<div class="form-grid-2">
  <div class="form-group">
    <label for="delivery-country" class="form-label">Destination Country <span class="required-mark">*</span></label>
    <select id="delivery-country" class="form-select" required></select>
  </div>
  <div class="form-group">
    <label for="delivery-state" class="form-label">State / Province / Region <span class="required-mark">*</span></label>
    <select id="delivery-state" class="form-select" required></select>
  </div>
</div>
<div class="form-grid-2">
  <div class="form-group">
    <label for="delivery-city" class="form-label">City / Town <span class="required-mark">*</span></label>
    <input type="text" id="delivery-city" class="form-input" placeholder="e.g. Ikeja, London, Melbourne" required />
  </div>
  <div class="form-group">
    <label for="delivery-postal" class="form-label">Postal / ZIP Code</label>
    <input type="text" id="delivery-postal" class="form-input" placeholder="e.g. 100001, SW1A 1AA" />
  </div>
</div>
<div class="form-group">
  <label for="delivery-address" class="form-label">Street Address / Delivery Point <span class="required-mark">*</span></label>
  <input type="text" id="delivery-address" class="form-input" placeholder="House number, street name, apartment or suite" required />
</div>
```
*Direct observation*:
1. The `<form id="checkout-form">` relies exclusively on browser-native HTML5 attributes (`required`, `type="email"`, `type="tel"`).
2. `<input type="tel">` has NO format restriction or pattern: entering strings like `"abc"`, `"000"`, or `"123"` passes HTML5 validation.
3. No error display containers (`<span class="field-error-msg">`) exist in `checkout.html`.
4. No accessibility attributes (`aria-invalid`, `aria-describedby`, `role="alert"`) are present.
5. The form lacks the `novalidate` attribute, resulting in inconsistent default browser popups instead of brand-aligned accessible visual states.

#### D. Requirement R4: Form Submission Handler (`js/checkout.js`)
Lines 271–290 in `js/checkout.js`:
```javascript
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
```
*Direct observation*:
1. In `checkout.js`, there is NO custom JavaScript validation whatsoever.
2. `name`, `email`, `phone`, `city`, `address`, and `state` are not validated against formats or empty strings.
3. Values are only passed through `.trim()`; there is no HTML tag stripping or XSS sanitization.
4. If an invalid phone or email is submitted (bypassing or using edge cases in browser HTML5), the script immediately executes `ActivePaymentProvider.processPayment()` and redirects to `order-confirmation.html`.

#### E. Error Styling in CSS
Grep search across all stylesheets (`css/base.css`, `css/cart.css`, `css/shop.css`, `css/tokens.css`):
- Searches for `invalid`, `error`, `has-error`, `field-error` returned zero matching rules.
*Direct observation*: There are no error state classes or error message typography classes currently defined in the CSS.

#### F. Node Environment & Test Harness
Executing `node -v` returned:
```
v22.19.0
```
*Direct observation*: Modern Node.js v22 is available, which provides native `node:test` and `node:assert` modules without needing third-party test framework installations.

---

## 2. Logic Chain

### 2.1 Shipping Freight Rate Integration (R2)
1. **Fact**: `ORIGINAL_REQUEST.md` (R2 and Acceptance Criteria) specifies:
   - Lagos Flat Rate: ₦2,500.
   - Rest of Nigeria Flat Rate: ₦4,500.
   - International Air Cargo: `[TBC prior to dispatch]`.
   - Selecting "Lagos" must automatically select Lagos tier and add ₦2,500 to the checkout grand total.
   - Selecting any other Nigerian state must automatically select Rest of Nigeria and add ₦4,500.
   - Selecting an international destination must select International Freight and show shipping as `[TBC prior to dispatch]`.
2. **Fact**: `js/shipping-config.js` currently stores `rateAmount: null` for all tiers and labels them `"Flat rate [TBC]"`.
3. **Fact**: In `js/checkout.js`, `checkSuggestedShipping()` already correctly switches `selectedShippingTier` to `'lagos'`, `'rest-of-nigeria'`, or `'international-air'`, but `updateShippingSummary()` only sets labels and does not calculate totals.
4. **Fact**: In `checkout.html`, `#checkout-total-payable` exists but is never updated by JS, and there is no subtotal row.
5. **Deduction**: To fulfill R2:
   - `js/shipping-config.js` must be updated with active rates: `rateAmount: 2500` / `rateText: "₦2,500"` for Lagos; `rateAmount: 4500` / `rateText: "₦4,500"` for Rest of Nigeria; `rateAmount: null` / `rateText: "[TBC prior to dispatch]"` for International.
   - A central calculation function (e.g. `calculateOrderTotals(cartItems, shippingTier)`) must be introduced in `checkout.js` (and shared with `shipping-config.js` or `cart.js`).
   - The checkout summary in `checkout.html` must include an items subtotal line, freight line, and dynamically computed grand total line (Subtotal + Shipping).
   - Event listeners on `countrySelect` (`change`), `stateSelect` (`change`), and `.shipping-tier-option` (`click`) must re-invoke `calculateOrderTotals()` to auto-update the payable grand total in real time.
   - The computed numbers must be recorded in `orderData` (`subtotal`, `shippingAmount`, `grandTotal`, `currency: 'NGN'`) to allow `order-confirmation.js` to render them.

### 2.2 Form Input Validation & Sanitization (R4)
1. **Fact**: `ORIGINAL_REQUEST.md` (R4 and Acceptance Criteria) specifies:
   - Validate Nigerian phone numbers (`+234` or 11-digit local format `080...`).
   - Validate standard E.164 international phone formats.
   - Validate email syntax.
   - Ensure shipping address, city, and state are non-empty before proceeding to payment.
   - Provide clear, accessible visual error states.
   - Submitting with invalid email or phone triggers visual validation errors and blocks form submission.
2. **Fact**: Native HTML `<input type="tel">` performs zero pattern validation. Native HTML validation produces inconsistent browser tooltips, lacks ARIA-accessible error descriptions, and cannot distinguish Nigerian mobile prefixes or E.164 rules.
3. **Fact**: `checkout.js` currently has no validation logic in `form.addEventListener('submit')`.
4. **Fact**: `checkout.html` lacks error message elements, and CSS lacks error styling.
5. **Deduction**: To fulfill R4:
   - A client-side validation and sanitization module must be created (e.g., `js/form-validator.js` or directly within `js/checkout.js`).
   - Phone validation must support:
     - Local 11-digit Nigerian numbers: `/^0[789][01]\d{8}$/` (e.g., `08031234567`, `0814 000 0000`, `070...`, `090...`, `091...`).
     - International Nigerian format: `/^(?:\+?234|00234)(?:0)?([789][01]\d{8})$/` (e.g., `+234 803 123 4567`, `+234(0)8031234567`).
     - Standard E.164 international format: `/^\+[1-9]\d{6,14}$/` (e.g., `+44 7911 123456`, `+1 212 555 1234`, `+61 412 345 678`).
   - Email validation must enforce:
     - Standard RFC-compliant structure: `/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/`.
     - TLD minimum length of 2 characters (`.com`, `.ng`, `.co.uk`).
   - Required fields validation:
     - Name: non-empty string, min 2 characters.
     - Address: non-empty string, min 5 characters.
     - City: non-empty string, min 2 characters.
     - State: selected option is non-empty.
     - Country: selected option is non-empty.
   - Sanitization:
     - Strip HTML tags (`/<[^>]*>?/gm`) from all text inputs to prevent XSS.
     - Normalize phone numbers (strip non-digit characters except leading `+`).
     - Trim all whitespace.
   - Accessible Visual Error Presentation:
     - Set `novalidate` on `<form id="checkout-form">`.
     - Add `<span class="field-error-msg" id="[field-id]-error" role="alert" aria-live="polite"></span>` under each form control.
     - When a field fails validation:
       - Add `.is-invalid` class to the input.
       - Set `aria-invalid="true"`.
       - Set `aria-describedby="[field-id]-error"`.
       - Render helpful error message text in the error container.
     - When the field is corrected on `input` or `change`:
       - Remove `.is-invalid`.
       - Set `aria-invalid="false"`.
       - Clear error container text.
     - On submission attempt with invalid fields:
       - Highlight all failing fields.
       - Scroll to and focus the first invalid field (`firstInvalidField.focus()`).
       - Block submission and payment transition.

---

## 3. Caveats

1. **Cross-Requirement Dependencies**:
   - Requirement R1 (Dynamic Cart Pricing Engine) sets live product prices (e.g. Dehydrated Ugwu at ₦2,850, Ginger at ₦2,400, Jollof Spice at ₦2,200). Explorer 1 is investigating R1. The grand total calculation in R2 depends on receiving numerical item subtotals from `window.KabodCart.getItems()`. The R2 design must gracefully handle both priced items and TBC items (`price === null`).
   - Requirement R3 (Dual-Mode Payment Selector: Paystack vs. Manual) affects how the payment step is confirmed. The validation in R4 occurs **before** either Paystack or Manual Invoice dispatch is initiated.
   - Requirement R5 (Order Persistence & Receipt Retrieval) relies on `orderData` stored in `localStorage` containing the fields generated by R2 (`shippingAmount`, `subtotal`, `grandTotal`, `shippingTier`).
2. **Pre-Order and Mixed Carts**:
   - If a cart contains only TBC items (e.g. pre-orders with no numerical price), the shipping fee should still be explicitly displayed (₦2,500 or ₦4,500), and the total payable should display as `₦2,500 + [TBC items]` or `[TBC on Invoice]`.
   - If the shipping tier is International Air Cargo (`rateAmount: null`), the shipping rate is displayed as `[TBC prior to dispatch]`, and the grand total displays as `₦[Subtotal] + [TBC prior to dispatch]`.
3. **No Caveats on Feasibility**:
   - All necessary DOM elements, event hooks, and configuration files exist and are cleanly isolated. No external libraries are needed.

---

## 4. Conclusion & Recommended Architecture

### 4.1 Recommended Changes for R2: Courier Freight Rate Integration

#### A. In `js/shipping-config.js`
Update the tiers configuration and add destination helper utilities:
```javascript
const KABOD_SHIPPING_CONFIG = {
  tiers: [
    {
      id: "lagos",
      name: "Lagos Delivery (Mainland & Island)",
      description: "Direct door-to-door dispatch within Lagos State",
      rateText: "₦2,500",
      rateAmount: 2500,
      isTBC: false
    },
    {
      id: "rest-of-nigeria",
      name: "Rest of Nigeria (35 States & FCT)",
      description: "Nationwide regional courier network dispatch",
      rateText: "₦4,500",
      rateAmount: 4500,
      isTBC: false
    },
    {
      id: "international-air",
      name: "International Freight (UK, US, Canada, AU, Worldwide)",
      description: "Priority international air cargo with tracking & export documentation",
      rateText: "[TBC prior to dispatch]",
      rateAmount: null,
      isTBC: true
    }
  ],
  defaultTier: "lagos",

  getTierById(tierId) {
    return this.tiers.find(t => t.id === tierId) || this.tiers[0];
  },

  getTierForDestination(country, state) {
    const c = (country || '').trim().toLowerCase();
    const s = (state || '').trim().toLowerCase();

    if (c === 'nigeria') {
      if (s === 'lagos') {
        return this.getTierById('lagos');
      }
      return this.getTierById('rest-of-nigeria');
    }
    return this.getTierById('international-air');
  }
};
```

#### B. In `checkout.html` (Summary Section)
Insert a dedicated Subtotal row in the summary sidebar (`lines 185–204`):
```html
<div class="summary-line-item" style="margin-top: var(--space-md);">
  <span>Total Units:</span>
  <span id="checkout-items-count" style="font-weight: 600;">0</span>
</div>

<div class="summary-line-item" id="checkout-subtotal-row">
  <span>Items Subtotal:</span>
  <span id="checkout-subtotal-val" style="font-weight: 600; color: var(--color-text-dark);">₦0</span>
</div>

<div class="summary-line-item">
  <span>Selected Shipping:</span>
  <span id="checkout-shipping-tier-label" style="font-weight: 600; color: var(--color-plum);">Lagos Delivery</span>
</div>

<div class="summary-line-item">
  <span>Freight & Handling:</span>
  <span id="checkout-shipping-rate-label" style="font-weight: 600; color: var(--color-text-muted);">₦2,500</span>
</div>

<div class="summary-total-row">
  <span>Payable Grand Total:</span>
  <span id="checkout-total-payable">₦0</span>
</div>
<div id="checkout-estimate-payable" style="text-align: right; font-size: 0.75rem; color: var(--color-gold); font-weight: 600; margin-top: 2px;"></div>
```

#### C. In `js/checkout.js`
Add dynamic calculation and total updating:
```javascript
function calculateOrderTotals() {
  const items = window.KabodCart ? window.KabodCart.getItems() : [];
  let numericalSubtotal = 0;
  let hasTbcItems = false;
  let tbcCount = 0;

  items.forEach(item => {
    if (typeof item.price === 'number' && !isNaN(item.price) && item.price > 0) {
      numericalSubtotal += item.price * (item.quantity || 1);
    } else {
      hasTbcItems = true;
      tbcCount += (item.quantity || 1);
    }
  });

  const tier = (typeof KABOD_SHIPPING_CONFIG !== 'undefined')
    ? (KABOD_SHIPPING_CONFIG.tiers.find(t => t.id === selectedShippingTier) || KABOD_SHIPPING_CONFIG.tiers[0])
    : { id: 'lagos', name: 'Lagos Delivery', rateAmount: 2500, rateText: '₦2,500', isTBC: false };

  // Calculate Grand Total
  let payableText = '';
  let numericalGrandTotal = null;

  if (tier.rateAmount !== null) {
    if (numericalSubtotal > 0) {
      numericalGrandTotal = numericalSubtotal + tier.rateAmount;
      payableText = `₦${numericalGrandTotal.toLocaleString('en-NG')}`;
      if (hasTbcItems) payableText += ' + [TBC items]';
    } else if (hasTbcItems) {
      payableText = `₦${tier.rateAmount.toLocaleString('en-NG')} + [TBC items]`;
    } else {
      payableText = `₦${tier.rateAmount.toLocaleString('en-NG')}`;
    }
  } else {
    // International TBC Freight
    if (numericalSubtotal > 0) {
      payableText = `₦${numericalSubtotal.toLocaleString('en-NG')} + [TBC prior to dispatch]`;
    } else {
      payableText = `Price: [TBC prior to dispatch]`;
    }
  }

  // Update DOM elements
  const subtotalEl = document.getElementById('checkout-subtotal-val');
  if (subtotalEl) {
    if (numericalSubtotal > 0) {
      subtotalEl.textContent = `₦${numericalSubtotal.toLocaleString('en-NG')}${hasTbcItems ? ' + [TBC items]' : ''}`;
    } else {
      subtotalEl.textContent = '[TBC on Invoice]';
    }
  }

  const shippingTierLabelEl = document.getElementById('checkout-shipping-tier-label');
  const shippingRateLabelEl = document.getElementById('checkout-shipping-rate-label');
  const totalPayableEl = document.getElementById('checkout-total-payable');
  const estimateEl = document.getElementById('checkout-estimate-payable');

  if (shippingTierLabelEl) shippingTierLabelEl.textContent = tier.name;
  if (shippingRateLabelEl) shippingRateLabelEl.textContent = tier.rateText;
  if (totalPayableEl) totalPayableEl.textContent = payableText;

  if (estimateEl && window.KabodCurrency && numericalGrandTotal) {
    const est = window.KabodCurrency.formatEstimate(numericalGrandTotal);
    estimateEl.textContent = est || '';
  }

  return {
    subtotal: numericalSubtotal,
    shippingAmount: tier.rateAmount,
    shippingTier: tier,
    grandTotal: numericalGrandTotal,
    payableText: payableText,
    hasTbcItems: hasTbcItems
  };
}
```

---

### 4.2 Recommended Changes for R4: Form Validation & Sanitization

#### A. CSS Error State Rules (Add to `css/base.css` or `css/cart.css`)
```css
/* Form Validation States */
.form-input.is-invalid,
.form-select.is-invalid,
.form-textarea.is-invalid {
  border-color: #b32d2e !important;
  background-color: #fffaf9;
  box-shadow: 0 0 0 3px rgba(179, 45, 46, 0.15) !important;
}

.form-input.is-valid,
.form-select.is-valid {
  border-color: #1E6B43;
}

.field-error-msg {
  display: none;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  color: #b32d2e;
  margin-top: 4px;
  line-height: 1.35;
}

.field-error-msg.visible {
  display: block;
}
```

#### B. Validation & Sanitization Functions (`js/form-validator.js` or in `js/checkout.js`)
```javascript
const KabodValidator = {
  sanitizeText(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/<[^>]*>?/gm, '');
  },

  validateEmail(email) {
    if (!email || typeof email !== 'string') {
      return { valid: false, message: 'Email address is required.' };
    }
    const clean = email.trim();
    if (!clean) {
      return { valid: false, message: 'Email address is required.' };
    }
    // RFC 5322 regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(clean)) {
      return { valid: false, message: 'Please enter a valid email address (e.g. name@domain.com).' };
    }
    const parts = clean.split('@');
    const domainParts = parts[1].split('.');
    if (domainParts[domainParts.length - 1].length < 2) {
      return { valid: false, message: 'Please enter a complete domain extension (e.g. .com, .ng).' };
    }
    return { valid: true, sanitized: clean.toLowerCase() };
  },

  validatePhone(phone, country = 'Nigeria') {
    if (!phone || typeof phone !== 'string') {
      return { valid: false, message: 'Phone number is required.' };
    }
    const raw = phone.trim();
    if (!raw) {
      return { valid: false, message: 'Phone number is required.' };
    }

    // Strip spaces, dashes, dots, parentheses
    const clean = raw.replace(/[\s\-().]/g, '');

    // 1. Nigerian local 11-digit format: 070X, 080X, 081X, 090X, 091X
    const ngLocalRegex = /^0[789][01]\d{8}$/;

    // 2. Nigerian international format (+234 or 234 followed by 10 digits, optional trunk 0)
    const ngIntlRegex = /^(?:\+?234|00234)(?:0)?([789][01]\d{8})$/;

    // 3. General E.164 international format (+ followed by 7 to 15 digits)
    const e164Regex = /^\+[1-9]\d{6,14}$/;

    if (ngLocalRegex.test(clean)) {
      return { valid: true, sanitized: clean };
    }
    if (ngIntlRegex.test(clean)) {
      const match = clean.match(ngIntlRegex);
      return { valid: true, sanitized: `+234${match[1]}` };
    }
    if (e164Regex.test(clean)) {
      return { valid: true, sanitized: clean };
    }

    // For non-Nigeria country selections where user omitted '+'
    if (country !== 'Nigeria' && /^[1-9]\d{9,14}$/.test(clean)) {
      return { valid: true, sanitized: `+${clean}` };
    }

    return {
      valid: false,
      message: 'Please enter a valid Nigerian (+234 / 080...) or international (+E.164) phone number.'
    };
  },

  validateRequired(val, fieldName, minLength = 1) {
    if (!val || typeof val !== 'string') {
      return { valid: false, message: `${fieldName} is required.` };
    }
    const clean = val.trim();
    if (clean.length < minLength) {
      return { valid: false, message: `${fieldName} must be at least ${minLength} characters.` };
    }
    return { valid: true, sanitized: this.sanitizeText(clean) };
  }
};
```

#### C. Integration in `checkout.html` and `checkout.js`
1. Set `novalidate` on `<form id="checkout-form">`.
2. Wrap inputs with corresponding error message nodes:
   ```html
   <input type="text" id="cust-name" class="form-input" placeholder="e.g. Olufunmi Adeleke" required aria-describedby="cust-name-error" />
   <span class="field-error-msg" id="cust-name-error" role="alert" aria-live="polite"></span>
   ```
3. Attach live `input` and `change` event listeners to clear error states when corrected.
4. On `submit`, run full validation across all fields:
   - `cust-name`: required (min 2 chars)
   - `cust-email`: `validateEmail`
   - `cust-phone`: `validatePhone`
   - `delivery-country`: required
   - `delivery-state`: required
   - `delivery-city`: required (min 2 chars)
   - `delivery-address`: required (min 5 chars)
5. If invalid:
   - Apply `.is-invalid` to all failing fields.
   - Inject specific error messages.
   - Find first invalid element: `firstInvalid.focus()`.
   - Prevent submission.
6. If valid:
   - Sanitize all strings before building `orderData`.
   - Include `subtotal`, `shippingAmount`, `grandTotal`, and `paymentMethod`.
   - Proceed to payment dispatch.

---

## 5. Verification Method

### 5.1 Automated Unit Tests (Native Node.js Test Runner)
Since Node v22 is installed, unit tests can be executed without installing external libraries using:
```powershell
node --test tests/shipping-freight.test.js
node --test tests/form-validation.test.js
```

#### Test Suite 1: `shipping-freight.test.js`
- Test 1: Lagos shipping tier exists with `rateAmount: 2500` and `rateText: "₦2,500"`.
- Test 2: Rest of Nigeria tier exists with `rateAmount: 4500` and `rateText: "₦4,500"`.
- Test 3: International Air Cargo exists with `rateAmount: null` and `rateText: "[TBC prior to dispatch]"`.
- Test 4: `getTierForDestination('Nigeria', 'Lagos')` returns `'lagos'` (₦2,500).
- Test 5: `getTierForDestination('Nigeria', 'Abuja (FCT)')` returns `'rest-of-nigeria'` (₦4,500).
- Test 6: `getTierForDestination('Nigeria', 'Rivers')` returns `'rest-of-nigeria'` (₦4,500).
- Test 7: `getTierForDestination('United Kingdom', 'Greater London')` returns `'international-air'`.
- Test 8: `getTierForDestination('United States', 'California')` returns `'international-air'`.
- Test 9: Grand total calculation for 2x Ugwu (₦2,850 x 2 = ₦5,700) + Lagos (₦2,500) = ₦8,200.
- Test 10: Grand total calculation for 2x Ugwu (₦5,700) + Abuja (₦4,500) = ₦10,200.
- Test 11: Grand total calculation for 2x Ugwu (₦5,700) + UK ([TBC]) = `₦5,700 + [TBC prior to dispatch]`.

#### Test Suite 2: `form-validation.test.js`
- Test 1: Nigerian local phone format: `08031234567` -> Valid.
- Test 2: Nigerian international phone format: `+2348031234567` -> Valid.
- Test 3: Nigerian spaced phone format: `+234 803 123 4567` -> Valid.
- Test 4: Nigerian format with trunk zero: `+234 (0) 803 123 4567` -> Valid.
- Test 5: UK E.164 international phone: `+44 7911 123456` -> Valid.
- Test 6: US E.164 international phone: `+1 212 555 1234` -> Valid.
- Test 7: Invalid short phone: `080` -> Invalid.
- Test 8: Invalid alpha characters: `080abcdefgh` -> Invalid.
- Test 9: Standard valid email: `olufunmi@kabodcrest.ng` -> Valid.
- Test 10: Email without `@`: `invalid.email.com` -> Invalid.
- Test 11: Email without TLD: `user@domain` -> Invalid.
- Test 12: Empty address/city/state triggers validation error.
- Test 13: XSS sanitization strips `<script>alert(1)</script>` and tags cleanly.

### 5.2 Manual Browser / End-to-End Verification
1. Start local dev server: `node server.js` (port 3030).
2. Open `http://127.0.0.1:3030/checkout.html` with cart items.
3. Verify Destination Dropdown:
   - Selecting "Lagos" under Nigeria:
     - Radio option 1 ("Lagos Delivery") activates.
     - Shipping rate displays "₦2,500".
     - Grand total updates to Subtotal + ₦2,500.
   - Selecting "Abuja (FCT)" under Nigeria:
     - Radio option 2 ("Rest of Nigeria") activates.
     - Shipping rate displays "₦4,500".
     - Grand total updates to Subtotal + ₦4,500.
   - Selecting "United Kingdom":
     - Radio option 3 ("International Freight") activates.
     - Shipping rate displays "[TBC prior to dispatch]".
     - Grand total displays "₦[Subtotal] + [TBC prior to dispatch]".
4. Verify Form Validation & Visual Errors:
   - Leave Name empty, enter `"notanemail"` in Email, and enter `"12345"` in Phone. Click "Confirm & Register Pre-Order Allocation".
   - Expected: Form submission blocked.
   - Visual red borders (`.is-invalid`) appear on Name, Email, and Phone.
   - Error labels appear below each invalid field.
   - Screen focus moves to the Name field.
   - As valid text is typed into the fields, red borders and error messages disappear immediately.
5. Invalidation Conditions:
   - Any failure of `node --test` test cases.
   - Grand total failing to reflect freight upon state change in checkout UI.
   - Form successfully submitting with an invalid phone or email.
