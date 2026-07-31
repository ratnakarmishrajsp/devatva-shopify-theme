/**
 * DEVATVA.IN - CORE APPLICATION & INTERACTIVE MODULES
 * Handles Quick View, Side-by-Side Compare Drawer, and Ajax Cart Hooks
 */

(function () {
  'use strict';

  window.Devatva = window.Devatva || {};

  // --- Toast Notification System ---
  window.Devatva.showToast = function (message) {
    let container = document.querySelector('.devatva-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'devatva-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'devatva-toast';
    toast.innerHTML = `✨ ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  };

  // --- Quick View Modal Controller ---
  window.Devatva.openQuickView = async function (handle) {
    const modalBackdrop = document.getElementById('devatva-quick-view-modal');
    const container = document.getElementById('devatva-quick-view-content');

    if (!modalBackdrop || !container) return;

    modalBackdrop.classList.add('is-active');
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--dev-gold-light);">
        <div style="font-size: 2rem; margin-bottom: 12px;">🕉️</div>
        <div>Loading Divine Product Details...</div>
      </div>
    `;

    try {
      const response = await fetch(`/products/${handle}.js`);
      if (!response.ok) throw new Error('Product not found');
      const product = await response.json();

      const formatMoney = (cents) => `₹${(cents / 100).toLocaleString('en-IN')}`;

      container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
          <div>
            <img src="${product.featured_image}" alt="${product.title}" style="width: 100%; border-radius: 12px; border: 1px solid var(--dev-gold-border);" />
          </div>
          <div>
            <div class="devatva-badge" style="margin-bottom: 8px;">100% Authentic & Energized</div>
            <h2 class="devatva-heading" style="font-size: 1.5rem; margin-bottom: 12px;">${product.title}</h2>
            <div class="devatva-card-price" style="font-size: 1.4rem; margin-bottom: 16px;">
              ${formatMoney(product.price)}
              ${product.compare_at_price > product.price ? `<span class="devatva-compare-price">${formatMoney(product.compare_at_price)}</span>` : ''}
            </div>
            
            <div style="font-size: 0.9rem; line-height: 1.6; color: var(--dev-text-muted); margin-bottom: 20px;">
              ${product.description.replace(/<[^>]*>?/gm, '').slice(0, 180)}...
            </div>

            ${
              product.variants.length > 1
                ? `
              <div style="margin-bottom: 16px;">
                <label style="display:block; font-size: 0.85rem; color: var(--dev-gold-light); margin-bottom: 6px;">Select Option:</label>
                <select id="devatva-qv-variant-select" style="width: 100%; padding: 10px; background: #000; color: #fff; border: 1px solid var(--dev-gold-border); border-radius: 8px;">
                  ${product.variants.map((v) => `<option value="${v.id}">${v.title} - ${formatMoney(v.price)}</option>`).join('')}
                </select>
              </div>
            `
                : `<input type="hidden" id="devatva-qv-variant-select" value="${product.variants[0].id}" />`
            }

            <div style="display: flex; gap: 12px;">
              <button onclick="Devatva.addQVToCart()" class="devatva-gold-btn" style="flex: 1;">
                🛍️ Add to Divine Cart
              </button>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">Unable to load product preview.</div>`;
    }
  };

  window.Devatva.closeQuickView = function () {
    const modalBackdrop = document.getElementById('devatva-quick-view-modal');
    if (modalBackdrop) modalBackdrop.classList.remove('is-active');
  };

  window.Devatva.addQVToCart = async function () {
    const select = document.getElementById('devatva-qv-variant-select');
    if (!select) return;
    const variantId = select.value;

    await Devatva.addToCart(variantId, 1);
    Devatva.closeQuickView();
  };

  // --- Compare Drawer Module ---
  const COMPARE_KEY = 'devatva_compare_items';

  window.Devatva.getCompareItems = function () {
    try {
      return JSON.parse(localStorage.getItem(COMPARE_KEY)) || [];
    } catch {
      return [];
    }
  };

  window.Devatva.toggleCompare = function (product) {
    let items = Devatva.getCompareItems();
    const index = items.findIndex((i) => i.handle === product.handle);

    if (index >= 0) {
      items.splice(index, 1);
      Devatva.showToast(`Removed "${product.title}" from Comparison`);
    } else {
      if (items.length >= 3) {
        Devatva.showToast('You can compare a maximum of 3 sacred items at once.');
        return;
      }
      items.push(product);
      Devatva.showToast(`Added "${product.title}" to Comparison`);
    }

    localStorage.setItem(COMPARE_KEY, JSON.stringify(items));
    Devatva.renderCompareDrawer();
  };

  window.Devatva.renderCompareDrawer = function () {
    const drawer = document.getElementById('devatva-compare-drawer');
    const container = document.getElementById('devatva-compare-content');
    if (!drawer || !container) return;

    const items = Devatva.getCompareItems();
    if (items.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--dev-text-muted); padding: 40px 0;">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">⚖️</div>
          <div>No products selected for comparison.</div>
          <div style="font-size: 0.8rem; margin-top: 6px;">Click "Compare" on any item to add it here.</div>
        </div>
      `;
      return;
    }

    let html = `
      <div style="display: grid; grid-template-columns: repeat(${items.length}, 1fr); gap: 12px;">
        ${items
          .map(
            (item) => `
          <div style="background: rgba(0,0,0,0.4); border: 1px solid var(--dev-gold-border); border-radius: 8px; padding: 12px; position: relative;">
            <button onclick="Devatva.toggleCompare({handle: '${item.handle}'})" style="position: absolute; top: 4px; right: 4px; background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1rem;">✕</button>
            <img src="${item.image}" alt="${item.title}" style="width: 100%; border-radius: 6px; margin-bottom: 8px;" />
            <h4 style="font-size: 0.85rem; color: #fff; margin-bottom: 4px;">${item.title}</h4>
            <div style="color: var(--dev-gold-light); font-weight: bold; font-size: 0.9rem; margin-bottom: 8px;">${item.price}</div>
            
            <div style="font-size: 0.75rem; color: var(--dev-text-muted); display: flex; flex-direction: column; gap: 4px;">
              <div><strong>Mukhi/Type:</strong> ${item.mukhi || 'N/A'}</div>
              <div><strong>Deity:</strong> ${item.deity || 'Vedic Blessings'}</div>
              <div><strong>Ruling Planet:</strong> ${item.planet || 'Universal'}</div>
              <div><strong>Certificate:</strong> ${item.lab ? '✅ Included' : 'Standard'}</div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `;
    container.innerHTML = html;
  };

  window.Devatva.openCompare = function () {
    const drawer = document.getElementById('devatva-compare-drawer');
    if (drawer) {
      Devatva.renderCompareDrawer();
      drawer.classList.add('is-open');
    }
  };

  window.Devatva.closeCompare = function () {
    const drawer = document.getElementById('devatva-compare-drawer');
    if (drawer) drawer.classList.remove('is-open');
  };

  // --- Ajax Add to Cart Hook ---
  window.Devatva.addToCart = async function (variantId, quantity = 1, properties = {}) {
    try {
      const response = await fetch(window.routes ? window.routes.cart_add_url : '/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: quantity, properties: properties }),
      });

      if (!response.ok) throw new Error('Cart update failed');

      Devatva.showToast('Item successfully added to your Divine Cart!');

      // Trigger Theme Cart Drawer update if cart JS is active
      document.dispatchEvent(new CustomEvent('cart:updated'));
      if (window.location.pathname.includes('/cart')) {
        window.location.reload();
      } else {
        // Open standard cart drawer if trigger button exists
        const cartBtn = document.querySelector('[data-cart-trigger], .header__icon--cart, #cart-icon-bubble');
        if (cartBtn) cartBtn.click();
      }
    } catch (err) {
      Devatva.showToast('Failed to add item to cart. Please try again.');
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    // Bind click events on quick view and compare buttons
    document.addEventListener('click', (e) => {
      const qvBtn = e.target.closest('[data-devatva-quickview]');
      if (qvBtn) {
        e.preventDefault();
        const handle = qvBtn.dataset.devatvaQuickview;
        Devatva.openQuickView(handle);
      }

      const compareBtn = e.target.closest('[data-devatva-compare]');
      if (compareBtn) {
        e.preventDefault();
        try {
          const product = JSON.parse(compareBtn.dataset.devatvaCompare);
          Devatva.toggleCompare(product);
        } catch (err) {
          console.error(err);
        }
      }
    });
  });
})();
