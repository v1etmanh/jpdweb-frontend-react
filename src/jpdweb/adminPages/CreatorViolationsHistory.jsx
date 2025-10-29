import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Shield,
  Loader2,
  XCircle,
  CheckCircle,
  Clock,
  MessageSquare,
  BookOpen,
  Filter,
  Search
} from 'lucide-react';
import { adminApi } from '../api/adminCreatorApi';

const CreatorViolationsHistory = () => {
  const { creatorId } = useParams();
  const navigate = useNavigate();

  // State
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, NEW, REVIEWING, RESOLVED, DISMISSED
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Load violations
  useEffect(() => {
    loadViolations();
  }, [creatorId]);

  const loadViolations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getCreatorViolations(creatorId);
      console.log(response)
      setViolations(response.data || []);
    } catch (err) {
      setError(err.message || 'Không thể tải lịch sử vi phạm');
      console.error('Error loading violations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const styles = {
      NEW: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Mới' },
      REVIEWING: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Đang xử lý' },
      RESOLVED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Đã xử lý' },
      DISMISSED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Đã bỏ qua' }
    };

    const style = styles[status] || styles.NEW;

    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'NEW':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'REVIEWING':
        return <Shield className="w-5 h-5 text-blue-600" />;
      case 'RESOLVED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'DISMISSED':
        return <XCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
  };

  // Get report type label
  const getReportTypeLabel = (type) => {
    const labels = {
      SPAM: 'Spam',
      INAPPROPRIATE_CONTENT: 'Nội dung không phù hợp',
      COPYRIGHT: 'Vi phạm bản quyền',
      MISLEADING: 'Thông tin sai lệch',
      SCAM: 'Lừa đảo',
      HARASSMENT: 'Quấy rối',
      OTHER: 'Khác'
    };
    return labels[type] || type;
  };

  // Get report type color
  const getReportTypeColor = (type) => {
    const colors = {
      SPAM: 'text-orange-600',
      INAPPROPRIATE_CONTENT: 'text-red-600',
      COPYRIGHT: 'text-purple-600',
      MISLEADING: 'text-yellow-600',
      SCAM: 'text-red-700',
      HARASSMENT: 'text-pink-600',
      OTHER: 'text-gray-600'
    };
    return colors[type] || 'text-gray-600';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter violations
  const filteredViolations = violations
    .filter(v => {
      if (filterStatus !== 'ALL' && v.status !== filterStatus) return false;
      if (filterType !== 'ALL' && v.type !== filterType) return false;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          v.detail?.toLowerCase().includes(searchLower) ||
          v.adminNote?.toLowerCase().includes(searchLower) ||
          v.reportId?.toString().includes(searchLower)
        );
      }
      return true;
    });

  // Get unique report types
  const reportTypes = [...new Set(violations.map(v => v.type))];

  // Statistics
  const stats = {
    total: violations.length,
    new: violations.filter(v => v.status === 'NEW').length,
    reviewing: violations.filter(v => v.status === 'REVIEWING').length,
    resolved: violations.filter(v => v.status === 'RESOLVED').length,
    dismissed: violations.filter(v => v.status === 'DISMISSED').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải lịch sử vi phạm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadViolations}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>

          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lịch sử vi phạm</h1>
              <p className="text-gray-600">Creator ID: #{creatorId}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Tổng số</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-600 mb-1">Mới</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.new}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 mb-1">Đang xử lý</p>
              <p className="text-2xl font-bold text-blue-900">{stats.reviewing}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 mb-1">Đã xử lý</p>
              <p className="text-2xl font-bold text-green-900">{stats.resolved}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Đã bỏ qua</p>
              <p className="text-2xl font-bold text-gray-900">{stats.dismissed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="NEW">Mới</option>
                <option value="REVIEWING">Đang xử lý</option>
                <option value="RESOLVED">Đã xử lý</option>
                <option value="DISMISSED">Đã bỏ qua</option>
              </select>
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">Tất cả loại vi phạm</option>
              {reportTypes.map(type => (
                <option key={type} value={type}>{getReportTypeLabel(type)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Violations List */}
        {filteredViolations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'ALL' || filterType !== 'ALL'
                ? 'Không tìm thấy vi phạm nào'
                : 'Không có lịch sử vi phạm'
              }
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'ALL' || filterType !== 'ALL'
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Creator chưa có vi phạm nào được ghi nhận'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredViolations.map((violation) => (
              <div
                key={violation.reportId}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    {getStatusIcon(violation.status)}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          Báo cáo #{violation.reportId}
                        </h3>
                        {getStatusBadge(violation.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className={`font-medium ${getReportTypeColor(violation.type)}`}>
                          {getReportTypeLabel(violation.type)}
                        </span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(violation.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detail */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Chi tiết vi phạm:
                  </label>
                  <p className="text-gray-900 bg-gray-50 rounded-lg p-3">
                    {violation.detail || 'Không có mô tả chi tiết'}
                  </p>
                </div>

                {/* Course Info */}
                {violation.course && (
                  <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>Khóa học: <span className="font-medium">{violation.course.title || `ID: ${violation.course.courseId}`}</span></span>
                  </div>
                )}

                {/* Reporter Info */}
                {violation.customer && (
                  <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Người báo cáo: <span className="font-medium">{violation.customer.fullName || violation.customer.email}</span></span>
                  </div>
                )}

                {/* Admin Review */}
                {(violation.reviewedByAdmin || violation.adminNote) && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            Xử lý bởi Admin
                          </span>
                          {violation.reviewedAt && (
                            <span className="text-xs text-gray-500">
                              {formatDate(violation.reviewedAt)}
                            </span>
                          )}
                        </div>
                        {violation.reviewedByAdmin && (
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Admin:</strong> {violation.reviewedByAdmin}
                          </p>
                        )}
                        {violation.adminNote && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />
                              <p className="text-sm text-blue-900">{violation.adminNote}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorViolationsHistory;