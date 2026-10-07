/**
 * Kabod Crest - Order Confirmation & Receipt Generator
 * Renders confirmed pre-order receipt, manual payment instructions, and handles downloadable PDF/print generation.
 */

document.addEventListener('DOMContentLoaded', () => {
  const refEl = document.getElementById('conf-order-ref');
  const dateEl = document.getElementById('conf-order-date');
  const custNameEl = document.getElementById('conf-cust-name');
  const custEmailEl = document.getElementById('conf-cust-email');
  const custPhoneEl = document.getElementById('conf-cust-phone');
  const deliveryDestEl = document.getElementById('conf-delivery-dest');
  const itemsContainer = document.getElementById('conf-items-list');
  const totalCountEl = document.getElementById('conf-total-count');
  const subtotalEl = document.getElementById('conf-subtotal');
  const shippingEl = document.getElementById('conf-shipping-rate');
  const grandTotalEl = document.getElementById('conf-grandtotal');
  const paymentStatusEl = document.getElementById('conf-payment-status');
  const whatsappBtn = document.getElementById('btn-whatsapp-confirm');
  const printBtn = document.getElementById('btn-print-receipt');

  // 1. Retrieve order data from URL param and localStorage
  const urlParams = (typeof window !== 'undefined' && window.location)
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();
  const searchRef = (urlParams.get('ref') || '').trim();

  let order = null;

  // Try retrieving from kabod_order_history first if searchRef is provided
  if (searchRef) {
    try {
      const historyRaw = localStorage.getItem('kabod_order_history');
      if (historyRaw) {
        const history = JSON.parse(historyRaw);
        if (Array.isArray(history)) {
          order = history.find(o => (o.orderRef || '').toUpperCase() === searchRef.toUpperCase());
        }
      }
    } catch (err) {
      console.warn('Unable to read order history:', err);
    }
  }

  // Next try pending order if not found in history
  if (!order) {
    try {
      const raw = localStorage.getItem('kabod_pending_order');
      if (raw) {
        const pending = JSON.parse(raw);
        if (!searchRef || (pending.orderRef || '').toUpperCase() === searchRef.toUpperCase()) {
          order = pending;
        }
      }
    } catch (err) {
      console.warn('Unable to read pending order:', err);
    }
  }

  // Fallback demo order if visited directly without matching order in storage
  if (!order) {
    const fallbackRef = searchRef || 'KC-2026-7319';
    order = {
      orderRef: fallbackRef,
      createdAt: new Date().toISOString(),
      customer: {
        name: "Valued Client",
        email: "client@example.com",
        phone: "+234 800 000 0000"
      },
      delivery: {
        address: "Commercial Delivery Address",
        city: "Lagos",
        state: "Lagos",
        country: "Nigeria",
        postalCode: ""
      },
      shippingTier: {
        id: "lagos",
        name: "Lagos Delivery (Mainland & Island)",
        rateAmount: 2500,
        rateText: "₦2,500"
      },
      items: [
        { name: "Dehydrated Ugwu", weight: "250g", quantity: 2, price: 2850, priceDisplay: "₦2,850", lineTotalDisplay: "₦5,700" },
        { name: "Kulikuli Batch", weight: "1.5kg", quantity: 1, price: null, priceDisplay: "Price: [TBC]", lineTotalDisplay: "Price: [TBC]" }
      ],
      totalCount: 3,
      subtotal: 5700,
      shippingFee: 2500,
      grandTotal: 8200,
      formattedSubtotal: "₦5,700",
      formattedShipping: "₦2,500",
      formattedGrandTotal: "₦8,200",
      paymentMethod: "manual_bank_transfer",
      paymentStatus: "pending_invoice"
    };
  }

  // 2. Populate Order Header & Reference
  if (refEl) refEl.textContent = order.orderRef;
  if (dateEl) {
    const d = new Date(order.createdAt);
    dateEl.textContent = d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // 3. Populate Customer & Delivery Info
  if (custNameEl) custNameEl.textContent = order.customer.name;
  if (custEmailEl) custEmailEl.textContent = order.customer.email;
  if (custPhoneEl) custPhoneEl.textContent = order.customer.phone;

  if (deliveryDestEl) {
    const parts = [
      order.delivery.address,
      order.delivery.city,
      order.delivery.state,
      order.delivery.country,
      order.delivery.postalCode
    ].filter(Boolean);
    deliveryDestEl.textContent = parts.join(', ');
  }

  const shippingNameEl = document.getElementById('conf-shipping-name');
  const shippingMetaEl = document.getElementById('conf-shipping-meta');

  if (totalCountEl) {
    totalCountEl.textContent = `${order.totalCount} item${order.totalCount === 1 ? '' : 's'} in pre-order allocation`;
  }

  // Populate Shipping Tier Info
  if (shippingNameEl) {
    if (order.shippingTier && order.shippingTier.name) {
      shippingNameEl.textContent = order.shippingTier.name;
    } else {
      shippingNameEl.textContent = "Standard Agro-Freight Allocation";
    }
  }
  if (shippingMetaEl) {
    if (order.shippingTier) {
      shippingMetaEl.textContent = order.shippingTier.rateText || 'Rate confirmed prior to dispatch';
    } else {
      shippingMetaEl.textContent = 'Rate confirmed prior to dispatch';
    }
  }

  // 4. Populate Financial Summary Totals
  if (subtotalEl) {
    subtotalEl.textContent = order.formattedSubtotal || (order.subtotal ? `₦${order.subtotal.toLocaleString('en-NG')}` : '₦0');
  }
  if (shippingEl) {
    shippingEl.textContent = order.formattedShipping || (order.shippingFee ? `₦${order.shippingFee.toLocaleString('en-NG')}` : (order.shippingTier ? order.shippingTier.rateText : '₦0'));
  }
  if (grandTotalEl) {
    grandTotalEl.textContent = order.formattedGrandTotal || (order.grandTotal ? `₦${order.grandTotal.toLocaleString('en-NG')}` : '₦0');
  }
  if (paymentStatusEl) {
    paymentStatusEl.textContent = (order.paymentStatus === 'paid')
      ? 'Paid via Paystack Gateway'
      : 'Official Invoice Allocation Reserved';
  }

  // Populate Payment Details Box
  const paymentBox = document.getElementById('conf-payment-box');
  if (paymentBox) {
    if (order.paymentMethod === 'paystack' && order.paymentStatus === 'paid') {
      paymentBox.innerHTML = `
        <div class="payment-method-header">
          <span style="font-family: var(--font-structural); font-weight: 700; color: #1E6B43;">Verified Paystack Online Settlement</span>
          <span class="payment-badge" style="background: rgba(30, 107, 67, 0.15); color: #1E6B43;">Payment Confirmed</span>
        </div>
        <p style="font-size: 0.8125rem; color: var(--color-text-muted); line-height: 1.5;">
          Transaction verified and settled via Paystack. Your allocation is confirmed for prioritized packaging and delivery.
        </p>
        <div class="bank-details-placeholder-box" style="border-left: 3px solid #1E6B43;">
          <div class="bank-detail-row">
            <span class="bank-detail-label">Payment Channel:</span>
            <span class="bank-detail-val">Paystack Secure Checkout</span>
          </div>
          <div class="bank-detail-row">
            <span class="bank-detail-label">Transaction Reference:</span>
            <span class="bank-detail-val" style="color: var(--color-plum); font-weight: 700;">${(order.paymentDetails && order.paymentDetails.reference) ? order.paymentDetails.reference : order.orderRef}</span>
          </div>
          <div class="bank-detail-row">
            <span class="bank-detail-label">Amount Paid:</span>
            <span class="bank-detail-val">${order.formattedGrandTotal || (order.grandTotal ? '₦' + order.grandTotal.toLocaleString('en-NG') : '₦0')}</span>
          </div>
        </div>
      `;
    } else {
      paymentBox.innerHTML = `
        <div class="payment-method-header">
          <span style="font-family: var(--font-structural); font-weight: 700; color: var(--color-obsidian);">Manual Bank Remittance Details</span>
          <span class="payment-badge">Official Treasury Instructions</span>
        </div>
        <p style="font-size: 0.8125rem; color: var(--color-text-muted); line-height: 1.5;">
          Please quote your Order Reference on all remittance communication. Official commercial invoice with verified bank coordinates will be transmitted to your email prior to order dispatch.
        </p>
        <div class="bank-details-placeholder-box">
          <div class="bank-detail-row">
            <span class="bank-detail-label">Beneficiary Account Name:</span>
            <span class="bank-detail-val">Kabod Crest Limited</span>
          </div>
          <div class="bank-detail-row">
            <span class="bank-detail-label">Bank Institution:</span>
            <span class="bank-detail-val">Zenith Bank PLC</span>
          </div>
          <div class="bank-detail-row">
            <span class="bank-detail-label">Corporate Account Number:</span>
            <span class="bank-detail-val">1018293847</span>
          </div>
          <div class="bank-detail-row">
            <span class="bank-detail-label">Required Payment Reference:</span>
            <span class="bank-detail-val" style="color: var(--color-plum); font-weight: 700;">${order.orderRef}</span>
          </div>
        </div>
      `;
    }
  }

  // 5. Populate Line Items Table
  if (itemsContainer) {
    itemsContainer.innerHTML = order.items.map(item => `
      <tr style="border-bottom: 1px solid var(--color-stone-muted);">
        <td style="padding: 12px 8px; font-family: var(--font-structural); font-weight: 600;">
          ${item.name}
          <div style="font-size: 0.75rem; color: var(--color-text-muted); font-family: var(--font-body); font-weight: 400;">${item.weight || ''}</div>
        </td>
        <td style="padding: 12px 8px; text-align: center; font-family: var(--font-structural); font-weight: 600;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 8px; text-align: right; font-family: var(--font-structural); font-weight: 600; color: var(--color-plum);">
          ${item.lineTotalDisplay || item.priceDisplay}
        </td>
      </tr>
    `).join('');
  }

  // 6. WhatsApp Trade Desk Link
  if (whatsappBtn) {
    const itemListText = order.items.map(i => `• ${i.name} (${i.weight || ''}) x${i.quantity}`).join('%0A');
    const tierLine = (order.shippingTier && order.shippingTier.name) ? `%0AShipping Tier: ${order.shippingTier.name}` : '';
    const msg = `Hello Kabod Crest, I have placed Pre-Order *${order.orderRef}*:%0A${itemListText}%0ADelivery to: ${order.delivery.city}, ${order.delivery.country}${tierLine}. Total: ${order.formattedGrandTotal || order.formattedSubtotal}. Please advise when commercial invoice is ready.`;
    whatsappBtn.href = `https://wa.me/2349053807722?text=${msg}`;
  }

  // 7. Founder Welcome Note & Keepsake Population
  const letterNameEl = document.getElementById('conf-letter-name');
  if (letterNameEl) letterNameEl.textContent = order.customer.name || 'Valued Customer';

  const keepsakeNameEl = document.getElementById('conf-keepsake-name');
  if (keepsakeNameEl) keepsakeNameEl.textContent = order.customer.name || 'Valued Customer';

  const keepsakeRefEl = document.getElementById('conf-keepsake-ref');
  if (keepsakeRefEl) keepsakeRefEl.textContent = order.orderRef;

  const trackOrderLinkEl = document.getElementById('conf-track-order-link');
  if (trackOrderLinkEl) {
    trackOrderLinkEl.href = `track-order.html?ref=${encodeURIComponent(order.orderRef)}`;
  }

  const trackingEmailEl = document.getElementById('conf-tracking-email');
  if (trackingEmailEl && order.customer && order.customer.email) {
    trackingEmailEl.textContent = order.customer.email;
  }

  // Populate Dynamic Culinary Secrets for Customer's Items
  const keepsakeGuidanceEl = document.getElementById('conf-keepsake-guidance');
  if (keepsakeGuidanceEl && Array.isArray(order.items)) {
    const guidanceCards = order.items.map(item => {
      const itemName = (item.name || '').toLowerCase();
      let prepTitle = 'Pantry Storage & Use';
      let prepTip = 'Keep sealed in its moisture-proof barrier pouch away from humidity. Reseal zip firmly after each use.';
      let pairNote = 'Authentic Nigerian home cooking';

      if (itemName.includes('ugwu') || itemName.includes('pumpkin')) {
        prepTitle = 'Dehydrated Ugwu Leaves (Fluted Pumpkin)';
        prepTip = 'Submerge in warm (not boiling) water for 5 to 7 minutes until tender leaves fully expand. Squeeze lightly or pour leaves along with the mineral-rich soaking water directly into your soup pot during the final 3 minutes.';
        pairNote = 'Essential for Edikang Ikong, Egusi Soup, and Yam Pottage.';
      } else if (itemName.includes('bitterleaf') || itemName.includes('onugbu')) {
        prepTitle = 'Dehydrated Bitterleaf (Onugbu)';
        prepTip = 'Already gently washed before warm-air drying. Soak in warm water for 6 to 8 minutes. Gives a clean, authentic bitter note without mud or grit.';
        pairNote = 'Ideal for traditional Ofe Onugbu and bitterleaf pepper soup.';
      } else if (itemName.includes('utazi')) {
        prepTitle = 'Dehydrated Utazi Leaves';
        prepTip = 'Brief 3-minute warm-water dip. Adds that distinctive peppery-bitter aroma that lifts meat and broth dishes.';
        pairNote = 'Perfect garnish for Nkwobi, Isi Ewu, and Ofe Nsala.';
      } else if (itemName.includes('ukazi') || itemName.includes('afang')) {
        prepTitle = 'Dehydrated Ukazi / Afang Leaves';
        prepTip = 'Firm-textured wild forest leaves. Soak for 8 to 10 minutes in hot water, or pound lightly in a mortar after soaking before folding into your pot.';
        pairNote = 'Indispensable for authentic Afang soup and Ofe Okazi.';
      } else if (itemName.includes('uziza')) {
        prepTitle = 'Stone-Ground Uziza Seed';
        prepTip = 'Rich in piperine and natural aromatic oils. Bloom lightly in warm broth or oil in the final 5 minutes of simmering to release full warmth.';
        pairNote = 'Brings unforgettable peppery depth to seafood stews and pepper soup.';
      } else if (itemName.includes('ginger')) {
        prepTitle = 'Dehydrated Ginger Powder';
        prepTip = 'Northern Kaduna high-pungency ginger. Single-origin and unadulterated. Half a teaspoon delivers the heat and aroma of 2 fresh thumbs.';
        pairNote = 'Essential for marinades, pepper soup, and ginger tea.';
      } else if (itemName.includes('jollof')) {
        prepTitle = 'Kabod Heritage Jollof Rice Spice';
        prepTip = 'Stone-ground blend of nutmeg, thyme, ginger, and aromatic peppers. Bloom in hot palm oil or vegetable oil with onions before adding tomato paste.';
        pairNote = 'Guarantees that classic smoky, festive Nigerian party jollof aroma.';
      } else if (itemName.includes('ogbono')) {
        prepTitle = 'Ogbono Dika Nut Kernels';
        prepTip = 'Pure whole kernels with maximum viscosity. When milling, blend off-heat with lukewarm oil or stock before cooking to prevent curdling and achieve maximum draw.';
        pairNote = 'Creates smooth, glossy draw soup with rich earthy flavor.';
      } else if (itemName.includes('egusi') || itemName.includes('melon')) {
        prepTitle = 'Melon Seed (Egusi)';
        prepTip = 'Hand-shelled white melon seeds. Form into small lumps with warm onion paste before dropping into boiling broth for that coveted fluffy curd texture.';
        pairNote = 'The bedrock of Nigerian festive dining.';
      } else if (itemName.includes('kulikuli')) {
        prepTitle = 'Handmade Kulikuli Produce';
        prepTip = 'Traditional groundnut crunch. Ready to enjoy straight from the pouch, or crumble over roasted plantains and garri.';
        pairNote = 'Traditional savory protein snack.';
      }

      return `
        <div class="keepsake-item-pill">
          <div class="keepsake-item-badge">${item.name} (${item.weight || ''})</div>
          <h3 class="keepsake-item-name">${prepTitle}</h3>
          <p class="keepsake-item-text">${prepTip}</p>
          <div class="keepsake-item-pair"><strong>Dish Pairing:</strong> ${pairNote}</div>
        </div>
      `;
    }).join('');

    keepsakeGuidanceEl.innerHTML = guidanceCards;
  }

  // 8. Tab View Navigation (Receipt vs Physical Keepsake Card)
  const tabReceiptBtn = document.getElementById('tab-btn-receipt');
  const tabKeepsakeBtn = document.getElementById('tab-btn-keepsake');
  const receiptCard = document.getElementById('printable-receipt-card');
  const keepsakeCard = document.getElementById('unboxing-keepsake-card');
  const switchKeepsakeBtn = document.getElementById('btn-switch-keepsake');
  const switchReceiptBottomBtn = document.getElementById('btn-switch-receipt-bottom');

  function showReceiptView() {
    if (receiptCard) receiptCard.style.display = 'block';
    if (keepsakeCard) keepsakeCard.style.display = 'none';
    if (tabReceiptBtn) {
      tabReceiptBtn.classList.add('active');
      tabReceiptBtn.setAttribute('aria-selected', 'true');
    }
    if (tabKeepsakeBtn) {
      tabKeepsakeBtn.classList.remove('active');
      tabKeepsakeBtn.setAttribute('aria-selected', 'false');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showKeepsakeView() {
    if (receiptCard) receiptCard.style.display = 'none';
    if (keepsakeCard) keepsakeCard.style.display = 'block';
    if (tabReceiptBtn) {
      tabReceiptBtn.classList.remove('active');
      tabReceiptBtn.setAttribute('aria-selected', 'false');
    }
    if (tabKeepsakeBtn) {
      tabKeepsakeBtn.classList.add('active');
      tabKeepsakeBtn.setAttribute('aria-selected', 'true');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (tabReceiptBtn) tabReceiptBtn.addEventListener('click', showReceiptView);
  if (tabKeepsakeBtn) tabKeepsakeBtn.addEventListener('click', showKeepsakeView);
  if (switchKeepsakeBtn) switchKeepsakeBtn.addEventListener('click', showKeepsakeView);
  if (switchReceiptBottomBtn) switchReceiptBottomBtn.addEventListener('click', showReceiptView);

  // 9. Download / Print Handlers
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      document.body.classList.remove('print-mode-keepsake');
      window.print();
    });
  }

  const printKeepsakeBtn = document.getElementById('btn-print-keepsake');
  if (printKeepsakeBtn) {
    printKeepsakeBtn.addEventListener('click', () => {
      document.body.classList.add('print-mode-keepsake');
      window.print();
      setTimeout(() => {
        document.body.classList.remove('print-mode-keepsake');
      }, 1000);
    });
  }
});
