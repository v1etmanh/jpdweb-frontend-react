import React, { useState, useEffect } from 'react';

const CreatorManagement = () => {
  const [creators, setCreators] = useState([]);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - thay thế bằng API call thực tế
  const mockCreators = [
    {
      creatorId: 1,
      fullName: "Nguyễn Văn A",
      mobiNumber: "0123456789",
      titleSelf: "Giảng viên IT",
      imageUrl: "https://via.placeholder.com/150",
      paypalEmail: "creator1@email.com",
      currentCapacity: 2.5,
      maxCapacity: 10.0,
      balance: 15000000,
      numberCourses: 12,
      totalStudent: 350,
      courses: [],
      withdrawals: [],
      userSubscriptions: []
    },
    {
      creatorId: 2,
      fullName: "Trần Thị B",
      mobiNumber: "0987654321",
      titleSelf: "Chuyên gia Marketing",
      imageUrl: "https://via.placeholder.com/150",
      paypalEmail: "creator2@email.com",
      currentCapacity: 5.2,
      maxCapacity: 15.0,
      balance: 25000000,
      numberCourses: 8,
      totalStudent: 520,
      courses: [],
      withdrawals: [],
      userSubscriptions: []
    }
  ];

  useEffect(() => {
    setCreators(mockCreators);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatCapacity = (current, max) => {
    const percentage = (current / max) * 100;
    return { current, max, percentage };
  };

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = creator.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creator.mobiNumber.includes(searchTerm);
    return matchesSearch;
  });

  const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <i className={`fas fa-arrow-${trend > 0 ? 'up' : 'down'} mr-1`}></i>
              {Math.abs(trend)}% so với tháng trước
            </p>
          )}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: color + '20' }}>
          <i className={`${icon} text-2xl`} style={{ color }}></i>
        </div>
      </div>
    </div>
  );

  const CreatorModal = ({ creator, onClose }) => {
    if (!creator) return null;
    
    const capacityInfo = formatCapacity(creator.currentCapacity, creator.maxCapacity);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="bg-[#243864] text-white p-6 rounded-t-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Thông tin chi tiết Creator</h2>
              <button 
                onClick={onClose}
                className="text-white hover:text-gray-300 text-2xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {/* Thông tin cá nhân */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-1">
                <div className="text-center">
                  <img 
                    src={creator.imageUrl} 
                    alt={creator.fullName}
                    className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-[#1e88e5]"
                  />
                  <h3 className="text-xl font-bold text-gray-900">{creator.fullName}</h3>
                  <p className="text-gray-600">{creator.titleSelf}</p>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-700">
                      <i className="fas fa-phone text-[#1e88e5] mr-2"></i>
                      {creator.mobiNumber}
                    </p>
                    <p className="text-sm text-gray-700">
                      <i className="fas fa-envelope text-[#1e88e5] mr-2"></i>
                      {creator.paypalEmail}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 gap-4">
                  {/* Số lượng học viên */}
                  <div className="bg-gradient-to-r from-[#1e88e5] to-blue-600 text-white p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Tổng học viên</p>
                        <p className="text-2xl font-bold">{creator.totalStudent.toLocaleString()}</p>
                      </div>
                      <i className="fas fa-users text-3xl opacity-80"></i>
                    </div>
                  </div>

                  {/* Thu nhập */}
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Tổng thu nhập</p>
                        <p className="text-xl font-bold">{formatCurrency(creator.balance)}</p>
                      </div>
                      <i className="fas fa-money-bill-wave text-3xl opacity-80"></i>
                    </div>
                  </div>

                  {/* Số lượng khóa học */}
                  <div className="bg-gradient-to-r from-[#243864] to-purple-800 text-white p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Số khóa học</p>
                        <p className="text-2xl font-bold">{creator.numberCourses}</p>
                      </div>
                      <i className="fas fa-book text-3xl opacity-80"></i>
                    </div>
                  </div>

                  {/* Dung lượng */}
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Dung lượng</p>
                        <p className="text-lg font-bold">
                          {capacityInfo.current}GB / {capacityInfo.max}GB
                        </p>
                        <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mt-2">
                          <div 
                            className="bg-white h-2 rounded-full transition-all duration-300"
                            style={{ width: `${capacityInfo.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <i className="fas fa-hdd text-3xl opacity-80"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bảng thống kê chi tiết */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hoạt động gần đây */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  <i className="fas fa-chart-line text-[#1e88e5] mr-2"></i>
                  Hoạt động gần đây
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Khóa học mới nhất</span>
                    <span className="font-semibold">React Advanced</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Lần đăng nhập cuối</span>
                    <span className="font-semibold">2 giờ trước</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Trạng thái</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                      Hoạt động
                    </span>
                  </div>
                </div>
              </div>

              {/* Thống kê tài chính */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  <i className="fas fa-wallet text-[#e53935] mr-2"></i>
                  Thống kê tài chính
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Thu nhập tháng này</span>
                    <span className="font-semibold text-green-600">+2,500,000₫</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Số lần rút tiền</span>
                    <span className="font-semibold">{creator.withdrawals.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Hoa hồng trung bình</span>
                    <span className="font-semibold">15%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
              <button className="bg-[#e53935] hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors">
                <i className="fas fa-ban mr-2"></i>Tạm khóa
              </button>
              <button className="bg-[#1e88e5] hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
                <i className="fas fa-edit mr-2"></i>Chỉnh sửa
              </button>
              <button 
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#243864] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <i className="fas fa-user-tie text-white text-2xl mr-3"></i>
              <h1 className="text-2xl font-bold text-white">Quản Lý Creator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-[#1e88e5] hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                <i className="fas fa-plus mr-2"></i>Thêm Creator
              </button>
              <button className="bg-white text-[#243864] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <i className="fas fa-download mr-2"></i>Xuất Excel
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Tổng Creator"
            value={creators.length.toLocaleString()}
            icon="fas fa-users"
            color="#243864"
            trend={12}
          />
          <StatCard 
            title="Creator Hoạt động"
            value="156"
            icon="fas fa-user-check"
            color="#1e88e5"
            trend={8}
          />
          <StatCard 
            title="Tổng Thu nhập"
            value="2.4B₫"
            icon="fas fa-money-bill-wave"
            color="#4caf50"
            trend={15}
          />
          <StatCard 
            title="Creator Mới"
            value="12"
            icon="fas fa-user-plus"
            color="#e53935"
            trend={-5}
          />
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e88e5] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
            </div>
            <div className="flex space-x-4">
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e88e5] focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Tạm khóa</option>
                <option value="pending">Chờ duyệt</option>
              </select>
            </div>
          </div>
        </div>

        {/* Creator Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Học viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thu nhập
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khóa học
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dung lượng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCreators.map((creator) => {
                  const capacityInfo = formatCapacity(creator.currentCapacity, creator.maxCapacity);
                  return (
                    <tr key={creator.creatorId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            className="h-12 w-12 rounded-full border-2 border-[#1e88e5]" 
                            src={creator.imageUrl} 
                            alt={creator.fullName}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{creator.fullName}</div>
                            <div className="text-sm text-gray-500">{creator.titleSelf}</div>
                            <div className="text-xs text-gray-400">{creator.mobiNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-semibold">{creator.totalStudent.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">học viên</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-semibold">{formatCurrency(creator.balance)}</div>
                        <div className="text-xs text-green-600">+12% tháng này</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-semibold">{creator.numberCourses}</div>
                        <div className="text-xs text-gray-500">khóa học</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {capacityInfo.current}GB / {capacityInfo.max}GB
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              capacityInfo.percentage > 80 ? 'bg-red-500' :
                              capacityInfo.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${capacityInfo.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">{capacityInfo.percentage.toFixed(1)}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedCreator(creator);
                              setShowModal(true);
                            }}
                            className="text-[#1e88e5] hover:text-blue-600 transition-colors"
                            title="Xem chi tiết"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className="text-[#243864] hover:text-purple-600 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="text-[#e53935] hover:text-red-600 transition-colors"
                            title="Xóa"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow-md">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Trước
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Sau
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">10</span> trong <span className="font-medium">{creators.length}</span> kết quả
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="bg-[#1e88e5] border-[#1e88e5] text-white relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </button>
                <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  2
                </button>
                <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  3
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </main>

      {/* Creator Detail Modal */}
      {showModal && (
        <CreatorModal 
          creator={selectedCreator} 
          onClose={() => {
            setShowModal(false);
            setSelectedCreator(null);
          }} 
        />
      )}
    </div>
  );
};

export default CreatorManagement;