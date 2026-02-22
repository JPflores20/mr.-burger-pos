

# Mr. Burger — Desktop POS System

## Overview
A professional point-of-sale system for "Mr. Burger" restaurant, optimized for 1080p desktop monitors with a fixed three-column layout for maximum operational speed.

---

## Design System
- **Dark mode aesthetic**: Slate-950 background with vibrant orange (#F57C00) and amber accents
- **Typography**: Clean, high-contrast text for quick readability in a fast-paced environment
- **Icons**: Lucide-react throughout for consistent iconography

---

## Layout — Fixed Three-Column Design

### 1. Left Sidebar — Category Navigation
- Narrow fixed vertical bar (~80px wide)
- Large icons + labels for: **Burgers, Combos, Sides, Drinks, Desserts**
- Active category highlighted with orange accent
- Always visible, no scrolling

### 2. Central Panel — Product Grid
- **Top search bar** for instant product filtering (keyboard shortcut: F2 to focus)
- Responsive grid of product cards showing image, name, and price
- Clicking a card opens a **customization modal** with options like "No Onions," "+ Extra Cheese," "Large Fries Upgrade" with add-ons priced accordingly
- Category-based filtering synced with left sidebar selection

### 3. Right Panel — Order Summary / Ticket
- Persistent sidebar showing the current order
- Itemized list with **quantity toggles (+/-)** and remove buttons
- Customizations shown per item (e.g., "No Onions, +Extra Cheese")
- Real-time calculation: **Subtotal → Tax (16%) → Total**
- **Payment method selection**: Cash, Card, Transfer
- Prominent **"Confirm Order"** and **"Clear Cart"** buttons

---

## Key Features

### Customization Modal
- Opens on product card click
- Shows product image, name, base price
- Toggle-based customization options grouped by type (Remove, Add, Upgrade)
- Add-on pricing reflected in real-time
- "Add to Order" button; Enter key shortcut to confirm

### Keyboard Shortcuts
- **Esc** — Close any open modal
- **F2** — Focus the search bar
- **Enter** — Confirm/add current item from modal

### Cart State Management
- Global React context for zero-latency cart operations
- Add, remove, update quantity, clear cart — all instant

### Code Architecture
- Structured with clean separation: menu data, cart state, and UI components
- Menu data defined in a central file, easily replaceable with a backend API
- Cart context ready to connect to Supabase for order persistence and kitchen view sync

---

## Sample Menu Data
Pre-populated with realistic Mr. Burger items across all 5 categories with names, prices, and images (placeholder images initially).

