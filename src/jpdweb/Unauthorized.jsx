// Unauthorized.jsx
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <ShieldAlert className="text-red-600" size={50} />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          403
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Truy cập bị từ chối
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Bạn không có quyền truy cập vào trang này. Trang này chỉ dành cho quản trị viên hệ thống.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all"
          >
            <Home size={20} />
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}