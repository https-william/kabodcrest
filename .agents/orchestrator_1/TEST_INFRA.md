# E2E Test Infra: Kabod Crest

## Test Philosophy
- Opaque-box, requirement-driven. Derived from `ORIGINAL_REQUEST.md`, not internal code specifics.
- Methodology: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Combinatorial + Real-World Workload Testing.
- Zero external test dependencies: Executed natively via Node.js v22 built-in `node:test` and `node:assert`.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| F1 | Product Catalog Pricing Sync | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| F2 | Cart Subtotal & Line Total Engine | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| F3 | Cart Drawer Subtotal UI & Line Totals | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| F4 | Mixed Cart Pricing Logic | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| F5 | Cart Page Dynamic Subtotal & Totals | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| F6 | Active Courier Freight Configuration | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| F7 | Destination State/Country Auto-Detection | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| F8 | Checkout Subtotal & Grand Total Display | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| F9 | Client-Side Phone Validation | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ |
| F10 | Client-Side Email Validation | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ |
| F11 | Required Fields & Text Sanitization | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ |
| F12 | Accessible Visual Error Presentation | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ |
| F13 | Payment Method Selector UI | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |
| F14 | Paystack Inline Gateway Integration | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |
| F15 | Manual Bank Transfer Settlement Provider | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |
| F16 | Durable Order History Persistence | ORIGINAL_REQUEST §R5 | 5 | 5 | ✓ |
| F17 | Order Confirmation Ref Retrieval | ORIGINAL_REQUEST §R5 | 5 | 5 | ✓ |
| F18 | Order Confirmation Financial Receipt | ORIGINAL_REQUEST §R5 | 5 | 5 | ✓ |

## Test Architecture
- Test runner: `node --test tests/**/*.test.js`
- Pass/fail semantics: Process exit code 0 on all tests pass.
- Test suites:
  - `tests/unit/pricing-engine.test.js`: Pricing, cart totals, mixed carts, currency formatting.
  - `tests/unit/shipping-freight.test.js`: Shipping config, state/country tier auto-detection, grand totals.
  - `tests/unit/form-validator.test.js`: Nigerian phone regex, international E.164, email syntax, XSS sanitization.
  - `tests/unit/payment-order.test.js`: Paystack kobo calculation, manual provider, order ref format, dual persistence, history lookup.
  - `tests/e2e/e2e-workflow.test.js`: End-to-end full customer journey simulating localStorage and DOM flows.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Standard Live Checkout (Lagos Delivery) | F1, F2, F6, F7, F8, F9, F10, F11, F13, F14, F16, F17, F18 | High |
| 2 | Regional Pre-Order / B2B Allocation (Rest of Nigeria Bank Transfer) | F1, F4, F6, F7, F8, F9, F10, F11, F13, F15, F16, F17, F18 | High |
| 3 | Mixed Cart with International Air Cargo | F1, F2, F4, F6, F7, F8, F9, F10, F13, F15, F16, F17, F18 | High |
| 4 | Reloading Past Historical Order from URL Reference after Storage Clear | F16, F17, F18 | Medium |
| 5 | Validation Error Recovery and Successful Submission | F9, F10, F11, F12, F13, F14, F16 | High |

## Coverage Thresholds
- Tier 1: ≥5 per feature
- Tier 2: ≥5 per feature (boundary and corner cases)
- Tier 3: pairwise coverage of major feature interactions
- Tier 4: ≥5 realistic application scenarios
- Tier 5: Adversarial white-box test hardening
