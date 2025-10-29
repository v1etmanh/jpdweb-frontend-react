import { apiclient } from './BaseApi';
import { callApi } from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

export const adminTransactionApi = {
    /**
     * 📋 Lấy danh sách giao dịch (có thể lọc theo trạng thái, từ khóa, phân trang)
     * @param {Object} params - { status, search, page, size }
     */
    getTransactionList: (params = {}) => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.ADMIN_TRANSACTION.GET_TRANSACTIONS, { params }),
            { errorMessage: 'Không thể tải danh sách giao dịch' }
        );
    },

    /**
     * 🔍 Lấy chi tiết một giao dịch cụ thể
     * @param {number} transactionId
     */
    getTransactionDetail: (transactionId) => {
        return callApi(
            () => apiclient.get(
                API_ENDPOINTS.ADMIN_TRANSACTION.GET_TRANSACTION_DETAIL.replace(':transactionId', transactionId)
            ),
            { errorMessage: `Không thể tải chi tiết giao dịch ID: ${transactionId}` }
        );
    },

    /**
     * 💰 Lấy báo cáo doanh thu tổng hợp (theo ngày / tháng / năm)
     * @param {Object} params - { fromDate, toDate, type }
     */
    getRevenueReport: (params = {}) => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.ADMIN_TRANSACTION.GET_REVENUE_REPORT, { params }),
            { errorMessage: 'Không thể tải báo cáo doanh thu' }
        );
    },

    /**
     * ⚠️ Lấy danh sách giao dịch thất bại
     * @param {Object} params - { page, size }
     */
    getFailedTransactions: (params = {}) => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.ADMIN_TRANSACTION.GET_FAILED_TRANSACTIONS, { params }),
            { errorMessage: 'Không thể tải danh sách giao dịch thất bại' }
        );
    },

    /**
     * 🧊 Đóng băng doanh thu của một Creator
     * @param {number} creatorId
     * @param {string} reason
     */
    freezeCreatorRevenue: (creatorId, reason) => {
        return callApi(
            () => apiclient.post(API_ENDPOINTS.ADMIN_TRANSACTION.FREEZE_CREATOR_REVENUE, {
                creatorId,
                reason
            }),
            {
                errorMessage: 'Không thể đóng băng doanh thu của Creator',
                showNotification: true
            }
        );
    },

    /**
     * 🔓 Gỡ đóng băng doanh thu của một Creator
     * @param {number} creatorId
     * @param {string} reason
     */
    unfreezeCreatorRevenue: (creatorId, reason) => {
        return callApi(
            () => apiclient.post(API_ENDPOINTS.ADMIN_TRANSACTION.UNFREEZE_CREATOR_REVENUE, {
                creatorId,
                reason
            }),
            {
                errorMessage: 'Không thể gỡ đóng băng doanh thu của Creator',
                showNotification: true
            }
        );
    },

    /**
     * 📊 Xuất báo cáo giao dịch theo tháng (Excel)
     * @param {string} month - dạng '2025-10'
     */
    exportExcelMonthly: (month) => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.ADMIN_TRANSACTION.EXPORT_EXCEL_MONTHLY, {
                params: { month },
                responseType: 'blob'
            }),
            {
                errorMessage: 'Không thể xuất Excel theo tháng',
                showNotification: true
            }
        );
    },

    /**
     * 📈 Xuất báo cáo giao dịch theo quý (Excel)
     * @param {string} quarter - ví dụ 'Q1-2025'
     */
    exportExcelQuarterly: (quarter) => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.ADMIN_TRANSACTION.EXPORT_EXCEL_QUARTERLY, {
                params: { quarter },
                responseType: 'blob'
            }),
            {
                errorMessage: 'Không thể xuất Excel theo quý',
                showNotification: true
            }
        );
    },

    /**
     * 🗓️ Xuất báo cáo giao dịch theo năm (Excel)
     * @param {string} year - ví dụ '2025'
     */
    exportExcelYearly: (year) => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.ADMIN_TRANSACTION.EXPORT_EXCEL_YEARLY, {
                params: { year },
                responseType: 'blob'
            }),
            {
                errorMessage: 'Không thể xuất Excel theo năm',
                showNotification: true
            }
        );
    },
};