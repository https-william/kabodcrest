/**
 * Kabod Crest - Product Detail Page Controller
 * Dynamically loads and renders product information from KABOD_PRODUCTS based on URL parameter (?id=...).
 * Integrates shared cart persistence, gallery thumbnail switching, and related products.
 */

document.addEventListener('DOMContentLoaded', () => {
  const products = (typeof KABOD_PRODUCTS !== 'undefined') ? KABOD_PRODUCTS : [];
  if (products.length === 0) {
    console.error('KABOD_PRODUCTS catalog data not found.');
    return;
  }

  // 1. Parse product ID from query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const requestedId = urlParams.get('id');

  // Find product or fallback to first product
  let product = products.find(p => p.id === requestedId);
  if (!product) {
    product = products[0]; // Default: Dehydrated Ugwu
    if (requestedId) {
      console.warn(`Product '${requestedId}' not found. Defaulting to '${product.id}'.`);
    }
  }

  // 2. Populate Page Title & Meta
  document.title = `${product.name} (${product.subtitle}) — Kabod Crest Foods`;

  // 3. Populate Breadcrumb
  const breadcrumbCategoryEl = document.getElementById('breadcrumb-category');
  const breadcrumbProductEl = document.getElementById('breadcrumb-product');
  if (breadcrumbCategoryEl) {
    breadcrumbCategoryEl.textContent = product.category;
    breadcrumbCategoryEl.href = `shop.html`;
  }
  if (breadcrumbProductEl) {
    breadcrumbProductEl.textContent = product.name;
  }

  // 4. Populate Desk Details
  const categoryEl = document.getElementById('product-desk-category');
  const titleEl = document.getElementById('product-desk-title');
  const subtitleEl = document.getElementById('product-desk-subtitle');
  const priceEl = document.getElementById('product-price-value');
  const weightPillEl = document.getElementById('spec-weight-pill');
  const categoryPillEl = document.getElementById('spec-category-pill');
  const originPillEl = document.getElementById('spec-origin-pill');
  const shortDescEl = document.getElementById('product-short-desc');
  const featuresListEl = document.getElementById('product-features-list');

  if (categoryEl) categoryEl.textContent = product.category;
  if (titleEl) titleEl.textContent = product.name;
  if (subtitleEl) subtitleEl.textContent = product.subtitle;
  if (priceEl) priceEl.textContent = product.priceDisplay || 'Price: [TBC]';
  if (weightPillEl) weightPillEl.textContent = product.weight;
  if (categoryPillEl) categoryPillEl.textContent = product.category;
  if (originPillEl) originPillEl.textContent = product.origin || 'Nigeria';
  if (shortDescEl) shortDescEl.textContent = product.shortDescription || product.description;

  if (featuresListEl && product.features) {
    featuresListEl.innerHTML = product.features.map(f => `
      <li class="feature-item">
        <span class="feature-icon" aria-hidden="true">◆</span>
        <span>${f}</span>
      </li>
    `).join('');
  }

  // 5. Initialize Image Gallery
  const mainImageEl = document.getElementById('gallery-main-image');
  const thumbnailsStripEl = document.getElementById('gallery-thumbnails');
  const galleryItems = product.gallery || [
    { src: product.image, alt: product.name, label: 'Main View' }
  ];

  if (mainImageEl) {
    mainImageEl.src = galleryItems[0].src;
    mainImageEl.alt = galleryItems[0].alt;
  }

  if (thumbnailsStripEl) {
    thumbnailsStripEl.innerHTML = galleryItems.map((item, index) => `
      <button
        type="button"
        class="gallery-thumb-btn ${index === 0 ? 'active' : ''}"
        data-src="${item.src}"
        data-alt="${item.alt}"
        aria-label="${item.label}"
      >
        <img src="${item.src}" alt="${item.alt}" class="gallery-thumb-img" />
        <span class="gallery-thumb-label">${item.label}</span>
      </button>
    `).join('');

    const thumbButtons = thumbnailsStripEl.querySelectorAll('.gallery-thumb-btn');
    thumbButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        thumbButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const newSrc = btn.getAttribute('data-src');
        const newAlt = btn.getAttribute('data-alt');
        if (mainImageEl) {
          mainImageEl.style.opacity = '0.4';
          setTimeout(() => {
            mainImageEl.src = newSrc;
            mainImageEl.alt = newAlt;
            mainImageEl.style.opacity = '1';
          }, 120);
        }
      });
    });
  }

  // 6. Quantity Controller & Add to Pre-Order
  const qtyInput = document.getElementById('qty-input');
  const qtyDecBtn = document.getElementById('qty-btn-minus');
  const qtyIncBtn = document.getElementById('qty-btn-plus');
  const preorderBtn = document.getElementById('btn-add-preorder-desk');

  let currentQty = 1;

  if (qtyDecBtn && qtyInput) {
    qtyDecBtn.addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        qtyInput.value = currentQty;
      }
    });
  }

  if (qtyIncBtn && qtyInput) {
    qtyIncBtn.addEventListener('click', () => {
      currentQty++;
      qtyInput.value = currentQty;
    });
  }

  if (qtyInput) {
    qtyInput.addEventListener('change', () => {
      let val = parseInt(qtyInput.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      currentQty = val;
      qtyInput.value = currentQty;
    });
  }

  if (preorderBtn) {
    preorderBtn.addEventListener('click', () => {
      if (window.KabodCart) {
        window.KabodCart.addItem(product, currentQty);
        showToast(`Added ${currentQty}x ${product.name} to pre-orders`);
      }
    });
  }

  // 7. Information Accordions (How to Use, How to Store, FAQs)
  const useContentEl = document.getElementById('accordion-use-content');
  const storeContentEl = document.getElementById('accordion-store-content');
  const faqContentEl = document.getElementById('accordion-faq-content');

  // How to Use
  if (useContentEl) {
    if (product.howToUse && product.howToUse !== 'Information coming soon') {
      useContentEl.innerHTML = `<p>${product.howToUse}</p>`;
    } else {
      useContentEl.innerHTML = `
        <div class="info-coming-soon-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>Culinary usage guide: Information coming soon</span>
        </div>
      `;
    }
  }

  // How to Store
  if (storeContentEl) {
    if (product.howToStore && product.howToStore !== 'Information coming soon') {
      storeContentEl.innerHTML = `<p>${product.howToStore}</p>`;
    } else {
      storeContentEl.innerHTML = `
        <div class="info-coming-soon-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>Pantry storage specifications: Information coming soon</span>
        </div>
      `;
    }
  }

  // FAQs
  if (faqContentEl) {
    if (product.faqs && product.faqs.length > 0) {
      faqContentEl.innerHTML = `
        <div class="faq-list">
          ${product.faqs.map(faq => `
            <div class="faq-item">
              <div class="faq-question">${faq.question}</div>
              <div class="faq-answer">${faq.answer}</div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      faqContentEl.innerHTML = `
        <div class="info-coming-soon-box">
          <span>Frequently asked questions: Information coming soon</span>
        </div>
      `;
    }
  }

  // 8. Render Related Products (Same category, or fallback to others)
  const relatedGridEl = document.getElementById('related-products-grid');
  const relatedCategoryTitleEl = document.getElementById('related-category-title');

  if (relatedCategoryTitleEl) {
    relatedCategoryTitleEl.textContent = product.category;
  }

  if (relatedGridEl) {
    let related = products.filter(p => p.id !== product.id && p.category === product.category);
    // If not enough in same category, supplement with items from other categories
    if (related.length < 3) {
      const others = products.filter(p => p.id !== product.id && p.category !== product.category);
      related = [...related, ...others].slice(0, 4);
    } else {
      related = related.slice(0, 4);
    }

    relatedGridEl.innerHTML = related.map(rel => `
      <article class="product-card" data-product-id="${rel.id}">
        <div class="product-card-badge-row">
          <span class="preorder-pill">Pre-Order</span>
        </div>

        <a href="product-detail.html?id=${encodeURIComponent(rel.id)}" class="product-thumb-wrap" aria-label="View details for ${rel.name}">
          <img
            src="${rel.image}"
            alt="Packaging for ${rel.name} (${rel.subtitle})"
            class="product-thumb-image"
            loading="lazy"
            onerror="this.src='assets/images/logo/icon-gold.png'; this.style.padding='40px';"
          />
        </a>

        <div class="product-card-body">
          <div class="product-category-label">${rel.category}</div>
          <h3 class="product-title">
            <a href="product-detail.html?id=${encodeURIComponent(rel.id)}">${rel.name}</a>
          </h3>
          <div class="product-subtitle">${rel.subtitle}</div>

          <div class="product-card-specs">
            <span class="product-weight">${rel.weight}</span>
            <span class="product-price-tbc">${rel.priceDisplay}</span>
          </div>

          <div class="product-card-action">
            <button
              type="button"
              class="btn-preorder js-add-related-preorder"
              data-id="${rel.id}"
              aria-label="Add ${rel.name} to pre-orders"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Add to Pre-Order</span>
            </button>
          </div>
        </div>
      </article>
    `).join('');

    relatedGridEl.querySelectorAll('.js-add-related-preorder').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        const item = products.find(p => p.id === id);
        if (item && window.KabodCart) {
          window.KabodCart.addItem(item, 1);
          showToast(`Added ${item.name} to pre-orders`);
        }
      });
    });
  }

  // Toast Helper
  const toastEl = document.getElementById('shop-toast');
  const toastMessageEl = document.getElementById('toast-message');
  const toastViewBtn = document.getElementById('toast-view-cart');
  let toastTimer = null;

  function showToast(msg) {
    if (!toastEl || !toastMessageEl) return;
    toastMessageEl.textContent = msg;
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
