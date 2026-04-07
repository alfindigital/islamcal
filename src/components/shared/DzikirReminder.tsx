import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, BellOff, BellRing } from 'lucide-react';

const REMINDER_KEY = 'dzikir_reminder';

interface ReminderData {
  enabled: boolean;
  time: string; // HH:mm
  lastNotified: string; // date string
}

function loadReminder(): ReminderData {
  try {
    const raw = localStorage.getItem(REMINDER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { enabled: false, time: '05:00', lastNotified: '' };
}

function saveReminder(data: ReminderData) {
  localStorage.setItem(REMINDER_KEY, JSON.stringify(data));
}

export const DzikirReminder: React.FC = () => {
  const [reminder, setReminder] = useState<ReminderData>(loadReminder);
  const [permissionState, setPermissionState] = useState<NotificationPermission | 'unsupported'>('default');

  useEffect(() => {
    if (!('Notification' in window)) {
      setPermissionState('unsupported');
    } else {
      setPermissionState(Notification.permission);
    }
  }, []);

  useEffect(() => {
    saveReminder(reminder);
  }, [reminder]);

  // Check reminder on interval
  useEffect(() => {
    if (!reminder.enabled || permissionState !== 'granted') return;

    const check = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      if (reminder.lastNotified !== today && currentTime >= reminder.time) {
        new Notification('📿 Pengingat Dzikir', {
          body: 'Waktunya berdzikir! Jaga streak harian Anda.',
          icon: '/icon-192.png',
          tag: 'dzikir-reminder',
        });
        const updated = { ...reminder, lastNotified: today };
        setReminder(updated);
      }
    };

    check();
    const interval = setInterval(check, 60000); // check every minute
    return () => clearInterval(interval);
  }, [reminder, permissionState]);

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    const perm = await Notification.requestPermission();
    setPermissionState(perm);
    if (perm === 'granted') {
      setReminder(prev => ({ ...prev, enabled: true }));
    }
  };

  const toggle = () => {
    if (!reminder.enabled) {
      if (permissionState === 'granted') {
        setReminder(prev => ({ ...prev, enabled: true }));
      } else {
        requestPermission();
      }
    } else {
      setReminder(prev => ({ ...prev, enabled: false }));
    }
  };

  if (permissionState === 'unsupported') return null;

  return (
    <Card className="mb-4">
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {reminder.enabled ? (
              <BellRing className="h-4 w-4 text-primary shrink-0" />
            ) : (
              <BellOff className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium">Pengingat Dzikir</p>
              <p className="text-xs text-muted-foreground">
                {reminder.enabled ? `Setiap hari pukul ${reminder.time}` : 'Nonaktif'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {reminder.enabled && (
              <Input
                type="time"
                value={reminder.time}
                onChange={e => setReminder(prev => ({ ...prev, time: e.target.value, lastNotified: '' }))}
                className="w-[100px] h-8 text-xs"
              />
            )}
            <Button variant={reminder.enabled ? 'default' : 'outline'} size="sm" onClick={toggle} className="text-xs gap-1">
              <Bell className="h-3.5 w-3.5" />
              {reminder.enabled ? 'Aktif' : 'Aktifkan'}
            </Button>
          </div>
        </div>
        {permissionState === 'denied' && (
          <p className="text-xs text-destructive mt-2">
            Izin notifikasi diblokir. Aktifkan di pengaturan browser Anda.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
