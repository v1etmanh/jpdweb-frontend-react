import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import { adminSystemOverviewApi } from "jpdweb/api/admin/adminSystemOverviewApi";
import { showErrorNotification } from "jpdweb/api/core/apiClient";



export default function AdminDashboardPage() {
  const [overview, setOverview] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchChart = async () => {
    try {
      const res = await adminSystemOverviewApi.getChart("MONTH"); // hoặc WEEK/YEAR
      if (res.success) {
        // chuyển dữ liệu sang định dạng recharts
        const formatted = res.data.revenueChart.labels.map((label, idx) => ({
          name: label,
          revenue: res.data.revenueChart.data[idx],
        }));
        setChartData(formatted);
      } else {
        showErrorNotification(res.message || "Không thể tải chart");
      }
    } catch (error) {
      console.error(error);
      showErrorNotification("Đã xảy ra lỗi khi tải chart");
    }
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">Tổng số Creator</p>
            <p className="text-2xl font-bold">{overview.totalCreators}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">Tổng số khóa học</p>
            <p className="text-2xl font-bold">{overview.totalCourses}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">Tổng số đăng ký</p>
            <p className="text-2xl font-bold">{overview.totalEnrollments}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">Doanh thu</p>
            <p className="text-2xl font-bold">${overview.totalRevenue}</p>
          </div>
        </div>
      )}

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Doanh thu theo tháng</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
