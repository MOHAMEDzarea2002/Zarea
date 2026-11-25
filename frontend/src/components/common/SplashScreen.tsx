import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const MIN_SHOW_MS = 1000; // أقل مدة تظهر فيها الشاشة
const FADE_MS = 400;

export default function SplashScreen() {
  const { t } = useTranslation();
  const initialized = useSelector((s: any) => s.auth.initialized);
  const [minElapsed, setMinElapsed] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinElapsed(true), MIN_SHOW_MS);
    return () => clearTimeout(timer);
  }, []);

  const ready = Boolean(initialized) && minElapsed;

  // بعد ما تخلص الـ fade نشيل الشاشة من الـ DOM
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => setRemoved(true), FADE_MS);
    return () => clearTimeout(timer);
  }, [ready]);

  if (removed) return null;

  return (
    <div
      role="status"
      aria-label={t('common.loading')}
      className={`fixed inset-0 z-[70] flex items-center justify-center bg-secondary transition-opacity ease-out ${
        ready ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <svg viewBox="0 0 300 110" className="w-64 max-w-[70vw] text-primary" aria-hidden="true">
        <defs>
          {/* الحروف نفسها كـ clip path */}
          <clipPath id="logo-clip">
            <text
              x="150"
              y="88"
              textAnchor="middle"
              fontSize="92"
              className="font-heading"
              fontWeight="600"
              letterSpacing="6"
            >
              Zarea
            </text>
          </clipPath>
        </defs>

        {/* الحروف الفاضية: إطار خفيف عشان تفضل ظاهرة */}
        <text
          x="150"
          y="88"
          textAnchor="middle"
          fontSize="92"
          className="font-heading"
          fontWeight="600"
          letterSpacing="6"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="1"
        >
          Zarea
        </text>

        {/* اللون بيطلع من تحت لفوق جوه الحروف، وبعد ما يكمل بيفضل ثانية وبيتكرر */}
        <g clipPath="url(#logo-clip)">
          <rect x="0" y="0" width="300" height="110" className="fill-accent">
            <animate
              attributeName="y"
              values="110;0;0"
              keyTimes="0;0.8;1"
              dur="2.4s"
              repeatCount="indefinite"
            />
          </rect>
        </g>
      </svg>

      <span className="sr-only">{t('common.loading')}</span>
    </div>
  );
}
