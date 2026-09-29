# VENDOGO — Smart Vending. Simple Shopping.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

**Vendogo** is a production-grade smart vending machine management and quick-commerce shopping web application. Designed with the speed, fluid interactions, and polish of modern Indian quick-commerce apps like Blinkit, Vendogo delivers an automated 30-second snack, beverage, and campus essentials dispensing experience.

---

## 🌟 Key Highlights & Architecture

- **Dual Persona Workflows**: Dedicated customer quick-commerce shopping experience and an enterprise operator/admin management command center.
- **Real Persistent Database**: Local file-backed persistent database engine (`/data/vendogo-db.json`) pre-seeded with realistic Indian campus locations, 21+ products, customer orders, and telemetry. Ready for single-click deployment on Vercel, Supabase, or PostgreSQL.
- **Deep-Linked QR Code System**: Every vending machine generates a cryptographically unique high-res QR code. Scanning the QR opens the machine's exact inventory page (`/machine/VG-YTL-001`). Operators can download PNGs or print physical machine stickers.
- **In-App Live Camera QR Scanner**: Built-in camera scanner with optical viewfinder, rear/front switching, instant test simulator, and manual machine ID entry.
- **4-Digit Dispense OTP Protocol**: Secure 4-digit optical pickup code generated upon order confirmation to punch into the machine chute keypad.
- **Role-Based Security & Auth**: Password hashing with bcrypt, stateless signed JWT cookies, and role protection preventing unauthorized access to the operator portal.

---

## 🔑 Initial Demo Credentials

For quick testing and evaluation, Vendogo comes pre-seeded with verified test accounts:

| User Type | Email Address | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Operator / Admin** | `operator@vendogo.com` | `admin123` | Full Fleet, Inventory, QR & Order Controls |
| **Customer / Student** | `customer@vendogo.com` | `customer123` | Quick-Commerce, Cart, Orders & QR Scanner |

> **Pro Tip:** On the Login page (`/auth/login`), click **"👤 Customer Demo"** or **"⚙️ Operator Admin"** to auto-fill credentials instantly!

---

## 🚀 Deployed Campus Vending Network (Demo Seed)

1. **VG-YTL-001**: GCOE Yavatmal — Tech Block A (Main Academic Foyer, 4.2°C Chilled, 40 Slots)
2. **VG-YTL-002**: GCOE Yavatmal — Central Library & Student Hub (Reading Room, 35 Slots)
3. **VG-YTL-003**: Yavatmal Smart Concourse — Central Bus Terminal (Platform 1 Concourse, 50 Slots)

---

## 📱 Features Walkthrough

### 1. Customer Shopping Experience
- **Location & Machine Selector**: View nearby machines, real-time online/offline status, chilled temperature, and available slots.
- **Instant Search & Category Pills**: Filter by Snacks, Beverages, Chocolates, Biscuits, Instant Food, Stationery, and Personal Care.
- **Blinkit-Style Product Cards**:
  - Crisp high-res product photos
  - 100% Vegetarian badge & Bestseller tags
  - Interactive `+ ADD` button that smoothly transforms into `[-] [qty] [+]` pill counter
  - Quick-view sheet with calorie counts, slot locations, and detailed nutritional info
- **Persistent Slide-Over Cart**:
  - Real-time bill breakdown (Item Total, Free Dispense Fee, Packaging Included)
  - Simulated payment modes: UPI (PhonePe / GPay), Debit/Credit Card, Pay at Machine
- **Order Confirmation & OTP**:
  - Confetti celebration
  - 4-digit dispense OTP with 1-click copy
  - Real-time status tracker (Confirmed → Preparing → Ready → Completed)
- **Order History & Profile**: Re-order past snacks, view previous dispense codes, update user profile and password.

### 2. Operator & Admin Management Portal
- **Executive Dashboard**:
  - 6 Real-time KPI Cards: Total Machines, Active Machines, Catalog SKUs, Low-Stock Count, Today's Orders, Today's Sales (₹)
  - Responsive Daily Revenue Chart (Past 7 days)
  - Machine fleet stock health ranking
  - Urgent Low-Stock Restock Alerts
- **Vending Fleet Management**:
  - Add new machines with custom slots and location
  - QR Code generator with PNG download and printable sticker format
  - Edit or deactivate machines
- **Product Catalog Management**:
  - Add/Edit items with price, MRP, images, and category
  - Inline one-click stock adjusters (`-1`, `+1`, `+5`)
  - Machine assignment
- **Machine-Wise Inventory Matrix**:
  - Visual status indicators: Green (In Stock > 5), Yellow (Low Stock ≤ 5), Red (Out of Stock)
  - Urgent replenishment banner with 1-click `+10 Restock`
- **Live Order Telemetry**:
  - Live customer orders monitor
  - Real-time status update: `Pending` → `Confirmed` → `Preparing` → `Ready` → `Completed` → `Cancelled`
  - Dispense OTP verification

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/your-username/vendogo.git
cd vendogo
```

### 2. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Setup environment variables
Copy the example environment file:
```bash
cp .env.example .env.local
```

Default values in `.env.local`:
```env
JWT_SECRET=vendogo-production-secret-key-smart-vending-2026-secure
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Vercel Deployment Instructions

Vendogo is fully optimized for single-click deployment on **Vercel**:

### Option A: Deploy via Vercel Dashboard
1. Push your code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Vendogo smart vending web app"
   git branch -M main
   git remote add origin https://github.com/[YOUR-USERNAME]/vendogo.git
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import the `vendogo` repository.
4. Under **Environment Variables**, add:
   - `JWT_SECRET`: `vendogo-production-secret-key-smart-vending-2026-secure`
   - `NEXT_PUBLIC_APP_URL`: `https://your-project.vercel.app` (your Vercel domain)
5. Click **Deploy**. Vercel will build and deploy the application within ~60 seconds.

---

## 🧪 Comprehensive Verification Checklist

- [x] **Authentication**: Register new customer, login with test customer, login with operator, logout.
- [x] **Session Persistence**: JWT session cookie persists across page refreshes and browser tabs.
- [x] **Product Browsing**: Filter by category, search by product name, toggle in-stock items.
- [x] **Cart & Add-to-Cart**: Add products, adjust quantities with `+` / `-`, view floating mobile cart pill.
- [x] **Checkout & Dispense**: Place order, receive 4-digit dispense OTP, view confetti celebration.
- [x] **Order History**: Check order receipts and OTP codes under `/orders`.
- [x] **QR Code Generation**: Generate QR code in operator portal, download PNG, preview printable sticker.
- [x] **QR Code Scanning**: Open `/scan`, scan physical QR or use 1-click test simulation (`VG-YTL-001`).
- [x] **Operator Security**: Non-operator users cannot access `/operator/dashboard`.
- [x] **Inventory Restocking**: Adjust stock quantities; verify instant stock sync in customer shop.

---

## 📄 License

MIT License. Designed and engineered for Vendogo Smart Vending Systems.
