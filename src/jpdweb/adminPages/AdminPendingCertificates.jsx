import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  Calendar,
  Mail,
  Phone,
  ExternalLink,
  Download,
  X,
  FileText,
  User,
  Clock,
  Search,
  Filter
} from 'lucide-react';
import { adminApi } from '../api/adminCreatorApi';

const AdminPendingCertificates = () => {
  const navigate = useNavigate();

  // State
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, name

  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [approveNote, setApproveNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  // Load pending certificates
  useEffect(() => {
    loadPendingCertificates();
  }, []);

  const loadPendingCertificates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getPendingCertificates();
      setCertificates(response.data || []);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách chứng chỉ');
      console.error('Error loading pending certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  // Approve certificate
  const handleApprove = async () => {
    if (!selectedCertificate) return;

    setActionLoading(true);
    try {
      await adminApi.approveCertificate(
        selectedCertificate.creatorId,
        approveNote || 'Chứng chỉ đã được duyệt'
      );
      
      // Remove from list after successful approval
      setCertificates(prev => 
        prev.filter(cert => cert.creatorId !== selectedCertificate.creatorId)
      );
      
      setShowApproveModal(false);
      setApproveNote('');
      setSelectedCertificate(null);
    } catch (err) {
      console.error('Error approving certificate:', err);
      alert('Có lỗi xảy ra khi duyệt chứng chỉ');
    } finally {
      setActionLoading(false);
    }
  };

  // Reject certificate
  const handleReject = async () => {
    if (!selectedCertificate) return;
    
    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    setActionLoading(true);
    try {
      await adminApi.rejectCertificate(
        selectedCertificate.creatorId,
        rejectReason
      );
      
      // Remove from list after successful rejection
      setCertificates(prev => 
        prev.filter(cert => cert.creatorId !== selectedCertificate.creatorId)
      );
      
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedCertificate(null);
    } catch (err) {
      console.error('Error rejecting certificate:', err);
      alert('Có lỗi xảy ra khi từ chối chứng chỉ');
    } finally {
      setActionLoading(false);
    }
  };

  // Open approve modal
  const openApproveModal = (certificate) => {
    setSelectedCertificate(certificate);
    setApproveNote('');
    setShowApproveModal(true);
  };

  // Open reject modal
  const openRejectModal = (certificate) => {
    setSelectedCertificate(certificate);
    setRejectReason('');
    setShowRejectModal(true);
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

  const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Filter and sort certificates
  const filteredCertificates = certificates
    .filter(cert => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        cert.fullName?.toLowerCase().includes(searchLower) ||
        cert.email?.toLowerCase().includes(searchLower) ||
        cert.creatorId?.toString().includes(searchLower)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.submittedAt) - new Date(a.submittedAt);
        case 'oldest':
          return new Date(a.submittedAt) - new Date(b.submittedAt);
        case 'name':
          return (a.fullName || '').localeCompare(b.fullName || '');
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải danh sách chứng chỉ...</p>
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
            onClick={loadPendingCertificates}
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Chứng chỉ chờ duyệt
              </h1>
              <p className="text-gray-600">
                Quản lý và phê duyệt chứng chỉ của Creator
              </p>
            </div>
            <button
              onClick={loadPendingCertificates}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Loader2 className="w-4 h-4" />
              Làm mới
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Chờ duyệt</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {certificates.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm theo tên, email, ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="name">Tên A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Certificates List */}
        {filteredCertificates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Không tìm thấy kết quả' : 'Không có chứng chỉ chờ duyệt'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Thử tìm kiếm với từ khóa khác'
                : 'Tất cả chứng chỉ đã được xử lý'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCertificates.map((certificate) => (
              <div
                key={certificate.creatorId}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Creator Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={certificate.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(certificate.fullName)}&background=3b82f6&color=fff&size=80`}
                          alt={certificate.fullName}
                          className="w-16 h-16 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {certificate.fullName}
                              </h3>
                              {certificate.titleSelf && (
                                <p className="text-gray-600 mb-2">{certificate.titleSelf}</p>
                              )}
                            </div>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                              Chờ duyệt
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <User className="w-4 h-4" />
                              <span>ID: #{certificate.creatorId}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{certificate.email}</span>
                            </div>
                            {certificate.phone && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{certificate.phone}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>Gửi: {formatDateShort(certificate.submittedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => navigate(`/admin/creators/${certificate.creatorId}`)}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Xem hồ sơ
                        </button>
                        <button
                          onClick={() => openApproveModal(certificate)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Duyệt
                        </button>
                        <button
                          onClick={() => openRejectModal(certificate)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Từ chối
                        </button>
                      </div>
                    </div>

                    {/* Certificates */}
                    <div className="lg:w-80 border-l border-gray-200 lg:pl-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">
                          Chứng chỉ ({certificate.certificateUrls?.length || 0})
                        </h4>
                      </div>
                      
                      {certificate.certificateUrls && certificate.certificateUrls.length > 0 ? (
                        <div className="space-y-3">
                          {certificate.certificateUrls.map((url, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-3">
                              <div className="aspect-video bg-gray-100 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                                <img
                                  src={url}
                                  alt={`Chứng chỉ ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<div class="flex flex-col items-center gap-2 text-gray-400"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><span class="text-sm">Chứng chỉ ' + (index + 1) + '</span></div>';
                                  }}
                                />
                              </div>
                              <div className="flex gap-2">
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  Xem
                                </a>
                                <a
                                  href={url}
                                  download
                                  className="flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">Không có chứng chỉ</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approve Modal */}
      {showApproveModal && selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Duyệt chứng chỉ</h3>
              </div>
              <button
                onClick={() => setShowApproveModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                Bạn đang duyệt chứng chỉ của <strong>{selectedCertificate.fullName}</strong>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú (tùy chọn)
              </label>
              <textarea
                value={approveNote}
                onChange={(e) => setApproveNote(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Nhập ghi chú nếu cần..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Xác nhận duyệt'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-bold text-gray-900">Từ chối chứng chỉ</h3>
              </div>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                Bạn đang từ chối chứng chỉ của <strong>{selectedCertificate.fullName}</strong>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Nhập lý do từ chối (bắt buộc)..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Lý do sẽ được gửi đến Creator qua email
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Xác nhận từ chối'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPendingCertificates;