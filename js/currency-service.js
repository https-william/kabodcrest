/**
 * Kabod Crest - Currency Conversion & Geolocation Service
 * Base price is ALWAYS NGN (Nigeria is home market, commercial authority remains in Naira).
 * Automatically detects visitor's location and adapts price displays to their local currency (NGN, USD, GBP, EUR).
 * Visitors can also manually switch currency via the header selector.
 *
 * Source: Timezone heuristics + Frankfurter ECB rates + IP lookup.
 * Respects user preferences in localStorage and session caching.
 */

(function () {
  'use strict';

  // Benchmark reference anchor for NGN to USD (₦10,000 ≈ $6.50 USD, approx ~1,538.46 NGN per USD)
  const NGN_PER_USD = 1538.46;
  const STORAGE_KEY_SELECTED = 'kabod_selected_currency_v1';
  const STORAGE_KEY_RATES = 'kabod_currency_rates_v1';
  const STORAGE_KEY_GEO = 'kabod_visitor_geo_v1';

  const CURRENCY_CONFIG = {
    NGN: { code: 'NGN', symbol: '₦', flag: '🇳🇬', name: 'Nigerian Naira' },
    USD: { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'US Dollar' },
    GBP: { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'British Pound' },
    EUR: { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'Euro' },
    CAD: { code: 'CAD', symbol: 'CA$', flag: '🇨🇦', name: 'Canadian Dollar' }
  };

  let cachedRates = { USD: 1.0, GBP: 0.79, EUR: 0.92, CAD: 1.36 };
  let activeCurrencyCode = 'NGN';
  let initPromise = null;

  /**
   * Fast timezone-based heuristic to determine visitor currency before network calls.
   */
  function detectTimezoneCurrency() {
    try {
      const tz = (typeof Intl !== 'undefined' && Intl.DateTimeFormat)
        ? Intl.DateTimeFormat().resolvedOptions().timeZone || ''
        : '';

      if (!tz) return 'NGN';

      if (tz.includes('London') || tz.includes('Belfast') || tz.includes('Europe/Jersey')) {
        return 'GBP';
      }
      if (tz.includes('America') || tz.includes('US') || tz.includes('Hawaii') || tz.includes('Alaska')) {
        return tz.includes('Toronto') || tz.includes('Vancouver') || tz.includes('Montreal') ? 'CAD' : 'USD';
      }
      if (tz.includes('Europe/Paris') || tz.includes('Berlin') || tz.includes('Rome') || tz.includes('Madrid') || tz.includes('Amsterdam') || tz.includes('Brussels') || tz.includes('Dublin')) {
        return 'EUR';
      }
      if (tz.includes('Lagos') || tz.includes('Africa/')) {
        return 'NGN';
      }
    } catch (_) {}
    return 'NGN';
  }

  async function initCurrencyService() {
    if (initPromise) return initPromise;

    initPromise = (async () => {
      // 1. Check user preference in localStorage
      let preferred = null;
      try {
        preferred = localStorage.getItem(STORAGE_KEY_SELECTED);
      } catch (_) {}

      if (preferred && CURRENCY_CONFIG[preferred]) {
        activeCurrencyCode = preferred;
      } else {
        // 2. Fall back to timezone heuristic
        activeCurrencyCode = detectTimezoneCurrency();
      }

      // 3. Attempt cached rates or network fetch
      try {
        const storedRates = sessionStorage.getItem(STORAGE_KEY_RATES);
        if (storedRates) {
          cachedRates = { ...cachedRates, ...JSON.parse(storedRates) };
        } else {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1800);
          const rateRes = await fetch('https://api.frankfurter.dev/v1/latest?base=USD', { signal: controller.signal });
          clearTimeout(timeoutId);
          if (rateRes.ok) {
            const data = await rateRes.json();
            if (data && data.rates) {
              cachedRates = { ...cachedRates, ...data.rates, USD: 1.0 };
              try { sessionStorage.setItem(STORAGE_KEY_RATES, JSON.stringify(cachedRates)); } catch (_) {}
            }
          }
        }
      } catch (_) {
        // Keep resilient defaults
      }

      dispatchReady();
      updateDomCurrencies();
    })();

    return initPromise;
  }

  function dispatchReady() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kabod:currency-ready', {
        detail: {
          currency: CURRENCY_CONFIG[activeCurrencyCode] || CURRENCY_CONFIG.NGN,
          rates: cachedRates
        }
      }));
    }
  }

  function setCurrency(code) {
    if (!CURRENCY_CONFIG[code]) return;
    activeCurrencyCode = code;
    try {
      localStorage.setItem(STORAGE_KEY_SELECTED, code);
    } catch (_) {}

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kabod:currency-changed', {
        detail: { currency: CURRENCY_CONFIG[code] }
      }));
    }

    updateDomCurrencies();
  }

  function getActiveCurrency() {
    return CURRENCY_CONFIG[activeCurrencyCode] || CURRENCY_CONFIG.NGN;
  }

  function convertNgnToTarget(ngnAmount, targetCode = activeCurrencyCode) {
    if (!ngnAmount || typeof ngnAmount !== 'number' || isNaN(ngnAmount)) return 0;
    if (targetCode === 'NGN') return ngnAmount;

    const usdVal = ngnAmount / NGN_PER_USD;
    const rate = cachedRates[targetCode] || 1.0;
    return usdVal * rate;
  }

  function formatPrice(ngnAmount, targetCode = activeCurrencyCode) {
    if (!ngnAmount || typeof ngnAmount !== 'number' || isNaN(ngnAmount)) {
      return (targetCode === 'NGN') ? '₦0' : '$0.00';
    }

    const conf = CURRENCY_CONFIG[targetCode] || CURRENCY_CONFIG.NGN;
    if (targetCode === 'NGN') {
      return `₦${Math.round(ngnAmount).toLocaleString('en-NG')}`;
    }

    const converted = convertNgnToTarget(ngnAmount, targetCode);
    const formatted = converted.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `${conf.symbol}${formatted}`;
  }

  function formatEstimate(ngnAmount) {
    if (!ngnAmount || typeof ngnAmount !== 'number' || isNaN(ngnAmount) || ngnAmount <= 0) return '';
    if (activeCurrencyCode === 'NGN') return '';

    const conf = getActiveCurrency();
    const formatted = formatPrice(ngnAmount, conf.code);
    return `(≈ ${formatted} ${conf.code})`;
  }

  function updateDomCurrencies() {
    if (typeof document === 'undefined') return;

    // Update any select pickers
    document.querySelectorAll('.currency-picker-select, #global-currency-picker').forEach(el => {
      if (el.value !== activeCurrencyCode) {
        el.value = activeCurrencyCode;
      }
    });

    // Update tags displaying active currency estimate or value
    document.querySelectorAll('.js-currency-estimate').forEach(el => {
      const ngn = parseFloat(el.getAttribute('data-ngn') || '0');
      if (ngn > 0) {
        el.textContent = formatEstimate(ngn);
      }
    });

    // Update tags with dual price display
    document.querySelectorAll('.js-adaptive-price').forEach(el => {
      const ngn = parseFloat(el.getAttribute('data-ngn') || '0');
      if (ngn > 0) {
        if (activeCurrencyCode === 'NGN') {
          el.textContent = `₦${Math.round(ngn).toLocaleString('en-NG')}`;
        } else {
          const foreign = formatPrice(ngn, activeCurrencyCode);
          el.innerHTML = `<strong>${foreign}</strong> <span style="font-size:0.75em;opacity:0.75;">(₦${Math.round(ngn).toLocaleString('en-NG')})</span>`;
        }
      }
    });
  }

  // Export to window
  if (typeof window !== 'undefined') {
    window.KabodCurrency = {
      init: initCurrencyService,
      getActiveCurrency: getActiveCurrency,
      setCurrency: setCurrency,
      formatPrice: formatPrice,
      formatEstimate: formatEstimate,
      convertNgnToTarget: convertNgnToTarget,
      getVisitorCurrency: () => (activeCurrencyCode === 'NGN' ? null : getActiveCurrency())
    };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      formatPrice,
      formatEstimate,
      convertNgnToTarget,
      getActiveCurrency,
      setCurrency
    };
  }

  // Initialize without blocking
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCurrencyService);
    } else {
      initCurrencyService();
    }
  }
})();
