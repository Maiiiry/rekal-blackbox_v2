---
phase: 01-code-quality
plan: 02
subsystem: api
tags: [supabase, calculations, refactor, dry, dashboard]

requires:
  - phase: 01-code-quality plan 01
    provides: calculations.js bersih dengan calculateAllCostsExtended sebagai sumber kalkulasi tunggal
provides:
  - supabase.js bebas dari duplikasi kalkulasi HPP inline
  - supabase.js fallback schema logic terpusat di withPhotosOrFallback helper
  - Dashboard.jsx foto konsisten dengan sistem product_photos

affects: []

tech-stack:
  added: []
  patterns:
    - "withPhotosOrFallback: helper normalisasi product_photos untuk backward compat schema lama"
    - "calculateAllCostsExtended: satu-satunya sumber kalkulasi HPP di supabase layer"

key-files:
  created: []
  modified:
    - src/supabase.js
    - src/pages/Dashboard.jsx

key-decisions:
  - "Gunakan calculateAllCostsExtended (bukan calculateAllCosts) di supabase.js karena mencakup semua 5 field yang disimpan ke DB"
  - "IIFE di Dashboard.jsx untuk photoUrl agar tidak perlu variable hoisting di JSX"

patterns-established:
  - "Kalkulasi HPP selalu melalui calculateAllCostsExtended — jangan inline di db layer"
  - "withPhotosOrFallback dipakai untuk normalisasi semua query product yang bisa return schema lama"

duration: ~10min
started: 2026-06-04T00:00:00Z
completed: 2026-06-04T00:00:00Z
---

# Phase 1 Plan 02: supabase.js + Dashboard Refactor — Summary

**Hapus duplikasi kalkulasi HPP inline dari supabase.js, sentralisasi fallback schema ke helper, dan perbaiki foto produk di Dashboard agar konsisten dengan sistem product_photos.**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~10 menit |
| Tasks | 2/2 selesai |
| Files modified | 2 |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: createProduct/updateProduct pakai calculations.js | Pass | calculateAllCostsExtended dipanggil, kalkulasi inline dihapus |
| AC-2: Fallback logic tidak duplikat | Pass | withPhotosOrFallback helper, try/catch berkurang 7→3 |
| AC-3: Dashboard foto produk konsisten | Pass | product_photos?.[0]?.photo_url ?? photo_url |

## Accomplishments

- `createProduct` dan `updateProduct` tidak lagi menduplikat formula HPP — sepenuhnya delegasi ke `calculateAllCostsExtended`
- `getProducts` dan `getProductById` disederhanakan dari nested try/catch → linear if/throw dengan shared `withPhotosOrFallback` helper
- Dashboard.jsx menggunakan `product_photos[0]` sebagai sumber foto utama, dengan fallback ke `photo_url` legacy

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `src/supabase.js` | Modified | Import kalkulasi, refactor create/update, extract helper, simplify get |
| `src/pages/Dashboard.jsx` | Modified | Foto produk terbaru pakai product_photos[0] |

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Pakai calculateAllCostsExtended (bukan calculateAllCosts) | Extended version mencakup harga_pabrik, harga_marketplace yang disimpan ke DB | Semua 5 field terkalkulasi konsisten |
| IIFE untuk photoUrl di JSX | Menghindari perubahan struktur komponen yang lebih besar | Minimal change, sama efektif |

## Deviations from Plan

None — plan dieksekusi persis sesuai spesifikasi.

## Issues Encountered

None.

## Next Phase Readiness

**Ready:**
- Seluruh layer utils dan supabase.js sekarang bersih — satu sumber kebenaran untuk kalkulasi HPP
- Tidak ada duplikasi tersisa antara calculations.js, supabase.js

**Concerns:** None.

**Blockers:** None.

---
*Phase: 01-code-quality, Plan: 02*
*Completed: 2026-06-04*
