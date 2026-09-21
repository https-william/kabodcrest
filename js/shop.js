/**
 * Kabod Crest - Shop / Catalog Controller
 * Quiet Authority & Barista Tone: Warm, conversational, and effortless.
 * Features:
 * - Real-time instant search across product names, subtitles, origin, and culinary keywords.
 * - Category tabs with dynamic count updates.
 * - Clean, unblurred product presentation for both live and coming soon items.
 * - Dynamic price estimates alongside NGN base prices.
 */

/**
 * Filters a product catalog list by category and search query.
 * Matches across: name, subtitle, origin, category, and keywords array.
 * Case-insensitive, trimmed query matching.
 *
 * @param {string} category - Category name or 'all'
 * @param {string} query - Free-text search string
 * @param {Array} [productsList] - Optional array of products, defaults to KABOD_PRODUCTS
 * @returns {Array} Filtered list of products
 */
function filterCatalog(category, query, productsList) {
  const source = productsList || (typeof KABOD_PRODUCTS !== 'undefined' ? KABOD_PRODUCTS : []);
  let list = (!category || category === 'all')
    ? source
    : source.filter(p => p.category === category);

  if (query && typeof query === 'string') {
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(p => {
        const nameMatch = p.name && p.name.toLowerCase().includes(q);
        const subMatch = p.subtitle && p.subtitle.toLowerCase().includes(q);
        const origMatch = p.origin && p.origin.toLowerCase().includes(q);
        const catMatch = p.category && p.category.toLowerCase().includes(q);
        const kwMatch = Array.isArray(p.keywords) && p.keywords.some(k => k.toLowerCase().includes(q));
        return Boolean(nameMatch || subMatch || origMatch || catMatch || kwMatch);
      });
    }
  }

  return list;
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
  const gridEl = document.getElementById('product-grid');
  const tabsContainer = document.getElementById('category-tabs');
  const emptyStateEl = document.getElementById('catalog-empty-state');
  const activeCategoryTitleEl = document.getElementById('active-category-title');
  const catalogCountEl = document.getElementById('catalog-count');
  const searchInput = document.getElementById('catalog-search-input');
  const searchClearBtn = document.getElementById('catalog-search-clear');
  const toastEl = document.getElementById('shop-toast');
  const toastMessageEl = document.getElementById('toast-message');
  const toastViewBtn = document.getElementById('toast-view-cart');

  let currentCategory = 'all';
  let currentSearchQuery = '';
  let toastTimer = null;

  // Catalog products data
  const products = (typeof KABOD_PRODUCTS !== 'undefined') ? KABOD_PRODUCTS : [];

  // Initialize tabs and counts
  initCategoryTabs();

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim().toLowerCase();
      if (searchClearBtn) {
        searchClearBtn.style.display = currentSearchQuery ? 'block' : 'none';
      }
      renderCatalog(currentCategory, currentSearchQuery);
    });
  }

  if (searchClearBtn && searchInput) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      currentSearchQuery = '';
      searchClearBtn.style.display = 'none';
      searchInput.focus();
      renderCatalog(currentCategory, '');
    });
  }

  // Initial render
  renderCatalog(currentCategory, currentSearchQuery);

  // Re-render price estimates when currency service finishes geo/rate lookup
  window.addEventListener('kabod:currency-ready', () => {
    updateCurrencyEstimates();
  });

  function initCategoryTabs() {
    if (!tabsContainer) return;

    // Calculate category counts
    const categoryCounts = {
      'all': products.length,
      'Dehydrated Vegetables': 0,
      'Spices & Seasonings': 0,
      'Seeds & Nuts': 0,
      'Traditional Foods': 0
    };

    products.forEach(p => {
      if (categoryCounts[p.category] !== undefined) {
        categoryCounts[p.category]++;
      }
    });

    // Update count labels inside tab buttons
    const tabs = tabsContainer.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
      const cat = tab.getAttribute('data-category');
      const countEl = tab.querySelector('.tab-count');
      if (countEl && categoryCounts[cat] !== undefined) {
        countEl.textContent = `(${categoryCounts[cat]})`;
      }

      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        currentCategory = cat;
        renderCatalog(currentCategory, currentSearchQuery);
      });
    });
  }

  function renderCatalog(category, query) {
    if (!gridEl) return;

    const filtered = filterCatalog(category, query, products);

    // Update headings
    if (activeCategoryTitleEl) {
      if (query) {
        activeCategoryTitleEl.textContent = `Search results for "${query}"`;
      } else {
        activeCategoryTitleEl.textContent = (category === 'all') ? 'All Nigerian Agro-Produce' : category;
      }
    }

    if (catalogCountEl) {
      if (filtered.length === products.length) {
        catalogCountEl.textContent = `Showing all ${filtered.length} pantry items`;
      } else {
        catalogCountEl.textContent = `Showing ${filtered.length} item${filtered.length === 1 ? '' : 's'}`;
      }
    }

    // Handle Empty State
    if (filtered.length === 0) {
      gridEl.innerHTML = '';
      if (emptyStateEl) {
        emptyStateEl.style.display = 'block';
        const emptyMsg = emptyStateEl.querySelector('.empty-state-text');
        if (emptyMsg) {
          emptyMsg.textContent = query
            ? `We couldn't find anything matching "${query}". Try searching for another ingredient, or take a look through our full pantry collection.`
            : 'We are currently preparing more items for this department. Please explore our other categories or check back soon.';
        }
      }
      return;
    }

    if (emptyStateEl) emptyStateEl.style.display = 'none';

    // Render cards
    gridEl.innerHTML = filtered.map(product => {
      const originDisplay = product.origin ? product.origin.split(',')[0].trim() : 'Nigeria';
      const isLocked = !product.isLive || product.isComingSoon;

      // Pricing markup
      let priceMarkup = '';
      if (isLocked) {
        priceMarkup = `<span class="product-price-coming-soon">Coming Soon</span>`;
      } else if (product.price && typeof product.price === 'number') {
        const estimate = (window.KabodCurrency) ? window.KabodCurrency.formatEstimate(product.price) : '';
        priceMarkup = `
          <div class="product-price-stack">
            <span class="product-price-val">${product.priceDisplay}</span>
            <span class="price-estimate-tag js-currency-estimate" data-ngn="${product.price}">${estimate}</span>
          </div>
        `;
      } else {
        priceMarkup = `<span class="product-price-tbc">${product.priceDisplay}</span>`;
      }

      // Thumbnail markup - clean, unblurred, appetizing
      const thumbContent = `
        <img
          src="${product.image}"
          alt="Packaging for ${product.name} (${product.subtitle})"
          class="product-thumb-image"
          loading="lazy"
          onerror="this.src='assets/images/logo/icon-gold.png'; this.style.padding='40px';"
        />
      `;

      // Top badge
      const badgeMarkup = isLocked
        ? `<span class="product-status-tag locked">Coming Soon</span>`
        : `<span class="product-status-tag live">Ready to Order</span>`;

      // Action button
      let actionBtnMarkup = '';
      if (isLocked) {
        actionBtnMarkup = `
          <button
            type="button"
            class="btn-preorder btn-disabled"
            disabled
            title="In preparation"
            aria-disabled="true"
          >
            <span class="preorder-btn-label">Coming Soon</span>
          </button>
        `;
      } else {
        actionBtnMarkup = `
          <button
            type="button"
            class="btn-preorder js-add-preorder"
            data-id="${product.id}"
            aria-label="Add ${product.name} to bag"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span class="preorder-btn-label">Add to Bag</span>
          </button>
        `;
      }

      return `
      <article class="product-card ${isLocked ? 'product-card-locked' : ''}" data-product-id="${product.id}" data-category="${product.category}">
        <div class="product-card-badge-row">
          ${badgeMarkup}
        </div>

        <a href="product-detail.html?id=${encodeURIComponent(product.id)}" class="product-thumb-wrap" aria-label="View details for ${product.name}">
          ${thumbContent}
        </a>

        <div class="product-card-body">
          <div class="product-meta-row">
            <span class="product-category-label">${product.category}</span>
            <span class="product-origin-tag">${originDisplay}</span>
          </div>

          <h2 class="product-title">
            <a href="product-detail.html?id=${encodeURIComponent(product.id)}">${product.name}</a>
          </h2>
          <div class="product-subtitle">${product.subtitle}</div>

          <div class="product-card-specs">
            <span class="product-weight">${product.weight}</span>
            ${priceMarkup}
          </div>

          <div class="product-card-action">
            ${actionBtnMarkup}
          </div>
        </div>
      </article>
      `;
    }).join('');

    // Attach click events to Add to Bag buttons
    gridEl.querySelectorAll('.js-add-preorder').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        const prod = products.find(p => p.id === id);
        if (prod && window.KabodCart) {
          window.KabodCart.addItem(prod, 1);
          
          // Micro-interaction visual feedback
          const originalHTML = btn.innerHTML;
          btn.classList.add('btn-added');
          btn.innerHTML = `
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Added ✓</span>
          `;
          
          setTimeout(() => {
            btn.classList.remove('btn-added');
            btn.innerHTML = originalHTML;
          }, 1400);

          showToast(`Added 1× ${prod.name} to your bag`);
        }
      });
    });
  }

  function updateCurrencyEstimates() {
    if (!window.KabodCurrency) return;
    document.querySelectorAll('.js-currency-estimate').forEach(el => {
      const ngn = parseFloat(el.getAttribute('data-ngn'));
      if (ngn) {
        el.textContent = window.KabodCurrency.formatEstimate(ngn);
      }
    });
  }

  // Reset button in empty state
  const resetBtn = document.getElementById('btn-reset-filter');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        currentSearchQuery = '';
      }
      if (searchClearBtn) {
        searchClearBtn.style.display = 'none';
      }
      const allTab = tabsContainer ? tabsContainer.querySelector('[data-category="all"]') : null;
      if (allTab) {
        allTab.click();
      } else {
        currentCategory = 'all';
        renderCatalog('all', '');
      }
    });
  }

  function showToast(message) {
    if (!toastEl || !toastMessageEl) return;

    toastMessageEl.textContent = message;
    toastEl.classList.add('show');
    toastEl.setAttribute('aria-hidden', 'false');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
      toastEl.setAttribute('aria-hidden', 'true');
    }, 4000);
  }

  if (toastViewBtn) {
    toastViewBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.openCartDrawer === 'function') {
        window.openCartDrawer();
      }
      if (toastEl) toastEl.classList.remove('show');
    });
  }
  });
}

// Expose filterCatalog for external callers and test runners
if (typeof window !== 'undefined') {
  window.KabodCatalog = { filterCatalog };
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { filterCatalog };
}
