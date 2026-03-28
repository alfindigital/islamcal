

# Kalkulator Islami — Islamic Super Calculator

**Tagline:** "Alat Hitung Lengkap untuk Muslim Indonesia"

A comprehensive, mobile-first Islamic calculator web app for Indonesian Muslims, built entirely client-side with React and Tailwind CSS.

---

## Navigation & Layout

- **Mobile:** Bottom tab bar with category icons (💰 Keuangan, 🕋 Ibadah, 🗓️ Kalender), expanding to show sub-calculators
- **Desktop:** Left sidebar with grouped navigation, collapsible categories
- **Top bar:** App name "Kalkulator Islami" + current calculator title with subtle CSS Islamic geometric pattern
- **State-based routing** using useState (no react-router)
- Active calculator highlighted in nav

## Design System

- **Colors:** Primary emerald-600, secondary teal-700, accent amber-500, background slate-50, cards white with shadow
- **Cards:** rounded-xl, clean spacing, result cards with emerald-50 background
- **Islamic pattern:** CSS-only repeating geometric SVG on header strip
- **Number formatting:** Indonesian thousand separator (titik) for all IDR values
- **Each calculator:** 1-line description, collapsible "ℹ️ Dasar Perhitungan" fiqh accordion, animated result card, "Share Hasil" clipboard button
- **Responsive:** 1-column mobile, 2-column form+result on desktop

## Calculators

### 💰 Keuangan Islam

**1. Kalkulator Zakat Mal** — 4 sub-tabs:
- **Emas & Perak:** Input weight, toggle gold/silver, configurable price/gram, nisab check (85g gold / 595g silver), 2.5% rate
- **Uang & Tabungan:** Total savings input, nisab = 85g gold value, 2.5% rate, haul reminder
- **Perdagangan/Bisnis:** Capital + profit + receivables + stock - debts × 2.5%, nisab check
- **Pertanian:** Harvest weight, irrigation type toggle (10%/5%/7.5%), nisab 653kg gabah, output in kg + IDR

**2. Kalkulator Waris (Faraid):**
- Step 1: Estate value, debts, wasiat (auto-capped at 1/3 with warning)
- Step 2: Toggle heirs on/off with quantities (spouse, children, parents, siblings, grandparents)
- Full Syafi'i furudh calculation with ashabah, hajb blocking rules
- Awl (proportional reduction) and Radd (redistribution) handling
- Output: Summary table with fractions/percentages/IDR, donut chart visualization, 100% verification

### 🕋 Ibadah & Ritual

**3. Estimasi Biaya Haji:** Year selection (2026-2035), type (Reguler/Plus/Furoda), family size, 5% inflation compounding, cost breakdown table, CTA to savings simulator

**4. Simulasi Tabungan Haji:** Target amount (auto-fill from Haji calc), current savings, target year, instrument selection (3%/5%/6% return), PMT calculation, with/without return comparison, projected growth chart

**5. Kalkulator Qurban:** Animal type selection, patungan participants (1-7 for sapi/unta), price input with defaults, per-person cost, syarat sah checklist, timing & distribution info

**6. Kalkulator Aqiqah:** Child gender (2 or 1 sheep), number of children, price input, total cost with per-child breakdown, sunnah timing & distribution info

**7. Dzikir Counter (Tasbih Digital):**
- Large circular tap button with progress ring animation
- Preset chips: Subhanallah×33, Alhamdulillah×33, Allahu Akbar×33, Istighfar×100, Sholawat×100, Custom
- Auto-suggest next dzikir in sequence on completion
- Haptic feedback, celebration animation
- localStorage persistence: last session, lifetime total, daily streak
- Dark mode toggle for nighttime use

### 🗓️ Kalender

**8. Konverter Hijriyah ↔ Masehi:**
- Two-way tabs with Kuwaiti/Tabular algorithm (client-side)
- Hijri month dropdown (Muharram–Dzulhijjah)
- Accuracy disclaimer about sidang isbat
- Bonus: Next 5 upcoming Islamic events with Gregorian dates and countdown

## Global Features

- Fiqh disclaimer footer on every calculator
- IDR auto-formatting with titik separator
- "Share Hasil" button copies result summary to clipboard
- Smooth scroll to results after calculation
- Friendly empty state when no calculator selected
- PWA manifest.json meta tags for "Add to Home Screen"
- Syafi'i madhab as default with notes on other madhab differences where significant

