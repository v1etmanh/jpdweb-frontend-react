import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Ban, 
  CheckCircle, 
  Mail, 
  Calendar, 
  DollarSign,
  BookOpen,
  Users,
  Star,
  Shield,
  FileText,
  Activity,
  Loader2,
  X,
  Phone,
  CreditCard,
  TrendingUp,
  Award,
  ExternalLink,
  Download
} from 'lucide-react';
import { adminApi } from '../api/adminCreatorApi';

// Import API - uncomment khi sử dụng thực tế
// import { adminApi } from './path/to/your/api';

const AdminCreatorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modal states
  const [showWarnModal, setShowWarnModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showUnbanModal, setShowUnbanModal] = useState(false);
  
  // Form states
  const [warnReason, setWarnReason] = useState('');
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState('');
  const [unbanReason, setUnbanReason] = useState('Unbanned by admin');
  const [actionLoading, setActionLoading] = useState(false);

  // Load creator detail
  useEffect(() => {
    loadCreatorDetail();
  }, [id]);

  const loadCreatorDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getCreatorDetail(id);
      console.log(response)
      setCreator(response.data);
    } catch (err) {
      setError(err.message || 'Không thể tải thông tin Creator');
      console.error('Error loading creator detail:', err);
    } finally {
      setLoading(false);
    }
  };

  // Warn Creator
  const handleWarn = async () => {
    if (!warnReason.trim()) {
      alert('Vui lòng nhập lý do cảnh cáo');
      return;
    }

    setActionLoading(true);
    try {
      await adminApi.warnCreator(id, warnReason);
      setShowWarnModal(false);
      setWarnReason('');
      loadCreatorDetail();
    } catch (err) {
      console.error('Error warning creator:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Ban Creator
  const handleBan = async () => {
    if (!banReason.trim()) {
      alert('Vui lòng nhập lý do cấm');
      return;
    }

    setActionLoading(true);
    try {
      const data = {
        reason: banReason,
        durationDays: banDuration ? parseInt(banDuration) : null
      };
      await adminApi.banCreator(id, data);
      setShowBanModal(false);
      setBanReason('');
      setBanDuration('');
      loadCreatorDetail();
    } catch (err) {
      console.error('Error banning creator:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Unban Creator
  const handleUnban = async () => {
    setActionLoading(true);
    try {
      await adminApi.unbanCreator(id, unbanReason);
      setShowUnbanModal(false);
      setUnbanReason('Unbanned by admin');
      loadCreatorDetail();
    } catch (err) {
      console.error('Error unbanning creator:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800',
      BANNED: 'bg-red-100 text-red-800',
      PENDING_CERTIFICATE: 'bg-yellow-100 text-yellow-800',
      INACTIVE: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      ACTIVE: 'Hoạt động',
      BANNED: 'Bị cấm',
      PENDING_CERTIFICATE: 'Chờ chứng chỉ',
      INACTIVE: 'Không hoạt động'
    };

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${styles[status] || styles.INACTIVE}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getReportStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      RESOLVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.PENDING}`}>
        {status}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

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

  const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại danh sách</span>
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <img
                src={creator.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.fullName)}&background=3b82f6&color=fff&size=128`}
                alt={creator.fullName}
                className="w-24 h-24 rounded-full"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {creator.fullName}
                </h1>
                {creator.titleSelf && (
                  <p className="text-gray-600 mb-2">{creator.titleSelf}</p>
                )}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{creator.email}</span>
                  </div>
                  {creator.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{creator.phone}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(creator.status)}
                  {creator.isBanned && creator.bannedUntil && (
                    <span className="text-sm text-red-600">
                      Cấm đến: {formatDateShort(creator.bannedUntil)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {!creator.isBanned && (
                <>
                  <button
                    onClick={() => setShowWarnModal(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-yellow-500 text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Cảnh cáo
                  </button>
                  <button
                    onClick={() => setShowBanModal(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Ban className="w-4 h-4" />
                    Cấm
                  </button>
                </>
              )}
              {creator.isBanned && (
                <button
                  onClick={() => setShowUnbanModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Gỡ cấm
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab('certificate')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'certificate'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Chứng chỉ {creator.certificateUrls?.length > 0 && `(${creator.certificateUrls.length})`}
            </button>
            <button
              onClick={() => setActiveTab('violations')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'violations'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Vi phạm {creator.recentReports?.length > 0 && `(${creator.recentReports.length})`}
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'courses'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Khóa học
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-600">Số dư hiện tại</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(creator.balance || 0)}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className="text-sm text-gray-600">Tổng doanh thu</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(creator.totalRevenue || 0)}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-600">Khóa học</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {creator.totalCourses || 0}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-600">Học viên</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {creator.totalStudents || 0}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <span className="text-sm text-gray-600">Đánh giá TB</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {creator.avgRating?.toFixed(1) || 'N/A'}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <span className="text-sm text-gray-600">Cảnh cáo</span>
                </div>
                <p className={`text-2xl font-bold ${creator.warningCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {creator.warningCount || 0}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Award className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span className="text-sm text-gray-600">Điểm uy tín</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {creator.reputationScore || 0}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Activity className="w-6 h-6 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-600">Hoạt động cuối</span>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {formatDateShort(creator.lastActivity)}
                </p>
              </div>
            </div>

            {/* Creator Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin chi tiết</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">ID Creator</label>
                  <p className="text-gray-900 font-medium">#{creator.creatorId}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Họ tên</label>
                  <p className="text-gray-900 font-medium">{creator.fullName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Email</label>
                  <p className="text-gray-900 font-medium">{creator.email}</p>
                </div>
                {creator.phone && (
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Số điện thoại</label>
                    <p className="text-gray-900 font-medium">{creator.phone}</p>
                  </div>
                )}
                {creator.paymentEmail && (
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Email thanh toán</label>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-900 font-medium">{creator.paymentEmail}</p>
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Trạng thái</label>
                  {getStatusBadge(creator.status)}
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Ngày tạo tài khoản</label>
                  <p className="text-gray-900 font-medium">{formatDate(creator.createDate)}</p>
                </div>
                {creator.bannedUntil && (
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Ngày hết hạn cấm</label>
                    <p className="text-red-600 font-medium">{formatDate(creator.bannedUntil)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Reports */}
            {creator.recentReports && creator.recentReports.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Báo cáo gần đây</h2>
                <div className="space-y-3">
                  {creator.recentReports.slice(0, 5).map((report) => (
                    <div key={report.reportId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            #{report.reportId} - {report.reportType}
                          </span>
                        </div>
                        {getReportStatusBadge(report.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{report.detail}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Tạo: {formatDateShort(report.createdAt)}</span>
                        {report.reviewedAt && (
                          <span>Xử lý: {formatDateShort(report.reviewedAt)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {creator.recentReports.length > 5 && (
                  <button
                    onClick={() => setActiveTab('violations')}
                    className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Xem tất cả {creator.recentReports.length} báo cáo →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'certificate' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Chứng chỉ</h2>
            </div>
            
            {creator.certificateUrls && creator.certificateUrls.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {creator.certificateUrls.map((url, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      <img 
                        src={url} 
                        alt={`Chứng chỉ ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="text-gray-400 flex flex-col items-center gap-2"><FileText class="w-12 h-12"/><span>Chứng chỉ</span></div>';
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Xem
                      </a>
                      <a
                        href={url}
                        download
                        className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Creator chưa có chứng chỉ nào</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'violations' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Lịch sử vi phạm & báo cáo</h2>
            </div>
            
            {creator.recentReports && creator.recentReports.length > 0 ? (
              <div className="space-y-4">
                {creator.recentReports.map((report) => (
                  <div key={report.reportId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-semibold text-gray-900">
                            #{report.reportId}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                            {report.reportType}
                          </span>
                          {getReportStatusBadge(report.status)}
                        </div>
                        <p className="text-gray-700 mb-3">{report.detail}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Tạo: {formatDateShort(report.createdAt)}</span>
                          </div>
                          {report.reviewedAt && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              <span>Xử lý: {formatDateShort(report.reviewedAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Không có báo cáo vi phạm nào</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Khóa học của Creator</h2>
            </div>
            
            {creator.recentCourses && creator.recentCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {creator.recentCourses.map((course) => (
                  <div key={course.courseId} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-100">
                      {course.thumbnailUrl ? (
                        <img 
                          src={course.thumbnailUrl} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <BookOpen className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      {course.price && (
                        <p className="text-blue-600 font-bold mb-2">
                          {formatCurrency(course.price)}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        {course.enrollmentCount !== undefined && (
                          <span>{course.enrollmentCount} học viên</span>
                        )}
                       {course.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{course.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => navigate(`/admin/courses/${course.courseId}`)}
                        className="mt-3 w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Creator chưa có khóa học nào</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Warn Modal */}
      {showWarnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <h3 className="text-xl font-bold text-gray-900">Cảnh cáo Creator</h3>
              </div>
              <button
                onClick={() => setShowWarnModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Bạn đang cảnh cáo <span className="font-semibold">{creator.fullName}</span>
              </p>
              <p className="text-sm text-gray-500">
                Số lần cảnh cáo hiện tại: <span className="font-semibold">{creator.warningCount || 0}</span>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do cảnh cáo <span className="text-red-500">*</span>
              </label>
              <textarea
                value={warnReason}
                onChange={(e) => setWarnReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Nhập lý do cảnh cáo..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWarnModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleWarn}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Xác nhận cảnh cáo'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ban Modal */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Ban className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-bold text-gray-900">Cấm Creator</h3>
              </div>
              <button
                onClick={() => setShowBanModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Cảnh báo:</strong> Bạn đang cấm <span className="font-semibold">{creator.fullName}</span>
              </p>
              <p className="text-xs text-red-600 mt-1">
                Creator sẽ không thể đăng nhập và tất cả khóa học sẽ bị ẩn
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do cấm <span className="text-red-500">*</span>
              </label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Nhập lý do cấm..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian cấm (tùy chọn)
              </label>
              <select
                value={banDuration}
                onChange={(e) => setBanDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Vĩnh viễn</option>
                <option value="7">7 ngày</option>
                <option value="30">30 ngày</option>
                <option value="90">90 ngày</option>
                <option value="180">180 ngày</option>
                <option value="365">1 năm</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Để trống để cấm vĩnh viễn
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBanModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleBan}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Xác nhận cấm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unban Modal */}
      {showUnbanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Gỡ cấm Creator</h3>
              </div>
              <button
                onClick={() => setShowUnbanModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Bạn đang gỡ cấm cho <span className="font-semibold">{creator.fullName}</span>
              </p>
              {creator.bannedUntil && (
                <p className="text-sm text-gray-500">
                  Bị cấm đến: <span className="font-semibold">{formatDateShort(creator.bannedUntil)}</span>
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú
              </label>
              <textarea
                value={unbanReason}
                onChange={(e) => setUnbanReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Nhập lý do gỡ cấm..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUnbanModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleUnban}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Xác nhận gỡ cấm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCreatorDetail;