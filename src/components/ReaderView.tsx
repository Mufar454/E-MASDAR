import { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft, ZoomIn, ZoomOut, Moon, Sun,
  ChevronLeft, ChevronRight, List, X, Languages
} from 'lucide-react';
import type { BookContent, Section } from '@/types';
import type { PageId } from '@/types';

// Fungsi konversi angka ke Angka Arab Timur (٠, ١, ٢, ٣, ٤, ٥, ٦, ٧, ٨, ٩)
const toArabicDigits = (num: string | number): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, (digit) => arabicDigits[parseInt(digit, 10)]);
};

interface Props {
  book: BookContent;
  pageId: PageId;
  fontSize: number;
  darkMode: boolean;
  onBack: () => void;
  onFontIncrease: () => void;
  onFontDecrease: () => void;
  onToggleDark: () => void;
}

export default function ReaderView({
  book,
  fontSize,
  darkMode,
  onBack,
  onFontIncrease,
  onFontDecrease,
  onToggleDark,
}: Props) {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [showToc, setShowToc] = useState(false);

  // Menyimpan status terjemahan untuk setiap section (default: false saat pertama dibuka)
  const [translationsMap, setTranslationsMap] = useState<Record<number, boolean>>({});

  const contentRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const section: Section | undefined = book.sections[sectionIdx];

  // Status terjemahan default diubah dari true menjadi false
  const showTranslation = translationsMap[sectionIdx] ?? false;

  const toggleTranslation = () => {
    setTranslationsMap(prev => ({
      ...prev,
      [sectionIdx]: !showTranslation
    }));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [sectionIdx, book.id]);

  const goNext = useCallback(() => {
    setSectionIdx(s => (s < book.sections.length - 1 ? s + 1 : s));
  }, [book.sections.length]);

  const goPrev = useCallback(() => {
    setSectionIdx(s => (s > 0 ? s - 1 : s));
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  const isQiyamSection = section?.verses?.some(v => v.isQiyam);

  // 1. Pengecekan apakah buku termasuk Surah Al-Qur'an (Termasuk 'rad' / Ar-Ra'd)
  const isQuranSection = [
    'waqiah', 'al-waqiah', 'alWaqiah',
    'yasin', 'surah-yasin', 'yasin-waqiah',
    'mulk', 'al-mulk', 'alMulk',
    'sajdah', 'as-sajdah', 'asSajdah',
    'kahf', 'al-kahf', 'alkahfi', 'alKahfi',
    'rahman', 'ar-rahman', 'arRahman', 'surah-ar-rahman',
    'rad', 'ar-ro\'du'
  ].includes(book.id.toLowerCase());

  // 2. Memisahkan Bismillah dari ayat-ayat biasa
  const basmalahVerse = section?.verses?.find(v => 
    v.id === 'w-0' || 
    v.id === 'y-0' || 
    v.id === 'm-0' || 
    v.id === 's-0' || 
    v.id === 'k-0' || 
    v.id === 'r-0' || 
    v.id === 'bismillah' ||
    v.arabic?.trim() === 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ' ||
    v.arabic?.trim() === 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ'
  );

  const regularVerses = section?.verses?.filter(v => v !== basmalahVerse) || [];

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>

      {/* Top Nav Bar */}
      <header className={`sticky top-0 z-30 flex items-center justify-between px-3 py-2.5 shadow-md ${darkMode ? 'bg-gray-900 border-b border-gray-800' : 'bg-emerald-800'}`}>
        <button onClick={onBack} className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} />
        </button>

        <div className="flex-1 mx-2 min-w-0">
          <p className="text-white font-semibold text-sm truncate leading-tight">{book.title}</p>
          <p className="text-emerald-200 text-xs truncate leading-tight">{section?.title}</p>
        </div>

        <button
          onClick={toggleTranslation}
          className={`p-2 rounded-xl transition-colors ${showTranslation ? 'text-amber-300' : 'text-white/50'} hover:bg-white/10`}
          aria-label="Sembunyikan/Tampilkan terjemahan"
          title="Sembunyikan/Tampilkan terjemahan"
        >
          <Languages size={20} />
        </button>

        <button onClick={() => setShowToc(true)} className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors">
          <List size={20} />
        </button>
      </header>

      {/* Section Title Banner */}
      <div className={`px-4 py-3 ${isQiyamSection ? 'bg-gradient-to-r from-amber-600 to-amber-700' : darkMode ? 'bg-emerald-900/60' : 'bg-emerald-50 border-b border-emerald-100'}`}>
        <div className="max-w-lg mx-auto text-center">
          {section?.titleAr && (
            <p className={`font-arabic text-lg mb-0.5 ${isQiyamSection ? 'text-white' : darkMode ? 'text-amber-300' : 'text-emerald-800'}`} dir="rtl">
              {section.titleAr}
            </p>
          )}
          <h2 className={`font-bold text-sm ${isQiyamSection ? 'text-amber-100' : darkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>
            {section?.title}
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div
        key={`${book.id}-${sectionIdx}`}
        ref={contentRef}
        className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="pb-32">
          {/* TAMPILAN MUSHAF (TANPA TERJEMAHAN - SURAH AL-QURAN) */}
          {isQuranSection && !showTranslation ? (
            <div
              className={`rounded-2xl border px-5 py-6 text-right ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-emerald-100 bg-white shadow-sm'}`}
              dir="rtl"
            >
              {/* Bismillah terpisah di posisi atas tengah */}
              {basmalahVerse && (
                <div className="text-center my-4 font-bold">
                  <p className="arabic-text leading-relaxed" style={{ fontSize: `${fontSize * 1.05}px` }}>
                    {basmalahVerse.arabic}
                  </p>
                </div>
              )}

              {/* Seluruh Ayat Mengalir Bersambung */}
              <p
                className="arabic-text text-justify leading-[2.6]"
                style={{ fontSize: `${fontSize}px` }}
              >
                {regularVerses.map((verse, idx) => {
                  const rawNum = verse.id.split('-').pop();
                  const numValue = (rawNum && !isNaN(Number(rawNum))) ? rawNum : idx + 1;
                  const verseNum = toArabicDigits(numValue);
                  const isDoa = verse.id.includes('doa') || (verse.note && verse.note.includes('Doa'));

                  if (isDoa) {
                    return (
                      <span key={verse.id || idx} className="block mt-8 text-center border-t pt-6 border-emerald-500/20">
                        <span className="block mb-2 text-xs font-semibold text-amber-400" dir="ltr">
                          {verse.note}
                        </span>
                        <span className="leading-loose">{verse.arabic}</span>
                      </span>
                    );
                  }

                  return (
                    <span key={verse.id || idx} className="inline">
                      {verse.arabic}{' '}
                      <span
                        dir="ltr"
                        className={`inline-flex items-center justify-center mx-1 align-middle rounded-full font-bold select-none ${darkMode ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-100 text-emerald-700'}`}
                        style={{ width: '1.6em', height: '1.6em', fontSize: `${fontSize * 0.45}px` }}
                      >
                        {verseNum}
                      </span>
                      {' '}
                    </span>
                  );
                })}
              </p>
            </div>
          ) : isQuranSection && showTranslation ? (
            /* TAMPILAN PER-AYAT SURAH AL-قURAN (DENGAN TERJEMAHAN) */
            <div className="space-y-3">
              {section?.verses?.map((verse, idx) => {
                const rawNum = verse.id.split('-').pop();
                const numValue = (rawNum && !isNaN(Number(rawNum))) ? rawNum : idx + 1;
                const verseNum = toArabicDigits(numValue);
                const isBasmalah = verse === basmalahVerse;
                const isDoa = verse.id.includes('doa') || (verse.note && verse.note.includes('Doa'));

                return (
                  <div
                    key={verse.id || idx}
                    className={`rounded-2xl border overflow-hidden ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-emerald-100 bg-white shadow-sm'}`}
                  >
                    {verse.note && (
                      <div className={`px-3 py-1.5 border-b flex items-center gap-2 ${darkMode ? 'border-gray-700 bg-gray-800 text-emerald-400' : 'border-emerald-50 bg-emerald-50 text-emerald-700'}`}>
                        <span className="text-xs font-semibold">
                          📌 {verse.note}
                        </span>
                        {verse.count && (
                          <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${darkMode ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-100 text-emerald-700'}`}>
                            ×{verse.count}
                          </span>
                        )}
                      </div>
                    )}
                    {verse.arabic && (
                      <div className={`px-4 pt-4 pb-2 text-right ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        <p
                          className={`arabic-text leading-loose whitespace-pre-line ${isBasmalah ? 'text-center font-bold' : ''}`}
                          style={{ fontSize: `${fontSize}px` }}
                          dir="rtl"
                        >
                          {verse.arabic}
                          {!isBasmalah && !isDoa && (
                            <span
                              dir="ltr"
                              className={`inline-flex items-center justify-center mx-1 align-middle rounded-full text-xs font-bold ${darkMode ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-100 text-emerald-700'}`}
                              style={{ width: '1.5em', height: '1.5em', fontSize: `${fontSize * 0.4}px` }}
                            >
                              {verseNum}
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                    {verse.translation && (
                      <>
                        {verse.arabic && <div className={`mx-4 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />}
                        <div className={`px-4 ${verse.arabic ? 'pb-4 pt-2' : 'pt-4 pb-4'}`}>
                          <p className={`text-sm leading-relaxed whitespace-pre-line ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {verse.translation}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* TAMPILAN UNTUK HIZIB / RATIB / MAULID / DOA (NON-ALQURAN) */
            <div className="space-y-4">
              {section?.verses?.map((verse, idx) => (
                <div
                  key={verse.id || idx}
                  className={`rounded-2xl border overflow-hidden ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-emerald-100 bg-white shadow-sm'}`}
                >
                  {(verse.note || verse.count) && (
                    <div className={`px-3.5 py-2 border-b flex items-center justify-between gap-2 ${darkMode ? 'border-amber-500/20 bg-amber-500/10 text-amber-300' : 'border-amber-200/80 bg-amber-50 text-amber-900'}`}>
                      {verse.note && (
                        <span className="text-xs font-medium italic leading-snug flex items-start gap-1.5">
                          <span className="not-italic">📌</span>
                          <span>{verse.note}</span>
                        </span>
                      )}
                      {verse.count && (
                        <span className={`ml-auto text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 ${darkMode ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-amber-200 text-amber-900'}`}>
                          {verse.count}x
                        </span>
                      )}
                    </div>
                  )}

                  {verse.arabic && (
                    <div className="px-4 pt-4 pb-2 text-right">
                      <p className="arabic-text leading-loose whitespace-pre-line" style={{ fontSize: `${fontSize}px` }} dir="rtl">
                        {verse.arabic}
                      </p>
                    </div>
                  )}

                  {showTranslation && verse.translation && (
                    <div className={`px-4 pb-4 pt-2 border-t ${darkMode ? 'border-gray-800 text-gray-300' : 'border-gray-100 text-gray-600'}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{verse.translation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 safe-bottom">
        <div className="mx-auto max-w-lg px-3 pb-3 pt-1">
          <div className={`flex items-center gap-1 rounded-xl px-2 py-1.5 shadow-2xl ${darkMode ? 'bg-gray-800/95 border border-gray-700' : 'bg-emerald-900/95 border border-emerald-700'}`}>
            <button onClick={goPrev} disabled={sectionIdx === 0} className="p-1.5 rounded-lg text-white disabled:opacity-30">
              <ChevronLeft size={16} />
            </button>
            <div className="flex-1 flex items-center justify-center gap-1">
              {book.sections.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSectionIdx(i)}
                  className={`rounded-full transition-all ${i === sectionIdx ? 'w-3.5 h-1.5 bg-amber-400' : 'w-1.5 h-1.5 bg-white/30'}`}
                />
              ))}
            </div>
            <button onClick={goNext} disabled={sectionIdx === book.sections.length - 1} className="p-1.5 rounded-lg text-white disabled:opacity-30">
              <ChevronRight size={16} />
            </button>
            <div className={`w-px h-4 mx-0.5 ${darkMode ? 'bg-gray-600' : 'bg-emerald-700'}`} />
            <button onClick={onFontDecrease} className="p-1.5 rounded-lg text-white"><ZoomOut size={15} /></button>
            <span className="text-amber-300 text-[11px] font-bold w-5 text-center">{fontSize}</span>
            <button onClick={onFontIncrease} className="p-1.5 rounded-lg text-white"><ZoomIn size={15} /></button>
            <div className={`w-px h-4 mx-0.5 ${darkMode ? 'bg-gray-600' : 'bg-emerald-700'}`} />
            <button onClick={toggleTranslation} className={`p-1.5 rounded-lg ${showTranslation ? 'text-amber-300' : 'text-white/50'}`}>
              <Languages size={15} />
            </button>
            <button onClick={onToggleDark} className="p-1.5 rounded-lg text-white">
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </div>

      {/* Drawer TOC */}
      {showToc && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowToc(false)} />
          <div className={`relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
              <h3 className="font-bold text-base text-white">Daftar Bagian</h3>
              <button onClick={() => setShowToc(false)} className="p-1.5 text-gray-300"><X size={18} /></button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {book.sections.map((sec, i) => (
                <button
                  key={sec.id}
                  onClick={() => { setSectionIdx(i); setShowToc(false); }}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 ${i === sectionIdx ? 'bg-emerald-900/60' : ''}`}
                >
                  <span className="text-sm font-medium">{sec.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}