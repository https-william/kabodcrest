# Handoff Report: Survey of R3 (Dual-Mode Payment Bridge) & R5 (Order History & Receipt Persistence)

## 1. Observation

A systematic survey was conducted across the Kabod Crest codebase with primary focus on Requirement R3 (Dual-Mode Payment Bridge: Paystack + Manual Invoice) and Requirement R5 (Durable Order History & Receipt Persistence), as well as related files.

### Exact Files & Lines Examined:

1. **`checkout.html`** (`file:///c:/Users/cutef/Downloads/My%20Projects/Kabod%20Crest/checkout.html`):
   - Lines 158–165: Payment step markup contains only an empty container:
     ```html
     <!-- 4. Swappable Payment Step -->
     <section class="checkout-card" aria-labelledby="payment-heading">
       <h2 class="checkout-card-title" id="payment-heading">
         <span>4. Commercial Payment Mode</span>
       </h2>
       <div id="payment-module-container">
         <!-- Rendered by ActivePaymentProvider in js/checkout.js -->
       </div>
     </section>
     ```
   - Lines 168–174: Submit button is hardcoded:
     ```html
     <button type="submit" class="btn-primary-action" style="padding: 16px; font-size: 1rem;">
       Confirm & Register Pre-Order Allocation &rarr;
     </button>
     ```
   - Lines 179–208: Sidebar order summary contains Total Units (`#checkout-items-count`), Selected Shipping (`#checkout-shipping-tier-label`), Freight & Handling (`#checkout-shipping-rate-label`), and Payable at Dispatch (`#checkout-total-payable` showing static `"Price: [TBC]"`). There is no line-item subtotal or grand total calculation element.
   - Lines 224–228: External Paystack Inline script is completely absent:
     ```html
     <script src="js/products-data.js"></script>
     <script src="js/shipping-config.js"></script>
     <script src="js/currency-service.js"></script>
     <script src="js/cart.js"></script>
     <script src="js/checkout.js"></script>
     ```
     `<script src="https://js.paystack.co/v1/inline.js"></script>` is missing.

2. **`js/checkout.js`** (`file:///c:/Users/cutef/Downloads/My%20Projects/Kabod%20Crest/js/checkout.js`):
   - Lines 53–73: Contains only a commented-out conceptual skeleton for `PaystackPaymentProvider`:
     ```javascript
     /**
      * SWAP-IN POINT FOR PAYSTACK / FLUTTERWAVE:
      * To activate live card/online payment in the future without altering checkout:
      *
      * class PaystackPaymentProvider { ... }
      */
     ```
   - Lines 75–114: `ManualPaymentProvider` is implemented as the sole, hardcoded class. Its `processPayment(orderData, onSuccess)` immediately returns `{ status: 'success', method: 'manual_transfer' }`.
   - Line 117: Hardcoded singleton instance without any selector or toggling logic:
     ```javascript
     const ActivePaymentProvider = new ManualPaymentProvider();
     ```
   - Lines 185–187: Single render call on load:
     ```javascript
     if (paymentContainer) {
       ActivePaymentProvider.renderUI(paymentContainer, { items: cartItems });
     }
     ```
   - Lines 295–309: Order reference generation and order object assembly:
     ```javascript
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
     ```
     Notice: Numerical subtotal, shipping fee, grand total, payment method (`paystack` vs `manual_bank_transfer`), payment status, and payment transaction metadata are NOT stored in `orderData`.
   - Lines 311–323: Order persistence and redirect:
     ```javascript
     ActivePaymentProvider.processPayment(orderData, (res) => {
       localStorage.setItem('kabod_pending_order', JSON.stringify(orderData));
       if (window.KabodCart) {
         window.KabodCart.clear();
       }
       window.location.href = `order-confirmation.html?ref=${orderRef}`;
     });
     ```
     Notice: `localStorage.setItem('kabod_order_history', ...)` is completely absent! Orders are only saved to `kabod_pending_order`.

3. **`order-confirmation.html`** (`file:///c:/Users/cutef/Downloads/My%20Projects/Kabod%20Crest/order-confirmation.html`):
   - Line 67: Reference element `<div class="order-ref-num" id="conf-order-ref">KC-2026-XXXX</div>`.
   - Lines 105–120: Item breakdown table contains column headers for Product & Spec, Quantity, and Billing Rate, but completely lacks rows or footers for **Subtotal**, **Shipping Freight**, and **Grand Total**.
   - Lines 123–150: Bank Remittance Details box is statically hardcoded in HTML with dummy placeholders (`"[Designated Bank to be inserted by Treasury Desk]"`), meaning it appears identically even if an order was paid online via Paystack.
   - Lines 221–226: Scripts loaded are Lenis, GSAP, ScrollTrigger, site-motion, and `js/order-confirmation.js`. `js/currency-service.js` is not loaded.

4. **`js/order-confirmation.js`** (`file:///c:/Users/cutef/Downloads/My%20Projects/Kabod%20Crest/js/order-confirmation.js`):
   - Lines 18–25: Retrieves order only from `kabod_pending_order`:
     ```javascript
     let order = null;
     try {
       const raw = localStorage.getItem('kabod_pending_order');
       if (raw) order = JSON.parse(raw);
     } catch (err) {
       console.warn('Unable to read pending order', err);
     }
     ```
   - Lines 27–54: Direct fallback to mock data when `!order`:
     ```javascript
     if (!order) {
       const urlParams = new URLSearchParams(window.location.search);
       const ref = urlParams.get('ref') || 'KC-2026-7319';
       order = {
         orderRef: ref,
         createdAt: new Date().toISOString(),
         customer: { name: "Valued Client", ... },
         items: [
           { name: "Dehydrated Ugwu", weight: "500g", quantity: 2, priceDisplay: "Price: [TBC]" },
           { name: "Kulikuli", weight: "1.5kg", quantity: 1, priceDisplay: "Price: [TBC]" }
         ],
         ...
       };
     }
     ```
     Critical Flaw:
     - It does NOT check `kabod_order_history`.
     - It does NOT verify that `order.orderRef` matches the URL query parameter `?ref=KC-2026-XXXX`. If `kabod_pending_order` exists, it displays that pending order regardless of the URL ref!
     - If `kabod_pending_order` is cleared or missing, it falls back to hardcoded demo data even if the requested order exists in browser history.
     - There is no rendering of financial figures (subtotal, shipping rate, grand total).
     - There is no payment status distinction (Paystack online payment badge vs Manual bank remittance instructions).

5. **`js/shipping-config.js`** (`file:///c:/Users/cutef/Downloads/My%20Projects/Kabod%20Crest/js/shipping-config.js`):
   - Lines 7–35: Rates are currently unconfigured placeholders (`rateAmount: null`, `rateText: "Flat rate [TBC]"`). R2 specifies: Lagos = ₦2,500, Rest of Nigeria = ₦4,500, International Air = [TBC Quote].

6. **Repository Test Infrastructure**:
   - Commands executed: `node -v` (Node v22.19.0), `npm list --depth=0` (only `gsap` and `lenis`).
   - Ripgrep search for test frameworks (`describe`, `assert`, `test`): 0 matches.
   - There are currently **0 test files** in the codebase.

---

## 2. Logic Chain

From the direct observations, the following causal logic chain is established:

1. **Payment Gateway Gap (R3)**:
   - *Premise*: Acceptance Criteria specifies: "The customer can toggle between Paystack Online Payment and Manual Bank Transfer on checkout.html." Submitting via Paystack should launch Paystack Inline Popup JS for immediate settlement.
   - *Observation*: `checkout.html` has no selector UI and does not include `inline.js`. `js/checkout.js` has only a commented-out stub for Paystack and hardcodes `ManualPaymentProvider`.
   - *Inference*: The payment bridge is entirely non-functional for online card/USSD payments. Customers are forced into a placeholder manual transfer flow.
   - *Required Action*:
     a. Include `<script src="https://js.paystack.co/v1/inline.js"></script>` in `checkout.html`.
     b. Provide an interactive payment method selector (Radio/Option Cards) with options for "Paystack Online Payment" and "Manual Corporate Bank Transfer".
     c. Implement live `PaystackPaymentProvider` that computes `amountInKobo = Math.round(grandTotal * 100)`, initializes `PaystackPop.setup({...})` with customer email, reference, currency (`NGN`), and handles `callback(response)` and `onClose()`.
     d. Implement structured `ManualPaymentProvider` that produces official settlement bank instructions (Beneficiary: Kabod Crest Limited, Bank Institution: Zenith Bank PLC, Account Number, Reference: `orderRef`).
     e. Provide graceful degradation / dev test mock mode if `PaystackPop` is unavailable (e.g., offline or automated headless test).

2. **Durable Order History Gap (R5)**:
   - *Premise*: Requirement R5 requires saving completed orders to `kabod_order_history` in `localStorage` in addition to `kabod_pending_order`, ensuring `order-confirmation.html` can retrieve and render any historical or active order by `?ref=KC-2026-XXXX` without losing state on reload.
   - *Observation*: `js/checkout.js` line 313 writes ONLY to `kabod_pending_order`. `order-confirmation.js` line 21 reads ONLY from `kabod_pending_order`.
   - *Inference*: If a customer places an order, then clears storage, or reloads an old confirmation link (`?ref=KC-2026-XXXX`), or opens multiple orders in separate tabs, the order data is either overwritten or completely lost, displaying the mock "Valued Client" fallback.
   - *Required Action*:
     a. In `js/checkout.js`, implement `saveOrderToHistory(orderData)`: retrieve array from `kabod_order_history`, unshift/upsert new `orderData`, and write back to `localStorage.setItem('kabod_order_history', JSON.stringify(history))`, while also updating `kabod_pending_order`.
     b. In `js/order-confirmation.js`, implement `lookupOrder(ref)`: parse `?ref=` parameter from URL. Search `kabod_order_history` array for matching `orderRef`. If not found, check `kabod_pending_order` if `orderRef` matches. If no ref in URL, take `kabod_pending_order` or latest from history.

3. **Receipt Financial Breakdown Gap (R5)**:
   - *Premise*: Acceptance Criteria states: "Reloading order-confirmation.html?ref=... accurately displays the stored order details, customer name, delivery address, shipping tier, itemized list, and grand total."
   - *Observation*: `order-confirmation.html` lacks table footers or summary elements for Subtotal, Shipping Fee, and Grand Total. `orderData` saved in `checkout.js` lacks calculated numeric totals.
   - *Inference*: Even if the order is retrieved, the confirmation receipt does not display the subtotal, shipping freight, and grand total required by the acceptance criteria.
   - *Required Action*:
     a. Include `subtotal`, `shippingFee`, `grandTotal`, `formattedSubtotal`, `formattedShipping`, `formattedGrandTotal`, `paymentMethod`, and `paymentStatus` in `orderData`.
     b. Update `order-confirmation.html` itemized table to include Subtotal, Delivery Freight, and Grand Total summary rows.
     c. In `js/order-confirmation.js`, dynamically render these financial totals and adapt the payment section: show verified Paystack payment badge and transaction reference if paid online; show bank remittance coordinates if manual corporate transfer.

---

## 3. Caveats

1. **Paystack Live Public Key**:
   - In production, a real Paystack public key (`pk_live_...` or `pk_test_...`) is supplied. The implementation should allow configuration via `window.KABOD_PAYSTACK_KEY` with a clean fallback to a test key (`pk_test_kabod_crest_demo_key`).
   - For offline development, automated unit tests, and CI/CD environments where `https://js.paystack.co/v1/inline.js` cannot be fetched from the internet, the payment provider must check `typeof PaystackPop !== 'undefined'` and supply a mock fallback simulator so automated tests do not crash.
2. **Cart Pricing Dependency (R1 & R2 overlap)**:
   - The Paystack gateway calculation directly depends on the numeric grand total from R1 (live product prices: Dehydrated Ugwu at ₦2,850, etc.) and R2 (Lagos shipping at ₦2,500, Rest of Nigeria at ₦4,500). If items are pure pre-orders ([TBC]), Paystack cannot charge ₦0; the UI must gracefully steer the user to Manual Corporate Bank Transfer / Commercial Pro-forma Invoice mode.
3. **Storage Quota & Privacy**:
   - `localStorage` is scoped per origin and domain. `kabod_order_history` will store user orders locally in the browser. A cap (e.g. latest 50 orders) prevents localStorage quota overflow.

---

## 4. Conclusion & Recommended Architecture

### A. Order Record Schema
The standardized `OrderRecord` stored in both `kabod_pending_order` and `kabod_order_history` must follow:

```json
{
  "orderRef": "KC-2026-4829",
  "createdAt": "2026-09-21T04:00:00.000Z",
  "customer": {
    "name": "Olufunmi Adeleke",
    "email": "adeleke@example.com",
    "phone": "+234 803 000 0000"
  },
  "delivery": {
    "country": "Nigeria",
    "state": "Lagos",
    "city": "Ikeja",
    "address": "14 Admiralty Way, Lekki Phase 1",
    "postalCode": "101233",
    "notes": ""
  },
  "shippingTier": {
    "id": "lagos",
    "name": "Lagos Delivery (Mainland & Island)",
    "rateText": "₦2,500",
    "rateAmount": 2500,
    "isTBC": false
  },
  "items": [
    {
      "id": "dehydrated-ugwu",
      "name": "Dehydrated Ugwu",
      "weight": "250g",
      "price": 2850,
      "priceDisplay": "₦2,850",
      "quantity": 2,
      "isPreOrder": false,
      "lineTotal": 5700
    }
  ],
  "totalCount": 2,
  "subtotal": 5700,
  "shippingFee": 2500,
  "grandTotal": 8200,
  "amountInKobo": 820000,
  "paymentMethod": "paystack",
  "paymentStatus": "paid",
  "paymentDetails": {
    "gateway": "paystack",
    "paystackReference": "KC-2026-4829_1726891200000",
    "transactionId": "trx_9823182",
    "paidAt": "2026-09-21T04:02:15.000Z",
    "amountPaid": 8200
  }
}
```

For Manual Bank Transfer orders:
```json
{
  "paymentMethod": "manual_bank_transfer",
  "paymentStatus": "pending_invoice",
  "paymentDetails": {
    "methodTitle": "Manual Corporate Bank Transfer",
    "beneficiary": "Kabod Crest Limited",
    "bank": "Zenith Bank PLC",
    "accountNumber": "1018293847",
    "currency": "NGN",
    "remittanceInstruction": "Please quote Order Reference on your remittance narration."
  }
}
```

### B. Implementation Plan for Implementer Agents:
1. **`checkout.html`**:
   - Add `<script src="https://js.paystack.co/v1/inline.js"></script>`.
   - Add payment method selector cards in Section 4:
     - Option A: Paystack Online Payment (Card / USSD / Bank Transfer)
     - Option B: Manual Corporate Bank Transfer (Invoice & Wire Remittance)
   - Add dynamic details container below selector.
   - Update submit button to be dynamically labeled based on active payment option and grand total.
2. **`js/checkout.js`**:
   - Implement active payment selection state (`selectedPaymentMethod = 'paystack' | 'manual'`).
   - Implement `PaystackPaymentProvider`:
     - Calculate `amountInKobo = Math.round(grandTotal * 100)`.
     - Invoke `PaystackPop.setup({...})`.
     - Attach `callback` to finalize order with `paymentStatus = 'paid'` and Paystack reference.
     - Attach `onClose` to display user notification without submitting or clearing form.
   - Implement `ManualPaymentProvider`:
     - Render official bank coordinates (Beneficiary: Kabod Crest Limited, Zenith Bank PLC, Corporate Account #, Narrative: Order Ref).
     - Finalize order with `paymentStatus = 'pending_invoice'`.
   - Implement order persistence:
     - Generate `orderRef` as `KC-2026-XXXX`.
     - Save to `kabod_order_history` (array) AND `kabod_pending_order` in `localStorage`.
     - Clear cart only upon verified payment / completed submission.
     - Redirect to `order-confirmation.html?ref=${orderRef}`.
3. **`order-confirmation.html` & `js/order-confirmation.js`**:
   - Add Grand Total, Subtotal, and Shipping Fee summary rows to the confirmation table.
   - Retrieve order by matching URL `?ref=` against `kabod_order_history`, then `kabod_pending_order`.
   - Ensure refreshing the page reloads the exact stored order record without state degradation.
   - Conditionally render receipt payment box:
     - If Paystack: render green badge "Paid Online via Paystack", payment reference, date/time, amount.
     - If Manual: render official settlement bank remittance instructions and invoice schedule.

---

## 5. Verification Method

To independently verify these findings and subsequent implementation:

### 1. Automated Unit & Integration Tests (Built-in `node:test`)
Run the test suite using Node.js built-in test runner:
```bash
node --test test/payment-bridge.test.js test/order-persistence.test.js
```
The test suite will verify:
- Order reference generator regex: `/^KC-2026-\d{4}$/`.
- Dual persistence: saving order persists to both `kabod_pending_order` and `kabod_order_history`.
- History retrieval: query by `?ref=KC-2026-XXXX` finds historical order even if `kabod_pending_order` is missing or overwritten.
- Paystack setup options: `amountInKobo` matches `grandTotal * 100`, email, reference, and currency `NGN`.
- Manual bank transfer flow: populates settlement bank coordinates and sets `paymentStatus = 'pending_invoice'`.

### 2. Manual Browser Flow Verification:
1. Start dev server: `node server.js`
2. Open `http://127.0.0.1:3030/shop.html`, add Dehydrated Ugwu (₦2,850 x 2).
3. Proceed to `http://127.0.0.1:3030/checkout.html`:
   - Verify payment selector displays both "Paystack Online Payment" and "Manual Corporate Bank Transfer".
   - Toggle between payment modes and verify UI updates.
   - Select Manual Corporate Bank Transfer, fill valid customer details and Lagos shipping.
   - Submit form: verify redirect to `order-confirmation.html?ref=KC-2026-XXXX`.
4. Inspect `localStorage` via browser console:
   - Verify `localStorage.getItem('kabod_order_history')` contains array with the newly created order.
   - Verify `subtotal = 5700`, `shippingFee = 2500`, `grandTotal = 8200`.
5. Refresh `order-confirmation.html?ref=KC-2026-XXXX`:
   - Verify all details (name, address, itemized rows, subtotal ₦5,700, shipping ₦2,500, grand total ₦8,200) render completely and identically.
   - Clear `kabod_pending_order` in console (`localStorage.removeItem('kabod_pending_order')`) and reload: verify order still renders from `kabod_order_history` without falling back to mock data.

### 3. Invalidation Conditions:
- If `order-confirmation.html?ref=KC-2026-XXXX` fails to load stored data after clearing `kabod_pending_order`, R5 is invalidated.
- If Paystack Online Payment option cannot be selected or does not compute correct Kobo amount, R3 is invalidated.
- If Grand Total is missing from `order-confirmation.html`, Acceptance Criteria line 51 is invalidated.
