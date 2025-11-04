import { replace } from 'react-router-dom';
import {apiclient }from '../core/BaseApi';
import { callApi } from '../core/apiClient';
import { API_ENDPOINTS } from '../core/apiEndpoints';
export const kahootModuleContentApi = {
   

    /**
     * Cập nhật danh sách module content
     * @param {number} kahootId 
     * @param {Array} contents 
     */
    updateAll: (kahootId, contents) => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.KAHOOT_MODULE_CONTENT.UPDATE_ALL
                    .replace(':kahootId', kahootId),
                contents
            ),
            { 
                errorMessage: 'Không thể cập nhật nội dung Kahoot',
                showNotification: true
            }
        );
    },

    /**
     * Xóa một module content cụ thể
     * @param {number} kahootId 
     * @param {number} moduleContentId 
     */
    deleteOne: (kahootId, moduleContentId) => {
        return callApi(
            () => apiclient.delete(
                API_ENDPOINTS.KAHOOT_MODULE_CONTENT.DELETE_ONE
                    .replace(':kahootId', kahootId)
                    .replace(':moduleContentId', moduleContentId)
            ),
            { 
                errorMessage: 'Không thể xóa nội dung trong Kahoot',
                showNotification: true
            }
        );
    }
};
