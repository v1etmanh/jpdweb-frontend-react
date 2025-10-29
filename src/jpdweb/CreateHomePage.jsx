import React, { useEffect, useState } from 'react';
import { 
  Users, 
  DollarSign, 
  BookOpen, 
  Star, 
  TrendingUp, 
  Award,
  MessageSquare,
  Download,
  Wallet,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './security/Authentication';
import { retriveCreatorStatistic, createWithdraw } from './api/ApiConnect';
import { creatorApi } from './api/creatorApi';
import { API_RESPONSE_TYPES, showErrorNotification, showWarningNotification } from './api/apiClient';

const CreatorHomePage = () => { 
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const nav = useNavigate();
  const { creatorInfor } = useAuth();

  useEffect(() => {
    if (creatorInfor?.status !== 'SUCCESS') {
      console.log(creatorInfor);
      nav("/upload_profile");
    } else {
      fetchData();
    }
  }, []);

 const fetchData = async () => {
  setLoading(true);
  
  const response = await creatorApi.getStatistic();
  
  if (response.success) {
    setData(response.data);
  } else {
    handleFetchStatisticError(response);
  }
  
  setLoading(false);
};

// ✅ Hàm xử lý lỗi riêng cho fetch statistics
const handleFetchStatisticError = (response) => {
  const message = response.message || 'Không thể tải thống kê';

  switch (response.responseType) {
    case API_RESPONSE_TYPES.UNAUTHORIZED:
      // Không có quyền xem thống kê (chỉ creator/admin)
      showWarningNotification('Bạn không có quyền xem thống kê');
      // Có thể redirect về trang khác
      // navigate('/dashboard');
      break;

    case API_RESPONSE_TYPES.NOT_FOUND:
      // Chưa có dữ liệu thống kê (creator mới, chưa có course)
      showWarningNotification('Chưa có dữ liệu thống kê. Hãy tạo khóa học đầu tiên của bạn!');
      // Set empty data để UI hiển thị empty state
      setData({
        totalRevenue: 0,
        totalStudents: 0,
        totalCourses: 0,
        // ... other default values
      });
      break;

    case API_RESPONSE_TYPES.SERVER_ERROR:
      // Lỗi server khi tính toán thống kê
      showErrorNotification('Hệ thống đang bận. Vui lòng thử lại sau');
      console.error('Statistics Server Error:', {
        status: response.status,
        code: response.code,
        traceId: response.traceId
      });
      break;

    default:
      // Lỗi khác
      showErrorNotification(message);
      console.error('Statistics Error:', {
        status: response.status,
        code: response.code,
        traceId: response.traceId
      });
  }
};

 

  

  const stats = data || {
    totalRevenue: 0,
    totalStudents: 0,
    totalCourses: 0,
    avgRating: 0,
    completionRate: 0,
    newEnrollments: 0,
    totalReviews: 0
  };

  const recentCourses = data?.ppc || [];

  const StatCard = ({ icon: Icon, title, value, change, color = "blue" }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change > 0 ? '+' : ''}{change}% so với tháng trước
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-50`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Giáo viên</h1>
              <p className="text-sm text-gray-600 mt-1">
                Chào mừng trở lại, {creatorInfor?.name || 'Giáo viên'}
              </p>
            </div>
            <div className="flex space-x-3">
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="thisMonth">Tháng này</option>
                <option value="lastMonth">Tháng trước</option>
                <option value="thisYear">Năm này</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12.5% so với tháng trước
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="p-3 rounded-full bg-green-50">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
               
              </div>
            </div>
          </div>

          <StatCard
            icon={Users}
            title="Tổng số học viên"
            value={stats.totalStudents.toLocaleString()}
            change={8.2}
            color="blue"
          />
          <StatCard
            icon={BookOpen}
            title="Tổng số khóa học"
            value={stats.totalCourses}
            change={5.1}
            color="purple"
          />
          <StatCard
            icon={Star}
            title="Đánh giá trung bình"
            value={stats.avgRating.toFixed(1)}
            change={2.3}
            color="yellow"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Popular Courses */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Khóa học phổ biến</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Xem tất cả
              </button>
            </div>
            
            {recentCourses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Chưa có khóa học nào
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Khóa học</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Học viên</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Doanh thu</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Đánh giá</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentCourses.map((course) => (
                      <tr key={course.courseId} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            {course.urlImg && (
                              <img 
                                src={course.urlImg} 
                                alt={course.title}
                                className="w-10 h-10 rounded object-cover mr-3"
                              />
                            )}
                            <div className="font-medium text-gray-900">{course.title}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-gray-400 mr-2" />
                            {course.students}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600 font-medium">
                          {formatCurrency(course.revenue)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                            <span className="text-gray-900 font-medium">
                              {course.rating.toFixed(1)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <button 
                            onClick={() => nav(`/creator/course/${course.courseId}`)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê nhanh</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Tỷ lệ hoàn thành</span>
                  </div>
                  <span className="font-semibold">{stats.completionRate.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Đăng ký mới</span>
                  </div>
                  <span className="font-semibold">{stats.newEnrollments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Tổng đánh giá</span>
                  </div>
                  <span className="font-semibold">{stats.totalReviews}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    
    
    </div>
  );
};

export default CreatorHomePage;