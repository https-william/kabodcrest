# DISPATCH: Milestone 2 - Complete Checkout Pipeline (Freight, Validation, Payment Bridge & Order Persistence)

You are `teamwork_preview_worker_m2`, a versatile worker agent.
Your working directory is: `c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\worker_m2`
Original request path: `c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\ORIGINAL_REQUEST.md`
Project specification path: `c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\PROJECT.md`
Survey reports:
- Shipping & Validation: `c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\explorer_survey_2\handoff.md`
- Payment & Persistence: `c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\explorer_survey_3\handoff.md`
Test readiness report: `c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\TEST_READY.md`

## File Ownership
You have EXCLUSIVE write ownership of:
- `js/shipping-config.js`
- `checkout.html`
- `js/checkout.js`
- `order-confirmation.html`
- `js/order-confirmation.js`
- `css/base.css` or `css/cart.css` (for `.is-invalid` and `.field-error-msg` error classes)
- `tests/` (if any adjustments are needed)
DO NOT break any `js/products-data.js` or `js/cart.js` functionality established in Milestone 1.

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Milestone 2 Deliverables (Features F6–F18)

### 1. Courier Freight Rate Integration (R2, F6-F8)
- In `js/shipping-config.js`:
  - Configure Lagos flat rate: `rateAmount: 2500`, `rateText: "₦2,500"`, `isTBC: false`.
  - Configure Rest of Nigeria flat rate: `rateAmount: 4500`, `rateText: "₦4,500"`, `isTBC: false`.
  - Configure International Air Cargo: `rateAmount: null`, `rateText: "[TBC prior to dispatch]"`, `isTBC: true`.
  - Provide `getTierById(id)` and `getTierForDestination(country, state)`.
- In `checkout.html` & `js/checkout.js`:
  - Add itemized Subtotal row in checkout summary sidebar (`#checkout-subtotal-val`).
  - In `js/checkout.js`: implement `calculateOrderTotals(items, shippingTier)` summing `subtotal + freight` to update `#checkout-total-payable` and `#checkout-estimate-payable` dynamically when destination changes.
  - When user selects "Lagos", automatically select Lagos tier and add ₦2,500.
  - When user selects another Nigerian state (e.g. Abuja, Rivers, Oyo), automatically select Rest of Nigeria and add ₦4,500.
  - When user selects an international country, select International Freight and show shipping as `[TBC prior to dispatch]`.

### 2. Client-Side Form Validation & Sanitization (R4, F9-F12)
- In `js/checkout.js` (and expose `window.KabodValidator` for testability):
  - `validatePhone(phone, country)`: Support Nigerian 11-digit local (`080...`, `070...`, `090...`, `081...`, `091...`), international Nigerian format (`+234...`), and standard E.164 international formats (`+44...`, `+1...`). Reject invalid / short / alphabetic strings.
  - `validateEmail(email)`: RFC 5322 structure with TLD length >= 2.
  - `validateRequired(value, name, minLength)`: Validate name, street address, city, state, country.
  - `sanitizeText(str)`: Strip HTML tags to neutralize XSS.
- In `checkout.html`:
  - Add `novalidate` to `<form id="checkout-form">`.
  - Add error message spans (`<span class="field-error-msg" id="[field]-error" role="alert">`) and `aria-describedby` links.
- In `css/base.css` or `css/cart.css`:
  - Define styles for `.is-invalid`, `.is-valid`, and `.field-error-msg.visible`.
- In `js/checkout.js`:
  - Run validation on form submission: if any field is invalid, apply `.is-invalid`, show error message, focus the first invalid field, and block submission!
  - Attach live `input`/`change` event listeners to clear error states when corrected.

### 3. Dual-Mode Payment Bridge (R3, F13-F15)
- In `checkout.html`:
  - Include `<script src="https://js.paystack.co/v1/inline.js"></script>`.
  - Add payment selector in section 4: "Paystack Online Payment" (Card / USSD / Bank Transfer) vs "Manual Corporate Bank Transfer" (Invoice & Wire Remittance).
- In `js/checkout.js`:
  - `PaystackPaymentProvider`: Convert grand total to Kobo (`amountInKobo = Math.round(grandTotal * 100)`). If `PaystackPop` is present, call `PaystackPop.setup({...})`. Include graceful simulation fallback if `PaystackPop` is undefined in headless testing.
  - `ManualPaymentProvider`: Render official corporate bank coordinates (Kabod Crest Limited, Zenith Bank PLC, account number, narration quoting `orderRef`). Set `paymentStatus = 'pending_invoice'`.

### 4. Durable Order History & Receipt Persistence (R5, F16-F18)
- In `js/checkout.js`:
  - Generate unique `orderRef` formatted as `KC-2026-XXXX`.
  - Save full `OrderRecord` to BOTH `localStorage.getItem('kabod_order_history')` (array) AND `localStorage.getItem('kabod_pending_order')`.
  - Redirect to `order-confirmation.html?ref=${orderRef}`.
- In `order-confirmation.html` & `js/order-confirmation.js`:
  - Parse `?ref=` from URL parameters.
  - Look up matching order from `kabod_order_history` first, then `kabod_pending_order`.
  - Render customer details, delivery address, shipping tier, itemized list, line totals, Subtotal, Freight, and Grand Total.
  - Conditionally render payment badge / status: online Paystack payment confirmation badge vs manual bank transfer remittance instructions.
  - Ensure reloading `order-confirmation.html?ref=...` maintains all state without loss or fallback to dummy mock data.

### 5. Verification & Testing
Run the complete automated test suite:
```bash
node --test tests/**/*.test.js
```
Verify that ALL 239 tests pass (including unit tests for pricing, shipping, validation, payment-order, and E2E workflow tests).
Write your completion report to `c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\worker_m2\handoff.md` and notify parent when complete.
