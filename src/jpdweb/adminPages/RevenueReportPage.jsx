import React, { useEffect, useState } from "react";
import { adminTransactionApi } from "../api/adminTransactionApi";

export default function RevenueReportPage() {
  const [period, setPeriod] = useState("MONTH"); // DAY, WEEK, MONTH, QUARTER, YEAR
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [quarter, setQuarter] = useState(Math.floor(new Date().getMonth() / 3) + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = { period };
      
      if (period === "MONTH") {
        params.month = month;
        params.year = year;
      } else if (period === "QUARTER") {
        params.quarter = quarter;
        params.year = year;
      } else if (period === "YEAR") {
        params.year = year;
      }

      console.log("Sending params to backend:", params);
      const data = await adminTransactionApi.getRevenueReport(params);
      setReport(data?.data?.data);
      console.log("API Response:", data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [period, month, quarter, year]);

  const handleExport = async () => {
    try {
      let res;
      if (period === "MONTH") res = await adminTransactionApi.exportExcelMonthly(month, year);
      else if (period === "QUARTER") res = await adminTransactionApi.exportExcelQuarterly(quarter, year);
      else if (period === "YEAR") res = await adminTransactionApi.exportExcelYearly(year);

      const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `RevenueReport_${period}_${year}.xlsx`;
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Báo cáo Doanh thu</h2>
        <p className="text-slate-600">Theo dõi và phân tích doanh thu hệ thống</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Bộ lọc báo cáo</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Chu kỳ</label>
            <select
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="MONTH">Theo tháng</option>
              <option value="QUARTER">Theo quý</option>
              <option value="YEAR">Theo năm</option>
            </select>
          </div>

          {(period === "MONTH" || period === "QUARTER") && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {period === "MONTH" ? "Tháng" : "Quý"}
              </label>
              <input
                type="number"
                min={1}
                max={period === "MONTH" ? 12 : 4}
                value={period === "MONTH" ? month : quarter}
                onChange={(e) =>
                  period === "MONTH"
                    ? setMonth(Number(e.target.value))
                    : setQuarter(Number(e.target.value))
                }
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Năm</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchReport}
              disabled={loading}
              className="w-full bg-cyan-500 text-white py-2.5 rounded-lg hover:bg-cyan-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang tải...
                </>
              ) : (
                <>
                  <span>📊</span>
                  Tải báo cáo
                </>
              )}
            </button>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleExport}
              disabled={!report}
              className="w-full bg-orange-500 text-white py-2.5 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>📥</span>
              Xuất Excel
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Đang tải dữ liệu báo cáo...</p>
        </div>
      )}

      {/* Report Results */}
      {report && !loading && (
        <div className="space-y-6">
          {/* Revenue Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-cyan-500 text-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100 text-sm font-medium">Tổng doanh thu</p>
                  <p className="text-2xl font-bold mt-1">
                    {report.totalRevenue?.toLocaleString() ?? "-"} VND
                  </p>
                </div>
                <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-lg">💰</span>
                </div>
              </div>
            </div>

            <div className="bg-cyan-500 text-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100 text-sm font-medium">Doanh thu Admin</p>
                  <p className="text-2xl font-bold mt-1">
                    {report.adminRevenue?.toLocaleString() ?? "-"} VND
                  </p>
                </div>
                <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-lg">👑</span>
                </div>
              </div>
            </div>

            <div className="bg-cyan-500 text-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100 text-sm font-medium">Doanh thu Creator</p>
                  <p className="text-2xl font-bold mt-1">
                    {report.creatorRevenue?.toLocaleString() ?? "-"} VND
                  </p>
                </div>
                <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-lg">🎨</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Tổng giao dịch</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    {report.totalTransactions ?? "-"}
                  </p>
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <span className="text-slate-600">📈</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Thành công</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    {report.successfulTransactions ?? "-"}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">✅</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Thất bại</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    {report.failedTransactions ?? "-"}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600">❌</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Đang chờ</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    {report.pendingTransactions ?? "-"}
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600">⏳</span>
                </div>
              </div>
            </div>
          </div>

          {/* Average and Rate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Giá trị giao dịch trung bình</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    {report.averageTransactionValue?.toLocaleString() ?? "-"} VND
                  </p>
                </div>
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                  <span className="text-cyan-500 text-lg">📊</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Tỷ lệ thành công</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    {report.successRate ? report.successRate.toFixed(2) + "%" : "-"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-500 text-lg">🎯</span>
                </div>
              </div>
            </div>
          </div>

          {/* Two Columns Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Courses */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="bg-cyan-500 text-white px-6 py-4 rounded-t-lg">
                <h4 className="text-lg font-semibold">Khóa học hàng đầu</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b">Khóa học</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b">Doanh thu</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b">Lượt đăng ký</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(report.topCourses || []).map((c) => (
                      <tr key={c.courseId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-slate-900">{c.courseName}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                          {c.totalRevenue?.toLocaleString()} VND
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">{c.enrollmentCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Creators */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="bg-cyan-500 text-white px-6 py-4 rounded-t-lg">
                <h4 className="text-lg font-semibold">Creator hàng đầu</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b">Creator</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b">Doanh thu</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b">Số khóa học</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(report.topCreators || []).map((c) => (
                      <tr key={c.creatorId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-slate-900">{c.creatorName}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                          {c.totalRevenue?.toLocaleString()} VND
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">{c.courseCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}