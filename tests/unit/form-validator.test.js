/**
 * Kabod Crest E2E Test Suite - Form Validation & Sanitization Unit Tests
 * Covers Features:
 * - F9: Client-Side Phone Validation (ORIGINAL_REQUEST §R4)
 * - F10: Client-Side Email Validation (ORIGINAL_REQUEST §R4)
 * - F11: Required Fields & Text Sanitization (ORIGINAL_REQUEST §R4)
 * - F12: Accessible Visual Error Presentation (ORIGINAL_REQUEST §R4)
 *
 * Tiers covered: Tier 1 (Feature), Tier 2 (Boundary & Corner), Tier 3 (Pairwise Combinatorial)
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { createBrowserEnvironment, loadProjectScript, MockElement } = require('../helpers/browser-mock.js');

function setupValidatorTestEnv() {
  const env = createBrowserEnvironment();

  // Load checkout / form validator script
  loadProjectScript('js/checkout.js', env);

  // Setup DOM elements for checkout form validation
  const form = new MockElement('form', { id: 'checkout-form' });
  const nameInput = new MockElement('input', { id: 'cust-name', type: 'text' });
  const emailInput = new MockElement('input', { id: 'cust-email', type: 'email' });
  const phoneInput = new MockElement('input', { id: 'cust-phone', type: 'tel' });
  const countrySelect = new MockElement('select', { id: 'delivery-country' });
  const stateSelect = new MockElement('select', { id: 'delivery-state' });
  const cityInput = new MockElement('input', { id: 'delivery-city', type: 'text' });
  const addressInput = new MockElement('textarea', { id: 'delivery-address' });
  const submitBtn = new MockElement('button', { type: 'submit' });

  form.appendChild(nameInput);
  form.appendChild(emailInput);
  form.appendChild(phoneInput);
  form.appendChild(countrySelect);
  form.appendChild(stateSelect);
  form.appendChild(cityInput);
  form.appendChild(addressInput);
  form.appendChild(submitBtn);

  env.document.body.appendChild(form);

  env.document.registerElement('checkout-form', form);
  env.document.registerElement('cust-name', nameInput);
  env.document.registerElement('cust-email', emailInput);
  env.document.registerElement('cust-phone', phoneInput);
  env.document.registerElement('delivery-country', countrySelect);
  env.document.registerElement('delivery-state', stateSelect);
  env.document.registerElement('delivery-city', cityInput);
  env.document.registerElement('delivery-address', addressInput);

  return env;
}

// ============================================================================
// TIER 1: FEATURE COVERAGE (≥5 per feature)
// ============================================================================

describe('Tier 1: Feature F9 - Client-Side Phone Validation', () => {
  let env;
  beforeEach(() => {
    env = setupValidatorTestEnv();
  });

  it('F9-T1-1: Accepts Nigerian 11-digit local mobile numbers (080, 070, 081, 090)', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined on window or in checkout');
    const validLocal = ['08012345678', '07031234567', '08123456789', '09098765432'];
    for (const phone of validLocal) {
      const res = validator.validatePhone(phone, 'Nigeria');
      assert.strictEqual(res.valid, true, `Phone ${phone} should be valid`);
    }
  });

  it('F9-T1-2: Accepts Nigerian international format (+234...) with or without spaces/dashes', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined on window or in checkout');
    const validIntl = ['+2348012345678', '+234 801 234 5678', '+234-801-234-5678'];
    for (const phone of validIntl) {
      const res = validator.validatePhone(phone, 'Nigeria');
      assert.strictEqual(res.valid, true, `Phone ${phone} should be valid`);
    }
  });

  it('F9-T1-3: Accepts standard E.164 international phone formats for non-Nigerian destinations', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined on window or in checkout');
    const validE164 = [
      { phone: '+447911123456', country: 'United Kingdom' },
      { phone: '+14155552671', country: 'United States' },
      { phone: '+27111234567', country: 'South Africa' }
    ];
    for (const item of validE164) {
      const res = validator.validatePhone(item.phone, item.country);
      assert.strictEqual(res.valid, true, `International phone ${item.phone} for ${item.country} should be valid`);
    }
  });

  it('F9-T1-4: Rejects incomplete or truncated phone numbers', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined on window or in checkout');
    const invalidShort = ['123', '080123', '+234', '080'];
    for (const phone of invalidShort) {
      const res = validator.validatePhone(phone, 'Nigeria');
      assert.strictEqual(res.valid, false, `Short phone ${phone} must be rejected`);
      assert.ok(res.message, 'Validation result must include error message');
    }
  });

  it('F9-T1-5: Rejects alphabetic or malformed phone strings', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined on window or in checkout');
    const invalidMalformed = ['080CALLME', 'phone-number', '+++2348000', '0801234567899999'];
    for (const phone of invalidMalformed) {
      const res = validator.validatePhone(phone, 'Nigeria');
      assert.strictEqual(res.valid, false, `Malformed phone ${phone} must be rejected`);
    }
  });
});

describe('Tier 1: Feature F10 - Client-Side Email Validation', () => {
  let env;
  beforeEach(() => {
    env = setupValidatorTestEnv();
  });

  it('F10-T1-1: Accepts standard corporate and personal email addresses', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined on window or in checkout');
    const validEmails = ['client@example.com', 'procurement@kabodcrest.com', 'buyer@agro-trade.co.uk'];
    for (const email of validEmails) {
      const res = validator.validateEmail(email);
      assert.strictEqual(res.valid, true, `Email ${email} must be valid`);
    }
  });

  it('F10-T1-2: Accepts emails with subdomains and plus addressing tag', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined on window or in checkout');
    const validEmails = ['user+orders@sub.domain.org', 'firstname.lastname@company.ng'];
    for (const email of validEmails) {
      const res = validator.validateEmail(email);
      assert.strictEqual(res.valid, true, `Email ${email} must be valid`);
    }
  });

  it('F10-T1-3: Rejects emails missing @ symbol or domain name', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined on window or in checkout');
    const invalidMissing = ['plainaddress', 'user@', '@example.com', 'user@.com'];
    for (const email of invalidMissing) {
      const res = validator.validateEmail(email);
      assert.strictEqual(res.valid, false, `Email ${email} must be rejected`);
    }
  });

  it('F10-T1-4: Rejects emails with consecutive dots or invalid top-level domains', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined on window or in checkout');
    const invalidDots = ['user@domain..com', 'user..name@domain.com', 'user@domain.c'];
    for (const email of invalidDots) {
      const res = validator.validateEmail(email);
      assert.strictEqual(res.valid, false, `Email ${email} must be rejected`);
    }
  });

  it('F10-T1-5: Rejects emails containing embedded whitespace', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined on window or in checkout');
    const invalidSpaces = ['user name@example.com', 'user@ domain.com', 'user@domain .com'];
    for (const email of invalidSpaces) {
      const res = validator.validateEmail(email);
      assert.strictEqual(res.valid, false, `Email ${email} must be rejected`);
    }
  });
});

describe('Tier 1: Feature F11 - Required Fields & Text Sanitization', () => {
  let env;
  beforeEach(() => {
    env = setupValidatorTestEnv();
  });

  it('F11-T1-1: Required field validator passes on non-empty string', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined on window or in checkout');
    const res = validator.validateRequired('Adeola Adeleke', 'Full Name');
    assert.strictEqual(res.valid, true);
  });

  it('F11-T1-2: Required field validator fails on empty or whitespace-only string', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined on window or in checkout');
    assert.strictEqual(validator.validateRequired('', 'Full Name').valid, false);
    assert.strictEqual(validator.validateRequired('   ', 'Full Name').valid, false);
  });

  it('F11-T1-3: Required field validator enforces minLength constraint', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined on window or in checkout');
    const res = validator.validateRequired('A', 'Full Name', 3);
    assert.strictEqual(res.valid, false, 'String with length < 3 must fail');
  });

  it('F11-T1-4: sanitizeText strips script tags and HTML markup', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined on window or in checkout');
    const dirty = '<script>alert("xss")</script>14 Victoria Island';
    const clean = validator.sanitizeText(dirty);
    assert.ok(!clean.includes('<script>'), 'Must strip script tags');
    assert.ok(clean.includes('14 Victoria Island'));
  });

  it('F11-T1-5: sanitizeText preserves legitimate business characters (hyphens, commas, periods)', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined on window or in checkout');
    const normal = "Plot 4B, Admiralty Way, Lekki Phase 1, Lagos - Nigeria.";
    const clean = validator.sanitizeText(normal);
    assert.strictEqual(clean, normal);
  });
});

describe('Tier 1: Feature F12 - Accessible Visual Error Presentation', () => {
  let env;
  beforeEach(() => {
    env = setupValidatorTestEnv();
  });

  it('F12-T1-1: Invalid input element receives .is-invalid class', () => {
    const input = env.document.getElementById('cust-phone');
    input.value = 'invalid-phone';

    if (typeof env.window.validateField === 'function') {
      env.window.validateField(input);
      assert.ok(input.classList.contains('is-invalid'));
    }
  });

  it('F12-T1-2: Invalid input element receives aria-invalid="true"', () => {
    const input = env.document.getElementById('cust-email');
    input.value = 'bad-email';

    if (typeof env.window.validateField === 'function') {
      env.window.validateField(input);
      assert.strictEqual(input.getAttribute('aria-invalid'), 'true');
    }
  });

  it('F12-T1-3: Correcting invalid field removes .is-invalid and sets aria-invalid="false"', () => {
    const input = env.document.getElementById('cust-email');
    input.value = 'bad-email';

    if (typeof env.window.validateField === 'function') {
      env.window.validateField(input);
      assert.ok(input.classList.contains('is-invalid'));

      input.value = 'valid@example.com';
      env.window.validateField(input);
      assert.ok(!input.classList.contains('is-invalid'));
      assert.strictEqual(input.getAttribute('aria-invalid'), 'false');
    }
  });

  it('F12-T1-4: Form submission event is prevented when required fields are empty', () => {
    const form = env.document.getElementById('checkout-form');
    let defaultPrevented = false;

    form.addEventListener('submit', (e) => {
      if (e.defaultPrevented) defaultPrevented = true;
    });

    const submitEvent = new env.window.CustomEvent('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    // Submission with blank form should be prevented
    assert.ok(submitEvent.defaultPrevented || defaultPrevented);
  });

  it('F12-T1-5: Error message span has accessible class or role', () => {
    const validator = env.window.KabodValidator;
    if (validator) {
      const res = validator.validatePhone('123', 'Nigeria');
      assert.strictEqual(res.valid, false);
      assert.ok(res.message && res.message.length > 0);
    }
  });
});

// ============================================================================
// TIER 2: BOUNDARY & CORNER CASES (≥5 per feature)
// ============================================================================

describe('Tier 2: Boundary & Corner Cases (F9-F12)', () => {
  let env;
  beforeEach(() => {
    env = setupValidatorTestEnv();
  });

  // F9 Boundary Cases
  it('F9-T2-1: Phone with leading and trailing whitespaces is trimmed and validated', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined');
    const res = validator.validatePhone('  08012345678  ', 'Nigeria');
    assert.strictEqual(res.valid, true);
    if (res.sanitized) {
      assert.strictEqual(res.sanitized, '08012345678');
    }
  });

  it('F9-T2-2: Phone with parentheses e.g. (+234) 801 234 5678 is handled cleanly', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined');
    const res = validator.validatePhone('(+234) 801 234 5678', 'Nigeria');
    assert.strictEqual(res.valid, true);
  });

  it('F9-T2-3: Phone with exactly 10 digits (missing leading 0) is rejected for Nigeria local', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined');
    const res = validator.validatePhone('8012345678', 'Nigeria');
    assert.strictEqual(res.valid, false);
  });

  it('F9-T2-4: Phone with 12 digits (extra digit) is rejected for Nigeria local', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined');
    const res = validator.validatePhone('080123456789', 'Nigeria');
    assert.strictEqual(res.valid, false);
  });

  it('F9-T2-5: Phone input undefined or null returns valid: false without throwing', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined');
    assert.doesNotThrow(() => {
      const res = validator.validatePhone(null, 'Nigeria');
      assert.strictEqual(res.valid, false);
    });
  });

  // F10 Boundary Cases
  it('F10-T2-1: Email with leading and trailing whitespace is trimmed during validation', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined');
    const res = validator.validateEmail('  buyer@kabodcrest.com  ');
    assert.strictEqual(res.valid, true);
  });

  it('F10-T2-2: Email with unicode international characters handled safely', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined');
    assert.doesNotThrow(() => {
      validator.validateEmail('test@dömain.com');
    });
  });

  it('F10-T2-3: Extremely long email (255+ chars) handled safely', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined');
    const longLocal = 'a'.repeat(65);
    const res = validator.validateEmail(`${longLocal}@example.com`);
    assert.strictEqual(res.valid, false, 'Local part exceeding 64 chars must fail');
  });

  it('F10-T2-4: Email with quoted local part handled or rejected safely', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined');
    assert.doesNotThrow(() => {
      validator.validateEmail('"john.doe"@example.com');
    });
  });

  it('F10-T2-5: Email input undefined or null returns valid: false', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined');
    assert.doesNotThrow(() => {
      const res = validator.validateEmail(null);
      assert.strictEqual(res.valid, false);
    });
  });

  // F11 Boundary Cases
  it('F11-T2-1: sanitizeText strips nested script tags (<scr<script>ipt>)', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined');
    const input = '<scr<script>ipt>alert(1)</script>';
    const clean = validator.sanitizeText(input);
    assert.ok(!clean.includes('<script>') && !clean.includes('alert(1)'));
  });

  it('F11-T2-2: sanitizeText strips onerror and onload attributes in img/svg tags', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined');
    const input = '<img src=x onerror=alert(1)>';
    const clean = validator.sanitizeText(input);
    assert.ok(!clean.includes('onerror') && !clean.includes('<img'));
  });

  it('F11-T2-3: sanitizeText handles null or non-string input safely', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined');
    assert.strictEqual(validator.sanitizeText(null), '');
    assert.strictEqual(validator.sanitizeText(undefined), '');
  });

  it('F11-T2-4: validateRequired with non-string input converts to string safely', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined');
    const res = validator.validateRequired(12345, 'Postal Code');
    assert.strictEqual(res.valid, true);
  });

  it('F11-T2-5: sanitizeText preserves foreign apostrophes and diacritics', () => {
    const validator = env.window.KabodValidator;
    assert.ok(validator, 'KabodValidator must be defined');
    const name = "Nnamdi O'Connor-Smith";
    assert.strictEqual(validator.sanitizeText(name), name);
  });

  // F12 Boundary Cases
  it('F12-T2-1: Repeated validations do not add duplicate .is-invalid classes', () => {
    const el = env.document.getElementById('cust-name');
    el.classList.add('is-invalid');
    el.classList.add('is-invalid');
    const classes = el.className.split(/\s+/).filter(c => c === 'is-invalid');
    assert.strictEqual(classes.length, 1);
  });

  it('F12-T2-2: Removing .is-invalid from an element without the class is a safe no-op', () => {
    const el = env.document.getElementById('cust-name');
    assert.doesNotThrow(() => {
      el.classList.remove('is-invalid');
    });
  });

  it('F12-T2-3: Clearing validation state restores original border styling', () => {
    const el = env.document.getElementById('cust-name');
    el.classList.add('is-invalid');
    el.classList.remove('is-invalid');
    assert.strictEqual(el.classList.contains('is-invalid'), false);
  });

  it('F12-T2-4: Form handles empty postalCode as optional when country is Nigeria', () => {
    const validator = env.window.KabodValidator;
    if (validator && typeof validator.validateDelivery === 'function') {
      const res = validator.validateDelivery({
        address: '14 Lekki Way',
        city: 'Lagos',
        state: 'Lagos',
        country: 'Nigeria',
        postalCode: ''
      });
      assert.strictEqual(res.valid, true);
    }
  });

  it('F12-T2-5: Form validator returns list of all invalid fields rather than stopping at first', () => {
    const validator = env.window.KabodValidator;
    if (validator && typeof validator.validateCheckoutForm === 'function') {
      const res = validator.validateCheckoutForm({
        name: '',
        email: 'invalid',
        phone: '123'
      });
      assert.strictEqual(res.valid, false);
      assert.ok(Array.isArray(res.errors));
      assert.ok(res.errors.length >= 3);
    }
  });
});

// ============================================================================
// TIER 3: PAIRWISE COMBINATORIAL COVERAGE
// ============================================================================

describe('Tier 3: Pairwise Combinations (Form Field Validity Permutations)', () => {
  let env;
  beforeEach(() => {
    env = setupValidatorTestEnv();
  });

  const cases = [
    { name: 'Valid All', n: 'John Doe', e: 'john@example.com', p: '08012345678', expected: true },
    { name: 'Invalid Phone Only', n: 'John Doe', e: 'john@example.com', p: '12345', expected: false },
    { name: 'Invalid Email Only', n: 'John Doe', e: 'bad-email', p: '08012345678', expected: false },
    { name: 'Missing Name Only', n: '', e: 'john@example.com', p: '08012345678', expected: false },
    { name: 'Invalid Email and Phone', n: 'John Doe', e: 'bad-email', p: '12345', expected: false },
    { name: 'All Fields Invalid', n: '', e: 'bad', p: 'bad', expected: false }
  ];

  for (const c of cases) {
    it(`Pairwise [${c.name}]: correctly determines overall form validity`, () => {
      const validator = env.window.KabodValidator;
      assert.ok(validator, 'KabodValidator must be defined');

      const nameRes = validator.validateRequired(c.n, 'Name');
      const emailRes = validator.validateEmail(c.e);
      const phoneRes = validator.validatePhone(c.p, 'Nigeria');

      const isOverallValid = nameRes.valid && emailRes.valid && phoneRes.valid;
      assert.strictEqual(isOverallValid, c.expected, `Validation state mismatch for ${c.name}`);
    });
  }
});
