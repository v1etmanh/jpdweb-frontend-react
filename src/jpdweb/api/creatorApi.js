// src/api/services/creatorApi.js
import { replace } from 'react-router-dom';
import {apiclient }from './BaseApi';
import { callApi } from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

export const creatorApi = {
    /**
     * Lấy thông tin tài khoản tác giả
     */
    getAccount: () => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.CREATOR.GET_ACCOUNT),
            { errorMessage: 'Không thể lấy thông tin tài khoản' }
        );
    },

    /**
     * Upload email PayPal
     * @param {string} paypalEmail - Email PayPal
     */
    uploadPaypalEmail: (paypalEmail) => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.CREATOR.UPLOAD_PAYPAL_EMAIL,
                null,
                { params: { pEmail: paypalEmail } }
            ),
            { 
                errorMessage: 'Không thể upload email PayPal',
                showNotification: true
            }
        );
    },

    /**
     * Upload chứng chỉ
     * @param {FileList} files - Danh sách file
     */
    uploadCertificate: (files) => {
        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('certificateFile', file);
        });

        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.CREATOR.UPLOAD_CERTIFICATE,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            ),
            { 
                errorMessage: 'Không thể upload chứng chỉ',
                showNotification: true
            }
        );
    },

    /**
     * Tạo khóa học mới
     * @param {FormData} formData - Form data
     */
    createCourse: (formData) => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.CREATOR.CREATE_COURSE,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            ),
            { 
                errorMessage: 'Không thể tạo khóa học',
                showNotification: true
            }
        );
    },

    /**
     * Lấy danh sách khóa học của tác giả
     */
    getCourses: () => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.CREATOR.GET_COURSES),
            { errorMessage: 'Không thể lấy danh sách khóa học' }
        );
    },
getCommercialCourse: () => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.CREATOR.GET_COMMERCIAL_COURSES),
            { errorMessage: 'Không thể lấy danh sách khóa học' }
        );
    },
    /**
     * Lấy chi tiết khóa học
     * @param {number} id - ID khóa học
     */
    getCourseById: (id) => {
        return callApi(
            () => apiclient.get(
                API_ENDPOINTS.CREATOR.GET_COURSE_BY_ID.replace(':id', id)
            ),
            { errorMessage: `Không thể lấy khóa học ID: ${id}` }
        );
    },

    /**
     * Cập nhật khóa học
     * @param {number} id - ID khóa học
     * @param {Object} data - Dữ liệu cập nhật
     */
    updateCourse: (id, data) => {
        return callApi(
            () => apiclient.put(
                API_ENDPOINTS.CREATOR.UPDATE_COURSE.replace(':id', id),
                data
            ),
            { 
                errorMessage: 'Không thể cập nhật khóa học',
                showNotification: true
            }
        );
    },

    /**
     * Lấy thống kê
     */
    getStatistic: () => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.CREATOR.GET_STATISTIC),
            { errorMessage: 'Không thể lấy thông tin thống kê' }
        );
    },

    /**
     * Đổi trạng thái khóa học
     * @param {number} id - ID khóa học
     */
    changeCoursesStatus: (id) => {
        return callApi(
            () => apiclient.get(
                API_ENDPOINTS.CREATOR.CHANGE_COURSE_STATUS.replace(':id', id)
            ),
            { 
                errorMessage: 'Không thể đổi trạng thái khóa học',
                showNotification: true
            }
        );
    },

    /**
     * Tạo chương mới
     * @param {number} courseId - ID khóa học
     * @param {string} chapterName - Tên chương
     */
    createChapter: (courseId, chapterName) => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.CREATOR.CREATE_CHAPTER.replace(':courseId', courseId),
                null,
                { params: { chapterName } }
            ),
            { 
                errorMessage: 'Không thể tạo chương',
                showNotification: true
            }
        );
    },

    /**
     * Xóa chương
     * @param {number} courseId - ID khóa học
     * @param {number} chapterId - ID chương
     */
    deleteChapter: (courseId, chapterId) => {
        return callApi(
            () => apiclient.delete(
                API_ENDPOINTS.CREATOR.DELETE_CHAPTER
                    .replace(':courseId', courseId)
                    .replace(':chapterId', chapterId)
            ),
            { 
                errorMessage: 'Không thể xóa chương',
                showNotification: true
            }
        );
    },

    /**
     * Tạo mô-đun mới
     * @param {number} courseId - ID khóa học
     * @param {number} chapterId - ID chương
     * @param {string} moduleName - Tên mô-đun
     */
    createModule: (courseId, chapterId, moduleName) => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.CREATOR.CREATE_MODULE
                    .replace(':courseId', courseId)
                    .replace(':chapterId', chapterId),
                null,
                { params: { moduleName } }
            ),
            { 
                errorMessage: 'Không thể tạo mô-đun',
                showNotification: true
            }
        );
    },

    /**
     * Xóa mô-đun
     * @param {number} courseId - ID khóa học
     * @param {number} chapterId - ID chương
     * @param {number} moduleId - ID mô-đun
     */
    deleteModule: (courseId, chapterId, moduleId) => {
        return callApi(
            () => apiclient.delete(
                API_ENDPOINTS.CREATOR.DELETE_MODULE
                    .replace(':courseId', courseId)
                    .replace(':chapterId', chapterId)
                    .replace(':moduleId', moduleId)
            ),
            { 
                errorMessage: 'Không thể xóa mô-đun',
                showNotification: true
            }
        );
    },

    /**
     * Cập nhật nội dung mô-đun
     * @param {number} courseId - ID khóa học
     * @param {number} chapterId - ID chương
     * @param {number} moduleId - ID mô-đun
     * @param {Object} data - Dữ liệu
     */
    updateModuleContent: (courseId, chapterId, moduleId, data) => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.CREATOR.UPDATE_MODULE_CONTENT
                    .replace(':courseId', courseId)
                    .replace(':chapterId', chapterId)
                    .replace(':moduleId', moduleId),
                data
            ),
            { 
                errorMessage: 'Không thể cập nhật nội dung mô-đun',
                showNotification: true
            }
        );
    },

    /**
     * Xóa nội dung mô-đun
     * @param {number} courseId - ID khóa học
     * @param {number} chapterId - ID chương
     * @param {number} moduleId - ID mô-đun
     * @param {number} contentId - ID nội dung
     */
    deleteModuleContent: (courseId, chapterId, moduleId, contentId) => {
        return callApi(
            () => apiclient.delete(
                API_ENDPOINTS.CREATOR.DELETE_MODULE_CONTENT
                    .replace(':courseId', courseId)
                    .replace(':chapterId', chapterId)
                    .replace(':moduleId', moduleId)
                    .replace(':contentId', contentId)
            ),
            { 
                errorMessage: 'Không thể xóa nội dung',
                showNotification: true
            }
        );
    },

    /**
     * Upload ảnh
     * @param {FormData} formData - Form data
     */
    saveImage: (formData) => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.CREATOR.SAVE_IMAGE,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            ),
            { errorMessage: 'Không thể upload ảnh' }
        );
    },

    /**
     * Upload PDF
     * @param {FormData} formData - Form data
     */
    savePdf: (formData) => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.CREATOR.SAVE_PDF,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            ),
            { errorMessage: 'Không thể upload PDF' }
        );
    },

    /**
     * Tạo yêu cầu rút tiền
     * @param {number} amount - Số tiền
     */
    createWithdraw: (amount) => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.CREATOR.CREATE_WITHDRAW,
                null,
                { params: { amount } }
            ),
            { 
                errorMessage: 'Không thể tạo yêu cầu rút tiền',
                showNotification: true
            }
        );
    },

    /**
     * Lấy lịch sử giao dịch
     */
    getTransactionHistory: () => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.CREATOR.TRANSACTION_HISTORY),
            { errorMessage: 'Không thể lấy lịch sử giao dịch' }
        );
    },

    /**
     * AI - Tạo phản hồi
     * @param {Object} data - Dữ liệu
     */
    generateFeedback: (data) => {
        return callApi(
            () => apiclient.post(API_ENDPOINTS.CREATOR.GENERATE_FEEDBACK, data),
            { errorMessage: 'Không thể tạo phản hồi' }
        );
    },

    /**
     * AI - Phân tích ảnh
     * @param {string} question - Câu hỏi
     * @param {string} imgUrl - URL ảnh
     */
    analyzeImage: (question, imgUrl) => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.CREATOR.ANALYZE_IMAGE,
                null,
                { params: { question, imgUrl } }
            ),
            { errorMessage: 'Không thể phân tích ảnh' }
        );
    },
    /** 
    *get enrollment detail for commercial course 
    * @param { number } courseId
    */
    getEnrollementByCourseId: (courseId)=>{
        return callApi(()=>
        apiclient.get(API_ENDPOINTS.CREATOR.GET_ENROLLMENT.replace(':courseId', courseId)),
        {
            errorMessage: 'Bị lỗi trong quá trình lấy Data'
        })
    },
    
    /**
    *get moduleContent by type
    * @param { number } courseId 
    * @param { number} chapterId
    * @param {number} moduleId
    * @param { string} typeOfContent
    */
    getContentByType :(courseId,chapterId,moduleId,typeOfContent)=>{
      return callApi(()=> apiclient.get(API_ENDPOINTS.CREATOR.GET_CONTENT_BY_TYPE
        .replace(":courseId",courseId)
        .replace(":chapterId",chapterId)
        .replace(":moduleId",moduleId),{params:{
            type:typeOfContent
        }}
      ), {
            errorMessage: 'Load data bằng typeOfContent và course info gặp vấn đề hoặc chưa dc upload'
        }) 
    },
      /**
    *get moduleContent by type
    * @param { string } contentType 
    * @param { number} moduleId
    * @param {number} chapterId
    * @param { number} courseId
    */
   deleteContentByType:(contentType,
          moduleId,
          chapterId,
          courseId)=>{return callApi(()=> apiclient.delete(API_ENDPOINTS.CREATOR.DELETE_CONTENT_BY_TYPE
            .replace(":courseId",courseId)
            .replace(":moduleId",moduleId)
            .replace(":chapterId",chapterId)
            ,{params:{
                  type:contentType,
            }}
          ), {
            errorMessage: 'loi khi xoa content'
        })},
         updateChapter:(name,
          
          chapterId,
          courseId)=>{return callApi(()=> apiclient.put(API_ENDPOINTS.CREATOR.UPDATE_CHAPTER
            .replace(":courseId",courseId)
          
            .replace(":chapterId",chapterId)
            ,null,{params:{
                  name:name,
            }}
          ), {
            errorMessage: 'loi khi xoa content'
        })},
        updateModule:(name,
          moduleId,
          chapterId,
          courseId)=>{return callApi(()=> apiclient.put(API_ENDPOINTS.CREATOR.UPDATE_MODULE
            .replace(":courseId",courseId)
             .replace(":moduleId",moduleId)
            .replace(":chapterId",chapterId),null
            ,{params:{
                  name:name,
            }}
          ), {
            errorMessage: 'loi khi xoa content'
        })}
};