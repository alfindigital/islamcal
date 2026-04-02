export interface ZakatHistoryEntry {
  id: string;
  type: 'emas' | 'perak' | 'uang' | 'dagang' | 'tani';
  label: string;
  amount: number;
  details: string;
  date: string; // ISO string
}

const STORAGE_KEY = 'zakat-history';

export function getZakatHistory(): ZakatHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveZakatEntry(entry: Omit<ZakatHistoryEntry, 'id' | 'date'>): void {
  const history = getZakatHistory();
  history.unshift({
    ...entry,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  });
  // Keep max 50 entries
  if (history.length > 50) history.length = 50;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function deleteZakatEntry(id: string): void {
  const history = getZakatHistory().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearZakatHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
