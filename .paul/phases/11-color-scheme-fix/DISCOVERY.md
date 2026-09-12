---
phase: 11-color-scheme-fix
topic: Perbaikan color scheme — audit lengkap seluruh elemen aplikasi
depth: deep
confidence: HIGH
created: 2026-09-12
---

# Discovery: Color Scheme Audit & Fix Strategy

**Recommendation:** Hybrid migration — fix missing tokens di tailwind.config + ganti semua slate classes ke Framer tokens + formalisasi semantic colors (emerald/amber)

**Confidence:** HIGH — semua temuan diverifikasi langsung dari source files

---

## Objective

Yang perlu diputuskan sebelum planning:
1. Token mana yang hilang/broken (dipakai tapi tidak ada di config)?
2. Apa mapping yang tepat dari slate → Framer tokens?
3. Bagaimana menangani semantic colors (emerald profit, amber usage badge)?
4. Pendekatan mana yang paling aman dan konsisten dengan v0.5 Framer goal?

## Scope

**Include:**
- Semua file JSX di src/pages/ dan src/components/
- tailwind.config.js (token definitions)
- src/index.css (CSS layer definitions)

**Exclude:**
- Logic/behavior code — hanya visual layer
- SidebarNav.jsx, BottomNav.jsx, WebLayout.jsx — sudah clean di Phase 07-08
- App.jsx, contexts/ — tidak ada color concerns

---

## Findings

### Kategori 1: Missing Tokens — KRITIS 🔴

Token ini **dipakai di JSX tapi tidak ada di tailwind.config.js** — Tailwind tidak generate class-nya, sehingga styling broken/invisible.

**`accent-rose`** (7 file terpengaruh)
- ConfirmationDialog.jsx: `bg-accent-rose/20`, `text-accent-rose`, `border-accent-rose/30`, `bg-accent-rose`, `hover:bg-accent-rose/90`
- Toast.jsx: `bg-accent-rose/90`
- Login.jsx: `bg-accent-rose/20`, `text-accent-rose`, `border-accent-rose/30`
- MultiPhotoUpload.jsx: `p-2 bg-accent-rose/80`, `hover:bg-accent-rose`
- ProductPhotoGallery.jsx: `bg-accent-rose`
- ProductPhotoUpload.jsx: `bg-accent-rose/80`, `hover:bg-accent-rose`
- ProductForm.jsx: `text-accent-rose`, `border-accent-rose`, `hover:bg-accent-rose/10`

**`accent-emerald`** (4 file terpengaruh)
- Toast.jsx: `bg-accent-emerald/90`
- MultiPhotoUpload.jsx: `bg-accent-emerald`
- ProductForm.jsx: `text-accent-emerald` (copy result checkmark)
- PriceSimulation.jsx: `text-accent-emerald` (harga jual highlight)

**`accent-cyan`** (2 file terpengaruh)
- ProductForm.jsx: `text-accent-cyan` (harga pabrik)
- PriceSimulation.jsx: `text-accent-cyan` (harga pabrik)

**`accent-violet`** (2 file terpengaruh)
- ProductForm.jsx: `to-accent-violet/20` (gradient card bg)
- PriceSimulation.jsx: `to-accent-violet/20` (gradient card bg)

**`primary-*` palette** (5 file terpengaruh — paling banyak)
- `primary-400`: Login.jsx, MultiPhotoUpload.jsx, ProductPhotoUpload.jsx, ProductForm.jsx, PriceSimulation.jsx
- `primary-500`: Login.jsx, MultiPhotoUpload.jsx, ProductPhotoUpload.jsx, ProductForm.jsx, PriceSimulation.jsx  
- `primary-900`: ProductForm.jsx, PriceSimulation.jsx (`from-primary-900/30`)
- `primary-300`: Login.jsx

---

### Kategori 2: Slate Classes — Sisa Design System Lama 🟡

Slate adalah design system lama (sebelum v0.5). Sudah ada Framer tokens sebagai pengganti tapi belum dimigrasikan di file-file ini.

**Files dengan slate classes terbanyak:**
- `ProductDetail.jsx` — 20+ slate instances (`bg-slate-900`, `border-slate-700`, `text-slate-400`, `text-slate-500`, `text-slate-600`, `bg-slate-800/60`)
- `PriceSimulation.jsx` — 15+ slate instances (termasuk combobox dropdown)
- `ProductForm.jsx` — 10+ slate instances (form sections, modal selector)
- `ConfirmationDialog.jsx` — 8 slate instances (`bg-slate-900`, `border-slate-700`, `border-slate-800`, `text-slate-400`, `text-slate-300`)
- `ProductPhotoGallery.jsx` — 6 slate instances (`bg-slate-800/50`, `border-slate-700`)
- `MultiPhotoUpload.jsx` — 5 slate instances
- `ProductPhotoUpload.jsx` — 3 slate instances (`bg-slate-800`, `border-slate-600`, `text-slate-500`)
- `Login.jsx` — 3 slate instances (`text-slate-400`, `text-slate-500`)

**Mapping yang diperlukan:**

| Slate Class | Framer Token Pengganti |
|-------------|----------------------|
| `bg-slate-900` | `bg-canvas` |
| `bg-slate-800` | `bg-surface-1` |
| `bg-slate-800/50` | `bg-surface-1/50` |
| `bg-slate-800/60` | `bg-surface-1/60` |
| `border-slate-700` | `border-hairline` |
| `border-slate-800` | `border-hairline-soft` |
| `border-slate-600` | `border-hairline` |
| `text-slate-300` | `text-ink` |
| `text-slate-400` | `text-ink-muted` |
| `text-slate-500` | `text-ink-muted` |
| `text-slate-600` | `text-ink-muted` (atau opacity variant) |
| `hover:bg-slate-800` | `hover:bg-surface-1` |
| `hover:bg-slate-700` | `hover:bg-surface-2` |
| `placeholder-slate-500` | `placeholder-ink-muted` |

---

### Kategori 3: Semantic Colors (Emerald/Amber) 🟡

Emerald dan amber TIDAK broken (Tailwind mengenali mereka), tapi tidak konsisten dengan Framer design system.

**Emerald (profit/positive indicators):**
- Dashboard.jsx: `text-emerald-400`, `text-emerald-500`, `bg-emerald-500`
- Products.jsx: `text-emerald-400`, `bg-emerald-500/15`
- Materials.jsx: `bg-emerald-400/15`, `text-emerald-400`
- ProductDetail.jsx: `text-emerald-400`, `border-emerald-800/40` (hero card)

Design system sudah punya `success: '#22c55e'` yang identik dengan emerald-500. ✅

**Amber (usage/warning badges):**
- Dashboard.jsx: `text-amber-400` (insight icon)
- Materials.jsx: `bg-amber-400/20`, `text-amber-400`, `border-amber-400/30`
- Categories.jsx: `bg-amber-400/20`, `text-amber-400`, `border-amber-400/30`

Design system BELUM punya warning token. Perlu ditambah. ⚠️

---

### Kategori 4: Hardcoded Colors di ProductDetail.jsx 🟡

ProductDetail.jsx adalah file dengan masalah paling beragam — campuran slate, emerald, dan hardcoded hex:

```jsx
// Hardcoded hex via style prop:
style={{ color: '#60a5fa' }}   // blue-400 — untuk harga pabrik
style={{ color: '#a78bfa' }}   // violet-400 — untuk harga marketplace
style={{ background: '#1e1b4b' }}  // indigo-950 — icon bg
style={{ background: '#052e16' }}  // emerald-950 — hero card
style={{ background: 'linear-gradient(135deg, #052e16 ...)' }}

// Tailwind blue classes:
text-blue-400, text-blue-500, bg-blue-500/10, border-blue-700/50
text-red-400, bg-red-500/10
border-b-2 border-blue-500  (loading spinner)

// Slate classes (banyak):
bg-slate-900, border-slate-700, text-slate-400, text-slate-500
text-slate-600, bg-slate-800/60, border-slate-800
```

---

### Kategori 5: Overlay/Modal Colors 🟢

Patterning overlay menggunakan `bg-black/*` — masih wajar tapi bisa distandarkan.
- ProductPhotoGallery.jsx: `bg-black/50`, `bg-black/70`, `bg-black/95`
- MultiPhotoUpload.jsx: `bg-black/50`  
- ProductPhotoUpload.jsx: `bg-black/50`
- ConfirmationDialog.jsx: `bg-black/60`

Framer design system mendefinisikan modal overlay di index.css sebagai `rgba(9,9,9,0.85)`. `bg-canvas` adalah `#090909`, sehingga `bg-canvas/85` secara semantik lebih tepat. Tapi `bg-black/*` tidak broken.

---

## Comparison

| Kriteria | Option A: Aliases Only | Option B: Full Framer | Option C: Hybrid |
|----------|----------------------|----------------------|------------------|
| Fix critical breakage | ✅ | ✅ | ✅ |
| Framer consistency | Partial | Full | 85-90% |
| Files diubah | ~2 (config only) | 12+ files | 10 files |
| Risiko regresi | Rendah | Tinggi | Medium |
| Sesuai v0.5 goal | Partial | Full | Sangat baik |
| Waktu eksekusi | ~30 menit | 3-4 jam | 2-3 jam |

**Detail tiap option:**

**Option A: Add Token Aliases Only**
- Tambah semua missing tokens ke tailwind.config (accent-rose, accent-emerald, primary palette, dll)
- Slate classes dibiarkan
- Pros: Minimal perubahan, risiko rendah
- Cons: Slate classes masih ada, tidak selesai masalah konsistensi

**Option B: Full Strict Framer Migration**
- Hapus semua slate, ganti semua ke Framer tokens
- Mapping ketat, tidak ada non-Framer color
- Pros: 100% konsisten
- Cons: Emerald/amber harus diremap (kehilangan semantic clarity), primary-900 gradients perlu design decision baru

**Option C: Hybrid (Recommended)**
1. Tambah token yang hilang ke tailwind.config:
   - `accent-rose: '#ef4444'` (alias danger)
   - `accent-emerald: '#22c55e'` (alias success)
   - `accent-cyan: '#06b6d4'` (teal baru untuk harga pabrik highlight)
   - `accent-violet: '#6a4cf5'` (alias gradient-violet)
   - `warning: '#f59e0b'` (amber — formalisasi untuk usage badges)
   - `primary` palette: `{ 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 900: '#1e3a5f' }` (temporary — akan dihapus bertahap diganti accent-blue)
2. Migrate semua slate → Framer tokens di semua file
3. Migrasi emerald → success, amber → warning
4. Fix ProductDetail hardcoded colors → proper tokens

---

## Recommendation

**Pilih: Option C (Hybrid Migration)**

**Rationale:**
- v0.5 goal adalah "total visual overhaul menggunakan Framer design system" — slate harus hilang sepenuhnya
- Missing tokens adalah BUG KRITIS yang membuat UI styling invisible — harus segera diperbaiki
- Menambah accent-rose, accent-emerald, accent-cyan, accent-violet sebagai token adalah clean karena mereka sudah punya semantic meaning yang jelas di codebase
- Primary palette boleh ditambah sementara, tapi sebagai technical debt yang di-note untuk diganti dengan accent-blue secara bertahap
- Warning token perlu ditambah karena amber digunakan secara konsisten sebagai "item dipakai/terhubung" indicator

**Urutan eksekusi yang disarankan:**
1. **tailwind.config.js** — tambah semua missing tokens (5 menit)
2. **ConfirmationDialog.jsx** — paling parah, slate everywhere (10 menit)
3. **ProductDetail.jsx** — paling kompleks, campuran slate + hardcoded (20 menit)
4. **ProductForm.jsx** — banyak slate + primary refs (20 menit)
5. **PriceSimulation.jsx** — banyak slate + primary refs (20 menit)
6. **ProductPhotoGallery.jsx** — slate + black overlays (10 menit)
7. **MultiPhotoUpload.jsx** + **ProductPhotoUpload.jsx** (10 menit)
8. **Login.jsx** — minor slate (5 menit)
9. **Toast.jsx** — minor (5 menit)
10. **Dashboard.jsx, Products.jsx, Materials.jsx, Categories.jsx** — emerald/amber migration (20 menit)

**Caveats:**
- Primary-900 gradient (`from-primary-900/30`) di ProductForm dan PriceSimulation tidak ada mapping langsung — tambahkan sementara sebagai `primary-900: '#1e3a5f'` dan jadikan backlog untuk redesign panel tersebut
- `accent-cyan` tidak ada di Framer design reference — ini adalah keputusan pragmatis agar harga pabrik punya visual distinction. Bisa di-revisit saat Phase 10 redesign
- Setelah migration selesai, primary palette bisa mulai diretire bertahap

---

## Open Questions

- Apakah `accent-cyan` (#06b6d4) cukup beda dari `accent-blue` (#0099ff) untuk visual distinction Harga Pabrik? — Impact: low (hanya estetik)
- Apakah `primary-*` palette harus langsung direplaced dengan `accent-blue` di semua tempat, atau cukup didefinisikan dulu? — Impact: medium (bisa dilakukan fase berikutnya)
- Apakah ProductDetail hero card (`linear-gradient(135deg, #052e16...)`) harus diubah ke Framer gradient violet/spotlight pattern? — Impact: medium (Phase 10 dapat address ini)

---

## Quality Report

**Sources consulted:**
- src/tailwind.config.js — diverifikasi langsung
- src/index.css — diverifikasi langsung
- src/components/ConfirmationDialog.jsx — diverifikasi langsung
- src/components/Toast.jsx — diverifikasi langsung
- src/components/MultiPhotoUpload.jsx — diverifikasi langsung
- src/components/ProductPhotoGallery.jsx — diverifikasi langsung
- src/components/ProductPhotoUpload.jsx — diverifikasi langsung
- src/pages/Login.jsx — diverifikasi langsung
- src/pages/Dashboard.jsx — diverifikasi langsung
- src/pages/Products.jsx — diverifikasi langsung
- src/pages/Materials.jsx — diverifikasi langsung
- src/pages/Categories.jsx — diverifikasi langsung
- src/pages/ProductDetail.jsx — diverifikasi langsung
- src/pages/ProductForm.jsx — diverifikasi langsung
- src/pages/PriceSimulation.jsx — diverifikasi langsung

**Verification:**
- Missing tokens: Diverifikasi — tidak ada di tailwind.config.js tapi dipakai di JSX ✅
- Slate classes: Diverifikasi di semua file yang terpengaruh ✅
- Emerald/amber usage: Diverifikasi — mereka adalah Tailwind built-in, bukan broken ✅
- Framer tokens yang ADA: canvas, surface-1, surface-2, hairline, hairline-soft, ink, ink-muted, accent-blue, gradient-violet/magenta/orange/coral, success, danger — semua confirmed di tailwind.config.js ✅

**Assumptions (not verified):**
- `accent-cyan: '#06b6d4'` diasumsikan cukup berbeda dari `accent-blue: '#0099ff'` secara visual — belum ditest di browser
- Primary palette sementara diasumsikan tidak ada dependency tersembunyi di luar src/

---
*Discovery completed: 2026-09-12*
*Confidence: HIGH*
*Ready for: /paul:plan 11-color-scheme-fix*
