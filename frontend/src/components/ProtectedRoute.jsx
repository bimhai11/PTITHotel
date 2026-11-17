import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/auth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <p className="loading-state" role="status">Đang kiểm tra phiên đăng nhập...</p>;
  return user ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
