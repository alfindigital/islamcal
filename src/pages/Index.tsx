import React, { useState, useCallback } from 'react';
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
import { Calculator, BookOpen, Calendar, Heart, Moon, Coins, Users, Landmark, Menu } from 'lucide-react';

type CalcId = 'zakat' | 'faraid' | 'haji' | 'tabungan' | 'qurban' | 'aqiqah' | 'dzikir' | 'hijri' | null;

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
  const settings = useSettings();

  const navigateToTabungan = useCallback((target: number) => {
    setTabunganTarget(target);
    setActiveCalc('tabungan');
  }, []);

  const activeItem = NAV_ITEMS.find(n => n.id === activeCalc);

  const handleNavClick = (id: CalcId) => {
    setActiveCalc(id);
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
      default: return (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="text-5xl mb-4">🕌</div>
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">Kalkulator Islami</h2>
          <p className="text-sm text-muted-foreground max-w-sm">Alat Hitung Lengkap untuk Muslim Indonesia. Ketuk menu di bawah untuk memilih kalkulator.</p>
          <div className="grid grid-cols-2 gap-3 mt-8 w-full max-w-sm">
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => setActiveCalc(item.id)}
                className="flex items-center gap-3 p-3.5 rounded-xl border bg-card hover:border-primary/40 hover:shadow-md transition-all text-left">
                <item.icon className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground islamic-pattern">
        <div className="flex items-center h-12 px-4 max-w-2xl mx-auto">
          <span className="text-base font-heading font-bold tracking-tight">☪ Kalkulator Islami</span>
          {activeItem && (
            <span className="ml-2 text-sm opacity-80 truncate">— {activeItem.label}</span>
          )}
        </div>
      </header>

      {/* Scrollable Main Content */}
      <main className="flex-1 pb-20">
        <div className="max-w-2xl mx-auto p-4 sm:p-6">
          {activeItem && (
            <div className="mb-4">
              <h1 className="text-lg font-heading font-bold text-foreground">{activeItem.label}</h1>
            </div>
          )}
          {renderCalculator()}
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
        <div className="flex items-center justify-between h-14 px-4 max-w-2xl mx-auto">
          {/* Hamburger Menu */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 h-10 px-3 rounded-lg bg-muted text-foreground hover:bg-accent hover:text-accent-foreground transition-colors" aria-label="Menu">
                <Menu className="h-5 w-5" />
                <span className="text-sm font-medium">Menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl pb-8 max-h-[70vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="font-heading">Pilih Kalkulator</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 space-y-5">
                {CATEGORIES.map(cat => (
                  <div key={cat}>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">{cat}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {NAV_ITEMS.filter(n => n.category === cat).map(item => (
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
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Active calc label (center) */}
          {activeItem && (
            <span className="text-xs text-muted-foreground truncate mx-2 hidden sm:block">
              {activeItem.label}
            </span>
          )}

          {/* Settings Button */}
          <SettingsPanel
            darkMode={settings.darkMode}
            toggleDarkMode={settings.toggleDarkMode}
            fontSize={settings.fontSize}
            setFontSize={settings.setFontSize}
          />
        </div>
      </footer>
    </div>
  );
};

export default Index;
