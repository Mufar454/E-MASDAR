import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Search, BookOpen, Loader2, Languages, Bookmark, BookmarkCheck, Layers } from 'lucide-react';
import { fetchSurahList, fetchSurahDetail } from '@/services/equran';
import type { EquranSurah, EquranSurahDetail } from '@/types/quran';
import { JUZ_LIST } from '@/data/juz';

interface Props {
  darkMode: boolean;
  onBack: () => void;
}

type Tab = 'surat' | 'juz' | 'bookmark';

interface BookmarkItem {
  surah: number;
  ayat: number;
  surahName: string;
  text: string;
  ts: number;
}

const BM_KEY = 'masdar-quran-bookmarks';
const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const toArabicDigits = (n: number) => String(n).replace(/\d/g, (d) => AR_DIGITS[Number(d)] ?? d);

function readBookmarks(): BookmarkItem[] {
  try { return JSON.parse(localStorage.getItem(BM_KEY) || '[]') as BookmarkItem[]; } catch { return []; }
}
function writeBookmarks(items: BookmarkItem[]) {
  try { localStorage.setItem(BM_KEY, JSON.stringify(items)); } catch { /* ignore */ }
}

export default function QuranPage({ darkMode, onBack }: Props) {
  const [tab, setTab] = useState<Tab>('surat');
  const [surahs, setSurahs] = useState<EquranSurah[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<EquranSurahDetail | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => readBookmarks());

  useEffect(() => {
    let cancelled = false;
    fetchSurahList()
      .then((data) => {
        if (cancelled) return;
        setSurahs(data);
        if (data.length && typeof navigator !== 'undefined' && !navigator.onLine) setFromCache(true);
      })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : 'Gagal memuat'); })
      .finally(() => { if (!cancelled) setLoadingList(false); });
    return () => { cancelled = true; };
  }, []);

  const surahByName = useMemo(() => {
    const norm = (s: string) => s.toLowerCase().replace(/['’`-]/g, '').replace(/\s+/g, ' ').trim();
    const m = new Map<string, EquranSurah>();
    surahs.forEach((s) => m.set(norm(s.namaLatin), s));
    return m;
  }, [surahs]);

  const openSurah = async (nomor: number) => {
    try {
      setLoadingDetail(true); setError(null);
      const detail = await fetchSurahDetail(nomor);
      setSelected(detail);
      setFromCache(typeof navigator !== 'undefined' && !navigator.onLine);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat surat');
    } finally { setLoadingDetail(false); }
  };

  const openJuz = (surahName: string) => {
    const norm = (s: string) => s.toLowerCase().replace(/['’`-]/g, '').replace(/\s+/g, ' ').trim();
    const hit = surahByName.get(norm(surahName));
    if (hit) void openSurah(hit.nomor);
    else setError(`Surat "${surahName}" belum tersedia di daftar. Buka tab Surat.`);
  };

  const toggleBookmark = (surah: number, ayat: number, surahName: string, text: string) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.surah === surah && b.ayat === ayat);
      const next = exists ? prev.filter((b) => !(b.surah === surah && b.ayat === ayat)) : [{ surah, ayat, surahName, text: text.slice(0, 90), ts: Date.now() }, ...prev].slice(0, 200);
      writeBookmarks(next);
      return next;
    });
  };
  const isBookmarked = (surah: number, ayat: number) => bookmarks.some((b) => b.surah === surah && b.ayat === ayat);

  const filtered = surahs.filter((s) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return s.namaLatin.toLowerCase().includes(q) || s.arti.toLowerCase().includes(q) || String(s.nomor) === q;
  });

  const tabBtn = (id: Tab, label: string, Icon: typeof BookOpen) => (
    <button type="button" onClick={() => { setTab(id); setSelected(null); setError(null); }}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl transition-all ${
        tab === id ? 'bg-amber-400/20 text-amber-200' : 'text-white/70 hover:bg-white/5'
      }`}>
      <Icon size={14} /> {label}
    </button>
  );

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className="sticky top-0 z-30 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white border-b border-amber-400/30 px-4 pt-4 pb-2">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={selected ? () => setSelected(null) : onBack} className="p-2 rounded-xl hover:bg-white/10" aria-label="Kembali"><ArrowLeft size={20} /></button>
            <div className="flex-1 min-w-0">
              <p className="font-arabic text-amber-300 text-sm" dir="rtl">اَلْقُرْآنُ الْكَرِيْمُ</p>
              <h1 className="font-bold text-base truncate">{selected ? `${selected.nomor}. ${selected.namaLatin}` : "Al-Qur'an"}</h1>
            </div>
            {selected && (
              <button type="button" onClick={() => setShowTranslation((v) => !v)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${showTranslation ? 'bg-amber-400/20 text-amber-200 border-amber-400/40' : 'bg-white/5 text-white/70 border-white/10'}`}
                aria-pressed={showTranslation}><Languages size={14} /> {showTranslation ? 'Hide' : 'Unhide'}</button>
            )}
          </div>
          {!selected && (
            <div className="flex gap-1 p-1 rounded-xl bg-black/20 border border-white/10">
              {tabBtn('surat', 'Surat', BookOpen)}{tabBtn('juz', 'Juz', Layers)}{tabBtn('bookmark', 'Bookmark', Bookmark)}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 py-4 max-w-2xl mx-auto w-full pb-24">
        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
        {fromCache && !error && <p className={`mb-3 text-[11px] ${darkMode ? 'text-amber-300/80' : 'text-amber-700'}`}>Data tersimpan (offline/cache).</p>}

        {!selected && tab === 'surat' && (
          <>
            <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 mb-3 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <Search size={16} className={darkMode ? 'text-slate-400' : 'text-slate-500'} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari surat..." className="w-full bg-transparent text-sm outline-none" />
            </div>
            <p className={`text-[11px] mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>114 surat · Equran.id API · surat yang dibuka tersimpan offline.</p>
            {loadingList ? <div className="flex items-center justify-center gap-2 py-12 text-sm opacity-70"><Loader2 size={18} className="animate-spin" /> Memuat...</div> : (
              <ul className="space-y-2">{filtered.map((s) => (
                <li key={s.nomor}><button onClick={() => openSurah(s.nomor)} className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-all active:scale-[0.99] ${darkMode ? 'bg-slate-900 border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${darkMode ? 'bg-emerald-900/60 text-emerald-200 border-emerald-700/50' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>{s.nomor}</span>
                  <div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{s.namaLatin}</p><p className={`text-[11px] truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{s.arti} · {s.jumlahAyat} ayat</p></div>
                  <span className="font-arabic text-lg text-amber-300 shrink-0" dir="rtl">{s.nama}</span>
                </button></li>
              ))}</ul>
            )}
          </>
        )}

        {!selected && tab === 'juz' && (
          <>
            <p className={`text-[11px] mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>30 Juz dengan keterangan awal surat & ayat.</p>
            <ul className="space-y-2">{JUZ_LIST.map((j) => (
              <li key={j.juz}><button onClick={() => openJuz(j.surah)} className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-all active:scale-[0.99] ${darkMode ? 'bg-slate-900 border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                <span className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${darkMode ? 'bg-amber-500/15 text-amber-300 border-amber-400/30' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>{j.juz}</span>
                <div className="min-w-0"><p className="font-semibold text-sm">Juz {j.juz}</p><p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Mulai: {j.start}</p></div>
              </button></li>
            ))}</ul>
          </>
        )}

        {!selected && tab === 'bookmark' && (
          <>
            <p className={`text-[11px] mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Ayat yang Anda tandai (tersimpan lokal).</p>
            {bookmarks.length === 0 ? <p className={`py-10 text-center text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Belum ada bookmark. Tandai ayat saat membaca.</p> : (
              <ul className="space-y-2">{bookmarks.map((b) => (
                <li key={`${b.surah}:${b.ayat}`}><button onClick={() => openSurah(b.surah)} className={`w-full text-left p-3 rounded-xl border transition-all ${darkMode ? 'bg-slate-900 border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                  <p className="text-xs font-semibold text-amber-400">{b.surahName} · Ayat {b.ayat}</p>
                  <p className={`text-[11px] mt-0.5 line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{b.text}</p>
                </button></li>
              ))}</ul>
            )}
          </>
        )}

        {selected && (
          <article>
            {loadingDetail ? <div className="flex items-center justify-center gap-2 py-12 text-sm opacity-70"><Loader2 size={18} className="animate-spin" /> Memuat ayat...</div> : (
              <>
                <div className={`rounded-2xl p-4 mb-4 text-center border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-emerald-100'}`}>
                  <p className="font-arabic text-2xl text-amber-300 mb-1" dir="rtl">{selected.nama}</p>
                  <p className="font-semibold">{selected.namaLatin}</p>
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{selected.arti} · {selected.tempatTurun} · {selected.jumlahAyat} ayat</p>
                </div>
                {selected.nomor !== 1 && selected.nomor !== 9 && <p className="font-arabic text-center text-xl mb-4" dir="rtl">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>}
                <div className="space-y-3">{selected.ayat.map((a) => {
                  const marked = isBookmarked(selected.nomor, a.nomorAyat);
                  return (
                    <div key={a.nomorAyat} className={`rounded-2xl border p-4 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${darkMode ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-800'}`}>{selected.nomor}:{a.nomorAyat}</span>
                        <button type="button" onClick={() => toggleBookmark(selected.nomor, a.nomorAyat, selected.namaLatin, a.teksIndonesia)}
                          className={`p-1 rounded-lg ${marked ? 'text-amber-400' : darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`} aria-label={marked ? 'Hapus bookmark' : 'Tambah bookmark'}>
                          {marked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                        </button>
                      </div>
                      <p className="font-arabic text-right text-[22px] leading-[2.3] mb-2" dir="rtl">
                        {a.teksArab}{' '}
                        <span className="inline-block text-amber-400 align-middle mx-0.5" style={{ fontFamily: 'Scheherazade New, serif' }}>﴿{toArabicDigits(a.nomorAyat)}﴾</span>
                      </p>
                      {showTranslation && (<>
                        <p className={`text-xs italic mb-1 ${darkMode ? 'text-emerald-300/80' : 'text-emerald-700'}`}>{a.teksLatin}</p>
                        <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{a.teksIndonesia}</p>
                      </>)}
                    </div>
                  );
                })}</div>
              </>
            )}
          </article>
        )}
      </main>
    </div>
  );
}
