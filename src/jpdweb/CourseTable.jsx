import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { creatorApi } from './api/creatorApi';
import { showErrorNotification } from './api/apiClient';

const CoursesTable = () => {
  const nav = useNavigate();
  const [coursesData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(null);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await creatorApi.getCommercialCourse();
      if (response.success) {
        setCourseData(response.data);
      } else {
        showErrorNotification("Lỗi khi tải dữ liệu");
      }
    } catch (error) {
      showErrorNotification("Lỗi kết nối");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-bounce-gentle rounded-full h-20 w-20 border-t-4 border-b-4 border-[#06B6D4] mx-auto mb-4"></div>
          <p className="text-[#06B6D4] font-semibold animate-pulse-soft">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#F1F5F9] p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section với animation */}
        <div className="mb-10 text-center">
          <div className="animate-fadeIn">
            <h1 className="text-4xl font-bold text-[#06B6D4] mb-4 transform transition-all duration-500 hover:scale-105">
              Quản Lý Doanh Thu Khóa Học
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slideUp">
              Theo dõi và phân tích hiệu suất các khóa học của bạn một cách trực quan
            </p>
          </div>
        </div>
        
        {/* Stats Overview với stagger animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: "Tổng Doanh Thu",
              value: formatCurrency(coursesData.reduce((sum, course) => sum + course.revenue, 0)),
              icon: "💰",
              delay: "0s"
            },
            {
              label: "Tổng Học Viên", 
              value: coursesData.reduce((sum, course) => sum + course.students, 0).toLocaleString(),
              icon: "👥",
              delay: "0.1s"
            },
            {
              label: "Số Khóa Học",
              value: coursesData.length,
              icon: "📚",
              delay: "0.2s"
            }
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 animate-slideUp hover:shadow-card transition-all duration-300 transform hover:-translate-y-1"
              style={{animationDelay: stat.delay}}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#06B6D4] mt-2 animate-countup">
                    {stat.value}
                  </p>
                </div>
                <div className="text-3xl animate-bounce-gentle" style={{animationDelay: stat.delay}}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-slideUp" style={{animationDelay: '0.3s'}}>
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#06B6D4] to-cyan-500">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <span className="animate-pulse-soft mr-3">📊</span>
              Danh Sách Khóa Học
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-cyan-50 text-cyan-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Khóa Học
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Học Viên
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Đánh Giá
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                    Doanh Thu
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coursesData.map((course, index) => (
                  <tr 
                    key={course.courseId}
                    onMouseEnter={() => setHoveredRow(course.courseId)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => {
                      nav(`/creator/commercial/courseDetail/${course.courseId}`);
                    }}
                    className={`cursor-pointer transition-all duration-500 transform ${
                      hoveredRow === course.courseId 
                        ? 'bg-cyan-50 scale-[1.02] shadow-lg' 
                        : 'bg-white hover:bg-gray-50'
                    } ${
                      index % 2 === 0 ? 'animate-fadeIn' : 'animate-slideUp'
                    }`}
                    style={{animationDelay: `${0.4 + index * 0.05}s`}}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className={`absolute inset-0 bg-[#06B6D4] rounded-xl transition-all duration-300 ${
                            hoveredRow === course.courseId ? 'opacity-10' : 'opacity-0'
                          }`}></div>
                          <img
                            src={course.urlImg}
                            alt={course.title}
                            className="w-16 h-16 rounded-xl object-cover shadow-sm transition-all duration-300 transform hover:rotate-2"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-[#06B6D4]">
                            {course.title}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">ID: {course.courseId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="bg-[#06B6D4] text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm transition-all duration-300 hover:shadow-md">
                          {course.students.toLocaleString()}
                        </span>
                        <span className="text-gray-600 text-sm">học viên</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex animate-rating">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 transition-all duration-300 ${
                                i < Math.floor(course.rating) 
                                  ? 'text-[#F97316] fill-current transform hover:scale-125' 
                                  : 'text-gray-300'
                              }`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-gray-700 font-semibold bg-gray-100 px-2 py-1 rounded-lg text-sm transition-all duration-300 hover:bg-cyan-100">
                          {course.rating > 0 ? course.rating.toFixed(1) : 'Chưa có'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="transform transition-all duration-500 hover:scale-110">
                        <span className="text-gray-800 font-bold text-lg bg-gray-50 px-3 py-2 rounded-xl inline-block border-2 border-transparent hover:border-[#06B6D4]">
                          {formatCurrency(course.price)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse-soft">
                        <span className="text-[#F97316] font-bold text-lg bg-orange-50 px-3 py-2 rounded-xl inline-block transform transition-all duration-500 hover:scale-105 hover:shadow-md">
                          {formatCurrency(course.revenue)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer với animation */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-cyan-50">
            <div className="flex items-center justify-between animate-fadeIn">
              <p className="text-gray-600 text-sm">
                Hiển thị <span className="font-semibold text-[#06B6D4]">{coursesData.length}</span> khóa học
              </p>
              <button className="bg-gradient-to-r from-[#06B6D4] to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95">
                📥 Xuất Báo Cáo
              </button>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8 animate-bounce-gentle">
          <button 
            onClick={fetchData}
            className="bg-[#F97316] text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:rotate-180"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Thêm CSS animations */}
      <style jsx>{`
        @keyframes countup {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
       
        .animate-countup {
          animation: countup 0.8s ease-out;
        }
      
      `}</style>
    </div>
  );
};

export default CoursesTable;