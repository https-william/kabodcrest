/**
 * Kabod Crest - Shared Cart Store
 * Persists cart state across Shop, Product Detail, and Checkout pages via localStorage.
 * Dispatches 'kabod:cart-updated' on state changes for reactive UI synchronization.
 */

(function () {
  const STORAGE_KEY = 'kabod_crest_cart_v1';

  /**
   * Formats a numerical amount into a Nigerian Naira currency string.
   * e.g. 2850 -> "₦2,850", 5700 -> "₦5,700"
   */
  function formatNaira(amount) {
    if (amount === undefined || amount === null) {
      return '₦0';
    }
    const num = (typeof amount === 'string') ? parseFloat(amount) : amount;
    if (typeof num !== 'number' || isNaN(num)) {
      return '₦0';
    }
    const isNegative = num < 0;
    const absVal = Math.round(Math.abs(num));
    const formatted = absVal.toLocaleString('en-NG');
    return (isNegative ? '-₦' : '₦') + formatted;
  }

  /**
   * Calculates cart totals including item line totals, subtotal, and pre-order tagging.
   * Interface contract per PROJECT.md § Interface Contracts.
   */
  function calculateCartTotals(items = []) {
    let pricedSubtotal = 0;
    let tbcCount = 0;
    let totalCount = 0;

    const calculatedItems = (items || []).map(item => {
      const qty = (typeof item.quantity === 'number' && item.quantity > 0)
        ? Math.floor(item.quantity)
        : 1;
      totalCount += qty;

      const isPriced = typeof item.price === 'number' && !isNaN(item.price) && item.price !== null && !item.isPreOrder;
      let lineTotal = null;
      let lineTotalDisplay = item.priceDisplay || 'Price: [TBC]';

      if (isPriced) {
        lineTotal = item.price * qty;
        lineTotalDisplay = formatNaira(lineTotal);
        pricedSubtotal += lineTotal;
      } else {
        tbcCount += qty;
      }

      return {
        ...item,
        quantity: qty,
        lineTotal,
        lineTotalDisplay,
        isPriced
      };
    });

    const hasPriced = pricedSubtotal > 0;
    const hasTbc = tbcCount > 0;
    const isMixed = hasPriced && hasTbc;

    let formattedSubtotal = '₦0';
    let formattedSummaryTotal = '₦0';

    if (items && items.length > 0) {
      if (hasPriced && !hasTbc) {
        formattedSubtotal = formatNaira(pricedSubtotal);
        formattedSummaryTotal = formattedSubtotal;
      } else if (hasPriced && hasTbc) {
        formattedSubtotal = `${formatNaira(pricedSubtotal)} + [${tbcCount} TBC item${tbcCount > 1 ? 's' : ''}]`;
        formattedSummaryTotal = `${formatNaira(pricedSubtotal)} + [${tbcCount} TBC item${tbcCount > 1 ? 's' : ''}]`;
      } else if (!hasPriced && hasTbc) {
        formattedSubtotal = 'Price: [TBC]';
        formattedSummaryTotal = 'Price: [TBC]';
      }
    }

    return {
      items: calculatedItems,
      totalCount,
      pricedSubtotal,
      tbcCount,
      hasPriced,
      hasTbc,
      isMixed,
      formattedSubtotal,
      formattedSummaryTotal
    };
  }

  class CartStore {
    constructor() {
      this.items = this.loadCart();
      if (typeof window !== 'undefined') {
        this.initEventListeners();
      }
    }

    loadCart() {
      if (typeof localStorage === 'undefined') return [];
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        const rawItems = data ? JSON.parse(data) : [];
        if (Array.isArray(rawItems)) {
          return rawItems.map(item => {
            let catalogProduct = null;
            if (typeof getProductById === 'function') {
              catalogProduct = getProductById(item.id);
            } else if (typeof KABOD_PRODUCTS !== 'undefined' && Array.isArray(KABOD_PRODUCTS)) {
              catalogProduct = KABOD_PRODUCTS.find(p => p.id === item.id);
            }
            if (catalogProduct) {
              return {
                ...item,
                id: catalogProduct.id,
                name: catalogProduct.name,
                subtitle: catalogProduct.subtitle || item.subtitle || '',
                weight: catalogProduct.weight || item.weight || '',
                price: (typeof catalogProduct.price === 'number') ? catalogProduct.price : null,
                priceDisplay: catalogProduct.priceDisplay || item.priceDisplay || 'Price: [TBC]',
                image: catalogProduct.image || item.image || '',
                category: catalogProduct.category || item.category || '',
                isPreOrder: !!catalogProduct.isPreOrder
              };
            }
            return item;
          });
        }
        return [];
      } catch (err) {
        console.warn('Unable to load cart from storage', err);
        return [];
      }
    }

    saveCart() {
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
        } catch (err) {
          console.warn('Unable to save cart to storage', err);
        }
      }
      this.notify();
    }

    getItems() {
      return [...this.items];
    }

    getItem(productId) {
      if (!productId) return undefined;
      return this.items.find(item => item.id === productId);
    }

    getTotalCount() {
      return this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    }

    getSubtotal() {
      return this.getTotals().pricedSubtotal;
    }

    getFormattedSubtotal() {
      return this.getTotals().formattedSubtotal;
    }

    getLineTotal(itemOrId) {
      const id = (typeof itemOrId === 'object' && itemOrId !== null) ? itemOrId.id : itemOrId;
      const totals = this.getTotals();
      const found = totals.items.find(it => it.id === id);
      return found ? found.lineTotal : null;
    }

    getFormattedLineTotal(itemOrId) {
      const id = (typeof itemOrId === 'object' && itemOrId !== null) ? itemOrId.id : itemOrId;
      const totals = this.getTotals();
      const found = totals.items.find(it => it.id === id);
      return found ? found.lineTotalDisplay : 'Price: [TBC]';
    }

    getTotals() {
      return calculateCartTotals(this.items);
    }

    getTbcCount() {
      return this.getTotals().tbcCount;
    }

    addItem(product, quantity = 1) {
      if (!product) return;
      const targetId = product.id || product;
      let catalogProduct = null;
      if (typeof getProductById === 'function') {
        catalogProduct = getProductById(targetId);
      } else if (typeof KABOD_PRODUCTS !== 'undefined' && Array.isArray(KABOD_PRODUCTS)) {
        catalogProduct = KABOD_PRODUCTS.find(p => p.id === targetId);
      }

      const effectiveProduct = catalogProduct || product;
      const canonicalId = effectiveProduct.id || targetId;

      const existing = this.items.find(item => item.id === canonicalId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({
          id: canonicalId,
          name: effectiveProduct.name || 'Agro Produce Item',
          subtitle: effectiveProduct.subtitle || '',
          weight: effectiveProduct.weight || '',
          price: (typeof effectiveProduct.price === 'number') ? effectiveProduct.price : null,
          priceDisplay: effectiveProduct.priceDisplay || 'Price: [TBC]',
          image: effectiveProduct.image || '',
          category: effectiveProduct.category || '',
          isPreOrder: !!effectiveProduct.isPreOrder,
          quantity: quantity
        });
      }
      this.saveCart();
    }

    updateQuantity(productId, quantity) {
      const target = this.items.find(item => item.id === productId);
      if (!target) return;

      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        target.quantity = quantity;
        this.saveCart();
      }
    }

    removeItem(productId) {
      this.items = this.items.filter(item => item.id !== productId);
      this.saveCart();
    }

    clear() {
      this.items = [];
      this.saveCart();
    }

    notify() {
      const totals = this.getTotals();
      if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') {
        const event = new CustomEvent('kabod:cart-updated', {
          detail: {
            items: this.getItems(),
            totalCount: this.getTotalCount(),
            subtotal: totals.pricedSubtotal,
            formattedSubtotal: totals.formattedSubtotal,
            lineTotals: totals.items.map(it => ({ id: it.id, lineTotal: it.lineTotal, lineTotalDisplay: it.lineTotalDisplay })),
            tbcCount: totals.tbcCount,
            isMixed: totals.isMixed,
            totals: totals
          }
        });
        window.dispatchEvent(event);
      }
    }

    initEventListeners() {
      // Sync cart across browser tabs/windows
      if (typeof window !== 'undefined') {
        window.addEventListener('storage', (e) => {
          if (e.key === STORAGE_KEY) {
            this.items = this.loadCart();
            this.notify();
          }
        });
      }
    }
  }

  // Global instances & exports
  if (typeof window !== 'undefined') {
    window.KabodCart = new CartStore();
    window.KabodPricing = { formatNaira, calculateCartTotals };
    window.formatNaira = formatNaira;
  }

  // Initialize UI controls for cart badges and drawer when DOM is ready
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      updateBadges();
      initDrawer();
      renderDrawerItems();
    });
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('kabod:cart-updated', () => {
      updateBadges();
      renderDrawerItems();
    });
  }

  function updateBadges() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = window.KabodCart.getTotalCount();
    badges.forEach(badge => {
      badge.textContent = count;
      badge.setAttribute('aria-label', `${count} items in cart`);
    });
  }

  function initDrawer() {
    const toggles = document.querySelectorAll('.js-cart-toggle');
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    const closeBtn = document.getElementById('cart-close-btn');

    if (!drawer || !backdrop) return;

    function openDrawer() {
      drawer.classList.add('open');
      backdrop.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      renderDrawerItems();
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
    }

    toggles.forEach(btn => btn.addEventListener('click', openDrawer));
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    // Expose open helper
    window.openCartDrawer = openDrawer;
    window.closeCartDrawer = closeDrawer;
  }

  function renderDrawerItems() {
    const listEl = document.getElementById('cart-items-list');
    const emptyEl = document.getElementById('cart-empty-state');
    const footerEl = document.getElementById('cart-drawer-footer');
    const subtotalEl = document.getElementById('cart-drawer-subtotal');
    if (!listEl || !emptyEl) return;

    if (!window.KabodCart) return;
    const totals = window.KabodCart.getTotals();
    const items = totals.items;

    if (items.length === 0) {
      listEl.innerHTML = '';
      emptyEl.style.display = 'block';
      if (footerEl) footerEl.style.display = 'none';
      if (subtotalEl) subtotalEl.textContent = '₦0';
      return;
    }

    emptyEl.style.display = 'none';
    if (footerEl) footerEl.style.display = 'block';
    if (subtotalEl) {
      subtotalEl.textContent = totals.formattedSubtotal;
    }

    listEl.innerHTML = items.map(item => {
      let lineSpec = `${item.weight} • ${item.priceDisplay}`;
      if (item.isPriced && typeof item.lineTotal === 'number') {
        const formattedTotal = item.lineTotalDisplay;
        lineSpec = (item.quantity > 1)
          ? `${item.weight} • ${item.quantity} × ${item.priceDisplay} = <strong style="color: var(--color-plum, #4A1525); font-weight: 700;">${formattedTotal}</strong>`
          : `${item.weight} • <strong style="color: var(--color-plum, #4A1525); font-weight: 700;">${formattedTotal}</strong>`;
        if (window.KabodCurrency) {
          const est = window.KabodCurrency.formatEstimate(item.lineTotal);
          if (est) {
            lineSpec += `<span class="cart-item-estimate" style="font-size: 0.6875rem; color: var(--color-gold); font-weight: 600; margin-left: 4px;">${est}</span>`;
          }
        }
      }

      return `
        <li class="cart-item" data-product-id="${item.id}">
          <div class="cart-item-thumb">
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
          </div>
          <div class="cart-item-info">
            <div class="cart-item-tag ${item.isPreOrder ? '' : 'live'}">${item.isPreOrder ? 'PRE-ORDER' : 'LIVE ORDER'}</div>
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-spec">
              ${lineSpec}
            </div>
            <div class="cart-item-qty-row">
              <div class="cart-qty-control" role="group" aria-label="Adjust quantity">
                <button type="button" class="qty-btn js-qty-decrease" aria-label="Decrease quantity" data-id="${item.id}">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button type="button" class="qty-btn js-qty-increase" aria-label="Increase quantity" data-id="${item.id}">+</button>
              </div>
              <button type="button" class="cart-item-remove js-remove-item" data-id="${item.id}">Remove</button>
            </div>
          </div>
        </li>
      `;
    }).join('');

    // Attach listeners
    listEl.querySelectorAll('.js-qty-decrease').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = window.KabodCart.getItem(id);
        if (item) window.KabodCart.updateQuantity(id, item.quantity - 1);
      });
    });

    listEl.querySelectorAll('.js-qty-increase').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = window.KabodCart.getItem(id);
        if (item) window.KabodCart.updateQuantity(id, item.quantity + 1);
      });
    });

    listEl.querySelectorAll('.js-remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        window.KabodCart.removeItem(id);
      });
    });
  }

  // Node CommonJS export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { formatNaira, calculateCartTotals, CartStore };
  }
})();
