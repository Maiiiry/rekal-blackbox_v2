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

**Tidak diperlukan untuk:**
- Perubahan class Tailwind minor (misal tambah `lg:hidden`)
- Bug fix di logic, bukan tampilan
- Responsive layout adjustments mengikuti pattern yang sudah established

---
*Updated: 2026-06-06*
