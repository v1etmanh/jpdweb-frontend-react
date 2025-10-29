import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { creatorApi } from './api/creatorApi';
import { 
  API_RESPONSE_TYPES, 
  showSuccessNotification,
  showErrorUI,
  showWarningNotification
} from "./api/apiClient";

const CourseDetail = () => {
  const [activeTab, setActiveTab] = useState('students');
  const { courseId } = useParams();
  const [enrollData, setEnrollData] = useState(null);
  const [courseName, setCourseName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await creatorApi.getEnrollementByCourseId(courseId);
      if (response.success) {
        console.log(response.data);
        // Xử lý circular reference - chỉ lấy level đầu tiên
        if(!response.data) return;
        const cleanedData = response.data.map(item => ({
          enrollId: item.enrollId,
          createDate: item.createDate,
          feedback: item.feedback ? {
            feedbackId: item.feedback.feedbackId,
            content: item.feedback.content,
            rate: item.feedback.rate
          } : null
        }));
        setEnrollData(cleanedData);
      } else {
        if(response.responseType === API_RESPONSE_TYPES.VALIDATION_ERROR){
          showWarningNotification("Course ID này không tồn tại");
        } else if(response.responseType === API_RESPONSE_TYPES.UNAUTHORIZED) {
          showWarningNotification("Course này không thuộc về bạn");
        } else {
          showWarningNotification("Lỗi server trong quá trình xử lí yêu cầu");
        }
      }
    } catch (error) {
      showWarningNotification("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-[#F97316] fill-current' : 'text-gray-300'}`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  // Lọc ra những enrollment có feedback
  const feedbackList = enrollData ? enrollData.filter(item => item.feedback !== null) : [];

  // Tính toán các số liệu thống kê
  const totalStudents = enrollData ? enrollData.length : 0;
  const averageRating = feedbackList.length > 0 
    ? (feedbackList.reduce((sum, item) => sum + item.feedback.rate, 0) / feedbackList.length).toFixed(1)
    : '0.0';
  const feedbackRate = enrollData && enrollData.length > 0 
    ? Math.round((feedbackList.length / enrollData.length) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-[#06B6D4] rounded-full mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-48"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans">
      {/* Header - Đã thu nhỏ lại */}
      <div className="bg-[#06B6D4] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3 mb-3 sm:mb-0">
              <div className="bg-white/20 p-2 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Chi Tiết Khóa Học
                </h1>
                <p className="text-white/80 text-sm">Mã khóa học: #{courseId}</p>
              </div>
            </div>
            
            {/* Thống kê trên header với phân biệt màu sắc */}
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex space-x-6 text-white">
                <div className="text-center">
                  <p className="text-xs opacity-80">Tổng học viên</p>
                  <p className="text-lg font-bold">{totalStudents}</p>
                </div>
                
                {/* Phân cách với đường kẻ dọc */}
                <div className="border-r border-white/30 h-12"></div>
                
                <div className="text-center">
                  <p className="text-xs opacity-80">Đánh giá</p>
                  <p className="text-lg font-bold">{feedbackList.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Thống kê nhanh - Đặt ngay dưới header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-soft">
            <div className="flex items-center">
              <div className="bg-[#06B6D4]/10 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-[#06B6D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng học viên</p>
                <p className="text-xl font-bold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-soft">
            <div className="flex items-center">
              <div className="bg-[#F97316]/10 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Đánh giá trung bình</p>
                <p className="text-xl font-bold text-gray-900">{averageRating}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-soft">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tỷ lệ feedback</p>
                <p className="text-xl font-bold text-gray-900">{feedbackRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="border-b border-gray-100">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('students')}
                className={`flex-1 py-4 px-1 text-center font-medium text-sm transition-all duration-300 ${
                  activeTab === 'students'
                    ? 'text-[#06B6D4] border-b-2 border-[#06B6D4] bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <span>Học Viên Đăng Ký ({totalStudents})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`flex-1 py-4 px-1 text-center font-medium text-sm transition-all duration-300 ${
                  activeTab === 'feedback'
                    ? 'text-[#06B6D4] border-b-2 border-[#06B6D4] bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <span>Feedback & Rating ({feedbackList.length})</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'students' && (
              <div className="animate-slideUp">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Danh Sách Học Viên
                  </h2>
                  
                </div>
                
                {!enrollData || enrollData.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có học viên nào</h3>
                    <p className="text-gray-500">Khóa học này chưa có học viên đăng ký.</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày Đăng Ký
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trạng Thái Feedback
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {enrollData.map((student) => (
                          <tr key={student.enrollId} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="bg-[#06B6D4] text-white rounded-lg w-10 h-10 flex items-center justify-center mr-3">
                                  <span className="text-sm font-bold">#{student.enrollId}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {formatDate(student.createDate)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {student.feedback ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Đã feedback
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Chưa feedback
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'feedback' && (
              <div className="animate-slideUp">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">
                  Feedback & Đánh Giá
                </h2>
                {feedbackList.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có feedback nào</h3>
                    <p className="text-gray-500">Khóa học này chưa nhận được đánh giá nào từ học viên.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {feedbackList.map((item) => (
                      <div key={item.enrollId} className="bg-white rounded-lg p-5 border border-gray-200 shadow-soft transition-all duration-300 hover:shadow-medium">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-[#06B6D4] text-white rounded-lg w-10 h-10 flex items-center justify-center font-semibold">
                              #{item.enrollId}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                Học viên #{item.enrollId}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {formatDate(item.createDate)}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center space-x-1 mb-2">
                              {renderStars(item.feedback.rate)}
                            </div>
                            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                              {item.feedback.rate}/5
                            </span>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 leading-relaxed">
                            {item.feedback.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;