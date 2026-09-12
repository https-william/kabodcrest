/**
 * Kabod Crest - Shared Cart Store
 * Persists cart state across Shop, Product Detail, and Checkout pages via localStorage.
 * Dispatches 'kabod:cart-updated' on state changes for reactive UI synchronization.
 */

(function () {
  const STORAGE_KEY = 'kabod_crest_cart_v1';

  class CartStore {
    constructor() {
      this.items = this.loadCart();
      this.initEventListeners();
    }

    loadCart() {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      } catch (err) {
        console.warn('Unable to load cart from storage', err);
        return [];
      }
    }

    saveCart() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
      } catch (err) {
        console.warn('Unable to save cart to storage', err);
      }
      this.notify();
    }

    getItems() {
      return [...this.items];
    }

    getItem(productId) {
      return this.items.find(item => item.id === productId);
    }

    getTotalCount() {
      return this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    }

    addItem(product, quantity = 1) {
      const existing = this.items.find(item => item.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          subtitle: product.subtitle || '',
          weight: product.weight || '',
          priceDisplay: product.priceDisplay || 'Price: [TBC]',
          image: product.image || '',
          category: product.category || '',
          isPreOrder: true,
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
      const event = new CustomEvent('kabod:cart-updated', {
        detail: {
          items: this.getItems(),
          totalCount: this.getTotalCount()
        }
      });
      window.dispatchEvent(event);
    }

    initEventListeners() {
      // Sync cart across browser tabs/windows
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.items = this.loadCart();
          this.notify();
        }
      });
    }
  }

  // Global instance
  window.KabodCart = new CartStore();

  // Initialize UI controls for cart badges and drawer when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    updateBadges();
    initDrawer();
  });

  window.addEventListener('kabod:cart-updated', () => {
    updateBadges();
    renderDrawerItems();
  });

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
    if (!listEl || !emptyEl) return;

    const items = window.KabodCart.getItems();
    const count = window.KabodCart.getTotalCount();

    if (items.length === 0) {
      listEl.innerHTML = '';
      emptyEl.style.display = 'block';
      if (footerEl) footerEl.style.display = 'none';
      return;
    }

    emptyEl.style.display = 'none';
    if (footerEl) footerEl.style.display = 'block';

    listEl.innerHTML = items.map(item => `
      <li class="cart-item" data-product-id="${item.id}">
        <div class="cart-item-thumb">
          <img src="${item.image}" alt="${item.name}" loading="lazy" />
        </div>
        <div class="cart-item-info">
          <div class="cart-item-tag">PRE-ORDER</div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-spec">${item.weight} • ${item.priceDisplay}</div>
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
    `).join('');

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
})();
