// src/api/services/kahootApi.js
import { apiclient } from '../core/BaseApi';
import { callApi } from '../core/apiClient';
import { API_ENDPOINTS } from '../core/apiEndpoints';

export const sessionApi = {
    /**
     * 🧩 Tạo session quiz mới
     * @param {Object} payload - Dữ liệu gửi lên server
     * @param {number} payload.kahootId - ID của kahoot
     * @param {string} payload.teacherName - Tên người tạo quiz
     */
    createSession: (payload) => {
        return callApi(
            () => apiclient.post(API_ENDPOINTS.KAHOOT_API.CREATE_SESSION, payload),
            { errorMessage: 'Không thể tạo phiên quiz mới' }
        );
    },

    /**
     * 🏆 Lấy kết quả cuối cùng của quiz
     * @param {string} sessionCode - Mã phiên quiz
     */
    getFinalResults: (sessionCode) => {
        return callApi(
            () => apiclient.get(
                API_ENDPOINTS.KAHOOT_API.GET_FINAL_RESULTS.replace(':sessionCode', sessionCode)
            ),
            { errorMessage: 'Không thể lấy kết quả cuối cùng của quiz' }
        );
    }
};
