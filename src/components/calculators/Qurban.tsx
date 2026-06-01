import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiqhAccordion } from '@/components/shared/FiqhAccordion';
import { ResultCard } from '@/components/shared/ResultCard';
import { DisclaimerFooter } from '@/components/shared/DisclaimerFooter';
import { ShareButton } from '@/components/shared/ShareButton';
import { IDRInput } from '@/components/shared/IDRInput';
import { formatIDR } from '@/utils/formatters';

const FIQH_TEXT = 'Berdasarkan QS. Al-Hajj 34, Al-Kautsar 2, dan Hadits Muslim dari Jabir bin Abdillah. Qurban disyariatkan bagi muslim yang mampu pada hari raya Idul Adha.';

type AnimalType = 'kambing' | 'sapi';

const defaults: Record<AnimalType, number> = { kambing: 3500000, sapi: 25000000 };
const maxPeserta: Record<AnimalType, number> = { kambing: 1, sapi: 7 };

export const Qurban: React.FC = () => {
  const [jenis, setJenis] = useState<AnimalType>('kambing');
  const [peserta, setPeserta] = useState(1);
  const [harga, setHarga] = useState(defaults.kambing);

  const handleJenisChange = (j: AnimalType) => {
    setJenis(j);
    setHarga(defaults[j]);
    setPeserta(1);
  };

  const biayaPerOrang = useMemo(() => Math.round(harga / peserta), [harga, peserta]);

  return (
    <div>
      <p className="text-muted-foreground text-sm mb-3">Hitung biaya qurban dan informasi persyaratan hewan qurban.</p>
      <FiqhAccordion content={FIQH_TEXT} />

      <Card><CardContent className="pt-5 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Jenis Hewan</label>
          <div className="flex flex-wrap gap-2">
            {([['kambing', 'Kambing/Domba'], ['sapi', 'Sapi']] as const).map(([val, label]) => (
              <Button key={val} variant={jenis === val ? 'default' : 'outline'} size="sm" className="text-xs" onClick={() => handleJenisChange(val as AnimalType)}>{label}</Button>
            ))}
          </div>
        </div>

        {maxPeserta[jenis] > 1 && (
          <div>
            <label className="block text-sm font-medium mb-1.5">Jumlah Peserta Patungan</label>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPeserta(Math.max(1, peserta - 1))}>-</Button>
              <span className="font-semibold w-8 text-center">{peserta}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPeserta(Math.min(maxPeserta[jenis], peserta + 1))}>+</Button>
            </div>
          </div>
        )}

        <IDRInput value={harga} onChange={setHarga} label="Harga Hewan" />

        <ResultCard title="Biaya Qurban">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Harga Hewan:</span><span className="font-semibold">{formatIDR(harga)}</span></div>
            {peserta > 1 && <div className="flex justify-between"><span>Jumlah Peserta:</span><span>{peserta} orang</span></div>}
            <div className="flex justify-between text-base pt-2 border-t border-primary/20"><span className="font-semibold">Biaya per Orang:</span><span className="font-bold text-primary">{formatIDR(biayaPerOrang)}</span></div>
          </div>
          <div className="mt-3"><ShareButton getText={() => `Qurban ${jenis}: ${formatIDR(harga)}${peserta > 1 ? ` ÷ ${peserta} orang = ${formatIDR(biayaPerOrang)}/orang` : ''}`} /></div>
        </ResultCard>

        <div className="border rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-sm">Syarat Sah Hewan Qurban</h4>
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
            <li>Kambing/domba minimal 1 tahun (atau sudah tanggal gigi)</li>
            <li>Sapi/kerbau minimal 2 tahun</li>
            <li>Sehat, tidak cacat (buta, pincang parah, kurus, telinga/tanduk patah mayoritas)</li>
            <li>Bukan hewan yang sedang hamil</li>
          </ul>
        </div>

        <div className="border rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-sm">Waktu Penyembelihan</h4>
          <p className="text-sm text-muted-foreground">10 Dzulhijjah setelah sholat Eid — 13 Dzulhijjah sebelum Maghrib</p>
          <h4 className="font-semibold text-sm mt-3">Distribusi Sunnah</h4>
          <p className="text-sm text-muted-foreground">⅓ keluarga • ⅓ sedekah fakir miskin • ⅓ hadiah tetangga/kerabat</p>
        </div>
      </CardContent></Card>
      <DisclaimerFooter />
    </div>
  );
};
