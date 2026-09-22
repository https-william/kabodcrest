# Original User Request

## 2026-09-21T03:02:31Z

Implement all P0 Launch Blockers for the Kabod Crest e-commerce web platform to make cart, delivery freight calculation, payment dispatch, input validation, and order receipt persistence fully functional.

Working directory: c:\Users\cutef\Downloads\My Projects\Kabod Crest
Integrity mode: development

## Requirements

### R1. Dynamic Cart & Checkout Pricing Engine
Connect the cart and checkout summary calculators to live product pricing data. When priced items (e.g. Dehydrated Ugwu at ₦2,850, Ginger at ₦2,400, Jollof Spice at ₦2,200) are added to the bag, calculate real numerical subtotals (price * quantity), format currency accurately with Nigerian Naira symbols (and secondary estimates), display line-item totals, and reflect itemized totals in cart.html and checkout.html. If the cart contains pre-order / TBC items, indicate + [TBC items] without breaking numeric calculation.

### R2. Courier Freight Rate Integration
Implement active freight calculations in js/shipping-config.js and js/checkout.js. Provide flat delivery pricing for Lagos (₦2,500), Rest of Nigeria (₦4,500), and International Air Cargo ([TBC Quote]), auto-updating the payable grand total when a customer selects their delivery state or shipping tier.

### R3. Dual-Mode Payment Bridge (Paystack + Manual Invoice)
Equip js/checkout.js with a live dual-mode payment selector:
1. Paystack Inline Gateway: Integrated via Paystack Inline Popup JS for immediate card, bank transfer, and USSD payments on live stock.
2. Manual Corporate Bank Transfer: For pre-orders and B2B bulk allocations, generating an official invoice and designated bank settlement details.

### R4. Form Input Validation & Sanitization
Add robust client-side validation on checkout.html for customer contact and delivery forms:
- Validate Nigerian phone numbers (+234 or 11-digit local format 080...) and standard E.164 international formats.
- Validate email syntax.
- Ensure shipping address, city, and state are non-empty before proceeding to payment.
- Provide clear, accessible error states on invalid fields.

### R5. Durable Order History & Receipt Persistence
Enhance order persistence so completed orders are saved to kabod_order_history in localStorage in addition to kabod_pending_order. Ensure order-confirmation.html can retrieve and render any historical or active order by ?ref=KC-2026-XXXX without losing state on page refresh.

## Acceptance Criteria

### Pricing & Calculations
- Adding 2 units of Dehydrated Ugwu (₦2,850) renders a subtotal of exactly ₦5,700 in both the cart drawer and cart.html.
- Cart summary displays the correct item count, subtotal, and dynamically updates upon quantity modification (+/-).
- Mixed carts (live item + pre-order item) clearly display the live total while cleanly tagging pre-order items.

### Shipping Freight
- Selecting "Lagos" automatically selects the Lagos shipping tier and adds ₦2,500 to the checkout grand total.
- Selecting another Nigerian state (e.g., Abuja, Rivers, Oyo) automatically selects "Rest of Nigeria" and adds ₦4,500.
- Selecting an international country (e.g., United Kingdom, United States) selects International Freight and shows shipping as "[TBC prior to dispatch]".

### Payment & Checkout
- The customer can toggle between Paystack Online Payment and Manual Bank Transfer on checkout.html.
- Submitting the checkout form with valid data generates a unique order reference (KC-2026-XXXX), saves the record to localStorage, and redirects to order-confirmation.html?ref=...
- Submitting with invalid email or phone triggers visual validation errors and blocks form submission.

### Order Confirmation
- Reloading order-confirmation.html?ref=... accurately displays the stored order details, customer name, delivery address, shipping tier, itemized list, and grand total.
