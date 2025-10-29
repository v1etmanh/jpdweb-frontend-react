import React, { useState } from 'react';
import { Trash2, Star, Book } from 'lucide-react';

const FeedbackComponent = () => {
  // Dữ liệu mẫu feedback
  const [feedbacks, setFeedbacks] = useState([
    {
      feedbackId: 1,
      content: "Khóa học này rất hữu ích và dễ hiểu. Giảng viên giảng dạy rất tốt và có nhiều ví dụ thực tế.",
      rating: 4.5,
      enrollment: {
        enrollId: 101,
        course: {
          id: 'CS101',
          name: 'Lập trình cơ bản với JavaScript'
        }
      }
    },
    {
      feedbackId: 2,
      content: "Nội dung khóa học phong phú, tuy nhiên tôi mong muốn có thêm bài tập thực hành.",
      rating: 4.0,
      enrollment: {
        enrollId: 102,
        course: {
          id: 'CS102',
          name: 'React và Node.js nâng cao'
        }
      }
    },
    {
      feedbackId: 3,
      content: "Khóa học tuyệt vời! Tôi đã học được rất nhiều kiến thức mới và có thể áp dụng ngay vào công việc.",
      rating: 5.0,
      enrollment: {
        enrollId: 103,
        course: {
          id: 'CS103',
          name: 'Database Design và SQL'
        }
      }
    },
    {
      feedbackId: 4,
      content: "Giảng viên nhiệt tình, tài liệu đầy đủ. Tuy nhiên tiến độ hơi nhanh đối với người mới bắt đầu.",
      rating: 3.5,
      enrollment: {
        enrollId: 104,
        course: {
          id: 'CS104',
          name: 'Python cho Data Science'
        }
      }
    }
  ]);

  // Hàm xóa feedback
  const deleteFeedback = (feedbackId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa feedback này?')) {
      setFeedbacks(feedbacks.filter(feedback => feedback.feedbackId !== feedbackId));
    }
  };

  // Hàm render sao đánh giá
  
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300 fill-current" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" />
      );
    }

    return stars;
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#243864' }}>
            Quản lý Feedback
          </h1>
          <p className="text-gray-600">
            Tổng cộng: {feedbacks.length} feedback
          </p>
        </div>

        {/* Feedback List */}
        <div className="space-y-6">
          {feedbacks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Book className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-500 mb-2">
                Chưa có feedback nào
              </h3>
              <p className="text-gray-400">
                Các feedback sẽ được hiển thị tại đây khi có dữ liệu.
              </p>
            </div>
          ) : (
            feedbacks.map((feedback) => (
              <div
                key={feedback.feedbackId}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 hover:shadow-lg transition-shadow duration-200"
                style={{ borderLeftColor: '#1e88e5' }}
              >
                {/* Course Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: '#243864' }}
                    >
                      <Book className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg" style={{ color: '#243864' }}>
                        {feedback.enrollment.course.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ID: {feedback.enrollment.course.id}
                      </p>
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => deleteFeedback(feedback.feedbackId)}
                    className="p-2 rounded-lg hover:opacity-80 transition-opacity duration-200"
                    style={{ backgroundColor: '#e53935' }}
                    title="Xóa feedback"
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    {renderStars(feedback.rating)}
                  </div>
                  <span className="font-medium" style={{ color: '#1e88e5' }}>
                    {feedback.rating}/5.0
                  </span>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {feedback.content}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <span>Feedback ID: #{feedback.feedbackId}</span>
                  <span>Enrollment ID: {feedback.enrollment.enrollId}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Statistics */}
        {feedbacks.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng feedback</p>
                  <p className="text-2xl font-bold" style={{ color: '#243864' }}>
                    {feedbacks.length}
                  </p>
                </div>
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: '#243864' }}
                >
                  <Book className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đánh giá trung bình</p>
                  <p className="text-2xl font-bold" style={{ color: '#1e88e5' }}>
                    {feedbacks.length > 0 
                      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
                      : '0.0'
                    }
                  </p>
                </div>
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: '#1e88e5' }}
                >
                  <Star className="w-6 h-6 text-white fill-current" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đánh giá cao (≥4)</p>
                  <p className="text-2xl font-bold" style={{ color: '#1e88e5' }}>
                    {feedbacks.filter(f => f.rating >= 4).length}
                  </p>
                </div>
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: '#1e88e5' }}
                >
                  <Star className="w-6 h-6 text-white fill-current" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackComponent;