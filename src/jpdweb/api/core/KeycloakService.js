// src/api/core/KeycloakService.js
import { getAccount } from "../ApiConnect";
import { customerApi } from "../customer/customerApi";
import { apiclient } from "./BaseApi";

let isAuthenticated = false;

/**
 * Bắt đầu OAuth2 PKCE flow
 * @param {string} redirectAfterLogin - Path để redirect sau khi login thành công
 */
export const initiateLogin = async (redirectAfterLogin = '/') => {
    try {
        console.log('🔐 Initiating login...');
        console.log('📍 Will redirect to:', redirectAfterLogin);
        
        // ✅ Lưu redirect path
        sessionStorage.setItem('auth_redirect', redirectAfterLogin);
        
        // ✅ Redirect URI phải khớp với backend config
        const redirectUri = `${window.location.origin}/auth/callback`;
        console.log('🔗 OAuth redirect URI:', redirectUri);
        
        // ✅ Get login URL từ backend
        const response = await apiclient.get('/api/auth/login-url', {
            params: { redirectUri }
        });

        const { loginUrl, state } = response.data;
        console.log('✅ Login URL received');
        
        // ✅ Lưu state để verify sau
        sessionStorage.setItem('oauth_state', state);

        console.log('🚀 Redirecting to Keycloak...');
        
        // ✅ Redirect đến Keycloak login page
        window.location.href = loginUrl;
        
    } catch (error) {
        console.error("❌ Failed to initiate login:", error);
        console.error("Error details:", error.response?.data);
        throw error;
    }
};

/**
 * Xử lý callback từ Keycloak
 * @param {string} code - Authorization code
 * @param {string} state - State parameter để verify
 */
export const handleAuthCallback = async (code, state) => {
    try {
        console.log('🔄 Processing OAuth callback...');
        
        // ✅ Verify state để chống CSRF
        const savedState = sessionStorage.getItem('oauth_state');
        if (state !== savedState) {
            throw new Error('Invalid state parameter - possible CSRF attack');
        }
        console.log('✅ State verified');

        // ✅ Redirect URI phải khớp với lúc initiate
        const redirectUri = `${window.location.origin}/auth/callback`;
        
        // ✅ Gửi code để đổi lấy token
        // Backend sẽ set HttpOnly cookie tự động
        const response = await apiclient.post('/api/auth/callback', {
            code,
            state,
            redirectUri
        });

        console.log('✅ Authentication successful');
        console.log('📋 Response:', response.data);

        // ✅ Clean up
        sessionStorage.removeItem('oauth_state');

        if (response.data.success) {
            isAuthenticated = true;
            return true;
        }
        
        throw new Error('Callback response indicates failure');
        
    } catch (error) {
        console.error("❌ Auth callback failed:", error);
        console.error("Error details:", error.response?.data);
        
        // ✅ Clean up on error
        sessionStorage.removeItem('oauth_state');
        
        throw error;
    }
};

/**
 * Refresh access token
 * refresh_token được gửi tự động qua HttpOnly cookie
 */
export const refreshAuthToken = async () => {
    try {
        console.log('🔄 Refreshing token...');
        
        // ✅ refresh_token tự động gửi qua cookie
        const response = await apiclient.post('/api/auth/refresh');
        
        const success = response.data.success;
        
        if (success) {
            console.log('✅ Token refreshed successfully');
            isAuthenticated = true;
        } else {
            console.log('❌ Token refresh failed');
            isAuthenticated = false;
        }
        
        return success;
        
    } catch (error) {
        console.error("❌ Refresh token failed:", error);
        isAuthenticated = false;
        return false;
    }
};

/**
 * Logout - revoke token và clear cookies
 */
export const logOutKeycloak = async () => {
    try {
        console.log('🚪 Logging out...');
        
        // ✅ Backend sẽ revoke token ở Keycloak và clear cookies
        await apiclient.post('/api/auth/logout');
        
        console.log('✅ Logged out successfully');
        
    } catch (error) {
        console.error("❌ Logout failed:", error);
    } finally {
        // ✅ Always clean up local state
        isAuthenticated = false;
        sessionStorage.clear();
        
        // ✅ Redirect về login
        window.location.href = '/';
    }
};

/**
 * Check nếu user đang authenticated
 * Gọi endpoint cần authentication để verify cookie
 */
export const checkAuthentication = async () => {
    try {
        console.log('🔍 Checking authentication status...');
        
        // ✅ Gọi endpoint protected - cookie tự động gửi
        // Nếu cookie valid → 200, nếu không → 401
        const response = await getAccount()
        
        console.log('✅ User is authenticated');
        console.log('👤 User info:', response.data);
        
        isAuthenticated = true;
        return true;
        
    } catch (error) {
        // ✅ 401 là bình thường khi chưa login
        if (error.response?.status === 401) {
            console.log('⚠️ User is not authenticated (401)');
        } else {
            console.error('❌ Unexpected error checking auth:', error.message);
        }
        
        isAuthenticated = false;
        return false;
    }
};

/**
 * Get current authentication status (from memory)
 */
export const isUserAuthenticated = () => isAuthenticated;