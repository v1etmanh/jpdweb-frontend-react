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
    
    // Gửi params theo đúng backend mong đợi
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
    setReport(data?.data?.data); // Lưu ý: data.data.data vì có ApiResponse wrapper
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Revenue Report</h2>

      {/* Bộ lọc */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Period</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="MONTH">Month</option>
            <option value="QUARTER">Quarter</option>
            <option value="YEAR">Year</option>
          </select>
        </div>

        {(period === "MONTH" || period === "QUARTER") && (
          <div>
            <label className="block text-sm font-medium mb-1">
              {period === "MONTH" ? "Month" : "Quarter"}
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
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={fetchReport}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Fetch Report
          </button>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleExport}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Kết quả */}
      {loading && <p className="text-gray-500 mt-4">Loading...</p>}

      {report && !loading && (
        <>
          {/* Tổng quan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded border">
              <p className="font-semibold">Total Revenue</p>
              <p>{report.totalRevenue?.toLocaleString() ?? "-"}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <p className="font-semibold">Admin Revenue</p>
              <p>{report.adminRevenue?.toLocaleString() ?? "-"}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <p className="font-semibold">Creator Revenue</p>
              <p>{report.creatorRevenue?.toLocaleString() ?? "-"}</p>
            </div>
          </div>

          {/* Thống kê giao dịch */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded border">
              <p className="font-semibold">Total Transactions</p>
              <p>{report.totalTransactions ?? "-"}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <p className="font-semibold">Successful</p>
              <p>{report.successfulTransactions ?? "-"}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <p className="font-semibold">Failed</p>
              <p>{report.failedTransactions ?? "-"}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <p className="font-semibold">Pending</p>
              <p>{report.pendingTransactions ?? "-"}</p>
            </div>
          </div>

          {/* Trung bình và tỉ lệ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded border">
              <p className="font-semibold">Average Transaction Value</p>
              <p>{report.averageTransactionValue?.toLocaleString() ?? "-"}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <p className="font-semibold">Success Rate</p>
              <p>{report.successRate ? report.successRate.toFixed(2) + "%" : "-"}</p>
            </div>
          </div>

          {/* Top Courses */}
          <h4 className="text-lg font-semibold mb-2">Top Courses</h4>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left border">Course</th>
                  <th className="p-2 text-left border">Total Revenue</th>
                  <th className="p-2 text-left border">Enrollments</th>
                </tr>
              </thead>
              <tbody>
                {(report.topCourses || []).map((c) => (
                  <tr key={c.courseId} className="border-t hover:bg-gray-50">
                    <td className="p-2">{c.courseName}</td>
                    <td className="p-2">{c.totalRevenue?.toLocaleString()}</td>
                    <td className="p-2">{c.enrollmentCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top Creators */}
          <h4 className="text-lg font-semibold mb-2">Top Creators</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left border">Creator</th>
                  <th className="p-2 text-left border">Total Revenue</th>
                  <th className="p-2 text-left border">Course Count</th>
                </tr>
              </thead>
              <tbody>
                {(report.topCreators || []).map((c) => (
                  <tr key={c.creatorId} className="border-t hover:bg-gray-50">
                    <td className="p-2">{c.creatorName}</td>
                    <td className="p-2">{c.totalRevenue?.toLocaleString()}</td>
                    <td className="p-2">{c.courseCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
