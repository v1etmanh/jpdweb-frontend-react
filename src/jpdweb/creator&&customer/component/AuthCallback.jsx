// src/components/auth/AuthCallback.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleAuthCallback } from "../../api/core/KeycloakService";
import { Loader } from "lucide-react";

export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const processCallback = async () => {
            const code = searchParams.get('code');
            const state = searchParams.get('state');

            console.log('📥 Callback params:', { 
                hasCode: !!code, 
                hasState: !!state 
            });

            if (!code || !state) {
                setError('Missing authentication parameters');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            try {
                const success = await handleAuthCallback(code, state);
                
                if (success) {
                    console.log('✅ Authentication successful!');
                    
                    const redirectPath = sessionStorage.getItem('auth_redirect') || '/';
                    sessionStorage.removeItem('auth_redirect');
                    
                    console.log('🔄 Redirecting to:', redirectPath);
                    
                    // ✅ Force reload để AuthProvider load lại user
                    window.location.href = redirectPath;
                } else {
                    throw new Error('Authentication failed');
                }
            } catch (error) {
                console.error('❌ Callback error:', error);
                setError(error.message);
                setTimeout(() => navigate('/login'), 2000);
            }
        };

        processCallback();
    }, [searchParams, navigate]);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                    
                    <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-lg text-gray-700 font-semibold">Authenticating...</p>
                <p className="text-sm text-gray-500 mt-2">Please wait...</p>
            </div>
        </div>
    );
}