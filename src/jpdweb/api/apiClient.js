// src/api/apiClient.js
import { notification ,Modal,message } from 'antd';
import {apiclient} from "./BaseApi"

export const API_RESPONSE_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    VALIDATION_ERROR: 'validation_error',
    NOT_FOUND: 'not_found',
    CONFLICT: 'conflict',
    UNAUTHORIZED: 'unauthorized',
    SERVER_ERROR: 'server_error'
};

/**
 * Wrapper chung cho tất cả API calls
 * @param {Function} apiFunc - Hàm gọi API
 * @param {Object} options - { showNotification, errorMessage, shouldThrow, logError }
 */
export async function callApi(apiFunc, options = {}) {
    const {
        showNotification = true,
        errorMessage = 'Có lỗi xảy ra',
        shouldThrow = false,
        logError = true
    } = options;

    try {
         const response = await apiFunc();
         console.log(response)
    // Nếu đến đây nghĩa là status đã 2xx rồi (axios tự động throw error nếu >= 400)
    return {
        success: true,
        status: response.status,
        code: 'SUCCESS',
        data: response.data,
        message: 'Thành công'
    }

    } catch (error) {
        const errorResponse = error.response?.data;
        const status = error.response?.status || 500;
        
        let responseType = API_RESPONSE_TYPES.SERVER_ERROR;
        let userMessage = errorMessage;
        
        if (errorResponse) {
            userMessage = errorResponse.userMessage || errorResponse.message || errorMessage;
            
            if (status === 400) {
                responseType = errorResponse.code === 'VALIDATION_ERROR' 
                    ? API_RESPONSE_TYPES.VALIDATION_ERROR 
                    : API_RESPONSE_TYPES.ERROR;
            } else if (status === 401) {
                responseType = API_RESPONSE_TYPES.UNAUTHORIZED;
            } else if (status === 404) {
                responseType = API_RESPONSE_TYPES.NOT_FOUND;
            } else if (status === 409) {
                responseType = API_RESPONSE_TYPES.CONFLICT;
            } else if (status >= 500) {
                responseType = API_RESPONSE_TYPES.SERVER_ERROR;
            }
        }
        
        if (logError) {
            console.error('🔴 API Error:', {
                status,
                code: errorResponse?.code,
                message: errorResponse?.message,
                traceId: errorResponse?.traceId,
                details: errorResponse?.details
            });
        }
        
        if (showNotification) {
            showErrorNotification(userMessage, errorResponse?.traceId);
        }
        
        const errorObj = {
            success: false,
            status,
            code: errorResponse?.code || 'UNKNOWN_ERROR',
            message: userMessage,
            traceId: errorResponse?.traceId,
            details: errorResponse?.details,
            responseType
        };
        
        if (shouldThrow) {
            throw errorObj;
        }
        
        return errorObj;
    }
}

export function showErrorNotification(message, traceId) {
    const description = traceId ? `ID: ${traceId}` : '';
    
    notification.error({
        message: '❌ Lỗi',
        description: `${message}\n${description}`,
        duration: 4.5,
        top: 60
    });
}

export function showSuccessNotification(message) {
    notification.success({
        message: '✅ Thành công',
        description: message,
        duration: 3,
        top: 60
    });
}

export function showWarningNotification(message) {
    notification.warning({
        message: '⚠️ Cảnh báo',
        description: message,
        duration: 3,
        top: 60
    });
}
export function showErrorUI(message1, traceId, type = 'notification') {
    const description = traceId ? `Trace ID: ${traceId}` : '';
    
    switch (type) {
        case 'message':
            // Message - tối giản nhất
            message.error(message1);
            break;
            
        case 'modal':
            // Modal - cần user xác nhận
            Modal.error({
                title: 'Lỗi',
                content: (
                    <div>
                        <p>{message1}</p>
                        {description && <p style={{ fontSize: '12px', color: '#999' }}>{description}</p>}
                    </div>
                )
            });
            break;
            
        case 'notification':
        default:
            // Notification - mặc định (UX tốt nhất)
            notification.error({
                message: 'Lỗi',
                description: `${message1}${description ? '\n' + description : ''}`,
                duration: 4.5,
                placement: 'top'
            });
    }
}