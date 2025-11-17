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
  ChevronLeft,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { showWarningNotification } from 'jpdweb/api/core/apiClient';
import { creatorApi } from 'jpdweb/api/creator/creatorApi';

const CreatorHomePage = () => { 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    setLoading(true);
    
 
      // 🔥 THAY ĐOẠN NÀY BẰNG API THỰC
      const response = await creatorApi.getStatistic(selectedMonth, selectedYear);
      if (response.success) {
        setData(response.data);
      } else {
        showWarningNotification("cannot get data");
      }
      
   
    
      setLoading(false);
    
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    if (selectedYear === currentYear && selectedMonth === currentMonth) {
      return;
    }
    
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    // Không cho phép chọn tháng trong tương lai
    if (selectedYear === currentYear && newMonth > currentMonth) {
      return;
    }
    
    setSelectedMonth(newMonth);
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    // Nếu chọn năm hiện tại, kiểm tra tháng có hợp lệ không
    if (newYear === currentYear && selectedMonth > currentMonth) {
      setSelectedMonth(currentMonth);
    }
    
    setSelectedYear(newYear);
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return selectedMonth === now.getMonth() + 1 && selectedYear === now.getFullYear();
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

  const StatCard = ({ icon: Icon, title, value, change, color = "blue" }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      yellow: 'bg-yellow-50 text-yellow-600'
    };

    return (
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
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = 0; i <= 5; i++) {
    years.push(currentYear - i);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu tháng {selectedMonth}/{selectedYear}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Giáo viên</h1>
              <p className="text-sm text-gray-600 mt-1">
                Thống kê tháng {selectedMonth}/{selectedYear}
              </p>
            </div>
            
            {/* Month/Year Selector */}
            <div className="flex items-center space-x-3 flex-wrap">
              <button 
                onClick={handlePreviousMonth}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Tháng trước"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <select 
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Tháng {i + 1}
                    </option>
                  ))}
                </select>
                
                <select 
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <button 
                onClick={handleNextMonth}
                disabled={isCurrentMonth()}
                className={`p-2 border border-gray-300 rounded-lg transition-colors ${
                  isCurrentMonth() 
                    ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                    : 'hover:bg-gray-50'
                }`}
                title={isCurrentMonth() ? 'Đã đến tháng hiện tại' : 'Tháng sau'}
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm">
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
              <div className="p-3 rounded-full bg-green-50">
                <DollarSign className="w-6 h-6 text-green-600" />
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
                Chưa có khóa học nào trong tháng này
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Khóa học</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Học viên</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Doanh thu</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Đánh giá</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Hành động</th>
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
                            <div className="font-medium text-gray-900 text-sm">{course.title}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600 text-sm">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-gray-400 mr-2" />
                            {course.students}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600 font-medium text-sm">
                          {formatCurrency(course.revenue)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                            <span className="text-gray-900 font-medium text-sm">
                              {course.rating.toFixed(1)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <button 
                            onClick={() => alert(`Xem chi tiết khóa học: ${course.title}`)}
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

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Mẹo nhỏ</h3>
              <p className="text-sm text-blue-100">
                Xem thống kê các tháng trước để so sánh và cải thiện hiệu suất giảng dạy của bạn!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorHomePage;