import { apiclient } from './BaseApi';
import { callApi } from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

export const adminApi = {
    /**
     * Lấy danh sách creator (phân trang, lọc theo status, tìm kiếm)
     * @param {Object} params - { status, search, page, size }
     */
    getCreatorList: (params = {}) => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.ADMIN.GET_CREATORS, { params }),
            { errorMessage: 'Không thể tải danh sách Creator' }
        );
    },

    /**
     * Lấy chi tiết thông tin một creator
     * @param {number} creatorId
     */
    getCreatorDetail: (creatorId) => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.ADMIN.GET_CREATOR_DETAIL.replace(':creatorId', creatorId)),
            { errorMessage: `Không thể tải chi tiết Creator ID: ${creatorId}` }
        );
    },

    /**
     * Lấy danh sách chứng chỉ đang chờ duyệt
     */
    getPendingCertificates: () => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.ADMIN.GET_PENDING_CERTIFICATES),
            { errorMessage: 'Không thể tải danh sách chứng chỉ chờ duyệt' }
        );
    },

    /**
     * Duyệt chứng chỉ của Creator
     * @param {number} creatorId 
     * @param {string} adminNote - Ghi chú admin
     */
    approveCertificate: (creatorId, adminNote) => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.ADMIN.APPROVE_CERTIFICATE.replace(':creatorId', creatorId),
                null,
                { params: { adminNote } }
            ),
            { 
                errorMessage: 'Không thể duyệt chứng chỉ',
                showNotification: true
            }
        );
    },

    /**
     * Từ chối chứng chỉ của Creator
     * @param {number} creatorId
     * @param {string} reason
     */
    rejectCertificate: (creatorId, reason) => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.ADMIN.REJECT_CERTIFICATE.replace(':creatorId', creatorId),
                { reason }
            ),
            { 
                errorMessage: 'Không thể từ chối chứng chỉ',
                showNotification: true
            }
        );
    },

    /**
     * Cảnh cáo creator
     * @param {number} creatorId
     * @param {string} reason
     */
    warnCreator: (creatorId, reason) => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.ADMIN.WARN_CREATOR.replace(':creatorId', creatorId),
                null,
                { params: { reason } }
            ),
            { 
                errorMessage: 'Không thể cảnh cáo Creator',
                showNotification: true
            }
        );
    },

    /**
     * Cấm Creator hoạt động
     * @param {number} creatorId
     * @param {Object} data - { reason, durationDays }
     */
    banCreator: (creatorId, data) => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.ADMIN.BAN_CREATOR.replace(':creatorId', creatorId),
                data
            ),
            { 
                errorMessage: 'Không thể cấm Creator',
                showNotification: true
            }
        );
    },

    /**
     * Gỡ cấm Creator
     * @param {number} creatorId
     * @param {string} reason
     */
    unbanCreator: (creatorId, reason = 'Unbanned by admin') => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.ADMIN.UNBAN_CREATOR.replace(':creatorId', creatorId),
                { reason }
            ),
            { 
                errorMessage: 'Không thể gỡ cấm Creator',
                showNotification: true
            }
        );
    },

    /**
     * Lấy lịch sử vi phạm của Creator
     * @param {number} creatorId
     */
    getCreatorViolations: (creatorId) => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.ADMIN.GET_CREATOR_VIOLATIONS.replace(':creatorId', creatorId)),
            { errorMessage: 'Không thể tải lịch sử vi phạm của Creator' }
        );
    },

    /**
     * Lấy nhật ký hoạt động (audit logs) của Creator
     * @param {number} creatorId
     */
    getCreatorAuditLogs: (creatorId) => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.ADMIN.GET_CREATOR_AUDIT_LOGS.replace(':creatorId', creatorId)),
            { errorMessage: 'Không thể tải nhật ký hoạt động của Creator' }
        );
    },
};