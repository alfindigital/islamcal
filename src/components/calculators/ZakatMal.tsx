import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FiqhAccordion } from '@/components/shared/FiqhAccordion';
import { ResultCard } from '@/components/shared/ResultCard';
import { DisclaimerFooter } from '@/components/shared/DisclaimerFooter';
import { ShareButton } from '@/components/shared/ShareButton';
import { IDRInput } from '@/components/shared/IDRInput';
import { formatIDR, formatNumber } from '@/utils/formatters';

const FIQH_TEXT = 'Berdasarkan QS. Al-Baqarah 267 dan At-Taubah 34. Perhitungan mengikuti rujukan fiqh Syafi\'iyah. Zakat wajib dikeluarkan jika harta mencapai nisab dan telah dimiliki selama 1 haul (1 tahun Hijriyah).';

export const ZakatMal: React.FC = () => {
  const [subTab, setSubTab] = useState('emas');
  const [tabTransitioning, setTabTransitioning] = useState(false);

  // Emas & Perak
  const [berat, setBerat] = useState(0);
  const [jenisLogam, setJenisLogam] = useState<'emas' | 'perak'>('emas');
  const [hargaEmas, setHargaEmas] = useState(1500000);
  const [hargaPerak, setHargaPerak] = useState(15000);

  // Uang
  const [totalSaldo, setTotalSaldo] = useState(0);

  // Perdagangan
  const [modalBerputar, setModalBerputar] = useState(0);
  const [keuntungan, setKeuntungan] = useState(0);
  const [piutang, setPiutang] = useState(0);
  const [stokBarang, setStokBarang] = useState(0);
  const [utangJatuhTempo, setUtangJatuhTempo] = useState(0);

  // Pertanian
  const [hasilPanen, setHasilPanen] = useState(0);
  const [jenisPengairan, setJenisPengairan] = useState<'hujan' | 'irigasi' | 'campuran'>('hujan');
  const [hargaBeras, setHargaBeras] = useState(15000);

  const nisabEmas = 85;
  const nisabPerak = 595;
  const nisabUang = useMemo(() => nisabEmas * hargaEmas, [hargaEmas]);

  const emasResult = useMemo(() => {
    const nisab = jenisLogam === 'emas' ? nisabEmas : nisabPerak;
    const harga = jenisLogam === 'emas' ? hargaEmas : hargaPerak;
    const totalNilai = berat * harga;
    const wajib = berat >= nisab;
    const zakatNominal = wajib ? totalNilai * 0.025 : 0;
    return { totalNilai, wajib, zakatNominal, nisab };
  }, [berat, jenisLogam, hargaEmas, hargaPerak]);

  const uangResult = useMemo(() => {
    const wajib = totalSaldo >= nisabUang;
    const zakatNominal = wajib ? totalSaldo * 0.025 : 0;
    return { wajib, zakatNominal, nisabUang };
  }, [totalSaldo, nisabUang]);

  const dagangResult = useMemo(() => {
    const hartaBersih = modalBerputar + keuntungan + piutang + stokBarang - utangJatuhTempo;
    const wajib = hartaBersih >= nisabUang;
    const zakatNominal = wajib ? hartaBersih * 0.025 : 0;
    return { hartaBersih, wajib, zakatNominal };
  }, [modalBerputar, keuntungan, piutang, stokBarang, utangJatuhTempo, nisabUang]);

  const taniResult = useMemo(() => {
    const nisabKg = 653;
    const rateMap = { hujan: 0.10, irigasi: 0.05, campuran: 0.075 };
    const rate = rateMap[jenisPengairan];
    const wajib = hasilPanen >= nisabKg;
    const zakatKg = wajib ? hasilPanen * rate : 0;
    const zakatIDR = zakatKg * hargaBeras;
    return { wajib, zakatKg, zakatIDR, nisabKg, rate };
  }, [hasilPanen, jenisPengairan, hargaBeras]);

  return (
    <div>
      <p className="text-muted-foreground text-sm mb-3">Hitung zakat harta Anda sesuai ketentuan syariat Islam.</p>
      <FiqhAccordion content={FIQH_TEXT} />

      <Tabs value={subTab} onValueChange={(val) => {
        setTabTransitioning(true);
        setTimeout(() => {
          setSubTab(val);
          setTabTransitioning(false);
        }, 150);
      }}>
        <TabsList className="grid grid-cols-4 w-full mb-4">
          <TabsTrigger value="emas" className="text-xs">Emas & Perak</TabsTrigger>
          <TabsTrigger value="uang" className="text-xs">Uang</TabsTrigger>
          <TabsTrigger value="dagang" className="text-xs">Bisnis</TabsTrigger>
          <TabsTrigger value="tani" className="text-xs">Pertanian</TabsTrigger>
        </TabsList>

        <div className="transition-all duration-200 ease-out" style={{ opacity: tabTransitioning ? 0 : 1, transform: tabTransitioning ? 'translateY(8px)' : 'translateY(0)' }}>
        <TabsContent value="emas">
          <Card><CardContent className="pt-5 space-y-4">
            <div className="flex gap-2">
              <Button variant={jenisLogam === 'emas' ? 'default' : 'outline'} size="sm" onClick={() => setJenisLogam('emas')}>Emas</Button>
              <Button variant={jenisLogam === 'perak' ? 'default' : 'outline'} size="sm" onClick={() => setJenisLogam('perak')}>Perak</Button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Berat (gram)</label>
              <Input type="number" value={berat || ''} onChange={e => setBerat(Number(e.target.value))} placeholder="0" inputMode="decimal" />
            </div>
            <IDRInput value={jenisLogam === 'emas' ? hargaEmas : hargaPerak} onChange={v => jenisLogam === 'emas' ? setHargaEmas(v) : setHargaPerak(v)} label={`Harga ${jenisLogam === 'emas' ? 'emas' : 'perak'} per gram`} />

            {berat > 0 && (
              <ResultCard title="Hasil Perhitungan">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Total Nilai:</span><span className="font-semibold">{formatIDR(emasResult.totalNilai)}</span></div>
                  <div className="flex justify-between"><span>Nisab ({emasResult.nisab}g):</span>
                    <span className={`font-semibold ${emasResult.wajib ? 'text-primary' : 'text-destructive'}`}>{emasResult.wajib ? '✅ Wajib Zakat' : '❌ Belum Nisab'}</span>
                  </div>
                  {emasResult.wajib && (
                    <div className="flex justify-between text-base pt-2 border-t border-primary/20"><span className="font-semibold">Zakat (2,5%):</span><span className="font-bold text-primary">{formatIDR(emasResult.zakatNominal)}</span></div>
                  )}
                </div>
                <div className="mt-3"><ShareButton getText={() => `Zakat ${jenisLogam}: ${berat}g × ${formatIDR(jenisLogam === 'emas' ? hargaEmas : hargaPerak)} = ${formatIDR(emasResult.totalNilai)}. Zakat: ${formatIDR(emasResult.zakatNominal)}`} /></div>
              </ResultCard>
            )}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="uang">
          <Card><CardContent className="pt-5 space-y-4">
            <IDRInput value={totalSaldo} onChange={setTotalSaldo} label="Total Saldo (Tabungan + Deposito + Cash + E-Wallet)" />
            <p className="text-xs text-muted-foreground">Pastikan harta sudah dimiliki selama 1 haul (1 tahun Hijriyah).</p>

            {totalSaldo > 0 && (
              <ResultCard title="Hasil Perhitungan">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Nisab (85g emas):</span><span className="font-semibold">{formatIDR(uangResult.nisabUang)}</span></div>
                  <div className="flex justify-between"><span>Status:</span>
                    <span className={`font-semibold ${uangResult.wajib ? 'text-primary' : 'text-destructive'}`}>{uangResult.wajib ? '✅ Wajib Zakat' : '❌ Belum Nisab'}</span>
                  </div>
                  {uangResult.wajib && (
                    <div className="flex justify-between text-base pt-2 border-t border-primary/20"><span className="font-semibold">Zakat (2,5%):</span><span className="font-bold text-primary">{formatIDR(uangResult.zakatNominal)}</span></div>
                  )}
                </div>
                <div className="mt-3"><ShareButton getText={() => `Zakat Uang: Saldo ${formatIDR(totalSaldo)}, Nisab ${formatIDR(uangResult.nisabUang)}. Zakat: ${formatIDR(uangResult.zakatNominal)}`} /></div>
              </ResultCard>
            )}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="dagang">
          <Card><CardContent className="pt-5 space-y-4">
            <IDRInput value={modalBerputar} onChange={setModalBerputar} label="Modal Berputar" />
            <IDRInput value={keuntungan} onChange={setKeuntungan} label="Keuntungan" />
            <IDRInput value={piutang} onChange={setPiutang} label="Piutang Dagang" />
            <IDRInput value={stokBarang} onChange={setStokBarang} label="Stok Barang" />
            <IDRInput value={utangJatuhTempo} onChange={setUtangJatuhTempo} label="Utang Jatuh Tempo (pengurang)" />

            {dagangResult.hartaBersih > 0 && (
              <ResultCard title="Hasil Perhitungan">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Harta Bersih Kena Zakat:</span><span className="font-semibold">{formatIDR(dagangResult.hartaBersih)}</span></div>
                  <div className="flex justify-between"><span>Nisab (85g emas):</span><span>{formatIDR(nisabUang)}</span></div>
                  <div className="flex justify-between"><span>Status:</span>
                    <span className={`font-semibold ${dagangResult.wajib ? 'text-primary' : 'text-destructive'}`}>{dagangResult.wajib ? '✅ Wajib Zakat' : '❌ Belum Nisab'}</span>
                  </div>
                  {dagangResult.wajib && (
                    <div className="flex justify-between text-base pt-2 border-t border-primary/20"><span className="font-semibold">Zakat (2,5%):</span><span className="font-bold text-primary">{formatIDR(dagangResult.zakatNominal)}</span></div>
                  )}
                </div>
                <div className="mt-3"><ShareButton getText={() => `Zakat Perdagangan: Harta Bersih ${formatIDR(dagangResult.hartaBersih)}. Zakat: ${formatIDR(dagangResult.zakatNominal)}`} /></div>
              </ResultCard>
            )}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="tani">
          <Card><CardContent className="pt-5 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Hasil Panen (kg)</label>
              <Input type="number" value={hasilPanen || ''} onChange={e => setHasilPanen(Number(e.target.value))} placeholder="0" inputMode="decimal" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Jenis Pengairan</label>
              <div className="flex gap-2 flex-wrap">
                {([['hujan', 'Tadah Hujan (10%)'], ['irigasi', 'Irigasi (5%)'], ['campuran', 'Campuran (7,5%)']] as const).map(([val, label]) => (
                  <Button key={val} variant={jenisPengairan === val ? 'default' : 'outline'} size="sm" onClick={() => setJenisPengairan(val)}>{label}</Button>
                ))}
              </div>
            </div>
            <IDRInput value={hargaBeras} onChange={setHargaBeras} label="Harga Beras per kg" />

            {hasilPanen > 0 && (
              <ResultCard title="Hasil Perhitungan">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Nisab (653 kg gabah):</span>
                    <span className={`font-semibold ${taniResult.wajib ? 'text-primary' : 'text-destructive'}`}>{taniResult.wajib ? '✅ Wajib Zakat' : '❌ Belum Nisab'}</span>
                  </div>
                  {taniResult.wajib && (
                    <>
                      <div className="flex justify-between"><span>Zakat ({(taniResult.rate * 100)}%):</span><span className="font-semibold">{formatNumber(Math.round(taniResult.zakatKg))} kg</span></div>
                      <div className="flex justify-between text-base pt-2 border-t border-primary/20"><span className="font-semibold">Estimasi Nilai:</span><span className="font-bold text-primary">{formatIDR(taniResult.zakatIDR)}</span></div>
                    </>
                  )}
                </div>
                <div className="mt-3"><ShareButton getText={() => `Zakat Pertanian: ${hasilPanen}kg, Pengairan: ${jenisPengairan}. Zakat: ${formatNumber(Math.round(taniResult.zakatKg))}kg (${formatIDR(taniResult.zakatIDR)})`} /></div>
              </ResultCard>
            )}
          </CardContent></Card>
        </TabsContent>
      </Tabs>
      <DisclaimerFooter />
    </div>
  );
};
