import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../features/auth/authThunk';
import { clearAuthError } from '../features/auth/authSlice';

export default function LoginPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();
  const location = useLocation();
  const { user, status, error } = useSelector((state: any) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // امسح أي خطأ قديم لما الصفحة تفتح
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // لو داخل (أو لسه عامل login) رجّعه للصفحة اللي كان رايحلها
  const from = location.state?.from;
  const target = from ? `${from.pathname}${from.search ?? ''}` : '/';
  if (user) return <Navigate to={target} replace />;

  const isLoading = status === 'loading';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email: email.trim(), password }));
  };

  return (
    <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-16 font-body text-primary">
      <div className="w-full max-w-md">
        <header className="text-center">
          <span aria-hidden="true" className="mx-auto mb-6 block h-px w-10 bg-accent" />
          <h1 className="font-heading text-5xl font-medium tracking-tight">
            <Trans
              i18nKey="auth.login.title"
              components={{ accent: <em className="font-normal italic text-accent" /> }}
            />
          </h1>
          <p className="mt-4 text-primary/70">{t('auth.login.subtitle')}</p>
        </header>

        <form onSubmit={handleSubmit} className="mt-12 space-y-6" noValidate>
          {error && (
            <p role="alert" className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="email" className="text-xs font-medium uppercase tracking-[0.2em] text-primary/70">
              {t('auth.email')}
            </label>
            <input
              id="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border border-primary/20 bg-white px-4 py-3 text-start text-sm transition-colors focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-xs font-medium uppercase tracking-[0.2em] text-primary/70">
              {t('auth.password')}
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                dir="ltr"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-primary/20 bg-white px-4 py-3 pe-12 text-start text-sm transition-colors focus:border-accent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-primary/50 transition-colors hover:text-accent"
              >
                {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-primary px-8 py-4 text-sm font-medium uppercase tracking-[0.15em] text-secondary transition-colors duration-300 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? t('auth.login.submitting') : t('auth.login.submit')}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-primary/70">
          {t('auth.login.noAccount')}{' '}
          <Link
            to="/register"
            state={location.state}
            className="font-medium text-primary underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            {t('auth.login.createOne')}
          </Link>
        </p>
      </div>
    </section>
  );
}
