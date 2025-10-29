import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, User, AlertCircle, X, Loader2 } from 'lucide-react';


import { adminApi } from '../api/adminCreatorApi';
import { useNavigate } from 'react-router-dom';

const AdminCreatorManagement = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const nav=useNavigate()
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);

  // Load creators
  const loadCreators = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        size: pageSize
      };
      
      if (statusFilter) {
        params.status = statusFilter;
      }
      
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      // Gọi API thực
      const response = await adminApi.getCreatorList(params);
      console.log(response)
      setCreators(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách Creator');
      console.error('Error loading creators:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data khi component mount hoặc khi filters/page thay đổi
  useEffect(() => {
    loadCreators();
  }, [currentPage, statusFilter]);

  // Handle search với debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 0) {
        loadCreators();
      } else {
        setCurrentPage(0); // Reset về page 0 khi search
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Status badge color
const getStatusBadge = (status) => {
    // Định nghĩa styles (màu nền và màu chữ) cho từng status
    const styles = {
        // Status hiện tại
        ACTIVE: 'bg-green-100 text-green-800', 
        BANNED: 'bg-red-100 text-red-800',
        PENDING_CERTIFICATE: 'bg-yellow-100 text-yellow-800', // Giữ nguyên
        INACTIVE: 'bg-gray-100 text-gray-800', // Giữ nguyên
        
        // Status mới
        PENDING: 'bg-yellow-100 text-yellow-800', // Đang chờ xử lý
        SUCCESS: 'bg-green-100 text-green-800', // Thành công (thường dùng cho transaction, operation)
        FAILED: 'bg-red-100 text-red-800', // Thất bại
        CANCEL: 'bg-gray-200 text-gray-800', // Đã hủy
        REJECTED: 'bg-red-200 text-red-900', // Bị từ chối (có thể dùng màu đậm hơn FAILED)
        SUSPENDED: 'bg-orange-100 text-orange-800', // Bị tạm ngưng
        UNDER_REVIEW: 'bg-blue-100 text-blue-800', // Đang được xem xét
    };
    
    // Định nghĩa labels (tên hiển thị tiếng Việt) cho từng status
    const labels = {
        // Status hiện tại
        ACTIVE: 'Hoạt động',
        BANNED: 'Bị cấm',
        PENDING_CERTIFICATE: 'Chờ chứng chỉ',
        INACTIVE: 'Không hoạt động',

        // Status mới
        PENDING: 'Đang chờ',
        SUCCESS: 'Thành công',
        FAILED: 'Thất bại',
        CANCEL: 'Đã hủy',
        REJECTED: 'Bị từ chối',
        SUSPENDED: 'Bị tạm ngưng',
        UNDER_REVIEW: 'Đang xem xét',
    };

    const statusKey = (status || '').toUpperCase(); // Đảm bảo status là chữ in hoa

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[statusKey] || styles.INACTIVE}`}>
            {labels[statusKey] || status}
        </span>
    );
};

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Creator</h1>
          <p className="text-gray-600">Quản lý và theo dõi tất cả các creator trên hệ thống</p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span>{statusFilter ? `Trạng thái: ${statusFilter}` : 'Lọc theo trạng thái'}</span>
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setStatusFilter('');
                        setShowFilterDropdown(false);
                        setCurrentPage(0);
                      }}
                      className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => {
                        setStatusFilter('SUCCESS');
                        setShowFilterDropdown(false);
                        setCurrentPage(0);
                      }}
                      className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                    >
                      Hoạt động
                    </button>
                    <button
                      onClick={() => {
                        setStatusFilter('REJECTED');
                        setShowFilterDropdown(false);
                        setCurrentPage(0);
                      }}
                      className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                    >
                      Bị từ chối
                    </button>
                    <button
                      onClick={() => {
                        setStatusFilter('BANNED');
                        setShowFilterDropdown(false);
                        setCurrentPage(0);
                      }}
                      className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                    >
                    Bị Cấm
                    </button>
                       <button
                      onClick={() => {
                        setStatusFilter('SUSPENDED');
                        setShowFilterDropdown(false);
                        setCurrentPage(0);
                      }}
                      className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                    >
                      Bị Cảnh Cáo
                    </button>
                     <button
                      onClick={() => {
                        setStatusFilter('UNDER_REVIEW');
                        setShowFilterDropdown(false);
                        setCurrentPage(0);
                      }}
                      className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                    >
                      Đóng Băng Chức năng thanh toán
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active filters */}
          {(statusFilter || searchTerm) && (
            <div className="flex gap-2 mt-3">
              {statusFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Trạng thái: {statusFilter}
                  <button onClick={() => { setStatusFilter(''); setCurrentPage(0); }}>
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Tìm kiếm: {searchTerm}
                  <button onClick={() => { setSearchTerm(''); setCurrentPage(0); }}>
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Creator
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số dư
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Khóa học
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Học viên
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đánh giá
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cảnh báo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {creators.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                          Không tìm thấy creator nào
                        </td>
                      </tr>
                    ) : (
                      creators.map((creator) => (
                        <tr
                          key={creator.creatorId}
                          onClick={() => setSelectedCreator(creator)}
                          className="hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={creator.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.fullName)}&background=3b82f6&color=fff`}
                                alt={creator.fullName}
                                className="w-10 h-10 rounded-full"
                              />
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {creator.fullName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {creator.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(creator.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                            {formatCurrency(creator.balance)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                            {creator.totalCourses}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                            {creator.totalStudents}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-yellow-500">★</span>
                              <span className="text-sm font-medium text-gray-900">
                                {creator.avgRating?.toFixed(1) || 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {creator.warningCount > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                <AlertCircle className="w-3 h-3" />
                                {creator.warningCount}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(creator.createDate)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="bg-white rounded-lg shadow-sm mt-4 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{currentPage * pageSize + 1}</span> đến{' '}
                    <span className="font-medium">
                      {Math.min((currentPage + 1) * pageSize, totalElements)}
                    </span>{' '}
                    trong tổng số <span className="font-medium">{totalElements}</span> kết quả
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = idx;
                        } else if (currentPage < 3) {
                          pageNum = idx;
                        } else if (currentPage > totalPages - 3) {
                          pageNum = totalPages - 5 + idx;
                        } else {
                          pageNum = currentPage - 2 + idx;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 rounded-lg transition-colors ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum + 1}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage >= totalPages - 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Creator Detail Modal */}
        {selectedCreator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Chi tiết Creator</h2>
                <button
                  onClick={() => setSelectedCreator(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-start gap-6 mb-6">
                  <img
                    src={selectedCreator.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCreator.fullName)}&background=3b82f6&color=fff&size=128`}
                    alt={selectedCreator.fullName}
                    className="w-24 h-24 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedCreator.fullName}
                    </h3>
                    <p className="text-gray-600 mb-3">{selectedCreator.email}</p>
                    {getStatusBadge(selectedCreator.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Số dư</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(selectedCreator.balance)}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Tổng khóa học</p>
                    <p className="text-xl font-bold text-gray-900">
                      {selectedCreator.totalCourses}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Tổng học viên</p>
                    <p className="text-xl font-bold text-gray-900">
                      {selectedCreator.totalStudents}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Đánh giá trung bình</p>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 text-xl">★</span>
                      <p className="text-xl font-bold text-gray-900">
                        {selectedCreator.avgRating?.toFixed(1) || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Số lần cảnh báo</p>
                    <p className={`text-xl font-bold ${selectedCreator.warningCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      {selectedCreator.warningCount}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Ngày tạo</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatDate(selectedCreator.createDate)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors " onClick={()=>{
                     nav(`/admin/creatorDetail/${selectedCreator.creatorId}`)
                  }}>
                    Xem chi tiết đầy đủ
                  </button>
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors " onClick={()=>{
                     nav(`/admin/violent-history/${selectedCreator.creatorId}`)
                  }}>
                    lịch sử cảnh báo
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={()=>{
                     nav(`/admin/auditlog-history/${selectedCreator.creatorId}`)
                  }}>
                    auditlog
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCreatorManagement;