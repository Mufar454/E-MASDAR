import { useCallback, useEffect, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';

import { usePreferences } from '@/hooks/usePreferences';

// Data Bacaan
import { yasinData } from '@/data/yasin';
import { waqiahData } from '@/data/waqiah';
import { mulkData } from '@/data/alMulk';
import { sajdahData } from '@/data/asSajdah';
import { kahfData } from '@/data/alkahfi';
import { arRahmanData } from './data/arRahmanData';
import { arRoDuData } from "@/data/ar-ro'du";
import { ratibHaddad } from '@/data/ratibHaddad';
import { ratibAlAthasData } from '@/data/ratibatthas';
import { kumpulanZikirData as ratibSyaikhonaData } from '@/data/ratibsyaikhonakholil';
import { simtudduror } from '@/data/simtuddurar';
import { dhiyaulLami } from '@/data/dhiyaulLami';
import { burdahData } from '@/data/burdah';
import { fiiHubbiData } from '@/data/fiiHubbiData';
import { syarobutthohurData } from '@/data/syarobutthohur';
import { hizibSakronData } from '@/data/hizibsakron';
import { hizibBahrData } from '@/data/hizibbahr';
import { hizibNawawiData } from '@/data/hizibnawawi';
import { tahlilData } from '@/data/tahlilData';
import { talqinData } from '@/data/talqinData';
import { doaJenazahAnak } from './data/doaJenazahAnak';
import { tawassulData } from '@/data/tawassulData';
import { doakhotmilquran } from './data/doakhotmilquran';
import { doaParaNabiData } from './data/doaParaNabiData';
import { doaKiaiSuadiData } from './data/doakiaisuadi';
import { doatahajjud } from './data/doatahajjud';
import { doadhuha } from './data/doadhuha';
import { doasyaban } from './data/doasyaban';
import { doatarawih } from './data/doatarawih';
import { doawitir } from './data/doawitir';
import { doaakhirtahunawaltahun } from './data/doaakhirtahunawaltahun';
import { doaSetelahBelajarData } from './data/doasetelahbelajar';
import { doatolakbalatahun } from './data/doaTolakBala';
import { doaHamilData } from '@/data/doaHamilData';
import { doaKesehatanData } from './data/doa-kesehatan';
import { khutbahNikah1Data } from './data/khutbahNikah1';
import { khutbahNikah2Data } from './data/khutbahNikah2';
import { khutbahNikah3Data } from './data/khutbahNikah3';
import { doaAkadNikahData } from '@/data/doaAkadNikahData';
import { doaNikahSyaikhonaKholilData } from './data/doaNikahSyaikhonaKholil';
import { shighotNikahData } from './data/shighot';

// Komponen Tampilan
import Dashboard from '@/components/Dashboard';
import SubMenuPage from '@/components/SubMenuPage';
import ReaderView from '@/components/ReaderView';
import AboutPage from '@/components/AboutPage';
import QuranPage from '@/components/QuranPage';
import QiblaPage from '@/components/QiblaPage';
import HijriCalendarPage from '@/components/HijriCalendarPage';
import AdzanPage from '@/components/AdzanPage';
import FloatingNavbar from '@/components/FloatingNavbar';

import type { PageId } from '@/types';

const SUBMENU_IDS: PageId[] = [
  'surah-pilihan',
  'ratib-hizib',
  'maulid-qashidah',
  'kumpulan-doa',
  'tahlil-jenazah',
  'khutbah-acara',
];

export default function App() {
  const { prefs, setFontSize, toggleDarkMode } = usePreferences();
  const [page, setPage] = useState<PageId>('home');
  const [lastSubMenu, setLastSubMenu] = useState<PageId | null>(null);

  const handleNavigate = (newPage: PageId) => {
    if (SUBMENU_IDS.includes(newPage)) setLastSubMenu(newPage);
    setPage(newPage);
  };

  const handleBack = useCallback(() => {
    if ((page as string) === 'about') setPage('home');
    else if (SUBMENU_IDS.includes(page)) setPage('home');
    else if (['adzan-sholat', 'quran', 'kiblat', 'kalender-hijriyah'].includes(page)) setPage('home');
    else if (lastSubMenu) setPage(lastSubMenu);
    else setPage('home');
  }, [page, lastSubMenu]);

  useEffect(() => {
    const backButtonListener = CapacitorApp.addListener('backButton', () => {
      if (page !== 'home') handleBack();
      else CapacitorApp.exitApp();
    });
    return () => {
      backButtonListener.then((listener) => listener.remove());
    };
  }, [page, handleBack]);

  const readerProps = {
    fontSize: prefs.fontSize,
    darkMode: prefs.darkMode,
    onBack: handleBack,
    onFontIncrease: () => setFontSize(prefs.fontSize + 2),
    onFontDecrease: () => setFontSize(prefs.fontSize - 2),
    onToggleDark: toggleDarkMode,
  };

  if (page === 'quran') {
    return (
      <>
        <QuranPage darkMode={prefs.darkMode} onBack={handleBack} />
        <FloatingNavbar active={page} onNavigate={handleNavigate} darkMode={prefs.darkMode} />
      </>
    );
  }
  if (page === 'kiblat') {
    return (
      <>
        <QiblaPage darkMode={prefs.darkMode} onBack={handleBack} />
        <FloatingNavbar active={page} onNavigate={handleNavigate} darkMode={prefs.darkMode} />
      </>
    );
  }
  if (page === 'kalender-hijriyah') {
    return (
      <>
        <HijriCalendarPage darkMode={prefs.darkMode} onBack={handleBack} />
        <FloatingNavbar active={page} onNavigate={handleNavigate} darkMode={prefs.darkMode} />
      </>
    );
  }
  if (page === 'adzan-sholat') {
    return (
      <>
        <AdzanPage darkMode={prefs.darkMode} onBack={handleBack} />
        <FloatingNavbar active={page} onNavigate={handleNavigate} darkMode={prefs.darkMode} />
      </>
    );
  }

  if (SUBMENU_IDS.includes(page)) {
    return (
      <>
        <SubMenuPage categoryId={page} onNavigate={handleNavigate} darkMode={prefs.darkMode} />
        <FloatingNavbar active={page} onNavigate={handleNavigate} darkMode={prefs.darkMode} />
      </>
    );
  }

  if ((page as string) === 'yasin' || (page as string) === 'doa') {
    return <ReaderView {...readerProps} book={yasinData} pageId={page} />;
  }
  if ((page as string) === 'waqiah') return <ReaderView {...readerProps} book={waqiahData} pageId={page} />;
  if ((page as string) === 'mulk' || (page as string) === 'al-mulk' || (page as string) === 'alMulk') return <ReaderView {...readerProps} book={mulkData} pageId={page} />;
  if ((page as string) === 'sajdah' || (page as string) === 'as-sajdah' || (page as string) === 'asSajdah') return <ReaderView {...readerProps} book={sajdahData} pageId={page} />;
  if ((page as string) === 'kahf' || (page as string) === 'al-kahf' || (page as string) === 'alkahfi') return <ReaderView {...readerProps} book={kahfData} pageId={page} />;
  if ((page as string) === 'surah-ar-rahman' || (page as string) === 'ar-rahman') return <ReaderView {...readerProps} book={arRahmanData} pageId={page} />;
  if ((page as string) === 'rad' || (page as string) === "ar-ro'du") return <ReaderView {...readerProps} book={arRoDuData} pageId={page} />;
  if ((page as string) === 'ratib' || (page as string) === 'ratib-haddad') return <ReaderView {...readerProps} book={ratibHaddad} pageId={page} />;
  if ((page as string) === 'ratib-athas') return <ReaderView {...readerProps} book={ratibAlAthasData} pageId={page} />;
  if ((page as string) === 'ratib-syaikhona-kholil') return <ReaderView {...readerProps} book={ratibSyaikhonaData} pageId={page} />;
  if ((page as string) === 'hizib-sakron') return <ReaderView {...readerProps} book={hizibSakronData} pageId={page} />;
  if ((page as string) === 'hizib-bahr') return <ReaderView {...readerProps} book={hizibBahrData} pageId={page} />;
  if ((page as string) === 'hizib-nawawi' || (page as string) === 'hizib') return <ReaderView {...readerProps} book={hizibNawawiData} pageId={page} />;
  if ((page as string) === 'simtuddurar' || (page as string) === 'simtudduror' || (page as string) === 'maulid-simtuddurar') return <ReaderView {...readerProps} book={simtudduror} pageId="simtuddurar" />;
  if ((page as string) === 'maulid' || (page as string) === 'dhiyaul-lami') return <ReaderView {...readerProps} book={dhiyaulLami} pageId={page} />;
  if ((page as string) === 'burdah') return <ReaderView {...readerProps} book={burdahData} pageId="burdah" />;
  if ((page as string) === 'hubbi') return <ReaderView {...readerProps} book={fiiHubbiData} pageId="hubbi" />;
  if ((page as string) === 'syarobutthohur') return <ReaderView {...readerProps} book={syarobutthohurData} pageId="syarobutthohur" />;
  if ((page as string) === 'tawassul' || (page as string) === 'qashidah-tawassul') return <ReaderView {...readerProps} book={tawassulData} pageId="tawassul" />;
  if ((page as string) === 'doa-khatam' || (page as string) === 'doa-khotmil-quran') return <ReaderView {...readerProps} book={doakhotmilquran} pageId={page} />;
  if ((page as string) === 'doa-para-nabi' || (page as string) === 'doa-nabi') return <ReaderView {...readerProps} book={doaParaNabiData} pageId={page} />;
  if ((page as string) === 'doa-kiai-suadi') return <ReaderView {...readerProps} book={doaKiaiSuadiData} pageId={page} />;
  if ((page as string) === 'doa-tahajud' || (page as string) === 'doa-tahajjud') return <ReaderView {...readerProps} book={doatahajjud} pageId={page} />;
  if ((page as string) === 'doa-dhuha') return <ReaderView {...readerProps} book={doadhuha} pageId={page} />;
  if (page === 'doa-syaban') return <ReaderView {...readerProps} book={doasyaban} pageId={page} />;
  if (page === 'doa-tarawih') return <ReaderView {...readerProps} book={doatarawih} pageId={page} />;
  if (page === 'doa-witir') return <ReaderView {...readerProps} book={doawitir} pageId={page} />;
  if (page === 'doa-akhir-awal-tahun') return <ReaderView {...readerProps} book={doaakhirtahunawaltahun} pageId={page} />;
  if ((page as string) === 'doa-setelah-belajar') return <ReaderView {...readerProps} book={doaSetelahBelajarData} pageId={page} />;
  if ((page as string) === 'akad' || (page as string) === 'doa-akad' || (page as string) === 'khutbah-nikah') return <ReaderView {...readerProps} book={doaAkadNikahData} pageId={page} />;
  if (page === 'doa-tolak-bala-tahunan') return <ReaderView {...readerProps} book={doatolakbalatahun} pageId={page} />;
  if ((page as string) === 'doa-kesehatan' || (page as string) === 'kumpulan-doa-kesehatan') return <ReaderView {...readerProps} book={doaKesehatanData} pageId={page} />;
  if (page === 'khutbah-nikah-1') return <ReaderView {...readerProps} book={khutbahNikah1Data} pageId={page} />;
  if (page === 'khutbah-nikah-2') return <ReaderView {...readerProps} book={khutbahNikah2Data} pageId={page} />;
  if (page === 'khutbah-nikah-3') return <ReaderView {...readerProps} book={khutbahNikah3Data} pageId={page} />;
  if ((page as string) === 'doa-nikah-syaikhona-kholil') return <ReaderView {...readerProps} book={doaNikahSyaikhonaKholilData} pageId={page} />;
  if (page === 'shighot-nikah') return <ReaderView {...readerProps} book={shighotNikahData} pageId={page} />;
  if ((page as string) === 'hamil' || (page as string) === 'doa-hamil') return <ReaderView {...readerProps} book={doaHamilData} pageId={page} />;
  if ((page as string) === 'tahlil') return <ReaderView {...readerProps} book={tahlilData} pageId="tahlil" />;
  if ((page as string) === 'talqin') return <ReaderView {...readerProps} book={talqinData} pageId="talqin" />;
  if ((page as string) === 'doa-jenazah-anak') return <ReaderView {...readerProps} book={doaJenazahAnak} pageId={page} />;
  if ((page as string) === 'about') return <AboutPage darkMode={prefs.darkMode} onBack={handleBack} />;

  return (
    <>
      <Dashboard onNavigate={handleNavigate} darkMode={prefs.darkMode} onToggleDark={toggleDarkMode} />
      <FloatingNavbar active={page} onNavigate={handleNavigate} darkMode={prefs.darkMode} />
    </>
  );
}
