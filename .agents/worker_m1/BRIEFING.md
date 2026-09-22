# BRIEFING — 2026-09-21T03:12:00Z

## Mission
Implement Milestone 1: Dynamic Cart & Catalog Pricing Engine (Features F1–F5) for Kabod Crest.

## 🔒 My Identity
- Archetype: worker
- Roles: implementer, qa, specialist
- Working directory: c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\worker_m1
- Original parent: 589a1f56-e97d-4a0b-b392-81a977a8d35f
- Milestone: Milestone 1 (Dynamic Cart & Catalog Pricing Engine)

## 🔒 Key Constraints
- EXCLUSIVE write ownership: `js/products-data.js`, `js/cart.js`, `cart.html`, cart drawer footer markup across pages (`index.html`, `shop.html`, `product-detail.html`, `hospitality.html`, `business-services.html`).
- DO NOT touch `js/shipping-config.js` or `checkout.js` in this milestone.
- DO NOT CHEAT. No hardcoding test results, dummy/facade implementations, or shortcut strategies.
- Maintain real state and produce real behavior.

## Current Parent
- Conversation ID: 589a1f56-e97d-4a0b-b392-81a977a8d35f
- Updated: 2026-09-21T03:12:00Z

## Task Summary
- **What to build**:
  - F1: Catalog Sync (`js/products-data.js`) - Dehydrated Ugwu: price 2850, priceDisplay "₦2,850", isLive: true, isPreOrder: false; Ginger: price 2400, priceDisplay "₦2,400", isLive: true, isPreOrder: false; Jollof Spice alias resolution (`jollof-spice` and `jollof-rice-spice`), price: null/TBC (or pre-order) to enable mixed-cart testing.
  - F2: Pricing Engine & Cart Calculation (`js/cart.js`) - `formatNaira(amount)`, `calculateCartTotals(items)`, `getSubtotal()`, `getLineTotal(item)`, `getTotals()`, and include totals in `kabod:cart-updated` event.
  - F3: Cart Drawer UI & Line Totals - Subtotal row in drawer footer across all pages; display line-item totals in drawer items; reactively update `#cart-drawer-subtotal`.
  - F4: Mixed Cart Pricing Logic - Display live subtotal while appending `+ [TBC items]` without numeric calculation breaking.
  - F5: Cart Page Dynamic Subtotal & Totals (`cart.html`) - Dynamic `#cart-subtotal`, `#cart-payable-total`, line totals in `#cart-lines-body`, quantity adjustment updates in real time.
- **Success criteria**:
  - 2 units of Ugwu (₦2,850) = exactly ₦5,700 in drawer and `cart.html`.
  - Quantity modifications update subtotal dynamically.
  - Mixed carts show live subtotal + pre-order tag cleanly without breaking calculations.
  - Node automated test suite passes 100%.
- **Interface contracts**: `c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\PROJECT.md`
- **Code layout**: `c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\PROJECT.md` § Code Layout

## Key Decisions Made
- Follow Interface Contract from PROJECT.md: `formatNaira(amount)`, `calculateCartTotals(items)`.
- Support alias resolution for `jollof-spice` -> `jollof-rice-spice` in catalog lookups.
- Keep Jollof Spice as pre-order / TBC (`price: null`, `priceDisplay: "Price: [TBC]"`, `isPreOrder: true`) as recommended in the survey report to allow robust mixed-cart scenarios while Dehydrated Ugwu and Ginger are live priced items.

## Artifact Index
- `c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\worker_m1\DISPATCH.md` — Assignment and instructions
- `c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\worker_m1\progress.md` — Liveness & progress tracking
- `c:\Users\cutef\Downloads\My Projects\Kabod Crest\.agents\worker_m1\handoff.md` — Final completion report

## Change Tracker
- **Files modified**: None yet
- **Build status**: Not run yet
- **Pending issues**: None

## Quality Status
- **Build/test result**: Not run yet
- **Lint status**: Not run yet
- **Tests added/modified**: Pending unit test suite

## Loaded Skills
- None required for this milestone
