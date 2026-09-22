# Survey & Architecture Report: Dynamic Cart & Checkout Pricing Engine (Requirement R1)

## Executive Summary
This investigation surveys the Kabod Crest codebase with a specific focus on **Requirement R1 (Dynamic Cart & Checkout Pricing Engine)** and its integration with the cart drawer, `cart.html`, `checkout.html`, and related pricing and currency systems.

The investigation reveals that while a client-side cart store (`CartStore` in `js/cart.js`) exists with `localStorage` persistence and event dispatching (`kabod:cart-updated`), it currently **lacks all numerical subtotal calculation and line-item total formatting**. Furthermore, product prices in `js/products-data.js` do not match the specified launch pricing (Dehydrated Ugwu is currently ₦10,000 instead of ₦2,850, and Ginger/Jollof are unpriced), the cart drawer footer contains **no subtotal display element**, `cart.html` and `checkout.html` have hardcoded `Price: [TBC]` labels, and there is **no currency formatting utility** for Nigerian Naira anywhere in the codebase.

---

## 1. Observation

### 1.1 Product Catalog Representation & Pricing (`js/products-data.js`)
- **Location**: `js/products-data.js` lines 12–146
- **Dehydrated Ugwu**:
  ```javascript
  17:   id: "dehydrated-ugwu",
  18:   name: "Dehydrated Ugwu",
  21:   weight: "250g",
  22:   price: 10000,
  23:   priceDisplay: "₦10,000",
  24:   isLive: true,
  25:   isComingSoon: false,
  26:   isPreOrder: false,
  ```
  *Discrepancy*: R1 and acceptance criteria require Dehydrated Ugwu at **₦2,850** (2 units = exactly ₦5,700). Current value in catalog is `10000`.
- **Dehydrated Ginger Powder**:
  ```javascript
  63:   id: "dehydrated-ginger",
  64:   name: "Dehydrated Ginger Powder",
  68:   price: null,
  69:   priceDisplay: "Price: [TBC]",
  70:   isLive: true,
  71:   isComingSoon: false,
  72:   isPreOrder: true,
  ```
  *Discrepancy*: R1 mentions priced items including "Ginger at ₦2,400".
- **Jollof Rice Spice**:
  ```javascript
  105:  id: "jollof-rice-spice",
  106:  name: "Jollof Rice Spice",
  110:  price: null,
  111:  priceDisplay: "Price: [TBC]",
  112:  isLive: true,
  113:  isComingSoon: false,
  114:  isPreOrder: true,
  ```
  *Discrepancy*: R1 mentions priced items including "Jollof Spice at ₦2,200". In addition, `shop.html` line 48 and `sitemap.xml` line 61 link to `product-detail.html?id=jollof-spice`, whereas the ID in `js/products-data.js` is `jollof-rice-spice`.
- **Remaining 11 Products**:
  Lines 148–458: All have `isLive: false`, `isComingSoon: true`, `price: null`, `priceDisplay: "Coming Soon"`.

### 1.2 Cart Store & Persistence (`js/cart.js`)
- **Location**: `js/cart.js` lines 7–109
- **Storage Mechanism**:
  ```javascript
  8:   const STORAGE_KEY = 'kabod_crest_cart_v1';
  ```
  Items are stored as JSON in `localStorage` under key `kabod_crest_cart_v1`.
- **Item Storage Schema** (lines 52–64):
  ```javascript
  52:   this.items.push({
  53:     id: product.id,
  54:     name: product.name,
  55:     subtitle: product.subtitle || '',
  56:     weight: product.weight || '',
  57:     price: (typeof product.price === 'number') ? product.price : null,
  58:     priceDisplay: product.priceDisplay || 'Price: [TBC]',
  59:     image: product.image || '',
  60:     category: product.category || '',
  61:     isPreOrder: !!product.isPreOrder,
  62:     quantity: quantity
  63:   });
  ```
- **Quantity & Mutation Methods**:
  - `addItem(product, quantity = 1)` (lines 47–66): Increments existing item quantity or appends new item.
  - `updateQuantity(productId, quantity)` (lines 68–78): Updates target item quantity or removes if `<= 0`.
  - `removeItem(productId)` (lines 80–83): Filters out item.
  - `clear()` (lines 85–88): Clears cart array.
- **Event Notification**:
  ```javascript
  90:   notify() {
  91:     const event = new CustomEvent('kabod:cart-updated', {
  92:       detail: {
  93:         items: this.getItems(),
  94:         totalCount: this.getTotalCount()
  95:       }
  96:     });
  97:     window.dispatchEvent(event);
  98:   }
  ```
  *Missing*: `detail` does not include `subtotal`, `formattedSubtotal`, `lineTotals`, or `tbcCount`.
- **Missing Calculation Methods**:
  `CartStore` has no `getSubtotal()`, `getLineTotal()`, `getTotals()`, or `getTbcCount()` methods.

### 1.3 Cart Drawer UI Implementation (`js/cart.js` & HTML Files)
- **Drawer Markup**: Present across `index.html` (361–378), `shop.html` (280–305), `cart.html` (164–183), `product-detail.html` (286–305), `hospitality.html` (263–278), `business-services.html` (262–277).
- **Cart Drawer Footer Markup**:
  ```html
  <div class="cart-drawer-footer" id="cart-drawer-footer" style="display: none;">
    <div class="cart-policy-note">
      <strong>Pre-Order Policy:</strong> Commercial unit prices are currently being finalized [TBC]. Reserving now guarantees priority dispatch from the first completed production run.
    </div>
    <a href="cart.html" class="btn-cart-checkout">
      Review Pre-Order & Confirm
    </a>
  </div>
  ```
  *Defect*: There is **no subtotal element** in the cart drawer footer markup anywhere in the project.
- **Drawer Item Rendering (`js/cart.js` lines 189–211)**:
  ```javascript
  197:   <div class="cart-item-spec">
  198:     ${item.weight} • ${item.priceDisplay}
  199:     ${(item.price && window.KabodCurrency) ? `<span class="cart-item-estimate" style="font-size: 0.6875rem; color: var(--color-gold); font-weight: 600; margin-left: 4px;">${window.KabodCurrency.formatEstimate(item.price * item.quantity)}</span>` : ''}
  200:   </div>
  ```
  *Defect*: Renders unit `item.priceDisplay`, not the line-item total (`price * quantity`). Does not compute or display a drawer subtotal.

### 1.4 Cart Page (`cart.html`)
- **Summary Box** (lines 113–133):
  ```html
  116: <div class="summary-line-item">
  117:   <span>Reserved Items:</span>
  118:   <span id="summary-items-count" style="font-weight: 600;">0</span>
  119: </div>
  121: <div class="summary-line-item">
  122:   <span>Commercial Rate:</span>
  123:   <span style="font-family: var(--font-structural); font-weight: 600; color: var(--color-plum);">[TBC on Invoice]</span>
  124: </div>
  126: <div class="summary-total-row">
  127:   <span>Estimated Payable:</span>
  128:   <span>Price: [TBC]</span>
  129: </div>
  ```
- **Local Controller Script** (lines 236–319):
  ```javascript
  257: if (countEl) countEl.textContent = `${total} item${total === 1 ? '' : 's'}`;
  258: if (summaryCount) summaryCount.textContent = total;
  ```
  *Defect*: The controller only sets `countEl` and `summaryCount`. `Commercial Rate` and `Estimated Payable` remain hardcoded static strings.
  *Line Item Defect*: Line 262–268 renders `item.priceDisplay` for each line item instead of calculating the line total (`item.price * item.quantity`).

### 1.5 Checkout Page & Controller (`checkout.html` & `js/checkout.js`)
- **Checkout Summary Sidebar** (`checkout.html` lines 179–208):
  ```html
  180: <h2 class="summary-box-title" id="side-summary-heading">Allocation Summary</h2>
  181: <div id="checkout-summary-items"></div>
  186: <div class="summary-line-item" style="margin-top: var(--space-md);">
  187:   <span>Total Units:</span>
  188:   <span id="checkout-items-count" style="font-weight: 600;">0</span>
  189: </div>
  191: <div class="summary-line-item">
  192:   <span>Selected Shipping:</span>
  193:   <span id="checkout-shipping-tier-label" style="font-weight: 600; color: var(--color-plum);">Lagos Delivery</span>
  194: </div>
  195: <div class="summary-line-item">
  196:   <span>Freight & Handling:</span>
  197:   <span id="checkout-shipping-rate-label" style="font-weight: 600; color: var(--color-text-muted);">Flat rate [TBC]</span>
  198: </div>
  200: <div class="summary-total-row">
  201:   <span>Payable at Dispatch:</span>
  202:   <span id="checkout-total-payable">Price: [TBC]</span>
  203: </div>
  ```
  *Defect*: A dedicated `Subtotal` row is absent. `Payable at Dispatch` (`#checkout-total-payable`) is never updated dynamically and remains `Price: [TBC]`.
- **Checkout Line Items (`js/checkout.js` lines 144–156)**:
  Renders only `item.priceDisplay` (e.g. `₦10,000`), not `item.price * item.quantity`.
- **Checkout Order Data Payload (`js/checkout.js` lines 299–308)**:
  ```javascript
  299: const orderData = {
  300:   orderRef: orderRef,
  301:   createdAt: new Date().toISOString(),
  302:   customer: customer,
  303:   delivery: delivery,
  304:   shippingTier: tierObj,
  305:   items: cartItems,
  306:   totalCount: window.KabodCart.getTotalCount(),
  307:   priceStatus: 'Price: [TBC - Official invoice confirmed prior to dispatch]'
  308: };
  ```
  *Defect*: Contains no numerical `subtotal`, `shippingCost`, or `grandTotal`.

### 1.6 Currency Service & Formatting (`js/currency-service.js`)
- **Location**: `js/currency-service.js` lines 1–180
- Provides `formatEstimate(ngnAmount)` converting NGN to USD/GBP/EUR for international visitors via Frankfurter API with sessionStorage caching.
- **Finding**: **Zero currency formatting functions exist for Nigerian Naira (`NGN` / `₦`)**. Neither `Intl.NumberFormat('en-NG', ...)` nor any helper exists to format numerical numbers into `₦5,700` or `₦2,850`.

### 1.7 Pre-Order / TBC Items & Mixed Cart Handling
- Products currently flag `isPreOrder: true` or `price: null`.
- `cart.js` renders `<div class="cart-item-tag ${item.isPreOrder ? '' : 'live'}">${item.isPreOrder ? 'PRE-ORDER' : 'LIVE ORDER'}</div>`.
- **Finding**: No mixed-cart calculation logic exists anywhere. When a cart contains both live items and pre-order TBC items, there is no logic to compute the live total while indicating `+ [TBC items]`.

### 1.8 Testing Infrastructure
- `package.json` contains only GSAP and Lenis dependencies; no test runners (`jest`, `mocha`, `vitest`, `playwright`).
- Repository search (`find_by_name *test*`) returned 0 test files.
- No automated verification exists for cart or checkout pricing.

---

## 2. Logic Chain

```
[Observation 1.1: Ugwu catalog price is ₦10,000, Ginger & Jollof are null/TBC]
       │
       ▼
[Step 1: Product catalog does not match R1 launch prices (₦2,850, ₦2,400, ₦2,200)]
       │
       ▼
[Observation 1.2: CartStore stores snapshot of product.price, but has NO subtotal/total calculation methods]
       │
       ▼
[Step 2: Cart state lacks calculation capabilities; cannot compute line totals or subtotals]
       │
       ▼
[Observation 1.3 & 1.4: Cart drawer footer has NO subtotal DOM element; cart.html has hardcoded 'Price: [TBC]']
       │
       ▼
[Step 3: User interfaces cannot display numerical subtotal (e.g. ₦5,700 for 2 units of Ugwu)]
       │
       ▼
[Observation 1.5 & 1.6: checkout.html lacks Subtotal row, checkout.js does not calculate total, no formatNaira helper exists]
       │
       ▼
[Step 4: Mixed carts cannot display live totals with '+ [TBC items]', and checkout cannot sum subtotal with shipping freight]
       │
       ▼
[CONCLUSION: Requirement R1 cannot be satisfied without catalog price adjustments, a dedicated pricing calculation engine, UI subtotal elements in the drawer & checkout, and accurate Naira currency formatting.]
```

---

## 3. Caveats

1. **Product Catalog Scope**: While R1 provides examples ("e.g. Dehydrated Ugwu at ₦2,850, Ginger at ₦2,400, Jollof Spice at ₦2,200"), we must confirm whether Ginger and Jollof Spice should be live priced items, or remain pre-order TBC items to enable mixed-cart testing. We recommend setting Ugwu to ₦2,850 (live), Ginger to ₦2,400 (live), and Jollof Spice to `Price: [TBC]` (pre-order) so that both live and mixed cart scenarios can be tested immediately.
2. **Product Detail URL Slug**: In `shop.html` (line 48) and `sitemap.xml` (line 61), Jollof Spice has ID `jollof-spice`, but in `js/products-data.js` line 105 it is `jollof-rice-spice`. The pricing and product resolution logic should accept both `jollof-rice-spice` and `jollof-spice` as aliases.
3. **Existing Cart Cache**: Users with existing `kabod_crest_cart_v1` in browser `localStorage` may hold old items with `price: 10000`. The implementation should sync existing cart items with the latest catalog prices or handle migration cleanly.
4. **Read-Only Constraint**: As an explorer agent, no production source code has been altered during this survey.

---

## 4. Conclusion & Recommended Implementation Strategy

### 4.1 Required Modifications Summary Table

| Component | Target File | Line(s) | Change Required |
| :--- | :--- | :--- | :--- |
| **Catalog Data** | `js/products-data.js` | 22–23 | Update `dehydrated-ugwu` to `price: 2850`, `priceDisplay: "₦2,850"`. Set `dehydrated-ginger` to `price: 2400, priceDisplay: "₦2,400"`. Keep `jollof-rice-spice` as pre-order TBC (or priced ₦2,200). Add alias resolution for `jollof-spice`. |
| **Pricing Engine** | `js/cart.js` (or `js/pricing-engine.js`) | New / lines 43–98 | Add `formatNaira(amount)`, `calculateCartTotals(items)`, `getSubtotal()`, `getLineTotal()`, and include `totals` in `kabod:cart-updated` event detail. Support mixed carts (`₦5,700 + [1 TBC item]`). |
| **Cart Drawer UI** | `index.html`, `shop.html`, `cart.html`, etc. | Drawer footer | Add `<div class="cart-drawer-subtotal-row"><span class="subtotal-label">Subtotal:</span><span class="subtotal-value" id="cart-drawer-subtotal">₦0</span></div>`. |
| **Cart Drawer Rendering** | `js/cart.js` | 197–210 | Render line item total (`price * quantity` e.g. `2 × ₦2,850 = ₦5,700`) and update `#cart-drawer-subtotal` reactively. |
| **Cart Page** | `cart.html` | 126–130, 260–290 | Update summary box with dynamic `#cart-subtotal` and `#cart-payable-total`. Render line-item totals in `#cart-lines-body`. |
| **Checkout Summary** | `checkout.html` | 185–204 | Add `#checkout-subtotal` row. Display dynamic subtotal. |
| **Checkout Pricing** | `js/checkout.js` | 144–156, 240–250, 299–308 | Render line item totals in summary sidebar. Dynamically sum subtotal + shipping freight to calculate grand total in `#checkout-total-payable`. Store numerical totals in `orderData`. |
| **Confirmation Page** | `order-confirmation.html`, `js/order-confirmation.js` | 111–126 | Render itemized line totals, subtotal, shipping freight, and grand total from stored order. |

### 4.2 Detailed Implementation Sketch for Pricing Engine

```javascript
// Central Currency & Calculation Engine
function formatNaira(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return '₦0';
  return '₦' + Math.round(amount).toLocaleString('en-NG');
}

function calculateCartTotals(items = []) {
  let pricedSubtotal = 0;
  let tbcCount = 0;
  let totalCount = 0;

  const itemCalculations = items.map(item => {
    const qty = item.quantity || 1;
    totalCount += qty;
    const isPriced = typeof item.price === 'number' && item.price > 0;

    if (isPriced) {
      const lineTotal = item.price * qty;
      pricedSubtotal += lineTotal;
      return { ...item, lineTotal, lineTotalDisplay: formatNaira(lineTotal), isPriced: true };
    } else {
      tbcCount += qty;
      return { ...item, lineTotal: null, lineTotalDisplay: item.priceDisplay || 'Price: [TBC]', isPriced: false };
    }
  });

  let formattedSubtotal = '₦0';
  let formattedSummaryTotal = '₦0';

  if (pricedSubtotal > 0 && tbcCount === 0) {
    formattedSubtotal = formatNaira(pricedSubtotal);
    formattedSummaryTotal = formattedSubtotal;
  } else if (pricedSubtotal > 0 && tbcCount > 0) {
    formattedSubtotal = `${formatNaira(pricedSubtotal)} + [${tbcCount} TBC item${tbcCount > 1 ? 's' : ''}]`;
    formattedSummaryTotal = `${formatNaira(pricedSubtotal)} (+ ${tbcCount} pre-order items)`;
  } else if (pricedSubtotal === 0 && tbcCount > 0) {
    formattedSubtotal = 'Price: [TBC]';
    formattedSummaryTotal = 'Price: [TBC]';
  }

  return {
    items: itemCalculations,
    totalCount,
    pricedSubtotal,
    tbcCount,
    hasPriced: pricedSubtotal > 0,
    hasTbc: tbcCount > 0,
    isMixed: pricedSubtotal > 0 && tbcCount > 0,
    formattedSubtotal,
    formattedSummaryTotal
  };
}
```

---

## 5. Verification Method

### 5.1 Independent Verification Commands
A lightweight automated Node.js test script can verify all calculations without browser overhead:

```bash
# Verify product catalog pricing export
node -e "const { KABOD_PRODUCTS } = require('./js/products-data.js'); console.log(KABOD_PRODUCTS.filter(p => p.isLive).map(p => ({ id: p.id, price: p.price, display: p.priceDisplay })));"

# Test pricing engine logic standalone
node -e "
const assert = require('assert');
const ugwu = { id: 'dehydrated-ugwu', price: 2850, quantity: 2 };
const subtotal = ugwu.price * ugwu.quantity;
assert.strictEqual(subtotal, 5700, 'Subtotal for 2 units of Ugwu must be 5700');
console.log('Calculation verified: 2x Dehydrated Ugwu = ₦' + subtotal.toLocaleString('en-NG'));
"
```

### 5.2 Browser Invalidation / Acceptance Test Conditions
1. **Priced Cart Test**:
   - Clear `localStorage`.
   - Add 2 units of Dehydrated Ugwu to cart.
   - Open cart drawer: `#cart-drawer-subtotal` must display `₦5,700`. Line item must show `₦5,700` (or `2 × ₦2,850 = ₦5,700`).
   - Navigate to `cart.html`: Estimated Payable / Subtotal must display `₦5,700`.
   - Invalidate if: Drawer or `cart.html` displays `₦10,000`, `Price: [TBC]`, `NaN`, or empty.
2. **Quantity Modification Test**:
   - In cart drawer or `cart.html`, click `+` on Ugwu (quantity = 3).
   - Subtotal must immediately update to `₦8,550`.
   - Click `-` to return to 2: Subtotal must update to `₦5,700`.
3. **Mixed Cart Test**:
   - Add 1 unit of a pre-order / TBC item (e.g. Jollof Rice Spice) alongside 2 units of Ugwu.
   - Subtotal must display `₦5,700 + [1 TBC item]` (or `+ [TBC items]`).
   - Invalidate if: Numerical calculation breaks, turns to `NaN`, or replaces the live subtotal entirely with `[TBC]`.
4. **Checkout Integration Test**:
   - Proceed to `checkout.html`.
   - Allocation summary must list itemized line totals and subtotal `₦5,700`.
   - Selecting Lagos Delivery (₦2,500) must auto-update Payable at Dispatch to `₦8,200` (₦5,700 + ₦2,500).
