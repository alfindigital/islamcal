import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ZakatMal } from '@/components/calculators/ZakatMal';
import { Faraid } from '@/components/calculators/Faraid';
import { BiayaHaji } from '@/components/calculators/BiayaHaji';
import { TabunganHaji } from '@/components/calculators/TabunganHaji';
import { Qurban } from '@/components/calculators/Qurban';
import { Aqiqah } from '@/components/calculators/Aqiqah';
import { DzikirCounter } from '@/components/calculators/DzikirCounter';
import { HijriConverter } from '@/components/calculators/HijriConverter';
import { SettingsPanel } from '@/components/shared/SettingsPanel';
import { useSettings } from '@/hooks/useSettings';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Calculator, BookOpen, Calendar, Heart, Coins, Users, Landmark, Menu, SunMedium, MoonStar } from 'lucide-react';
import { ZakatHistoryPanel } from '@/components/shared/ZakatHistoryPanel';
import logoImg from '@/assets/logo.png';

type CalcId = 'zakat' | 'faraid' | 'haji' | 'tabungan' | 'qurban' | 'aqiqah' | 'dzikir' | 'hijri';

interface NavItem {
  id: CalcId;
  label: string;
  icon: React.ElementType;
  category: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'zakat', label: 'Zakat Mal', icon: Coins, category: '💰 Keuangan Islam' },
  { id: 'faraid', label: 'Kalkulator Waris', icon: Users, category: '💰 Keuangan Islam' },
  { id: 'haji', label: 'Biaya Haji', icon: Landmark, category: '🕋 Ibadah & Ritual' },
  { id: 'tabungan', label: 'Tabungan Haji', icon: Calculator, category: '🕋 Ibadah & Ritual' },
  { id: 'qurban', label: 'Qurban', icon: Heart, category: '🕋 Ibadah & Ritual' },
  { id: 'aqiqah', label: 'Aqiqah', icon: BookOpen, category: '🕋 Ibadah & Ritual' },
  { id: 'dzikir', label: 'Dzikir Counter', icon: Moon, category: '🕋 Ibadah & Ritual' },
  { id: 'hijri', label: 'Kalender Hijriyah', icon: Calendar, category: '🗓️ Kalender' },
];

const CATEGORIES = ['💰 Keuangan Islam', '🕋 Ibadah & Ritual', '🗓️ Kalender'];

const TOP_NAV: CalcId[] = ['zakat', 'faraid', 'dzikir'];

const Index: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<CalcId>('zakat');
  const [menuOpen, setMenuOpen] = useState(false);
  const [tabunganTarget, setTabunganTarget] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [displayCalc, setDisplayCalc] = useState<CalcId>('zakat');
  const settings = useSettings();

  const switchCalc = useCallback((id: CalcId) => {
    if (id === activeCalc) return;
    setTransitioning(true);
    setTimeout(() => {
      setActiveCalc(id);
      setDisplayCalc(id);
      setTransitioning(false);
    }, 150);
  }, [activeCalc]);

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
    switch (displayCalc) {
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground islamic-pattern">
        <div className="flex items-center justify-between h-12 px-4 max-w-3xl mx-auto">
          <div className="flex items-center min-w-0">
            <span className="text-base font-heading font-bold tracking-tight shrink-0">☪ Kalkulator Islami</span>
            {activeItem && (
              <span className="ml-2 text-sm opacity-80 truncate hidden sm:inline">— {activeItem.label}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={settings.toggleDarkMode}
              className="relative flex items-center justify-center h-9 w-9 rounded-full bg-white/15 text-primary-foreground hover:bg-white/25 transition-all duration-200 hover:scale-110"
              aria-label={settings.darkMode ? 'Mode Terang' : 'Mode Gelap'}
            >
              {settings.darkMode ? <Sun className="h-5 w-5 transition-transform duration-300 rotate-0" /> : <Moon className="h-5 w-5 transition-transform duration-300 rotate-0" />}
              {settings.darkMode && (
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400 border border-primary"></span>
                </span>
              )}
            </button>
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
          {/* Calculator content */}
          <div
            className="transition-all duration-200 ease-out"
            style={{
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? 'translateY(8px) scale(0.97)' : 'translateY(0) scale(1)',
            }}
          >
            {activeItem && (
              <div className="mb-4 flex items-center justify-between">
                <h1 className="text-lg font-heading font-bold text-foreground">{activeItem?.label}</h1>
                {activeCalc === 'zakat' && <ZakatHistoryPanel />}
              </div>
            )}
            {renderCalculator()}
          </div>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
        <div className="flex items-center justify-center h-14 px-4 max-w-2xl mx-auto gap-2">
          {topItems.map(item => (
            <button
              key={item.id}
              onClick={() => switchCalc(item.id)}
              className={`flex flex-col items-center justify-center flex-1 max-w-[5rem] h-12 rounded-lg text-xs font-medium transition-colors ${
                activeCalc === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="mt-0.5 truncate text-[10px]">{item.label}</span>
            </button>
          ))}

          {/* Selengkapnya menu */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center flex-1 max-w-[5rem] h-12 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" aria-label="Menu selengkapnya">
                <Menu className="h-5 w-5" />
                <span className="mt-0.5 text-[10px]">Lainnya</span>
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
