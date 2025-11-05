import { useEffect, useState } from "react";
import { Trash2, Edit2, Send, X, MessageSquare } from "lucide-react";
import { showErrorNotification, showSuccessNotification } from "../../api/core/apiClient";
import { commentApi } from "../../api/system/commentApi";
export default function CommentComponent({ courseId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy danh sách comments
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const result = await commentApi.getCommentsByCourse(courseId);
      if (result.success) {
        setComments(result.data);
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      showErrorNotification('Không thể tải danh sách bình luận');
    } finally {
      setIsLoading(false);
    }
  };

  // Tạo comment mới
  const handleCreateComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      showErrorNotification('Vui lòng nhập nội dung bình luận');
      return;
    }

    if (newComment.length > 1000) {
      showErrorNotification('Bình luận không được vượt quá 1000 ký tự');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await commentApi.createComment(courseId, newComment.trim());
      
      if (response.success) {
        showSuccessNotification('Đã thêm bình luận thành công');
        setNewComment('');
        fetchComments(); // Reload comments
      } else {
        showErrorNotification(response?.message || 'Không thể tạo bình luận');
      }
    } catch (error) {
      showErrorNotification('Đã xảy ra lỗi khi tạo bình luận');
      console.error('Create comment error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Bắt đầu chỉnh sửa comment
  const handleEditClick = (comment) => {
    setEditingCommentId(comment.commentId);
    setEditContent(comment.comment);
  };

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  // Cập nhật comment
  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) {
      showErrorNotification('Nội dung bình luận không được để trống');
      return;
    }

    if (editContent.length > 1000) {
      showErrorNotification('Bình luận không được vượt quá 1000 ký tự');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // ✅ Truyền cả courseId và commentId
      const response = await commentApi.updateComment(courseId, commentId, editContent.trim());
      
      if (response.success) {
        showSuccessNotification('Đã cập nhật bình luận');
        setEditingCommentId(null);
        setEditContent('');
        fetchComments(); // Reload comments
      } else {
        showErrorNotification(response?.message || 'Không thể cập nhật bình luận');
      }
    } catch (error) {
      showErrorNotification('Đã xảy ra lỗi khi cập nhật bình luận');
      console.error('Update comment error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xóa comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      return;
    }

    try {
      // ✅ Truyền cả courseId và commentId
      const response = await commentApi.deleteComment(courseId, commentId);
      
      if (response.success) {
        showSuccessNotification('Đã xóa bình luận');
        fetchComments(); // Reload comments
      } else {
        showErrorNotification(response?.message || 'Không thể xóa bình luận');
      }
    } catch (error) {
      showErrorNotification('Đã xảy ra lỗi khi xóa bình luận');
      console.error('Delete comment error:', error);
    }
  };

  // Format ngày giờ
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    const date = new Date(dateTimeString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  useEffect(() => {
    if (courseId) {
      fetchComments();
    }
  }, [courseId]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <MessageSquare className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">
          Bình luận ({comments.length})
        </h2>
      </div>

      {/* Form tạo comment mới */}
      <form onSubmit={handleCreateComment} className="mb-6">
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="3"
            disabled={isSubmitting}
            maxLength={1000}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {newComment.length}/1000 ký tự
            </span>
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
            </button>
          </div>
        </div>
      </form>

      {/* Danh sách comments */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Đang tải bình luận...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.commentId}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Comment header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-2">
                      {comment.createBy?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {comment.createBy || 'Anonymous'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(comment.createAt)}
                        {comment.updateAt !== comment.createAt && (
                          <span className="ml-2 italic">(đã chỉnh sửa)</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(comment)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.commentId)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Comment content */}
              {editingCommentId === comment.commentId ? (
                <div className="mt-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="3"
                    disabled={isSubmitting}
                    maxLength={1000}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {editContent.length}/1000 ký tự
                    </span>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={isSubmitting}
                        className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <X className="w-4 h-4 inline mr-1" />
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateComment(comment.commentId)}
                        disabled={isSubmitting || !editContent.trim()}
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300"
                      >
                        {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap break-words">
                  {comment.comment}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}