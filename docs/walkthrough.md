# Nissi Biriyani POS - Walkthrough

## Overview
This document serves as a user manual for the current POS system.

## 1. Authentication
- **Login**: Access `login.html`. Enter your credentials. The system supports multiple users via Firebase Auth.
- **Logout**: Click the "Logout" button in the top-right corner of either the POS or Admin dashboard.
- **Security**: Sessions persist until logout or explicit expiry logic (if configured).

## 2. POS Interface (Waiter/Cashier)
*The main screen for daily operations.*

### Taking an Order
1. **Browse Menu**: The center grid shows all available items with images and prices.
2. **Add to Cart**: Click any item card to add 1 unit to the cart. Click again to increment quantity.
3. **Cart Management** (Sidebar):
   - Use `+` and `-` buttons to adjust quantity.
   - Click "Clear" to empty the entire cart.

### Payment & Checkout
1. **Review**: Check the "Total" in the sidebar footer.
2. **Pay**: Click **"Pay Now"**.
3. **QR Code**: A QR code is generated for the exact amount. (Currently simulated/placeholder).
4. **Confirm**:
   - Click "Confirm & Print".
   - The system saves the order to database.
   - A Receipt is printed (system print dialog opens).
   - Cart is automatically cleared.

## 3. Admin Dashboard
*Access by clicking "Manage Menu" from the POS top bar.*

### Menu Management
- **View**: See all items in a table.
- **Add**: Use the form at the top to add new items (Name, Price, Category, Image URL).
- **Edit**: Click "Edit" on a row to populate the form with existing data. Update and Save.
- **Delete**: Click "Delete" to remove an item permanently.

### Sales Report
- **Overview**: See Total Revenue and Total Orders count.
- **History**: View recent transactions list.
- **Export**: Click **"Download CSV"** to get a detailed report for Excel/Sheets.
