import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiqhAccordion } from '@/components/shared/FiqhAccordion';
import { ResultCard } from '@/components/shared/ResultCard';
import { DisclaimerFooter } from '@/components/shared/DisclaimerFooter';
import { ShareButton } from '@/components/shared/ShareButton';
import { IDRInput } from '@/components/shared/IDRInput';
import { formatIDR } from '@/utils/formatters';

const FIQH_TEXT = 'Simulasi ini menggunakan asumsi imbal hasil berdasarkan rata-rata historis instrumen keuangan syariah. Hasil aktual dapat berbeda.';

type Instrument = 'tabungan' | 'deposito' | 'reksadana';

export const TabunganHaji: React.FC<{ initialTarget?: number }> = ({ initialTarget }) => {
  const [target, setTarget] = useState(initialTarget || 0);
  const [terkumpul, setTerkumpul] = useState(0);
  const [tahunTarget, setTahunTarget] = useState(new Date().getFullYear() + 5);
  const [instrumen, setInstrumen] = useState<Instrument>('tabungan');

  const rateMap: Record<Instrument, number> = { tabungan: 0.03, deposito: 0.05, reksadana: 0.06 };

  const result = useMemo(() => {
    const gap = target - terkumpul;
    if (gap <= 0 || target <= 0) return null;

    const months = Math.max(1, (tahunTarget - new Date().getFullYear()) * 12);
    const monthlyRate = rateMap[instrumen] / 12;

    // PMT formula: PMT = FV * r / ((1+r)^n - 1)
    let monthlyWithReturn: number;
    if (monthlyRate > 0) {
      monthlyWithReturn = Math.ceil(gap * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1));
    } else {
      monthlyWithReturn = Math.ceil(gap / months);
    }
    const monthlyFlat = Math.ceil(gap / months);
    const totalWithReturn = monthlyWithReturn * months;
    const savings = (monthlyFlat * months) - totalWithReturn;

    // Growth data for chart (simplified, show yearly)
    const yearlyData: Array<{ year: number; cumulative: number }> = [];
    let cum = terkumpul;
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y <= tahunTarget; y++) {
      const monthsInYear = y === currentYear ? 12 : 12;
      for (let m = 0; m < monthsInYear; m++) {
        cum = cum * (1 + monthlyRate) + monthlyWithReturn;
      }
      yearlyData.push({ year: y, cumulative: Math.round(cum) });
    }

    return { gap, months, monthlyWithReturn, monthlyFlat, totalWithReturn, savings: Math.max(0, savings), yearlyData };
  }, [target, terkumpul, tahunTarget, instrumen]);

  const years = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() + 1 + i);

  return (
    <div>
      <p className="text-muted-foreground text-sm mb-3">Simulasi tabungan untuk mewujudkan impian haji/umrah Anda.</p>
      <FiqhAccordion content={FIQH_TEXT} />

      <Card><CardContent className="pt-5 space-y-4">
        <IDRInput value={target} onChange={setTarget} label="Target Biaya Total" />
        <IDRInput value={terkumpul} onChange={setTerkumpul} label="Dana yang Sudah Terkumpul" />

        <div>
          <label className="block text-sm font-medium mb-1.5">Tahun Target Berangkat</label>
          <div className="flex flex-wrap gap-1.5">
            {years.slice(0, 10).map(y => (
              <Button key={y} variant={tahunTarget === y ? 'default' : 'outline'} size="sm" onClick={() => setTahunTarget(y)} className="text-xs">{y}</Button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Instrumen</label>
          <div className="flex flex-wrap gap-2">
            {([['tabungan', 'Tab. Haji Syariah (3%/th)'], ['deposito', 'Deposito Syariah (5%/th)'], ['reksadana', 'Reksadana Syariah (6%/th)']] as const).map(([val, label]) => (
              <Button key={val} variant={instrumen === val ? 'default' : 'outline'} size="sm" className="text-xs" onClick={() => setInstrumen(val)}>{label}</Button>
            ))}
          </div>
        </div>

        {result && (
          <ResultCard title="Hasil Simulasi">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Kekurangan:</span><span className="font-semibold">{formatIDR(result.gap)}</span></div>
              <div className="flex justify-between"><span>Waktu:</span><span>{result.months} bulan</span></div>
              <div className="flex justify-between text-base pt-2 border-t border-primary/20">
                <span className="font-semibold">Tabungan/bulan (dengan return):</span>
                <span className="font-bold text-primary">{formatIDR(result.monthlyWithReturn)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tabungan/bulan (tanpa return):</span>
                <span>{formatIDR(result.monthlyFlat)}</span>
              </div>
              {result.savings > 0 && (
                <div className="flex justify-between"><span>Keuntungan dari return:</span><span className="text-primary font-semibold">{formatIDR(result.savings)}</span></div>
              )}
            </div>

            {/* Simple bar chart */}
            {result.yearlyData.length > 1 && (
              <div className="mt-4">
                <p className="text-xs font-medium mb-2 text-muted-foreground">Proyeksi Pertumbuhan</p>
                <div className="flex items-end gap-1 h-24">
                  {result.yearlyData.map((d, i) => {
                    const maxVal = Math.max(...result.yearlyData.map(x => x.cumulative), target);
                    const height = (d.cumulative / maxVal) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-primary/80 rounded-t" style={{ height: `${height}%` }} />
                        <span className="text-[10px] mt-1 text-muted-foreground">{d.year}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-dashed border-accent mt-1 relative">
                  <span className="absolute right-0 -top-3 text-[10px] text-accent font-medium">Target: {formatIDR(target)}</span>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-3">Return bersifat estimasi. Hasil aktual tergantung kinerja instrumen.</p>
            <div className="mt-3"><ShareButton getText={() => `Simulasi Tabungan Haji: Target ${formatIDR(target)}, ${result.months} bulan. Tabungan/bulan: ${formatIDR(result.monthlyWithReturn)} (${instrumen})`} /></div>
          </ResultCard>
        )}
      </CardContent></Card>
      <DisclaimerFooter />
    </div>
  );
};
