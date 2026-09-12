# SPECIAL-FLOWS.md — Specialized Workflow Registry

Daftar skills yang harus dimuat sebelum eksekusi APPLY untuk work type tertentu.

---

## UI Generation / Visual Design

| Skill | Priority | Work Type | When to Invoke |
|-------|----------|-----------|----------------|
| `stitch-design` | required | UI component creation, visual redesign | Sebelum task yang membuat atau mengubah tampilan komponen UI |

**Scope:**
- Membuat komponen UI baru dari scratch
- Redesign visual signifikan (layout, color, typography)
- Design system changes
- **v0.5 Framer redesign: SETIAP fase visual wajib Stitch** — generate reference screen per halaman/komponen sebelum implementasi JSX

**Tidak diperlukan untuk:**
- Perubahan class Tailwind minor (misal tambah `lg:hidden`)
- Bug fix di logic, bukan tampilan
- Responsive layout adjustments mengikuti pattern yang sudah established

---

## Framer Design System Reference

**File:** `awesome-design-md/design-md/framer/DESIGN.md`

**Token summary (untuk prompt Stitch):**
- Canvas: `#090909` (near-pure black)
- Surface-1: `#141414` (cards, secondary buttons)
- Surface-2: `#1c1c1c` (featured cards, selected states)
- Ink: `#ffffff` | Ink-muted: `#999999`
- Accent-blue: `#0099ff` (hyperlinks, focus rings ONLY)
- Gradient spotlight: violet `#6a4cf5`, magenta `#d44df0`, orange `#ff7a3d`, coral `#ff5577`
- Success: `#22c55e`
- Font: Inter Variable + OpenType (cv01, cv05, cv09, cv11, ss03, ss07)
- Border radius: pill `100px` CTAs, xl `20px` cards, xxl `30px` gradient cards
- CTAs: white pill primary, charcoal pill secondary — NO ghost buttons, NO colored fills

---
*Updated: 2026-06-06*
