---
phase: 09-list-views
plan: 02
status: complete
completed: 2026-06-06
---

## Goal Achieved

Products.jsx, Materials.jsx, dan Categories.jsx diupdate ke Framer design system — semua broken tokens diganti, build bersih.

## What Was Built

- `src/pages/Products.jsx` — Framer tokens applied, FAB putih (ink/canvas), card surface-1
- `src/pages/Materials.jsx` — emerald-400 icon, amber badge, form validation danger, unit selector ink
- `src/pages/Categories.jsx` — ink-muted icon, hairline table, danger error states

## Key Changes

| Element | Before | After |
|---------|--------|-------|
| FAB Products | bg-primary-600 + shadow-primary | bg-ink + text-canvas |
| Mobile card | bg-slate-900 border-slate-700 | bg-surface-1 border-hairline |
| Photo placeholder | bg-gradient slate | bg-surface-2 |
| Error states (3 files) | accent-rose | danger |
| Loading spinners | border-primary-500 | border-ink-muted |
| Table headers | text-slate-400/500 | text-ink-muted |
| Table dividers | divide-slate-800 | divide-surface-2 |
| Table row hover | hover:bg-slate-800/30 | hover:bg-surface-2/50 |
| Material icon | bg-accent-emerald/20 text-accent-emerald | bg-emerald-400/15 text-emerald-400 |
| "In use" badge | accent-amber | amber-400 |
| Category icon | bg-primary-500/20 text-primary-400 | bg-surface-2 text-ink-muted |
| Unit selector (selected) | border-primary-500 bg-primary-500/20 text-primary-400 | border-ink bg-surface-2 text-ink |
| Edit buttons | hover:text-primary-400 hover:bg-primary-500/10 | hover:text-ink hover:bg-surface-2 |
| Delete buttons | hover:text-accent-rose hover:bg-accent-rose/10 | hover:text-danger hover:bg-danger/10 |
| Form errors | border-accent-rose text-accent-rose | border-danger text-danger |

## Acceptance Criteria

- [x] AC-1: Build sukses, tidak ada broken token references di ketiga file
- [x] AC-2: Visual Framer — surface cards, ink-muted icons, FAB putih, danger error states
- [x] AC-3: Interaksi normal — search, modal, form validasi, tambah/edit/hapus

## Phase 09 Complete

Semua 4 halaman list-views (Dashboard + Products + Materials + Categories) kini menggunakan Framer design system.
