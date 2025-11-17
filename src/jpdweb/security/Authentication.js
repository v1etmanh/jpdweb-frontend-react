// src/security/Authentication.js
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { 
    checkAuthentication, 
    logOutKeycloak, 
    refreshAuthToken, 
    initiateLogin 
} from "../api/core/KeycloakService";
import { customerApi } from "../api/customer/customerApi";


export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
    const [isAuthentication, setAuthentication] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState(null);
    const [isCreator, setCreator] = useState(false);
    const [creatorInfor, setCreatorInfor] = useState(null);
    const [isAdmin, setAdmin] = useState(false);
 
    /**
     * Logout user
     */
    const handleLogout = useCallback(async () => {
        console.log('🚪 Logging out...');
        
        // ✅ Clear refresh interval
        if (refreshInterval) {
            clearInterval(refreshInterval);
            setRefreshInterval(null);
        }
        
        // ✅ Reset state
        setAuthentication(false);
        setAdmin(false);
        setUser(null);
        setCreator(false);
        setCreatorInfor(null);
        
        // ✅ Call logout API (revoke token + clear cookies)
        await logOutKeycloak();
    }, [refreshInterval]);

    /**
     * Refresh token
     */
    const refreshToken = useCallback(async () => {
        try {
            const success = await refreshAuthToken();
            
            if (success) {
                console.log('✅ Token refreshed successfully');
                return true;
            } else {
                console.log('❌ Token refresh failed - logging out');
                await handleLogout();
                return false;
            }
        } catch (error) {
            console.error("❌ Failed to refresh token:", error);
            await handleLogout();
            return false;
        }
    }, [handleLogout]);

    /**
     * Setup auto refresh token
     * Refresh mỗi 4 phút (token expire sau 5 phút)
     */
    const setUpAutoRefresh = useCallback(() => {
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }
        
        const interval = setInterval(async () => {
            console.log('🔄 Auto refreshing token...');
            await refreshToken();
        }, 4 * 60 * 1000); // 4 phút
        
        setRefreshInterval(interval);
        console.log('⏰ Auto refresh scheduled');
    }, [refreshToken, refreshInterval]);

    /**
     * Load user info sau khi authenticated
     */
    const authenticateUser = useCallback(async () => {
        try {
            console.log('👤 Loading user information...');

            // ✅ Get account info - cookie tự động gửi
            const response = await customerApi.getAccount();
            const userData = response.data;
            
            console.log('📝 User data loaded:', userData);

            // ✅ Update state
            setUser(userData);
            setAuthentication(true);
            setCreator(userData.creator || false);
            setCreatorInfor(userData.creatorInfo || null);
            
            const isAdminUser = userData.admin;
            setAdmin(isAdminUser);
            
            console.log('👑 Admin status:', isAdminUser);
            console.log('✨ Creator status:', userData.creator);

            // ✅ Setup auto refresh
            setUpAutoRefresh();
            
            console.log("✅ User authenticated successfully");
            if(isAdmin)
            {
             window.location.href = "/admin/app_overview";
            }
            
        } catch (error) {
            console.error("❌ Failed to load user info:", error);
            await handleLogout();
        }
    }, [setUpAutoRefresh, handleLogout]);

    /**
     * Initiate login flow
     */
    const login = useCallback(async (redirectPath = '/') => {
        try {
            console.log('🔐 Starting login flow...');
            await initiateLogin(redirectPath);
        } catch (error) {
            console.error("❌ Login initiation failed:", error);
            throw error;
        }
    }, []);

    /**
     * Initialize authentication on app load
     */
    useEffect(() => {
        const initAuth = async () => {
            console.log('🚀 Initializing authentication...');
            
            try {
                // ✅ Check nếu đã có valid session (cookie)
                const isAuth = await checkAuthentication();

                if (isAuth) {
                    console.log("✅ Valid session found");
                    await authenticateUser();
                } else {
                    console.log("⚠️ No valid session");
                }
            } catch (error) {
                console.error("❌ Auth initialization error:", error);
            } finally {
                setIsLoading(false);
                console.log('✓ Auth initialization complete');
            }
        };

        initAuth();

        // ✅ Cleanup on unmount
        return () => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        };
    }, []); // ✅ Empty deps - chỉ chạy 1 lần

    // ✅ Context value
    const contextValue = {
        isAuthentication,
        setAuthentication,
        user,
        setUser,
        isLoading,
        handleLogout,
        refreshToken,
        login,
        isCreator,
        setCreator,
        setCreatorInfor,
        creatorInfor,
        isAdmin
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}