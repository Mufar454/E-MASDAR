import { ArrowLeft, Users } from 'lucide-react';

interface Props {
  darkMode: boolean;
  onBack: () => void;
}

export default function AboutPage({ darkMode, onBack }: Props) {
  const bg = darkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900';
  const card = darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100 shadow-sm';
  const sub = darkMode ? 'text-gray-400' : 'text-gray-500';
  const head = darkMode ? 'text-emerald-400' : 'text-emerald-700';

  return (
    <div className={`min-h-screen flex flex-col ${bg}`}>
      {/* Header */}
      <header className={`sticky top-0 z-30 flex items-center gap-3 px-3 py-3 shadow-md ${darkMode ? 'bg-gray-900 border-b border-gray-800' : 'bg-emerald-800'}`}>
        <button onClick={onBack} className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="text-white font-bold text-sm">Tentang MASDAR Pontianak</p>
          <p className="text-emerald-200 text-xs">Musyawarah Alumni Santri Darul Khairat</p>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-5">
        {/* Logo Card */}
        <div className={`rounded-2xl border overflow-hidden ${card}`}>
          <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 flex flex-col items-center text-center">
            <div className="w-28 h-28 mx-auto flex items-center justify-center mb-3">
              <img
                src="/assets/images/LOGO_MASDAR.png"
                alt="Logo MASDAR"
                className="w-full h-full object-contain drop-shadow-2xl"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-emerald-800 rounded-full border-4 border-amber-400 text-amber-400 font-bold text-xl shadow-xl">M</div>';
                }}
              />
            </div>
            <p className="font-arabic text-amber-300 text-xl mb-1" dir="rtl">اََلْأَذْكَارُ لِخِرِّيْجِ دَارِ الْخَيْرَاتِ</p>
            <h2 className="text-white font-bold text-lg">MASDAR Pontianak</h2>
            <p className="text-emerald-300 text-sm">Musyawarah Alumni Santri Darul Khairat</p>
          </div>
        </div>

        {/* Info Card - Tentang MASDAR */}
        <div className={`rounded-2xl border p-4 ${card}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <Users size={18} className="text-blue-400" />
            </div>
            <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>Tentang MASDAR</h3>
          </div>
          <p className={`text-sm leading-relaxed whitespace-pre-line ${sub}`}>
            {`MASDAR (Musyawarah Alumni Santri Darul Khairat) bukan sekadar wadah silaturahmi biasa, melainkan sebuah ikatan batin dan perkhidmatan mulia bagi para alumni Pondok Pesantren Darul Khairat, Pontianak. Organisasi ini resmi dibentuk pada hari Sabtu, malam Minggu, 20 Mei 2006 M bertepatan dengan 22 Rabiul Akhir 1427 H oleh Almaqfurlah Drs. KH. Suadi Mastur di Ndalem beliau. MASDAR berdiri tegak sebagai jembatan yang merawat sanad keilmuan, mengikat setiap hati alumninya agar senantiasa tertaut pada rida Allah ﷻ, ajaran murni Rasulullah ﷺ, serta keberkahan dari para guru tercinta.
Dengan rasa bangga, syukur, dan kebahagiaan yang tiada tara, kami senantiasa mengenang bimbingan dari guru mulia kami tercinta yang telah berpulang, Almaqfurlah Drs. KH. Suadi Mastur Bin KH. Mastur Bahri. Keteladanan, keikhlasan, dan curahan kasih sayang beliau dalam mendidik santri-santrinya telah menjadi suluh penerang. Ilmu dan akhlak mulia yang beliau ajarkan selalu menuntun kami untuk istiqamah di jalan ilmu dan amal. Menjadi santri beliau adalah sebuah kehormatan agung dan anugerah terindah yang senantiasa kami syukuri dalam setiap napas pengabdian.
Melalui kesempatan ini pula, ucapan terima kasih yang tak terhingga kami haturkan yang sedalam-dalamnya kepada Almaqfurlah serta segenap keluarga besar beliau atas seluruh pengorbanan, kesabaran, dan keikhlasan dalam membimbing kami. Semoga setiap amal bakti beliau menjadi pahala jariyah yang terus mengalir deras di sisi Allah ﷻ.
Di tengah dinamika zaman yang terus berubah, MASDAR bersama nilai-nilai didikan beliau mengambil peran strategis sebagai garda terdepan dalam menjaga tradisi dan amalan salafusshalih. Melalui himpunan zikir, ratib, hizib, dan maulid ini, kami berkomitmen untuk membumikan warisan spiritual para ulama berhaluan Ahlus Sunnah wal Jama'ah. Setiap lantunan doa dan puji-pujian yang termaktub di dalamnya diharapkan menjadi benteng akidah, penyejuk jiwa, sekaligus syiar Islam yang rahmatan lil 'alamin di tengah masyarakat.
Lebih dari sebuah identitas organisasi, MASDAR adalah janji setia untuk terus menebar manfaat. Semoga Allah Ta'ala senantiasa melimpahkan rahmat, maghfirah, dan tempat terindah bagi Almaqfurlah Drs. KH. Suadi Mastur Bin KH. Mastur Bahri, memberkahi keluarga yang ditinggalkan, serta menaungi perhimpunan ini.`}
          </p>
        </div>

        {/* Quote */}
        <div className={`rounded-2xl border p-5 ${darkMode ? 'bg-emerald-950/50 border-emerald-800' : 'bg-emerald-50 border-emerald-200'}`}>
          <p className={`text-sm italic leading-relaxed mb-2 ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
            "Tidak ada guru yang tidak ingat terhadap santrinya. Tetapi santrinya saja yang banyak lupa terhadap gurunya. Makanya guru itu bisa ingat apabila diingatkan oleh santrinya. Tetapi apabila santri tidak ingat terhadap gurunya, Maka guru lebih tidak ingat terhadap santrinya."
          </p>
          <p className={`text-xs font-bold ${head}`}>— Drs. KH. Suaidi Mastur</p>
        </div>

        <div className={`rounded-2xl border p-4 text-center ${card}`}>
          <p className={`text-xs ${sub}`}>Aplikasi ini merupakan digitalisasi</p>
          <p className={`text-xs ${sub}`}>Adzkar Alumni Darul Khairat - MASDAR Pontianak</p>
          <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <p className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              © 2026 Darul Khairat - MASDAR (v2.0.0) | Muhammad Farid
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}