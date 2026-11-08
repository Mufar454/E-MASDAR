import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cacheGet, cacheSet } from '@/services/cache';

interface Props {
  darkMode: boolean;
  onBack: () => void;
}

interface Hijri {
  date: string;
  day: string;
  month: { en: string; number: number; ar?: string };
  year: string;
  weekday: { en: string };
  holidays?: string[];
}

interface GToHResponse {
  code: number;
  data?: { hijri: Hijri };
}

interface DayEntry {
  hijri: Hijri;
  gregorian: { day: string; date: string; weekday: { en: string } };
}

interface HijriCalendarResponse {
  code: number;
  data?: DayEntry[];
}

const WEEKDAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const DAY_INDEX: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6,
};

function ayyamulBidh(day: number): boolean {
  return day === 13 || day === 14 || day === 15;
}

export default function HijriCalendarPage({ darkMode, onBack }: Props) {
  const [todayHijri, setTodayHijri] = useState<Hijri | null>(null);
  const [monthData, setMonthData] = useState<DayEntry[]>([]);
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return { month: d.getMonth() + 1, year: d.getFullYear() };
  });
  const [selected, setSelected] = useState<DayEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const d = new Date();
    const key = `hijri:today:${d.toISOString().slice(0, 10)}`;
    const cached = cacheGet<Hijri>(key);
    if (cached) setTodayHijri(cached);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    fetch(`https://api.aladhan.com/v1/gToH/${dd}-${mm}-${d.getFullYear()}`)
      .then((r) => r.json() as Promise<GToHResponse>)
      .then((j) => {
        if (j.code === 200 && j.data?.hijri) {
          setTodayHijri(j.data.hijri);
          cacheSet(key, j.data.hijri, 24 * 60 * 60 * 1000);
        }
      })
      .catch(() => { if (cached) setOffline(true); });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const key = `hijri:cal:${cursor.year}:${cursor.month}`;
    const cached = cacheGet<DayEntry[]>(key);
    if (cached) setMonthData(cached);
    setLoading(!cached);
    setError(null);
    fetch(`https://api.aladhan.com/v1/gToHCalendar/${cursor.month}/${cursor.year}?calendarMethod=HJCoSA`)
      .then((r) => r.json() as Promise<HijriCalendarResponse>)
      .then((j) => {
        if (cancelled) return;
        if (j.code === 200 && Array.isArray(j.data)) {
          setMonthData(j.data);
          cacheSet(key, j.data, 30 * 24 * 60 * 60 * 1000);
          setOffline(false);
        } else throw new Error('Data kalender tidak valid');
      })
      .catch((e) => {
        if (cancelled) return;
        if (cached) setOffline(true);
        else setError(e instanceof Error ? e.message : 'Gagal memuat');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [cursor]);

  const todayG = new Date().toISOString().slice(0, 10).split('-').reverse().join('-'); // DD-MM-YYYY
  const monthName = new Date(cursor.year, cursor.month - 1, 1).toLocaleString('id-ID', { month: 'long', year: 'numeric' });

  const grid = useMemo(() => {
    if (!monthData.length) return [];
    const firstDow = DAY_INDEX[monthData[0].gregorian.weekday.en] ?? 0;
    const cells: Array<DayEntry | null> = Array.from({ length: firstDow }, () => null);
    cells.push(...monthData);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [monthData]);

  const events = useMemo(() => {
    const out: Array<{ title: string; days: string; note: string }> = [];
    const bidh = monthData.filter((d) => ayyamulBidh(Number(d.hijri.day)));
    if (bidh.length) {
      const hMonth = bidh[0].hijri.month.en;
      out.push({
        title: 'Ayyamul Bidh',
        days: bidh.map((d) => `${d.gregorian.day} ${monthName.split(' ')[0]} (${d.hijri.day} ${hMonth})`).join(', '),
        note: 'Disunnahkan puasa pada hari ke-13, 14, dan 15 bulan Hijriyah.',
      });
    }
    monthData.forEach((d) => {
      (d.hijri.holidays ?? []).forEach((h) => {
        out.push({ title: h, days: `${d.gregorian.day} ${monthName.split(' ')[0]} (${d.hijri.day} ${d.hijri.month.en})`, note: 'Hari/event Islam.' });
      });
    });
    return out;
  }, [monthData, monthName]);

  const shift = (delta: number) => {
    setSelected(null);
    setCursor((c) => {
      const m = c.month + delta;
      if (m < 1) return { month: 12, year: c.year - 1 };
      if (m > 12) return { month: 1, year: c.year + 1 };
      return { month: m, year: c.year };
    });
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className="sticky top-0 z-30 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white border-b border-amber-400/30 px-4 pt-4 pb-3">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/10" aria-label="Kembali">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <p className="font-arabic text-amber-300 text-sm" dir="rtl">اَلتَّقْوِيْمُ الْهِجْرِيُّ</p>
            <h1 className="font-bold text-base">Kalender Hijriyah {offline ? '(offline)' : ''}</h1>
          </div>
          <CalendarDays size={18} className="text-amber-300" />
        </div>
      </header>

      <main className="flex-1 px-4 py-4 max-w-2xl mx-auto w-full pb-24">
        {todayHijri && (
          <div className={`rounded-2xl border p-4 mb-4 text-center ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-emerald-100'}`}>
            <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Hari ini</p>
            <p className="text-xl font-bold text-amber-400 mt-0.5">{todayHijri.day} {todayHijri.month.en} {todayHijri.year} H</p>
          </div>
        )}

        <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className={`flex items-center justify-between px-3 py-2 border-b ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
            <button onClick={() => shift(-1)} className="p-1.5 rounded-lg hover:bg-white/10" aria-label="Bulan sebelumnya"><ChevronLeft size={18} /></button>
            <p className="text-sm font-semibold">{monthName}</p>
            <button onClick={() => shift(1)} className="p-1.5 rounded-lg hover:bg-white/10" aria-label="Bulan berikutnya"><ChevronRight size={18} /></button>
          </div>

          <div className={`grid grid-cols-7 text-center text-[10px] font-semibold py-1.5 border-b ${darkMode ? 'border-slate-700 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
            {WEEKDAYS.map((d) => <div key={d} className={d === 'Min' ? 'text-red-400' : d === 'Jum' ? 'text-emerald-400' : ''}>{d}</div>)}
          </div>

          {loading && !monthData.length ? (
            <p className="py-10 text-center text-sm opacity-70">Memuat kalender...</p>
          ) : error && !monthData.length ? (
            <p className="py-10 text-center text-sm text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-7 gap-px p-1.5">
              {grid.map((cell, i) => {
                if (!cell) return <div key={`e-${i}`} className="aspect-square" />;
                const isToday = cell.gregorian.date === todayG;
                const isBidh = ayyamulBidh(Number(cell.hijri.day));
                const isSel = selected?.gregorian.date === cell.gregorian.date;
                return (
                  <button
                    key={cell.gregorian.date}
                    type="button"
                    onClick={() => setSelected(cell)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all ${
                      isSel ? 'ring-2 ring-amber-400' : ''
                    } ${isToday ? (darkMode ? 'bg-emerald-700/60' : 'bg-emerald-100') : darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                  >
                    <span className={`text-xs font-semibold leading-none ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{cell.gregorian.day}</span>
                    <span className={`text-[9px] leading-none mt-0.5 ${darkMode ? 'text-amber-300/80' : 'text-emerald-700'}`}>{cell.hijri.day}</span>
                    {isBidh && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {selected && (
          <div className={`mt-3 rounded-2xl border p-3 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-emerald-100'}`}>
            <p className="text-sm font-semibold">{selected.gregorian.day} {monthName}</p>
            <p className="text-xs text-amber-400 mt-0.5">{selected.hijri.day} {selected.hijri.month.en} {selected.hijri.year} H</p>
            {ayyamulBidh(Number(selected.hijri.day)) && (
              <p className={`text-[11px] mt-1 ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>Ayyamul Bidh — disunnahkan puasa.</p>
            )}
            {(selected.hijri.holidays ?? []).map((h) => (
              <p key={h} className={`text-[11px] mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{h}</p>
            ))}
          </div>
        )}

        {events.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className={`text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Event Bulan Ini</p>
            {events.map((ev, i) => (
              <div key={i} className={`rounded-xl border p-3 flex gap-2 ${darkMode ? 'bg-slate-900/80 border-amber-400/20' : 'bg-amber-50 border-amber-200'}`}>
                <Star size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-amber-400">{ev.title}</p>
                  <p className={`text-[11px] ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{ev.days}</p>
                  <p className={`text-[10px] mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{ev.note}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className={`mt-3 text-[10px] text-center ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Hijriyah/Masehi dari Aladhan API. Bulan yang pernah dibuka tersimpan untuk offline. Tanggal Hijriyah dapat berbeda 1 hari (rukyat).
        </p>
      </main>
    </div>
  );
}
