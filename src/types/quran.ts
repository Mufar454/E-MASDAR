export interface EquranSurah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi?: string;
  audioFull?: Record<string, string>;
}

export interface EquranAyat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio?: Record<string, string>;
}

export interface EquranSurahDetail extends EquranSurah {
  ayat: EquranAyat[];
  suratSelanjutnya?: false | { nomor: number; namaLatin: string };
  suratSebelumnya?: false | { nomor: number; namaLatin: string };
}

export interface EquranListResponse {
  code: number;
  message: string;
  data: EquranSurah[];
}

export interface EquranDetailResponse {
  code: number;
  message: string;
  data: EquranSurahDetail;
}
