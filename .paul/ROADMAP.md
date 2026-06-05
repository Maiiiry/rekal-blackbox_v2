# ROADMAP.md — ReKal Blackbox v2

> Updated: 2026-06-06

## Project Overview

**ReKal** — Aplikasi manajemen Harga Pokok Produksi (HPP) untuk industri tas dan fashion.
PWA mobile-first berbasis React + Supabase, dengan desktop mode yang sedang dikembangkan.

---

## Completed Milestones

### v0.1 — Foundation & Code Quality ✅
*Completed: 2026-06-05*

| Phase | Name | Status |
|-------|------|--------|
| 01 | code-quality | ✅ Complete |

**Outcome:** Layer utils dan supabase bersih, tidak ada duplikasi kalkulasi HPP.

### v0.2 — Web Adaptation ✅
*Completed: 2026-06-06*

| Phase | Name | Status |
|-------|------|--------|
| 02 | web-adaptation | ✅ Complete |

**Outcome:** Desktop sidebar layout aktif di ≥ 1024px via Layout Wrapper Swap. Mobile path tidak diubah.

---

## Active Milestone

### v0.3 — Desktop UI Redesign ✅
*Status: Complete — 2026-06-06*

Mendesain ulang tampilan semua halaman agar optimal di mode desktop — layout lebih lebar, informasi lebih padat, memanfaatkan ruang layar yang tersedia.

| Phase | Name | Description | Status |
|-------|------|-------------|--------|
| 03 | desktop-foundation | Lepas batasan max-w-lg di desktop, setup layout utilities | ✅ Complete |
| 04 | desktop-list-views | Redesign Dashboard, Categories, Materials, Products | ✅ Complete |
| 05 | desktop-detail-views | Redesign ProductDetail, ProductForm, PriceSimulation | ✅ Complete |

**Success criteria:**
- Semua halaman memanfaatkan lebar layar penuh di desktop (≥ 1024px)
- Layout desktop terasa native — bukan mobile yang di-stretch
- Mobile layout tetap identik dan tidak ada regresi

---

## Phase Details

### Phase 03: desktop-foundation
**Goal:** Hapus batasan `max-w-lg` dari `.page-container` khusus untuk desktop. Tanpa ini semua halaman tetap sempit di tengah meski sidebar sudah ada.

**Scope:**
- Modifikasi `.page-container` di `index.css` atau tambah override class di `WebLayout`
- Pastikan padding dan spacing nyaman di desktop
- Tidak mengubah tampilan mobile sama sekali

**Out of scope:** Redesign konten halaman (itu fase 04-05)

---

### Phase 04: desktop-list-views
**Goal:** Redesign 4 halaman list/overview untuk memanfaatkan lebar desktop.

**Pages:**
- **Dashboard** — stats grid lebih lebar, recent products multi-column
- **Categories** — table layout dengan kolom yang lebih informatif
- **Materials** — table dengan kategori, harga, satuan visible sekaligus
- **Products** — grid lebih banyak kolom, card lebih informatif

**Constraint:** Mobile layout setiap halaman tidak berubah

---

### Phase 05: desktop-detail-views
**Goal:** Redesign halaman detail dan form untuk layout two-column di desktop.

**Pages:**
- **ProductDetail** — gallery kiri + detail/BoM/cost breakdown kanan
- **ProductForm** — form fields kiri + BoM builder/preview kanan
- **PriceSimulation** — input + hasil side by side

**Constraint:** Mobile layout setiap halaman tidak berubah

---

## Completed Milestones (continued)

### v0.4 — Dashboard UI Enhancement ✅
*Completed: 2026-06-06*

Redesign visual Dashboard desktop dari awal menggunakan MCP stitch — UI lebih polished, modern, dan informatif. Mobile tidak berubah.

| Phase | Name | Description | Status |
|-------|------|-------------|--------|
| 06 | dashboard-ui-redesign | Generate ulang Dashboard desktop dengan stitch | ✅ Complete |

**Outcome:** Dashboard desktop two-column layout (left 38% sticky overview, right flex-1 scrollable). Stitch design digunakan sebagai referensi. Mobile single-column tidak berubah.

---

## Phase Details

### Phase 06: dashboard-ui-redesign
**Goal:** Generate ulang tampilan Desktop Dashboard menggunakan MCP stitch sebagai design tool, lalu implementasikan hasilnya di Dashboard.jsx.

**Scope:**
- KPI cards, financial summary, cost breakdown, insight, recent products — semua di-redesign untuk desktop
- Gunakan stitch untuk menghasilkan komponen/layout baru
- Mobile (single-column) tidak berubah sama sekali

**Constraint:** Mobile layout tidak diubah

---

## Guiding Constraints

- **Mobile-first preserved:** Perubahan desktop TIDAK boleh menyentuh behavior/tampilan mobile
- **No new dependencies:** Gunakan Tailwind breakpoints yang sudah ada (`lg:`, `xl:`)
- **Design system konsisten:** Dark mode, warna slate/primary sky, glass-morphism panels
- **Bahasa Indonesia:** Semua UI copy tetap Bahasa Indonesia
