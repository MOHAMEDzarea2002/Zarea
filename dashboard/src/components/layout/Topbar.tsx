import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logoutUser } from '../../features/auth/authThunk';

export default function Topbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login', { replace: true });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6">
      <p className="text-sm text-muted">
        Signed in as <span className="font-medium text-ink">{user?.name}</span>
      </p>

      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-ink transition-colors hover:bg-canvas"
      >
        <LogOut size={16} strokeWidth={1.5} />
        Sign out
      </button>
    </header>
  );
}
