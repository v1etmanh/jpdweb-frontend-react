import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './security/Authentication';
import { getCreatorAccount } from './api/ApiConnect';
import { useEffect } from 'react';

function CreatorProtectedRoute({ children }) {
  const { isAuthentication, isLoading, isCreator,setCreatorInfor ,creatorInfor} = useAuth();
  const location = useLocation();
useEffect(() => {
    const fetchCreator = async () => {
      if (!creatorInfor && isAuthentication && isCreator) {
        try {
          const response = await getCreatorAccount();
          setCreatorInfor(response.data);
          console.log(response.data)
        } catch (error) {
          console.error("Error fetching creator account:", error);
        }
      }
    };
    fetchCreator();
  }, [creatorInfor, isAuthentication, isCreator, setCreatorInfor]);
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

  // Nếu đã đăng nhập nhưng không phải creator, redirect tới upload_profile
  if (!isCreator) {
    return <Navigate to="/upload_profile" replace />;
  }

  // Nếu đã đăng nhập và là creator, hiển thị component con
  return children;
}

export default CreatorProtectedRoute;