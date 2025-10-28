// src/api/services/paymentApi.js
import { apiclient }  from './BaseApi';
import { callApi } from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

export const paymentApi = {
    /**
     * Tạo đơn hàng PayPal
     * @param {number} courseId - ID khóa học
     * @param {number} amount - Số tiền
     */
    createOrder: (courseId, amount) => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.PAYMENT.CREATE_ORDER.replace(':courseId', courseId),
                null,
                { params: { amount } }
            ),
            { 
                errorMessage: 'Không thể tạo đơn hàng',
                showNotification: true
            }
        );
    },
       /**
     * Tạo đơn hàng PayPal
     * @param {number} courseId - ID khóa học
     * @param {number} amount - Số tiền
     */
    createVNPAYOrder: (courseId, amount) => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.PAYMENT.VNPAY_ORDER.replace(':courseId', courseId),
                null,
                { params: { amount } }
            ),
            { 
                errorMessage: 'Không thể tạo đơn hàng',
                showNotification: true
            }
        );
    }
};