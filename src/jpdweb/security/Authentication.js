import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiclient } from "../api/core/BaseApi";
import { getKeycloakInstance, logOutKeycloak } from "../api/core/KeycloakService";
import { getAccount } from "../api/ApiConnect";

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

    // ✅ Helper function để check admin role từ token
    const checkAdminRole = useCallback((token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const hasAdminRole = payload.realm_access?.roles?.includes('ADMIN') || false;
            console.log('🔐 Admin role check:', hasAdminRole);
            return hasAdminRole;
        } catch (error) {
            console.error("❌ Failed to decode token for admin check:", error);
            return false;
        }
    }, []);

    // Cleanup and logout
    const handleLogout = useCallback(() => {
        console.log('🚪 Logging out...');
        if (refreshInterval) {
            clearInterval(refreshInterval);
            setRefreshInterval(null);
        }
        // Clear auth state
        localStorage.removeItem("kc_token");
        localStorage.removeItem("kc_refreshToken");
        setAuthentication(false);
        setAdmin(false); // ✅ Reset admin state
        setUser(null);
        setCreator(false);
        setCreatorInfor(null);
        // Remove authorization header
        delete apiclient.defaults.headers.common['Authorization'];
        logOutKeycloak();
    }, [refreshInterval]);

    // Update token và admin status
    const updateToken = useCallback(async (token, refreshToken) => {
        const keycloak = await getKeycloakInstance();
        keycloak.token = token;
        keycloak.refreshToken = refreshToken;
        keycloak.tokenParsed = JSON.parse(atob(token.split(".")[1]));
        
        apiclient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem("kc_token", token);
        localStorage.setItem("kc_refreshToken", refreshToken);
        
        // ✅ Update admin status mỗi khi token được update
        const isAdminUser = checkAdminRole(token);
        setAdmin(isAdminUser);
        console.log('🔄 Token updated, admin status:', isAdminUser);
    }, [checkAdminRole]);

    // Refresh token
    const refreshToken = useCallback(async () => {
        try {
            const keycloak = await getKeycloakInstance();
const refreshed = await keycloak.updateToken(30);
            if (refreshed) {
                console.log('✅ Token refreshed successfully');
                await updateToken(keycloak.token, keycloak.refreshToken);
                return true;
            } else {
                console.log('✓ Token still valid');
                return true;
            }
        } catch (error) {
            console.error("❌ Failed to refresh token:", error);
            handleLogout();
            return false;
        }
    }, [updateToken, handleLogout]);

    // Auto refresh setup
    const setUpAutoRefresh = useCallback(() => {
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }
        const interval = setInterval(async () => {
            console.log('🔄 Auto refresh token...');
            await refreshToken();
        }, 240000); // 4 minutes
        setRefreshInterval(interval);
    }, [refreshToken, refreshInterval]);

    // Token expired handler setup
    const setUpTokenRefresh = useCallback(async () => {
        const keycloak = await getKeycloakInstance();
        keycloak.onTokenExpired = async () => {
            console.log("⏰ Token expired, refreshing...");
            await refreshToken();
        };
    }, [refreshToken]);

    // Authenticate user
    const authenticateUser = useCallback(async () => {
        try {
            const keycloak = await getKeycloakInstance();
            setAuthentication(true);
            apiclient.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;
            
            // ✅ Set admin status ngay khi authenticate
            const isAdminUser = checkAdminRole(keycloak.token);
            setAdmin(isAdminUser);
            console.log('👤 User authenticated, admin status:', isAdminUser);
            
            // Get account info
            const token = localStorage.getItem("kc_token");
            console.log('🔑 Current token:', token ? 'exists' : 'missing');
            
            const response = await getAccount();
            console.log('📝 Account data:', response.data);
            setUser(response.data);
            setCreator(response.data.creator);
            
            // Setup token refresh
            await setUpTokenRefresh();
            setUpAutoRefresh();
            console.log("✅ Authentication successful");
        } catch (error) {
            console.error("❌ Failed to get account info:", error);
            handleLogout();
        }
    }, [setUpTokenRefresh, setUpAutoRefresh, handleLogout, checkAdminRole]);

    // Check if token is valid
    const isTokenValid = useCallback((token) => {
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            const isValid = payload.exp > (currentTime + 60);
            console.log('🔍 Token valid:', isValid);
return isValid;
        } catch (error) {
            console.error("❌ Invalid token format:", error);
            return false;
        }
    }, []);

    // Login function
    const login = useCallback(async () => {
        try {
            setIsLoading(true);
            console.log('🔐 Starting login process...');
            const keycloak = await getKeycloakInstance();
            
            if (keycloak.token && keycloak.refreshToken) {
                await updateToken(keycloak.token, keycloak.refreshToken);
                await authenticateUser();
                console.log('✅ Login successful');
                return true;
            }
            console.log('❌ No token available');
            return false;
        } catch (error) {
            console.error("❌ Login failed:", error);
            handleLogout();
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [updateToken, authenticateUser, handleLogout]);

    // ✅ Initialize authentication on app start
    useEffect(() => {
        const initAuth = async () => {
            try {
                console.log('🚀 Initializing authentication...');
                const savedToken = localStorage.getItem("kc_token");
                const savedRefreshToken = localStorage.getItem("kc_refreshToken");
                
                if (savedToken && savedRefreshToken && isTokenValid(savedToken)) {
                    console.log("✅ Found valid saved token, restoring session");
                    
                    // ✅ Set admin status TRƯỚC khi authenticate
                    const isAdminUser = checkAdminRole(savedToken);
                    setAdmin(isAdminUser);
                    console.log('👑 Restored admin status:', isAdminUser);
                    
                    await updateToken(savedToken, savedRefreshToken);
                    await authenticateUser();
                } else {
                    console.log("⚠️ No valid saved token found");
                    if (savedToken || savedRefreshToken) {
                        localStorage.removeItem("kc_token");
                        localStorage.removeItem("kc_refreshToken");
                    }
                }
            } catch (error) {
                console.error("❌ Auth initialization error:", error);
                handleLogout();
            } finally {
                setIsLoading(false);
                console.log('✓ Auth initialization complete');
            }
        };
        
        initAuth();
        
        // Cleanup
        return () => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        };
    }, []); // ✅ Empty dependency array - chỉ chạy 1 lần khi mount

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
