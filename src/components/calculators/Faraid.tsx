import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FiqhAccordion } from '@/components/shared/FiqhAccordion';
import { ResultCard } from '@/components/shared/ResultCard';
import { DisclaimerFooter } from '@/components/shared/DisclaimerFooter';
import { ShareButton } from '@/components/shared/ShareButton';
import { IDRInput } from '@/components/shared/IDRInput';
import { formatIDR } from '@/utils/formatters';

const FIQH_TEXT = 'Perhitungan berdasarkan fiqh Syafi\'iyah. Kasus kompleks (wasiat wajibah, anak angkat, dzawil arham) memerlukan konsultasi ulama/pengadilan agama.';

interface Heir {
  id: string;
  name: string;
  enabled: boolean;
  count: number;
  maxCount: number;
  share: number; // fraction of total
  blocked: boolean;
  blockedBy: string;
  fraction: string;
}

export const Faraid: React.FC = () => {
  const [step, setStep] = useState(1);
  const [totalHarta, setTotalHarta] = useState(0);
  const [totalUtang, setTotalUtang] = useState(0);
  const [wasiat, setWasiat] = useState(0);
  const [wasiatWarning, setWasiatWarning] = useState('');

  const [gender, setGender] = useState<'L' | 'P'>('L'); // almarhum
  const [suami, setSuami] = useState(false);
  const [istri, setIstri] = useState(false);
  const [jumlahIstri, setJumlahIstri] = useState(1);
  const [anakL, setAnakL] = useState(0);
  const [anakP, setAnakP] = useState(0);
  const [ayah, setAyah] = useState(false);
  const [ibu, setIbu] = useState(false);
  const [saudaraL, setSaudaraL] = useState(0);
  const [saudaraP, setSaudaraP] = useState(0);
  const [kakek, setKakek] = useState(false);
  const [nenek, setNenek] = useState(false);

  const hartaBersih = useMemo(() => {
    const afterUtang = totalHarta - totalUtang;
    if (afterUtang <= 0) return 0;
    const maxWasiat = Math.floor(afterUtang / 3);
    if (wasiat > maxWasiat) {
      setWasiatWarning(`Wasiat dibatasi maksimal 1/3 harta (${formatIDR(maxWasiat)})`);
      return afterUtang - maxWasiat;
    }
    setWasiatWarning('');
    return afterUtang - wasiat;
  }, [totalHarta, totalUtang, wasiat]);

  const hasChildren = anakL > 0 || anakP > 0;
  const hasSon = anakL > 0;

  const result = useMemo(() => {
    if (hartaBersih <= 0) return null;

    const shares: Array<{ name: string; fraction: string; percentage: number; amount: number; blocked?: boolean; blockedBy?: string }> = [];
    let totalFurudh = 0;
    let ashabahHeirs: Array<{ name: string; parts: number; count: number }> = [];

    // Spouse
    if (gender === 'L' && istri) {
      // Almarhum laki-laki, ahli waris istri
      const share = hasChildren ? 1/8 : 1/4;
      const perIstri = share / jumlahIstri;
      for (let i = 0; i < jumlahIstri; i++) {
        shares.push({ name: jumlahIstri > 1 ? `Istri ${i+1}` : 'Istri', fraction: hasChildren ? `1/8 ÷ ${jumlahIstri}` : `1/4 ÷ ${jumlahIstri}`, percentage: perIstri * 100, amount: 0 });
      }
      totalFurudh += share;
    }
    if (gender === 'P' && suami) {
      const share = hasChildren ? 1/4 : 1/2;
      shares.push({ name: 'Suami', fraction: hasChildren ? '1/4' : '1/2', percentage: share * 100, amount: 0 });
      totalFurudh += share;
    }

    // Father
    const fatherBlocked = false;
    if (ayah) {
      if (hasSon) {
        // 1/6 fixed
        shares.push({ name: 'Ayah', fraction: '1/6', percentage: (1/6) * 100, amount: 0 });
        totalFurudh += 1/6;
      } else if (anakP > 0) {
        // 1/6 + ashabah
        shares.push({ name: 'Ayah', fraction: '1/6 + sisa', percentage: (1/6) * 100, amount: 0 });
        totalFurudh += 1/6;
        ashabahHeirs.push({ name: 'Ayah', parts: 1, count: 1 });
      } else {
        // ashabah
        ashabahHeirs.push({ name: 'Ayah', parts: 1, count: 1 });
      }
    }

    // Grandfather (substitute if no father)
    if (kakek && !ayah) {
      if (hasSon) {
        shares.push({ name: 'Kakek', fraction: '1/6', percentage: (1/6) * 100, amount: 0 });
        totalFurudh += 1/6;
      } else if (anakP > 0) {
        shares.push({ name: 'Kakek', fraction: '1/6 + sisa', percentage: (1/6) * 100, amount: 0 });
        totalFurudh += 1/6;
        ashabahHeirs.push({ name: 'Kakek', parts: 1, count: 1 });
      } else {
        ashabahHeirs.push({ name: 'Kakek', parts: 1, count: 1 });
      }
    } else if (kakek && ayah) {
      shares.push({ name: 'Kakek', fraction: '-', percentage: 0, amount: 0, blocked: true, blockedBy: 'Ayah' });
    }

    // Mother
    if (ibu) {
      const hasSiblings2Plus = (saudaraL + saudaraP) >= 2;
      // Umariyyatain: only spouse + both parents, no children
      const isUmariyyatain = !hasChildren && (suami || istri) && ayah && ibu && saudaraL === 0 && saudaraP === 0;
      if (isUmariyyatain) {
        // 1/3 of remainder after spouse
        const spouseShare = gender === 'P' && suami ? (1/2) : gender === 'L' && istri ? (1/4) : 0;
        const remainder = 1 - spouseShare;
        const ibuShare = remainder / 3;
        shares.push({ name: 'Ibu', fraction: '1/3 sisa', percentage: ibuShare * 100, amount: 0 });
        totalFurudh += ibuShare;
      } else if (hasChildren || hasSiblings2Plus) {
        shares.push({ name: 'Ibu', fraction: '1/6', percentage: (1/6) * 100, amount: 0 });
        totalFurudh += 1/6;
      } else {
        shares.push({ name: 'Ibu', fraction: '1/3', percentage: (1/3) * 100, amount: 0 });
        totalFurudh += 1/3;
      }
    }

    // Grandmother (substitute if no mother)
    if (nenek && !ibu) {
      shares.push({ name: 'Nenek', fraction: '1/6', percentage: (1/6) * 100, amount: 0 });
      totalFurudh += 1/6;
    } else if (nenek && ibu) {
      shares.push({ name: 'Nenek', fraction: '-', percentage: 0, amount: 0, blocked: true, blockedBy: 'Ibu' });
    }

    // Children
    if (hasSon && anakP > 0) {
      // Ashabah bi ghairih: son gets 2 parts, daughter 1 part
      const totalParts = anakL * 2 + anakP * 1;
      for (let i = 0; i < anakL; i++) ashabahHeirs.push({ name: anakL > 1 ? `Anak Laki-laki ${i+1}` : 'Anak Laki-laki', parts: 2, count: 1 });
      for (let i = 0; i < anakP; i++) ashabahHeirs.push({ name: anakP > 1 ? `Anak Perempuan ${i+1}` : 'Anak Perempuan', parts: 1, count: 1 });
    } else if (hasSon) {
      for (let i = 0; i < anakL; i++) ashabahHeirs.push({ name: anakL > 1 ? `Anak Laki-laki ${i+1}` : 'Anak Laki-laki', parts: 2, count: 1 });
    } else if (anakP > 0) {
      const share = anakP === 1 ? 1/2 : 2/3;
      const perAnak = share / anakP;
      for (let i = 0; i < anakP; i++) {
        shares.push({ name: anakP > 1 ? `Anak Perempuan ${i+1}` : 'Anak Perempuan', fraction: anakP === 1 ? '1/2' : `2/3 ÷ ${anakP}`, percentage: perAnak * 100, amount: 0 });
      }
      totalFurudh += share;
    }

    // Siblings (full siblings — blocked by son OR father in Syafi'i school)
    const siblingsBlocked = hasSon || ayah;
    const blockerName = hasSon ? 'Anak Laki-laki' : 'Ayah';
    // Special case (Syafi'i): if only daughters present (no son) and full sisters present,
    // sisters become ashabah ma'al ghair — they take the remainder, not a furudh share.
    const sistersBecomeAshabahMaalGhair = !hasSon && anakP > 0 && saudaraP > 0 && !siblingsBlocked;

    if (saudaraL > 0) {
      if (siblingsBlocked) {
        shares.push({ name: 'Saudara Laki-laki', fraction: '-', percentage: 0, amount: 0, blocked: true, blockedBy: blockerName });
      } else {
        for (let i = 0; i < saudaraL; i++) ashabahHeirs.push({ name: saudaraL > 1 ? `Saudara Laki-laki ${i+1}` : 'Saudara Laki-laki', parts: 2, count: 1 });
      }
    }
    if (saudaraP > 0) {
      if (siblingsBlocked) {
        shares.push({ name: 'Saudara Perempuan', fraction: '-', percentage: 0, amount: 0, blocked: true, blockedBy: blockerName });
      } else if (saudaraL > 0) {
        // ashabah bi ghairih (with brother): 2:1
        for (let i = 0; i < saudaraP; i++) ashabahHeirs.push({ name: saudaraP > 1 ? `Saudara Perempuan ${i+1}` : 'Saudara Perempuan', parts: 1, count: 1 });
      } else if (sistersBecomeAshabahMaalGhair) {
        // ashabah ma'al ghair (with daughter) — share remainder equally
        for (let i = 0; i < saudaraP; i++) ashabahHeirs.push({ name: saudaraP > 1 ? `Saudara Perempuan ${i+1}` : 'Saudara Perempuan', parts: 1, count: 1 });
      } else {
        const share = saudaraP === 1 ? 1/2 : 2/3;
        const perSaudari = share / saudaraP;
        for (let i = 0; i < saudaraP; i++) {
          shares.push({ name: saudaraP > 1 ? `Saudara Perempuan ${i+1}` : 'Saudara Perempuan', fraction: saudaraP === 1 ? '1/2' : `2/3 ÷ ${saudaraP}`, percentage: perSaudari * 100, amount: 0 });
        }
        totalFurudh += share;
      }
    }

    // Calculate ashabah (residual)
    let remainder = 1 - totalFurudh;
    const totalAshabahParts = ashabahHeirs.reduce((s, h) => s + h.parts, 0);
    
    let awl = false;
    let radd = false;

    if (totalFurudh > 1 && ashabahHeirs.length === 0) {
      // Awl: proportionally reduce
      awl = true;
      const factor = 1 / totalFurudh;
      shares.forEach(s => {
        if (!s.blocked) {
          s.percentage = s.percentage * factor;
        }
      });
      remainder = 0;
    }

    if (ashabahHeirs.length > 0 && remainder > 0) {
      const perPart = remainder / totalAshabahParts;
      ashabahHeirs.forEach(h => {
        shares.push({ name: h.name, fraction: 'Ashabah', percentage: perPart * h.parts * 100, amount: 0 });
      });
    } else if (ashabahHeirs.length > 0 && remainder <= 0) {
      ashabahHeirs.forEach(h => {
        shares.push({ name: h.name, fraction: 'Ashabah', percentage: 0, amount: 0 });
      });
    }

    // Radd: if no ashabah and remainder > 0
    if (ashabahHeirs.length === 0 && remainder > 0 && totalFurudh < 1) {
      radd = true;
      // Redistribute to non-spouse furudh heirs
      const nonSpouse = shares.filter(s => !s.blocked && s.name !== 'Suami' && !s.name.startsWith('Istri'));
      const spouseShares = shares.filter(s => s.name === 'Suami' || s.name.startsWith('Istri'));
      const nonSpouseTotal = nonSpouse.reduce((s, h) => s + h.percentage, 0);
      if (nonSpouseTotal > 0) {
        const factor = (nonSpouseTotal + remainder * 100) / nonSpouseTotal;
        nonSpouse.forEach(s => { s.percentage *= factor; });
      }
    }

    // Calculate amounts
    const activeShares = shares.filter(s => !s.blocked);
    activeShares.forEach(s => { s.amount = Math.round(hartaBersih * s.percentage / 100); });

    return { shares, awl, radd, hartaBersih };
  }, [hartaBersih, gender, suami, istri, jumlahIstri, anakL, anakP, ayah, ibu, saudaraL, saudaraP, kakek, nenek]);

  const colors = ['#059669', '#0d9488', '#f59e0b', '#6366f1', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316', '#06b6d4', '#84cc16', '#e11d48', '#7c3aed', '#22d3ee', '#a3e635'];

  const NumberInput: React.FC<{ value: number; onChange: (v: number) => void; max: number; label: string }> = ({ value, onChange, max, label }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onChange(Math.max(0, value - 1))} disabled={value <= 0}>-</Button>
        <span className="w-8 text-center font-semibold">{value}</span>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>+</Button>
      </div>
    </div>
  );

  const ToggleInput: React.FC<{ enabled: boolean; onChange: (v: boolean) => void; label: string }> = ({ enabled, onChange, label }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <Button variant={enabled ? 'default' : 'outline'} size="sm" onClick={() => onChange(!enabled)}>{enabled ? 'Ya' : 'Tidak'}</Button>
    </div>
  );

  return (
    <div>
      <p className="text-muted-foreground text-sm mb-3">Hitung pembagian harta waris sesuai hukum Islam (Faraid).</p>
      <FiqhAccordion content={FIQH_TEXT} />

      {step === 1 && (
        <Card><CardContent className="pt-5 space-y-4">
          <h3 className="font-semibold">Langkah 1: Data Harta</h3>
          <IDRInput value={totalHarta} onChange={setTotalHarta} label="Total Harta Peninggalan" />
          <IDRInput value={totalUtang} onChange={setTotalUtang} label="Total Utang Almarhum" />
          <IDRInput value={wasiat} onChange={setWasiat} label="Wasiat (maks 1/3 harta setelah utang)" />
          {wasiatWarning && <p className="text-xs text-destructive">{wasiatWarning}</p>}
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm font-medium">Harta Bersih:</span>
            <span className="font-bold text-primary">{formatIDR(hartaBersih)}</span>
          </div>
          <Button className="w-full" onClick={() => setStep(2)} disabled={hartaBersih <= 0}>Lanjut ke Data Ahli Waris →</Button>
        </CardContent></Card>
      )}

      {step === 2 && (
        <Card><CardContent className="pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Langkah 2: Data Ahli Waris</h3>
            <Button variant="ghost" size="sm" onClick={() => setStep(1)}>← Kembali</Button>
          </div>
          <p className="text-xs text-muted-foreground">Harta Bersih: {formatIDR(hartaBersih)}</p>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Almarhum adalah:</label>
            <div className="flex gap-2">
              <Button variant={gender === 'L' ? 'default' : 'outline'} size="sm" onClick={() => { setGender('L'); setSuami(false); }}>Laki-laki</Button>
              <Button variant={gender === 'P' ? 'default' : 'outline'} size="sm" onClick={() => { setGender('P'); setIstri(false); }}>Perempuan</Button>
            </div>
          </div>

          <div className="space-y-3 border rounded-lg p-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Pasangan</p>
            {gender === 'P' && <ToggleInput enabled={suami} onChange={setSuami} label="Suami" />}
            {gender === 'L' && (
              <>
                <ToggleInput enabled={istri} onChange={setIstri} label="Istri" />
                {istri && <NumberInput value={jumlahIstri} onChange={setJumlahIstri} max={4} label="Jumlah Istri" />}
              </>
            )}
          </div>

          <div className="space-y-3 border rounded-lg p-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Anak</p>
            <NumberInput value={anakL} onChange={setAnakL} max={20} label="Anak Laki-laki" />
            <NumberInput value={anakP} onChange={setAnakP} max={20} label="Anak Perempuan" />
          </div>

          <div className="space-y-3 border rounded-lg p-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Orang Tua</p>
            <ToggleInput enabled={ayah} onChange={setAyah} label="Ayah" />
            <ToggleInput enabled={ibu} onChange={setIbu} label="Ibu" />
          </div>

          <div className="space-y-3 border rounded-lg p-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Saudara Sekandung</p>
            <NumberInput value={saudaraL} onChange={setSaudaraL} max={10} label="Saudara Laki-laki" />
            <NumberInput value={saudaraP} onChange={setSaudaraP} max={10} label="Saudara Perempuan" />
          </div>

          <div className="space-y-3 border rounded-lg p-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Pengganti</p>
            <ToggleInput enabled={kakek} onChange={setKakek} label="Kakek (pengganti Ayah)" />
            <ToggleInput enabled={nenek} onChange={setNenek} label="Nenek (pengganti Ibu)" />
          </div>

          {result && (
            <ResultCard title="Hasil Pembagian Waris">
              {result.awl && <p className="text-xs bg-accent/20 text-accent-foreground rounded px-2 py-1 mb-3">Terjadi <strong>Awl (العول)</strong> — bagian disesuaikan proporsional karena total furudh melebihi harta.</p>}
              {result.radd && <p className="text-xs bg-accent/20 text-accent-foreground rounded px-2 py-1 mb-3">Terjadi <strong>Radd (الرد)</strong> — sisa harta didistribusikan proporsional ke ahli waris furudh.</p>}

              {/* Simple donut chart */}
              <div className="flex justify-center mb-4">
                <svg viewBox="0 0 100 100" className="w-40 h-40">
                  {(() => {
                    let cumulative = 0;
                    const activeShares = result.shares.filter(s => !s.blocked && s.percentage > 0);
                    return activeShares.map((s, i) => {
                      const pct = s.percentage / 100;
                      const dashArray = `${pct * 314.159} ${314.159}`;
                      const rotation = cumulative * 360;
                      cumulative += pct;
                      return (
                        <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={colors[i % colors.length]} strokeWidth="18"
                          strokeDasharray={dashArray} transform={`rotate(${rotation - 90} 50 50)`} className="opacity-80" />
                      );
                    });
                  })()}
                </svg>
              </div>

              {/* Mobile: stacked cards */}
              <div className="sm:hidden space-y-2">
                {result.shares.map((s, i) => (
                  <div key={i} className={`rounded-lg border p-3 ${s.blocked ? 'bg-muted/40 border-dashed' : 'bg-card'}`}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        {!s.blocked && <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />}
                        <span className={`font-semibold text-sm truncate ${s.blocked ? 'text-muted-foreground line-through' : ''}`}>{s.name}</span>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground shrink-0">{s.fraction}</span>
                    </div>
                    {s.blocked ? (
                      <p className="text-[11px] text-destructive">Terhalang oleh {s.blockedBy}</p>
                    ) : (
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs text-muted-foreground">{s.percentage.toFixed(1)}%</span>
                        <span className="font-bold text-primary text-base">{formatIDR(s.amount)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop / tablet: table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b"><th className="text-left py-1.5">Ahli Waris</th><th className="text-center">Bagian</th><th className="text-right">%</th><th className="text-right">Jumlah</th></tr>
                  </thead>
                  <tbody>
                    {result.shares.map((s, i) => (
                      <tr key={i} className={`border-b last:border-0 ${s.blocked ? 'text-muted-foreground line-through' : ''}`}>
                        <td className="py-1.5">
                          <div className="flex items-center gap-1.5">
                            {!s.blocked && <span className="w-2.5 h-2.5 rounded-full shrink-0 inline-block" style={{ backgroundColor: colors[i % colors.length] }} />}
                            <span className="truncate">{s.name}</span>
                          </div>
                          {s.blocked && <span className="text-[10px] text-destructive block">(Terhalang: {s.blockedBy})</span>}
                        </td>
                        <td className="text-center font-medium">{s.fraction}</td>
                        <td className="text-right">{s.blocked ? '-' : `${s.percentage.toFixed(1)}%`}</td>
                        <td className="text-right font-semibold whitespace-nowrap">{s.blocked ? '-' : formatIDR(s.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3"><ShareButton getText={() => {
                const lines = result.shares.filter(s => !s.blocked).map(s => `${s.name}: ${s.percentage.toFixed(1)}% = ${formatIDR(s.amount)}`);
                return `Pembagian Waris (Harta: ${formatIDR(result.hartaBersih)}):\n${lines.join('\n')}`;
              }} /></div>
            </ResultCard>
          )}
        </CardContent></Card>
      )}
      <DisclaimerFooter />
    </div>
  );
};
