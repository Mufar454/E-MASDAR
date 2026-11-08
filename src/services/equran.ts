import type { EquranDetailResponse, EquranListResponse, EquranSurah, EquranSurahDetail } from '@/types/quran';
import { cacheGet, cacheSet } from '@/services/cache';

const BASE = 'https://equran.id/api/v2';

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Gagal memuat data (${res.status})`);
  return (await res.json()) as T;
}

export async function fetchSurahList(): Promise<EquranSurah[]> {
  const key = 'quran:list';
  const cached = cacheGet<EquranSurah[]>(key);
  try {
    const json = await getJson<EquranListResponse>(`${BASE}/surat`);
    if (json.code !== 200 || !Array.isArray(json.data)) throw new Error('Respons API daftar surat tidak valid');
    cacheSet(key, json.data);
    return json.data;
  } catch (e) {
    if (cached) return cached;
    throw e;
  }
}

export async function fetchSurahDetail(nomor: number): Promise<EquranSurahDetail> {
  const key = `quran:surah:${nomor}`;
  const cached = cacheGet<EquranSurahDetail>(key);
  try {
    const json = await getJson<EquranDetailResponse>(`${BASE}/surat/${nomor}`);
    if (json.code !== 200 || !json.data) throw new Error('Respons API detail surat tidak valid');
    cacheSet(key, json.data);
    return json.data;
  } catch (e) {
    if (cached) return cached;
    throw e;
  }
}
