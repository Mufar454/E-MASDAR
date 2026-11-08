import { useEffect, useState } from 'react';
import { ArrowLeft, Bell, BellOff, Volume2 } from 'lucide-react';
import PrayerWidget from '@/components/PrayerWidget';
import { fetchPrayerTimesByCity, fetchPrayerTimesByCoords, type PrayerTimesResult } from '@/services/prayerTimes';
import { useAdhanReminder } from '@/hooks/useAdhanReminder';

interface Props {
  darkMode: boolean;
  onBack: () => void;
}

export default function AdzanPage({ darkMode, onBack }: Props) {
  const [timings, setTimings] = useState<PrayerTimesResult['timings'] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const apply = (r: PrayerTimesResult) => { if (!cancelled) setTimings(r.timings); };
    const fallback = () => fetchPrayerTimesByCity('Pontianak', 'Indonesia').then(apply).catch(() => {});
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchPrayerTimesByCoords(pos.coords.latitude, pos.coords.longitude).then(apply).catch(fallback),
        fallback,
        { timeout: 5000, maximumAge: 600000 }
      );
    } else fallback();
    return () => { cancelled = true; };
  }, []);

  const { enabled, toggle, lastPlayed } = useAdhanReminder(timings);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} pb-24`}>
      <header className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white border-b border-amber-400/30 px-4 pt-6 pb-6">
        <div className="max-w-2xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-1 text-xs text-amber-300 mb-3 hover:text-amber-200">
            <ArrowLeft size={14} /> Kembali
          </button>
          <p className="font-arabic text-amber-300" dir="rtl">مَوَاقِيْتُ الصَّلَاةِ</p>
          <h1 className="text-xl font-bold">Jadwal Sholat & Adzan</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
        <PrayerWidget darkMode={darkMode} compact={false} />

        <section className={`mx-4 mt-4 rounded-2xl border p-4 ${darkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white border-emerald-100'}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 min-w-0">
              <Volume2 size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className={`text-sm font-semibold ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>Pengingat Adzan Otomatis</p>
                <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Memutar nada pengingat saat waktu Subuh, Dzuhur, Ashar, Maghrib, dan Isya (saat aplikasi aktif). Aktifkan setelah interaksi agar audio diizinkan perangkat.
                </p>
                {lastPlayed && (
                  <p className="text-[11px] text-amber-400 mt-1">Terakhir: {lastPlayed}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={toggle}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                enabled
                  ? 'bg-amber-400/20 text-amber-200 border-amber-400/40'
                  : darkMode ? 'bg-slate-800 text-slate-300 border-slate-600' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
              aria-pressed={enabled}
            >
              {enabled ? <Bell size={14} /> : <BellOff size={14} />}
              {enabled ? 'Aktif' : 'Nonaktif'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
