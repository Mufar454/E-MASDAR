import { ArrowLeft, BookOpen, Scroll, Sparkles, HeartHandshake, Flame, BookCheck, ChevronRight } from 'lucide-react';
import type { PageId } from '@/types';

interface SubMenuItem {
  id: PageId;
  title: string;
  titleAr: string;
  desc: string;
}

interface CategoryConfig {
  title: string;
  titleAr: string;
  icon: React.ElementType;
  gradient: string;
  accent: string;
  items: SubMenuItem[];
}

const SUBMENU_DATA: Record<string, CategoryConfig> = {
  'surah-pilihan': {
    title: 'Surah Pilihan',
    titleAr: 'السُّوَرُ الْمُخْتَارَةُ',
    icon: BookOpen,
    gradient: 'from-emerald-800 via-emerald-900 to-slate-950',
    accent: 'border-emerald-500',
    items: [
      { id: 'yasin', title: 'Surah Yasin', titleAr: 'سُورَةُ يٰسٓ', desc: 'Makkiyah · 83' },
      { id: 'waqiah', title: 'Surah Al-Waqi\'ah', titleAr: 'سُورَةُ الْوَاقِعَةِ', desc: 'Makkiyah · 96' },
      { id: 'mulk', title: 'Surah Al-Mulk', titleAr: 'سُورَةُ الْمُلْكِ', desc: 'Makkiyah · 30' },
      { id: 'sajdah', title: 'Surah As-Sajdah', titleAr: 'سُورَةُ السَّجْدَةِ', desc: 'Makkiyah · 30' },
      { id: 'kahf', title: 'Surah Al-Kahfi', titleAr: 'سُورَةُ الْكَهْفِ', desc: 'Makkiyah · 110' },
      { id: 'surah-ar-rahman', title: 'Surah Ar-Rahman', titleAr: 'سُوْرَةُ الرَّحْمٰنِ', desc: 'Madaniyah · 78'},
      { id: 'rad', title: 'Surah Ar-Ra\'d', titleAr: 'سُوْرَةُ الرَّعْدِ', desc: 'Madaniyah · 43 ayat' },
    ],
  },
  'ratib-hizib': {
    title: 'Ratib & Hizib',
    titleAr: 'الرَّوَاتِبُ وَالْأَحْزَابُ',
    icon: Scroll,
    gradient: 'from-teal-800 via-teal-900 to-slate-950',
    accent: 'border-teal-500',
    items: [
      { id: 'ratib-haddad', title: 'Ratib Al-Haddad', titleAr: 'رَاتِبُ الْحَدَّادِ', desc: 'Al-Habib Abdullah bin Alawi Al-Haddad' },
      { id: 'ratib-athas', title: 'Ratib Al-Athas', titleAr: 'رَاتِبُ الْعَطَّاسِ', desc: 'Al-Habib Umar bin Abdurrahman Al-Athas' },
      { id: 'ratib-syaikhona-kholil', title: 'Ratib Syaikhona Kholil', titleAr: 'رَاتِبُ شَيْخِنَا خَلِيْل', desc: 'Syaikhona Muhammad Kholil Bangkalan' },
      { id: 'hizib-sakron', title: 'Hizib Sakron', titleAr: 'حِزْبُ السَّكْرَانِ', desc: 'Al-Habib Ali bin Abu Bakar As-Segaf' },
      { id: 'hizib-bahr', title: 'Hizib Bahr', titleAr: 'حِزْبُ الْبَحْرِ', desc: 'Syekh Abu Hasan Asy-Syadhili' },
      { id: 'hizib-nawawi', title: 'Hizib Nawawi', titleAr: 'حِزْبُ النَّوَوِيِّ', desc: 'Imam Yahya bin Syaraf An-Nawawi' },
    ],
  },
  'maulid-qashidah': {
    title: 'Maulid & Qashidah',
    titleAr: 'الْمَوَالِدُ وَالْقَصَائِدُ',
    icon: Sparkles,
    gradient: 'from-amber-800 via-amber-900 to-slate-950',
    accent: 'border-amber-500',
    items: [
      { id: 'simtuddurar', title: 'Maulid Simtuddurar', titleAr: 'سِمْطُ الدُّرَرِ', desc: 'Al-Habib Ali bin Muhammad Al-Habsyi' },
      { id: 'dhiyaul-lami', title: 'Maulid Ad-Dhiyaul Lami\'', titleAr: 'اَلضِّيَاءُ اللَّامِعُ', desc: 'Al-Habib Umar bin Hafizh' },
      { id: 'syarobutthohur', title: 'Maulid Syarobut Thohur', titleAr: 'الشَرَابُ الطَّهُورِ', desc: 'Al-Habib Umar bin Hafizh' },
      { id: 'burdah', title: 'Qashidah Burdah', titleAr: 'قَصِيْدَةُ الْبُرْدَةِ', desc: 'Imam Al-Bushiri' },
      { id: 'hubbi', title: 'Fii Hubbi Sayyidina', titleAr: 'فِيْ حُبِّ سَيِّدِنَا', desc: 'Bacaan Mahabbah Rasulullah ﷺ' },
      { id: 'tawassul', title: 'Qashidah Tawassul MASDAR', titleAr: 'قَصِيْدَةُ التَّوَسُّلِ', desc: 'Qasidah Tawassul khas Ponpes Darul Khairat' },
    ],
  },
  'kumpulan-doa': {
    title: 'Kumpulan Doa & Dzikir',
    titleAr: 'الْأَدْعِيَةُ وَالْأَذْكَارُ',
    icon: HeartHandshake,
    gradient: 'from-orange-800 via-orange-900 to-slate-950',
    accent: 'border-orange-500',
    items: [
      { id: 'doa-khatam', title: 'Doa Khatmil Qur\'an', titleAr: 'دُعَاءُ خَتْمِ الْقُرْآنِ', desc: 'Doa setelah selesainya khatam Al-Qur\'an' },
      { id: 'doa-para-nabi', title: 'Kumpulan Doa para Nabi', titleAr: 'دُعَاءُ الأَنْبِيَاءِ فِي القُرْآنِ', desc: 'Kumpulan doa mulia para nabi dan rasul dalam Al-Quran'},
      { id: 'doa-kiai-suadi', title: 'Doa KH. Suaidi Mastur', titleAr: 'دُعَاءُ لِلشَّيْخِ سُعَيْدِي مَسْتُورَ', desc: 'Doa setelah sholat Maktubah milik KH. Suaidi Mastur'},
      { id: 'doa-tahajud', title: 'Doa Shalat Tahajud', titleAr: 'دُعَاءُ صَلَاةِ التَّهَجُّدِ', desc: 'Doa sepertiga malam' },
      { id: 'doa-dhuha', title: 'Doa Shalat Dhuha', titleAr: 'دُعَاءُ صَلَاةِ الضُّحَى', desc: 'Doa kelapangan rezeki' },
      { id: 'doa-syaban', title: "Doa Nisfu Sya'ban", titleAr: 'دُعَاءُ نِصْفِ شَعْبَانَ', desc: "Doa khusus malam Nisfu Sya'ban" },
      { id: 'doa-tarawih', title: 'Doa Shalat Tarawih', titleAr: 'دُعَاءُ التَّرَاوِيْحِ', desc: 'Doa Kamilin setelah shalat tarawih' },
      { id: 'doa-witir', title: 'Doa Shalat Witir', titleAr: 'دُعَاءُ الْوِتْرِ', desc: 'Doa setelah melaksanakan shalat witir' },
      { id: 'doa-akhir-awal-tahun', title: 'Doa Akhir & Awal Tahun', titleAr: 'دُعَاءُ آخِرِ وَأَوَّلِ السَّنَةِ', desc: 'Doa penutup dan pembuka tahun hijriah' },
      { id: 'doa-setelah-belajar',  title: 'Doa setelah Belajar',  titleAr: 'دُعَاءُ يُقْرَأُ بَعْدَ خِتَامِ الْمَجْلِسِ',  desc: 'Doa yang dibaca setelah penutupan majelis'},
      { id: 'doa-tolak-bala-tahunan', title: 'Shalawat Menolak Bencana', titleAr: 'الصَّلَاةُ لِدَفْعِ الْبَلَاءِ الْعَظِيْمِ', desc: 'Shalawat untuk menolak bencana besar dan tahunan'},
      { id: 'doa-hamil', title: 'Doa Hamil & Persalinan', titleAr: 'أَدْعِيَةُ الْحَمْلِ', desc: 'Doa untuk ibu hamil dan kelancaran persalinan' },
      { id: 'doa-kesehatan', title: 'Doa Kesehatan', titleAr: 'أَدْعِيَةُ الصِّحَّةِ', desc: 'Kumpulan Doa Mohon Kesembuhan dan Kesehatan'},
    ],
  },
  'tahlil-jenazah': {
    title: 'Tahlil & Talqin',
    titleAr: 'التَّهْلِيْلُ وَالتَّلْقِيْنُ',
    icon: Flame,
    gradient: 'from-indigo-800 via-indigo-900 to-slate-950',
    accent: 'border-indigo-500',
    items: [
      { id: 'tahlil', title: 'Tahlil & Doa', titleAr: 'التَّهْلِيْلُ وَالدُّعَاءُ', desc: 'Tawasul, surat pendek, Tahlil & Doa' },
      { id: 'talqin', title: 'Talqin ', titleAr: 'تَلْقِيْنُ الْمَيِّتِ', desc: 'Talqin Mayyit & Doa Jenazah Anak Belum Baligh' },
      { id: 'doa-jenazah-anak',  title: 'Doa Jenazah Anak Belum Baligh',  titleAr: 'دُعَاءُ الْجَنَازَةِ عَلَى الطِّفْلِ الصَّغِيْرِ',  desc: 'Doa Jenazah Anak Belum Baligh'},
    ],
  },
  'khutbah-acara': {
    title: 'Khutbah & Acara',
    titleAr: 'الْخُطَبُ وَالْمُنَاسَبَاتُ',
    icon: BookCheck,
    gradient: 'from-violet-800 via-violet-900 to-slate-950',
    accent: 'border-violet-500',
    items: [
      { id: 'khutbah-nikah-1',title: 'Khutbah Nikah (Model Ringkas)', titleAr: 'خُطْبَةُ النِّكَاحِ (مُخْتَصَرَةٌ)', desc: 'Pilihan 1: Teks khutbah pendek & praktis'},
      { id: 'khutbah-nikah-2', title: 'Khutbah Nikah (Khutbatul Hajah)', titleAr: 'خُطْبَةُ النِّكَاحِ (سُنَّةٌ)',  desc: 'Pilihan 2: Pembuka standar sunnah Nabawiyah'},
      { id: 'khutbah-nikah-3', title: 'Khutbah Nikah (Model Lengkap)', titleAr: 'خُطْبَةُ النِّكَاحِ (كَاَمِلَةٌ)',  desc: 'Pilihan 3: Khutbah komprehensif kaya akan dalil'},
      { id: 'doa-nikah-syaikhona-kholil',  title: 'Doa Nikah Syaikhona Kholil',  titleAr: 'دُعَاءُ النِّكَاحِ لِلشَّيْخِ خَلِيْل',  desc: 'Doa pernikahan susunan Syaikhona Kholil Bangkalan'},
      { id: 'doa-akad', title: 'Doa Setelah Akad Nikah', titleAr: 'دُعَاءُ النِّكَاحِ', desc: 'Doa keberkahan pengantin baru' },
      { id: 'shighot-nikah', title: 'Sighot Nikah (Ijab Kabul)', titleAr: 'صِيغَةُ النِّكَاحِ', desc: 'Teks ijab kabul dan penyerahan pengantin' },
    ],
  },
};

interface Props {
  categoryId: string;
  onNavigate: (page: PageId) => void;
  darkMode: boolean;
}

export default function SubMenuPage({ categoryId, onNavigate, darkMode }: Props) {
  const config = SUBMENU_DATA[categoryId];

  if (!config) {
    return (
      <div className="p-6 text-center">
        <p>Kategori tidak ditemukan.</p>
        <button onClick={() => onNavigate('home')} className="mt-4 text-amber-400 underline">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const IconHeader = config.icon;

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`relative overflow-hidden bg-gradient-to-br ${config.gradient} text-white border-b-2 border-amber-400/40 shadow-xl px-4 pt-6 pb-8`}>
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-xs sm:text-sm text-amber-300 hover:text-amber-200 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-amber-400/30 transition-all active:scale-95 mb-6"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Dashboard</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-amber-400/40 flex items-center justify-center shrink-0 shadow-inner">
              <IconHeader size={28} className="text-amber-300" />
            </div>
            <div>
              <p className="font-arabic text-amber-300 text-lg sm:text-xl" dir="rtl">
                {config.titleAr}
              </p>
              <h1 className="text-xl sm:text-2xl font-bold tracking-wide mt-0.5">
                {config.title}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        <p className={`text-xs sm:text-sm mb-4 font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Pilih bacaan yang ingin dibuka:
        </p>

        <div className="flex flex-col gap-3">
          {config.items.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                group relative w-full text-left p-4 rounded-2xl border ${config.accent}/30
                ${darkMode ? 'bg-slate-900/80 hover:bg-slate-800' : 'bg-white hover:bg-slate-100'}
                shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99]
                flex items-center justify-between gap-3
              `}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <h3 className="font-bold text-sm sm:text-base text-amber-400 group-hover:text-amber-300 transition-colors truncate">
                    {item.title}
                  </h3>
                  <span className="font-arabic text-amber-200/90 text-sm sm:text-base shrink-0" dir="rtl">
                    {item.titleAr}
                  </span>
                </div>
                <p className={`text-xs line-clamp-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.desc}
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all shrink-0">
                <ChevronRight size={18} />
              </div>
            </button>
          ))}
        </div>
      </main>

      <footer className={`text-center py-4 px-4 text-xs border-t ${darkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
        <p>© 2026. Darul Khairat. MASDAR Pontianak. Muhammad Farid</p>
      </footer>
    </div>
  );
}