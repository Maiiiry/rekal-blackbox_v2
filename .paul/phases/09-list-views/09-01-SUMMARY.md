---
phase: 09-list-views
plan: 01
status: complete
completed: 2026-06-06
---

## Goal Achieved

Dashboard.jsx diupdate ke Framer aesthetic — semua broken tokens diganti, violet spotlight aktif di KPI Rata-rata Laba.

## What Was Built

- `.stitch/designs/dashboard-framer-reference.html` + `.png` — visual reference dari screen "ReKal Business Dashboard"
- `src/pages/Dashboard.jsx` — className-only update, semua Framer tokens applied

## Changes Made

| Element | Before | After |
|---------|--------|-------|
| Logo wrapper | bg-gradient blue-violet + shadow-glow | bg-surface-2 |
| Error card | border-accent-rose/30 | border-danger/30 |
| KPI icons (Produk, Kategori) | text-primary-400 | text-ink-muted |
| KPI icon (Material) | text-accent-emerald | text-emerald-400 |
| Rata-rata Laba card | border-emerald-500/30 bg-emerald-500/5 | VIOLET SPOTLIGHT rgba(106,76,245,0.1) |
| Insight Bisnis card | border-primary-500/20 bg-primary-500/5 | plain glass-panel |
| Text labels | text-slate-300/400/500 | text-ink / text-ink-muted |
| Progress tracks | bg-slate-800 | bg-surface-2 |
| HPP bar fill | bg-slate-500 | bg-ink-muted |
| Divider | h-px bg-slate-800 | h-px bg-hairline |
| Margin value | text-accent-cyan | text-success |
| "Lihat Semua" link | text-primary-400 | text-accent-blue |
| Loading spinner | border-primary-500 | border-ink-muted |
| Photo placeholder | bg-gradient-to-br from-primary-500/20 | bg-surface-2 |
| Product price | text-accent-emerald | text-emerald-400 |

## Acceptance Criteria

- [x] AC-1: Build sukses, tidak ada reference ke primary-*, accent-violet/emerald/cyan/rose, shadow-glow
- [x] AC-2: Dashboard visual Framer — canvas bg, surface-1 cards, violet spotlight KPI, ink hierarchy
- [x] AC-3: Data/logic tidak berubah — hanya className

## Decisions

- Rata-rata Laba card: inline style `rgba(106,76,245,0.1)` bukan Tailwind class karena tidak ada utility class untuk nilai ini
- Stitch MCP timeout saat generate — menggunakan download dari screen existing "ReKal Business Dashboard" sebagai reference

## Next

Plan 09-02: Products.jsx, Materials.jsx, Categories.jsx — Framer token cleanup + charcoal card grid
