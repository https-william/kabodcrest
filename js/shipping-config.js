/**
 * Kabod Crest - Shipping Configuration
 * Central single source of truth for delivery tiers.
 * Edit placeholder rates here once commercial freight contracts are finalized.
 */

const KABOD_SHIPPING_CONFIG = {
  tiers: [
    {
      id: "lagos",
      name: "Lagos Delivery (Mainland & Island)",
      description: "Direct door-to-door dispatch within Lagos State",
      rateText: "Flat rate [TBC]",
      rateAmount: null, // Set number e.g. 2500 once finalized
      isTBC: true
    },
    {
      id: "rest-of-nigeria",
      name: "Rest of Nigeria (35 States & FCT)",
      description: "Nationwide regional courier network dispatch",
      rateText: "Flat rate [TBC]",
      rateAmount: null, // Set number e.g. 5000 once finalized
      isTBC: true
    },
    {
      id: "international-air",
      name: "International Freight (UK, US, Canada, AU, Worldwide)",
      description: "Priority international air cargo with tracking & export documentation",
      rateText: "Calculated prior to dispatch invoice [TBC]",
      rateAmount: null,
      isTBC: true
    }
  ],
  defaultTier: "lagos"
};

if (typeof window !== 'undefined') {
  window.KABOD_SHIPPING_CONFIG = KABOD_SHIPPING_CONFIG;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KABOD_SHIPPING_CONFIG;
}
