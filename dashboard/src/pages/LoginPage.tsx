import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginUser, logoutUser } from '../features/auth/authThunk';
import { clearAuthError } from '../features/auth/authSlice';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, status, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleError, setRoleError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from ?? '/';

  // لو الأدمن داخل أصلاً، ما يعرضش صفحة الدخول
  if (user?.role === 'admin') return <Navigate to={from} replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRoleError(null);
    dispatch(clearAuthError());

    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      // الداشبورد للأدمن بس
      if (result.payload.user.role !== 'admin') {
        await dispatch(logoutUser());
        setRoleError('This account does not have dashboard access.');
        return;
      }
      navigate(from, { replace: true });
    }
  };

  const isLoading = status === 'loading';
  const message = roleError ?? error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 font-body text-ink">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="text-xl font-semibold">Zarea Admin</h1>
        <p className="mt-1 text-sm text-muted">Sign in to manage your store.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </label>

          {message && (
            <p role="alert" className="text-sm text-status-cancelled">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
