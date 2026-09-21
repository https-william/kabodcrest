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
      rateText: "₦2,500",
      rateAmount: 2500,
      isTBC: false
    },
    {
      id: "rest-of-nigeria",
      name: "Rest of Nigeria (35 States & FCT)",
      description: "Nationwide regional courier network dispatch",
      rateText: "₦4,500",
      rateAmount: 4500,
      isTBC: false
    },
    {
      id: "international-air",
      name: "International Freight (UK, US, Canada, AU, Worldwide)",
      description: "Priority international air cargo with tracking & export documentation",
      rateText: "[TBC prior to dispatch]",
      rateAmount: null,
      isTBC: true
    }
  ],
  defaultTier: "lagos",

  getTierById: function(tierId) {
    if (!tierId) return this.tiers.find(t => t.id === this.defaultTier);
    return this.tiers.find(t => t.id === tierId) || this.tiers.find(t => t.id === this.defaultTier) || null;
  },

  getTierForDestination: function(country, state) {
    const normCountry = (country || '').trim().toLowerCase();
    const normState = (state || '').trim().toLowerCase();

    if (!normCountry || normCountry === 'nigeria') {
      if (normState === 'lagos') {
        return this.getTierById('lagos');
      }
      return this.getTierById('rest-of-nigeria');
    }

    return this.getTierById('international-air');
  }
};

if (typeof window !== 'undefined') {
  window.KABOD_SHIPPING_CONFIG = KABOD_SHIPPING_CONFIG;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KABOD_SHIPPING_CONFIG;
}
