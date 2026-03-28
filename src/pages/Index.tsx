import React, { useState, useCallback } from 'react';
import { ZakatMal } from '@/components/calculators/ZakatMal';
import { Faraid } from '@/components/calculators/Faraid';
import { BiayaHaji } from '@/components/calculators/BiayaHaji';
import { TabunganHaji } from '@/components/calculators/TabunganHaji';
import { Qurban } from '@/components/calculators/Qurban';
import { Aqiqah } from '@/components/calculators/Aqiqah';
import { DzikirCounter } from '@/components/calculators/DzikirCounter';
import { HijriConverter } from '@/components/calculators/HijriConverter';
import { Button } from '@/components/ui/button';
import { Calculator, BookOpen, Calendar, Heart, Moon, Coins, Users, Landmark, Wheat, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

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
const CAT_ICONS = { '💰 Keuangan Islam': Coins, '🕋 Ibadah & Ritual': Landmark, '🗓️ Kalender': Calendar };

const Index: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<CalcId>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tabunganTarget, setTabunganTarget] = useState(0);
  const [mobileMenuCat, setMobileMenuCat] = useState<string | null>(null);

  const navigateToTabungan = useCallback((target: number) => {
    setTabunganTarget(target);
    setActiveCalc('tabungan');
  }, []);

  const activeItem = NAV_ITEMS.find(n => n.id === activeCalc);

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
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">🕌</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Kalkulator Islami</h2>
          <p className="text-muted-foreground max-w-md">Alat Hitung Lengkap untuk Muslim Indonesia. Pilih kalkulator dari menu untuk memulai.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 max-w-lg">
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => setActiveCalc(item.id)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-card hover:border-primary/40 hover:shadow-md transition-all">
                <item.icon className="h-6 w-6 text-primary" />
                <span className="text-xs font-medium text-foreground">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground islamic-pattern">
        <div className="flex items-center h-14 px-4">
          <button className="lg:hidden mr-3" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-lg font-bold">☪ Kalkulator Islami</span>
            {activeItem && <span className="hidden sm:inline text-sm opacity-80">— {activeItem.label}</span>}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:block ${sidebarOpen ? 'w-64' : 'w-16'} border-r bg-card transition-all duration-300 min-h-[calc(100vh-3.5rem)] sticky top-14`}>
          <div className="flex justify-end p-2">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="h-8 w-8">
              {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
          <nav className="px-2 space-y-1">
            {CATEGORIES.map(cat => (
              <div key={cat}>
                {sidebarOpen && <p className="text-xs font-semibold text-muted-foreground uppercase px-3 pt-4 pb-1">{cat}</p>}
                {NAV_ITEMS.filter(n => n.category === cat).map(item => (
                  <button key={item.id} onClick={() => setActiveCalc(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${activeCalc === item.id ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:bg-muted'}`}>
                    <item.icon className="h-4 w-4 shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 pb-24 lg:pb-8">
          <div className="max-w-2xl mx-auto p-4 sm:p-6">
            {activeItem && (
              <div className="mb-4">
                <h1 className="text-xl font-bold text-foreground">{activeItem.label}</h1>
              </div>
            )}
            {renderCalculator()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50">
        {mobileMenuCat ? (
          <div className="p-2">
            <div className="flex items-center justify-between px-2 mb-1">
              <span className="text-xs font-semibold text-muted-foreground">{mobileMenuCat}</span>
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setMobileMenuCat(null)}>✕</Button>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {NAV_ITEMS.filter(n => n.category === mobileMenuCat).map(item => (
                <button key={item.id} onClick={() => { setActiveCalc(item.id); setMobileMenuCat(null); }}
                  className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs ${activeCalc === item.id ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground'}`}>
                  <item.icon className="h-4 w-4" />
                  <span className="truncate w-full text-center">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-around py-2">
            {CATEGORIES.map(cat => {
              const CatIcon = CAT_ICONS[cat as keyof typeof CAT_ICONS];
              const isActive = activeItem && activeItem.category === cat;
              return (
                <button key={cat} onClick={() => setMobileMenuCat(cat)}
                  className={`flex flex-col items-center gap-1 px-4 py-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  <CatIcon className="h-5 w-5" />
                  <span className="text-[10px] font-medium">{cat.replace(/[💰🕋🗓️ ]/g, '').trim()}</span>
                </button>
              );
            })}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Index;
