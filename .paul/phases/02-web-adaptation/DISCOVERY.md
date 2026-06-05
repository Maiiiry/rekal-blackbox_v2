---
phase: 02-web-adaptation
topic: Strategi adaptasi layout web tanpa mengubah mode mobile
depth: standard
confidence: HIGH
created: 2026-06-05
---

# Discovery: Web Adaptation Mode

**Recommendation:** Gunakan **Layout Wrapper Swap** — buat `WebLayout` + `SidebarNav` baru, dan modifikasi hanya `App.jsx` untuk switch layout berdasarkan viewport. Semua page component, BottomNav, dan mobile CSS tidak disentuh sama sekali.

**Confidence:** HIGH — pola ini standard dalam React, tidak ada dependency baru, dan sepenuhnya memenuhi constraint "mobile tidak diubah".

---

## Objective

Yang perlu diputuskan sebelum planning:
- Bagaimana mendeteksi viewport (CSS breakpoint vs JS hook)?
- Di mana titik adaptasi terjadi — App.jsx, setiap page, atau komponen baru?
- Struktur layout web seperti apa (sidebar? top nav? lebar konten berapa)?
- Apakah page components perlu dimodifikasi untuk tampil baik di web?

---

## Scope

**Include:**
- Strategi layout switching (di mana dan bagaimana)
- Deteksi viewport (CSS vs JS)
- Struktur navigasi web (sidebar vs top nav)
- Lebar konten web
- Dampak terhadap page components yang ada

**Exclude:**
- Redesign visual/tema (tetap dark mode, tetap design system yang sama)
- Perubahan routing atau auth
- Fitur baru yang hanya ada di web
- Responsivitas dalam page content (tiap halaman urus sendiri di fase berikutnya)

---

## Findings

### Option A: Layout Wrapper Swap (App.jsx level)

**Sumber:** Pola standar React, tidak perlu library eksternal.

**Cara kerja:**
- Buat `useIsDesktop()` hook sederhana berbasis `window.matchMedia`
- Buat `WebLayout` component (sidebar nav + wider content area) sejajar dengan `AppLayout` yang ada
- Di `App.jsx`, tiap route memilih antara `<AppLayout>` atau `<WebLayout>` berdasarkan hook
- `BottomNav` tetap di dalam `AppLayout` — tidak disentuh
- Semua page components (`Dashboard`, `Products`, dll) tidak diubah sama sekali

**Pros:**
- **Zero touch ke mobile** — `AppLayout`, `BottomNav`, semua page tetap identik
- Tidak ada library baru
- Mudah di-debug: layout web dan mobile adalah dua path yang terpisah bersih
- `WebLayout` bisa berkembang bebas tanpa risiko regresi mobile

**Cons:**
- `App.jsx` perlu diubah (tapi ini bukan "mobile mode" — ini orchestrator)
- JS hook aktif di mobile juga (tapi tidak mengubah behavior, hanya evaluasi false)

**Untuk use case ini:** ✅ **Sangat cocok.** Titik modifikasi tunggal (App.jsx), semua mobile code tidak berubah.

---

### Option B: CSS-Only Responsive (Tailwind breakpoints)

**Sumber:** Tailwind CSS docs — responsive design via breakpoint prefix (`md:`, `lg:`).

**Cara kerja:**
- Tambah `md:hidden` ke `BottomNav`, tambah sidebar yang `hidden md:flex`
- Ubah `max-w-lg` di `.page-container` jadi `max-w-lg md:max-w-4xl`
- Modifikasi class di `AppLayout`, `BottomNav`, `index.css`

**Pros:**
- Tidak perlu JS untuk deteksi viewport
- Satu component tree yang sama

**Cons:**
- **Melanggar constraint** — harus menyentuh `BottomNav.jsx`, `index.css`, `AppLayout` di `App.jsx`
- Setiap class mobile yang diubah berpotensi regresi
- Sulit ditest: perubahan CSS bisa mempengaruhi breakpoint yang tidak terduga

**Untuk use case ini:** ❌ **Tidak cocok.** Melanggar constraint "tidak mengubah mobile mode".

---

### Option C: Parallel Entry / Route Split

**Sumber:** Multi-layout pattern via nested routing (React Router v7).

**Cara kerja:**
- Buat route structure terpisah untuk web (e.g., `/web/*` atau layout route baru)
- Mobile routes dan web routes masing-masing punya layout sendiri

**Pros:**
- Pemisahan paling bersih secara struktural

**Cons:**
- Overkill untuk kasus ini — routing duplikasi tidak perlu
- URL structure berubah (UX buruk)
- Lebih kompleks dari yang dibutuhkan

**Untuk use case ini:** ❌ **Tidak direkomendasikan.** Over-engineering.

---

## Comparison

| Kriteria | A: Layout Wrapper Swap | B: CSS-Only | C: Route Split |
|----------|------------------------|-------------|----------------|
| Mobile code tidak diubah | ✅ Ya | ❌ Harus diubah | ✅ Ya |
| Kompleksitas implementasi | Rendah | Sedang | Tinggi |
| Library baru dibutuhkan | Tidak | Tidak | Tidak |
| Risiko regresi mobile | Sangat rendah | Tinggi | Sangat rendah |
| Fleksibilitas web layout | Tinggi | Terbatas | Tinggi |
| File yang perlu dibuat | 2 baru (WebLayout, SidebarNav) | 0 | 4+ |
| File yang perlu diubah | 1 (App.jsx) | 3+ | 3+ |

---

## Recommendation

**Pilih: Option A — Layout Wrapper Swap**

**Rationale:**
App ini memiliki constraint eksplisit "tidak mengubah mobile mode sama sekali". Option A adalah satu-satunya yang memenuhi ini secara ketat: semua komponen mobile (`AppLayout`, `BottomNav`, semua page, semua CSS class) tidak disentuh. Modifikasi hanya di `App.jsx` sebagai orchestrator routing — bukan bagian dari "mobile mode".

**Implementasi konkret:**

```
src/
├── hooks/
│   └── useIsDesktop.js         ← BARU: viewport detection hook
├── components/
│   ├── WebLayout.jsx            ← BARU: web layout wrapper (sidebar + content)
│   ├── SidebarNav.jsx           ← BARU: sidebar navigation pengganti BottomNav
│   └── BottomNav.jsx            ← TIDAK DIUBAH
└── App.jsx                      ← DIUBAH: layout switching per route
```

**`useIsDesktop` hook** (minimal):
```js
// threshold: 1024px (lg breakpoint Tailwind)
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isDesktop
}
```

**WebLayout** membungkus page dengan sidebar di kiri dan konten di kanan (`max-w-7xl mx-auto`). SidebarNav menggunakan icon + label yang sama dengan BottomNav (konsisten UX).

**Caveats:**
- Page content (seperti `max-w-lg` di `.page-container`) akan tetap terpusat sempit di web kecuali fase berikutnya mengexpand layout per-page — tapi ini bisa dilakukan bertahap
- Threshold 1024px (lg) adalah safe — tidak ada tablet yang terpotong secara aneh

---

## Open Questions

- Apakah lebar konten web perlu di-expand per page (e.g., grid 2 kolom di Products)? — Impact: **medium** (bisa dilakukan di sub-fase terpisah)
- Apakah sidebar perlu collapsible/drawer di tablet (768-1023px)? — Impact: **low** (bisa ditambah belakangan)

---

## Quality Report

**Sumber yang dikonsultasi:**
- Kode langsung: `src/App.jsx`, `src/components/BottomNav.jsx`, `src/index.css`, `tailwind.config.js`, `.paul/CODEBASE.md`
- Pola arsitektur: React conditional rendering, `window.matchMedia` API (standard browser API)

**Verifikasi:**
- "BottomNav ada di AppLayout": ✓ Dikonfirmasi di `App.jsx:54` — `<BottomNav />` ada di dalam `AppLayout`
- "Semua page pakai max-w-lg": ✓ Dikonfirmasi di `index.css:68` — `.page-container { max-w-lg mx-auto }`
- "App hanya punya satu layout": ✓ Dikonfirmasi — tidak ada `WebLayout` atau responsive layout yang sudah ada
- "`window.matchMedia` tersedia di semua modern browser": ✓ Standard API, 97%+ browser support

**Asumsi (tidak diverifikasi):**
- Semua page components sudah menggunakan `.page-container` class (perlu dicek saat planning)
- Tidak ada media query override di file CSS lain

---
*Discovery selesai: 2026-06-05*
*Confidence: HIGH*
*Ready for: /paul:plan 02-web-adaptation*
