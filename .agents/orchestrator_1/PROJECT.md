# Project: Kabod Crest P0 Launch Blockers

## Architecture
Kabod Crest is an e-commerce platform for premium dry-chain agro-commodities. The frontend operates via vanilla ES6 modules/scripts with `localStorage` persistence, reactive CustomEvents (`kabod:cart-updated`), and responsive DOM controllers.

### Core Modules & Data Flow
1. **Catalog & Pricing Engine (`js/products-data.js`, `js/cart.js`, `js/currency-service.js`)**:
   - `KABOD_PRODUCTS`: Central catalog defining product IDs, names, unit weights, numerical prices (`NGN`), and display strings.
   - `CartStore` (`window.KabodCart`): Central singleton managing cart items in `localStorage` (`kabod_crest_cart_v1`). Dispatches `kabod:cart-updated`.
   - `KabodPricing`: Pricing engine providing `formatNaira(amount)`, `calculateCartTotals(items)`, `calculateOrderTotals(items, shippingTier)`.
2. **Shipping & Freight Engine (`js/shipping-config.js`)**:
   - `KABOD_SHIPPING_CONFIG`: Defines active shipping tiers (Lagos ₦2,500, Rest of Nigeria ₦4,500, International Air Cargo [TBC prior to dispatch]).
   - Auto-selects tier based on destination country and Nigerian state.
3. **Form Validation & Sanitization Engine (`js/form-validator.js` / `js/checkout.js`)**:
   - Sanitizes text inputs (XSS protection).
   - Validates Nigerian local (`080...`), Nigerian international (`+234...`), and E.164 international phone formats.
   - Validates email syntax.
   - Enforces required delivery fields with accessible ARIA error states.
4. **Dual-Mode Payment Bridge (`js/checkout.js`)**:
   - Option A: Paystack Inline Popup JS (`PaystackPop.setup`) for immediate live payments in Kobo (`amountInKobo = grandTotal * 100`).
   - Option B: Manual Corporate Bank Transfer provider for pre-orders and B2B invoices.
5. **Persistence & Receipt Engine (`js/checkout.js`, `js/order-confirmation.js`)**:
   - Standardized `OrderRecord` stored to both `kabod_order_history` (array) and `kabod_pending_order` (current order).
   - Order confirmation retrieves order by URL parameter `?ref=KC-2026-XXXX` from history, rendering full financial breakdowns and payment status.

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Product Catalog Pricing Sync | Set Dehydrated Ugwu to ₦2,850, Ginger to ₦2,400, Jollof Spice to ₦2,200/TBC, handle slug aliases | M1 | ORIGINAL_REQUEST §R1 |
| F2 | Cart Subtotal & Line Total Engine | Add `formatNaira`, `calculateCartTotals`, compute `price * quantity`, attach to `kabod:cart-updated` | M1 | ORIGINAL_REQUEST §R1 |
| F3 | Cart Drawer Subtotal UI & Line Totals | Add subtotal element to drawer footer; render line-item totals in drawer items | M1 | ORIGINAL_REQUEST §R1 |
| F4 | Mixed Cart Pricing Logic | Display live subtotal while appending `+ [TBC items]` without numeric calculation breaking | M1 | ORIGINAL_REQUEST §R1 |
| F5 | Cart Page Dynamic Subtotal & Totals | Update `cart.html` summary box and line items to reflect live totals | M1 | ORIGINAL_REQUEST §R1 |
| F6 | Active Courier Freight Configuration | Set Lagos to ₦2,500, Rest of Nigeria to ₦4,500, International to `[TBC prior to dispatch]` | M2 | ORIGINAL_REQUEST §R2 |
| F7 | Destination State/Country Auto-Detection | Auto-select Lagos vs Rest of Nigeria vs International on country/state change | M2 | ORIGINAL_REQUEST §R2 |
| F8 | Checkout Subtotal & Grand Total Display | Add subtotal row in checkout summary; auto-calculate `subtotal + freight = grand total` | M2 | ORIGINAL_REQUEST §R2 |
| F9 | Client-Side Phone Validation | Validate Nigerian 11-digit (`080...`), international (`+234...`), and E.164 formats | M3 | ORIGINAL_REQUEST §R4 |
| F10 | Client-Side Email Validation | Validate email syntax (RFC 5322 & TLD minimum 2 chars) | M3 | ORIGINAL_REQUEST §R4 |
| F11 | Required Fields & Text Sanitization | Enforce address, city, state, country; strip HTML/XSS characters | M3 | ORIGINAL_REQUEST §R4 |
| F12 | Accessible Visual Error Presentation | Apply `.is-invalid`, `.field-error-msg`, ARIA attributes, block invalid submissions | M3 | ORIGINAL_REQUEST §R4 |
| F13 | Payment Method Selector UI | Add interactive radio cards for Paystack vs Manual Bank Transfer in `checkout.html` | M4 | ORIGINAL_REQUEST §R3 |
| F14 | Paystack Inline Gateway Integration | Load `inline.js`, initialize `PaystackPop`, convert grand total to Kobo, handle callbacks | M4 | ORIGINAL_REQUEST §R3 |
| F15 | Manual Bank Transfer Settlement Provider | Display corporate Zenith Bank details, reference orderRef, handle invoice workflow | M4 | ORIGINAL_REQUEST §R3 |
| F16 | Durable Order History Persistence | Generate `KC-2026-XXXX` and persist order to `kabod_order_history` array AND `kabod_pending_order` | M5 | ORIGINAL_REQUEST §R5 |
| F17 | Order Confirmation Ref Retrieval | Parse `?ref=` and lookup from `kabod_order_history` first, surviving reloads and cleared pending orders | M5 | ORIGINAL_REQUEST §R5 |
| F18 | Order Confirmation Financial Receipt | Render itemized line totals, subtotal, shipping freight, grand total, and payment status badge | M5 | ORIGINAL_REQUEST §R5 |
| F19 | End-to-End Test Suite Verification | Pass 100% of E2E tests (Tiers 1-4) and adversarial coverage hardening (Tier 5) | M6 | ORIGINAL_REQUEST §Acceptance |

---

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Dynamic Cart & Catalog Pricing Engine | F1, F2, F3, F4, F5 | none | PLANNED |
| M2 | Courier Freight Integration & Checkout Totals | F6, F7, F8 | M1 | PLANNED |
| M3 | Checkout Form Validation & Accessible Errors | F9, F10, F11, F12 | none | PLANNED |
| M4 | Dual-Mode Payment Bridge (Paystack + Bank Transfer) | F13, F14, F15 | M1, M2, M3 | PLANNED |
| M5 | Durable Order History & Confirmation Receipt | F16, F17, F18 | M4 | PLANNED |
| M6 | Final Milestone: Full E2E & Adversarial Verification | F19 (Tiers 1-5) | M1, M2, M3, M4, M5, TEST_READY.md | PLANNED |

---

## Interface Contracts

### 1. `KabodPricing` (`js/cart.js` or `js/pricing-engine.js`)
```javascript
formatNaira(amount: number): string
calculateCartTotals(items: Array<CartItem>): {
  items: Array<CalculatedItem>,
  totalCount: number,
  pricedSubtotal: number,
  tbcCount: number,
  hasPriced: boolean,
  hasTbc: boolean,
  isMixed: boolean,
  formattedSubtotal: string,
  formattedSummaryTotal: string
}
```

### 2. `KABOD_SHIPPING_CONFIG` (`js/shipping-config.js`)
```javascript
tiers: [
  { id: "lagos", name: "Lagos Delivery (Mainland & Island)", rateAmount: 2500, rateText: "₦2,500", isTBC: false },
  { id: "rest-of-nigeria", name: "Rest of Nigeria (35 States & FCT)", rateAmount: 4500, rateText: "₦4,500", isTBC: false },
  { id: "international-air", name: "International Freight (UK, US, Canada, AU, Worldwide)", rateAmount: null, rateText: "[TBC prior to dispatch]", isTBC: true }
]
getTierById(tierId: string): ShippingTier
getTierForDestination(country: string, state: string): ShippingTier
```

### 3. `KabodValidator` (`js/checkout.js` or `js/form-validator.js`)
```javascript
validatePhone(phone: string, country?: string): { valid: boolean, sanitized?: string, message?: string }
validateEmail(email: string): { valid: boolean, sanitized?: string, message?: string }
validateRequired(value: string, fieldName: string, minLength?: number): { valid: boolean, sanitized?: string, message?: string }
sanitizeText(input: string): string
```

### 4. `OrderRecord` Schema (`localStorage.getItem('kabod_order_history')`)
```typescript
interface OrderRecord {
  orderRef: string; // Format: /^KC-2026-\d{4}$/
  createdAt: string; // ISO 8601
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  delivery: {
    country: string;
    state: string;
    city: string;
    address: string;
    postalCode?: string;
    notes?: string;
  };
  shippingTier: {
    id: string;
    name: string;
    rateAmount: number | null;
    rateText: string;
    isTBC: boolean;
  };
  items: Array<{
    id: string;
    name: string;
    weight: string;
    price: number | null;
    priceDisplay: string;
    quantity: number;
    lineTotal: number | null;
    lineTotalDisplay: string;
    isPreOrder: boolean;
  }>;
  totalCount: number;
  subtotal: number;
  shippingFee: number | null;
  grandTotal: number | null;
  formattedSubtotal: string;
  formattedShipping: string;
  formattedGrandTotal: string;
  paymentMethod: 'paystack' | 'manual_bank_transfer';
  paymentStatus: 'paid' | 'pending_invoice';
  paymentDetails: Record<string, any>;
}
```

---

## Code Layout & File Boundaries
| File Path | Exclusive Owner Milestone | Description |
|---|---|---|
| `js/products-data.js` | Milestone 1 | Product catalog pricing data & aliases |
| `js/cart.js` | Milestone 1 | CartStore, pricing engine, drawer rendering |
| `cart.html` | Milestone 1 | Cart page markup, drawer footer, summary box |
| `index.html`, `shop.html`, `product-detail.html`, etc. | Milestone 1 | Cart drawer subtotal footer markup |
| `js/shipping-config.js` | Milestone 2 | Freight rates, tier helpers |
| `css/base.css` or `css/cart.css` | Milestone 3 | `.is-invalid`, `.field-error-msg` error styles |
| `checkout.html` | Milestones 2, 3, 4 | Checkout markup, summary subtotal, payment selector, error spans |
| `js/checkout.js` | Milestones 2, 3, 4, 5 | Form validation, checkout totals, Paystack/Manual provider, order persistence |
| `order-confirmation.html` | Milestone 5 | Confirmation receipt layout & financial summary table |
| `js/order-confirmation.js` | Milestone 5 | History lookup by `?ref=`, dynamic rendering |
| `tests/*` | E2E Testing Track | Automated unit, integration, and E2E tests |
