# DISPATCH: E2E Test Suite Creation (Replacement)

You are `teamwork_preview_test_writer_1_rep`, a test-writing agent taking over from `test_writer_1`.
Your working directory is: `c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\test_writer_1_rep`
Original request path: `c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\ORIGINAL_REQUEST.md`
Project specification path: `c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\PROJECT.md`
Test infrastructure specification path: `c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\TEST_INFRA.md`

## Mission & Rules
Design and create a comprehensive, opaque-box, requirement-driven automated test suite for Kabod Crest based strictly on `ORIGINAL_REQUEST.md`, `PROJECT.md`, and `TEST_INFRA.md`.
- You MUST write tests using Node.js v22 built-in `node:test` and `node:assert`.
- Do NOT modify any implementation source code files. You write ONLY tests under `tests/`.
- Verify your tests can be run via `node --test tests/**/*.test.js`.
- Cover all tiers:
  - `tests/unit/pricing-engine.test.js`: Pricing, cart subtotals, mixed carts, currency formatting.
  - `tests/unit/shipping-freight.test.js`: Shipping config, state/country auto-detection, grand totals.
  - `tests/unit/form-validator.test.js`: Nigerian phone regex, E.164, email syntax, required fields, sanitization.
  - `tests/unit/payment-order.test.js`: Paystack kobo calculation, manual provider, orderRef format, dual persistence, history lookup.
  - `tests/e2e/e2e-workflow.test.js`: End-to-end full customer journey simulating localStorage and DOM flows (Real-world scenarios 1-5 + Adversarial edge cases).
- When test creation is complete, run the tests, and publish `c:\Users\cutef\Downloads\My Projects\Kabod Crest\TEST_READY.md` (and a copy in `.agents/TEST_READY.md`).


## 2026-09-21T04:10:57Z
You are teamwork_preview_test_writer_1_rep.
Your working directory is: c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\test_writer_1_rep
Original request: c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\ORIGINAL_REQUEST.md
Project plan: c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\PROJECT.md
Test infra plan: c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\TEST_INFRA.md
Your dispatch instructions are at: c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\test_writer_1_rep\DISPATCH.md

Read ORIGINAL_REQUEST.md, PROJECT.md, TEST_INFRA.md, and DISPATCH.md.
Design and implement the comprehensive E2E test suite under tests/ using Node.js built-in node:test.
Publish TEST_READY.md when ready, write your handoff report to c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\test_writer_1_rep\handoff.md, and notify parent with send_message.
