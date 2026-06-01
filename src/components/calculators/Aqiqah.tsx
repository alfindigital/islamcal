import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiqhAccordion } from '@/components/shared/FiqhAccordion';
import { ResultCard } from '@/components/shared/ResultCard';
import { DisclaimerFooter } from '@/components/shared/DisclaimerFooter';
import { ShareButton } from '@/components/shared/ShareButton';
import { IDRInput } from '@/components/shared/IDRInput';
import { formatIDR } from '@/utils/formatters';

const FIQH_TEXT = 'Berdasarkan Hadits Abu Dawud & Tirmidzi dari Samurah bin Jundub. Aqiqah disunnahkan pada hari ke-7 setelah kelahiran anak.';

export const Aqiqah: React.FC = () => {
  const [jenisKelamin, setJenisKelamin] = useState<'L' | 'P'>('L');
  const [jumlahAnak, setJumlahAnak] = useState(1);
  const [hargaKambing, setHargaKambing] = useState(3500000);

  const result = useMemo(() => {
    const kambingPerAnak = jenisKelamin === 'L' ? 2 : 1;
    const totalKambing = kambingPerAnak * jumlahAnak;
    const biayaPerAnak = kambingPerAnak * hargaKambing;
    const totalBiaya = totalKambing * hargaKambing;
    return { kambingPerAnak, totalKambing, biayaPerAnak, totalBiaya };
  }, [jenisKelamin, jumlahAnak, hargaKambing]);

  return (
    <div>
      <p className="text-muted-foreground text-sm mb-3">Hitung biaya aqiqah untuk anak Anda.</p>
      <FiqhAccordion content={FIQH_TEXT} />

      <Card><CardContent className="pt-5 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Jenis Kelamin Anak</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant={jenisKelamin === 'L' ? 'default' : 'outline'} size="sm" className="flex-1 text-xs sm:text-sm" onClick={() => setJenisKelamin('L')}>Laki-laki (2 kambing)</Button>
            <Button variant={jenisKelamin === 'P' ? 'default' : 'outline'} size="sm" className="flex-1 text-xs sm:text-sm" onClick={() => setJenisKelamin('P')}>Perempuan (1 kambing)</Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Jumlah Anak</label>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setJumlahAnak(Math.max(1, jumlahAnak - 1))}>-</Button>
            <span className="font-semibold w-8 text-center">{jumlahAnak}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setJumlahAnak(Math.min(10, jumlahAnak + 1))}>+</Button>
          </div>
        </div>

        <IDRInput value={hargaKambing} onChange={setHargaKambing} label="Harga Kambing/Domba per Ekor" />

        <ResultCard title="Hasil Perhitungan">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Kambing per anak:</span><span className="font-semibold">{result.kambingPerAnak} ekor</span></div>
            <div className="flex justify-between"><span>Total kambing:</span><span className="font-semibold">{result.totalKambing} ekor</span></div>
            {jumlahAnak > 1 && <div className="flex justify-between"><span>Biaya per anak:</span><span>{formatIDR(result.biayaPerAnak)}</span></div>}
            <div className="flex justify-between text-base pt-2 border-t border-primary/20"><span className="font-semibold">Total Biaya:</span><span className="font-bold text-primary">{formatIDR(result.totalBiaya)}</span></div>
          </div>
          <div className="mt-3"><ShareButton getText={() => `Aqiqah ${jenisKelamin === 'L' ? 'laki-laki' : 'perempuan'} × ${jumlahAnak} anak: ${result.totalKambing} kambing = ${formatIDR(result.totalBiaya)}`} /></div>
        </ResultCard>

        <div className="border rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-sm">Informasi Aqiqah</h4>
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
            <li>Waktu sunnah: hari ke-7 setelah kelahiran (boleh kapan saja jika terlewat)</li>
            <li>Disunnahkan bersamaan dengan mencukur rambut dan memberi nama</li>
            <li>Distribusi daging: ⅓ keluarga, ⅓ sedekah fakir miskin, ⅓ hadiah; boleh dimasak dan diundangkan</li>
            <li>Hewan aqiqah sama syaratnya dengan hewan qurban</li>
          </ul>
        </div>
      </CardContent></Card>
      <DisclaimerFooter />
    </div>
  );
};
