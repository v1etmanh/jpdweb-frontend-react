import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../security/Authentication";
import { useEffect, useRef, useState } from "react";
import { Loader } from "lucide-react";

export default function LoginComponent() {
    const { isAuthentication, login, isLoading, isAdmin } = useAuth();
    const nav = useNavigate();
    const location = useLocation();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [error, setError] = useState(null);
    const hasAttemptedLogin = useRef(false); // ✅ Tránh gọi login nhiều lần

    // ✅ Lấy path để redirect sau khi login (default: "/")
    const from = location.state?.from?.pathname || "/";

    // ✅ Effect 1: Redirect nếu đã authenticated
    useEffect(() => {
        if (isAuthentication && !isLoading) {
            console.log('✅ User already authenticated, redirecting...');
            
            if (isAdmin) {
                nav("/admin/app_overview", { replace: true });
            } else {
                nav(from, { replace: true });
            }
        }
    }, [isAuthentication, isLoading, isAdmin, nav, from]);

    // ✅ Effect 2: Initiate login - CHỈ CHẠY 1 LẦN
    useEffect(() => {
        // Nếu đã authenticated, đang loading, hoặc đã thử login → skip
        if (isAuthentication || isLoading || hasAttemptedLogin.current) {
            return;
        }

        const handleLogin = async () => {
            // ✅ Đánh dấu đã thử login
            hasAttemptedLogin.current = true;
            setIsLoggingIn(true);
            
            try {
                console.log('🔐 Starting login process...');
                console.log('📍 Will redirect to:', from, 'after login');
                
                // ✅ Gọi login function từ AuthContext
                // Function này sẽ redirect đến Keycloak
                await login(from);
                
                // ✅ Code sau đây KHÔNG BAO GIỜ chạy vì đã redirect
                // Nhưng để đề phòng trường hợp login return mà không redirect:
                console.log('⚠️ Login function returned without redirect');
                
            } catch (error) {
                console.error("❌ Login initiation failed:", error);
                setError(error.message || "Không thể kết nối đến Keycloak");
                setIsLoggingIn(false);
                hasAttemptedLogin.current = false; // ✅ Reset để có thể retry
            }
        };

        handleLogin();
    }, [isAuthentication, isLoading, from, login]);

    // ✅ UI: Hiển thị lỗi
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
                    <div className="text-red-600 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Lỗi đăng nhập</h2>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            hasAttemptedLogin.current = false;
                            setIsLoggingIn(false);
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    // ✅ UI: Đang check authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                    <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-700">Đang kiểm tra xác thực...</p>
                    <p className="text-sm text-gray-500 mt-2">Vui lòng đợi...</p>
                </div>
            </div>
        );
    }

    // ✅ UI: Đang login (redirect đến Keycloak)
    if (isLoggingIn) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                    <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-700 font-semibold">Đang chuyển hướng đến Keycloak...</p>
                    <p className="text-sm text-gray-500 mt-2">Vui lòng đợi trong giây lát</p>
                </div>
            </div>
        );
    }

    // ✅ Fallback UI (không bao giờ thấy trong normal flow)
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Yêu cầu đăng nhập</h2>
                <p className="text-gray-600">Đang chuẩn bị chuyển hướng...</p>
            </div>
        </div>
    );
}