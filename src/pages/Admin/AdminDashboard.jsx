import React, { useState } from 'react';
import { LayoutDashboard, Users, MessageSquare, BookOpen, CreditCard, BarChart3, Settings, Bell, Search, Menu, X, LogOut, ChevronDown, UserCheck, UserCog } from 'lucide-react';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // Sample data - thay thế bằng API calls đến Spring Boot backend
  const stats = [
    { title: 'Tổng Creator', value: '145', change: '+12.5%', positive: true, icon: UserCheck, color: 'from-blue-500 to-blue-600' },
    { title: 'Tổng Khách hàng', value: '2,543', change: '+23.1%', positive: true, icon: Users, color: 'from-indigo-500 to-indigo-600' },
    { title: 'Khóa học', value: '87', change: '+8.2%', positive: true, icon: BookOpen, color: 'from-purple-500 to-purple-600' },
    { title: 'Doanh thu tháng', value: '₫245M', change: '+15.3%', positive: true, icon: CreditCard, color: 'from-pink-500 to-pink-600' },
  ];

  const recentFeedbacks = [
    { id: 1, customer: 'Nguyễn Văn A', course: 'N5 Grammar Course', rating: 5, comment: 'Khóa học rất hay và dễ hiểu!', date: '2 giờ trước' },
    { id: 2, customer: 'Trần Thị B', course: 'Kanji Mastery', rating: 4, comment: 'Giáo trình tốt, cần thêm bài tập.', date: '5 giờ trước' },
    { id: 3, customer: 'Lê Văn C', course: 'JLPT N3 Prep', rating: 5, comment: 'Tuyệt vời! Đã pass kỳ thi.', date: '1 ngày trước' },
  ];

  const recentTransactions = [
    { id: '#TXN-001', customer: 'Phạm Thị D', course: 'Full N5 Package', amount: '₫1,200,000', status: 'Hoàn thành', date: '10/01/2025' },
    { id: '#TXN-002', customer: 'Hoàng Văn E', course: 'Conversation Course', amount: '₫800,000', status: 'Đang xử lý', date: '10/01/2025' },
    { id: '#TXN-003', customer: 'Đỗ Thị F', course: 'Kanji N4', amount: '₫650,000', status: 'Hoàn thành', date: '09/01/2025' },
  ];

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'creators', icon: UserCog, label: 'Creator Management' },
    { id: 'customers', icon: Users, label: 'Customer Management' },
    { id: 'courses', icon: BookOpen, label: 'Course Management' },
    { id: 'feedbacks', icon: MessageSquare, label: 'Feedback Management' },
    { id: 'transactions', icon: CreditCard, label: 'Transaction Management' },
    { id: 'analytics', icon: BarChart3, label: 'View Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 text-white transition-all duration-300 overflow-hidden shadow-2xl`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold">J</span>
            </div>
            <div>
              <span className="text-xl font-bold block">JAEN</span>
              <span className="text-xs text-gray-400">Admin Panel</span>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeMenu === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg scale-105'
                      : 'hover:bg-slate-800 hover:translate-x-1'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 w-72 p-6 border-t border-slate-700">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all">
            <LogOut size={20} />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {sidebarOpen ? <X size={24} className="text-slate-700" /> : <Menu size={24} className="text-slate-700" />}
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-96 bg-gray-50"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell size={24} className="text-slate-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
                <img
                  src="https://ui-avatars.com/api/?name=Admin+JAEN&background=3B82F6&color=fff"
                  alt="Admin"
                  className="w-10 h-10 rounded-full ring-2 ring-blue-500"
                />
                <div className="text-sm">
                  <p className="font-semibold text-slate-800">Admin</p>
                  <p className="text-gray-500 text-xs">admin@jaen.com</p>
                </div>
                <ChevronDown size={20} className="text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Welcome to JAEN Admin</h1>
            <p className="text-gray-600 mt-2">Quản lý hệ thống học tiếng Nhật hiệu quả và chuyên nghiệp</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon size={28} className="text-white" />
                    </div>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${stat.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Recent Feedbacks */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <MessageSquare className="text-purple-500" size={24} />
                  Feedback Gần Đây
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {recentFeedbacks.map((feedback) => (
                  <div key={feedback.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-slate-800">{feedback.customer}</p>
                        <p className="text-xs text-gray-500">{feedback.course}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{feedback.comment}</p>
                    <p className="text-xs text-gray-500">{feedback.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <CreditCard className="text-pink-500" size={24} />
                  Giao Dịch Gần Đây
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-blue-600 text-sm">{transaction.id}</p>
                        <p className="font-medium text-slate-800">{transaction.customer}</p>
                        <p className="text-xs text-gray-600">{transaction.course}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-800 text-lg">{transaction.amount}</p>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          transaction.status === 'Hoàn thành' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BarChart3 className="text-blue-500" size={24} />
                Thống Kê Doanh Thu
              </h3>
              <div className="h-64 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl flex items-center justify-center border-2 border-dashed border-indigo-200">
                <div className="text-center">
                  <BarChart3 size={48} className="text-indigo-300 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">Biểu đồ doanh thu</p>
                  <p className="text-gray-400 text-sm">(Tích hợp với Recharts)</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BookOpen className="text-purple-500" size={24} />
                Khóa Học Phổ Biến
              </h3>
              <div className="h-64 bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 rounded-xl flex items-center justify-center border-2 border-dashed border-purple-200">
                <div className="text-center">
                  <BookOpen size={48} className="text-purple-300 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">Top khóa học</p>
                  <p className="text-gray-400 text-sm">(Tích hợp với Recharts)</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;