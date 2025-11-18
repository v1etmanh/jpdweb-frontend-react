import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Users, UserCheck, BookOpen, UserPlus, DollarSign } from "lucide-react";

import { adminSystemOverviewApi } from "jpdweb/api/admin/adminSystemOverviewApi";
import { showErrorNotification } from "jpdweb/api/core/apiClient";



export default function AdminDashboardPage() {
  const [overview, setOverview] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("MONTH");

  const fetchOverview = async () => {
    try {
      const res = await adminSystemOverviewApi.getOverview();
      if (res.success) {
        setOverview(res.data);
      } else {
        showErrorNotification(res.message || "Không thể tải dữ liệu tổng quan");
      }
    } catch (error) {
      console.error(error);
      showErrorNotification("Đã xảy ra lỗi khi tải dữ liệu tổng quan");
    }
  };

  const fetchChart = async (selectedPeriod = "MONTH") => {
    try {
      console.log('Fetching chart with period:', selectedPeriod);
      const res = await adminSystemOverviewApi.getChart(selectedPeriod);
      console.log('Chart response:', res);
      if (res.success) {
        // chuyển dữ liệu sang định dạng recharts
        const formatted = res.data.revenueChart.labels.map((label, idx) => ({
          name: label,
          revenue: res.data.revenueChart.data[idx],
        }));
        console.log('Formatted chart data:', formatted);
        setChartData(formatted);
      } else {
        showErrorNotification(res.message || "Không thể tải chart");
      }
    } catch (error) {
      console.error('Error fetching chart:', error);
      showErrorNotification("Đã xảy ra lỗi khi tải chart");
    }
  };

  const handlePeriodChange = async (e) => {
    const newPeriod = e.target.value;
    setPeriod(newPeriod);
    await fetchChart(newPeriod);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchOverview(), fetchChart()]).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Overview Cards */}
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden" style={{ backgroundColor: '#06b6d4' }}>
            <div className="absolute top-2 right-2 bg-white rounded-full p-2">
              <Users style={{ color: '#0078beff' }} size={24} />
            </div>
            <p className="text-white text-base mb-1 mt-8">Số người dùng</p>
            <p className="text-3xl font-bold text-white">{overview.totalUsers}</p>
          </div>
          <div className="p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden" style={{ backgroundColor: '#06b6d4' }}>
            <div className="absolute top-2 right-2 bg-white rounded-full p-2">
              <UserCheck style={{ color: '#0078beff' }} size={24} />
            </div>
            <p className="text-white text-base mb-1 mt-8">Số Creator</p>
            <p className="text-3xl font-bold text-white">{overview.totalCreators}</p>
          </div>
          <div className="p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden" style={{ backgroundColor: '#06b6d4' }}>
            <div className="absolute top-2 right-2 bg-white rounded-full p-2">
              <BookOpen style={{ color: '#0078beff' }} size={24} />
            </div>
            <p className="text-white text-base mb-1 mt-8">Số khóa học</p>
            <p className="text-3xl font-bold text-white">{overview.totalCourses}</p>
          </div>
          <div className="p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden" style={{ backgroundColor: '#06b6d4' }}>
            <div className="absolute top-2 right-2 bg-white rounded-full p-2">
              <UserPlus style={{ color: '#0078beff' }} size={24} />
            </div>
            <p className="text-white text-base mb-1 mt-8">Số lượt đăng ký</p>
            <p className="text-3xl font-bold text-white">{overview.totalEnrollments}</p>
          </div>
          <div className="p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden" style={{ backgroundColor: '#06b6d4' }}>
            <div className="absolute top-2 right-2 bg-white rounded-full p-2">
              <DollarSign style={{ color: '#0078beff' }} size={24} />
            </div>
            <p className="text-white text-base mb-1 mt-8">Doanh thu</p>
            <p className="text-3xl font-bold text-white">${overview.totalRevenue}</p>
          </div>
        </div>
      )}

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Doanh thu {period === 'WEEK' ? 'theo tuần' : period === 'MONTH' ? 'theo tháng' : 'theo năm'}
          </h2>
          <select 
            value={period}
            onChange={handlePeriodChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white cursor-pointer"
          >
            <option value="WEEK">Tuần</option>
            <option value="MONTH">Tháng</option>
            <option value="YEAR">Năm</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.6}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(6, 182, 212, 0.1)' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value) => [`$${value}`, 'Doanh thu']}
            />
            <Bar 
              dataKey="revenue" 
              fill="url(#colorRevenue)" 
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
