import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { History, Trash2, X } from 'lucide-react';
import { getZakatHistory, deleteZakatEntry, clearZakatHistory, ZakatHistoryEntry } from '@/utils/zakatHistory';
import { formatIDR } from '@/utils/formatters';

const TYPE_LABELS: Record<string, string> = {
  emas: '🪙 Emas',
  perak: '🪙 Perak',
  uang: '💵 Uang',
  dagang: '🏪 Bisnis',
  tani: '🌾 Pertanian',
};

export const ZakatHistoryPanel: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<ZakatHistoryEntry[]>([]);

  useEffect(() => {
    if (open) setEntries(getZakatHistory());
  }, [open]);

  const handleDelete = (id: string) => {
    deleteZakatEntry(id);
    setEntries(getZakatHistory());
  };

  const handleClear = () => {
    clearZakatHistory();
    setEntries([]);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <History className="h-4 w-4" />
          <span className="text-xs">Riwayat</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl pb-8 max-h-[75vh] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="font-heading">Riwayat Perhitungan Zakat</SheetTitle>
            {entries.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClear} className="text-destructive hover:text-destructive text-xs gap-1">
                <Trash2 className="h-3.5 w-3.5" />
                Hapus Semua
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="mt-4 space-y-2">
          {entries.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <History className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Belum ada riwayat perhitungan.</p>
              <p className="text-xs mt-1">Simpan hasil perhitungan zakat untuk melihatnya di sini.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {TYPE_LABELS[entry.type] || entry.type}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{formatDate(entry.date)}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{formatIDR(entry.amount)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 break-words">{entry.details}</p>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive shrink-0"
                  aria-label="Hapus"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
