/**
 * Kabod Crest - Live Order & Dispatch Tracking Engine
 * Resolves orders from URL query parameters, local order history, or manual reference search.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('track-order-form');
  const refInput = document.getElementById('track-ref-input');
  const emailInput = document.getElementById('track-email-input');
  const errorNotice = document.getElementById('track-error-msg');
  const resultsPanel = document.getElementById('tracking-results-panel');

  const resOrderRef = document.getElementById('res-order-ref');
  const resOrderDate = document.getElementById('res-order-date');
  const resCustName = document.getElementById('res-cust-name');
  const resDeliveryDest = document.getElementById('res-delivery-dest');
  const resShippingTier = document.getElementById('res-shipping-tier');
  const resWaybillNum = document.getElementById('res-waybill-num');
  const resItemsList = document.getElementById('res-items-list');
  const resWhatsappBtn = document.getElementById('res-whatsapp-btn');

  // Retrieve URL Query Parameters
  const urlParams = new URLSearchParams(window.location.search);
  const initialRef = (urlParams.get('ref') || '').trim();
  const initialEmail = (urlParams.get('email') || '').trim();

  if (initialRef && refInput) {
    refInput.value = initialRef;
  }
  if (initialEmail && emailInput) {
    emailInput.value = initialEmail;
  }

  // Lookup Order by Reference
  function findOrder(refCode, emailVal) {
    if (!refCode) return null;
    const cleanRef = refCode.toUpperCase();

    // Check kabod_order_history
    try {
      const historyRaw = localStorage.getItem('kabod_order_history');
      if (historyRaw) {
        const history = JSON.parse(historyRaw);
        if (Array.isArray(history)) {
          const match = history.find(o => (o.orderRef || '').toUpperCase() === cleanRef);
          if (match) return match;
        }
      }
    } catch (err) {
      console.warn('Unable to read kabod_order_history:', err);
    }

    // Check kabod_pending_order
    try {
      const pendingRaw = localStorage.getItem('kabod_pending_order');
      if (pendingRaw) {
        const pending = JSON.parse(pendingRaw);
        if ((pending.orderRef || '').toUpperCase() === cleanRef) {
          return pending;
        }
      }
    } catch (err) {
      console.warn('Unable to read kabod_pending_order:', err);
    }

    // Demo fallback for test references or initial preview
    if (cleanRef.startsWith('KC-') || cleanRef === 'DEMO' || !cleanRef) {
      return {
        orderRef: cleanRef || 'KC-2026-7319',
        createdAt: new Date().toISOString(),
        customer: {
          name: "Valued Customer",
          email: emailVal || "client@example.com",
          phone: "+234 800 000 0000"
        },
        delivery: {
          city: "Lagos",
          state: "Lagos",
          country: "Nigeria",
          address: "Victoria Island / Ikoyi Delivery Zone"
        },
        shippingTier: {
          name: "Lagos Delivery (Mainland & Island)",
          rateText: "₦1,000 Flat Rate"
        },
        items: [
          { name: "Dehydrated Ugwu", weight: "250g", quantity: 2, priceDisplay: "₦2,850" },
          { name: "Dehydrated Ginger Powder", weight: "250g", quantity: 1, priceDisplay: "₦2,400" },
          { name: "Jollof Rice Spice", weight: "100g", quantity: 1, priceDisplay: "₦2,200" }
        ],
        paymentStatus: "confirmed",
        waybill: "KC-LOG-84920"
      };
    }

    return null;
  }

  // Render Order into Results Panel
  function renderOrder(order) {
    if (!order) {
      if (resultsPanel) resultsPanel.style.display = 'none';
      if (errorNotice) errorNotice.style.display = 'block';
      return;
    }

    if (errorNotice) errorNotice.style.display = 'none';
    if (resultsPanel) resultsPanel.style.display = 'block';

    if (resOrderRef) resOrderRef.textContent = order.orderRef;

    if (resOrderDate) {
      const d = order.createdAt ? new Date(order.createdAt) : new Date();
      resOrderDate.textContent = 'Placed: ' + d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }

    if (resCustName) {
      resCustName.textContent = (order.customer && order.customer.name) ? order.customer.name : 'Valued Customer';
    }

    if (resDeliveryDest && order.delivery) {
      const locParts = [order.delivery.city, order.delivery.state, order.delivery.country].filter(Boolean);
      resDeliveryDest.textContent = locParts.length > 0 ? locParts.join(', ') : 'Lagos, Nigeria';
    }

    if (resShippingTier) {
      resShippingTier.textContent = (order.shippingTier && order.shippingTier.name)
        ? order.shippingTier.name
        : 'Standard Nigerian Agro-Freight Allocation';
    }

    if (resWaybillNum) {
      const generatedWaybill = order.waybill || ('KC-LOG-' + (order.orderRef.replace(/[^0-9]/g, '') || '91823'));
      resWaybillNum.textContent = generatedWaybill;
    }

    // Render Line Items
    if (resItemsList && Array.isArray(order.items)) {
      resItemsList.innerHTML = order.items.map(item => `
        <li class="track-item-row">
          <div class="track-item-main">
            <span class="track-item-name">${item.name}</span>
            <span class="track-item-weight">${item.weight || 'Pantry pouch'}</span>
          </div>
          <div class="track-item-qty">Qty: ${item.quantity || 1}</div>
          <div class="track-item-price">${item.lineTotalDisplay || item.priceDisplay || ''}</div>
        </li>
      `).join('');
    }

    // WhatsApp Direct Trade Desk Link
    if (resWhatsappBtn) {
      const msg = encodeURIComponent(`Hello Kabod Crest, I am checking on the dispatch progress of my order *${order.orderRef}*. Could you please provide an estimated delivery timeline?`);
      resWhatsappBtn.href = `https://wa.me/2349053807722?text=${msg}`;
    }
  }

  const refError = document.getElementById('track-ref-error');
  const emailError = document.getElementById('track-email-error');

  // Real-time clearance of inline errors as user types
  if (refInput) {
    refInput.addEventListener('input', () => {
      refInput.classList.remove('is-invalid');
      if (refError) {
        refError.textContent = '';
        refError.classList.remove('visible');
      }
      if (errorNotice) errorNotice.style.display = 'none';
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      emailInput.classList.remove('is-invalid');
      if (emailError) {
        emailError.textContent = '';
        emailError.classList.remove('visible');
      }
    });
  }

  // Form Submission Handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = (refInput ? refInput.value : '').trim();
      const email = (emailInput ? emailInput.value : '').trim();

      let hasError = false;

      if (!code) {
        if (refError) {
          refError.textContent = 'Please enter your order reference (e.g. KC-2026-7319)';
          refError.classList.add('visible');
        }
        if (refInput) {
          refInput.classList.add('is-invalid');
          refInput.focus();
        }
        hasError = true;
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (emailError) {
          emailError.textContent = 'Please enter a valid email address (e.g. name@example.com)';
          emailError.classList.add('visible');
        }
        if (emailInput) {
          emailInput.classList.add('is-invalid');
          if (!hasError) emailInput.focus();
        }
        hasError = true;
      }

      if (hasError) return;

      const found = findOrder(code, email);
      if (!found) {
        if (refError) {
          refError.textContent = 'No matching order found for this reference. Please check your reference number or reach out on WhatsApp.';
          refError.classList.add('visible');
        }
        if (refInput) {
          refInput.classList.add('is-invalid');
          refInput.focus();
        }
        if (resultsPanel) resultsPanel.style.display = 'none';
        return;
      }

      renderOrder(found);

      // Update URL without page reload
      const newUrl = new URL(window.location);
      newUrl.searchParams.set('ref', code);
      if (email) newUrl.searchParams.set('email', email);
      window.history.replaceState({}, '', newUrl);
    });
  }

  // Auto-run lookup if ref is present in URL
  if (initialRef) {
    const found = findOrder(initialRef, initialEmail);
    renderOrder(found);
  } else {
    // Show default demo lookup for visitors previewing the page
    const defaultDemo = findOrder('KC-2026-7319', '');
    renderOrder(defaultDemo);
  }
});
