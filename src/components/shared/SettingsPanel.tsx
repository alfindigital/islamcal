import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Settings2, Sun, Moon } from 'lucide-react';
import type { FontSize } from '@/hooks/useSettings';

interface SettingsPanelProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const FONT_OPTIONS: { value: FontSize; label: string }[] = [
  { value: 'small', label: 'Kecil' },
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Besar' },
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  darkMode, toggleDarkMode, fontSize, setFontSize,
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center justify-center h-9 w-9 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all duration-200 hover:scale-105 border border-white/20 shadow-sm" aria-label="Pengaturan">
          <SlidersHorizontal className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl pb-8">
        <SheetHeader>
          <SheetTitle className="font-heading">Pengaturan</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 mt-4">
          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
              <div>
                <p className="text-sm font-medium text-foreground">Mode Gelap</p>
                <p className="text-xs text-muted-foreground">Nyaman untuk malam hari</p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
          </div>

          {/* Font Size */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Ukuran Teks</p>
            <div className="flex gap-2">
              {FONT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFontSize(opt.value)}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors border ${
                    fontSize === opt.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-foreground border-border hover:border-primary/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
