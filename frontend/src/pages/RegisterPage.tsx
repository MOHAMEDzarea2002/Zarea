import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import { registerUser } from '../features/auth/authThunk';
import { clearAuthError } from '../features/auth/authSlice';

const inputClass =
  'mt-2 w-full border border-primary/20 bg-white px-4 py-3 text-sm transition-colors focus:border-accent focus:outline-none';
const labelClass = 'text-xs font-medium uppercase tracking-[0.2em] text-primary/70';

export default function RegisterPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();
  const location = useLocation();
  const { user, status, error } = useSelector((state: any) => state.auth);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const from = location.state?.from;
  const target = from ? `${from.pathname}${from.search ?? ''}` : '/';
  if (user) return <Navigate to={target} replace />;

  const isLoading = status === 'loading';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password.length < 8) {
      setFormError(t('auth.register.passwordShort'));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setFormError(t('auth.register.passwordMismatch'));
      return;
    }

    dispatch(
      registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      }),
    );
  };

  const message = formError ?? error;
  const canSubmit =
    form.name && form.email && form.phone && form.password && form.confirmPassword;

  return (
    <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-16 font-body text-primary">
      <div className="w-full max-w-md">
        <header className="text-center">
          <span aria-hidden="true" className="mx-auto mb-6 block h-px w-10 bg-accent" />
          <h1 className="font-heading text-5xl font-medium tracking-tight">
            <Trans
              i18nKey="auth.register.title"
              components={{ accent: <em className="font-normal italic text-accent" /> }}
            />
          </h1>
          <p className="mt-4 text-primary/70">{t('auth.register.subtitle')}</p>
        </header>

        <form onSubmit={handleSubmit} className="mt-12 space-y-6" noValidate>
          {message && (
            <p role="alert" className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {message}
            </p>
          )}

          <div>
            <label htmlFor="name" className={labelClass}>
              {t('auth.register.fullName')}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={form.name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              {t('auth.email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              className={`${inputClass} text-start`}
            />
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>
              {t('auth.register.phone')}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              dir="ltr"
              autoComplete="tel"
              required
              value={form.phone}
              onChange={handleChange}
              className={`${inputClass} text-start`}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              {t('auth.password')}
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                dir="ltr"
                autoComplete="new-password"
                required
                value={form.password}
                onChange={handleChange}
                className={`${inputClass} pe-12 text-start`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                className="absolute end-3 top-1/2 mt-1 -translate-y-1/2 text-primary/50 transition-colors hover:text-accent"
              >
                {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelClass}>
              {t('auth.register.confirmPassword')}
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              dir="ltr"
              autoComplete="new-password"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              className={`${inputClass} text-start`}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !canSubmit}
            className="w-full bg-primary px-8 py-4 text-sm font-medium uppercase tracking-[0.15em] text-secondary transition-colors duration-300 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? t('auth.register.submitting') : t('auth.register.submit')}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-primary/70">
          {t('auth.register.haveAccount')}{' '}
          <Link
            to="/login"
            state={location.state}
            className="font-medium text-primary underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            {t('auth.register.signIn')}
          </Link>
        </p>
      </div>
    </section>
  );
}
