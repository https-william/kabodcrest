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
  document.title = `${product.name} (${product.subtitle}) | Kabod Crest Foods`;

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
  
  const isLocked = !product.isLive || product.isComingSoon;
  const subnoteEl = document.getElementById('product-price-subnote');

  function renderPriceDetail() {
    if (!priceEl) return;
    if (isLocked) {
      priceEl.textContent = "Coming Soon";
      priceEl.style.color = "var(--color-text-subtle)";
      if (subnoteEl) {
        subnoteEl.textContent = "We are currently preparing and testing this harvest batch. It will be available here soon.";
      }
    } else if (product.price && typeof product.price === 'number') {
      const estimate = window.KabodCurrency ? window.KabodCurrency.formatEstimate(product.price) : '';
      priceEl.innerHTML = `<span>${product.priceDisplay}</span> <span class="price-estimate-tag js-currency-estimate" style="font-size: 0.9375rem; margin-left: 6px; color: var(--color-gold); font-weight: 500;">${estimate}</span>`;
      if (subnoteEl) {
        subnoteEl.textContent = "Freshly packed and ready for prompt dispatch to your doorstep.";
      }
    } else {
      priceEl.textContent = product.priceDisplay || 'Price: [TBC]';
    }
  }

  renderPriceDetail();
  window.addEventListener('kabod:currency-ready', renderPriceDetail);

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

  // 4b. Populate Culinary Pairings & Sensory Strip
  const culinaryStripEl = document.getElementById('product-culinary-strip');
  if (culinaryStripEl) {
    let culinaryHtml = '';
    if (Array.isArray(product.culinaryPairings) && product.culinaryPairings.length > 0) {
      culinaryHtml += `
        <div class="culinary-pairings-box">
          <div class="culinary-pairings-label">Traditional Dish Pairings</div>
          <div class="culinary-chips-row">
            ${product.culinaryPairings.map(cp => `<span class="culinary-chip">${cp}</span>`).join('')}
          </div>
        </div>
      `;
    }
    if (product.sensoryProfile) {
      const { aroma, flavor, finish } = product.sensoryProfile;
      culinaryHtml += `
        <div class="sensory-profile-box">
          <div class="sensory-profile-label">Sensory Character</div>
          <div class="sensory-profile-grid">
            ${aroma ? `<div class="sensory-item"><span class="sensory-item-key">Aroma:</span> <span class="sensory-item-val">${aroma}</span></div>` : ''}
            ${flavor ? `<div class="sensory-item"><span class="sensory-item-key">Flavor:</span> <span class="sensory-item-val">${flavor}</span></div>` : ''}
            ${finish ? `<div class="sensory-item"><span class="sensory-item-key">Finish:</span> <span class="sensory-item-val">${finish}</span></div>` : ''}
          </div>
        </div>
      `;
    }
    culinaryStripEl.innerHTML = culinaryHtml;
  }

  // 4c. Populate Rehydration or Preparation Guide
  const rehydrationSectionEl = document.getElementById('product-rehydration-section');
  if (rehydrationSectionEl) {
    let rehydrationHtml = '';
    if (Array.isArray(product.rehydrationSteps) && product.rehydrationSteps.length > 0) {
      rehydrationHtml += `
        <div class="rehydration-card">
          <div class="rehydration-card-header">
            <span class="rehydration-badge">Culinary Preparation</span>
            <h3 class="rehydration-card-title">How to Prepare & Rehydrate</h3>
          </div>
          <div class="rehydration-steps-grid">
            ${product.rehydrationSteps.map(s => `
              <div class="rehydration-step-item">
                <div class="rehydration-step-num">${s.step}</div>
                <div class="rehydration-step-body">
                  <div class="rehydration-step-title">${s.title}</div>
                  <p class="rehydration-step-desc">${s.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    if (product.culinaryTip) {
      rehydrationHtml += `
        <div class="culinary-tip-box">
          <div class="culinary-tip-header">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span class="culinary-tip-label">Kitchen Preparation Note</span>
          </div>
          <p class="culinary-tip-text">${product.culinaryTip}</p>
        </div>
      `;
    }
    rehydrationSectionEl.innerHTML = rehydrationHtml;
  }

  // Populate Schema.org Product JSON-LD
  const jsonLdEl = document.getElementById('product-jsonld');
  if (jsonLdEl) {
    const productSchema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": "https://kabodcrest.com/" + product.image,
      "description": product.description || product.shortDescription,
      "brand": {
        "@type": "Brand",
        "name": "Kabod Crest"
      },
      "category": product.category,
      "offers": {
        "@type": "Offer",
        "priceCurrency": "NGN",
        "price": product.price || 0,
        "availability": product.isLive ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
        "url": "https://kabodcrest.com/product-detail.html?id=" + encodeURIComponent(product.id)
      }
    };
    jsonLdEl.textContent = JSON.stringify(productSchema, null, 2);
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
    if (isLocked) {
      mainImageEl.style.opacity = '0.95';
    }
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
            mainImageEl.style.opacity = isLocked ? '0.95' : '1';
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

  if (isLocked && preorderBtn) {
    preorderBtn.disabled = true;
    preorderBtn.classList.add('btn-disabled');
    preorderBtn.innerHTML = '<span>Coming Soon</span>';
    if (qtyInput) qtyInput.disabled = true;
    if (qtyDecBtn) qtyDecBtn.disabled = true;
    if (qtyIncBtn) qtyIncBtn.disabled = true;
  } else if (preorderBtn) {
    if (product.price) {
      preorderBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Add to Bag</span>
      `;
    }
  }

  if (qtyDecBtn && qtyInput && !isLocked) {
    qtyDecBtn.addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        qtyInput.value = currentQty;
      }
    });
  }

  if (qtyIncBtn && qtyInput && !isLocked) {
    qtyIncBtn.addEventListener('click', () => {
      currentQty++;
      qtyInput.value = currentQty;
    });
  }

  if (qtyInput && !isLocked) {
    qtyInput.addEventListener('change', () => {
      let val = parseInt(qtyInput.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      currentQty = val;
      qtyInput.value = currentQty;
    });
  }

  if (preorderBtn && !isLocked) {
    preorderBtn.addEventListener('click', () => {
      if (window.KabodCart) {
        window.KabodCart.addItem(product, currentQty);
        showToast(`Added ${currentQty}× ${product.name} to your bag`);
      }
    });
  }

  // 6b. Mobile Sticky Purchase Dock (Fitts's Law / Thumb-Zone Ergonomics)
  const stickyDockEl = document.getElementById('mobile-sticky-dock');
  const stickyDockImgEl = document.getElementById('sticky-dock-img');
  const stickyDockTitleEl = document.getElementById('sticky-dock-title');
  const stickyDockPriceEl = document.getElementById('sticky-dock-price');
  const stickyDockBtnEl = document.getElementById('sticky-dock-btn');
  const actionsBoxEl = document.getElementById('product-actions-box');

  if (stickyDockEl) {
    if (stickyDockImgEl && product.image) {
      stickyDockImgEl.src = product.image;
      stickyDockImgEl.alt = product.name;
    }
    if (stickyDockTitleEl) {
      stickyDockTitleEl.textContent = product.name;
    }
    if (stickyDockPriceEl) {
      if (isLocked) {
        stickyDockPriceEl.textContent = 'Coming Soon';
      } else if (product.price) {
        const est = window.KabodCurrency ? window.KabodCurrency.formatEstimate(product.price) : '';
        stickyDockPriceEl.innerHTML = `<span>${product.priceDisplay}</span> <span class="sticky-estimate" style="font-size: 0.75rem; color: var(--color-gold); font-weight: 500;">${est}</span>`;
      } else {
        stickyDockPriceEl.textContent = product.priceDisplay || 'Price: [TBC]';
      }
    }

    if (stickyDockBtnEl) {
      if (isLocked) {
        stickyDockBtnEl.disabled = true;
        stickyDockBtnEl.classList.add('btn-disabled');
        stickyDockBtnEl.innerHTML = '<span>Coming Soon</span>';
      } else {
        stickyDockBtnEl.addEventListener('click', () => {
          if (window.KabodCart) {
            window.KabodCart.addItem(product, currentQty);
            showToast(`Added ${currentQty}× ${product.name} to your bag`);
          }
        });
      }
    }

    if (actionsBoxEl) {
      const handleScrollDock = () => {
        const rect = actionsBoxEl.getBoundingClientRect();
        if (rect.bottom < 60) {
          stickyDockEl.classList.add('is-active');
          stickyDockEl.setAttribute('aria-hidden', 'false');
        } else {
          stickyDockEl.classList.remove('is-active');
          stickyDockEl.setAttribute('aria-hidden', 'true');
        }
      };

      window.addEventListener('scroll', handleScrollDock, { passive: true });
      handleScrollDock();
    }
  }

  // 6c. Frequently Cooked Together Pantry Bundle (Option 3)
  const bundleContainer = document.getElementById('cooked-together-container');
  const bundle = (typeof window.getBundleForProduct === 'function') 
    ? window.getBundleForProduct(product.id) 
    : (typeof getBundleForProduct === 'function' ? getBundleForProduct(product.id) : null);

  if (bundleContainer && bundle && Array.isArray(bundle.products) && bundle.products.length > 0) {
    const liveItems = bundle.products.filter(p => p.isLive && p.price);
    const hasLiveItems = liveItems.length > 0;
    const bundleTotalPrice = liveItems.reduce((acc, p) => acc + (p.price || 0), 0);
    const formattedBundleTotal = `₦${bundleTotalPrice.toLocaleString('en-NG')}`;

    bundleContainer.innerHTML = `
      <header class="bundle-section-header">
        <span class="bundle-badge">Pantry Pairings</span>
        <h2 class="bundle-section-title" id="cooked-together-heading">Frequently Cooked Together</h2>
        <p class="bundle-section-subtitle">Authentic Nigerian agro-produce from our pantry that complete this traditional cooking pot.</p>
      </header>

      <div class="bundle-card">
        <div class="bundle-products-strip">
          ${bundle.products.map((bp, idx) => `
            <div class="bundle-product-item ${bp.id === product.id ? 'current-item' : ''}">
              <div class="bundle-item-thumb-box">
                <img src="${bp.image}" alt="${bp.name}" class="bundle-item-img" />
                ${bp.id === product.id ? '<span class="bundle-current-badge">This Item</span>' : ''}
              </div>
              <div class="bundle-item-info">
                <a href="product-detail.html?id=${encodeURIComponent(bp.id)}" class="bundle-item-title">${bp.name}</a>
                <div class="bundle-item-meta">${bp.category} • ${bp.weight}</div>
                <div class="bundle-item-price">
                  ${bp.isLive && bp.price ? bp.priceDisplay : '<span class="bundle-soon-tag">Coming Soon</span>'}
                </div>
              </div>
            </div>
            ${idx < bundle.products.length - 1 ? '<div class="bundle-plus-separator" aria-hidden="true">+</div>' : ''}
          `).join('')}
        </div>

        <div class="bundle-dock">
          <div class="bundle-dock-details">
            <span class="bundle-dock-tag">Traditional Heritage Pairing</span>
            <h3 class="bundle-dock-title">${bundle.title}</h3>
            <p class="bundle-dock-desc">${bundle.description}</p>
            <div class="bundle-dock-tip">
              <strong>Kitchen Secret:</strong> ${bundle.heritageTip}
            </div>
          </div>

          <div class="bundle-dock-action">
            <div class="bundle-dock-price-box">
              <span class="bundle-dock-label">Bundle Price:</span>
              <div class="bundle-dock-amount">${hasLiveItems ? formattedBundleTotal : 'Allocation Reserved'}</div>
              ${hasLiveItems ? `<span class="bundle-dock-count">${liveItems.length} pantry item${liveItems.length === 1 ? '' : 's'} ready for dispatch</span>` : '<span class="bundle-dock-count">Seasonal agro-allocation</span>'}
            </div>

            <button type="button" class="btn-bundle-buy ${!hasLiveItems ? 'btn-disabled' : ''}" id="btn-add-bundle-cart" ${!hasLiveItems ? 'disabled' : ''}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>Add Bundle to Bag</span>
            </button>
          </div>
        </div>
      </div>
    `;

    const addBundleBtn = document.getElementById('btn-add-bundle-cart');
    if (addBundleBtn && hasLiveItems) {
      addBundleBtn.addEventListener('click', () => {
        if (window.KabodCart) {
          liveItems.forEach(item => {
            window.KabodCart.addItem(item, 1);
          });
          showToast(`Added ${bundle.title} (${liveItems.length} items) to your bag`);
        }
      });
    }
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

    relatedGridEl.innerHTML = related.map(rel => {
      const isRelLocked = !rel.isLive || rel.isComingSoon;
      const relBadge = isRelLocked
        ? `<span class="product-status-tag locked">Coming Soon</span>`
        : `<span class="product-status-tag live">Ready to Order</span>`;

      const relBtn = isRelLocked
        ? `<button type="button" class="btn-preorder btn-disabled" disabled aria-disabled="true"><span class="preorder-btn-label">Coming Soon</span></button>`
        : `<button
            type="button"
            class="btn-preorder js-add-related-preorder"
            data-id="${rel.id}"
            aria-label="Add to Bag: ${rel.name}"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add to Bag</span>
          </button>`;

      return `
      <article class="product-card ${isRelLocked ? 'product-card-locked' : ''}" data-product-id="${rel.id}">
        <div class="product-card-badge-row">
          ${relBadge}
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
            <span class="${isRelLocked ? 'product-price-coming-soon' : 'product-price-val'}">${rel.priceDisplay}</span>
          </div>

          <div class="product-card-action">
            ${relBtn}
          </div>
        </div>
      </article>
      `;
    }).join('');

    relatedGridEl.querySelectorAll('.js-add-related-preorder').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        const item = products.find(p => p.id === id);
        if (item && window.KabodCart) {
          window.KabodCart.addItem(item, 1);
          showToast(`Added 1× ${item.name} to your bag`);
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
