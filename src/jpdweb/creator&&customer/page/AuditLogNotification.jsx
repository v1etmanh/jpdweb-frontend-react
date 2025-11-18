import React, { useState, useEffect } from 'react';
import { Bell, X, AlertCircle, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { creatorApi } from 'jpdweb/api/creator/creatorApi';

const AuditLogNotification = () => {
  const [logs, setLogs] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Gọi API của bạn
  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await creatorApi.getCreatorAuditLogs();
      
      if (response.success) {
        setLogs(response.data);
        setUnreadCount(response.data.length);
      } else {
        console.error('Lỗi khi tải audit logs:', response.error);
        // Hiển thị thông báo lỗi cho user nếu cần
      }
    } catch (error) {
      console.error('Không thể tải audit logs:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'APPROVE_CERT':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'REJECT_CERT':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'BAN_CREATOR':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'WARN_CREATOR':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'UNBAN_CREATOR':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActionText = (actionType) => {
    const actions = {
      'APPROVE_CERT': 'Chứng chỉ được phê duyệt',
      'REJECT_CERT': 'Chứng chỉ bị từ chối',
      'BAN_CREATOR': 'Tài khoản bị cấm',
      'WARN_CREATOR': 'Cảnh báo vi phạm',
      'UNBAN_CREATOR': 'Tài khoản được mở khóa'
    };
    return actions[actionType] || 'Thông báo';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  };

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      setUnreadCount(0);
    }
  };

  const handleLogClick = (log) => {
    setSelectedLog(log);
  };

  const closeModal = () => {
    setSelectedLog(null);
  };

  return (
    <div className="relative">
      {/* Nút chuông thông báo */}
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown thông báo */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-lg">Thông báo</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Đang tải...
              </div>
            ) : logs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Không có thông báo nào
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.auditLogId}
                  onClick={() => handleLogClick(log)}
                  className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActionIcon(log.actionType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">
                        {getActionText(log.actionType)}
                      </p>
                      <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                        {log.reason || 'Không có lý do cụ thể'}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {formatTime(log.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal chi tiết (hiện to lên khi click) */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Chi tiết thông báo
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gray-100 rounded-full">
                  {getActionIcon(selectedLog.actionType)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {getActionText(selectedLog.actionType)}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(selectedLog.timestamp).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Người thực hiện
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {selectedLog.adminEmail}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Lý do
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                    {selectedLog.reason || 'Không có lý do cụ thể'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    ID thông báo
                  </label>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                    #{selectedLog.auditLogId}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay để đóng dropdown khi click bên ngoài */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default AuditLogNotification;