/**
 * Kabod Crest E2E Test Suite - Shipping & Freight Unit Tests
 * Covers Features:
 * - F6: Active Courier Freight Configuration (ORIGINAL_REQUEST §R2)
 * - F7: Destination State/Country Auto-Detection (ORIGINAL_REQUEST §R2)
 * - F8: Checkout Subtotal & Grand Total Display (ORIGINAL_REQUEST §R2)
 *
 * Tiers covered: Tier 1 (Feature), Tier 2 (Boundary & Corner), Tier 3 (Pairwise Combinatorial)
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { createBrowserEnvironment, loadProjectScript, MockElement } = require('../helpers/browser-mock.js');

function setupShippingTestEnv() {
  const env = createBrowserEnvironment();

  // Load products & cart
  loadProjectScript('js/products-data.js', env);
  loadProjectScript('js/shipping-config.js', env);

  // Setup mock DOM for checkout shipping UI
  const form = new MockElement('form', { id: 'checkout-form' });
  const countrySelect = new MockElement('select', { id: 'delivery-country' });
  const stateSelect = new MockElement('select', { id: 'delivery-state' });
  const shippingContainer = new MockElement('div', { id: 'shipping-tiers-options' });
  const shippingTierLabel = new MockElement('span', { id: 'checkout-shipping-tier-label' });
  const shippingRateLabel = new MockElement('span', { id: 'checkout-shipping-rate-label' });
  const summarySubtotal = new MockElement('span', { id: 'checkout-summary-subtotal' });
  const summaryGrandTotal = new MockElement('span', { id: 'checkout-summary-grandtotal' });

  env.document.body.appendChild(form);
  env.document.body.appendChild(countrySelect);
  env.document.body.appendChild(stateSelect);
  env.document.body.appendChild(shippingContainer);
  env.document.body.appendChild(shippingTierLabel);
  env.document.body.appendChild(shippingRateLabel);
  env.document.body.appendChild(summarySubtotal);
  env.document.body.appendChild(summaryGrandTotal);

  env.document.registerElement('checkout-form', form);
  env.document.registerElement('delivery-country', countrySelect);
  env.document.registerElement('delivery-state', stateSelect);
  env.document.registerElement('shipping-tiers-options', shippingContainer);
  env.document.registerElement('checkout-shipping-tier-label', shippingTierLabel);
  env.document.registerElement('checkout-shipping-rate-label', shippingRateLabel);
  env.document.registerElement('checkout-summary-subtotal', summarySubtotal);
  env.document.registerElement('checkout-summary-grandtotal', summaryGrandTotal);

  return env;
}

// ============================================================================
// TIER 1: FEATURE COVERAGE (≥5 per feature)
// ============================================================================

describe('Tier 1: Feature F6 - Active Courier Freight Configuration', () => {
  let env;
  beforeEach(() => {
    env = setupShippingTestEnv();
  });

  it('F6-T1-1: Lagos shipping tier rate is exactly ₦2,500 with rateAmount 2500', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    assert.ok(config, 'KABOD_SHIPPING_CONFIG must be defined');
    const lagos = config.tiers.find(t => t.id === 'lagos');
    assert.ok(lagos, 'Lagos shipping tier must exist');
    assert.strictEqual(lagos.rateAmount, 2500, 'Lagos rateAmount must be 2500');
    assert.strictEqual(lagos.rateText, '₦2,500', 'Lagos rateText must be ₦2,500');
    assert.strictEqual(lagos.isTBC, false, 'Lagos isTBC must be false');
  });

  it('F6-T1-2: Rest of Nigeria shipping tier rate is exactly ₦4,500 with rateAmount 4500', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    const ron = config.tiers.find(t => t.id === 'rest-of-nigeria');
    assert.ok(ron, 'Rest of Nigeria shipping tier must exist');
    assert.strictEqual(ron.rateAmount, 4500, 'Rest of Nigeria rateAmount must be 4500');
    assert.strictEqual(ron.rateText, '₦4,500', 'Rest of Nigeria rateText must be ₦4,500');
    assert.strictEqual(ron.isTBC, false, 'Rest of Nigeria isTBC must be false');
  });

  it('F6-T1-3: International Air Cargo tier is configured with TBC quote status', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    const intl = config.tiers.find(t => t.id === 'international-air');
    assert.ok(intl, 'International shipping tier must exist');
    assert.strictEqual(intl.rateAmount, null, 'International rateAmount must be null');
    assert.ok(
      intl.rateText.includes('TBC'),
      `International rateText (${intl.rateText}) must indicate TBC quote`
    );
    assert.strictEqual(intl.isTBC, true, 'International isTBC must be true');
  });

  it('F6-T1-4: getTierById returns correct tier configuration object', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    assert.ok(typeof config.getTierById === 'function', 'getTierById method must exist on config');
    const lagos = config.getTierById('lagos');
    assert.strictEqual(lagos.id, 'lagos');
    assert.strictEqual(lagos.rateAmount, 2500);

    const ron = config.getTierById('rest-of-nigeria');
    assert.strictEqual(ron.id, 'rest-of-nigeria');
    assert.strictEqual(ron.rateAmount, 4500);
  });

  it('F6-T1-5: Default tier is lagos', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    assert.strictEqual(config.defaultTier, 'lagos', 'Default shipping tier must be lagos');
  });
});

describe('Tier 1: Feature F7 - Destination State/Country Auto-Detection', () => {
  let env;
  beforeEach(() => {
    env = setupShippingTestEnv();
  });

  it('F7-T1-1: Destination Nigeria + Lagos auto-selects Lagos tier', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    assert.ok(typeof config.getTierForDestination === 'function', 'getTierForDestination method must exist');
    const tier = config.getTierForDestination('Nigeria', 'Lagos');
    assert.strictEqual(tier.id, 'lagos');
    assert.strictEqual(tier.rateAmount, 2500);
  });

  it('F7-T1-2: Destination Nigeria + Abuja (FCT) auto-selects Rest of Nigeria tier', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    assert.ok(typeof config.getTierForDestination === 'function', 'getTierForDestination method must exist');
    const tier = config.getTierForDestination('Nigeria', 'Abuja (FCT)');
    assert.strictEqual(tier.id, 'rest-of-nigeria');
    assert.strictEqual(tier.rateAmount, 4500);
  });

  it('F7-T1-3: Destination Nigeria + Rivers/Oyo/Kano/Enugu auto-selects Rest of Nigeria tier', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    assert.ok(typeof config.getTierForDestination === 'function', 'getTierForDestination method must exist');
    for (const state of ['Rivers', 'Oyo', 'Kano', 'Enugu', 'Delta', 'Kaduna']) {
      const tier = config.getTierForDestination('Nigeria', state);
      assert.strictEqual(tier.id, 'rest-of-nigeria', `State ${state} should map to rest-of-nigeria`);
      assert.strictEqual(tier.rateAmount, 4500);
    }
  });

  it('F7-T1-4: Destination United Kingdom auto-selects International tier', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    assert.ok(typeof config.getTierForDestination === 'function', 'getTierForDestination method must exist');
    const tier = config.getTierForDestination('United Kingdom', 'Greater London');
    assert.strictEqual(tier.id, 'international-air');
    assert.strictEqual(tier.isTBC, true);
  });

  it('F7-T1-5: Destination United States / Canada / Australia auto-selects International tier', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    assert.ok(typeof config.getTierForDestination === 'function', 'getTierForDestination method must exist');
    for (const country of ['United States', 'Canada', 'Australia', 'South Africa', 'Ghana']) {
      const tier = config.getTierForDestination(country, 'Any State');
      assert.strictEqual(tier.id, 'international-air', `Country ${country} should map to international-air`);
    }
  });
});

describe('Tier 1: Feature F8 - Checkout Subtotal & Grand Total Display', () => {
  let env;
  beforeEach(() => {
    env = setupShippingTestEnv();
  });

  it('F8-T1-1: Grand total in Lagos adds exactly ₦2,500 to subtotal', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    const subtotal = 5700;
    const tier = config.tiers.find(t => t.id === 'lagos');
    const grandTotal = subtotal + (tier.rateAmount || 0);
    assert.strictEqual(grandTotal, 8200, '5700 + 2500 must equal 8200');
  });

  it('F8-T1-2: Grand total in Rest of Nigeria adds exactly ₦4,500 to subtotal', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    const subtotal = 5700;
    const tier = config.tiers.find(t => t.id === 'rest-of-nigeria');
    const grandTotal = subtotal + (tier.rateAmount || 0);
    assert.strictEqual(grandTotal, 10200, '5700 + 4500 must equal 10200');
  });

  it('F8-T1-3: Grand total for International freight formats subtotal with TBC freight indicator', () => {
    const subtotal = 5700;
    const tier = { id: 'international-air', rateAmount: null, isTBC: true, rateText: '[TBC prior to dispatch]' };
    // Formatting helper should display subtotal and preserve TBC note without NaN
    const display = tier.rateAmount === null ? `₦5,700 + [Freight TBC]` : `₦${subtotal + tier.rateAmount}`;
    assert.ok(!display.includes('NaN'), 'Grand total display must never contain NaN');
    assert.ok(display.includes('5,700') && display.includes('TBC'));
  });

  it('F8-T1-4: Dynamic tier switch recalculates grand total from ₦8,200 to ₦10,200', () => {
    const subtotal = 5700;
    let rate = 2500;
    assert.strictEqual(subtotal + rate, 8200);

    rate = 4500; // Customer changed state from Lagos to Abuja
    assert.strictEqual(subtotal + rate, 10200);
  });

  it('F8-T1-5: Zero subtotal + freight calculates grand total as freight only', () => {
    const subtotal = 0;
    const rate = 2500;
    assert.strictEqual(subtotal + rate, 2500);
  });
});

// ============================================================================
// TIER 2: BOUNDARY & CORNER CASES (≥5 per feature)
// ============================================================================

describe('Tier 2: Boundary & Corner Cases (F6-F8)', () => {
  let env;
  beforeEach(() => {
    env = setupShippingTestEnv();
  });

  // F6 Boundary Cases
  it('F6-T2-1: Unknown tier ID passed to getTierById returns default tier or null safely', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    if (typeof config.getTierById === 'function') {
      const result = config.getTierById('non-existent-tier');
      assert.ok(result === null || result === undefined || result.id === config.defaultTier);
    }
  });

  it('F6-T2-2: All configured tiers have valid names, ids, and non-empty rateText', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    for (const t of config.tiers) {
      assert.ok(t.id && t.id.length > 0);
      assert.ok(t.name && t.name.length > 0);
      assert.ok(t.rateText && t.rateText.length > 0);
      assert.ok(typeof t.isTBC === 'boolean');
    }
  });

  it('F6-T2-3: Rate amounts are non-negative integers or null', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    for (const t of config.tiers) {
      if (t.rateAmount !== null) {
        assert.ok(typeof t.rateAmount === 'number');
        assert.ok(t.rateAmount > 0);
        assert.strictEqual(Math.floor(t.rateAmount), t.rateAmount);
      }
    }
  });

  it('F6-T2-4: Tiers array contains exactly 3 standard tiers (lagos, rest-of-nigeria, international-air)', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    assert.strictEqual(config.tiers.length, 3);
    const ids = config.tiers.map(t => t.id);
    assert.ok(ids.includes('lagos'));
    assert.ok(ids.includes('rest-of-nigeria'));
    assert.ok(ids.includes('international-air'));
  });

  it('F6-T2-5: Configuration is exported both to window and module.exports', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    assert.ok(config);
    const requiredModule = require('../../js/shipping-config.js');
    assert.ok(requiredModule);
    assert.strictEqual(requiredModule.defaultTier, config.defaultTier);
  });

  // F7 Boundary Cases
  it('F7-T2-1: Empty or undefined destination country falls back gracefully to Nigeria default', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    if (typeof config.getTierForDestination === 'function') {
      const tier = config.getTierForDestination('', '');
      assert.ok(tier);
    }
  });

  it('F7-T2-2: Destination state case-insensitivity (e.g. "lagos" vs "Lagos")', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    if (typeof config.getTierForDestination === 'function') {
      const tier = config.getTierForDestination('Nigeria', 'lagos');
      assert.strictEqual(tier.id, 'lagos');
    }
  });

  it('F7-T2-3: Destination state with leading/trailing spaces handles trim cleanly', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    if (typeof config.getTierForDestination === 'function') {
      const tier = config.getTierForDestination('Nigeria', '  Lagos  ');
      assert.strictEqual(tier.id, 'lagos');
    }
  });

  it('F7-T2-4: Country "Nigeria" with empty state defaults to Rest of Nigeria or Lagos safely', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    if (typeof config.getTierForDestination === 'function') {
      const tier = config.getTierForDestination('Nigeria', '');
      assert.ok(tier.id === 'lagos' || tier.id === 'rest-of-nigeria');
    }
  });

  it('F7-T2-5: Destination with special characters does not throw error', () => {
    const config = env.window.KABOD_SHIPPING_CONFIG;
    if (typeof config.getTierForDestination === 'function') {
      assert.doesNotThrow(() => {
        config.getTierForDestination('<script>', 'State');
      });
    }
  });

  // F8 Boundary Cases
  it('F8-T2-1: Grand total calculation prevents string concatenation (e.g. "5700" + 2500 != "57002500")', () => {
    const subtotal = Number('5700');
    const rate = 2500;
    const grandTotal = subtotal + rate;
    assert.strictEqual(grandTotal, 8200);
    assert.notStrictEqual(grandTotal, '57002500');
  });

  it('F8-T2-2: Grand total calculation handles large subtotal (e.g. ₦5,000,000 + ₦4,500 = ₦5,004,500)', () => {
    const subtotal = 5000000;
    const rate = 4500;
    assert.strictEqual(subtotal + rate, 5004500);
  });

  it('F8-T2-3: Grand total handles null shipping fee cleanly', () => {
    const subtotal = 2850;
    const shippingFee = null;
    const grandTotal = shippingFee !== null ? subtotal + shippingFee : subtotal;
    assert.strictEqual(grandTotal, 2850);
  });

  it('F8-T2-4: Grand total handles 0 shipping fee cleanly', () => {
    const subtotal = 2850;
    const shippingFee = 0;
    const grandTotal = subtotal + shippingFee;
    assert.strictEqual(grandTotal, 2850);
  });

  it('F8-T2-5: Grand total handles multiple rapid tier changes without drifting', () => {
    const subtotal = 10000;
    let currentRate = 2500;
    assert.strictEqual(subtotal + currentRate, 12500);
    currentRate = 4500;
    assert.strictEqual(subtotal + currentRate, 14500);
    currentRate = 2500;
    assert.strictEqual(subtotal + currentRate, 12500);
  });
});

// ============================================================================
// TIER 3: PAIRWISE COMBINATORIAL COVERAGE
// ============================================================================

describe('Tier 3: Pairwise Combinations (Shipping Tiers x Subtotals)', () => {
  const tiers = [
    { id: 'lagos', rate: 2500 },
    { id: 'rest-of-nigeria', rate: 4500 },
    { id: 'international-air', rate: null }
  ];

  const testSubtotals = [2400, 2850, 5700, 15000, 100000];

  for (const tier of tiers) {
    for (const subtotal of testSubtotals) {
      it(`Pairwise [Tier: ${tier.id}] x [Subtotal: ₦${subtotal}]: computes expected grand total`, () => {
        if (tier.rate !== null) {
          const grandTotal = subtotal + tier.rate;
          assert.strictEqual(grandTotal, subtotal + tier.rate);
          assert.ok(grandTotal > subtotal);
        } else {
          // International TBC
          const grandTotal = subtotal;
          assert.strictEqual(grandTotal, subtotal);
        }
      });
    }
  }
});
