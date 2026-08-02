/**
 * DEVATVA.IN - CORE APPLICATION & INTERACTIVE MODULES (LIGHT ELEGANT THEME)
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
      <div style="text-align: center; padding: 40px; color: var(--dev-gold-dark);">
        <div style="font-size: 2.2rem; margin-bottom: 12px;">🕉️</div>
        <div style="font-weight: 600;">Loading Divine Product Details...</div>
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
            <img src="${product.featured_image}" alt="${product.title}" style="width: 100%; border-radius: 12px; border: 1.5px solid #efe9dc;" />
          </div>
          <div>
            <div class="devatva-badge" style="margin-bottom: 8px;">100% Authentic & Energized</div>
            <h2 class="devatva-heading" style="font-size: 1.5rem; margin-bottom: 12px; color: #1c1917;">${product.title}</h2>
            <div class="devatva-card-price" style="font-size: 1.4rem; margin-bottom: 16px;">
              ${formatMoney(product.price)}
              ${product.compare_at_price > product.price ? `<span class="devatva-compare-price">${formatMoney(product.compare_at_price)}</span>` : ''}
            </div>
            
            <div style="font-size: 0.9rem; line-height: 1.6; color: #57534e; margin-bottom: 20px;">
              ${product.description.replace(/<[^>]*>?/gm, '').slice(0, 180)}...
            </div>

            ${
              product.variants.length > 1
                ? `
              <div style="margin-bottom: 16px;">
                <label style="display:block; font-size: 0.85rem; color: var(--dev-gold-dark); font-weight: 600; margin-bottom: 6px;">Select Option:</label>
                <select id="devatva-qv-variant-select" style="width: 100%; padding: 10px; background: #fff; color: #1c1917; border: 1.5px solid #efe9dc; border-radius: 8px;">
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
      container.innerHTML = `<div style="color: #dc2626; padding: 20px; text-align: center;">Unable to load product preview.</div>`;
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
        <div style="text-align: center; color: #78716c; padding: 40px 0;">
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
          <div style="background: #fdfbf7; border: 1.5px solid #efe9dc; border-radius: 10px; padding: 12px; position: relative; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <button onclick="Devatva.toggleCompare({handle: '${item.handle}'})" style="position: absolute; top: 4px; right: 4px; background: none; border: none; color: #dc2626; cursor: pointer; font-size: 1rem;">✕</button>
            <img src="${item.image}" alt="${item.title}" style="width: 100%; border-radius: 6px; margin-bottom: 8px;" />
            <h4 style="font-size: 0.88rem; color: #1c1917; font-weight: 700; margin-bottom: 4px;">${item.title}</h4>
            <div style="color: var(--dev-gold-dark); font-weight: 800; font-size: 0.95rem; margin-bottom: 8px;">${item.price}</div>
            
            <div style="font-size: 0.78rem; color: #57534e; display: flex; flex-direction: column; gap: 4px;">
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

      document.dispatchEvent(new CustomEvent('cart:updated'));
      if (window.location.pathname.includes('/cart')) {
        window.location.reload();
      } else {
        const cartBtn = document.querySelector('[data-cart-trigger], .header__icon--cart, #cart-icon-bubble');
        if (cartBtn) cartBtn.click();
      }
    } catch (err) {
      Devatva.showToast('Failed to add item to cart. Please try again.');
    }
  };

  // --- Dynamic Live Viewers Counter Loop (14 to 100+) ---
  function initLiveViewersCounter() {
    const viewersEl = document.querySelector('.devatva-viewers-count');
    if (!viewersEl) return;

    let currentViewers = 14;
    viewersEl.textContent = currentViewers;

    setInterval(() => {
      // Gradually increase up to 100+ with occasional realistic fluctuation
      const change = Math.floor(Math.random() * 4) + 1; // +1 to +4
      currentViewers += change;
      if (currentViewers > 108) {
        currentViewers = 84 + Math.floor(Math.random() * 10);
      }
      viewersEl.textContent = currentViewers;
      viewersEl.style.transition = 'color 0.3s ease, transform 0.3s ease';
      viewersEl.style.color = '#c2410c';
      viewersEl.style.transform = 'scale(1.15)';
      setTimeout(() => {
        viewersEl.style.color = 'inherit';
        viewersEl.style.transform = 'scale(1)';
      }, 350);
    }, 4000);
  }

  // --- Dynamic Live Sales Popup Notification System ---
  function initSalesPopups() {
    const indianCities = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Ahmedabad', 'Jaipur', 'Kolkata', 'Pune', 'Surat', 'Lucknow', 'Hyderabad', 'Indore', 'Varanasi', 'Chandigarh'];
    const indianNames = ['Rahul M.', 'Priya S.', 'Amit K.', 'Vikram R.', 'Ananya P.', 'Suresh G.', 'Neha V.', 'Rohan T.', 'Pooja B.', 'Deepak M.'];

    let popupContainer = document.querySelector('.devatva-sales-popup');
    if (!popupContainer) {
      popupContainer = document.createElement('div');
      popupContainer.className = 'devatva-sales-popup';
      document.body.appendChild(popupContainer);
    }

    function showRandomSale() {
      // Get current product title if on product page, otherwise use default
      let productTitle = 'Natural Sulemani Hakik Bracelet';
      let productImage = '';
      
      const pageTitleEl = document.querySelector('.product__title h1, .product-single__title, .dev10-title');
      if (pageTitleEl) {
        productTitle = pageTitleEl.textContent.trim().split('\n')[0].slice(0, 35) + '...';
      }
      
      const imgEl = document.querySelector('.product__media img, .product-single__photo img');
      if (imgEl && imgEl.src) {
        productImage = imgEl.src;
      }

      const randomName = indianNames[Math.floor(Math.random() * indianNames.length)];
      const randomCity = indianCities[Math.floor(Math.random() * indianCities.length)];
      const randomMins = Math.floor(Math.random() * 12) + 2;

      popupContainer.innerHTML = `
        <div class="devatva-sales-popup-card">
          <div class="devatva-sales-popup-img">
            ${productImage ? `<img src="${productImage}" alt="Product" />` : '📿'}
          </div>
          <div class="devatva-sales-popup-info">
            <div class="devatva-sales-popup-buyer"><strong>${randomName}</strong> from ${randomCity}</div>
            <div class="devatva-sales-popup-title">Purchased <strong>${productTitle}</strong></div>
            <div class="devatva-sales-popup-time">⚡ Verified Order • ${randomMins} mins ago</div>
          </div>
        </div>
      `;

      popupContainer.classList.add('is-visible');

      setTimeout(() => {
        popupContainer.classList.remove('is-visible');
      }, 5000);
    }

    // Trigger first popup after 5 seconds, then repeat every 18-28 seconds
    setTimeout(() => {
      showRandomSale();
      setInterval(() => {
        showRandomSale();
      }, Math.floor(Math.random() * 10000) + 18000);
    }, 5000);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initLiveViewersCounter();
    initSalesPopups();

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
