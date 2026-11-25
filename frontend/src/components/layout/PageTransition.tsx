import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';

const COLS = 6;
const ROWS = 8;
const COVER_MS = 350;
const REVEAL_MS = 350;
const STAGGER_COL_MS = 60; // التأخير بين الأعمدة
const STAGGER_ROW_MS = 40; // التأخير بين المربعات داخل العمود (من تحت لفوق)
const MAX_DELAY = (COLS - 1) * STAGGER_COL_MS + (ROWS - 1) * STAGGER_ROW_MS;

type Phase = 'idle' | 'cover' | 'reveal';

export default function PageTransition() {
  const { pathname } = useLocation();
  const [phase, setPhase] = useState<Phase>('idle');
  const isFirstRender = useRef(true);

  useEffect(() => {
    // ما نعملش انتقال عند أول تحميل للصفحة
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // لو المستخدم طالب تقليل الحركة، نتخطى الانتقال
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setPhase('cover');
    const t1 = setTimeout(() => setPhase('reveal'), COVER_MS + MAX_DELAY);
    const t2 = setTimeout(() => setPhase('idle'), COVER_MS + MAX_DELAY + REVEAL_MS + MAX_DELAY);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  const getTileStyle = (delay: number): React.CSSProperties => {
    const ease = 'cubic-bezier(0.7, 0, 0.2, 1)';

    if (phase === 'cover') {
      return {
        transform: 'scale(1)',
        transitionProperty: 'transform',
        transitionDuration: `${COVER_MS}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: ease,
      };
    }

    if (phase === 'reveal') {
      return {
        transform: 'scale(0)',
        transitionProperty: 'transform',
        transitionDuration: `${REVEAL_MS}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: ease,
      };
    }

    // idle: مخفية، من غير حركة
    return { transform: 'scale(0)', transitionProperty: 'none' };
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] flex overflow-hidden"
    >
      {Array.from({ length: COLS }).map((_, c) => (
        <div key={c} className="flex h-full flex-1 flex-col">
          {Array.from({ length: ROWS }).map((_, r) => {
            // r=0 فوق، فالتأخير بيبدأ من تحت (ROWS-1-r)
            const rowFromBottom = ROWS - 1 - r;
            const delay = c * STAGGER_COL_MS + rowFromBottom * STAGGER_ROW_MS;

            return (
              <div
                key={r}
                className="w-full flex-1 bg-accent"
                style={{ ...getTileStyle(delay), transformOrigin: 'center' }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
