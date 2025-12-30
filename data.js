/**
 * Data Management Module - FIRESTORE EDITION
 * Handles Firestore interactions for Menu and Orders
 */

import { db, collection, getDocs, addDoc, onSnapshot, updateDoc, deleteDoc, doc, query, orderBy } from './firebase-config.js';

// Default menu to seed if empty
const DEFAULT_MENU_SEED = [
    {
        name: '2 Phulka with Chana',
        price: 50,
        category: 'Meals',
        description: 'Phulka+Sour Spicy Chana Masala',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=500&auto=format&fit=crop'
    },
    {
        name: '5 Phulka with Chana',
        price: 120,
        category: 'Meals',
        description: 'Phulka+Sour Spicy Chana Masala',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=500&auto=format&fit=crop'
    },
    // Starters
    {
        name: 'Hariyali Chicken Tikka [5 Pcs] with Kuboos',
        price: 100,
        category: 'Starters',
        description: 'Mint flavored boneless tikka with kuboos.',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=500&auto=format&fit=crop'
    },
    {
        name: 'Chicken Tandoori Tikka [5 Pcs] with Kuboos',
        price: 100,
        category: 'Starters',
        description: 'Tandoori flavored boneless tikka with kuboos.',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=500&auto=format&fit=crop'
    },
    {
        name: 'Reshmi Chicken Tikka [5 Pcs] with Kuboos',
        price: 100,
        category: 'Starters',
        description: 'Cashew flavored boneless tikka with kuboos.',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=500&auto=format&fit=crop'
    },
    {
        name: 'Chicken 65',
        price: 100,
        category: 'Starters',
        description: 'Crispy and spicy chicken 65, onion topping, lemon and cucumber.',
        image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=500&auto=format&fit=crop'
    },
    // Biryani
    {
        name: 'Chicken Plain Biryani',
        price: 130,
        category: 'Biryani',
        description: 'Hot and juicy kuska [500 g] with onion raita and brinjal curry.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=500&auto=format&fit=crop'
    },
    {
        name: '65 Biryani',
        price: 200,
        category: 'Biryani',
        description: 'Hot and juicy kuska [500 g], chicken 65 [100 g], onion raita...',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=500&auto=format&fit=crop'
    }
];

const DataManager = {
    // Current local cache
    menuCache: [],

    async init() {
        console.log("Initializing DataManager...");
        // Setup real-time listener for Menu
        // This ensures "everyone should see data lively" applies to menu changes too
        const menuCol = collection(db, 'menu');

        // Initial check to see if we need to seed data
        try {
            const snapshot = await getDocs(menuCol);
            if (snapshot.empty) {
                console.log("Seeding default menu to Firestore...");
                // Note: This might fail if rules only allow "read" but not "write"
                // So we try/catch specifically the seeding loop to avoid crashing
                try {
                    for (const item of DEFAULT_MENU_SEED) {
                        await addDoc(menuCol, item);
                    }
                } catch (seedError) {
                    console.error("Seeding failed (Permission Issue?):", seedError);
                    // We don't alert here because we might still be able to READ data
                }
            }
        } catch (e) {
            console.error("Initial Connection Failed:", e);
            alert("Database Connection Failed: " + e.message + "\n\nPlease check your Firebase Rules in the Console.");
            // We don't throw, we let it proceed to onSnapshot which might also fail or work (if rules changed)
        }

        // Return a promise that resolves when we have the initial data
        return new Promise((resolve) => {
            onSnapshot(menuCol, (snapshot) => {
                this.menuCache = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log("Menu updated from Firestore:", this.menuCache);

                // If app/admin is ready, trigger re-render
                if (window.app && window.app.renderMenu) {
                    window.app.renderMenu();
                }
                if (window.admin && window.admin.renderMenuTable) { // Sync admin view
                    window.admin.renderMenuTable();
                }
                resolve(this.menuCache);
            }, (error) => {
                console.error("Firestore Menu Error:", error);
                alert("Database Error: " + error.message + ". CHECK CONSOLE FOR DETAILS. Did you set Firestore Rules?");
                resolve([]); // Resolve empty so app doesn't hang
            });
        });
    },

    getMenu() {
        return this.menuCache;
    },

    // CRUD for Menu
    async addMenuItem(item) {
        await addDoc(collection(db, 'menu'), item);
    },

    async updateMenuItem(id, updatedItem) {
        const docRef = doc(db, 'menu', id);
        await updateDoc(docRef, updatedItem);
    },

    async deleteMenuItem(id) {
        const docRef = doc(db, 'menu', id);
        await deleteDoc(docRef);
    },

    // Orders
    async saveOrder(order, userInfo = {}) {
        const orderData = {
            timestamp: new Date().toISOString(),
            status: 'completed', // or 'pending' if we had a kitchen view
            createdBy: userInfo.email || 'Unknown',
            userId: userInfo.uid || 'anonymous',
            ...order
        };
        const docRef = await addDoc(collection(db, 'orders'), orderData);
        return { id: docRef.id, ...orderData };
    },

    async getOrders() {
        // Simple fetch for admin (not real-time, or could be)
        // For admin sales report, we can just fetch once or use snapshot
        // We will fetch simple query ordered by time
        const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    },

    // Subscribe to orders for Live Sales View
    subscribeOrders(callback) {
        const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
        return onSnapshot(q, (snapshot) => {
            const orders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(orders);
        });
    },

    // Helper for formatting currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }
};

// Make it global for app.js/admin.js
window.DataManager = DataManager;

export default DataManager;
