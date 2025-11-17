// src/api/core/AuthInterceptor.js
import { apiclient } from "./BaseApi";

let isRefreshing = false;
let failedQueue = [];

/**
 * Xử lý queue các request đang chờ refresh token
 */
const processQueue = (error, success = false) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(success);
        }
    });
    failedQueue = [];
};

/**
 * Response Interceptor
 * - Tự động refresh token khi gặp 401
 * - Skip các endpoint auth để tránh infinite loop
 */
apiclient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // ✅ Danh sách endpoint BỎ QUA interceptor
        const skipInterceptorPaths = [
            '/api/auth/refresh',           // Tránh loop khi refresh fail
            '/api/auth/callback',          // Callback từ Keycloak
            '/api/auth/login-url',         // Get login URL
            '/api/auth/logout',            // Logout
            '/api/customer/account_infor'  // Check authentication (401 là bình thường)
        ];

        // ✅ Check nếu request thuộc skip list
        const shouldSkip = skipInterceptorPaths.some(path => 
            originalRequest.url?.includes(path)
        );

        // ✅ Nếu thuộc skip list → trả lỗi luôn, không xử lý
        if (shouldSkip) {
            return Promise.reject(error);
        }

        // ✅ Xử lý 401 cho các endpoint KHÁC
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            // ✅ Nếu đang refresh → đợi trong queue
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(() => {
                    console.log('🔄 Retry request after token refresh');
                    return apiclient(originalRequest);
                })
                .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                console.log('🔄 Refreshing token via interceptor...');
                
                // ✅ Gọi refresh endpoint - refresh_token tự động gửi qua cookie
                const refreshResponse = await apiclient.post('/api/auth/refresh');
                
                if (refreshResponse.data.success) {
                    console.log('✅ Token refreshed successfully');
                    
                    // ✅ Backend đã set cookie mới, giải phóng queue
                    processQueue(null, true);
                    
                    // ✅ Retry request gốc (với cookie mới)
                    return apiclient(originalRequest);
                } else {
                    throw new Error('Refresh failed');
                }
            } catch (refreshError) {
                console.error('❌ Token refresh failed:', refreshError);
                
                // ✅ Giải phóng queue với error
                processQueue(refreshError, false);
                
                // ✅ Clear storage
                sessionStorage.clear();
                localStorage.clear();
                
                // ✅ Redirect về login
                console.log('🚪 Redirecting to login...');
                window.location.href = '/login';
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiclient;