import { useState, useEffect } from 'react';
import { BookOpen, Scroll, ScrollText, HeartHandshake, Flame, BookCheck, Info, Moon, Sun, LayoutGrid, Circle } from 'lucide-react';
import type { PageId } from '@/types';

const LOGO_PATH = '/assets/images/LOGO_MASDAR.png';
const VIEW_MODE_KEY = 'masdar_dashboard_view_mode';

interface Props {
  onNavigate: (page: PageId) => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

const menuItems = [
  {
    id: 'surah-pilihan' as PageId,
    icon: BookOpen,
    title: 'Surah Pilihan',
    titleAr: 'السُّوَرُ الْمُخْتَارَةُ',
    desc: 'Yasin, Al-Waqi\'ah, Al-Mulk, As-Sajdah, Al-Kahf' ,
    color: 'from-emerald-700 to-emerald-950',
    accent: 'border-emerald-500/80',
    glow: 'hover:shadow-emerald-500/30',
  },
  {
    id: 'ratib-hizib' as PageId,
    icon: Scroll,
    title: 'Ratib & Hizib',
    titleAr: 'الرَّوَاتِبُ وَالْأَحْزَابُ',
    desc: 'Ratib Al-Haddad, Al-Athas, Syaikhona Kholil, Hizib Sakron, Bahr, Nawawi',
    color: 'from-teal-700 to-teal-950',
    accent: 'border-teal-500/80',
    glow: 'hover:shadow-teal-500/30',
  },
  {
    id: 'maulid-qashidah' as PageId,
    icon: ScrollText,
    title: 'Maulid & Qashidah',
    titleAr: 'الْمَوَالِدُ وَالْقَصَائِدُ',
    desc: 'Simtuddurar, Ad-Dhiyaul Lami\', Asy-Syarobut Thohur, Burdah, Fii Hubbi Sayyidina',
    color: 'from-amber-700 to-amber-950',
    accent: 'border-amber-500/80',
    glow: 'hover:shadow-amber-500/30',
  },
  {
    id: 'kumpulan-doa' as PageId,
    icon: HeartHandshake,
    title: 'Kumpulan Doa & Dzikir',
    titleAr: 'الْأَدْعِيَةُ وَالْأَذْكَارُ',
    desc: 'Khatam Qur\'an, Tahajud, Dhuha, Harian, Akad, Hamil',
    color: 'from-orange-700 to-orange-950',
    accent: 'border-orange-500/80',
    glow: 'hover:shadow-orange-500/30',
  },
  {
    id: 'tahlil-jenazah' as PageId,
    icon: Flame,
    title: 'Tahlil & Talqin',
    titleAr: 'التَّهْلِيْلُ وَالتَّلْقِيْنُ',
    desc: 'Tahlil , Talqin & Doa Jenazah',
    color: 'from-indigo-700 to-indigo-950',
    accent: 'border-indigo-500/80',
    glow: 'hover:shadow-indigo-500/30',
  },
  {
    id: 'khutbah-acara' as PageId,
    icon: BookCheck,
    title: 'Khutbah & Acara',
    titleAr: 'الْخُطَبُ وَالْمُنَاسَبَاتُ',
    desc: 'Khutbah Nikah & Acara',
    color: 'from-violet-700 to-violet-950',
    accent: 'border-violet-500/80',
    glow: 'hover:shadow-violet-500/30',
  },
  {
    id: 'about' as PageId,
    icon: Info,
    title: 'Tentang MASDAR',
    titleAr: 'عَنْ مَسْدَار',
    desc: 'Musyawarah Alumni Santri Darul Khairat Pontianak',
    color: 'from-[#0a2540] via-[#0d3156] to-[#07182b]',
    accent: 'border-amber-400',
    glow: 'hover:shadow-amber-400/30',
    colSpan: true, // Membuat menu ini melebar penuh (full width)
  },
];

export default function Dashboard({ onNavigate, darkMode, onToggleDark }: Props) {
  const [viewMode, setViewMode] = useState<'grid' | 'radial'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(VIEW_MODE_KEY);
      return saved === 'radial' ? 'radial' : 'grid';
    }
    return 'grid';
  });

  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

   return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 relative ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Header Banner Royal Navy & Gold */}
      <header className="relative overflow-hidden border-b-2 border-amber-400/40 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2540] via-[#0d3156] to-[#07182b]" />
        
        {/* Glow Emas */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <div className="relative z-10 px-4 pt-10 pb-8 flex flex-col items-center text-center">
          {/* Logo Utama */}
          <div className="mb-4 w-28 h-28 mx-auto flex items-center justify-center">
            <img
              src="/assets/images/LOGO_MASDAR.png"
              alt="Logo MASDAR Pontianak"
              className="w-full h-full object-contain drop-shadow-2xl"
              onError={(e) => {
                const t = e.currentTarget;
                t.style.display = 'none';
                t.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-emerald-800 rounded-full border-4 border-amber-400 text-amber-400 font-bold text-lg shadow-2xl">M</div>';
              }}
            />
          </div>

          {/* Teks Arab Header */}
          <p className="font-arabic text-amber-300 text-xl mb-1 drop-shadow-sm" dir="rtl">
            اََلْأَذْكَارُ لِخِرِّيْجِ دَارِ الْخَيْرَاتِ
          </p>

          <h1 className="text-white font-bold text-2xl tracking-wide leading-tight">
            Adzkar Alumni Darul Khairat
          </h1>
          
          <div className="mt-1 flex items-center gap-2">
            <div className="h-px w-12 bg-amber-400/60" />
            <p className="text-amber-300 text-sm font-semibold tracking-widest uppercase">
              MASDAR Pontianak
            </p>
            <div className="h-px w-12 bg-amber-400/60" />
          </div>

          <p className="text-sky-200/80 text-xs mt-1">
            Musyawarah Alumni Santri Darul Khairat
          </p>
        </div>

        {/* View Mode & Dark Mode Toggles */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'radial' : 'grid')}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/30 transition-all"
            aria-label="Toggle view mode"
            title={viewMode === 'grid' ? 'Mode Radial' : 'Mode Grid'}
          >
            {viewMode === 'grid' ? <LayoutGrid size={18} /> : <Circle size={18} />}
          </button>
          <button
            onClick={onToggleDark}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/30 transition-all"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Grid Kategori Utama */}
      <main className="relative z-10 flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        <p className={`text-center text-sm mb-5 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Pilih kategori bacaan untuk memulai
        </p>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`
                    group relative overflow-hidden rounded-2xl border ${item.accent}
                    shadow-lg ${item.glow} hover:shadow-xl
                    transition-all duration-300 active:scale-[0.97]
                    text-left p-0
                    ${item.colSpan ? 'col-span-2' : ''}
                  `}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-90`} />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10 flex flex-col items-center text-center p-4 gap-2">
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      <Icon size={22} className="text-amber-300" />
                    </div>
                    <div className="w-full">
                      <p className="font-arabic text-amber-200 text-sm leading-relaxed" dir="rtl">
                        {item.titleAr}
                      </p>
                      <h3 className="text-white font-bold text-[13px] leading-tight mt-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-white/60 text-[11px] mt-0.5 line-clamp-2 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="relative w-full max-w-sm mx-auto aspect-square">
            {/* Watermark centered inside radial menu */}
            <img
              src={LOGO_PATH}
              alt=""
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-10 w-[500px] h-[500px] object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />

            {/* Center logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-amber-600/90 to-amber-900/90 border-2 border-amber-400/60 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.35)]">
                <img
                  src={LOGO_PATH}
                  alt="MASDAR"
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Decorative rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-80 h-80 rounded-full border border-amber-400/10" />
              <div className="absolute w-[28rem] h-[28rem] rounded-full border border-amber-400/5" />
            </div>

            {menuItems.map((item, i) => {
              const angle = (i / menuItems.length) * 2 * Math.PI - Math.PI / 2;
              const radius = 165;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="absolute flex flex-col items-center gap-1 group"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                  title={item.title}
                >
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} border ${item.accent} flex items-center justify-center shadow-lg group-hover:scale-110 group-active:scale-95 transition-transform`}>
                    <Icon size={28} className="text-amber-300" />
                  </div>
                  <p className={`font-arabic font-bold text-center leading-relaxed max-w-[90px] line-clamp-2 drop-shadow-sm text-sm ${darkMode ? 'text-amber-300' : 'text-slate-950'}`} dir="rtl">
                    {item.titleAr}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`text-center py-5 px-4 text-xs border-t ${darkMode ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
        <p>Dirancang oleh: Muhammad Farid .2026 (v2.1)| MF Digitalisasi 0896 0101 1991</p>
      </footer>
    </div>
  );
}