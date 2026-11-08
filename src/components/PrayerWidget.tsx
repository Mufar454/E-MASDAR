import { useEffect, useState } from 'react';
import { MapPin, Clock } from 'lucide-react';
import { fetchPrayerTimesByCity, fetchPrayerTimesByCoords, type PrayerTimesResult } from '@/services/prayerTimes';

interface Props {
  darkMode: boolean;
  compact?: boolean;
}

const ROWS: Array<{ key: keyof PrayerTimesResult['timings']; label: string; ar?: string }> = [
  { key: 'Imsak', label: 'Imsak', ar: 'إِمْسَاك' },
  { key: 'Fajr', label: 'Subuh', ar: 'الفَجْر' },
  { key: 'Sunrise', label: 'Syuruq', ar: 'الشُّرُوق' },
  { key: 'Dhuha', label: 'Dhuha', ar: 'الضُّحَى' },
  { key: 'Dhuhr', label: 'Dzuhur', ar: 'الظُّهْر' },
  { key: 'Asr', label: 'Ashar', ar: 'العَصْر' },
  { key: 'Maghrib', label: 'Maghrib', ar: 'المَغْرِب' },
  { key: 'Isha', label: 'Isya', ar: 'العِشَاء' },
];

export default function PrayerWidget({ darkMode, compact = true }: Props) {
  const [data, setData] = useState<PrayerTimesResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async (fn: () => Promise<PrayerTimesResult>) => {
      try {
        setLoading(true);
        setError(null);
        const result = await fn();
        if (!cancelled) setData(result);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Gagal memuat');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => load(() => fetchPrayerTimesByCoords(pos.coords.latitude, pos.coords.longitude)),
        () => load(() => fetchPrayerTimesByCity('Pontianak', 'Indonesia')),
        { timeout: 5000, maximumAge: 600000 }
      );
    } else {
      load(() => fetchPrayerTimesByCity('Pontianak', 'Indonesia'));
    }
    return () => { cancelled = true; };
  }, []);

  return (
    <section
      className={`mx-4 mt-4 rounded-2xl border shadow-sm ${
        darkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white/95 border-emerald-100'
      }`}
      aria-label="Jadwal sholat hari ini"
    >
      <div className={`flex items-center justify-between px-3 py-2 border-b ${darkMode ? 'border-slate-700' : 'border-emerald-50'}`}>
        <div className="flex items-center gap-2 min-w-0">
          <Clock size={14} className="text-amber-400 shrink-0" />
          <span className={`text-xs font-semibold truncate ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
            Jadwal Sholat {data?.cached ? '(offline)' : ''}
          </span>
        </div>
        <div className={`flex items-center gap-1 text-[10px] truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          <MapPin size={10} className="shrink-0" />
          <span className="truncate">{data?.location ?? (loading ? 'Memuat...' : 'Pontianak')}</span>
        </div>
      </div>

      {error ? (
        <p className={`px-3 py-2 text-[11px] ${darkMode ? 'text-red-300' : 'text-red-600'}`}>{error}</p>
      ) : (
        <div
          className={`grid ${
            compact ? 'grid-cols-4 sm:grid-cols-8' : 'grid-cols-2 sm:grid-cols-4'
          } gap-px ${darkMode ? 'bg-slate-700/80' : 'bg-emerald-50'} rounded-b-2xl overflow-hidden`}
        >
          {ROWS.map(({ key, label }) => (
            <div
              key={key}
              className={`${compact ? 'px-1 py-2' : 'px-3 py-3'} text-center ${darkMode ? 'bg-slate-900' : 'bg-white'}`}
            >
              <p className={`text-[10px] leading-tight ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
              <p className={`${compact ? 'text-[11px]' : 'text-sm'} font-bold tabular-nums mt-0.5 ${darkMode ? 'text-amber-300' : 'text-emerald-800'}`}>
                {loading ? '--:--' : data?.timings[key] ?? '-'}
              </p>
            </div>
          ))}
        </div>
      )}
      {data && !compact && (
        <p className={`px-3 py-2 text-[10px] text-center border-t ${darkMode ? 'border-slate-700 text-slate-500' : 'border-emerald-50 text-slate-400'}`}>
          {data.hijri} · {data.date}
        </p>
      )}
    </section>
  );
}
