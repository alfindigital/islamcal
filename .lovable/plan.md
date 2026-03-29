

# Redesign: Mobile-First Modern Minimalis

## Ringkasan Perubahan

Redesign total layout agar mobile-first, modern, minimalis, dan mudah diakses dari HP. Menghapus sidebar desktop, mengganti navigasi menjadi single hamburger menu di footer, dan menambahkan floating settings button.

---

## 1. Font - Montserrat/Inter

**File: `index.html`**
- Tambahkan Google Fonts link untuk **Montserrat** (headings) dan **Inter** (body text)

**File: `tailwind.config.ts`**
- Set `fontFamily.sans` ke `['Inter', 'system-ui', 'sans-serif']`
- Set `fontFamily.heading` ke `['Montserrat', 'Inter', 'sans-serif']`

**File: `src/index.css`**
- Tambahkan CSS variable `--font-size-base` yang bisa di-toggle (14px / 16px / 18px) untuk fitur font size setting
- Apply `font-family` di body

---

## 2. Layout Baru - Header & Footer Sticky

**File: `src/pages/Index.tsx`** - Rewrite layout:

```text
┌──────────────────────────┐
│ HEADER (sticky top)      │
│ ☪ Kalkulator Islami      │
├──────────────────────────┤
│                          │
│   MAIN CONTENT           │
│   (scroll area)          │
│   padding-bottom untuk   │
│   footer clearance       │
│                          │
├──────────────────────────┤
│ FOOTER (sticky bottom)   │
│ [☰ Menu]           [⚙]  │
└──────────────────────────┘
```

Perubahan utama:
- **Hapus sidebar desktop** sepenuhnya - semua ukuran layar pakai layout yang sama
- **Header:** Sticky top, slim (h-12), hanya app name + active calculator title. Tidak ada hamburger di header
- **Footer:** Sticky bottom, berisi:
  - **Kiri:** Tombol hamburger menu (☰) yang membuka full-screen overlay/sheet berisi semua 8 kalkulator grouped by category
  - **Kanan:** Tombol Settings (⚙) yang membuka settings panel
- **Main content:** Scroll area antara header dan footer, dengan padding-bottom agar tidak tertutup footer

---

## 3. Mobile Menu (Hamburger di Footer)

**Tetap di `src/pages/Index.tsx`:**

Saat tombol ☰ ditekan:
- Buka **Sheet/drawer dari bawah** (gunakan komponen Sheet yang sudah ada)
- Tampilkan semua menu grouped by category:
  - 💰 Keuangan Islam: Zakat Mal, Kalkulator Waris
  - 🕋 Ibadah & Ritual: Biaya Haji, Tabungan Haji, Qurban, Aqiqah, Dzikir Counter
  - 🗓️ Kalender: Kalender Hijriyah
- Setiap item = icon + label, dalam grid layout
- Klik item = navigate + auto-close sheet
- Active item highlighted

---

## 4. Settings Panel (Tombol ⚙ di Footer Kanan)

**File baru: `src/components/shared/SettingsPanel.tsx`**

Dibuka via Sheet/drawer dari bawah saat tombol ⚙ ditekan. Berisi:

1. **Dark/Light Mode Toggle**
   - Toggle switch antara light dan dark
   - Simpan preferensi di localStorage
   - Apply class `dark` di `<html>` element

2. **Font Size**
   - 3 pilihan: Kecil (14px) / Normal (16px) / Besar (18px)
   - Simpan di localStorage
   - Apply via CSS variable `--font-size-base` di root

State management: buat hook `useSettings` yang manage dark mode + font size, persist ke localStorage.

---

## 5. CSS & Styling Updates

**File: `src/index.css`**
- Tambahkan CSS variable `--font-size-base: 16px` di `:root`
- Body: `font-size: var(--font-size-base)`
- Hapus sidebar-related CSS variables (tidak dipakai lagi)

**File: `src/App.css`**
- Bersihkan boilerplate CSS yang tidak terpakai (`#root` max-width, `.logo`, dll)

---

## Technical Details

**Files yang diubah:**
1. `index.html` - tambah Google Fonts
2. `tailwind.config.ts` - fontFamily config
3. `src/index.css` - font-size variable, body font
4. `src/App.css` - cleanup
5. `src/pages/Index.tsx` - rewrite layout (hapus sidebar, footer nav + settings button)
6. `src/components/shared/SettingsPanel.tsx` - **baru**, dark mode + font size panel
7. `src/hooks/useSettings.ts` - **baru**, localStorage-persisted settings hook

**Existing components yang TIDAK berubah:** Semua 8 calculator components, shared components (IDRInput, ResultCard, dll), UI components.

