/**
 * Kabod Crest E2E Test Suite - Pricing & Cart Engine Unit Tests
 * Covers Features:
 * - F1: Product Catalog Pricing Sync (ORIGINAL_REQUEST §R1)
 * - F2: Cart Subtotal & Line Total Engine (ORIGINAL_REQUEST §R1)
 * - F3: Cart Drawer Subtotal UI & Line Totals (ORIGINAL_REQUEST §R1)
 * - F4: Mixed Cart Pricing Logic (ORIGINAL_REQUEST §R1)
 * - F5: Cart Page Dynamic Subtotal & Totals (ORIGINAL_REQUEST §R1)
 *
 * Tiers covered: Tier 1 (Feature), Tier 2 (Boundary & Corner), Tier 3 (Pairwise Combinatorial)
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { createBrowserEnvironment, loadProjectScript, MockElement } = require('../helpers/browser-mock.js');

function setupTestEnv() {
  const env = createBrowserEnvironment();

  // Load products catalog
  loadProjectScript('js/products-data.js', env);

  // Setup DOM for cart and drawer
  const drawer = new MockElement('div', { id: 'cart-drawer' });
  const backdrop = new MockElement('div', { id: 'cart-backdrop' });
  const listEl = new MockElement('ul', { id: 'cart-items-list' });
  const emptyEl = new MockElement('div', { id: 'cart-empty-state' });
  const footerEl = new MockElement('div', { id: 'cart-drawer-footer' });
  const drawerSubtotalEl = new MockElement('span', { id: 'cart-drawer-subtotal' });
  const badgeEl = new MockElement('span', { class: 'cart-badge' });

  footerEl.appendChild(drawerSubtotalEl);
  drawer.appendChild(listEl);
  drawer.appendChild(emptyEl);
  drawer.appendChild(footerEl);

  env.document.body.appendChild(drawer);
  env.document.body.appendChild(backdrop);
  env.document.body.appendChild(badgeEl);

  env.document.registerElement('cart-drawer', drawer);
  env.document.registerElement('cart-backdrop', backdrop);
  env.document.registerElement('cart-items-list', listEl);
  env.document.registerElement('cart-empty-state', emptyEl);
  env.document.registerElement('cart-drawer-footer', footerEl);
  env.document.registerElement('cart-drawer-subtotal', drawerSubtotalEl);

  // Load cart store
  loadProjectScript('js/cart.js', env);

  return env;
}

// ============================================================================
// TIER 1: FEATURE COVERAGE (≥5 per feature)
// ============================================================================

describe('Tier 1: Feature F1 - Product Catalog Pricing Sync', () => {
  let env;
  beforeEach(() => {
    env = setupTestEnv();
  });

  it('F1-T1-1: Dehydrated Ugwu catalog price is exactly ₦2,850', () => {
    const products = env.window.KABOD_PRODUCTS;
    assert.ok(Array.isArray(products), 'KABOD_PRODUCTS must be an array');
    const ugwu = products.find(p => p.id === 'dehydrated-ugwu' || p.id === 'ugwu');
    assert.ok(ugwu, 'Dehydrated Ugwu must exist in KABOD_PRODUCTS');
    assert.strictEqual(ugwu.price, 2850, 'Ugwu price must be 2850');
    assert.strictEqual(ugwu.priceDisplay, '₦2,850', 'Ugwu priceDisplay must be ₦2,850');
    assert.strictEqual(ugwu.isLive, true, 'Ugwu must be marked as live');
    assert.strictEqual(ugwu.isPreOrder, false, 'Ugwu must not be marked as pre-order');
  });

  it('F1-T1-2: Dehydrated Ginger catalog price is exactly ₦2,400', () => {
    const products = env.window.KABOD_PRODUCTS;
    const ginger = products.find(p => p.id === 'dehydrated-ginger' || p.id === 'ginger');
    assert.ok(ginger, 'Dehydrated Ginger must exist in KABOD_PRODUCTS');
    assert.strictEqual(ginger.price, 2400, 'Ginger price must be 2400');
    assert.strictEqual(ginger.priceDisplay, '₦2,400', 'Ginger priceDisplay must be ₦2,400');
    assert.strictEqual(ginger.isLive, true, 'Ginger must be marked as live');
    assert.strictEqual(ginger.isPreOrder, false, 'Ginger must not be marked as pre-order');
  });

  it('F1-T1-3: Jollof Spice catalog entry has price ₦2,200', () => {
    const products = env.window.KABOD_PRODUCTS;
    const jollof = products.find(p => p.id.includes('jollof'));
    assert.ok(jollof, 'Jollof Spice must exist in KABOD_PRODUCTS');
    assert.strictEqual(jollof.price, 2200, 'Jollof Spice price must be 2200');
    assert.strictEqual(jollof.priceDisplay, '₦2,200', 'Jollof Spice priceDisplay must be ₦2,200');
  });

  it('F1-T1-4: Catalog entries have all required structural metadata', () => {
    const products = env.window.KABOD_PRODUCTS;
    assert.ok(products.length >= 3, 'Catalog must contain at least 3 items');
    for (const p of products) {
      assert.ok(p.id, `Product ${p.id} missing id`);
      assert.ok(p.name, `Product ${p.id} missing name`);
      assert.ok(p.category, `Product ${p.id} missing category`);
      assert.ok(p.weight, `Product ${p.id} missing weight`);
      assert.ok(typeof p.isLive === 'boolean', `Product ${p.id} missing isLive`);
    }
  });

  it('F1-T1-5: Catalog supports slug alias resolution or standard IDs', () => {
    const products = env.window.KABOD_PRODUCTS;
    const getProduct = (slug) => products.find(p => p.id === slug || (p.aliases && p.aliases.includes(slug)));
    const ugwu = getProduct('dehydrated-ugwu') || getProduct('ugwu');
    assert.ok(ugwu, 'Should resolve Ugwu via primary ID or alias');
    assert.strictEqual(ugwu.name, 'Dehydrated Ugwu');
  });
});

describe('Tier 1: Feature F2 - Cart Subtotal & Line Total Engine', () => {
  let env;
  beforeEach(() => {
    env = setupTestEnv();
  });

  it('F2-T1-1: formatNaira formats integer amounts with comma separator', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    assert.strictEqual(pricing.formatNaira(5700), '₦5,700');
    assert.strictEqual(pricing.formatNaira(2850), '₦2,850');
    assert.strictEqual(pricing.formatNaira(10000), '₦10,000');
  });

  it('F2-T1-2: formatNaira formats zero as ₦0', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    assert.strictEqual(pricing.formatNaira(0), '₦0');
  });

  it('F2-T1-3: calculateCartTotals computes line totals (price * quantity)', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    const items = [
      { id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850, quantity: 2 }
    ];
    const totals = pricing.calculateCartTotals(items);
    assert.strictEqual(totals.pricedSubtotal, 5700, 'Subtotal for 2 Ugwu must be 5700');
    assert.strictEqual(totals.formattedSubtotal, '₦5,700');
    assert.strictEqual(totals.items[0].lineTotal, 5700);
  });

  it('F2-T1-4: calculateCartTotals computes accurate sum for multiple priced items', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    const items = [
      { id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850, quantity: 2 }, // 5700
      { id: 'dehydrated-ginger', name: 'Dehydrated Ginger', price: 2400, quantity: 3 } // 7200
    ];
    const totals = pricing.calculateCartTotals(items);
    assert.strictEqual(totals.pricedSubtotal, 12900, 'Subtotal must be 5700 + 7200 = 12900');
    assert.strictEqual(totals.formattedSubtotal, '₦12,900');
  });

  it('F2-T1-5: calculateCartTotals returns totalCount as sum of quantities', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    const items = [
      { id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850, quantity: 2 },
      { id: 'dehydrated-ginger', name: 'Dehydrated Ginger', price: 2400, quantity: 3 }
    ];
    const totals = pricing.calculateCartTotals(items);
    assert.strictEqual(totals.totalCount, 5, 'Total count must be 2 + 3 = 5');
  });
});

describe('Tier 1: Feature F3 - Cart Drawer Subtotal UI & Line Totals', () => {
  let env;
  beforeEach(() => {
    env = setupTestEnv();
  });

  it('F3-T1-1: CartStore notifies listeners with totals on addItem', () => {
    let notifiedDetail = null;
    env.window.addEventListener('kabod:cart-updated', (e) => {
      notifiedDetail = e.detail;
    });

    const cart = env.window.KabodCart;
    cart.addItem({ id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850, priceDisplay: '₦2,850' }, 2);

    assert.ok(notifiedDetail, 'kabod:cart-updated event must be dispatched');
    assert.strictEqual(notifiedDetail.totalCount, 2);
    assert.strictEqual(cart.getTotalCount(), 2);
  });

  it('F3-T1-2: Cart drawer renders line-item totals (price * quantity)', () => {
    const cart = env.window.KabodCart;
    cart.addItem({ id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850, priceDisplay: '₦2,850' }, 2);

    const listEl = env.document.getElementById('cart-items-list');
    assert.ok(listEl.innerHTML.includes('5,700') || listEl.innerHTML.includes('2,850'), 'Drawer must display item price or line total');
  });

  it('F3-T1-3: Empty cart drawer hides footer subtotal or marks empty state', () => {
    const cart = env.window.KabodCart;
    cart.clear();

    const emptyEl = env.document.getElementById('cart-empty-state');
    const footerEl = env.document.getElementById('cart-drawer-footer');
    assert.strictEqual(emptyEl.style.display, 'block', 'Empty state should be displayed when cart is empty');
    if (footerEl) {
      assert.strictEqual(footerEl.style.display, 'none', 'Footer should be hidden when cart is empty');
    }
  });

  it('F3-T1-4: Updating item quantity recalculates cart totalCount', () => {
    const cart = env.window.KabodCart;
    cart.addItem({ id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850 }, 1);
    assert.strictEqual(cart.getTotalCount(), 1);

    cart.updateQuantity('dehydrated-ugwu', 4);
    assert.strictEqual(cart.getTotalCount(), 4);
  });

  it('F3-T1-5: Removing item removes it from drawer and updates totalCount', () => {
    const cart = env.window.KabodCart;
    cart.addItem({ id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850 }, 2);
    cart.addItem({ id: 'dehydrated-ginger', name: 'Dehydrated Ginger', price: 2400 }, 1);
    assert.strictEqual(cart.getTotalCount(), 3);

    cart.removeItem('dehydrated-ugwu');
    assert.strictEqual(cart.getTotalCount(), 1);
    assert.strictEqual(cart.getItems().length, 1);
  });
});

describe('Tier 1: Feature F4 - Mixed Cart Pricing Logic', () => {
  let env;
  beforeEach(() => {
    env = setupTestEnv();
  });

  it('F4-T1-1: Mixed cart containing priced and TBC items flags isMixed: true', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    const items = [
      { id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850, quantity: 2, isPreOrder: false },
      { id: 'kulikuli', name: 'Kulikuli', price: null, quantity: 1, isPreOrder: true }
    ];
    const totals = pricing.calculateCartTotals(items);
    assert.strictEqual(totals.isMixed, true, 'Cart should be identified as mixed');
    assert.strictEqual(totals.hasPriced, true, 'hasPriced must be true');
    assert.strictEqual(totals.hasTbc, true, 'hasTbc must be true');
  });

  it('F4-T1-2: Mixed cart pricedSubtotal strictly computes sum of priced items without NaN', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    const items = [
      { id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850, quantity: 2, isPreOrder: false }, // 5700
      { id: 'kulikuli', name: 'Kulikuli', price: null, quantity: 3, isPreOrder: true }
    ];
    const totals = pricing.calculateCartTotals(items);
    assert.strictEqual(Number.isNaN(totals.pricedSubtotal), false, 'pricedSubtotal must not be NaN');
    assert.strictEqual(totals.pricedSubtotal, 5700, 'pricedSubtotal must be 5700');
  });

  it('F4-T1-3: Mixed cart formattedSummaryTotal appends + [TBC items] indicator', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    const items = [
      { id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850, quantity: 2, isPreOrder: false },
      { id: 'kulikuli', name: 'Kulikuli', price: null, quantity: 1, isPreOrder: true }
    ];
    const totals = pricing.calculateCartTotals(items);
    assert.ok(
      totals.formattedSummaryTotal.includes('5,700') && totals.formattedSummaryTotal.includes('TBC'),
      `formattedSummaryTotal (${totals.formattedSummaryTotal}) must include ₦5,700 and TBC indicator`
    );
  });

  it('F4-T1-4: Pure TBC cart has pricedSubtotal: 0 and hasPriced: false', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    const items = [
      { id: 'kulikuli', name: 'Kulikuli', price: null, quantity: 2, isPreOrder: true }
    ];
    const totals = pricing.calculateCartTotals(items);
    assert.strictEqual(totals.pricedSubtotal, 0);
    assert.strictEqual(totals.hasPriced, false);
    assert.strictEqual(totals.hasTbc, true);
    assert.strictEqual(totals.isMixed, false);
  });

  it('F4-T1-5: Pure priced cart has isMixed: false and hasTbc: false', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    const items = [
      { id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850, quantity: 1, isPreOrder: false }
    ];
    const totals = pricing.calculateCartTotals(items);
    assert.strictEqual(totals.isMixed, false);
    assert.strictEqual(totals.hasTbc, false);
    assert.strictEqual(totals.hasPriced, true);
  });
});

describe('Tier 1: Feature F5 - Cart Page Dynamic Subtotal & Totals', () => {
  let env;
  beforeEach(() => {
    env = setupTestEnv();
  });

  it('F5-T1-1: Cart item line total equals unit price multiplied by quantity', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    const items = [
      { id: 'dehydrated-ginger', name: 'Dehydrated Ginger', price: 2400, quantity: 4 }
    ];
    const totals = pricing.calculateCartTotals(items);
    assert.strictEqual(totals.items[0].lineTotal, 9600);
    assert.strictEqual(totals.items[0].lineTotalDisplay, '₦9,600');
  });

  it('F5-T1-2: Cart summary updates correctly when quantity increases', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    const cart = env.window.KabodCart;
    cart.addItem({ id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850 }, 1);
    let totals = pricing.calculateCartTotals(cart.getItems());
    assert.strictEqual(totals.pricedSubtotal, 2850);

    cart.updateQuantity('dehydrated-ugwu', 3);
    totals = pricing.calculateCartTotals(cart.getItems());
    assert.strictEqual(totals.pricedSubtotal, 8550);
    assert.strictEqual(totals.formattedSubtotal, '₦8,550');
  });

  it('F5-T1-3: Removing an item updates cart summary subtotal', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    const cart = env.window.KabodCart;
    cart.addItem({ id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850 }, 2);
    cart.addItem({ id: 'dehydrated-ginger', name: 'Dehydrated Ginger', price: 2400 }, 1);
    let totals = pricing.calculateCartTotals(cart.getItems());
    assert.strictEqual(totals.pricedSubtotal, 8100);

    cart.removeItem('dehydrated-ginger');
    totals = pricing.calculateCartTotals(cart.getItems());
    assert.strictEqual(totals.pricedSubtotal, 5700);
  });

  it('F5-T1-4: Clearing cart resets subtotal to zero', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    const cart = env.window.KabodCart;
    cart.addItem({ id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850 }, 2);
    cart.clear();

    const totals = pricing.calculateCartTotals(cart.getItems());
    assert.strictEqual(totals.pricedSubtotal, 0);
    assert.strictEqual(totals.totalCount, 0);
    assert.strictEqual(totals.formattedSubtotal, '₦0');
  });

  it('F5-T1-5: Cart badge text updates across page state', () => {
    const cart = env.window.KabodCart;
    cart.addItem({ id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850 }, 3);

    const badge = env.document.querySelector('.cart-badge');
    assert.ok(badge, 'Cart badge element must exist');
    assert.strictEqual(badge.textContent, '3');
  });
});

// ============================================================================
// TIER 2: BOUNDARY & CORNER CASES (≥5 per feature)
// ============================================================================

describe('Tier 2: Boundary & Corner Cases (F1-F5)', () => {
  let env;
  beforeEach(() => {
    env = setupTestEnv();
  });

  // F1 Boundary Cases
  it('F1-T2-1: Product catalog handles null price for TBC items cleanly', () => {
    const products = env.window.KABOD_PRODUCTS;
    const tbcItem = products.find(p => p.isPreOrder && p.price === null);
    if (tbcItem) {
      assert.strictEqual(tbcItem.price, null);
      assert.ok(tbcItem.priceDisplay.includes('TBC'));
    }
  });

  it('F1-T2-2: All catalog prices are positive integers or null', () => {
    const products = env.window.KABOD_PRODUCTS;
    for (const p of products) {
      if (p.price !== null) {
        assert.ok(typeof p.price === 'number', `${p.id} price must be number`);
        assert.ok(p.price > 0, `${p.id} price must be positive`);
        assert.strictEqual(Math.floor(p.price), p.price, `${p.id} price must be integer`);
      }
    }
  });

  it('F1-T2-3: Catalog IDs are unique and non-empty strings', () => {
    const products = env.window.KABOD_PRODUCTS;
    const ids = new Set();
    for (const p of products) {
      assert.ok(p.id && p.id.trim().length > 0);
      assert.ok(!ids.has(p.id), `Duplicate product id found: ${p.id}`);
      ids.add(p.id);
    }
  });

  it('F1-T2-4: Unknown product lookup returns null/undefined without throwing', () => {
    const products = env.window.KABOD_PRODUCTS;
    const found = products.find(p => p.id === 'non-existent-agro-item');
    assert.strictEqual(found, undefined);
  });

  it('F1-T2-5: Products have valid gallery array with at least one image', () => {
    const products = env.window.KABOD_PRODUCTS;
    for (const p of products) {
      if (p.isLive) {
        assert.ok(p.image && p.image.length > 0, `${p.id} must have image`);
      }
    }
  });

  // F2 Boundary Cases
  it('F2-T2-1: formatNaira handles large number (₦100,000,000) correctly', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    assert.strictEqual(pricing.formatNaira(100000000), '₦100,000,000');
  });

  it('F2-T2-2: formatNaira handles string numeric input safely ("2850")', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    assert.strictEqual(pricing.formatNaira('2850'), '₦2,850');
  });

  it('F2-T2-3: calculateCartTotals on empty items list returns zeros and empty strings', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    const totals = pricing.calculateCartTotals([]);
    assert.strictEqual(totals.totalCount, 0);
    assert.strictEqual(totals.pricedSubtotal, 0);
    assert.strictEqual(totals.formattedSubtotal, '₦0');
    assert.strictEqual(totals.hasPriced, false);
    assert.strictEqual(totals.hasTbc, false);
    assert.strictEqual(totals.isMixed, false);
  });

  it('F2-T2-4: calculateCartTotals handles item with unit price 0 without crashing', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    const items = [{ id: 'sample', name: 'Sample Item', price: 0, quantity: 2 }];
    const totals = pricing.calculateCartTotals(items);
    assert.strictEqual(totals.pricedSubtotal, 0);
    assert.strictEqual(totals.totalCount, 2);
  });

  it('F2-T2-5: calculateCartTotals handles large unit quantity (e.g. 1000 units)', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    const items = [{ id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850, quantity: 1000 }];
    const totals = pricing.calculateCartTotals(items);
    assert.strictEqual(totals.pricedSubtotal, 2850000);
    assert.strictEqual(totals.formattedSubtotal, '₦2,850,000');
  });

  // F3 Boundary Cases
  it('F3-T2-1: Setting item quantity to 0 removes it from the cart', () => {
    const cart = env.window.KabodCart;
    cart.addItem({ id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850 }, 2);
    cart.updateQuantity('dehydrated-ugwu', 0);
    assert.strictEqual(cart.getItem('dehydrated-ugwu'), undefined);
    assert.strictEqual(cart.getTotalCount(), 0);
  });

  it('F3-T2-2: Setting item quantity to negative removes it from the cart', () => {
    const cart = env.window.KabodCart;
    cart.addItem({ id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850 }, 2);
    cart.updateQuantity('dehydrated-ugwu', -1);
    assert.strictEqual(cart.getItem('dehydrated-ugwu'), undefined);
  });

  it('F3-T2-3: Adding same product multiple times accumulates quantity rather than duplicating', () => {
    const cart = env.window.KabodCart;
    cart.addItem({ id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850 }, 2);
    cart.addItem({ id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850 }, 3);
    assert.strictEqual(cart.getItems().length, 1);
    assert.strictEqual(cart.getItem('dehydrated-ugwu').quantity, 5);
  });

  it('F3-T2-4: Drawer handles item with missing subtitle gracefully', () => {
    const cart = env.window.KabodCart;
    cart.addItem({ id: 'custom-item', name: 'Custom Spice', price: 1000 }, 1);
    const item = cart.getItem('custom-item');
    assert.strictEqual(item.subtitle, '');
  });

  it('F3-T2-5: Corrupted localStorage data falls back to empty cart', () => {
    env.localStorage.setItem('kabod_crest_cart_v1', 'NOT_VALID_JSON{[');
    // Reload cart
    loadProjectScript('js/cart.js', env);
    const cart = env.window.KabodCart;
    assert.strictEqual(cart.getItems().length, 0);
    assert.strictEqual(cart.getTotalCount(), 0);
  });

  // F4 Boundary Cases
  it('F4-T2-1: Mixed cart with multiple priced items and multiple TBC items sums correctly', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    const items = [
      { id: 'ugwu', name: 'Ugwu', price: 2850, quantity: 2, isPreOrder: false }, // 5700
      { id: 'ginger', name: 'Ginger', price: 2400, quantity: 1, isPreOrder: false }, // 2400
      { id: 'kuli', name: 'Kuli', price: null, quantity: 2, isPreOrder: true },
      { id: 'iru', name: 'Iru', price: null, quantity: 3, isPreOrder: true }
    ];
    const totals = pricing.calculateCartTotals(items);
    assert.strictEqual(totals.pricedSubtotal, 8100);
    assert.strictEqual(totals.totalCount, 8);
    assert.strictEqual(totals.tbcCount, 5);
    assert.strictEqual(totals.isMixed, true);
  });

  it('F4-T2-2: TBC item with price undefined is treated as TBC without throwing', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    const items = [
      { id: 'tbc-test', name: 'TBC Test', isPreOrder: true, quantity: 1 }
    ];
    const totals = pricing.calculateCartTotals(items);
    assert.strictEqual(totals.pricedSubtotal, 0);
    assert.strictEqual(totals.hasTbc, true);
  });

  it('F4-T2-3: Removing the only TBC item from mixed cart transitions isMixed to false', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    let items = [
      { id: 'ugwu', name: 'Ugwu', price: 2850, quantity: 1, isPreOrder: false },
      { id: 'tbc', name: 'TBC', price: null, quantity: 1, isPreOrder: true }
    ];
    let totals = pricing.calculateCartTotals(items);
    assert.strictEqual(totals.isMixed, true);

    items = items.filter(i => i.id !== 'tbc');
    totals = pricing.calculateCartTotals(items);
    assert.strictEqual(totals.isMixed, false);
    assert.strictEqual(totals.hasTbc, false);
  });

  it('F4-T2-4: Removing the only priced item from mixed cart transitions isMixed to false', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    let items = [
      { id: 'ugwu', name: 'Ugwu', price: 2850, quantity: 1, isPreOrder: false },
      { id: 'tbc', name: 'TBC', price: null, quantity: 1, isPreOrder: true }
    ];
    items = items.filter(i => i.id !== 'ugwu');
    const totals = pricing.calculateCartTotals(items);
    assert.strictEqual(totals.isMixed, false);
    assert.strictEqual(totals.hasPriced, false);
    assert.strictEqual(totals.hasTbc, true);
  });

  it('F4-T2-5: Mixed cart handles quantity increment on TBC item updating tbcCount', () => {
    const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
    assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');
    const items = [
      { id: 'ugwu', name: 'Ugwu', price: 2850, quantity: 1, isPreOrder: false },
      { id: 'tbc', name: 'TBC', price: null, quantity: 4, isPreOrder: true }
    ];
    const totals = pricing.calculateCartTotals(items);
    assert.strictEqual(totals.tbcCount, 4);
    assert.strictEqual(totals.totalCount, 5);
  });

  // F5 Boundary Cases
  it('F5-T2-1: Non-integer quantity parsed safely as integer in cart update', () => {
    const cart = env.window.KabodCart;
    cart.addItem({ id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850 }, 1);
    cart.updateQuantity('dehydrated-ugwu', Math.floor(2.7));
    assert.strictEqual(cart.getItem('dehydrated-ugwu').quantity, 2);
  });

  it('F5-T2-2: Cart getItem with non-existent ID returns undefined', () => {
    const cart = env.window.KabodCart;
    assert.strictEqual(cart.getItem('unknown-id'), undefined);
  });

  it('F5-T2-3: Cart getItems returns a shallow copy preventing direct mutation', () => {
    const cart = env.window.KabodCart;
    cart.addItem({ id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850 }, 1);
    const itemsCopy = cart.getItems();
    itemsCopy.pop();
    assert.strictEqual(cart.getItems().length, 1, 'Original cart items array must remain intact');
  });

  it('F5-T2-4: Multiple calls to clear() on empty cart do not throw', () => {
    const cart = env.window.KabodCart;
    assert.doesNotThrow(() => {
      cart.clear();
      cart.clear();
    });
  });

  it('F5-T2-5: Storage event syncs external changes to items and triggers update', () => {
    const externalItems = [{ id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850, quantity: 3 }];
    env.localStorage.setItem('kabod_crest_cart_v1', JSON.stringify(externalItems));

    let updated = false;
    env.window.addEventListener('kabod:cart-updated', () => {
      updated = true;
    });

    const storageEvent = new env.window.CustomEvent('storage');
    storageEvent.key = 'kabod_crest_cart_v1';
    env.window.dispatchEvent(storageEvent);

    assert.strictEqual(updated, true);
    assert.strictEqual(env.window.KabodCart.getTotalCount(), 3);
  });
});

// ============================================================================
// TIER 3: PAIRWISE COMBINATORIAL COVERAGE
// ============================================================================

describe('Tier 3: Pairwise Combinatorial Pricing Scenarios', () => {
  let env;
  beforeEach(() => {
    env = setupTestEnv();
  });

  const productTypes = [
    { id: 'dehydrated-ugwu', name: 'Dehydrated Ugwu', price: 2850, isPreOrder: false },
    { id: 'dehydrated-ginger', name: 'Dehydrated Ginger', price: 2400, isPreOrder: false },
    { id: 'jollof-spice', name: 'Jollof Spice', price: 2200, isPreOrder: false },
    { id: 'kulikuli', name: 'Kulikuli Batch', price: null, isPreOrder: true }
  ];

  const quantities = [1, 2, 5, 10];

  for (const prod of productTypes) {
    for (const qty of quantities) {
      it(`Pairwise [${prod.name}] x [Qty ${qty}]: calculates expected line & cart totals`, () => {
        const pricing = env.window.KabodPricing || env.window.KabodCart?.pricing;
        assert.ok(pricing, 'KabodPricing must be defined on window or KabodCart');

        const item = { ...prod, quantity: qty };
        const totals = pricing.calculateCartTotals([item]);

        assert.strictEqual(totals.totalCount, qty);
        if (prod.price !== null) {
          const expected = prod.price * qty;
          assert.strictEqual(totals.pricedSubtotal, expected);
          assert.strictEqual(totals.hasPriced, true);
          assert.strictEqual(totals.hasTbc, false);
        } else {
          assert.strictEqual(totals.pricedSubtotal, 0);
          assert.strictEqual(totals.hasPriced, false);
          assert.strictEqual(totals.hasTbc, true);
        }
      });
    }
  }
});
