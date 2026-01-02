# Deployment Guide

## Option 1: Firebase Hosting (Recommended)
*Best for performance and security rules.*

1. **Install CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login**
   ```bash
   firebase login
   ```

3. **Initialize**
   - Run `firebase init` in the project folder.
   - Select **Hosting**.
   - Select project: `nissi-biryani-pos`.
   - Public directory: `.` (or type `dist` if building, but for this raw HTML app, use active directory). *Note: Standard practice is to move files to a `public` folder, but for simple root deployment, `.` works if you configure strict ignores.*
   - Configure as single-page app? **No** (We have multiple HTML files).

4. **Deploy**
   ```bash
   firebase deploy
   ```

## Option 2: GitHub Pages
*Free and simple.*

1. **Push to GitHub**
   - Initialize git: `git init`, `git add .`, `git commit -m "Initial"`.
   - Create repo on GitHub.
   - Remote add: `git remote add origin <url>`.
   - Push: `git push -u origin main`.

2. **Enable Pages**
   - Go to Repo Settings > Pages.
   - Source: `Deploy from a branch`.
   - Branch: `main` / root.
   - Save.

3. **URL Configuration**
   - Update `firebase-config.js` "Authorized Domains" in Firebase Console to include your `username.github.io` domain if auth fails.
