import { useCallback, useEffect, useRef, useState } from 'react';
import type { PrayerTimesResult } from '@/services/prayerTimes';

const KEY = 'masdar-adhan-enabled';
const LAST_KEY = 'masdar-adhan-last';

type Timings = PrayerTimesResult['timings'];
const ADHAN_KEYS: Array<keyof Timings> = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

function playChime() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      o.connect(g);
      g.connect(ctx.destination);
      const t = now + i * 0.22;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
      o.start(t);
      o.stop(t + 0.75);
    });
    window.setTimeout(() => { void ctx.close(); }, 2500);
  } catch {
    // audio unavailable
  }
}

export function useAdhanReminder(timings: Timings | null) {
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
  });
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAST_KEY);
      if (raw) firedRef.current = new Set(JSON.parse(raw) as string[]);
    } catch { /* ignore */ }
  }, []);

  const toggle = useCallback(() => {
    setEnabled((v) => {
      const next = !v;
      try { localStorage.setItem(KEY, next ? '1' : '0'); } catch { /* ignore */ }
      if (next) playChime(); // user gesture: prime/unlock audio
      return next;
    });
  }, []);

  useEffect(() => {
    if (!enabled || !timings) return;
    const tick = () => {
      const now = new Date();
      const hm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const day = now.toISOString().slice(0, 10);
      for (const k of ADHAN_KEYS) {
        const t = timings[k];
        if (!t || t === '-') continue;
        const id = `${day}:${k}:${t}`;
        if (t === hm && !firedRef.current.has(id)) {
          firedRef.current.add(id);
          try { localStorage.setItem(LAST_KEY, JSON.stringify([...firedRef.current].slice(-20))); } catch { /* ignore */ }
          setLastPlayed(k);
          playChime();
        }
      }
    };
    tick();
    const iv = window.setInterval(tick, 15000);
    return () => window.clearInterval(iv);
  }, [enabled, timings]);

  return { enabled, toggle, lastPlayed };
}
