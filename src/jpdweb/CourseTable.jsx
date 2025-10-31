import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { creatorApi } from './api/creatorApi';
import { showErrorNotification } from './api/apiClient';

const CoursesTable = () => {
  const nav = useNavigate();
  const [coursesData, setCourseData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [sortOption, setSortOption] = useState('id');
  
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

  const getSortedCourses = () => {
    if (!coursesData.length) return [];
    
    const sorted = [...coursesData];
    
    switch (sortOption) {
      case 'id':
        return sorted.sort((a, b) => a.courseId - b.courseId);
      case 'students_desc':
        return sorted.sort((a, b) => b.students - a.students);
      case 'revenue_desc':
        return sorted.sort((a, b) => b.revenue - a.revenue);
      case 'students_asc':
        return sorted.sort((a, b) => a.students - b.students);
      case 'revenue_asc':
        return sorted.sort((a, b) => a.revenue - b.revenue);
      default:
        return sorted;
    }
  };

  const sortedCourses = getSortedCourses();
  
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
        {/* Header Section */}
        <div className="mb-6 text-center">
          <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold text-[#06B6D4] mb-2 transform transition-all duration-500 hover:scale-105">
              Quản Lý Doanh Thu Khóa Học
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto animate-slideUp text-sm">
              Theo dõi và phân tích hiệu suất các khóa học của bạn
            </p>
          </div>
        </div>
        
        {/* Compact Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            {
              label: "Tổng Doanh Thu",
              value: formatCurrency(coursesData.reduce((sum, course) => sum + course.revenue, 0)),
              icon: "💰",
              delay: "0s",
              bgColor: "bg-gradient-to-r from-green-50 to-emerald-100",
              textColor: "text-green-700"
            },
            {
              label: "Tổng Học Viên", 
              value: coursesData.reduce((sum, course) => sum + course.students, 0).toLocaleString(),
              icon: "👥",
              delay: "0.1s",
              bgColor: "bg-gradient-to-r from-blue-50 to-cyan-100",
              textColor: "text-blue-700"
            },
            {
              label: "Số Khóa Học",
              value: coursesData.length,
              icon: "📚",
              delay: "0.2s",
              bgColor: "bg-gradient-to-r from-purple-50 to-violet-100",
              textColor: "text-purple-700"
            }
          ].map((stat, index) => (
            <div 
              key={index}
              className={`${stat.bgColor} rounded-xl p-4 shadow-sm border transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md`}
              style={{animationDelay: stat.delay}}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl animate-bounce-gentle" style={{animationDelay: stat.delay}}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-medium">{stat.label}</p>
                    <p className={`text-lg font-bold ${stat.textColor} mt-1 animate-countup`}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden animate-slideUp" style={{animationDelay: '0.3s'}}>
          <div className="px-6 py-3 border-b border-gray-100 bg-gradient-to-r from-[#06B6D4] to-cyan-500">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <span className="animate-pulse-soft mr-2">📊</span>
                Danh Sách Khóa Học
              </h2>
              
              {/* Dropdown Sắp xếp */}
              <div className="flex items-center space-x-2">
                <label htmlFor="sort" className="text-white text-xs font-medium">
                  Sắp xếp:
                </label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-white text-gray-800 px-3 py-1 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#06B6D4] focus:border-transparent transition-all duration-300 text-sm"
                >
                  <option value="id">ID </option>
                  <option value="students_desc">Học viên (Cao → Thấp)</option>
                  <option value="students_asc">Học viên (Thấp → Cao)</option>
                  <option value="revenue_desc">Doanh thu (Cao → Thấp)</option>
                  <option value="revenue_asc">Doanh thu (Thấp → Cao)</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-cyan-50 text-cyan-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Khóa Học
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Học Viên
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Đánh Giá
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                    Doanh Thu
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedCourses.map((course, index) => (
                  <tr 
                    key={course.courseId}
                    onMouseEnter={() => setHoveredRow(course.courseId)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => {
                      nav(`/creator/commercial/courseDetail/${course.courseId}`);
                    }}
                    className={`cursor-pointer transition-all duration-300 ${
                      hoveredRow === course.courseId 
                        ? 'bg-cyan-50 shadow-inner' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={course.urlImg}
                          alt={course.title}
                          className="w-12 h-12 rounded-lg object-cover shadow-sm"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-gray-800 truncate">
                            {course.title}
                          </h3>
                          <p className="text-gray-500 text-xs mt-1">ID: {course.courseId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span className="bg-[#06B6D4] text-white px-2 py-1 rounded-full text-xs font-medium">
                          {course.students.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(course.rating) 
                                  ? 'text-[#F97316] fill-current' 
                                  : 'text-gray-300'
                              }`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-gray-700 font-semibold text-sm">
                          {course.rating > 0 ? course.rating.toFixed(1) : 'Chưa có'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-center">
                        <span className="text-gray-800 font-bold text-sm bg-gray-50 px-2 py-1 rounded-lg inline-block">
                          {formatCurrency(course.price)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-center">
                        <span className="text-[#F97316] font-bold text-sm bg-orange-50 px-2 py-1 rounded-lg inline-block">
                          {formatCurrency(course.revenue)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer */}
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-xs">
                Hiển thị <span className="font-semibold text-[#06B6D4]">{sortedCourses.length}</span> khóa học
                {sortOption !== 'id' && (
                  <span className="ml-1 text-amber-600">
                    (Đã sắp xếp {sortOption.includes('desc') ? 'giảm dần' : 'tăng dần'})
                  </span>
                )}
              </p>
              <button className="bg-gradient-to-r from-[#06B6D4] to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-md">
                📥 Xuất Báo Cáo
              </button>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6 animate-bounce-gentle">
          <button 
            onClick={fetchData}
            className="bg-[#F97316] text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:rotate-180"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursesTable;