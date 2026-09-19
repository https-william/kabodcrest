/**
 * Kabod Crest - Shop / Catalog Controller
 * Handles product catalog filtering, card rendering, and pre-order interactions.
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
      activeCategoryTitleEl.textContent = (category === 'all') ? 'All Pre-Order Agro-Produce' : category;
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
      return `
      <article class="product-card" data-product-id="${product.id}" data-category="${product.category}">
        <a href="product-detail.html?id=${encodeURIComponent(product.id)}" class="product-thumb-wrap" aria-label="View details for ${product.name}">
          <img
            src="${product.image}"
            alt="Packaging for ${product.name} (${product.subtitle})"
            class="product-thumb-image"
            loading="lazy"
            onerror="this.src='assets/images/logo/icon-gold.png'; this.style.padding='40px';"
          />
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
            <span class="product-price-tbc" title="Commercial price will be confirmed prior to shipment">${product.priceDisplay}</span>
          </div>

          <div class="product-card-action">
            <button
              type="button"
              class="btn-preorder js-add-preorder"
              data-id="${product.id}"
              aria-label="Reserve ${product.name} allocation"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span class="preorder-btn-label">Reserve Allocation</span>
            </button>
          </div>
        </div>
      </article>
    `;
    }).join('');

    // Attach click events to Add to Pre-Order buttons with instant psychological feedback
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
            <span>Allocated ✓</span>
          `;
          
          setTimeout(() => {
            btn.classList.remove('btn-added');
            btn.innerHTML = originalHTML;
          }, 1400);

          showToast(`Reserved 1× ${prod.name} in pre-order allocation`);
        }
      });
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
