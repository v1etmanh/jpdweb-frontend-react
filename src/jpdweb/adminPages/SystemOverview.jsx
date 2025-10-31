import React, { useEffect, useState } from "react";
import { adminSystemOverviewApi } from "../api/adminSystemOverviewApi ";

const SystemOverview = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await adminSystemOverviewApi.getOverview();
        setOverview(res.data);
      } catch (err) {
        console.error("Lỗi khi tải thông tin hệ thống:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  // --- LOADING (30% - #06B6D4) ---
  if (loading) {
    return (
      <div className="flex items-center justify-center h-80 text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#06B6D4] mr-3"></div>
        <span className="text-lg">Đang tải thông tin hệ thống...</span>
      </div>
    );
  }

  // --- ERROR (10% - #F97316) ---
  if (!overview) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-center">
          <div className="text-[#F97316] text-xl mb-2">⚠️</div>
          <div className="text-[#F97316] font-medium">Không thể tải dữ liệu hệ thống.</div>
        </div>
      </div>
    );
  }

  const { system, database, http, application, status } = overview;

  // --- MAIN CONTENT (60% - #F1F5F9) ---
  return (
    <div className="p-6 space-y-6 bg-[#F1F5F9] min-h-screen">
      {/* Header (30% - #06B6D4) */}
      <div className="bg-[#06B6D4] rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-white">
          Tổng quan hệ thống
        </h1>
        <p className="text-white/90 mt-1">Thông tin tổng quan về hiệu năng và trạng thái hệ thống</p>
      </div>

      {/* SYSTEM METRICS */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-2 h-6 bg-[#06B6D4] rounded mr-3"></div>
          <h2 className="text-lg font-medium text-gray-800">System Metrics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">CPU Usage</p>
            <p className="text-2xl font-semibold text-gray-900">{system.cpuUsage?.toFixed(2)}%</p>
          </div>
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Memory Usage</p>
            <p className="text-2xl font-semibold text-gray-900">{system.memory.usagePercent?.toFixed(1)}%</p>
          </div>
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Disk Usage</p>
            <p className="text-2xl font-semibold text-gray-900">{system.disk.usagePercent?.toFixed(1)}%</p>
          </div>
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">RAM</p>
            <p className="text-lg font-medium text-gray-900">{system.memory.used}/{system.memory.max} MB</p>
          </div>
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Active Threads</p>
            <p className="text-lg font-medium text-gray-900">{system.activeThreads}</p>
          </div>
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Peak Threads</p>
            <p className="text-lg font-medium text-gray-900">{system.peakThreads}</p>
          </div>
        </div>
      </div>

      {/* DATABASE */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-2 h-6 bg-[#06B6D4] rounded mr-3"></div>
          <h2 className="text-lg font-medium text-gray-800">Database Metrics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
            <p className={`text-lg font-medium ${database.status === 'UP' ? 'text-[#06B6D4]' : 'text-[#F97316]'}`}>
              {database.status}
            </p>
          </div>
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Active Connections</p>
            <p className="text-lg font-medium text-gray-900">{database.activeConnections}</p>
          </div>
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Idle Connections</p>
            <p className="text-lg font-medium text-gray-900">{database.idleConnections}</p>
          </div>
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Max Connections</p>
            <p className="text-lg font-medium text-gray-900">{database.maxConnections}</p>
          </div>
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Min Connections</p>
            <p className="text-lg font-medium text-gray-900">{database.minConnections}</p>
          </div>
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Connections</p>
            <p className="text-lg font-medium text-gray-900">{database.totalConnections}</p>
          </div>
        </div>
      </div>

      {/* HTTP */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-2 h-6 bg-[#06B6D4] rounded mr-3"></div>
          <h2 className="text-lg font-medium text-gray-800">HTTP Metrics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Tổng request</p>
            <p className="text-lg font-medium text-gray-900">{http.totalRequests}</p>
          </div>
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Request/s</p>
            <p className="text-lg font-medium text-gray-900">{http.requestsPerSecond?.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Avg response</p>
            <p className="text-lg font-medium text-gray-900">{http.avgResponseTime?.toFixed(2)} ms</p>
          </div>
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Error rate</p>
            <p className="text-lg font-semibold text-[#F97316]">{http.errorRate?.toFixed(2)}%</p>
          </div>
        </div>
      </div>

      {/* APPLICATION INFO */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-2 h-6 bg-[#06B6D4] rounded mr-3"></div>
          <h2 className="text-lg font-medium text-gray-800">Application Info</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Tên ứng dụng</p>
            <p className="text-lg font-medium text-gray-900">{application.name}</p>
          </div>
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Phiên bản</p>
            <p className="text-lg font-medium text-gray-900">{application.version}</p>
          </div>
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Build Time</p>
            <p className="text-lg font-medium text-gray-900">{application.buildTime}</p>
          </div>
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Uptime</p>
            <p className="text-lg font-medium text-gray-900">{application.uptime} giây</p>
          </div>
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
            <p className={`text-lg font-medium ${status === 'UP' ? 'text-[#06B6D4]' : 'text-[#F97316]'}`}>
              {status}
            </p>
          </div>
          <div className="p-4 bg-[#F1F5F9] rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Last Updated</p>
            <p className="text-lg font-medium text-gray-900">{new Date(overview.timestamp).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;