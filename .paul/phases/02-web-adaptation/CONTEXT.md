---
phase: 02-web-adaptation
created: 2026-06-05
status: ready-for-planning
---

# Phase Context: 02 — Web Adaptation

## Goals

- Tampilan desktop yang proper saat aplikasi dibuka di layar ≥ 1024px
- Sidebar kiri (icon + label teks) menggantikan BottomNav di desktop
- Konten utama mengisi sisa layar lebih lebar dari versi mobile
- Di bawah 1024px: kembali otomatis ke BottomNav + mobile layout — tidak ada perubahan

## Constraints

- **Zero touch ke mobile** — semua kode mobile (`AppLayout`, `BottomNav`, semua pages, `index.css`) tidak boleh dimodifikasi
- Satu-satunya file lama yang boleh diubah: `App.jsx` (sebagai orchestrator layout)

## Approach

- **Strategi:** Layout Wrapper Swap (lihat DISCOVERY.md untuk detail)
- **Breakpoint threshold:** 1024px (Tailwind `lg`)
- **Deteksi viewport:** `useIsDesktop()` hook berbasis `window.matchMedia`
- **File baru yang dibuat:**
  - `src/hooks/useIsDesktop.js`
  - `src/components/WebLayout.jsx`
  - `src/components/SidebarNav.jsx`
- **File lama yang diubah:**
  - `src/App.jsx` — tiap route pilih `WebLayout` atau `AppLayout` berdasarkan hook

## Layout Web

- Sidebar lebar standar (~240px) di kiri, fixed, dengan icon + label
- Konten utama mengisi sisa layar (sidebar kiri, konten kanan)
- Lebar konten: `max-w-7xl` atau full-width dengan padding yang nyaman

## Out of Scope

- Layout per-halaman khusus desktop (grid produk lebih banyak kolom, tabel Materials lebih lebar, dll) — fase berikutnya jika diperlukan
- Perubahan tema, warna, atau design system
- Perubahan routing atau auth

## Reference

- DISCOVERY.md — analisis teknis lengkap dan perbandingan opsi
