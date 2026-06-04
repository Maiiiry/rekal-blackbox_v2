# CODEBASE.md — ReKal Blackbox v2

> Generated: 2026-06-04 | Updated: 2026-06-04

## Project Identity

- **Name:** ReKal (Rekalkulasi HPP)
- **Description:** Aplikasi manajemen Harga Pokok Produksi (HPP) untuk industri tas dan fashion. PWA mobile-first berbasis React + Supabase.
- **Tech Stack:** React 18, Vite 6, Tailwind CSS 3, Supabase, React Router 7
- **Purpose:** Menghitung HPP, estimasi harga jual, dan simulasi margin produk manufaktur fashion dengan manajemen Bill of Materials.

---

## Directory Structure

```
rekal-blackbox_v2/
├── index.html                    # Entry HTML (PWA meta tags, Inter font)
├── package.json                  # Dependencies & scripts
├── vite.config.js                # Vite + React + PWA plugin config
├── tailwind.config.js            # Custom theme (colors, shadows, animations)
├── postcss.config.js             # PostCSS w/ Tailwind + Autoprefixer
├── netlify.toml                  # Netlify deploy config (SPA rewrite)
├── supabase-schema.sql           # Complete DB schema (Categories, Materials, Products, BoM)
├── .env                          # Supabase credentials
├── .blackboxrules                # Project rules/config
├── README.md
├── SETUP.md
├── DOKUMENTASI_TEKNIS_REKAL.md
├── Standar_Implementasi_Aplikasi.md
├── public/
│   ├── manifest.json             # PWA manifest
│   ├── Logo_ReKal.png
│   ├── icon-192x192.png
│   └── icon-512x512.png
├── migrations/
│   ├── add_product_photo.sql           # Legacy: add photo_url column
│   └── add_product_photos_table.sql    # Multi-photo support (product_photos table)
├── dist/                               # Production build output
└── src/
    ├── main.jsx                  # React entry, PWA SW registration
    ├── App.jsx                   # Root: router, providers, layout
    ├── index.css                 # Tailwind base + custom component classes
    ├── supabase.js               # Supabase client + database helper functions (db)
    ├── contexts/
    │   ├── AuthContext.jsx       # Supabase auth (signIn/Up/Out, session)
    │   ├── DataContext.jsx       # Global data state (categories/materials/products)
    │   └── ConfirmationContext.jsx # Confirm/cancel dialog manager
    ├── pages/
    │   ├── Login.jsx             # Auth page (login/signup + demo bypass)
    │   ├── Dashboard.jsx         # Stats overview, recent products
    │   ├── Categories.jsx        # CRUD categories with search
    │   ├── Materials.jsx         # CRUD materials with category linking
    │   ├── Products.jsx          # Product grid with images, copy, delete
    │   ├── ProductDetail.jsx     # Full product view (gallery, BoM, cost breakdown)
    │   ├── ProductForm.jsx       # Create/edit/copy product (BoM builder + photo upload)
    │   └── PriceSimulation.jsx   # Standalone HPP/cost simulation
    ├── components/
    │   ├── BottomNav.jsx         # 5-tab mobile bottom navigation
    │   ├── Toast.jsx             # Toast notification system (success/error/info)
    │   ├── ConfirmationDialog.jsx # Modal confirmation (danger/warning/info)
    │   ├── ProductPhotoGallery.jsx # Image carousel w/ lightbox, drag-reorder, download
    │   ├── ProductPhotoUpload.jsx  # Single photo upload (legacy)
    │   └── MultiPhotoUpload.jsx    # Multi-photo upload (drag-reorder, 10 max)
    └── utils/
        ├── validators.js         # Form validation (required, unique, price, BoM)
        ├── formatters.js         # Rupiah, number, date, percentage formatters
        └── calculations.js       # HPP formulas (material cost, overhead, margin, usage)
```

---

## Architecture

### Provider Hierarchy
```
AuthProvider > DataProvider > ConfirmationProvider > ToastProvider > Router > AppLayout > Pages
```

### Data Flow
```
Pages <-> DataContext (state + actions) <-> supabase.js db helpers <-> Supabase Postgres
```

All CRUD operations flow through `DataContext` which calls `db` helper functions in `supabase.js`. State is kept in React `useState` within `DataContext`. Pages consume data via `useData()` hook.

### Auth Flow
- Supabase Auth handles authentication (email/password).
- `DEMO_MODE = true` in App.jsx bypasses auth entirely (dev convenience).
- All protected routes are behind `ProtectedRoute` component.

---

## Database Schema (Supabase Postgres)

### Tables
| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `categories` | Material category grouping | `id` (UUID PK), `name` (UNIQUE) |
| `materials` | Raw materials catalog | `id`, `name`, `category_id` (FK), `standard_price`, `unit` |
| `products` | Finished products | `id`, `name`, `description`, `photo_url`, `overhead_percentage`, `target_margin_percentage`, `total_material_cost`, `production_cost`, `estimated_selling_price`, `gross_profit_per_unit` |
| `bill_of_materials` | Product-material link (BoM) | `id`, `product_id` (FK), `material_id` (FK), `price`, `quantity`, `subtotal` |
| `product_photos` | Multiple product images | `id`, `product_id` (FK), `photo_url`, `display_order`, `file_name`, `file_size`, `mime_type` |

### Storage
- Bucket: `product-images` (public)
- Files stored at: `products/{filename}`

### RLS Policies
- All tables: `FOR ALL USING (true)` — full public access (design choice for simplicity)

---

## Routes

| Path | Page | Purpose |
|------|------|---------|
| `/login` | Login | Auth (sign in/up) |
| `/` | Dashboard | Stats summary, recent products |
| `/categories` | Categories | CRUD categories |
| `/materials` | Materials | CRUD materials |
| `/products` | Products | Product list with search |
| `/products/new` | ProductForm | Create new product |
| `/products/:id` | ProductDetail | View product (gallery, BoM, costs) |
| `/products/:id/edit` | ProductForm | Edit product |
| `/products/copy/:id` | ProductForm | Copy product as new |
| `/price-simulation` | PriceSimulation | Standalone HPP simulation |

---

## HPP Calculation Formula

```
totalMaterialCost = sum(bom_item.price × bom_item.quantity)
productionCost = totalMaterialCost / (1 - overheadPercentage / 100)
sellingPrice = productionCost / (1 - targetMarginPercentage / 100)
grossProfit = sellingPrice - productionCost
```

Calculations are performed in:
- `supabase.js` → `db.createProduct()` / `db.updateProduct()` (server-side via API)
- `src/utils/calculations.js` → `calculateAllCosts()` (client-side preview)
- `ProductForm.jsx` → Real-time preview
- `PriceSimulation.jsx` → Simulation mode

---

## Key Components

### BottomNav (5 tabs)
Dashboard, Kategori, Material, Produk, Simulasi — fixed bottom bar for mobile.

### Toast System
Global notification system with `success()`, `error()`, `info()` functions. Auto-dismisses after 3s.

### ConfirmationDialog
Promise-based modal confirmation via `useConfirmation().confirm()`.

### Photo System
- **Legacy:** Single `photo_url` column on `products` table
- **Current:** `product_photos` table with multiple photos, display ordering, drag-reorder
- `MultiPhotoUpload` — grid upload (10 max, 2MB each)
- `ProductPhotoGallery` — carousel with lightbox, swipe, download, reorder
- Storage: Supabase Storage bucket `product-images`
- Fallback: Code handles both `product_photos` table and legacy `photo_url` column

---

## Build & Deploy

| Aspect | Detail |
|--------|--------|
| Dev server | `npm run dev` (port 3000, host: true) |
| Build | `npm run build` → `dist/` |
| Preview | `npm run preview` |
| Lint | `npm run lint` |
| Deploy target | Netlify (SPA with `/` → `/index.html` rewrite) |
| PWA | `vite-plugin-pwa` with autoUpdate registration |
| Node version | 20 |

---

## Dependencies

### Production
- `@supabase/supabase-js: ^2.47` — Database & auth
- `react + react-dom: ^18.3` — UI framework
- `react-router-dom: ^7.0` — Client-side routing
- `lucide-react: ^0.460` — Icon library
- `date-fns: ^4.1` — Date utilities
- `clsx + tailwind-merge: ^2.x` — Class utilities

### Dev
- `vite: ^6.0` — Build tool
- `tailwindcss: ^3.4` — CSS framework
- `postcss + autoprefixer` — CSS processing
- `eslint + plugins` — Linting
- `vite-plugin-pwa: ^0.21` — PWA support

---

## UI Design System
- **Theme:** Dark mode only (`bg-slate-950`)
- **Primary:** Sky blue (`#0ea5e9`) with glow effects
- **Accent colors:** Cyan, Violet, Emerald, Rose, Amber
- **Font:** Inter (Google Fonts)
- **Components:** Glass-morphism panels (`bg-slate-900/80 backdrop-blur-xl`), rounded corners (`rounded-2xl`), mobile-first (max-w-lg centering)
- **Custom classes:** `.glass-panel`, `.glass-card`, `.btn-primary`, `.btn-secondary`, `.input-field`, `.stat-card`, `.list-item`, `.modal-overlay`, `.empty-state`

---

## Notes
- Application is in Indonesian (Bahasa Indonesia)
- `DEMO_MODE = true` is set in production — no real auth enforcement
- All RLS policies are wide open (`USING (true)`) — suitable for single-tenant/internal use
- Supabase anon key is embedded in source code (not sensitive for this use case)
- Material usage calculator (`L x W x x / width`) is a Fabric cutting optimization tool
- Product copy feature (Salin) duplicates BoM and photos from source product
