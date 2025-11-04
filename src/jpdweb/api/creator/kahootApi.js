import { replace } from 'react-router-dom';
import {apiclient }from '../core/BaseApi';
import { callApi } from '../core/apiClient';
import { API_ENDPOINTS } from '../core/apiEndpoints';

export const kahootApi = {
    /**
     * Lấy tất cả Kahoot của creator hiện tại
     */
    getAll: () => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.KAHOOT.RETRIEVE_ALL),
            { errorMessage: 'Không thể lấy danh sách Kahoot' }
        );
    },

    /**
     * Lấy danh sách module content của một Kahoot
     * @param {number} kahootId - ID của Kahoot
     */
    getModuleContents: (kahootId) => {
        return callApi(
            () => apiclient.get(
                API_ENDPOINTS.KAHOOT.GET_MODULE_CONTENTS.replace(':kahootId', kahootId)
            ),
            { errorMessage: 'Không thể lấy danh sách nội dung module của Kahoot' }
        );
    },

    /**
     * Tạo một Kahoot mới
     * @param {string} title - Tiêu đề của Kahoot
     */
    create: (title) => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.KAHOOT.CREATE,
                null,
                { params: { title } }
            ),
            { 
                errorMessage: 'Không thể tạo Kahoot mới',
                showNotification: true
            }
        );
    },

    /**
     * Xóa một Kahoot
     * @param {number} kahootId - ID của Kahoot
     */
    delete: (kahootId) => {
        return callApi(
            () => apiclient.delete(
                API_ENDPOINTS.KAHOOT.DELETE.replace(':kahootId', kahootId)
            ),
            { 
                errorMessage: 'Không thể xóa Kahoot',
                showNotification: true
            }
        );
    },

    /**
     * Cập nhật tiêu đề Kahoot
     * @param {number} kahootId - ID của Kahoot
     * @param {string} newTitle - Tiêu đề mới
     */
    updateTitle: (kahootId, newTitle) => {
        return callApi(
            () => apiclient.put(
                API_ENDPOINTS.KAHOOT.UPDATE_TITLE.replace(':kahootID', kahootId),
                null,
                { params: { newTitle } }
            ),
            { 
                errorMessage: 'Không thể cập nhật tiêu đề Kahoot',
                showNotification: true
            }
        );
    }
};
