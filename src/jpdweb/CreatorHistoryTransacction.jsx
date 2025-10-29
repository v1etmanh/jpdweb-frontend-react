import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingDown,
  FileText
} from 'lucide-react';
import { retrieveTransactionHistory } from './api/ApiConnect';
import { creatorApi } from './api/creatorApi';
import { API_RESPONSE_TYPES, showErrorNotification, showWarningNotification } from './api/apiClient';
import { useNavigate } from 'react-router-dom';

const WithdrawHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, SUCCESS, FAILED
const navigate=useNavigate()
  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const fetchTransactionHistory = async () => {
  setLoading(true);
  setError(null);
  
  const response = await creatorApi.getTransactionHistory();
  
  if (response.success) {
    // Sort by date descending (newest first)
    const sortedData = response.data.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    setTransactions(sortedData);
  } else {
    handleFetchTransactionHistoryError(response);
  }
  
  setLoading(false);
};

// ✅ Hàm xử lý lỗi riêng cho fetch transaction history
const handleFetchTransactionHistoryError = (response) => {
  const message = response.message || 'Không thể tải lịch sử giao dịch';

  switch (response.responseType) {
    case API_RESPONSE_TYPES.UNAUTHORIZED:
      // Không có quyền xem lịch sử giao dịch
      showWarningNotification('Bạn không có quyền xem lịch sử giao dịch');
      // Redirect về dashboard
      navigate('/creator/dashboard');
      break;

    case API_RESPONSE_TYPES.NOT_FOUND:
      // Chưa có giao dịch nào
      // ⚠️ Không cần notification, chỉ set empty state
      setTransactions([]);
      console.log('No transactions found');
      // UI sẽ tự hiển thị empty state:
      // "Bạn chưa có giao dịch nào"
      break;

    case API_RESPONSE_TYPES.VALIDATION_ERROR:
      // Query params không hợp lệ (nếu có filter by date range, status, etc.)
      showWarningNotification('Tham số tìm kiếm không hợp lệ');
      if (response.details) {
        console.error('Validation errors:', response.details);
      }
      break;

    case API_RESPONSE_TYPES.SERVER_ERROR:
      // Lỗi query database / tính toán số liệu
      showErrorNotification('Hệ thống đang bận. Vui lòng thử lại sau');
      setError('server_error');
      console.error('Fetch Transaction History Server Error:', {
        status: response.status,
        code: response.code,
        traceId: response.traceId
      });
      break;

    default:
      // Lỗi khác (network, timeout, etc.)
      showErrorNotification(message);
      setError('unknown_error');
      console.error('Fetch Transaction History Error:', {
        status: response.status,
        code: response.code,
        traceId: response.traceId
      });
  }
};

  const formatCurrency = (amount, currency = 'USD') => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(amount);
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        label: 'Đang xử lý'
      },
      SUCCESS: {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        label: 'Thành công'
      },
      FAILED: {
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        label: 'Thất bại'
      },
      CANCELLED: {
        icon: AlertCircle,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        label: 'Đã hủy'
      }
    };
    return configs[status] || configs.PENDING;
  };

  const StatusBadge = ({ status }) => {
    const config = getStatusConfig(status);
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full border ${config.bgColor} ${config.borderColor}`}>
        <Icon className={`w-4 h-4 mr-2 ${config.color}`} />
        <span className={`text-sm font-medium ${config.color}`}>
          {config.label}
        </span>
      </div>
    );
  };

  const filteredTransactions = transactions.filter(tx => 
    filter === 'ALL' ? true : tx.status === filter
  );

  const calculateStats = () => {
    const total = transactions.reduce((sum, tx) => 
      tx.status === 'SUCCESS' ? sum + tx.amount : sum, 0
    );
    const pending = transactions.filter(tx => tx.status === 'PENDING').length;
    const success = transactions.filter(tx => tx.status === 'SUCCESS').length;
    const failed = transactions.filter(tx => tx.status === 'FAILED').length;
    
    return { total, pending, success, failed };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải lịch sử giao dịch...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-800 text-lg font-semibold">{error}</p>
          <button
            onClick={fetchTransactionHistory}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lịch sử rút tiền</h1>
              <p className="text-gray-600 mt-2">Quản lý và theo dõi các giao dịch rút tiền của bạn</p>
            </div>
            <button
              onClick={fetchTransactionHistory}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Làm mới
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng đã rút</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(stats.total)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang xử lý</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-50">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Thành công</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.success}</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Thất bại</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.failed}</p>
              </div>
              <div className="p-3 rounded-full bg-red-50">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex border-b border-gray-200">
            {['ALL', 'PENDING', 'SUCCESS', 'FAILED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-3 font-medium transition-colors ${
                  filter === status
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {status === 'ALL' ? 'Tất cả' : getStatusConfig(status).label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-16">
              <TrendingDown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Chưa có giao dịch nào</p>
              <p className="text-gray-400 mt-2">Lịch sử rút tiền của bạn sẽ hiển thị ở đây</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Mã giao dịch</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Số tiền</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Trạng thái</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Ngày tạo</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.withdrawId} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">
                              #{transaction.withdrawId}
                            </p>
                            {transaction.payoutBatchId && (
                              <p className="text-xs text-gray-500 mt-1">
                                {transaction.payoutBatchId}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{transaction.currency}</p>
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={transaction.status} />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm">{formatDate(transaction.createdAt)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-gray-600 max-w-xs truncate">
                          {transaction.content || 'Không có ghi chú'}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        {filteredTransactions.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Hiển thị {filteredTransactions.length} giao dịch
            {filter !== 'ALL' && ` (${getStatusConfig(filter).label})`}
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawHistory;