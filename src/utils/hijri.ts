// Kuwaiti/Tabular Islamic calendar algorithm (client-side)

const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir',
  'Jumadil Awal', 'Jumadil Akhir', 'Rajab', 'Sya\'ban',
  'Ramadhan', 'Syawal', 'Dzulqa\'dah', 'Dzulhijjah'
];

export { HIJRI_MONTHS };

// Gregorian to Julian Day Number
function gregorianToJD(year: number, month: number, day: number): number {
  if (month <= 2) { year--; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Julian Day Number to Gregorian
function jdToGregorian(jd: number): { year: number; month: number; day: number } {
  const z = Math.floor(jd + 0.5);
  const a = Math.floor((z - 1867216.25) / 36524.25);
  const A = z + 1 + a - Math.floor(a / 4);
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);
  const day = B - D - Math.floor(30.6001 * E);
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;
  return { year, month, day };
}

// Hijri to Julian Day Number (Kuwaiti algorithm)
function hijriToJD(year: number, month: number, day: number): number {
  return Math.floor((11 * year + 3) / 30) + 354 * year + 30 * month - Math.floor((month - 1) / 2) + day + 1948440 - 385;
}

// Julian Day Number to Hijri
function jdToHijri(jd: number): { year: number; month: number; day: number } {
  const jdn = Math.floor(jd) + 1;
  const l = jdn - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { year, month, day };
}

export function gregorianToHijri(gYear: number, gMonth: number, gDay: number): { year: number; month: number; day: number; monthName: string } {
  const jd = gregorianToJD(gYear, gMonth, gDay);
  const h = jdToHijri(jd);
  return { ...h, monthName: HIJRI_MONTHS[h.month - 1] || '' };
}

export function hijriToGregorian(hYear: number, hMonth: number, hDay: number): { year: number; month: number; day: number } {
  const jd = hijriToJD(hYear, hMonth, hDay);
  return jdToGregorian(jd);
}

export interface IslamicEvent {
  name: string;
  hijriMonth: number;
  hijriDay: number;
}

const ISLAMIC_EVENTS: IslamicEvent[] = [
  { name: 'Tahun Baru Islam', hijriMonth: 1, hijriDay: 1 },
  { name: 'Hari Asyura', hijriMonth: 1, hijriDay: 10 },
  { name: 'Maulid Nabi Muhammad SAW', hijriMonth: 3, hijriDay: 12 },
  { name: 'Isra Mi\'raj', hijriMonth: 7, hijriDay: 27 },
  { name: 'Awal Ramadhan', hijriMonth: 9, hijriDay: 1 },
  { name: 'Idul Fitri', hijriMonth: 10, hijriDay: 1 },
  { name: 'Idul Adha', hijriMonth: 12, hijriDay: 10 },
];

export function getUpcomingEvents(count: number = 5): Array<{ name: string; gregorianDate: Date; daysUntil: number; hijriDate: string }> {
  const today = new Date();
  const todayH = gregorianToHijri(today.getFullYear(), today.getMonth() + 1, today.getDate());
  
  const candidates: Array<{ name: string; gregorianDate: Date; daysUntil: number; hijriDate: string }> = [];
  
  for (let yearOffset = 0; yearOffset <= 1; yearOffset++) {
    const hYear = todayH.year + yearOffset;
    for (const event of ISLAMIC_EVENTS) {
      const greg = hijriToGregorian(hYear, event.hijriMonth, event.hijriDay);
      const eventDate = new Date(greg.year, greg.month - 1, greg.day);
      const diffMs = eventDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays >= 0) {
        candidates.push({
          name: event.name,
          gregorianDate: eventDate,
          daysUntil: diffDays,
          hijriDate: `${event.hijriDay} ${HIJRI_MONTHS[event.hijriMonth - 1]} ${hYear}H`,
        });
      }
    }
  }
  
  candidates.sort((a, b) => a.daysUntil - b.daysUntil);
  return candidates.slice(0, count);
}
