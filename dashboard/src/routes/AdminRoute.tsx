import { Navigate, Outlet, useLocation } from 'react-router';
import { useAppSelector } from '../app/hooks';

export default function AdminRoute() {
  const { user, initialized } = useAppSelector((s) => s.auth);
  const location = useLocation();

  // نستنى لحد ما نعرف هل فيه جلسة ولا لأ
  if (!initialized) {
    return <div className="p-10 text-center text-sm text-gray-500">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
