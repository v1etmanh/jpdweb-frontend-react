import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEnrollementByCourseId } from './api/ApiConnect';

const CourseDetail = () => {
  const [activeTab, setActiveTab] = useState('students');
  const { courseId } = useParams();
  const [enrollData, setEnrollData] = useState(null);
  const [courseName, setCourseName] = useState('');

  const fetchData = async () => {
    try {
      const response = await getEnrollementByCourseId(courseId);
      if (response.status !== 200) {
        alert("error to fetch data");
      } else {
        console.log(response.data);
        // Xử lý circular reference - chỉ lấy level đầu tiên
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
      }
    } catch (e) {
      console.error("error to fetch", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (!enrollData) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  // Lọc ra những enrollment có feedback
  const feedbackList = enrollData.filter(item => item.feedback !== null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-[#243864]">
                Chi Tiết Khóa Học #{courseId}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('students')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'students'
                    ? 'border-[#1e88e5] text-[#1e88e5]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <span>Học Viên Đăng Ký ({enrollData.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'feedback'
                    ? 'border-[#1e88e5] text-[#1e88e5]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
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
              <div>
                <h2 className="text-xl font-semibold text-[#243864] mb-6">
                  Danh Sách Học Viên ({enrollData.length})
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID Đăng Ký
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày Đăng Ký
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng Thái Feedback
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {enrollData.map((student) => (
                        <tr key={student.enrollId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-[#243864]">
                              #{student.enrollId}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(student.createDate)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {student.feedback ? (
                              <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Đã feedback
                              </span>
                            ) : (
                              <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                Chưa feedback
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'feedback' && (
              <div>
                <h2 className="text-xl font-semibold text-[#243864] mb-6">
                  Feedback & Rating ({feedbackList.length})
                </h2>
                {feedbackList.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    Chưa có feedback nào cho khóa học này
                  </div>
                ) : (
                  <div className="space-y-6">
                    {feedbackList.map((item) => (
                      <div key={item.enrollId} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#243864] rounded-full flex items-center justify-center text-white font-semibold">
                              {item.enrollId}
                            </div>
                            <div>
                              <h4 className="font-medium text-[#243864]">
                                Học viên #{item.enrollId}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {formatDate(item.createDate)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {renderStars(item.feedback.rate)}
                            <span className="ml-2 text-sm font-medium text-gray-600">
                              {item.feedback.rate}/5
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {item.feedback.content}
                        </p>
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