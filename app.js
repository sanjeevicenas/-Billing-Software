/**
 * POS Application Logic
 */

// Auth Check
if (localStorage.getItem('restaurant_app_auth') !== 'true') {
    window.location.href = 'login.html';
}

const app = {
    state: {
        cart: [], // { item, qty }
        currentOrderTotal: 0
    },

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('restaurant_app_auth');
            window.location.href = 'login.html';
        }
    },

    init() {
        this.renderMenu();
        this.renderCart();
        this.startClock();
    },

    startClock() {
        const updateTime = () => {
            const now = new Date();
            // Format: HH:MM:SS AM/PM
            const timeString = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
            const clockEl = document.getElementById('live-clock');
            if (clockEl) clockEl.textContent = timeString;
        };

        updateTime(); // Initial call
        setInterval(updateTime, 1000);
    },

    renderMenu() {
        const menu = DataManager.getMenu();
        const grid = document.getElementById('menu-grid');

        grid.innerHTML = menu.map(item => `
            <div class="menu-card" onclick="app.addToCart('${item.id}')">
                <img src="${item.image}" alt="${item.name}" class="card-img">
                <div class="card-content">
                    <div class="card-title">${item.name}</div>
                    <div class="card-price">${DataManager.formatCurrency(item.price)}</div>
                </div>
            </div>
        `).join('');
    },

    addToCart(itemId) {
        const menu = DataManager.getMenu();
        const item = menu.find(i => i.id === itemId);

        if (!item) return;

        const existing = this.state.cart.find(c => c.item.id === itemId);
        if (existing) {
            existing.qty++;
        } else {
            this.state.cart.push({ item, qty: 1 });
        }

        this.renderCart();
    },

    updateQty(itemId, change) {
        const cartItem = this.state.cart.find(c => c.item.id === itemId);
        if (!cartItem) return;

        cartItem.qty += change;
        if (cartItem.qty <= 0) {
            this.state.cart = this.state.cart.filter(c => c.item.id !== itemId);
        }

        this.renderCart();
    },

    clearCart() {
        if (confirm('Are you sure you want to clear the cart?')) {
            this.state.cart = [];
            this.renderCart();
        }
    },

    renderCart() {
        const container = document.getElementById('cart-items');
        const payBtn = document.getElementById('pay-btn');

        if (this.state.cart.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: var(--text-secondary); margin-top: 40px; display: flex; flex-direction: column; align-items: center; gap: 10px;">
                    <svg style="width: 40px; height: 40px; color: var(--border);" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    Start adding items
                </div>`;
            payBtn.disabled = true;
            this.updateTotals(0);
            return;
        }

        payBtn.disabled = false;

        container.innerHTML = this.state.cart.map(({ item, qty }) => `
            <div class="cart-item">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <span class="price">${DataManager.formatCurrency(item.price * qty)}</span>
                </div>
                <div class="item-controls">
                    <button class="qty-btn" onclick="event.stopPropagation(); app.updateQty('${item.id}', -1)">-</button>
                    <span style="font-size: 14px; min-width: 20px; text-align: center;">${qty}</span>
                    <button class="qty-btn" onclick="event.stopPropagation(); app.updateQty('${item.id}', 1)">+</button>
                </div>
            </div>
        `).join('');

        const subtotal = this.state.cart.reduce((sum, { item, qty }) => sum + (item.price * qty), 0);
        this.updateTotals(subtotal);
    },

    updateTotals(subtotal) {
        const total = subtotal;
        this.state.currentOrderTotal = total;

        document.getElementById('subtotal').textContent = DataManager.formatCurrency(subtotal);
        document.getElementById('total').textContent = DataManager.formatCurrency(total);
        document.getElementById('payment-total').textContent = DataManager.formatCurrency(total);
    },

    initiatePayment() {
        const modal = document.getElementById('payment-modal');
        const qrImg = document.getElementById('qr-code-img');

        // Generate a text for the QR
        const qrData = `PAY: ${this.state.currentOrderTotal.toFixed(2)}`;
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

        modal.classList.add('active');
    },

    cancelPayment() {
        document.getElementById('payment-modal').classList.remove('active');
    },

    confirmPayment() {
        // Safe check
        if (this.state.cart.length === 0) return;

        const order = {
            items: this.state.cart,
            total: this.state.currentOrderTotal,
            paymentMethod: 'QR Scan'
        };

        const savedOrder = DataManager.saveOrder(order);

        // Prepare Receipt
        this.prepareReceipt(savedOrder);

        // Close Modal and Print
        this.cancelPayment();

        // Change title for PDF filename
        const originalTitle = document.title;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        document.title = `Receipt_${timestamp}`;

        setTimeout(() => {
            window.print();

            // Restore title
            document.title = originalTitle;

            // Clear cart after print dialog closes (simulated by timeout, or just immediately)
            this.state.cart = [];
            this.renderCart();
        }, 500);
    },

    prepareReceipt(order) {
        document.getElementById('receipt-date').textContent = new Date(order.timestamp).toLocaleString();
        document.getElementById('receipt-id').textContent = order.id.slice(0, 8);
        document.getElementById('receipt-total').textContent = DataManager.formatCurrency(order.total);

        const itemsHtml = order.items.map(({ item, qty }) => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>${qty} x ${item.name}</span>
                <span>${DataManager.formatCurrency(item.price * qty)}</span>
            </div>
        `).join('');

        document.getElementById('receipt-items').innerHTML = itemsHtml;
    }
};

// Start
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
