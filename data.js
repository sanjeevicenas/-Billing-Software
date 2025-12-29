/**
 * Data Management Module
 * Handles localStorage interactions for Menu and Orders
 */

const STORAGE_KEYS = {
    MENU: 'restaurant_app_menu_v2', // Versioned to force update
    ORDERS: 'restaurant_app_orders'
};

const DEFAULT_MENU = [
    // Meals
    {
        id: crypto.randomUUID(),
        name: '2 Phulka with Chana',
        price: 50,
        category: 'Meals',
        description: 'Phulka+Sour Spicy Chana Masala',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=500&auto=format&fit=crop'
    },
    {
        id: crypto.randomUUID(),
        name: '5 Phulka with Chana',
        price: 120,
        category: 'Meals',
        description: 'Phulka+Sour Spicy Chana Masala',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=500&auto=format&fit=crop'
    },
    // Starters
    {
        id: crypto.randomUUID(),
        name: 'Hariyali Chicken Tikka [5 Pcs] with Kuboos',
        price: 100,
        category: 'Starters',
        description: 'Mint flavored boneless tikka with kuboos.',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=500&auto=format&fit=crop'
    },
    {
        id: crypto.randomUUID(),
        name: 'Chicken Tandoori Tikka [5 Pcs] with Kuboos',
        price: 100,
        category: 'Starters',
        description: 'Tandoori flavored boneless tikka with kuboos.',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=500&auto=format&fit=crop'
    },
    {
        id: crypto.randomUUID(),
        name: 'Reshmi Chicken Tikka [5 Pcs] with Kuboos',
        price: 100,
        category: 'Starters',
        description: 'Cashew flavored boneless tikka with kuboos.',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=500&auto=format&fit=crop'
    },
    {
        id: crypto.randomUUID(),
        name: 'Chicken 65',
        price: 100,
        category: 'Starters',
        description: 'Crispy and spicy chicken 65, onion topping, lemon and cucumber.',
        image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=500&auto=format&fit=crop'
    },
    // Biryani
    {
        id: crypto.randomUUID(),
        name: 'Chicken Plain Biryani',
        price: 130,
        category: 'Biryani',
        description: 'Hot and juicy kuska [500 g] with onion raita and brinjal curry.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=500&auto=format&fit=crop'
    },
    {
        id: crypto.randomUUID(),
        name: '65 Biryani',
        price: 200,
        category: 'Biryani',
        description: 'Hot and juicy kuska [500 g], chicken 65 [100 g], onion raita...',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=500&auto=format&fit=crop'
    }
];

const DataManager = {
    init() {
        if (!localStorage.getItem(STORAGE_KEYS.MENU)) {
            this.saveMenu(DEFAULT_MENU);
        }
    },

    getMenu() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.MENU) || '[]');
    },

    saveMenu(menu) {
        localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menu));
    },

    addMenuItem(item) {
        const menu = this.getMenu();
        menu.push({ ...item, id: crypto.randomUUID() });
        this.saveMenu(menu);
    },

    updateMenuItem(id, updatedItem) {
        let menu = this.getMenu();
        menu = menu.map(item => item.id === id ? { ...item, ...updatedItem } : item);
        this.saveMenu(menu);
    },

    deleteMenuItem(id) {
        let menu = this.getMenu();
        menu = menu.filter(item => item.id !== id);
        this.saveMenu(menu);
    },

    getOrders() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    },

    saveOrder(order) {
        const orders = this.getOrders();
        const newOrder = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            ...order
        };
        orders.push(newOrder);
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        return newOrder;
    },

    // Helper for formatting currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }
};

// Initialize data if needed
DataManager.init();
