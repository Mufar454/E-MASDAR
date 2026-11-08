import { cacheGet, cacheSet } from '@/services/cache';

export interface PrayerTimings {
  Imsak: string;
  Fajr: string;
  Sunrise: string;
  Dhuha: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface PrayerTimesResult {
  timings: PrayerTimings;
  date: string;
  hijri: string;
  location: string;
  cached?: boolean;
}

interface AladhanResponse {
  code: number;
  data?: {
    timings: Record<string, string>;
    date: {
      readable: string;
      hijri: { day: string; month: { en: string }; year: string };
    };
  };
}

function cleanTime(value: string): string {
  return (value ?? '-').split(' ')[0] ?? value;
}

function normalize(json: AladhanResponse, location: string): PrayerTimesResult {
  if (json.code !== 200 || !json.data) throw new Error('Data jadwal sholat tidak valid');
  const t = json.data.timings;
  return {
    timings: {
      Imsak: cleanTime(t.Imsak),
      Fajr: cleanTime(t.Fajr),
      Sunrise: cleanTime(t.Sunrise),
      Dhuha: cleanTime(t.Dhuha ?? t.Sunrise),
      Dhuhr: cleanTime(t.Dhuhr),
      Asr: cleanTime(t.Asr),
      Maghrib: cleanTime(t.Maghrib),
      Isha: cleanTime(t.Isha),
    },
    date: json.data.date.readable,
    hijri: `${json.data.date.hijri.day} ${json.data.date.hijri.month.en} ${json.data.date.hijri.year} H`,
    location,
  };
}

async function fetchWithCache(url: string, key: string, location: string): Promise<PrayerTimesResult> {
  const cached = cacheGet<PrayerTimesResult>(key);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Gagal memuat jadwal sholat');
    const json = (await res.json()) as AladhanResponse;
    const result = normalize(json, location);
    cacheSet(key, result, 12 * 60 * 60 * 1000);
    return result;
  } catch (e) {
    if (cached) return { ...cached, cached: true };
    throw e;
  }
}

export async function fetchPrayerTimesByCoords(lat: number, lon: number): Promise<PrayerTimesResult> {
  const day = new Date().toISOString().slice(0, 10);
  const key = `prayer:coords:${lat.toFixed(2)}:${lon.toFixed(2)}:${day}`;
  const url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=20`;
  return fetchWithCache(url, key, 'Lokasi Anda');
}

export async function fetchPrayerTimesByCity(city = 'Pontianak', country = 'Indonesia'): Promise<PrayerTimesResult> {
  const day = new Date().toISOString().slice(0, 10);
  const key = `prayer:city:${city}:${day}`;
  const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=20`;
  return fetchWithCache(url, key, city);
}
