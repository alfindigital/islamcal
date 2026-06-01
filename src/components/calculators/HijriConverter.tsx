import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResultCard } from '@/components/shared/ResultCard';
import { DisclaimerFooter } from '@/components/shared/DisclaimerFooter';
import { gregorianToHijri, hijriToGregorian, HIJRI_MONTHS, getUpcomingEvents } from '@/utils/hijri';

export const HijriConverter: React.FC = () => {
  const [tab, setTab] = useState('mToH');

  // Masehi to Hijri
  const [gDay, setGDay] = useState(new Date().getDate());
  const [gMonth, setGMonth] = useState(new Date().getMonth() + 1);
  const [gYear, setGYear] = useState(new Date().getFullYear());

  // Hijri to Masehi
  const [hDay, setHDay] = useState(1);
  const [hMonth, setHMonth] = useState(1);
  const [hYear, setHYear] = useState(1447);

  const mToHResult = useMemo(() => {
    if (gYear < 1 || gMonth < 1 || gMonth > 12 || gDay < 1 || gDay > 31) return null;
    return gregorianToHijri(gYear, gMonth, gDay);
  }, [gDay, gMonth, gYear]);

  const hToMResult = useMemo(() => {
    if (hYear < 1 || hMonth < 1 || hMonth > 12 || hDay < 1 || hDay > 30) return null;
    return hijriToGregorian(hYear, hMonth, hDay);
  }, [hDay, hMonth, hYear]);

  const upcomingEvents = useMemo(() => getUpcomingEvents(5), []);

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  return (
    <div>
      <p className="text-muted-foreground text-sm mb-3">Konversi tanggal antara kalender Hijriyah dan Masehi.</p>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="mToH">Masehi → Hijriyah</TabsTrigger>
          <TabsTrigger value="hToM">Hijriyah → Masehi</TabsTrigger>
        </TabsList>

        <TabsContent value="mToH">
          <Card><CardContent className="pt-5 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium block mb-1">Tanggal</label>
                <Input type="number" value={gDay} onChange={e => setGDay(Number(e.target.value))} min={1} max={31} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Bulan</label>
                <Input type="number" value={gMonth} onChange={e => setGMonth(Number(e.target.value))} min={1} max={12} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Tahun</label>
                <Input type="number" value={gYear} onChange={e => setGYear(Number(e.target.value))} />
              </div>
            </div>

            {mToHResult && (
              <ResultCard>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Tanggal Hijriyah:</p>
                  <p className="text-2xl font-bold text-primary">{mToHResult.day} {mToHResult.monthName} {mToHResult.year}H</p>
                </div>
              </ResultCard>
            )}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="hToM">
          <Card><CardContent className="pt-5 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium block mb-1">Tanggal</label>
                <Input type="number" value={hDay} onChange={e => setHDay(Number(e.target.value))} min={1} max={30} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Bulan</label>
                <select value={hMonth} onChange={e => setHMonth(Number(e.target.value))} className="w-full h-10 rounded-md border border-input bg-background px-2 text-sm">
                  {HIJRI_MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Tahun H</label>
                <Input type="number" value={hYear} onChange={e => setHYear(Number(e.target.value))} />
              </div>
            </div>

            {hToMResult && (
              <ResultCard>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Tanggal Masehi:</p>
                  <p className="text-2xl font-bold text-primary">{hToMResult.day} {monthNames[hToMResult.month - 1]} {hToMResult.year}</p>
                </div>
              </ResultCard>
            )}
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground mt-3 mb-4 px-1">Kalender Hijriyah bersifat estimasi astronomis. Untuk kepastian awal bulan, rujuk hasil sidang isbat Kemenag RI.</p>

      {/* Upcoming events */}
      <Card>
        <CardContent className="pt-5">
          <h3 className="font-semibold text-sm mb-3">Hari-Hari Penting Islam Terdekat</h3>
          <div className="space-y-3">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{event.name}</p>
                  <p className="text-xs text-muted-foreground">{event.hijriDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {event.gregorianDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    {event.daysUntil === 0 ? 'Hari ini!' : `${event.daysUntil} hari lagi`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <DisclaimerFooter />
    </div>
  );
};
