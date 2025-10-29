import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './security/Authentication';

function ProtectedRoute({ children }) {
  const { isAuthentication, isLoading } = useAuth();
  const location = useLocation();

  // Hiển thị loading khi đang kiểm tra authentication
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Nếu chưa đăng nhập, redirect tới trang login
  if (!isAuthentication) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu đã đăng nhập, hiển thị component con
  return children;
}

export default ProtectedRoute;