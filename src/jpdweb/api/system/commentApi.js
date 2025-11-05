import { apiclient } from '../core/BaseApi';
import { callApi } from '../core/apiClient';
import { API_ENDPOINTS } from '../core/apiEndpoints';

export const commentApi = {
    // Tạo comment mới cho khóa học
    createComment: (courseId, content) => {
        return callApi(
            () => apiclient.post(
                API_ENDPOINTS.COMMENT.CREATE.replace(':courseId', courseId),
                { content: content }  // ✅ Gửi trong body, không phải params
            ),
            { errorMessage: 'Không thể tạo comment' }
        );
    },

    // Lấy danh sách comment của khóa học
    getCommentsByCourse: (courseId) => {
        return callApi(
            () => apiclient.get(
                API_ENDPOINTS.COMMENT.GET_ALL.replace(':courseId', courseId)
            ),
            { errorMessage: 'Không thể lấy danh sách comment' }
        );
    },

    // Cập nhật nội dung comment
    updateComment: (courseId, commentId, newContent) => {
        return callApi(
            () => apiclient.put(
                API_ENDPOINTS.COMMENT.UPDATE
                    .replace(':courseId', courseId)
                    .replace(':commentId', commentId),
                { content: newContent }  // ✅ Gửi trong body
            ),
            { errorMessage: 'Không thể cập nhật comment' }
        );
    },

    // Xóa comment theo ID
    deleteComment: (courseId, commentId) => {
        return callApi(
            () => apiclient.delete(
                API_ENDPOINTS.COMMENT.DELETE
                    .replace(':courseId', courseId)
                    .replace(':commentId', commentId)
            ),
            { errorMessage: 'Không thể xóa comment' }
        );
    }
};