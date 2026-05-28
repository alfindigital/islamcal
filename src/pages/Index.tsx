import React, { useState, useCallback, lazy, Suspense, startTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '@/hooks/useSettings';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Calculator, BookOpen, Calendar, Heart, Coins, Users, Landmark, Menu, MoonStar } from 'lucide-react';

const ZakatMal = lazy(() => import('@/components/calculators/ZakatMal').then(m => ({ default: m.ZakatMal })));
const Faraid = lazy(() => import('@/components/calculators/Faraid').then(m => ({ default: m.Faraid })));
const BiayaHaji = lazy(() => import('@/components/calculators/BiayaHaji').then(m => ({ default: m.BiayaHaji })));
const TabunganHaji = lazy(() => import('@/components/calculators/TabunganHaji').then(m => ({ default: m.TabunganHaji })));
const Qurban = lazy(() => import('@/components/calculators/Qurban').then(m => ({ default: m.Qurban })));
const Aqiqah = lazy(() => import('@/components/calculators/Aqiqah').then(m => ({ default: m.Aqiqah })));
const DzikirCounter = lazy(() => import('@/components/calculators/DzikirCounter').then(m => ({ default: m.DzikirCounter })));
const HijriConverter = lazy(() => import('@/components/calculators/HijriConverter').then(m => ({ default: m.HijriConverter })));
import { SettingsPanel } from '@/components/shared/SettingsPanel';
import { ZakatHistoryPanel } from '@/components/shared/ZakatHistoryPanel';

const BrandMark: React.FC = () => (
  <span
    className="flex items-center justify-center h-9 w-9 rounded-lg bg-amber-300 shrink-0 transition-transform duration-300 ease-out hover:scale-105 motion-safe:animate-[scale-in_0.25s_ease-out]"
    style={{ contain: 'layout paint' }}
  >
    <svg viewBox="0 0 24 24" width={20} height={20} className="text-emerald-950" fill="currentColor" aria-hidden="true">
      <path d="M17.3 15.5A7 7 0 1 1 8.5 6.7a5.6 5.6 0 0 0 8.8 8.8Z" />
    </svg>
  </span>
);

type CalcId = 'zakat' | 'faraid' | 'haji' | 'tabungan' | 'qurban' | 'aqiqah' | 'dzikir' | 'hijri';

interface NavItem {
  id: CalcId;
  label: string;
  icon: React.ElementType;
  category: string;
  path: string;
  title: string;
  description: string;
}

const SITE = 'https://islamcal.lovable.app';

const NAV_ITEMS: NavItem[] = [
  { id: 'zakat', label: 'Zakat', icon: Coins, category: '💰 Keuangan Islam', path: '/zakat',
    title: 'Kalkulator Zakat Mal — Hitung Zakat 2,5% Sesuai Nisab | IslamCal',
    description: 'Hitung zakat mal otomatis berdasarkan nisab emas/perak terkini. Sertakan tabungan, emas, saham, dan piutang. Gratis, akurat, mazhab Syafi\'i.' },
  { id: 'faraid', label: 'Waris', icon: Users, category: '💰 Keuangan Islam', path: '/waris',
    title: 'Kalkulator Waris (Faraid) — Pembagian Warisan Islam | IslamCal',
    description: 'Hitung pembagian harta waris menurut hukum faraid Islam. Mendukung ahli waris istri, suami, anak, orang tua, saudara sesuai mazhab Syafi\'i.' },
  { id: 'haji', label: 'Biaya Haji', icon: Landmark, category: '🕋 Ibadah & Ritual', path: '/biaya-haji',
    title: 'Kalkulator Biaya Haji — Estimasi BPIH dengan Inflasi | IslamCal',
    description: 'Estimasi biaya haji masa depan dengan perhitungan inflasi tahunan. Pilih reguler atau plus, tentukan tahun berangkat, dan rencanakan dana.' },
  { id: 'tabungan', label: 'Tabungan Haji', icon: Calculator, category: '🕋 Ibadah & Ritual', path: '/tabungan-haji',
    title: 'Kalkulator Tabungan Haji — Simulasi Setoran Bulanan | IslamCal',
    description: 'Hitung setoran bulanan tabungan haji dengan rumus PMT. Tentukan target, jangka waktu, dan imbal hasil untuk capai biaya haji.' },
  { id: 'qurban', label: 'Qurban', icon: Heart, category: '🕋 Ibadah & Ritual', path: '/qurban',
    title: 'Kalkulator Qurban — Biaya Kambing & Sapi Patungan | IslamCal',
    description: 'Hitung biaya qurban kambing atau sapi termasuk patungan 7 orang. Lengkap dengan syarat sah hewan dan waktu penyembelihan.' },
  { id: 'aqiqah', label: 'Aqiqah', icon: BookOpen, category: '🕋 Ibadah & Ritual', path: '/aqiqah',
    title: 'Kalkulator Aqiqah — Biaya Kambing untuk Bayi | IslamCal',
    description: 'Hitung biaya aqiqah anak laki-laki (2 kambing) dan perempuan (1 kambing). Sesuai sunnah hari ke-7 kelahiran.' },
  { id: 'dzikir', label: 'Dzikir', icon: MoonStar, category: '🕋 Ibadah & Ritual', path: '/dzikir',
    title: 'Tasbih Digital — Penghitung Dzikir dengan Pengingat Harian | IslamCal',
    description: 'Tasbih digital online dengan haptic feedback, target hitungan, dan notifikasi pengingat dzikir harian. Lengkap dengan dzikir pagi & petang.' },
  { id: 'hijri', label: 'Kalender', icon: Calendar, category: '🗓️ Kalender', path: '/kalender-hijriyah',
    title: 'Konverter Kalender Hijriyah — Masehi ke Hijriyah & Hari Besar | IslamCal',
    description: 'Konversi tanggal Masehi ke Hijriyah dan sebaliknya. Lihat countdown Ramadhan, Idul Fitri, Idul Adha, dan hari besar Islam lainnya.' },
];

const TOP_NAV: CalcId[] = ['zakat', 'faraid', 'dzikir', 'hijri'];

const HOME_META = {
  title: 'IslamCal — Alat Hitung Lengkap untuk Muslim Indonesia',
  description: 'IslamCal: Zakat Mal, Waris (Faraid), Biaya Haji, Tabungan Haji, Qurban, Aqiqah, Dzikir Counter, dan Konverter Hijriyah. Gratis, offline, tanpa registrasi.',
};

const pathToCalc = (pathname: string): CalcId => {
  const item = NAV_ITEMS.find(n => n.path === pathname);
  return item?.id ?? 'zakat';
};

const Index: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const activeCalc: CalcId = pathToCalc(location.pathname);

  const [menuOpen, setMenuOpen] = useState(false);
  const [tabunganTarget, setTabunganTarget] = useState(0);
  const settings = useSettings();

  const switchCalc = useCallback((id: CalcId) => {
    const item = NAV_ITEMS.find(n => n.id === id);
    if (!item) return;
    // startTransition keeps the previous calc interactive while the new
    // chunk loads, so the tab switch never blocks the main thread.
    startTransition(() => navigate(item.path));
  }, [navigate]);

  const navigateToTabungan = useCallback((target: number) => {
    setTabunganTarget(target);
    switchCalc('tabungan');
  }, [switchCalc]);

  const activeItem = NAV_ITEMS.find(n => n.id === activeCalc);

  const handleNavClick = (id: CalcId) => {
    switchCalc(id);
    setMenuOpen(false);
  };

  const renderCalculator = () => {
    switch (activeCalc) {
      case 'zakat': return <ZakatMal />;
      case 'faraid': return <Faraid />;
      case 'haji': return <BiayaHaji onNavigateTabungan={navigateToTabungan} />;
      case 'tabungan': return <TabunganHaji initialTarget={tabunganTarget} />;
      case 'qurban': return <Qurban />;
      case 'aqiqah': return <Aqiqah />;
      case 'dzikir': return <DzikirCounter />;
      case 'hijri': return <HijriConverter />;
    }
  };

  const topItems = NAV_ITEMS.filter(n => TOP_NAV.includes(n.id));
  const moreItems = NAV_ITEMS.filter(n => !TOP_NAV.includes(n.id));

  const meta = isHome
    ? { title: HOME_META.title, description: HOME_META.description, canonical: `${SITE}/` }
    : { title: activeItem!.title, description: activeItem!.description, canonical: `${SITE}${activeItem!.path}` };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={meta.canonical} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={meta.canonical} />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
      </Helmet>

      {/* Sticky Header — clean solid emerald, no pattern noise */}
      <header className="sticky top-0 z-50 bg-[hsl(160_84%_24%)] text-white border-b border-black/10 shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_2px_8px_-2px_rgba(0,0,0,0.18)]">
        <div className="flex items-center justify-between h-14 px-4 max-w-3xl mx-auto gap-3" style={{ contain: 'layout' }}>
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <BrandMark />
            <div className="flex flex-col justify-center leading-tight min-w-0">
              <span className="brand-title font-heading font-bold tracking-tight text-[18px] sm:text-[19px] leading-[1.1] truncate">
                Islam<span className="brand-accent">Cal</span>
              </span>
              <span className="brand-tagline block text-[10px] sm:text-[11px] font-semibold tracking-[0.12em] uppercase leading-[1.3] mt-0.5 truncate">
                Alat Hitung Muslim
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <SettingsPanel
              darkMode={settings.darkMode}
              toggleDarkMode={settings.toggleDarkMode}
              fontSize={settings.fontSize}
              setFontSize={settings.setFontSize}
            />
          </div>
        </div>
      </header>

      {/* Scrollable Main Content */}
      <main className="flex-1 pb-20">
        <div className="max-w-3xl mx-auto p-4 sm:p-6">
          <div key={activeCalc} className="animate-fade-in will-change-[opacity,transform]">
            {activeItem && (
              <div className="mb-4 flex items-center justify-between gap-2">
                <h1 className="font-heading font-extrabold tracking-tight text-xl sm:text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {activeItem?.label}
                </h1>
                {activeCalc === 'zakat' && <ZakatHistoryPanel />}
              </div>
            )}
            <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted/40" />}>{renderCalculator()}</Suspense>
          </div>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur border-t border-border pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-stretch justify-center h-16 px-2 sm:px-4 max-w-2xl mx-auto gap-1 sm:gap-2">
          {topItems.map(item => {
            const isActive = activeCalc === item.id;
            return (
              <button
                key={item.id}
                onClick={() => switchCalc(item.id)}
                className={`group relative flex flex-col items-center justify-center flex-1 max-w-[6rem] rounded-lg font-semibold transition-colors duration-300 ease-out ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon
                  className={`h-[22px] w-[22px] shrink-0 transition-transform duration-300 ease-out ${
                    isActive ? 'scale-110 -translate-y-0.5' : 'group-hover:scale-105'
                  }`}
                  strokeWidth={2.25}
                />
                <span className="mt-1 truncate text-[12px] sm:text-[13px] leading-none">{item.label}</span>
                <span
                  className={`pointer-events-none absolute -top-px left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-amber-300 transition-all duration-300 ease-out ${
                    isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                  }`}
                />
              </button>
            );
          })}

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center flex-1 max-w-[6rem] rounded-lg font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" aria-label="Menu selengkapnya">
                <Menu className="h-[22px] w-[22px]" strokeWidth={2.25} />
                <span className="mt-1 text-[12px] sm:text-[13px] leading-none">Lainnya</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl pb-8 max-h-[70vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="font-heading">Kalkulator Lainnya</SheetTitle>
              </SheetHeader>
              <nav className="mt-4">
                <div className="grid grid-cols-2 gap-2">
                  {moreItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl text-sm transition-all border ${
                        activeCalc === item.id
                          ? 'bg-primary/10 border-primary/30 text-primary font-semibold'
                          : 'bg-muted/50 border-transparent text-foreground hover:border-primary/20 hover:bg-muted'
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </footer>
    </div>
  );
};

export default Index;
