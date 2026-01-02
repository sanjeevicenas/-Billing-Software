# Mobile Strategic Plan

## Executive Summary
The current Nissi Biriyani POS is designed for desktop usage (landscape mode). To support waiters taking orders tableside or managing the restaurant from a phone, we need a dedicated **Mobile Strategy**. This document outlines the roadmap to achieve a world-class mobile experience.

## 1. Design Philosophy
**"Thumb-First Design"**
- Mobile users use thumbs. Primary actions (Add to Cart, Checkout, Nav) should be at the bottom of the screen.
- **Current State**: Sidebar is on the left (Desktop pattern).
- **Target State**:
  - **Navigation**: Bottom Tab Bar (Menu | Cart | Orders | Profile).
  - **Cart Actions**: Floating Action Button (FAB) or sticky bottom bar showing "Items: 3 | Total: ₹450 > Pay".

## 2. Technical Roadmap

### Phase 1: Responsive Web Design (RWD)
*Goal: Make it usable on a phone immediately.*
- **Grid Layout**: Switch from 4-column menu to 1-column (list) or 2-column (grid) on mobile.
- **Sidebar**: Convert to a "Drawer" (Slide-in menu) or move Cart to a separate screen.
- **Touch Targets**: Increase button sizes to minimum 44x44px.

### Phase 2: Progressive Web App (PWA) -> *High Priority*
*Goal: Make it fast and installable.*
- **App Icon**: Add home screen icon.
- **Fullscreen**: Remove browser address bar (standalone mode).
- **Offline Mode**: Cache menu data so the app loads instantly even with spotty WiFi.

### Phase 3: Mobile-Specific Features
- **Haptic Feedback**: Vibrate on "Add to Cart".
- **Swipe Actions**: Swipe item left to remove from cart.
- **Camera Integration**: Use phone camera to scan Member QR codes (future loyalty feature).

## 3. UX Mockup Concepts

### Menu View (Mobile)
```
[ Brand Logo   User Icon ]
[ Search / Filter Config ]
--------------------------
[ Item Image ]  [ Title  ]
[            ]  [ Price  ]
[            ]  [ ADD +  ]
--------------------------
...
--------------------------
[   View Cart (3)  ₹350  ]  <-- Sticky Footer
```

### Cart View (BottomSheet)
```
[       Your Order       ]
[ Item 1          - 1 +  ]
[ Item 2          - 2 +  ]
--------------------------
[ Total            ₹350  ]
[    PAY VIA QR CODE     ]
```

## 4. Next Steps
1. Approve **Implementation Plan** for Phase 1 (Responsive).
2. Execute CSS refactoring.
3. Test on actual devices.
