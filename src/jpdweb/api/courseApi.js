// src/api/services/courseApi.js
import { apiclient } from './BaseApi';
import { callApi } from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

export const courseApi = {
    /**
     * Lấy chi tiết khóa học
     * @param {number} id - ID khóa học
     */
    getCourseDetail: (id) => {
        return callApi(
            () => apiclient.get(
                API_ENDPOINTS.COURSE.GET_DETAIL.replace(':id', id)
            ),
            { errorMessage: 'Không thể lấy chi tiết khóa học' }
        );
    },

    /**
     * Tìm kiếm khóa học
     * @param {string} keyword - Từ khóa tìm kiếm
     */
    searchCourse: (keyword,page,size) => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.COURSE.SEARCH, {
                params: { name: keyword ,
                    page:page,
                    size:size
                }
            }),
            { errorMessage: 'Không thể tìm kiếm khóa học' }
        );
    },

    /**
     * Lấy khóa học được khuyến nghị
     */
    getRecommendCourses: () => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.COURSE.GET_RECOMMEND),
            { errorMessage: 'Không thể lấy khóa học được khuyến nghị' }
        );
    }
};