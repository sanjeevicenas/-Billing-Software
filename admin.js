/**
 * Admin Dashboard Logic
 */

// Auth Check
if (localStorage.getItem('restaurant_app_auth') !== 'true') {
    window.location.href = 'login.html';
}

const admin = {
    init() {
        this.renderMenuTable();
    },

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('restaurant_app_auth');
            window.location.href = 'login.html';
        }
    },

    switchTab(tabName) {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));

        event.target.classList.add('active');
        document.getElementById(`tab-${tabName}`).classList.add('active');

        if (tabName === 'sales') {
            this.renderSales();
        } else {
            this.renderMenuTable();
        }
    },

    // --- Menu Management ---

    renderMenuTable() {
        const menu = DataManager.getMenu();
        const tbody = document.getElementById('menu-table-body');

        tbody.innerHTML = menu.map(item => `
            <tr>
                <td><img src="${item.image}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;"></td>
                <td style="font-weight: 500;">${item.name}</td>
                <td style="color: var(--text-secondary);">${item.category}</td>
                <td>${DataManager.formatCurrency(item.price)}</td>
                <td style="text-align: right;">
                    <button onclick="admin.editItem('${item.id}')" class="btn btn-outline" style="padding: 6px 10px; margin-right: 5px;">Edit</button>
                    <button onclick="admin.deleteItem('${item.id}')" class="btn btn-danger" style="padding: 6px 10px;">Delete</button>
                </td>
            </tr>
        `).join('');
    },

    saveItem() {
        const id = document.getElementById('item-id').value;
        const item = {
            name: document.getElementById('item-name').value,
            price: parseFloat(document.getElementById('item-price').value),
            category: document.getElementById('item-category').value,
            image: document.getElementById('item-image').value
        };

        if (id) {
            DataManager.updateMenuItem(id, item);
        } else {
            DataManager.addMenuItem(item);
        }

        this.resetForm();
        this.renderMenuTable();
    },

    editItem(id) {
        const menu = DataManager.getMenu();
        const item = menu.find(i => i.id === id);
        if (!item) return;

        document.getElementById('item-id').value = item.id;
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-price').value = item.price;
        document.getElementById('item-category').value = item.category;
        document.getElementById('item-image').value = item.image;

        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    deleteItem(id) {
        if (confirm('Delete this item?')) {
            DataManager.deleteMenuItem(id);
            this.renderMenuTable();
        }
    },

    resetForm() {
        document.getElementById('menu-form').reset();
        document.getElementById('item-id').value = '';
    },

    // --- Sales Reporting ---

    renderSales() {
        const orders = DataManager.getOrders().reverse(); // Newest first

        // Metrics
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        document.getElementById('total-revenue').textContent = DataManager.formatCurrency(totalRevenue);
        document.getElementById('total-orders').textContent = orders.length;

        // Table
        const tbody = document.getElementById('sales-table-body');

        if (orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-secondary);">No sales yet</td></tr>`;
            return;
        }

        tbody.innerHTML = orders.map(order => `
            <tr>
                <td style="font-family: monospace;">${order.id.slice(0, 8)}...</td>
                <td>${new Date(order.timestamp).toLocaleString()}</td>
                <td>
                    ${order.items.map(i => `<div style="font-size: 13px;">${i.qty}x ${i.item.name}</div>`).join('')}
                </td>
                <td style="text-align: right; font-weight: 600;">${DataManager.formatCurrency(order.total)}</td>
            </tr>
        `).join('');
    },

    downloadCSV() {
        const orders = DataManager.getOrders();
        if (orders.length === 0) {
            alert('No sales data to export.');
            return;
        }

        // CSV Headers
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Order ID,Date,Time,Items,Total Amount (INR)\n";

        // CSV Rows
        orders.forEach(order => {
            const dateObj = new Date(order.timestamp);
            const date = dateObj.toLocaleDateString();
            const time = dateObj.toLocaleTimeString();

            // Format items as a single string e.g. "2x Burger | 1x Coke"
            const itemsString = order.items.map(i => `${i.qty}x ${i.item.name}`).join(' | ');

            // Escape quotes and commas in itemsString to prevent CSV breakage
            const safeItems = `"${itemsString.replace(/"/g, '""')}"`;

            const row = `${order.id},${date},${time},${safeItems},${order.total}`;
            csvContent += row + "\n";
        });

        // Trigger Download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `sales_report_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// Start
document.addEventListener('DOMContentLoaded', () => {
    admin.init();
});
