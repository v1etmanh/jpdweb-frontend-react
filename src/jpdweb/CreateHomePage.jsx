import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  BookOpen, 
  Star, 
  TrendingUp, 
  Eye,
  Calendar,
  Award,
  MessageSquare,
  Download
} from 'lucide-react';

const CreatorHomePage = () => { const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');

  // Mock data
  const stats = {
    totalRevenue: 15750000,
    totalStudents: 2847,
    totalCourses: 12,
    avgRating: 4.8,
    totalViews: 45230,
    completionRate: 87,
    newEnrollments: 156,
    totalReviews: 1205
  };

  const recentCourses = [
    { id: 1, title: 'React cho người mới bắt đầu', students: 450, revenue: 6750000, rating: 4.9 },
    { id: 2, title: 'JavaScript nâng cao', students: 320, revenue: 4800000, rating: 4.7 },
    { id: 3, title: 'Node.js Backend Development', students: 280, revenue: 4200000, rating: 4.8 },
    { id: 4, title: 'Python cơ bản', students: 380, revenue: 5700000, rating: 4.6 },
    { id: 5, title: 'Database Design & MySQL', students: 195, revenue: 2925000, rating: 4.9 },
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Giáo viên</h1>
              <p className="text-sm text-gray-600 mt-1">Chào mừng trở lại, Nguyễn Văn A</p>
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
          <StatCard
            icon={DollarSign}
            title="Tổng doanh thu"
            value={formatCurrency(stats.totalRevenue)}
            change={12.5}
            color="green"
          />
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
            value={stats.avgRating}
            change={2.3}
            color="yellow"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Popular Courses - Now takes more space */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Khóa học phổ biến</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Xem tất cả
              </button>
            </div>
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
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{course.title}</div>
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
                          <span className="text-gray-900 font-medium">{course.rating}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline">
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                  <span className="font-semibold">{stats.completionRate}%</span>
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