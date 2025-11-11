import React, { useState, useEffect } from 'react';
import { adminCourseApi } from '../api/admin/adminCourseApi';
import { showErrorNotification, showSuccessNotification } from '../api/core/apiClient';
import { useNavigate } from 'react-router-dom';

const AdminCourseManagement = () => {
  const [courseData, setCourseData] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 20
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Fetch data
  const fetchData = async (page = 0, size = 20, search = '') => {
    try {
      setIsLoading(true);
      const response = await adminCourseApi.getAllCourses(page, size, search);
      console.log(response)
      if (response.success) {
        setCourseData(response.data.data);
      } else {
        showErrorNotification("Lỗi khi tải dữ liệu");
      }
    } catch (error) {
      showErrorNotification("Lỗi kết nối");
    } finally {
      setIsLoading(false);
    }
  };

  // Load data khi component mount hoặc khi thay đổi page/search
  useEffect(() => {
    fetchData(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(0);
  };

  // Handle ban course
  const handleBanCourse = async (courseId) => {
    if (!window.confirm('Bạn có chắc muốn khóa khóa học này?')) return;
    
    try {
      const response = await adminCourseApi.banCourse(courseId);
      if (response.success) {
        showSuccessNotification("Đã khóa khóa học thành công");
        fetchData(currentPage, pageSize, searchTerm);
      } else {
        showErrorNotification("Không thể khóa khóa học");
      }
    } catch (error) {
      showErrorNotification("Lỗi khi khóa khóa học");
    }
  };

  // Handle unban course
  const handleUnbanCourse = async (courseId) => {
    if (!window.confirm('Bạn có chắc muốn mở khóa khóa học này?')) return;
    
    try {
      const response = await adminCourseApi.unbanCourse(courseId);
      if (response.success) {
        showSuccessNotification("Đã mở khóa khóa học thành công");
        fetchData(currentPage, pageSize, searchTerm);
      } else {
        showErrorNotification("Không thể mở khóa khóa học");
      }
    } catch (error) {
      showErrorNotification("Lỗi khi mở khóa khóa học");
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < courseData.totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0);
  };
  const nav=useNavigate()

  // View course detail
  const handleViewDetail = (courseId) => {
   nav(`/admin/course/${courseId}`)
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý khóa học</h1>
          
          {/* Search form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Tìm kiếm
            </button>
            {searchTerm && (
              <button 
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setSearchTerm('');
                }}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
              >
                Xóa
              </button>
            )}
          </form>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <p className="mt-4 text-gray-600 font-medium">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            {/* Course table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên khóa học
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giảng viên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngôn ngữ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Học viên
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đánh giá
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Báo cáo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courseData.content.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="px-6 py-12 text-center text-gray-500">
                          Không có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      courseData.content.map((course) => (
                        <tr key={course.courseId} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {course.courseId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-blue-600">
                              {course.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {course.creatorName}
                              </span>
                              <span className="text-xs text-gray-500">
                                ID: {course.creatorId}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {course.language}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            {course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString()} VNĐ`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                            {course.numberStudent}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm font-medium text-yellow-600">
                              ⭐ {course.avtRating.toFixed(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {course.numberReports > 0 ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {course.numberReports}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">0</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {course.isBan ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Đã khóa
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Hoạt động
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleViewDetail(course.courseId)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title="Xem chi tiết"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              {course.ban ? (
                                <button
                                  onClick={() => handleUnbanCourse(course.courseId)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                  title="Mở khóa"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                  </svg>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleBanCourse(course.courseId)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                  title="Khóa"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="bg-white rounded-lg shadow-md mt-6 p-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Pagination info */}
                <div className="flex items-center gap-4 text-sm text-gray-700">
                  <span>
                    Hiển thị {courseData.content.length > 0 ? currentPage * pageSize + 1 : 0} -{' '}
                    {Math.min((currentPage + 1) * pageSize, courseData.totalElements)} trong tổng số{' '}
                    <span className="font-semibold">{courseData.totalElements}</span> khóa học
                  </span>
                  
                  <select 
                    value={pageSize} 
                    onChange={handlePageSizeChange}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                  >
                    <option value="10">10 / trang</option>
                    <option value="20">20 / trang</option>
                    <option value="50">50 / trang</option>
                    <option value="100">100 / trang</option>
                  </select>
                </div>

                {/* Pagination buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(0)}
                    disabled={currentPage === 0}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    ⏮️
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    ◀️
                  </button>
                  
                  {/* Page numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, courseData.totalPages) }, (_, i) => {
                      let pageNum;
                      if (courseData.totalPages <= 5) {
                        pageNum = i;
                      } else if (currentPage < 3) {
                        pageNum = i;
                      } else if (currentPage > courseData.totalPages - 3) {
                        pageNum = courseData.totalPages - 5 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors duration-200 ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= courseData.totalPages - 1}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    ▶️
                  </button>
                  <button
                    onClick={() => handlePageChange(courseData.totalPages - 1)}
                    disabled={currentPage >= courseData.totalPages - 1}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    ⏭️
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCourseManagement;