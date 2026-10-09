/**
 * Kabod Crest E2E Test Suite - Catalog Search & Filtering Unit Tests
 *
 * Covers:
 * - Feature CS-1: Product Name & Title Instant Search
 * - Feature CS-2: Botanical & Culinary Keywords Indexing
 * - Feature CS-3: Subtitle & Origin Geographic Search
 * - Feature CS-4: Category Tab Pure Filtering
 * - Feature CS-5: Combined Category + Query Compound Filtering
 * - Boundary & Corner Cases: Case insensitivity, trim, punctuation, empty state, null fallbacks
 * - Combinatorial: 14-Product Full Catalog Index Verification
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { KABOD_PRODUCTS, ALL_PRODUCTS } = require('../../js/products-data.js');
const { filterCatalog } = require('../../js/shop.js');

// ============================================================================
// TIER 1: CORE SEARCH & FILTERING FEATURES
// ============================================================================

describe('Tier 1: Feature CS-1 - Product Title & Name Instant Search', () => {
  it('CS1-1: Exact product name "Dehydrated Ugwu" returns matching item', () => {
    const results = filterCatalog('all', 'Dehydrated Ugwu', ALL_PRODUCTS);
    assert.equal(results.length, 1);
    assert.equal(results[0].id, 'dehydrated-ugwu');
  });

  it('CS1-2: Partial name "Ginger" returns Dehydrated Ginger Powder', () => {
    const results = filterCatalog('all', 'Ginger', ALL_PRODUCTS);
    assert.ok(results.some(p => p.id === 'dehydrated-ginger'));
  });

  it('CS1-3: Partial name "Jollof" returns Jollof Rice Spice', () => {
    const results = filterCatalog('all', 'Jollof', ALL_PRODUCTS);
    assert.ok(results.some(p => p.id === 'jollof-rice-spice'));
  });

  it('CS1-4: Name search for "Egusi" locates Melon Seed / Egusi', () => {
    const results = filterCatalog('all', 'Egusi', ALL_PRODUCTS);
    assert.ok(results.some(p => p.id === 'melon-seed-egusi'));
  });

  it('CS1-5: Name search for "Ogbono" locates Ogbono Dika Nut Kernels', () => {
    const results = filterCatalog('all', 'Ogbono', ALL_PRODUCTS);
    assert.ok(results.some(p => p.id === 'ogbono-dika-nut'));
  });
});

describe('Tier 1: Feature CS-2 - Botanical & Culinary Keywords Indexing', () => {
  it('CS2-1: Keyword search "fluted pumpkin" finds Dehydrated Ugwu', () => {
    const results = filterCatalog('all', 'fluted pumpkin', ALL_PRODUCTS);
    assert.equal(results.length, 1);
    assert.equal(results[0].id, 'dehydrated-ugwu');
  });

  it('CS2-2: Keyword search "kaduna" finds Dehydrated Ginger Powder', () => {
    const results = filterCatalog('all', 'kaduna', ALL_PRODUCTS);
    assert.equal(results.length, 1);
    assert.equal(results[0].id, 'dehydrated-ginger');
  });

  it('CS2-3: Culinary keyword "draw soup" locates Ogbono', () => {
    const results = filterCatalog('all', 'draw soup', ALL_PRODUCTS);
    assert.ok(results.some(p => p.id === 'ogbono-dika-nut'));
  });

  it('CS2-4: Snack keyword "groundnut" locates Kulikuli Snack', () => {
    const results = filterCatalog('all', 'groundnut', ALL_PRODUCTS);
    assert.ok(results.some(p => p.id === 'kulikuli-snack'));
  });

  it('CS2-5: Staple keyword "garri" finds Cassava Flakes and Kulikuli companion keyword', () => {
    const results = filterCatalog('all', 'garri', ALL_PRODUCTS);
    assert.ok(results.length >= 1);
    assert.ok(results.some(p => p.id === 'cassava-flakes-garri'));
  });
});

describe('Tier 1: Feature CS-3 - Subtitle & Origin Geographic Search', () => {
  it('CS3-1: Origin query "Enugu" locates products sourced from Enugu State', () => {
    const results = filterCatalog('all', 'Enugu', ALL_PRODUCTS);
    assert.ok(results.length > 0);
    assert.ok(results.some(p => p.id === 'dehydrated-ugwu'));
  });

  it('CS3-2: Origin query "Kaduna" locates Kaduna-sourced ginger', () => {
    const results = filterCatalog('all', 'Kaduna', ALL_PRODUCTS);
    assert.ok(results.some(p => p.id === 'dehydrated-ginger'));
  });

  it('CS3-3: Origin query "Benue" locates Benue melon seeds (Egusi)', () => {
    const results = filterCatalog('all', 'Benue', ALL_PRODUCTS);
    assert.ok(results.some(p => p.id === 'melon-seed-egusi'));
  });

  it('CS3-4: Subtitle search "Fluted Pumpkin Leaves" locates Ugwu Leaves', () => {
    const results = filterCatalog('all', 'Fluted Pumpkin Leaves', ALL_PRODUCTS);
    assert.ok(results.some(p => p.id === 'dehydrated-ugwu'));
  });

  it('CS3-5: Subtitle search "Dika Nut Kernels" locates Ogbono', () => {
    const results = filterCatalog('all', 'Dika Nut Kernels', ALL_PRODUCTS);
    assert.ok(results.some(p => p.id === 'ogbono-dika-nut'));
  });
});

describe('Tier 1: Feature CS-4 - Category Tab Pure Filtering', () => {
  it('CS4-1: Category "all" returns complete 14-item catalog', () => {
    const results = filterCatalog('all', '', ALL_PRODUCTS);
    assert.equal(results.length, 14);
  });

  it('CS4-2: Category "Dehydrated Vegetables" filters strictly to vegetable items (Ugwu & Zobo)', () => {
    const results = filterCatalog('Dehydrated Vegetables', '', ALL_PRODUCTS);
    assert.equal(results.length, 2);
    results.forEach(p => assert.equal(p.category, 'Dehydrated Vegetables'));
    assert.ok(results.some(p => p.id === 'dehydrated-ugwu'));
    assert.ok(results.some(p => p.id === 'zobo-hibiscus-calyces'));
  });

  it('CS4-3: Category "Spices & Seasonings" filters strictly to spices', () => {
    const results = filterCatalog('Spices & Seasonings', '', ALL_PRODUCTS);
    assert.ok(results.length >= 4);
    results.forEach(p => assert.equal(p.category, 'Spices & Seasonings'));
    assert.ok(results.some(p => p.id === 'dehydrated-ginger'));
    assert.ok(results.some(p => p.id === 'jollof-rice-spice'));
  });

  it('CS4-4: Category "Seeds & Nuts" filters strictly to seeds and nuts', () => {
    const results = filterCatalog('Seeds & Nuts', '', ALL_PRODUCTS);
    assert.equal(results.length, 3);
    results.forEach(p => assert.equal(p.category, 'Seeds & Nuts'));
    assert.ok(results.some(p => p.id === 'kulikuli-snack'));
    assert.ok(results.some(p => p.id === 'melon-seed-egusi'));
    assert.ok(results.some(p => p.id === 'ogbono-dika-nut'));
  });

  it('CS4-5: Category "Traditional Foods" filters strictly to staples', () => {
    const results = filterCatalog('Traditional Foods', '', ALL_PRODUCTS);
    assert.equal(results.length, 4);
    results.forEach(p => assert.equal(p.category, 'Traditional Foods'));
  });
});

describe('Tier 1: Feature CS-5 - Compound Category + Query Filtering', () => {
  it('CS5-1: Category "Spices & Seasonings" + query "ginger" returns 1 item', () => {
    const results = filterCatalog('Spices & Seasonings', 'ginger', ALL_PRODUCTS);
    assert.equal(results.length, 1);
    assert.equal(results[0].id, 'dehydrated-ginger');
  });

  it('CS5-2: Category "Dehydrated Vegetables" + query "ginger" returns 0 items', () => {
    const results = filterCatalog('Dehydrated Vegetables', 'ginger', ALL_PRODUCTS);
    assert.equal(results.length, 0);
  });

  it('CS5-3: Category "Seeds & Nuts" + query "melon" returns Melon Seed / Egusi', () => {
    const results = filterCatalog('Seeds & Nuts', 'melon', ALL_PRODUCTS);
    assert.ok(results.some(p => p.id === 'melon-seed-egusi'));
  });

  it('CS5-4: Category "Traditional Foods" + query "cassava" returns Cassava Flakes only', () => {
    const results = filterCatalog('Traditional Foods', 'cassava', ALL_PRODUCTS);
    assert.equal(results.length, 1);
    assert.equal(results[0].id, 'cassava-flakes-garri');
  });

  it('CS5-5: Category "Traditional Foods" + query "ugwu" returns 0 items', () => {
    const results = filterCatalog('Traditional Foods', 'ugwu', ALL_PRODUCTS);
    assert.equal(results.length, 0);
  });
});

// ============================================================================
// TIER 2: BOUNDARY & CORNER CASES
// ============================================================================

describe('Tier 2: Boundary & Corner Cases', () => {
  it('CS-BC-1: Empty string query returns all items in category without modification', () => {
    const resultsAll = filterCatalog('all', '', ALL_PRODUCTS);
    assert.equal(resultsAll.length, 14);

    const resultsSpices = filterCatalog('Spices & Seasonings', '', ALL_PRODUCTS);
    const expectedCount = ALL_PRODUCTS.filter(p => p.category === 'Spices & Seasonings').length;
    assert.equal(resultsSpices.length, expectedCount);
  });

  it('CS-BC-2: Query with leading and trailing whitespace is trimmed properly', () => {
    const paddedResults = filterCatalog('all', '   ugwu   ', ALL_PRODUCTS);
    const cleanResults = filterCatalog('all', 'ugwu', ALL_PRODUCTS);
    assert.equal(paddedResults.length, cleanResults.length);
    assert.equal(paddedResults[0].id, cleanResults[0].id);
  });

  it('CS-BC-3: Case insensitivity handles UPPERCASE, lowercase, and MixedCase identically', () => {
    const lower = filterCatalog('all', 'ugwu', ALL_PRODUCTS);
    const upper = filterCatalog('all', 'UGWU', ALL_PRODUCTS);
    const mixed = filterCatalog('all', 'uGwU', ALL_PRODUCTS);
    assert.equal(lower.length, upper.length);
    assert.equal(lower.length, mixed.length);
  });

  it('CS-BC-4: Non-existent search term returns empty array cleanly without error', () => {
    const results = filterCatalog('all', 'nonexistentproduceitemxyz123', ALL_PRODUCTS);
    assert.ok(Array.isArray(results));
    assert.equal(results.length, 0);
  });

  it('CS-BC-5: Punctuation and special characters do not break query execution', () => {
    assert.doesNotThrow(() => {
      const results = filterCatalog('all', '!@#$%^&*()', ALL_PRODUCTS);
      assert.ok(Array.isArray(results));
      assert.equal(results.length, 0);
    });
  });

  it('CS-BC-6: Null or undefined category falls back safely to all products', () => {
    const resultsNull = filterCatalog(null, '', ALL_PRODUCTS);
    const resultsUndef = filterCatalog(undefined, '', ALL_PRODUCTS);
    assert.equal(resultsNull.length, 14);
    assert.equal(resultsUndef.length, 14);
  });

  it('CS-BC-7: Null or undefined query string is handled safely as empty query', () => {
    const resultsNull = filterCatalog('all', null, ALL_PRODUCTS);
    const resultsUndef = filterCatalog('all', undefined, ALL_PRODUCTS);
    assert.equal(resultsNull.length, 14);
    assert.equal(resultsUndef.length, 14);
  });

  it('CS-BC-8: Empty product list input returns empty array without throwing', () => {
    const results = filterCatalog('all', 'ugwu', []);
    assert.deepEqual(results, []);
  });

  it('CS-BC-9: Single character search handles short strings cleanly', () => {
    const results = filterCatalog('all', 'u', ALL_PRODUCTS);
    assert.ok(results.length > 0);
  });

  it('CS-BC-10: Products with missing keywords array still filter safely without TypeError', () => {
    const mockProducts = [
      { id: 'item-1', name: 'Cassava Starch', subtitle: 'Pure starch', category: 'Traditional Foods' },
      { id: 'item-2', name: 'Yam Flour', subtitle: 'Pounded Yam', category: 'Traditional Foods', keywords: ['yam', 'elubo'] }
    ];
    const results = filterCatalog('all', 'cassava', mockProducts);
    assert.equal(results.length, 1);
    assert.equal(results[0].id, 'item-1');
  });
});

// ============================================================================
// TIER 3: COMBINATORIAL COVERAGE & CATALOG INTEGRITY
// ============================================================================

describe('Tier 3: 14-Product Catalog Searchable Integrity', () => {
  it('CS-T3-1: Every single product in ALL_PRODUCTS has a non-empty keywords array', () => {
    assert.equal(ALL_PRODUCTS.length, 14);
    ALL_PRODUCTS.forEach(p => {
      assert.ok(Array.isArray(p.keywords), `Product ${p.id} missing keywords array`);
      assert.ok(p.keywords.length >= 3, `Product ${p.id} must have at least 3 keywords for search discoverability`);
    });
  });

  it('CS-T3-2: Every single product can be retrieved by its exact name query', () => {
    ALL_PRODUCTS.forEach(product => {
      const results = filterCatalog('all', product.name, ALL_PRODUCTS);
      assert.ok(results.length >= 1, `Product "${product.name}" not found by exact name`);
      assert.ok(results.some(p => p.id === product.id));
    });
  });

  it('CS-T3-3: Every single product can be retrieved by its first keyword', () => {
    ALL_PRODUCTS.forEach(product => {
      const firstKw = product.keywords[0];
      const results = filterCatalog('all', firstKw, ALL_PRODUCTS);
      assert.ok(results.length >= 1, `Product "${product.name}" not found by keyword "${firstKw}"`);
      assert.ok(results.some(p => p.id === product.id));
    });
  });

  it('CS-T3-4: 3 Live items have valid numerical prices and isLive=true', () => {
    const liveItems = ALL_PRODUCTS.filter(p => p.isLive);
    assert.equal(liveItems.length, 3);
    liveItems.forEach(item => {
      assert.equal(typeof item.price, 'number');
      assert.ok(item.price > 0);
      assert.equal(item.isLive, true);
      assert.equal(item.isComingSoon, false);
    });
  });

  it('CS-T3-5: 11 Coming Soon items have isComingSoon=true and price=null', () => {
    const comingSoonItems = ALL_PRODUCTS.filter(p => p.isComingSoon);
    assert.equal(comingSoonItems.length, 11);
    comingSoonItems.forEach(item => {
      assert.equal(item.isComingSoon, true);
      assert.equal(item.isLive, false);
      assert.equal(item.price, null);
      assert.equal(item.priceDisplay, 'Coming Soon');
    });
  });
});
