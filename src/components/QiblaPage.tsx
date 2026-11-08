import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Compass, Navigation } from 'lucide-react';

interface Props {
  darkMode: boolean;
  onBack: () => void;
}

const KAABA = { lat: 21.422487, lon: 39.826206 };

function toRad(deg: number) { return (deg * Math.PI) / 180; }
function toDeg(rad: number) { return (rad * 180) / Math.PI; }

function bearingToKaaba(lat: number, lon: number): number {
  const dLon = toRad(KAABA.lon - lon);
  const y = Math.sin(dLon);
  const x = Math.cos(toRad(lat)) * Math.tan(toRad(KAABA.lat)) - Math.sin(toRad(lat)) * Math.cos(dLon);
  const brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360;
}

export default function QiblaPage({ darkMode, onBack }: Props) {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [status, setStatus] = useState('Mendeteksi lokasi...');

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setStatus('Geolokasi tidak didukung. Menggunakan lokasi default Pontianak.');
      setCoords({ lat: -0.0263, lon: 109.3425 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setStatus('Lokasi terdeteksi.');
      },
      () => {
        setStatus('Izin lokasi ditolak. Menggunakan lokasi default Pontianak.');
        setCoords({ lat: -0.0263, lon: 109.3425 });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      const anyE = e as DeviceOrientationEvent & { webkitCompassHeading?: number };
      if (typeof anyE.webkitCompassHeading === 'number') {
        setHeading(anyE.webkitCompassHeading);
      } else if (typeof e.alpha === 'number') {
        setHeading(360 - e.alpha);
      }
    };
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handler as EventListener, true);
    }
    return () => window.removeEventListener('deviceorientation', handler as EventListener, true);
  }, []);

  const qibla = useMemo(() => (coords ? bearingToKaaba(coords.lat, coords.lon) : null), [coords]);
  const rotation = qibla !== null && heading !== null ? qibla - heading : qibla ?? 0;

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className="sticky top-0 z-30 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white border-b border-amber-400/30 px-4 pt-4 pb-3">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/10" aria-label="Kembali">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <p className="font-arabic text-amber-300 text-sm" dir="rtl">اِتِّجَاهُ الْقِبْلَةِ</p>
            <h1 className="font-bold text-base">Kompas Kiblat</h1>
          </div>
          <Compass size={18} className="text-amber-300" />
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-md mx-auto w-full pb-24 flex flex-col items-center">
        <div className={`w-full rounded-2xl border p-5 text-center mb-4 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-emerald-100'}`}>
          <p className={`text-xs mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{status}</p>
          <div className="relative mx-auto w-56 h-56 rounded-full border-4 border-amber-400/40 flex items-center justify-center bg-gradient-to-b from-slate-800/20 to-transparent">
            <div className="absolute inset-3 rounded-full border border-dashed border-amber-400/20" />
            <div className="absolute top-2 text-[10px] font-bold text-amber-300">U</div>
            <div className="absolute bottom-2 text-[10px] text-slate-400">S</div>
            <div className="absolute left-2 text-[10px] text-slate-400">B</div>
            <div className="absolute right-2 text-[10px] text-slate-400">T</div>
            <div
              className="transition-transform duration-500 ease-out"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <div className="flex flex-col items-center">
                <Navigation size={44} className="text-amber-400 drop-shadow" fill="currentColor" />
                <div className="w-1 h-10 bg-gradient-to-b from-amber-400 to-transparent rounded-full -mt-1" />
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Arah Kiblat: <span className="font-bold text-amber-400">{qibla ? `${qibla.toFixed(1)}°` : '--'}</span> dari Utara
            </p>
            {heading !== null && (
              <p className={`text-[11px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Heading perangkat: {heading.toFixed(0)}°</p>
            )}
            {coords && (
              <p className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Koordinat: {coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}
              </p>
            )}
          </div>
        </div>
        <p className={`text-[11px] text-center ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
          Arah dihitung menuju Ka'bah (21.4225°N, 39.8262°E). Untuk akurasi kompas, aktifkan sensor orientasi perangkat dan jauhkan dari logam. Jika kompas tidak tersedia, gunakan derajat kiblat sebagai acuan.
        </p>
      </main>
    </div>
  );
}
