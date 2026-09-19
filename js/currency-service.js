/**
 * Kabod Crest - Currency Conversion Service
 * Base price is ALWAYS NGN (Nigeria is home market, pricing authority remains in Naira).
 * Displays approximate converted estimate alongside NGN price for international visitors:
 * e.g., "₦10,000 (≈ $6.50 USD)".
 *
 * Source: Frankfurter.app (open-source ECB rates) + country detection.
 * Caches conversion rates in sessionStorage so it fetches at most once per session.
 * Graceful degradation: If lookup fails, blocked, or in Nigeria, cleanly returns empty string (NGN only).
 * Never blocks page rendering, never outputs NaN.
 */

(function () {
  'use strict';

  // Benchmark reference anchor for NGN to USD (approx ~1,538.46 NGN per USD for ₦10,000 ≈ $6.50 USD)
  const NGN_PER_USD = 1538.46;
  const STORAGE_KEY_RATES = 'kabod_currency_rates_v1';
  const STORAGE_KEY_GEO = 'kabod_visitor_geo_v1';

  // Currency symbols and codes mapped to ISO country codes
  const COUNTRY_CURRENCIES = {
    US: { code: 'USD', symbol: '$' },
    GB: { code: 'GBP', symbol: '£' },
    CA: { code: 'CAD', symbol: 'CA$' },
    AU: { code: 'AUD', symbol: 'A$' },
    DE: { code: 'EUR', symbol: '€' },
    FR: { code: 'EUR', symbol: '€' },
    IT: { code: 'EUR', symbol: '€' },
    ES: { code: 'EUR', symbol: '€' },
    NL: { code: 'EUR', symbol: '€' },
    IE: { code: 'EUR', symbol: '€' },
    BE: { code: 'EUR', symbol: '€' },
    AT: { code: 'EUR', symbol: '€' },
    CH: { code: 'CHF', symbol: 'CHF ' },
    ZA: { code: 'ZAR', symbol: 'R ' },
    JP: { code: 'JPY', symbol: '¥' },
    NG: null // Nigeria displays pure NGN with no converted estimate
  };

  let cachedRates = null;
  let visitorCurrency = null;
  let initPromise = null;

  async function initCurrencyService() {
    if (initPromise) return initPromise;

    initPromise = (async () => {
      try {
        // Check session storage first
        try {
          const storedGeo = sessionStorage.getItem(STORAGE_KEY_GEO);
          const storedRates = sessionStorage.getItem(STORAGE_KEY_RATES);
          if (storedGeo && storedRates) {
            const geoData = JSON.parse(storedGeo);
            if (geoData === 'NG') {
              visitorCurrency = null;
              return;
            }
            visitorCurrency = COUNTRY_CURRENCIES[geoData] || { code: 'USD', symbol: '$' };
            cachedRates = JSON.parse(storedRates);
            dispatchReady();
            return;
          }
        } catch (_) {
          // sessionStorage inaccessible, continue to network
        }

        // 1. Detect visitor country
        let countryCode = null;
        try {
          const metaCountry = document.querySelector('meta[name="user-country"]');
          if (metaCountry) {
            countryCode = metaCountry.getAttribute('content');
          } else {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1800);
            const geoRes = await fetch('https://ipapi.co/json/', { signal: controller.signal });
            clearTimeout(timeoutId);
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              countryCode = geoData.country_code;
            }
          }
        } catch (_) {
          countryCode = 'US'; // International fallback
        }

        if (countryCode) {
          try {
            sessionStorage.setItem(STORAGE_KEY_GEO, JSON.stringify(countryCode));
          } catch (_) {}
        }

        if (countryCode === 'NG') {
          visitorCurrency = null;
          return;
        }

        const target = COUNTRY_CURRENCIES[countryCode] || { code: 'USD', symbol: '$' };
        visitorCurrency = target;

        // 2. Fetch exchange rates from Frankfurter API (ECB rates)
        if (target.code === 'USD') {
          cachedRates = { USD: 1.0 };
        } else {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const rateRes = await fetch('https://api.frankfurter.dev/v1/latest?base=USD', { signal: controller.signal });
            clearTimeout(timeoutId);
            if (rateRes.ok) {
              const rateData = await rateRes.json();
              cachedRates = rateData.rates || {};
              cachedRates.USD = 1.0;
            }
          } catch (_) {
            cachedRates = { USD: 1.0 };
            visitorCurrency = { code: 'USD', symbol: '$' };
          }
        }

        if (cachedRates) {
          try {
            sessionStorage.setItem(STORAGE_KEY_RATES, JSON.stringify(cachedRates));
          } catch (_) {}
        }

        dispatchReady();
      } catch (e) {
        console.warn('Currency service notice: defaulting to base NGN', e);
        visitorCurrency = null;
      }
    })();

    return initPromise;
  }

  function dispatchReady() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kabod:currency-ready', {
        detail: { currency: visitorCurrency }
      }));
    }
  }

  function formatEstimate(ngnAmount) {
    if (!ngnAmount || typeof ngnAmount !== 'number' || isNaN(ngnAmount) || ngnAmount <= 0) return '';
    if (!visitorCurrency || !cachedRates) return '';

    const usdVal = ngnAmount / NGN_PER_USD;
    const rateMultiplier = cachedRates[visitorCurrency.code] || 1.0;
    const converted = usdVal * rateMultiplier;

    if (isNaN(converted) || !isFinite(converted)) return '';

    const formattedNum = converted.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return `(≈ ${visitorCurrency.symbol}${formattedNum} ${visitorCurrency.code})`;
  }

  window.KabodCurrency = {
    init: initCurrencyService,
    formatEstimate: formatEstimate,
    getVisitorCurrency: () => visitorCurrency
  };

  // Run asynchronously without blocking DOM
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => initCurrencyService());
    } else {
      initCurrencyService();
    }
  }
})();
