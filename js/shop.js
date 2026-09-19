/**
 * Kabod Crest - Shop / Catalog Controller
 * Handles product catalog filtering, card rendering, and pre-order / live purchase interactions.
 * Supports:
 * - Live items (Dehydrated Ugwu ₦10,000, Dehydrated Ginger [TBC], Jollof Spice [TBC])
 * - Locked items (11 items with 8px blur, non-clickable, centered "Coming Soon" badge)
 * - Dynamic approximate currency estimate display alongside NGN base prices
 * - Quiet Authority card styling and micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  const gridEl = document.getElementById('product-grid');
  const tabsContainer = document.getElementById('category-tabs');
  const emptyStateEl = document.getElementById('catalog-empty-state');
  const activeCategoryTitleEl = document.getElementById('active-category-title');
  const catalogCountEl = document.getElementById('catalog-count');
  const toastEl = document.getElementById('shop-toast');
  const toastMessageEl = document.getElementById('toast-message');
  const toastViewBtn = document.getElementById('toast-view-cart');

  let currentCategory = 'all';
  let toastTimer = null;

  // Verify catalog data
  const products = (typeof KABOD_PRODUCTS !== 'undefined') ? KABOD_PRODUCTS : [];

  // Initialize tabs and counts
  initCategoryTabs();

  // Initial render
  renderCatalog(currentCategory);

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

    // Update count labels inside existing tab elements
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
        renderCatalog(currentCategory);
      });
    });
  }

  function renderCatalog(category) {
    if (!gridEl) return;

    const filtered = (category === 'all')
      ? products
      : products.filter(p => p.category === category);

    // Update headings
    if (activeCategoryTitleEl) {
      activeCategoryTitleEl.textContent = (category === 'all') ? 'All Nigerian Agro-Produce' : category;
    }
    if (catalogCountEl) {
      catalogCountEl.textContent = `Showing ${filtered.length} item${filtered.length === 1 ? '' : 's'}`;
    }

    // Handle Empty State
    if (filtered.length === 0) {
      gridEl.innerHTML = '';
      if (emptyStateEl) emptyStateEl.style.display = 'block';
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
        priceMarkup = `<span class="product-price-tbc" title="Commercial price will be confirmed prior to shipment">${product.priceDisplay}</span>`;
      }

      // Thumbnail markup
      const thumbContent = `
        <img
          src="${product.image}"
          alt="Packaging for ${product.name} (${product.subtitle})"
          class="product-thumb-image"
          loading="lazy"
          onerror="this.src='assets/images/logo/icon-gold.png'; this.style.padding='40px';"
        />
        ${isLocked ? `
          <div class="coming-soon-overlay">
            <span class="coming-soon-badge">Coming Soon</span>
          </div>
        ` : ''}
      `;

      // Top badge
      const badgeMarkup = isLocked
        ? `<span class="product-status-tag locked">Coming Soon</span>`
        : (product.price ? `<span class="product-status-tag live">Live Order</span>` : `<span class="product-status-tag preorder">Pre-Order</span>`);

      // Action button
      let actionBtnMarkup = '';
      if (isLocked) {
        actionBtnMarkup = `
          <button
            type="button"
            class="btn-preorder btn-disabled"
            disabled
            title="Available soon"
            aria-disabled="true"
          >
            <span class="preorder-btn-label">Available Soon</span>
          </button>
        `;
      } else {
        const btnLabel = product.price ? 'Add to Bag' : 'Reserve Allocation';
        actionBtnMarkup = `
          <button
            type="button"
            class="btn-preorder js-add-preorder"
            data-id="${product.id}"
            aria-label="${btnLabel} for ${product.name}"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span class="preorder-btn-label">${btnLabel}</span>
          </button>
        `;
      }

      return `
      <article class="product-card ${isLocked ? 'product-card-locked' : ''}" data-product-id="${product.id}" data-category="${product.category}">
        ${isLocked ? `
          <div class="product-thumb-wrap">
            ${thumbContent}
          </div>
        ` : `
          <a href="product-detail.html?id=${encodeURIComponent(product.id)}" class="product-thumb-wrap" aria-label="View details for ${product.name}">
            ${thumbContent}
          </a>
        `}

        <div class="product-card-body">
          <div class="product-meta-row">
            <span class="product-category-label">${product.category}</span>
            <span class="product-origin-tag">${originDisplay}</span>
          </div>

          <div style="margin-bottom: 4px;">${badgeMarkup}</div>

          <h2 class="product-title">
            ${isLocked ? product.name : `<a href="product-detail.html?id=${encodeURIComponent(product.id)}">${product.name}</a>`}
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

    // Attach click events to Add buttons
    gridEl.querySelectorAll('.js-add-preorder').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        const prod = products.find(p => p.id === id);
        if (prod && window.KabodCart) {
          window.KabodCart.addItem(prod, 1);
          
          // Instant micro-interaction visual confirmation
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

          showToast(`Added 1× ${prod.name} to order bag`);
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
      const allTab = tabsContainer ? tabsContainer.querySelector('[data-category="all"]') : null;
      if (allTab) allTab.click();
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
