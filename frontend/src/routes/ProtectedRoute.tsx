import { Navigate, Outlet, useLocation } from 'react-router';
import { useSelector } from 'react-redux';

export default function ProtectedRoute() {
  const location = useLocation();
  const { user, initialized } = useSelector((state: any) => state.auth);

  // لسه مستنيين السيرفر يقول العميل داخل ولا لأ (fetchMe)
  if (!initialized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
        <span className="h-6 w-6 animate-spin rounded-full border border-primary/20 border-t-accent" />
      </div>
    );
  }

  // مش داخل: حوّله لـ login وافتكر كان رايح فين
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
