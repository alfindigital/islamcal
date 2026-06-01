import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiqhAccordion } from '@/components/shared/FiqhAccordion';
import { ResultCard } from '@/components/shared/ResultCard';
import { DisclaimerFooter } from '@/components/shared/DisclaimerFooter';
import { ShareButton } from '@/components/shared/ShareButton';
import { formatIDR } from '@/utils/formatters';

const FIQH_TEXT = 'Estimasi berdasarkan BPIH (Biaya Penyelenggaraan Ibadah Haji) tahun 2025 dari Kementerian Agama RI, dengan asumsi inflasi tahunan 5%.';

type HajiType = 'reguler' | 'plus' | 'furoda';

export const BiayaHaji: React.FC<{ onNavigateTabungan?: (target: number) => void }> = ({ onNavigateTabungan }) => {
  const [tahun, setTahun] = useState(2026);
  const [tipe, setTipe] = useState<HajiType>('reguler');
  const [jumlahJamaah, setJumlahJamaah] = useState(1);

  const result = useMemo(() => {
    const baseBPIH = 55000000;
    const yearsFromNow = tahun - 2025;
    const multiplier = { reguler: 1, plus: 3.5, furoda: 6 }[tipe];
    
    const bpih = Math.round(baseBPIH * multiplier * Math.pow(1.05, yearsFromNow));
    const perlengkapan = Math.round(3000000 * Math.pow(1.03, yearsFromNow));
    const uangSaku = Math.round(5000000 * Math.pow(1.05, yearsFromNow));
    const damFidyah = 2000000;
    const totalPerOrang = bpih + perlengkapan + uangSaku + damFidyah;
    const grandTotal = totalPerOrang * jumlahJamaah;

    return { bpih, perlengkapan, uangSaku, damFidyah, totalPerOrang, grandTotal };
  }, [tahun, tipe, jumlahJamaah]);

  const years = Array.from({ length: 10 }, (_, i) => 2026 + i);

  return (
    <div>
      <p className="text-muted-foreground text-sm mb-3">Estimasi total biaya ibadah haji berdasarkan BPIH terkini.</p>
      <FiqhAccordion content={FIQH_TEXT} />

      <Card><CardContent className="pt-5 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Tahun Keberangkatan</label>
          <div className="flex flex-wrap gap-1.5">
            {years.map(y => (
              <Button key={y} variant={tahun === y ? 'default' : 'outline'} size="sm" onClick={() => setTahun(y)} className="text-xs">{y}</Button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Tipe Haji</label>
          <div className="flex flex-wrap gap-2">
            {([['reguler', 'Reguler'], ['plus', 'Plus (ONH+)'], ['furoda', 'Furoda']] as const).map(([val, label]) => (
              <Button key={val} variant={tipe === val ? 'default' : 'outline'} size="sm" className="text-xs" onClick={() => setTipe(val)}>{label}</Button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Jumlah Jamaah</label>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setJumlahJamaah(Math.max(1, jumlahJamaah - 1))} disabled={jumlahJamaah <= 1}>-</Button>
            <span className="font-semibold w-8 text-center">{jumlahJamaah}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setJumlahJamaah(Math.min(5, jumlahJamaah + 1))} disabled={jumlahJamaah >= 5}>+</Button>
          </div>
        </div>

        <ResultCard title="Estimasi Biaya">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>BPIH / Biaya Paket:</span><span className="font-semibold">{formatIDR(result.bpih)}</span></div>
            <div className="flex justify-between"><span>Perlengkapan:</span><span>{formatIDR(result.perlengkapan)}</span></div>
            <div className="flex justify-between"><span>Uang Saku:</span><span>{formatIDR(result.uangSaku)}</span></div>
            <div className="flex justify-between"><span>Dam/Fidyah Cadangan:</span><span>{formatIDR(result.damFidyah)}</span></div>
            <div className="flex justify-between text-base pt-2 border-t border-primary/20"><span className="font-semibold">Total per Orang:</span><span className="font-bold text-primary">{formatIDR(result.totalPerOrang)}</span></div>
            {jumlahJamaah > 1 && (
              <div className="flex justify-between text-base"><span className="font-semibold">Total {jumlahJamaah} Jamaah:</span><span className="font-bold text-primary">{formatIDR(result.grandTotal)}</span></div>
            )}
          </div>
          <div className="mt-3 flex gap-2 flex-wrap">
            <ShareButton getText={() => `Estimasi Biaya Haji ${tipe} ${tahun}: ${formatIDR(result.totalPerOrang)}/orang${jumlahJamaah > 1 ? ` × ${jumlahJamaah} = ${formatIDR(result.grandTotal)}` : ''}`} />
            {onNavigateTabungan && (
              <Button size="sm" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={() => onNavigateTabungan(result.grandTotal)}>
                Mulai Menabung →
              </Button>
            )}
          </div>
        </ResultCard>
      </CardContent></Card>
      <DisclaimerFooter />
    </div>
  );
};
