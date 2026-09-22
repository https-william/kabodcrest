# DISPATCH: Milestone 1 - Dynamic Cart & Catalog Pricing Engine

You are `teamwork_preview_worker_m1`, a versatile worker agent.
Your working directory is: `c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\worker_m1`
Original request path: `c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\ORIGINAL_REQUEST.md`
Project specification path: `c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\PROJECT.md`
Explorer investigation report: `c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\explorer_survey_1\handoff.md`

## File Ownership
You have EXCLUSIVE write ownership of:
- `js/products-data.js`
- `js/cart.js`
- `cart.html`
- Cart drawer footer markup across pages (`index.html`, `shop.html`, `product-detail.html`, `hospitality.html`, `business-services.html`)
DO NOT touch `js/shipping-config.js` or `checkout.js` in this milestone.

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Milestone 1 Objectives & Deliverables (Features F1–F5)
1. **Catalog Sync (`js/products-data.js`)**:
   - Set Dehydrated Ugwu to `price: 2850`, `priceDisplay: "₦2,850"`, `isLive: true`, `isPreOrder: false`.
   - Set Ginger to `price: 2400`, `priceDisplay: "₦2,400"`, `isLive: true`, `isPreOrder: false`.
   - Set Jollof Spice to `price: 2200` (or pre-order `price: null, priceDisplay: "Price: [TBC]"` as pre-order reference), and ensure alias resolution so that both `jollof-spice` and `jollof-rice-spice` resolve correctly.
2. **Pricing Engine & Cart Calculation (`js/cart.js`)**:
   - Implement `formatNaira(amount)` formatting numbers into Nigerian Naira strings (e.g. `2850` -> `₦2,850`, `5700` -> `₦5,700`).
   - Implement `calculateCartTotals(items)` computing line totals (`price * quantity`), numerical subtotal, `tbcCount`, and mixed-cart summaries (e.g. `₦5,700 + [1 TBC item]`).
   - Expose methods on `CartStore` (`window.KabodCart`): `getSubtotal()`, `getLineTotal(item)`, `getTotals()`.
   - Ensure event detail in `kabod:cart-updated` includes `totals` (`subtotal`, `formattedSubtotal`, `lineTotals`, `tbcCount`, `isMixed`).
3. **Cart Drawer UI & Line Totals**:
   - Add a Subtotal element into the cart drawer footer markup across all pages (`<div class="cart-drawer-subtotal-row"><span class="subtotal-label">Subtotal:</span><span class="subtotal-value" id="cart-drawer-subtotal">₦0</span></div>`).
   - In `js/cart.js`, update drawer item rendering to display line-item totals (`2 × ₦2,850 = ₦5,700` or `₦5,700`) and reactively update `#cart-drawer-subtotal`.
4. **Cart Page (`cart.html`)**:
   - Update `cart.html` summary box to display dynamic `#cart-subtotal` and `#cart-payable-total`.
   - Render calculated line-item totals in `#cart-lines-body`.
   - Handle quantity modifications (`+` / `-`) and verify subtotal updates in real time.
5. **Testing & Verification**:
   - Write and run a standalone Node verification test script (e.g. `tests/unit/pricing-engine.test.js` or in your working directory) using `node --test` or `assert` to verify calculations:
     - 2 units of Ugwu (₦2,850) = exactly ₦5,700.
     - Quantity modification from 2 to 3 = ₦8,550.
     - Mixed cart: 2 units Ugwu + 1 TBC item = `₦5,700 + [1 TBC item]`.
   - Verify no syntax errors across all touched files.

Produce your completion report in `c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\worker_m1\handoff.md` and notify parent when complete.

## 2026-09-21T03:11:35Z
You are teamwork_preview_worker_m1.
Your working directory is: c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\worker_m1
Original request: c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\ORIGINAL_REQUEST.md
Project plan: c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\PROJECT.md
Explorer survey report: c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\explorer_survey_1\handoff.md
Your dispatch instructions are at: c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\worker_m1\DISPATCH.md

Read ORIGINAL_REQUEST.md, PROJECT.md, and DISPATCH.md.
Implement Milestone 1: Dynamic Cart & Catalog Pricing Engine (Features F1-F5).
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
Verify your changes with tests.
Write your completion report to c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\worker_m1\handoff.md and notify parent with send_message.

