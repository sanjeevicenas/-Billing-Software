# Nissi Biriyani POS

A real-time Point of Sale (POS) system with multi-user support and live order updates.

## Features
- **Secure Login**: Multi-user authentication via Google Firebase.
- **Real-time Sync**: Menu and Sales updates reflect instantly across all devices.
- **Admin Dashboard**: Manage menu items and view sales reports.
- **Mobile Responsive**: Works on phones, tablets, and desktops.

## How to Run Locally
⚠️ **Important**: Because this project uses modern JavaScript Modules, you cannot just double-click `index.html`. You must use a local web server.

### Option 1: VS Code (Recommended)
1. Install the "Live Server" extension in VS Code.
2. Right-click `login.html` and choose "Open with Live Server".

### Option 2: Node.js
Run this command in the project folder:
```bash
npx serve .
```

### Option 3: Python
```bash
python -m http.server
```

## Deployment
To make it live for everyone:
1. Push this code to **GitHub**.
2. Go to Repository Settings > **Pages**.
3. Select `main` branch and save.
4. Your app will be live at `https://<username>.github.io/<repo-name>/`.

## Default Login
- **Email**: `admin@nissipos.com` (or the user you created in Firebase)
- **Password**: The password you set in Firebase Authentication.
