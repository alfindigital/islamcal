import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center h-10 w-10 rounded-xl bg-white/15 text-white hover:bg-white/25 active:scale-95 transition-all duration-200 ring-1 ring-white/30 shadow-sm backdrop-blur-sm" aria-label="Pengaturan">
          <Settings2 className="h-[18px] w-[18px]" strokeWidth={2.4} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading">Pengaturan</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-2">
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
      </DialogContent>
    </Dialog>
  );
};
