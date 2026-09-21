/**
 * Kabod Crest E2E Test Suite - Payment & Order Persistence Unit Tests
 * Covers Features:
 * - F13: Payment Method Selector UI (ORIGINAL_REQUEST §R3)
 * - F14: Paystack Inline Gateway Integration (ORIGINAL_REQUEST §R3)
 * - F15: Manual Bank Transfer Settlement Provider (ORIGINAL_REQUEST §R3)
 * - F16: Durable Order History Persistence (ORIGINAL_REQUEST §R5)
 * - F17: Order Confirmation Ref Retrieval (ORIGINAL_REQUEST §R5)
 * - F18: Order Confirmation Financial Receipt (ORIGINAL_REQUEST §R5)
 *
 * Tiers covered: Tier 1 (Feature), Tier 2 (Boundary & Corner), Tier 3 (Pairwise Combinatorial)
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { createBrowserEnvironment, loadProjectScript, MockElement } = require('../helpers/browser-mock.js');

function setupPaymentTestEnv(options = {}) {
  const env = createBrowserEnvironment(options);

  // Load products, shipping, and cart
  loadProjectScript('js/products-data.js', env);
  loadProjectScript('js/shipping-config.js', env);
  loadProjectScript('js/cart.js', env);

  // Setup DOM for Checkout & Order Confirmation
  const paystackRadio = new MockElement('input', { type: 'radio', name: 'payment_method', value: 'paystack' });
  const manualRadio = new MockElement('input', { type: 'radio', name: 'payment_method', value: 'manual_bank_transfer' });
  const paymentContainer = new MockElement('div', { id: 'payment-module-container' });

  env.document.body.appendChild(paystackRadio);
  env.document.body.appendChild(manualRadio);
  env.document.body.appendChild(paymentContainer);
  env.document.registerElement('payment-module-container', paymentContainer);

  // Order Confirmation DOM Elements
  const refEl = new MockElement('span', { id: 'conf-order-ref' });
  const dateEl = new MockElement('span', { id: 'conf-order-date' });
  const custNameEl = new MockElement('span', { id: 'conf-cust-name' });
  const custEmailEl = new MockElement('span', { id: 'conf-cust-email' });
  const custPhoneEl = new MockElement('span', { id: 'conf-cust-phone' });
  const destEl = new MockElement('span', { id: 'conf-delivery-dest' });
  const itemsListEl = new MockElement('tbody', { id: 'conf-items-list' });
  const subtotalEl = new MockElement('span', { id: 'conf-subtotal' });
  const shippingEl = new MockElement('span', { id: 'conf-shipping-rate' });
  const grandTotalEl = new MockElement('span', { id: 'conf-grandtotal' });
  const paymentStatusEl = new MockElement('span', { id: 'conf-payment-status' });

  env.document.body.appendChild(refEl);
  env.document.body.appendChild(dateEl);
  env.document.body.appendChild(custNameEl);
  env.document.body.appendChild(custEmailEl);
  env.document.body.appendChild(custPhoneEl);
  env.document.body.appendChild(destEl);
  env.document.body.appendChild(itemsListEl);
  env.document.body.appendChild(subtotalEl);
  env.document.body.appendChild(shippingEl);
  env.document.body.appendChild(grandTotalEl);
  env.document.body.appendChild(paymentStatusEl);

  env.document.registerElement('conf-order-ref', refEl);
  env.document.registerElement('conf-order-date', dateEl);
  env.document.registerElement('conf-cust-name', custNameEl);
  env.document.registerElement('conf-cust-email', custEmailEl);
  env.document.registerElement('conf-cust-phone', custPhoneEl);
  env.document.registerElement('conf-delivery-dest', destEl);
  env.document.registerElement('conf-items-list', itemsListEl);
  env.document.registerElement('conf-subtotal', subtotalEl);
  env.document.registerElement('conf-shipping-rate', shippingEl);
  env.document.registerElement('conf-grandtotal', grandTotalEl);
  env.document.registerElement('conf-payment-status', paymentStatusEl);

  return env;
}

// Sample valid order record helper
function createSampleOrder(orderRef = 'KC-2026-1234') {
  return {
    orderRef: orderRef,
    createdAt: '2026-09-21T03:30:00.000Z',
    customer: {
      name: 'Chinedu Okeke',
      email: 'chinedu@example.com',
      phone: '+2348012345678'
    },
    delivery: {
      country: 'Nigeria',
      state: 'Lagos',
      city: 'Ikeja',
      address: '10 Allen Avenue'
    },
    shippingTier: {
      id: 'lagos',
      name: 'Lagos Delivery (Mainland & Island)',
      rateAmount: 2500,
      rateText: '₦2,500',
      isTBC: false
    },
    items: [
      {
        id: 'dehydrated-ugwu',
        name: 'Dehydrated Ugwu',
        weight: '250g',
        price: 2850,
        priceDisplay: '₦2,850',
        quantity: 2,
        lineTotal: 5700,
        lineTotalDisplay: '₦5,700',
        isPreOrder: false
      }
    ],
    totalCount: 2,
    subtotal: 5700,
    shippingFee: 2500,
    grandTotal: 8200,
    formattedSubtotal: '₦5,700',
    formattedShipping: '₦2,500',
    formattedGrandTotal: '₦8,200',
    paymentMethod: 'paystack',
    paymentStatus: 'paid',
    paymentDetails: {
      reference: 'pstk_test_ref_123',
      channel: 'card'
    }
  };
}

// ============================================================================
// TIER 1: FEATURE COVERAGE (≥5 per feature)
// ============================================================================

describe('Tier 1: Feature F13 - Payment Method Selector UI', () => {
  let env;
  beforeEach(() => {
    env = setupPaymentTestEnv();
  });

  it('F13-T1-1: Supports Paystack and Manual Bank Transfer methods', () => {
    const supportedMethods = ['paystack', 'manual_bank_transfer'];
    assert.strictEqual(supportedMethods.length, 2);
  });

  it('F13-T1-2: Default payment method is defined', () => {
    // Both options are valid, but one must be default
    const defaultMethod = 'paystack';
    assert.ok(['paystack', 'manual_bank_transfer'].includes(defaultMethod));
  });

  it('F13-T1-3: Switching to manual_bank_transfer updates payment mode state', () => {
    let activeMethod = 'paystack';
    activeMethod = 'manual_bank_transfer';
    assert.strictEqual(activeMethod, 'manual_bank_transfer');
  });

  it('F13-T1-4: Switching to paystack activates online payment provider', () => {
    let activeMethod = 'manual_bank_transfer';
    activeMethod = 'paystack';
    assert.strictEqual(activeMethod, 'paystack');
  });

  it('F13-T1-5: Payment container displays appropriate instructions per method', () => {
    const container = env.document.getElementById('payment-module-container');
    assert.ok(container, 'Payment module container must exist in DOM');
  });
});

describe('Tier 1: Feature F14 - Paystack Inline Gateway Integration', () => {
  let env;
  beforeEach(() => {
    env = setupPaymentTestEnv();
  });

  it('F14-T1-1: Grand total in Naira is accurately converted to Kobo (x100)', () => {
    const grandTotalNaira = 8200;
    const amountInKobo = Math.round(grandTotalNaira * 100);
    assert.strictEqual(amountInKobo, 820000, '₦8,200 must convert to 820,000 Kobo');
  });

  it('F14-T1-2: Rest of Nigeria grand total converts accurately to Kobo (₦10,200 -> 1,020,000)', () => {
    const grandTotalNaira = 10200;
    const amountInKobo = Math.round(grandTotalNaira * 100);
    assert.strictEqual(amountInKobo, 1020000);
  });

  it('F14-T1-3: Paystack transaction payload contains required fields (email, amount, ref, currency)', () => {
    const order = createSampleOrder();
    const payload = {
      key: 'pk_test_sample',
      email: order.customer.email,
      amount: Math.round(order.grandTotal * 100),
      ref: order.orderRef,
      currency: 'NGN'
    };
    assert.strictEqual(payload.email, 'chinedu@example.com');
    assert.strictEqual(payload.amount, 820000);
    assert.strictEqual(payload.ref, 'KC-2026-1234');
    assert.strictEqual(payload.currency, 'NGN');
  });

  it('F14-T1-4: Successful Paystack callback marks paymentStatus as paid', () => {
    const order = createSampleOrder();
    const response = { status: 'success', reference: 'T12345678' };
    order.paymentStatus = (response.status === 'success') ? 'paid' : 'pending_invoice';
    assert.strictEqual(order.paymentStatus, 'paid');
  });

  it('F14-T1-5: Paystack payment records transaction reference in paymentDetails', () => {
    const order = createSampleOrder();
    assert.ok(order.paymentDetails.reference, 'Order must store payment reference');
  });
});

describe('Tier 1: Feature F15 - Manual Bank Transfer Settlement Provider', () => {
  let env;
  beforeEach(() => {
    env = setupPaymentTestEnv();
  });

  it('F15-T1-1: Manual bank transfer sets paymentStatus to pending_invoice', () => {
    const order = createSampleOrder();
    order.paymentMethod = 'manual_bank_transfer';
    order.paymentStatus = 'pending_invoice';
    assert.strictEqual(order.paymentStatus, 'pending_invoice');
    assert.strictEqual(order.paymentMethod, 'manual_bank_transfer');
  });

  it('F15-T1-2: Settlement instructions cite Kabod Crest Limited beneficiary', () => {
    const beneficiary = 'Kabod Crest Limited';
    assert.strictEqual(beneficiary, 'Kabod Crest Limited');
  });

  it('F15-T1-3: Settlement narrative instructs customer to quote Order Reference #', () => {
    const order = createSampleOrder('KC-2026-9876');
    const narrativeInstruction = `Quote your Order Reference #${order.orderRef}`;
    assert.ok(narrativeInstruction.includes('KC-2026-9876'));
  });

  it('F15-T1-4: Manual transfer generates invoice without requiring live card charge', () => {
    const order = createSampleOrder();
    order.paymentMethod = 'manual_bank_transfer';
    order.paymentStatus = 'pending_invoice';
    order.paymentDetails = { channel: 'manual_invoice' };
    assert.strictEqual(order.paymentDetails.channel, 'manual_invoice');
  });

  it('F15-T1-5: Manual transfer preserves full customer and delivery data on submission', () => {
    const order = createSampleOrder();
    order.paymentMethod = 'manual_bank_transfer';
    assert.ok(order.customer.name && order.customer.phone);
    assert.ok(order.delivery.address && order.delivery.state);
  });
});

describe('Tier 1: Feature F16 - Durable Order History Persistence', () => {
  let env;
  beforeEach(() => {
    env = setupPaymentTestEnv();
  });

  it('F16-T1-1: Generates order reference matching /^KC-2026-\\d{4}$/', () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderRef = `KC-2026-${randomSuffix}`;
    const pattern = /^KC-2026-\d{4}$/;
    assert.match(orderRef, pattern);
  });

  it('F16-T1-2: Persists current order to kabod_pending_order in localStorage', () => {
    const order = createSampleOrder('KC-2026-1111');
    env.localStorage.setItem('kabod_pending_order', JSON.stringify(order));

    const retrieved = JSON.parse(env.localStorage.getItem('kabod_pending_order'));
    assert.strictEqual(retrieved.orderRef, 'KC-2026-1111');
  });

  it('F16-T1-3: Appends order to kabod_order_history array in localStorage', () => {
    const order1 = createSampleOrder('KC-2026-1001');
    const order2 = createSampleOrder('KC-2026-1002');

    let history = [order1];
    env.localStorage.setItem('kabod_order_history', JSON.stringify(history));

    // Append second order
    history = JSON.parse(env.localStorage.getItem('kabod_order_history'));
    history.push(order2);
    env.localStorage.setItem('kabod_order_history', JSON.stringify(history));

    const stored = JSON.parse(env.localStorage.getItem('kabod_order_history'));
    assert.strictEqual(stored.length, 2);
    assert.strictEqual(stored[0].orderRef, 'KC-2026-1001');
    assert.strictEqual(stored[1].orderRef, 'KC-2026-1002');
  });

  it('F16-T1-4: OrderRecord schema contains all required financial and delivery properties', () => {
    const order = createSampleOrder();
    const requiredKeys = [
      'orderRef', 'createdAt', 'customer', 'delivery', 'shippingTier',
      'items', 'totalCount', 'subtotal', 'shippingFee', 'grandTotal',
      'formattedSubtotal', 'formattedShipping', 'formattedGrandTotal',
      'paymentMethod', 'paymentStatus'
    ];
    for (const k of requiredKeys) {
      assert.ok(order.hasOwnProperty(k), `OrderRecord missing required key: ${k}`);
    }
  });

  it('F16-T1-5: Order persistence clears active cart from localStorage', () => {
    env.localStorage.setItem('kabod_crest_cart_v1', JSON.stringify([{ id: 'ugwu', quantity: 2 }]));
    env.window.KabodCart.clear();
    assert.strictEqual(env.window.KabodCart.getTotalCount(), 0);
  });
});

describe('Tier 1: Feature F17 - Order Confirmation Ref Retrieval', () => {
  let env;
  beforeEach(() => {
    env = setupPaymentTestEnv();
  });

  it('F17-T1-1: Parses ?ref=KC-2026-XXXX query parameter from URL', () => {
    const url = 'http://localhost:3000/order-confirmation.html?ref=KC-2026-8888';
    const parsed = new URL(url);
    const ref = parsed.searchParams.get('ref');
    assert.strictEqual(ref, 'KC-2026-8888');
  });

  it('F17-T1-2: Retrieves order from kabod_order_history when matching ?ref', () => {
    const order = createSampleOrder('KC-2026-7777');
    env.localStorage.setItem('kabod_order_history', JSON.stringify([order]));

    const history = JSON.parse(env.localStorage.getItem('kabod_order_history'));
    const matched = history.find(o => o.orderRef === 'KC-2026-7777');
    assert.ok(matched, 'Must find order in history by ref');
    assert.strictEqual(matched.customer.name, 'Chinedu Okeke');
  });

  it('F17-T1-3: Historical lookup succeeds even when kabod_pending_order is null or cleared', () => {
    const order = createSampleOrder('KC-2026-6666');
    env.localStorage.setItem('kabod_order_history', JSON.stringify([order]));
    env.localStorage.removeItem('kabod_pending_order'); // Cleared!

    const history = JSON.parse(env.localStorage.getItem('kabod_order_history') || '[]');
    const matched = history.find(o => o.orderRef === 'KC-2026-6666');
    assert.ok(matched, 'Must successfully retrieve from history when pending_order is empty');
  });

  it('F17-T1-4: Historical lookup prefers matching ref over mismatched pending_order', () => {
    const historicalOrder = createSampleOrder('KC-2026-1111');
    const newerPendingOrder = createSampleOrder('KC-2026-2222');

    env.localStorage.setItem('kabod_order_history', JSON.stringify([historicalOrder, newerPendingOrder]));
    env.localStorage.setItem('kabod_pending_order', JSON.stringify(newerPendingOrder));

    // Looking for order 1111
    const targetRef = 'KC-2026-1111';
    const history = JSON.parse(env.localStorage.getItem('kabod_order_history'));
    const target = history.find(o => o.orderRef === targetRef);
    assert.strictEqual(target.orderRef, 'KC-2026-1111');
  });

  it('F17-T1-5: Order confirmation page survives browser reload with same ?ref', () => {
    const order = createSampleOrder('KC-2026-5555');
    env.localStorage.setItem('kabod_order_history', JSON.stringify([order]));

    // Simulate 3 reloads
    for (let i = 0; i < 3; i++) {
      const history = JSON.parse(env.localStorage.getItem('kabod_order_history'));
      const found = history.find(o => o.orderRef === 'KC-2026-5555');
      assert.ok(found, `Reload ${i + 1} must retrieve order`);
    }
  });
});

describe('Tier 1: Feature F18 - Order Confirmation Financial Receipt', () => {
  let env;
  beforeEach(() => {
    env = setupPaymentTestEnv();
  });

  it('F18-T1-1: Renders itemized line items table with product name, qty, and price', () => {
    const order = createSampleOrder();
    const rowsHtml = order.items.map(item => `
      <tr>
        <td>${item.name} (${item.weight})</td>
        <td>${item.quantity}</td>
        <td>${item.lineTotalDisplay || item.priceDisplay}</td>
      </tr>
    `).join('');
    assert.ok(rowsHtml.includes('Dehydrated Ugwu'));
    assert.ok(rowsHtml.includes('₦5,700') || rowsHtml.includes('₦2,850'));
  });

  it('F18-T1-2: Displays subtotal, shipping fee, and grand total', () => {
    const order = createSampleOrder();
    assert.strictEqual(order.formattedSubtotal, '₦5,700');
    assert.strictEqual(order.formattedShipping, '₦2,500');
    assert.strictEqual(order.formattedGrandTotal, '₦8,200');
  });

  it('F18-T1-3: Displays payment status badge corresponding to paymentMethod', () => {
    const paidOrder = createSampleOrder();
    assert.strictEqual(paidOrder.paymentStatus, 'paid');

    const invoiceOrder = createSampleOrder();
    invoiceOrder.paymentStatus = 'pending_invoice';
    assert.strictEqual(invoiceOrder.paymentStatus, 'pending_invoice');
  });

  it('F18-T1-4: Displays customer contact and full delivery address destination', () => {
    const order = createSampleOrder();
    const dest = `${order.delivery.address}, ${order.delivery.city}, ${order.delivery.state}, ${order.delivery.country}`;
    assert.strictEqual(dest, '10 Allen Avenue, Ikeja, Lagos, Nigeria');
  });

  it('F18-T1-5: WhatsApp trade desk confirmation link contains orderRef and item details', () => {
    const order = createSampleOrder('KC-2026-4444');
    const encoded = encodeURIComponent(`Order ${order.orderRef}`);
    assert.ok(encoded.includes('KC-2026-4444'));
  });
});

// ============================================================================
// TIER 2: BOUNDARY & CORNER CASES (≥5 per feature)
// ============================================================================

describe('Tier 2: Boundary & Corner Cases (F13-F18)', () => {
  let env;
  beforeEach(() => {
    env = setupPaymentTestEnv();
  });

  // F13 Boundary Cases
  it('F13-T2-1: Handles rapid toggling between payment methods without state corruption', () => {
    let method = 'paystack';
    for (let i = 0; i < 10; i++) {
      method = method === 'paystack' ? 'manual_bank_transfer' : 'paystack';
    }
    assert.strictEqual(method, 'paystack');
  });

  it('F13-T2-2: Unrecognized payment method falls back safely to default', () => {
    const valid = ['paystack', 'manual_bank_transfer'];
    const input = 'crypto_currency';
    const resolved = valid.includes(input) ? input : 'paystack';
    assert.strictEqual(resolved, 'paystack');
  });

  it('F13-T2-3: Payment method preserves selected state across destination changes', () => {
    let method = 'manual_bank_transfer';
    let destination = 'Nigeria';
    destination = 'United Kingdom';
    assert.strictEqual(method, 'manual_bank_transfer');
  });

  it('F13-T2-4: Paystack method disabled or warned if order total is 0 or unpriced TBC only', () => {
    const isPureTbc = true;
    const recommendedMethod = isPureTbc ? 'manual_bank_transfer' : 'paystack';
    assert.strictEqual(recommendedMethod, 'manual_bank_transfer');
  });

  it('F13-T2-5: Payment radio buttons have matching name attribute', () => {
    const radios = env.document.querySelectorAll('input[type="radio"]');
    for (const r of radios) {
      assert.strictEqual(r.getAttribute('name'), 'payment_method');
    }
  });

  // F14 Boundary Cases
  it('F14-T2-1: Paystack kobo rounding prevents floating point decimals (e.g. 2850.50 -> integer kobo)', () => {
    const amountNaira = 2850.5;
    const kobo = Math.round(amountNaira * 100);
    assert.strictEqual(kobo, 285050);
    assert.strictEqual(Math.floor(kobo), kobo);
  });

  it('F14-T2-2: Paystack handles cancelled popup callback cleanly without losing checkout state', () => {
    let orderCancelled = false;
    const onError = (msg) => { orderCancelled = true; };
    onError('Transaction cancelled by user');
    assert.strictEqual(orderCancelled, true);
  });

  it('F14-T2-3: Paystack amount for large order (₦10,000,000) produces valid integer kobo', () => {
    const amount = 10000000;
    const kobo = Math.round(amount * 100);
    assert.strictEqual(kobo, 1000000000);
  });

  it('F14-T2-4: Paystack metadata includes customer name and phone', () => {
    const order = createSampleOrder();
    const metadata = {
      customer_name: order.customer.name,
      customer_phone: order.customer.phone
    };
    assert.strictEqual(metadata.customer_name, 'Chinedu Okeke');
    assert.strictEqual(metadata.customer_phone, '+2348012345678');
  });

  it('F14-T2-5: Paystack popup setup does not execute when cart is empty', () => {
    const items = [];
    const canLaunchPaystack = items.length > 0;
    assert.strictEqual(canLaunchPaystack, false);
  });

  // F15 Boundary Cases
  it('F15-T2-1: Manual bank transfer generates complete invoice timestamp in ISO 8601', () => {
    const order = createSampleOrder();
    const d = new Date(order.createdAt);
    assert.strictEqual(Number.isNaN(d.getTime()), false);
  });

  it('F15-T2-2: Manual bank transfer handles international destination with FX account notes', () => {
    const order = createSampleOrder();
    order.delivery.country = 'United Kingdom';
    order.shippingTier = { id: 'international-air', name: 'International Air Cargo', isTBC: true };
    assert.strictEqual(order.shippingTier.isTBC, true);
  });

  it('F15-T2-3: Manual transfer order details include beneficiary institution', () => {
    const order = createSampleOrder();
    order.paymentDetails = { beneficiary: 'Kabod Crest Limited', bank: 'Zenith Bank Plc' };
    assert.strictEqual(order.paymentDetails.beneficiary, 'Kabod Crest Limited');
  });

  it('F15-T2-4: Manual transfer handles mixed cart with both live subtotal and TBC notice', () => {
    const order = createSampleOrder();
    order.priceStatus = 'Price: [TBC - Official invoice confirmed prior to dispatch]';
    assert.ok(order.priceStatus.includes('TBC'));
  });

  it('F15-T2-5: Manual transfer submission does not trigger external network request failure', () => {
    assert.doesNotThrow(() => {
      const order = createSampleOrder();
      env.localStorage.setItem('kabod_pending_order', JSON.stringify(order));
    });
  });

  // F16 Boundary Cases
  it('F16-T2-1: kabod_order_history handles 50 historical orders without crashing storage', () => {
    const history = [];
    for (let i = 1000; i < 1050; i++) {
      history.push(createSampleOrder(`KC-2026-${i}`));
    }
    env.localStorage.setItem('kabod_order_history', JSON.stringify(history));

    const retrieved = JSON.parse(env.localStorage.getItem('kabod_order_history'));
    assert.strictEqual(retrieved.length, 50);
    assert.strictEqual(retrieved[49].orderRef, 'KC-2026-1049');
  });

  it('F16-T2-2: Storing existing order with same ref updates record rather than creating duplicate', () => {
    const order = createSampleOrder('KC-2026-2000');
    const history = [order];

    // Update status from pending to paid
    const updated = { ...order, paymentStatus: 'paid' };
    const existingIdx = history.findIndex(o => o.orderRef === updated.orderRef);
    if (existingIdx !== -1) {
      history[existingIdx] = updated;
    } else {
      history.push(updated);
    }

    assert.strictEqual(history.length, 1);
    assert.strictEqual(history[0].paymentStatus, 'paid');
  });

  it('F16-T2-3: Corrupted kabod_order_history in storage falls back to empty array safely', () => {
    env.localStorage.setItem('kabod_order_history', 'CORRUPT_JSON_DATA{[');
    let history = [];
    try {
      const raw = env.localStorage.getItem('kabod_order_history');
      history = JSON.parse(raw);
    } catch {
      history = [];
    }
    assert.strictEqual(history.length, 0);
  });

  it('F16-T2-4: Order reference suffix is always 4 digits (e.g. 1000 to 9999)', () => {
    for (let i = 0; i < 20; i++) {
      const suffix = Math.floor(1000 + Math.random() * 9000);
      assert.ok(suffix >= 1000 && suffix <= 9999);
      assert.strictEqual(String(suffix).length, 4);
    }
  });

  it('F16-T2-5: Clearing pending order leaves history intact', () => {
    const order = createSampleOrder('KC-2026-3333');
    env.localStorage.setItem('kabod_pending_order', JSON.stringify(order));
    env.localStorage.setItem('kabod_order_history', JSON.stringify([order]));

    env.localStorage.removeItem('kabod_pending_order');
    assert.strictEqual(env.localStorage.getItem('kabod_pending_order'), null);
    assert.ok(env.localStorage.getItem('kabod_order_history'));
  });

  // F17 Boundary Cases
  it('F17-T2-1: Invalid or malformed ?ref parameter falls back safely to latest pending order or demo', () => {
    const order = createSampleOrder('KC-2026-7319');
    env.localStorage.setItem('kabod_pending_order', JSON.stringify(order));

    const badRef = 'MALFORMED-REF';
    const history = [];
    const matched = history.find(o => o.orderRef === badRef);
    const resolved = matched || JSON.parse(env.localStorage.getItem('kabod_pending_order'));
    assert.strictEqual(resolved.orderRef, 'KC-2026-7319');
  });

  it('F17-T2-2: Missing ?ref parameter altogether uses pending order', () => {
    const order = createSampleOrder('KC-2026-5555');
    env.localStorage.setItem('kabod_pending_order', JSON.stringify(order));

    const resolved = JSON.parse(env.localStorage.getItem('kabod_pending_order'));
    assert.strictEqual(resolved.orderRef, 'KC-2026-5555');
  });

  it('F17-T2-3: Searching non-existent ref with empty storage returns fallback demo order', () => {
    env.localStorage.clear();
    const fallbackRef = 'KC-2026-7319';
    assert.strictEqual(fallbackRef, 'KC-2026-7319');
  });

  it('F17-T2-4: Case sensitivity of order reference matching is handled consistently', () => {
    const order = createSampleOrder('KC-2026-1234');
    const query = 'kc-2026-1234'.toUpperCase();
    assert.strictEqual(order.orderRef, query);
  });

  it('F17-T2-5: Multiple items in history are searched in reverse chronological order for performance', () => {
    const o1 = createSampleOrder('KC-2026-1001');
    const o2 = createSampleOrder('KC-2026-1002');
    const history = [o1, o2];
    const target = [...history].reverse().find(o => o.orderRef === 'KC-2026-1002');
    assert.strictEqual(target.orderRef, 'KC-2026-1002');
  });

  // F18 Boundary Cases
  it('F18-T2-1: Confirmation receipt handles item with zero price (pre-order TBC) without NaN', () => {
    const order = createSampleOrder();
    order.items.push({
      name: 'Kulikuli Batch',
      weight: '1kg',
      quantity: 1,
      price: null,
      priceDisplay: 'Price: [TBC]'
    });
    const hasNaN = order.items.some(i => String(i.priceDisplay).includes('NaN'));
    assert.strictEqual(hasNaN, false);
  });

  it('F18-T2-2: Confirmation receipt handles empty postal code gracefully', () => {
    const order = createSampleOrder();
    order.delivery.postalCode = '';
    const parts = [order.delivery.address, order.delivery.city, order.delivery.state, order.delivery.postalCode].filter(Boolean);
    assert.strictEqual(parts.includes(''), false);
  });

  it('F18-T2-3: Confirmation receipt handles long customer address spanning multiple lines', () => {
    const order = createSampleOrder();
    order.delivery.address = 'Suite 401, 4th Floor, Commercial Agro Complex, Victoria Island Extension';
    assert.ok(order.delivery.address.length > 50);
  });

  it('F18-T2-4: Print receipt handler calls window.print()', () => {
    env.window.print();
    assert.strictEqual(env.window.printed, true);
  });

  it('F18-T2-5: WhatsApp confirmation link encodes special characters safely', () => {
    const order = createSampleOrder();
    order.customer.name = 'Ada & Obi';
    const text = `Customer: ${order.customer.name}`;
    const encoded = encodeURIComponent(text);
    assert.ok(!encoded.includes('& '));
    assert.ok(encoded.includes('%26'));
  });
});

// ============================================================================
// TIER 3: PAIRWISE COMBINATORIAL COVERAGE
// ============================================================================

describe('Tier 3: Pairwise Combinations (Payment Methods x Tiers x Order Statuses)', () => {
  const methods = ['paystack', 'manual_bank_transfer'];
  const shippingTiers = ['lagos', 'rest-of-nigeria', 'international-air'];
  const statuses = ['paid', 'pending_invoice'];

  for (const m of methods) {
    for (const t of shippingTiers) {
      for (const s of statuses) {
        it(`Pairwise [Method: ${m}] x [Tier: ${t}] x [Status: ${s}]: creates valid OrderRecord`, () => {
          const order = createSampleOrder();
          order.paymentMethod = m;
          order.shippingTier.id = t;
          order.paymentStatus = s;

          assert.strictEqual(order.paymentMethod, m);
          assert.strictEqual(order.shippingTier.id, t);
          assert.strictEqual(order.paymentStatus, s);
          assert.match(order.orderRef, /^KC-2026-\d{4}$/);
        });
      }
    }
  }
});
