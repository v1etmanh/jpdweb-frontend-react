// src/api/services/customerApi.js
import{ apiclient }  from '../core/BaseApi';
import { callApi } from '../core/apiClient';
import { API_ENDPOINTS } from '../core/apiEndpoints';

export const customerApi = {
    /**
     * Lấy thông tin tài khoản
     */
    getAccount: () => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.CUSTOMER.GET_ACCOUNT),
            { errorMessage: 'Không thể lấy thông tin tài khoản' }
        );
    },

    /**
     * Upload ảnh đại diện
     * @param {FormData} formData - Form data chứa file
     */
    uploadProfile: (formData) => {
        return callApi(
            () => apiclient.post(API_ENDPOINTS.CUSTOMER.UPLOAD_PROFILE, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            }),
            { 
                errorMessage: 'Không thể upload ảnh đại diện',
                showNotification: true
            }
        );
    },

    /**
     * Lấy danh sách khóa học đang học
     */
    loadLearningList: () => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.CUSTOMER.LEARNING_LIST),
            { errorMessage: 'Không thể lấy danh sách khóa học' }
        );
    },

    /**
     * Lấy chi tiết khóa học
     * @param {number} courseId - ID khóa học
     */
    loadContentOverview: (courseId) => {
        return callApi(
            () => apiclient.get(
                API_ENDPOINTS.CUSTOMER.COURSE_OVERVIEW.replace(':courseId', courseId)
            ),
            { errorMessage: 'Không thể lấy thông tin khóa học' }
        );
    },

    /**
     * Lấy nội dung mô-đun
     * @param {number} courseId - ID khóa học
     * @param {number} chapterId - ID chương
     * @param {number} moduleId - ID mô-đun
     * @param {string} typeOfContent - Loại nội dung
     */
    loadModuleContent: (courseId, chapterId, moduleId, typeOfContent) => {
        return callApi(
            () => apiclient.get(
                API_ENDPOINTS.CUSTOMER.MODULE_CONTENT
                    .replace(':courseId', courseId)
                    .replace(':chapterId', chapterId)
                    .replace(':moduleId', moduleId),
                { params: { typeOfContent } }
            ),
            { errorMessage: 'Không thể lấy nội dung mô-đun' }
        );
    },

    /**
     * Đánh giá bài tập
     * @param {FormData} formData - Form data
     */
    evaluateAnswer: (formData) => {
        return callApi(
            () => apiclient.post(API_ENDPOINTS.CUSTOMER.EVALUATE, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            }),
            { errorMessage: 'Không thể đánh giá bài tập' }
        );
    },

    /**
     * Thêm khóa học vào yêu thích
     * @param {number} courseId - ID khóa học
     */
    addToWishlist: (courseId) => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.CUSTOMER.ADD_WISHLIST.replace(':courseId', courseId),
                null
            ),
            { 
                errorMessage: 'Không thể thêm vào yêu thích',
                showNotification: true
            }
        );
    },

    /**
     * Đăng ký khóa học
     * @param {number} courseId - ID khóa học
     * @param {string} joinKey - Join key
     */
    enrollCourse: (courseId, joinKey) => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.CUSTOMER.ENROLL_COURSE.replace(':courseId', courseId),
                null,
                { params: { joinKey } }
            ),
            { 
                errorMessage: 'Không thể đăng ký khóa học',
                showNotification: true
            }
        );
    },
    finishContent: (courseId, moduleId,type) => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.CUSTOMER.FINISH_CONTENT.replace(':courseId', courseId)
                .replace(':moduleId',moduleId),
                null,
                { params: { type } }
            ),
            { 
                errorMessage: 'khong the luu qua trinh',
                showNotification: true
            }
        );
    }

};