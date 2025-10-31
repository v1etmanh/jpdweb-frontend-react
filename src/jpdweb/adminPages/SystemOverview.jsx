import React, { useEffect, useState } from "react";
import axios from "axios";
import { adminSystemOverviewApi } from "../api/adminSystemOverviewApi ";

const SystemOverview = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await adminSystemOverviewApi.getOverview()
        setOverview(res.data);
      } catch (err) {
        console.error("Lỗi khi tải thông tin hệ thống:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80 text-gray-500">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 mr-2"></div>
        Đang tải thông tin hệ thống...
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="text-center text-red-500">
        Không thể tải dữ liệu hệ thống.
      </div>
    );
  }

  const { system, database, http, application, status } = overview;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        🧭 Tổng quan hệ thống
      </h1>

      {/* SYSTEM METRICS */}
      <div className="bg-white p-4 rounded-2xl shadow border">
        <h2 className="text-lg font-semibold mb-3 text-blue-700">
          🖥️ System Metrics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
          <p>CPU Usage: <b>{system.cpuUsage?.toFixed(2)}%</b></p>
          <p>Memory Usage: <b>{system.memory.usagePercent?.toFixed(1)}%</b></p>
          <p>Disk Usage: <b>{system.disk.usagePercent?.toFixed(1)}%</b></p>
          <p>RAM: {system.memory.used}/{system.memory.max} MB</p>
          <p>Active Threads: {system.activeThreads}</p>
          <p>Peak Threads: {system.peakThreads}</p>
        </div>
      </div>

      {/* DATABASE */}
      <div className="bg-white p-4 rounded-2xl shadow border">
        <h2 className="text-lg font-semibold mb-3 text-green-700">
          🗄️ Database Metrics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
          <p>Trạng thái: <b>{database.status}</b></p>
          <p>Active: {database.activeConnections}</p>
          <p>Idle: {database.idleConnections}</p>
          <p>Max: {database.maxConnections}</p>
          <p>Min: {database.minConnections}</p>
          <p>Total: {database.totalConnections}</p>
        </div>
      </div>

      {/* HTTP */}
      <div className="bg-white p-4 rounded-2xl shadow border">
        <h2 className="text-lg font-semibold mb-3 text-purple-700">
          🌐 HTTP Metrics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
          <p>Tổng request: {http.totalRequests}</p>
          <p>Request/s: {http.requestsPerSecond?.toFixed(2)}</p>
          <p>Avg response: {http.avgResponseTime?.toFixed(2)} ms</p>
          <p>Error rate: {http.errorRate?.toFixed(2)}%</p>
        </div>
      </div>

      {/* APPLICATION INFO */}
      <div className="bg-white p-4 rounded-2xl shadow border">
        <h2 className="text-lg font-semibold mb-3 text-yellow-700">
          ⚙️ Application Info
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
          <p>Tên: {application.name}</p>
          <p>Phiên bản: {application.version}</p>
          <p>Build Time: {application.buildTime}</p>
          <p>Uptime: {application.uptime} giây</p>
          <p>Trạng thái: <b>{status}</b></p>
          <p>⏱️ {new Date(overview.timestamp).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
