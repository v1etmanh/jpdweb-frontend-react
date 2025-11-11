import { apiclient } from '../core/BaseApi';
import { callApi } from '../core/apiClient';
import { API_ENDPOINTS } from '../core/apiEndpoints';

export const adminCourseApi = {
    /**
     * Lấy danh sách khóa học (phân trang + tìm kiếm)
     * @param {number} page 
     * @param {number} size 
     * @param {string} search 
     */
    getAllCourses: (page = 0, size = 20, search = '') => {
        const url = `${API_ENDPOINTS.ADMIN_COURSE.GET_ALL}?page=${page}&size=${size}${search ? `&search=${search}` : ''}`;
        return callApi(
            () => apiclient.get(url),
            { errorMessage: 'Không thể tải danh sách khóa học' }
        );
    },

    /**
     * Lấy chi tiết khóa học
     * @param {number} courseId 
     */
    getCourseById: (courseId) => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.ADMIN_COURSE.GET_BY_ID.replace(':courseId', courseId)),
            { errorMessage: 'Không thể tải chi tiết khóa học' }
        );
    },

    /**
     * Khóa khóa học
     * @param {number} courseId 
     */
    banCourse: (courseId) => {
        return callApi(
            () => apiclient.post(API_ENDPOINTS.ADMIN_COURSE.BAN.replace(':courseId', courseId)),
            { errorMessage: 'Không thể khóa khóa học' }
        );
    },

    /**
     * Mở khóa khóa học
     * @param {number} courseId 
     */
    unbanCourse: (courseId) => {
        return callApi(
            () => apiclient.post(API_ENDPOINTS.ADMIN_COURSE.UNBAN.replace(':courseId', courseId)),
            { errorMessage: 'Không thể mở khóa khóa học' }
        );
    },
};
