import { useEffect, useRef, useState } from 'react';
import { Home, Clock3, BookOpen, Compass, CalendarDays } from 'lucide-react';
import type { PageId } from '@/types';

interface Props {
  active: PageId;
  onNavigate: (page: PageId) => void;
  darkMode: boolean;
}

const ITEMS: Array<{ id: PageId; label: string; Icon: typeof Home }> = [
  { id: 'home', label: 'Beranda', Icon: Home },
  { id: 'adzan-sholat', label: 'Adzan', Icon: Clock3 },
  { id: 'quran', label: "Qur'an", Icon: BookOpen },
  { id: 'kiblat', label: 'Kiblat', Icon: Compass },
  { id: 'kalender-hijriyah', label: 'Kalender', Icon: CalendarDays },
];

export default function FloatingNavbar({ active, onNavigate, darkMode }: Props) {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;
        if (Math.abs(delta) > 6) {
          if (y < 24) setVisible(true);
          else if (delta > 0) setVisible(false);
          else setVisible(true);
          lastY.current = y;
        }
        ticking.current = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed left-1/2 z-40 -translate-x-1/2 transition-all duration-300 ease-out ${
        visible ? 'bottom-4 translate-y-0 opacity-100' : '-bottom-2 translate-y-full opacity-0 pointer-events-none'
      }`}
      aria-label="Navigasi utama"
    >
      <div
        className={`flex items-center gap-0.5 rounded-full px-1.5 py-1.5 border shadow-xl backdrop-blur-xl ${
          darkMode
            ? 'bg-slate-900/70 border-white/10 shadow-black/30'
            : 'bg-white/70 border-white/60 shadow-emerald-900/10'
        }`}
        style={{ WebkitBackdropFilter: 'blur(16px)' }}
      >
        {ITEMS.map(({ id, label, Icon }) => {
          const isActive = active === id || (id === 'home' && active === 'dashboard');
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center justify-center min-w-[52px] px-2 py-1.5 rounded-full transition-all ${
                isActive
                  ? darkMode
                    ? 'bg-amber-400/20 text-amber-300'
                    : 'bg-emerald-700 text-white shadow-sm'
                  : darkMode
                    ? 'text-slate-300 hover:bg-white/5'
                    : 'text-slate-600 hover:bg-emerald-50'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="text-[9px] font-medium mt-0.5 leading-none">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
