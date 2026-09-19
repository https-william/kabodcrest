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
  const whatsappBtn = document.getElementById('btn-whatsapp-confirm');
  const printBtn = document.getElementById('btn-print-receipt');

  // 1. Retrieve order data from localStorage
  let order = null;
  try {
    const raw = localStorage.getItem('kabod_pending_order');
    if (raw) order = JSON.parse(raw);
  } catch (err) {
    console.warn('Unable to read pending order', err);
  }

  // Fallback demo order if visited directly without pending order in storage
  if (!order) {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref') || 'KC-2026-7319';
    order = {
      orderRef: ref,
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
      items: [
        { name: "Dehydrated Ugwu", weight: "500g", quantity: 2, priceDisplay: "Price: [TBC]" },
        { name: "Kulikuli", weight: "1.5kg", quantity: 1, priceDisplay: "Price: [TBC]" }
      ],
      totalCount: 3,
      priceStatus: "Price: [TBC - Official invoice confirmed prior to dispatch]"
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
    totalCountEl.textContent = `${order.totalCount} items in pre-order allocation`;
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
      const parts = [];
      if (order.shippingTier.estimatedDays) parts.push(order.shippingTier.estimatedDays);
      if (order.shippingTier.rateDisplay) parts.push(order.shippingTier.rateDisplay);
      shippingMetaEl.textContent = parts.join(' • ') || 'Rate confirmed prior to dispatch';
    } else {
      shippingMetaEl.textContent = 'Rate confirmed prior to dispatch';
    }
  }

  // 4. Populate Line Items Table
  if (itemsContainer) {
    itemsContainer.innerHTML = order.items.map(item => `
      <tr style="border-bottom: 1px solid var(--color-stone-muted);">
        <td style="padding: 12px 8px; font-family: var(--font-structural); font-weight: 600;">
          ${item.name}
          <div style="font-size: 0.75rem; color: var(--color-text-muted); font-family: var(--font-body); font-weight: 400;">${item.weight}</div>
        </td>
        <td style="padding: 12px 8px; text-align: center; font-family: var(--font-structural); font-weight: 600;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 8px; text-align: right; font-family: var(--font-structural); font-weight: 600; color: var(--color-plum);">
          ${item.priceDisplay}
        </td>
      </tr>
    `).join('');
  }

  // 5. WhatsApp Trade Desk Link
  if (whatsappBtn) {
    const itemListText = order.items.map(i => `• ${i.name} (${i.weight}) x${i.quantity}`).join('%0A');
    const tierLine = (order.shippingTier && order.shippingTier.name) ? `%0AShipping Tier: ${order.shippingTier.name}` : '';
    const msg = `Hello Kabod Crest, I have placed Pre-Order *${order.orderRef}*:%0A${itemListText}%0ADelivery to: ${order.delivery.city}, ${order.delivery.country}${tierLine}. Please advise when commercial rates and invoice are ready.`;
    whatsappBtn.href = `https://wa.me/2349053807722?text=${msg}`;
  }

  // 6. Download / Print Receipt Handler
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
});
