import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DisclaimerFooter } from '@/components/shared/DisclaimerFooter';
import { formatNumber } from '@/utils/formatters';
import { RotateCcw } from 'lucide-react';

interface Preset {
  id: string;
  label: string;
  arabic?: string;
  target: number;
  nextId?: string;
}

const PRESETS: Preset[] = [
  { id: 'subhanallah', label: 'Subhanallah', arabic: 'سُبْحَانَ اللَّهِ', target: 33, nextId: 'alhamdulillah' },
  { id: 'alhamdulillah', label: 'Alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', target: 33, nextId: 'allahuakbar' },
  { id: 'allahuakbar', label: 'Allahu Akbar', arabic: 'اللَّهُ أَكْبَرُ', target: 33 },
  { id: 'istighfar', label: 'Istighfar', arabic: 'أَسْتَغْفِرُ اللَّهَ', target: 100 },
  { id: 'sholawat', label: 'Sholawat', arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', target: 100 },
];

const STORAGE_KEY = 'dzikir_data';

interface DzikirData {
  currentPresetId: string;
  currentCount: number;
  lifetimeTotal: number;
  sessionTotal: number;
  lastDate: string;
  streak: number;
  completedToday: string[];
}

function loadData(): DzikirData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { currentPresetId: '', currentCount: 0, lifetimeTotal: 0, sessionTotal: 0, lastDate: '', streak: 0, completedToday: [] };
}

function saveData(data: DzikirData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const DzikirCounter: React.FC = () => {
  const [data, setData] = useState<DzikirData>(loadData);
  const [activePreset, setActivePreset] = useState<Preset | null>(null);
  const [customTarget, setCustomTarget] = useState(100);
  const [customLabel, setCustomLabel] = useState('Custom');
  const [isCustom, setIsCustom] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { saveData(data); }, [data]);

  // Check streak
  useEffect(() => {
    if (data.lastDate && data.lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split('T')[0];
      if (data.lastDate !== yStr) {
        // Reset streak if not yesterday
        setData(prev => ({ ...prev, streak: 0, completedToday: [] }));
      } else {
        setData(prev => ({ ...prev, completedToday: [] }));
      }
    }
  }, []);

  const target = activePreset ? activePreset.target : customTarget;
  const label = activePreset ? activePreset.label : customLabel;
  const count = data.currentCount;
  const progress = Math.min(count / target, 1);

  const handleTap = useCallback(() => {
    if (completed) return;
    // Haptic
    try { navigator.vibrate?.(15); } catch {}

    const newCount = count + 1;
    const newLifetime = data.lifetimeTotal + 1;
    const newSession = data.sessionTotal + 1;
    const isComplete = newCount >= target;

    let newData = { ...data, currentCount: newCount, lifetimeTotal: newLifetime, sessionTotal: newSession, lastDate: today };

    if (isComplete) {
      // Check if full set completed
      const presetId = activePreset?.id || 'custom';
      const newCompleted = [...data.completedToday, presetId];
      newData.completedToday = newCompleted;
      const hasSet = ['subhanallah', 'alhamdulillah', 'allahuakbar'].every(id => newCompleted.includes(id));
      if (hasSet && !data.completedToday.includes('subhanallah')) {
        newData.streak = (data.streak || 0) + 1;
      }
      setCompleted(true);
    }

    setData(newData);
  }, [count, target, completed, data, activePreset, today]);

  const selectPreset = (preset: Preset) => {
    setActivePreset(preset);
    setIsCustom(false);
    setCompleted(false);
    setData(prev => ({ ...prev, currentPresetId: preset.id, currentCount: 0 }));
  };

  const selectCustom = () => {
    setActivePreset(null);
    setIsCustom(true);
    setCompleted(false);
    setData(prev => ({ ...prev, currentPresetId: 'custom', currentCount: 0 }));
  };

  const continueNext = () => {
    if (activePreset?.nextId) {
      const next = PRESETS.find(p => p.id === activePreset.nextId);
      if (next) { selectPreset(next); return; }
    }
    reset();
  };

  const reset = () => {
    setCompleted(false);
    setData(prev => ({ ...prev, currentCount: 0 }));
    setShowConfirmReset(false);
  };

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const isActive = activePreset || isCustom;

  return (
    <div ref={containerRef} className="min-h-[70vh]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-muted-foreground text-sm">Tasbih digital untuk dzikir harian Anda.</p>
        <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-4">
        <Card className="flex-1"><CardContent className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Total Dzikir</p>
          <p className="font-bold text-primary">{formatNumber(data.lifetimeTotal)}</p>
        </CardContent></Card>
        <Card className="flex-1"><CardContent className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Sesi Ini</p>
          <p className="font-bold">{formatNumber(data.sessionTotal)}</p>
        </CardContent></Card>
        <Card className="flex-1"><CardContent className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Streak</p>
          <p className="font-bold text-accent">{data.streak} 🔥</p>
        </CardContent></Card>
      </div>

      {/* Preset chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PRESETS.map(p => (
          <Button key={p.id} variant={activePreset?.id === p.id ? 'default' : 'outline'} size="sm" className="text-xs" onClick={() => selectPreset(p)}>
            {p.label} ×{p.target}
          </Button>
        ))}
        <Button variant={isCustom ? 'default' : 'outline'} size="sm" className="text-xs" onClick={selectCustom}>Custom</Button>
      </div>

      {isCustom && !activePreset && (
        <Card className="mb-4"><CardContent className="pt-4 space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1">Label</label>
            <Input value={customLabel} onChange={e => setCustomLabel(e.target.value)} placeholder="Nama dzikir" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Target</label>
            <Input type="number" value={customTarget} onChange={e => setCustomTarget(Number(e.target.value))} min={1} />
          </div>
        </CardContent></Card>
      )}

      {isActive && (
        <div className="flex flex-col items-center">
          {/* Arabic text */}
          {activePreset?.arabic && (
            <p className="text-2xl mb-2 font-semibold text-foreground/80" dir="rtl">{activePreset.arabic}</p>
          )}
          <p className="text-sm text-muted-foreground mb-4">{label}</p>

          {/* Counter circle */}
          <button
            onClick={handleTap}
            disabled={completed}
            className={`relative w-48 h-48 rounded-full flex items-center justify-center focus:outline-none select-none transition-transform active:scale-95 ${completed ? 'dzikir-complete' : ''}`}
          >
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <circle cx="80" cy="80" r={radius} fill="none" stroke={completed ? 'hsl(var(--accent))' : 'hsl(var(--primary))'} strokeWidth="8"
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                className="progress-ring-circle" />
            </svg>
            <div className="z-10 text-center">
              <span className="text-4xl font-bold text-foreground">{count}</span>
              <span className="block text-sm text-muted-foreground">{target - count > 0 ? `sisa ${target - count}` : 'Selesai!'}</span>
            </div>
          </button>

          {/* Controls */}
          <div className="flex gap-3 mt-6">
            {completed && activePreset?.nextId && (
              <Button onClick={continueNext} className="gap-2">Lanjut {PRESETS.find(p => p.id === activePreset.nextId)?.label} →</Button>
            )}
            {!showConfirmReset ? (
              <Button variant="outline" size="sm" onClick={() => setShowConfirmReset(true)}><RotateCcw className="h-4 w-4 mr-1" /> Reset</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="destructive" size="sm" onClick={reset}>Ya, Reset</Button>
                <Button variant="outline" size="sm" onClick={() => setShowConfirmReset(false)}>Batal</Button>
              </div>
            )}
          </div>
        </div>
      )}

      {!isActive && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-4xl mb-3">📿</p>
          <p>Pilih dzikir di atas untuk memulai</p>
        </div>
      )}

      <DisclaimerFooter />
    </div>
  );
};
