// ==========================================
// TIPE DATA NAVIGASI (PAGE ID)
// ==========================================
export type PageId =
  // Halaman Utama & Kategori Sub-Menu
  | 'home'
  | 'dashboard'
  | 'surah-pilihan'
  | 'ratib-hizib'
  | 'maulid-qashidah'
  | 'kumpulan-doa'
  | 'tahlil-jenazah'
  | 'khutbah-acara'
  | 'about'
  // Fitur Baru
  | 'adzan-sholat'
  | 'quran'
  | 'kiblat'
  | 'kalender-hijriyah'
  // ID Bacaan Detail (Reader)
  | 'yasin'
  | 'waqiah'
  | 'mulk'
  | 'sajdah'
  | 'kahf'
  | 'surah-ar-rahman'
  | 'rad'
  | 'ratib'
  | 'ratib-haddad'
  | 'ratib-athas'
  | 'ratib-syaikhona-kholil'
  | 'hizib'
  | 'hizib-sakron'
  | 'hizib-bahr'
  | 'hizib-nawawi'
  | 'maulid'
  | 'simtuddurar'
  | 'dhiyaul-lami'
  | 'burdah'
  | 'hubbi'
  | 'syarobutthohur'
  | 'doa'
  | 'doa-khatam'
  | 'doa-kiai-suadi'
  | 'doa-tahajud'
  | 'doa-dhuha'
  | 'doa-harian'
  | 'doa-syaban'
  | 'doa-tarawih'
  | 'doa-witir'
  | 'doa-akhir-awal-tahun'
  | 'doa-setelah-belajar'
  | 'doa-akad'
  | 'akad'
  | 'doa-tolak-bala-tahunan'
  | 'doa-para-nabi'
  | 'doa-hamil'
  | 'hamil'
  | 'doa-kesehatan'
  | 'tahlil'
  | 'talqin'
  | 'doa-jenazah-anak'
  | 'khutbah-nikah-1'
  | 'khutbah-nikah-2'
  | 'khutbah-nikah-3'
  | 'doa-nikah-syaikhona-kholil'
  | 'shighot-nikah'
  | 'tawassul';

// ==========================================
// INTERFACE KONTEN BACAAN / BUKU
// ==========================================
export interface Verse {
  id: string;
  arabic?: string;
  translation: string;
  note?: string;
  count?: number;
  isQiyam?: boolean;
  lines?: {
    kanan: string;
    kiri: string;
  }[];
}

export interface Section {
  id: string;
  title: string;
  titleAr?: string;
  verses: Verse[];
}

export interface BookContent {
  id: string;
  title: string;
  titleAr: string; // Properti ini wajib ada sesuai interface
  subtitle?: string;
  sections: Section[];
}