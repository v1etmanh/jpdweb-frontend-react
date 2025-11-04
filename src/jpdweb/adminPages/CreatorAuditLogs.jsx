import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  ArrowLeft,
  Calendar,
  User,
  Shield,
  Loader2,
  AlertTriangle,
  Filter,
  Search,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  AlertCircle,
  Activity
} from 'lucide-react';
import { adminApi } from '../api/admin/adminCreatorApi';

const CreatorAuditLogs = () => {
  const { creatorId } = useParams();
  const navigate = useNavigate();

  // State
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Load audit logs
  useEffect(() => {
    loadAuditLogs();
  }, [creatorId]);

  const loadAuditLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getCreatorAuditLogs(creatorId);
      setLogs(response.data || []);
    } catch (err) {
      setError(err.message || 'Không thể tải nhật ký hoạt động');
      console.error('Error loading audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get action type info
  const getActionTypeInfo = (actionType) => {
    const types = {
      APPROVE_CERT: {
        label: 'Duyệt chứng chỉ',
        icon: CheckCircle,
        color: 'text-[#06B6D4]',
        bg: 'bg-[#06B6D4]/10',
        borderColor: 'border-[#06B6D4]/20'
      },
      REJECT_CERT: {
        label: 'Từ chối chứng chỉ',
        icon: XCircle,
        color: 'text-[#F97316]',
        bg: 'bg-[#F97316]/10',
        borderColor: 'border-[#F97316]/20'
      },
      BAN_CREATOR: {
        label: 'Cấm Creator',
        icon: Ban,
        color: 'text-[#F97316]',
        bg: 'bg-[#F97316]/10',
        borderColor: 'border-[#F97316]/20'
      },
      WARN_CREATOR: {
        label: 'Cảnh cáo Creator',
        icon: AlertTriangle,
        color: 'text-[#F97316]',
        bg: 'bg-[#F97316]/10',
        borderColor: 'border-[#F97316]/20'
      },
      UNBAN_CREATOR: {
        label: 'Gỡ cấm Creator',
        icon: CheckCircle,
        color: 'text-[#06B6D4]',
        bg: 'bg-[#06B6D4]/10',
        borderColor: 'border-[#06B6D4]/20'
      },
      CREATE_COURSE: {
        label: 'Tạo khóa học',
        icon: Activity,
        color: 'text-[#06B6D4]',
        bg: 'bg-[#06B6D4]/10',
        borderColor: 'border-[#06B6D4]/20'
      },
      UPDATE_COURSE: {
        label: 'Cập nhật khóa học',
        icon: Activity,
        color: 'text-[#06B6D4]',
        bg: 'bg-[#06B6D4]/10',
        borderColor: 'border-[#06B6D4]/20'
      },
      DELETE_COURSE: {
        label: 'Xóa khóa học',
        icon: XCircle,
        color: 'text-[#F97316]',
        bg: 'bg-[#F97316]/10',
        borderColor: 'border-[#F97316]/20'
      }
    };

    return types[actionType] || {
      label: actionType,
      icon: Activity,
      color: 'text-gray-600',
      bg: 'bg-[#F1F5F9]',
      borderColor: 'border-[#F1F5F9]'
    };
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    // Filter by action type
    if (filterAction !== 'ALL' && log.actionType !== filterAction) return false;

    // Filter by date range
    if (dateFrom) {
      const logDate = new Date(log.timestamp);
      const fromDate = new Date(dateFrom);
      if (logDate < fromDate) return false;
    }
    if (dateTo) {
      const logDate = new Date(log.timestamp);
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      if (logDate > toDate) return false;
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        log.adminEmail?.toLowerCase().includes(searchLower) ||
        log.reason?.toLowerCase().includes(searchLower) ||
        log.actionType?.toLowerCase().includes(searchLower) ||
        log.auditLogId?.toString().includes(searchLower)
      );
    }

    return true;
  });

  // Get unique action types
  const actionTypes = [...new Set(logs.map(log => log.actionType))];

  // Statistics
  const stats = {
    total: logs.length,
    today: logs.filter(log => {
      const logDate = new Date(log.timestamp);
      const today = new Date();
      return logDate.toDateString() === today.toDateString();
    }).length,
    thisWeek: logs.filter(log => {
      const logDate = new Date(log.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return logDate >= weekAgo;
    }).length,
    thisMonth: logs.filter(log => {
      const logDate = new Date(log.timestamp);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return logDate >= monthAgo;
    }).length
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Hành động', 'Admin', 'Lý do', 'Thời gian'];
    const rows = filteredLogs.map(log => [
      log.auditLogId,
      getActionTypeInfo(log.actionType).label,
      log.adminEmail,
      log.reason || '',
      formatDate(log.timestamp)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `audit_logs_creator_${creatorId}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#06B6D4] mx-auto mb-4" />
          <p className="text-gray-600">Đang tải nhật ký hoạt động...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-[#F97316] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadAuditLogs}
            className="px-4 py-2 bg-[#06B6D4] text-white rounded-lg hover:bg-[#06B6D4]/90"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      {/* Header */}
      <div className="bg-[#F1F5F9] border-b border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#06B6D4] mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-[#F97316]" />
              <div>
                <h1 className="text-3xl font-bold text-[#06B6D4]">Nhật ký hoạt động</h1>
                <p className="text-gray-600">Creator ID: #{creatorId}</p>
              </div>
            </div>

            <button
              onClick={exportToCSV}
              disabled={filteredLogs.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-[#06B6D4] text-white rounded-lg hover:bg-[#06B6D4]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Xuất CSV
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#F1F5F9] rounded-lg p-4 border border-[#F1F5F9]">
              <p className="text-sm text-gray-600 mb-1">Tổng số</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-[#06B6D4]/10 rounded-lg p-4">
              <p className="text-sm text-[#06B6D4] mb-1">Hôm nay</p>
              <p className="text-2xl font-bold text-[#06B6D4]">{stats.today}</p>
            </div>
            <div className="bg-[#06B6D4]/20 rounded-lg p-4">
              <p className="text-sm text-[#06B6D4] mb-1">7 ngày qua</p>
              <p className="text-2xl font-bold text-[#06B6D4]">{stats.thisWeek}</p>
            </div>
            <div className="bg-[#F97316]/10 rounded-lg p-4">
              <p className="text-sm text-[#F97316] mb-1">30 ngày qua</p>
              <p className="text-2xl font-bold text-[#F97316]">{stats.thisMonth}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-[#F1F5F9] rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#F97316]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full pl-10 pr-4 py-2 border border-[#F1F5F9] rounded-lg focus:ring-2 focus:ring-[#06B6D4] focus:border-transparent"
              />
            </div>

            {/* Action Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#F97316]" />
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="flex-1 px-4 py-2 border border-[#F1F5F9] rounded-lg focus:ring-2 focus:ring-[#06B6D4] focus:border-transparent"
              >
                <option value="ALL">Tất cả hành động</option>
                {actionTypes.map(type => (
                  <option key={type} value={type}>
                    {getActionTypeInfo(type).label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#F97316]" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="flex-1 px-4 py-2 border border-[#F1F5F9] rounded-lg focus:ring-2 focus:ring-[#06B6D4] focus:border-transparent"
                placeholder="Từ ngày"
              />
            </div>

            {/* Date To */}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#F97316]" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="flex-1 px-4 py-2 border border-[#F1F5F9] rounded-lg focus:ring-2 focus:ring-[#06B6D4] focus:border-transparent"
                placeholder="Đến ngày"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || filterAction !== 'ALL' || dateFrom || dateTo) && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Hiển thị {filteredLogs.length} / {logs.length} bản ghi
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterAction('ALL');
                  setDateFrom('');
                  setDateTo('');
                }}
                className="text-sm text-[#06B6D4] hover:text-[#06B6D4]/80"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* Audit Logs Table */}
        {filteredLogs.length === 0 ? (
          <div className="bg-[#F1F5F9] rounded-lg shadow-sm p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#06B6D4] mb-2">
              {searchTerm || filterAction !== 'ALL' || dateFrom || dateTo
                ? 'Không tìm thấy bản ghi nào'
                : 'Chưa có nhật ký hoạt động'
              }
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterAction !== 'ALL' || dateFrom || dateTo
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Chưa có hoạt động nào được ghi nhận'
              }
            </p>
          </div>
        ) : (
          <div className="bg-[#F1F5F9] rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F1F5F9] border-b border-[#F1F5F9]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lý do / Ghi chú
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#F1F5F9] divide-y divide-[#F1F5F9]">
                  {filteredLogs.map((log) => {
                    const actionInfo = getActionTypeInfo(log.actionType);
                    const ActionIcon = actionInfo.icon;

                    return (
                      <tr key={log.auditLogId} className="hover:bg-[#F1F5F9]/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            #{log.auditLogId}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${actionInfo.bg} border ${actionInfo.borderColor}`}>
                            <ActionIcon className={`w-4 h-4 ${actionInfo.color}`} />
                            <span className={`text-sm font-medium ${actionInfo.color}`}>
                              {actionInfo.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-[#F97316]" />
                            <span className="text-sm text-gray-900">
                              {log.adminEmail}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 max-w-md">
                            {log.reason || <span className="text-gray-400 italic">Không có ghi chú</span>}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#F97316]" />
                            <span className="text-sm text-gray-600">
                              {formatDateShort(log.timestamp)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorAuditLogs;