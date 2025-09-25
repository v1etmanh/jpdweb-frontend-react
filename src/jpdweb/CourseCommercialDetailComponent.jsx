//tạo 1 cái component
// hiển thị các thông tin về course 
// tên khóa hc , img , giá tiền, số lượng người hc, rating, khoảng thu từ khóa ,và ngày tạo
// tất cả các thông tin này nên được làm hiển thị dnagj bảng 1 cách đẹp và học thuật 
//khi click và các khóa nó sẽ nhảy tới 1 trang ,
// trang này sẽ hiện 1 sidebar nằm ngang phía trên 
// có 2 lựa chọn đó là về thông tin về những hc viên đăng kí
// sẽ có email nnguowif đăng kí , ngày đăng kí,  tiến trình của họ
// thông tin ở lựa chọn 2 trên side bar đó là feedbackk&&rating 
//nó sẽ hiện tất cả cac feedback +rating của người  hc  vs email và ngày tạo 
// CourseDetail.jsx
import React, { useState } from 'react';
import { studentsData, feedbackData, coursesData } from './MockData';
import { useParams } from 'react-router-dom';

const CourseDetail = () => {
  const [activeTab, setActiveTab] = useState('students');
  const{courseId}=  useParams()
  const course = coursesData.find(c => c.id === parseInt( courseId));
  const students = studentsData[courseId] || [];
  const feedback = feedbackData[courseId] || [];
console.log("hêheheh"+courseId+"1")
  if (!course) return null;

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
             
              <h1 className="text-2xl font-bold text-[#243864]">{course.name}</h1>
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
                  <span>Học Viên Đăng Ký</span>
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
                  <span>Feedback & Rating</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'students' && (
              <div>
                <h2 className="text-xl font-semibold text-[#243864] mb-6">
                  Danh Sách Học Viên ({students.length})
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày Đăng Ký
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tiến Trình
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-[#243864]">
                              {student.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(student.registerDate)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                                <div
                                  className="bg-[#1e88e5] h-2.5 rounded-full transition-all duration-300"
                                  style={{ width: `${student.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
                                {student.progress}%
                              </span>
                            </div>
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
                  Feedback & Rating ({feedback.length})
                </h2>
                <div className="space-y-6">
                  {feedback.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#243864] rounded-full flex items-center justify-center text-white font-semibold">
                            {item.email[0].toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-medium text-[#243864]">{item.email}</h4>
                            <p className="text-sm text-gray-500">{formatDate(item.createdDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {renderStars(item.rating)}
                          <span className="ml-2 text-sm font-medium text-gray-600">
                            {item.rating}/5
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{item.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;