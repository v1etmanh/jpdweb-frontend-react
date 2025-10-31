// AdminRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./security/Authentication";
import { Loader2 } from "lucide-react";

export default function AdminRoute({ children }) {
  const { isAuthentication, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (!isAuthentication) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}