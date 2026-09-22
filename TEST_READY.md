# TEST_READY: Kabod Crest E2E & Unit Test Suite

Published by: `teamwork_preview_test_writer`
Date: 2026-09-21T03:20:00Z
Integrity Mode: Development / TDD Baseline

---

## Test Execution Command
To run all tests across all suites:
```bash
node --test tests/**/*.test.js
```

To run individual test suites:
```bash
node --test tests/unit/pricing-engine.test.js
node --test tests/unit/shipping-freight.test.js
node --test tests/unit/form-validator.test.js
node --test tests/unit/payment-order.test.js
node --test tests/e2e/e2e-workflow.test.js
```

---

## Suite Summary & Current Status
- **Test Runner**: Node.js v22 built-in `node:test` and `node:assert/strict`
- **External Test Dependencies**: 0 (Zero external dependencies)
- **Total Test Files**: 5
- **Total Suites**: 32
- **Total Test Cases**: 239
- **Passing Tests**: 199
- **Pending / Failing Tests**: 40 (Anticipating M2 and M3 implementation by worker agents)
- **Harness Execution Status**: 100% syntactically sound, verified executable in ~2.1s

---

## Feature Matrix & Coverage Breakdown

| Feature ID | Feature Name | Primary Test Suite | Tier 1 (Reqs) | Tier 2 (Boundary) | Tier 3 (Pairwise) | Tier 4 (E2E) | Tier 5 (Adversarial) | Current Status |
|:----------:|:-------------|:-------------------|:-------------:|:-----------------:|:-----------------:|:------------:|:--------------------:|:--------------:|
| **F1** | Product Catalog Pricing Sync | `pricing-engine.test.js` | 5 | 5 | ✓ | Scenario 1, 2, 3 | Adv 2 | **PASSED (Verified post-M1)** |
| **F2** | Cart Subtotal & Line Total Engine | `pricing-engine.test.js` | 5 | 5 | ✓ | Scenario 1, 3 | Adv 2 | **PASSED (Verified post-M1)** |
| **F3** | Cart Drawer Subtotal UI & Line Totals | `pricing-engine.test.js` | 5 | 5 | ✓ | - | - | **PASSED (Verified post-M1)** |
| **F4** | Mixed Cart Pricing Logic | `pricing-engine.test.js` | 5 | 5 | ✓ | Scenario 2, 3 | Adv 2 | **PASSED (Verified post-M1)** |
| **F5** | Cart Page Dynamic Subtotal & Totals | `pricing-engine.test.js` | 5 | 5 | ✓ | - | Adv 2 | **PASSED (Verified post-M1)** |
| **F6** | Active Courier Freight Configuration | `shipping-freight.test.js` | 5 | 5 | ✓ | Scenario 1, 2, 3 | - | Pending M2 (3 failing) |
| **F7** | Destination State/Country Auto-Detection | `shipping-freight.test.js` | 5 | 5 | ✓ | Scenario 1, 2, 3 | - | Pending M2 (5 failing) |
| **F8** | Checkout Subtotal & Grand Total Display | `shipping-freight.test.js` | 5 | 5 | ✓ | Scenario 1, 2, 3 | Adv 2 | Pending M2 (2 failing) |
| **F9** | Client-Side Phone Validation | `form-validator.test.js` | 5 | 5 | ✓ | Scenario 1, 5 | Adv 5 | Pending M3 (7 failing) |
| **F10** | Client-Side Email Validation | `form-validator.test.js` | 5 | 5 | ✓ | Scenario 1, 5 | - | Pending M3 (7 failing) |
| **F11** | Required Fields & Text Sanitization | `form-validator.test.js` | 5 | 5 | ✓ | Scenario 1, 5 | Adv 1 | Pending M3 (10 failing) |
| **F12** | Accessible Visual Error Presentation | `form-validator.test.js` | 5 | 5 | ✓ | Scenario 5 | - | Pending M3 (6 failing) |
| **F13** | Payment Method Selector UI | `payment-order.test.js` | 5 | 5 | ✓ | Scenario 1, 2, 3 | - | **PASSED (Verified)** |
| **F14** | Paystack Inline Gateway Integration | `payment-order.test.js` | 5 | 5 | ✓ | Scenario 1 | - | **PASSED (Verified)** |
| **F15** | Manual Bank Transfer Settlement Provider | `payment-order.test.js` | 5 | 5 | ✓ | Scenario 2, 3 | - | **PASSED (Verified)** |
| **F16** | Durable Order History Persistence | `payment-order.test.js` | 5 | 5 | ✓ | Scenario 1, 2, 3, 4 | Adv 3, 4 | **PASSED (Verified)** |
| **F17** | Order Confirmation Ref Retrieval | `payment-order.test.js` | 5 | 5 | ✓ | Scenario 1, 4 | - | **PASSED (Verified)** |
| **F18** | Order Confirmation Financial Receipt | `payment-order.test.js` | 5 | 5 | ✓ | Scenario 1, 4 | Adv 1 | **PASSED (Verified)** |

---

## Test Suites Catalog

### 1. `tests/unit/pricing-engine.test.js`
- **Scope**: Catalog prices, `KabodPricing` engine, `formatNaira`, line item computations, cart drawer footer updates, mixed cart pricing (`isMixed`, `tbcCount`, `formattedSummaryTotal`), and cart page reactivity.
- **Coverage**: 66 tests.
- **Tiers**: Tier 1 (25 tests), Tier 2 (25 tests), Tier 3 (16 pairwise tests).

### 2. `tests/unit/shipping-freight.test.js`
- **Scope**: Shipping freight tiers (Lagos ₦2,500, Rest of Nigeria ₦4,500, International [TBC prior to dispatch]), `getTierById`, `getTierForDestination`, dynamic state/country detection, grand total arithmetic (`subtotal + freight`).
- **Coverage**: 45 tests.
- **Tiers**: Tier 1 (15 tests), Tier 2 (15 tests), Tier 3 (15 pairwise tests).

### 3. `tests/unit/form-validator.test.js`
- **Scope**: Nigerian phone numbers (11-digit local `080...`, international `+234...`), international E.164 (`+44...`, `+1...`), email syntax RFC validation, required text fields, XSS HTML tag stripping in `sanitizeText`, accessible `.is-invalid` and `aria-invalid` states.
- **Coverage**: 46 tests.
- **Tiers**: Tier 1 (20 tests), Tier 2 (20 tests), Tier 3 (6 pairwise permutations).

### 4. `tests/unit/payment-order.test.js`
- **Scope**: Paystack Inline popup configuration, Kobo calculation (`grandTotal * 100`), manual bank transfer invoice provider with corporate Zenith Bank settlement details, `orderRef` generation (`KC-2026-XXXX`), dual persistence in `kabod_pending_order` and `kabod_order_history`, historical order lookup by `?ref=`.
- **Coverage**: 72 tests.
- **Tiers**: Tier 1 (30 tests), Tier 2 (30 tests), Tier 3 (12 pairwise combinations).

### 5. `tests/e2e/e2e-workflow.test.js`
- **Scope**: End-to-end full customer journeys simulating cart, checkout form submission, payment dispatch, storage persistence, and order receipt rendering.
- **Coverage**: 10 tests.
- **Tiers**:
  - **Tier 4 (Real-World Scenarios)**:
    1. Standard Live Checkout (Lagos Delivery via Paystack)
    2. Regional Pre-Order / B2B Allocation (Abuja Rest of Nigeria Bank Transfer)
    3. Mixed Cart with International Air Cargo (UK delivery with TBC quote)
    4. Reloading Past Historical Order from URL Reference after Storage Clear
    5. Validation Error Recovery and Successful Submission
  - **Tier 5 (Adversarial Hardening)**:
    1. XSS injection neutralization in name and delivery address
    2. Extreme cart quantity (5,000 units) overflow resilience
    3. Corrupted JSON storage error recovery
    4. High entropy order reference uniqueness (1,000 generated samples)
    5. SQL / Command injection strings in phone field

### 6. `tests/helpers/browser-mock.js`
- **Scope**: Lightweight browser emulation sandbox providing `window`, `document`, `localStorage`, `CustomEvent`, `DOMElement`, and `vm.createContext` script loader, enabling browser scripts to run natively inside Node.js test runner.

---

## Escalations & Implementation Gaps (For Milestone Workers)
The following gaps in existing code are highlighted by the failing baseline tests and must be resolved by respective milestone owners:
1. **Milestone 1 (`worker_m1`)**:
   - In `js/products-data.js`: Update Jollof Spice price to ₦2,200 (`price: 2200`, `priceDisplay: '₦2,200'`). Ensure Dehydrated Ugwu is ₦2,850 and Ginger is ₦2,400.
   - In `js/cart.js`: Implement `window.KabodPricing` with `formatNaira(amount)` and `calculateCartTotals(items)`. Ensure mixed cart logic sets `isMixed`, `hasPriced`, `hasTbc`, `tbcCount`, and appends `+ [TBC items]` without `NaN`.
2. **Milestone 2 (Courier Freight Integration)**:
   - In `js/shipping-config.js`: Set `rateAmount: 2500` for `lagos`, `rateAmount: 4500` for `rest-of-nigeria`, and `rateAmount: null` for `international-air`.
   - Add helper methods `getTierById(tierId)` and `getTierForDestination(country, state)` to `KABOD_SHIPPING_CONFIG`.
3. **Milestone 3 (Form Validation)**:
   - In `js/checkout.js` (or `js/form-validator.js`): Expose `window.KabodValidator` with `validatePhone`, `validateEmail`, `validateRequired`, and `sanitizeText`.
   - Enforce form submission prevention when fields are invalid and wire `.is-invalid` / `aria-invalid="true"`.
