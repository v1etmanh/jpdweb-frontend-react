import { useEffect, useState } from "react";
import { 
  X, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingDown,
  FileText,
  RefreshCw
} from "lucide-react";
import { creatorApi } from "./api/creatorApi";
import { API_RESPONSE_TYPES, showErrorNotification, showWarningNotification } from './api/apiClient';
import { useNavigate } from 'react-router-dom';

export default function BalanceComponent() {
  const MINIMUM_WITHDRAW = 30;
  
  const [balance, setBalance] = useState(0);
  const [creatorInfor, setCreatorInfor] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Transaction History States
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const formatCurrency = (amount, currency = 'USD') => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(amount || 0);
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount || 0);
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

  const fetchBalance = async () => {
    try {
      const result = await creatorApi.getBalance();
      if (result.success) {
        setBalance(result.data);
        console.log('Balance:', result);
      } else {
        console.error('Error:', result.message, result.traceId);
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionHistory = async () => {
    setTransactionsLoading(true);
    setError(null);
    
    const response = await creatorApi.getTransactionHistory();
    
    if (response.success) {
      const sortedData = response.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTransactions(sortedData);
    } else {
      handleFetchTransactionHistoryError(response);
    }
    
    setTransactionsLoading(false);
  };

  const handleFetchTransactionHistoryError = (response) => {
    const message = response.message || 'Không thể tải lịch sử giao dịch';

    switch (response.responseType) {
      case API_RESPONSE_TYPES.UNAUTHORIZED:
        showWarningNotification('Bạn không có quyền xem lịch sử giao dịch , bạn cần nâng cấp tài khoản thanh toán và chứng chỉ');
        navigate('/creator/profile');
        break;

      case API_RESPONSE_TYPES.NOT_FOUND:
        setTransactions([]);
        console.log('No transactions found');
        break;

      case API_RESPONSE_TYPES.VALIDATION_ERROR:
        showWarningNotification('Tham số tìm kiếm không hợp lệ');
        if (response.details) {
          console.error('Validation errors:', response.details);
        }
        break;

      case API_RESPONSE_TYPES.SERVER_ERROR:
        showErrorNotification('Hệ thống đang bận. Vui lòng thử lại sau');
        setError('server_error');
        console.error('Fetch Transaction History Server Error:', {
          status: response.status,
          code: response.code,
          traceId: response.traceId
        });
        break;

      default:
        showErrorNotification(message);
        setError('unknown_error');
        console.error('Fetch Transaction History Error:', {
          status: response.status,
          code: response.code,
          traceId: response.traceId
        });
    }
  };

  const handleWithdrawClick = () => {
    if (balance < MINIMUM_WITHDRAW) {
      showErrorNotification(`Số dư tối thiểu để rút tiền là $${MINIMUM_WITHDRAW}`);
      return;
    }
    
    setShowWithdrawModal(true);
    setWithdrawAmount('');
    setWithdrawError('');
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setWithdrawError('');
    
    const amount = parseFloat(withdrawAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setWithdrawError('Vui lòng nhập số tiền hợp lệ');
      return;
    }
    
    if (amount > balance) {
      setWithdrawError('Số tiền rút không được vượt quá số dư');
      return;
    }
    
    if (amount < MINIMUM_WITHDRAW) {
      setWithdrawError(`Số tiền rút tối thiểu là $${MINIMUM_WITHDRAW}`);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const response = await creatorApi.createWithdraw(amount);
      
      if (response.success) {
        alert('Yêu cầu rút tiền đã được gửi thành công!');
        setShowWithdrawModal(false);
        fetchBalance();
        fetchTransactionHistory(); // Refresh transaction history
      } else {
        setWithdrawError(response?.data?.message || 'Không thể xử lý yêu cầu rút tiền');
      }
    } catch (error) {
      setWithdrawError('Đã xảy ra lỗi khi xử lý yêu cầu');
      console.error('Withdraw error:', error);
    } finally {
      setIsProcessing(false);
    }
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

  const calculateStats = () => {
    const total = transactions.reduce((sum, tx) => 
      tx.status === 'SUCCESS' ? sum + tx.amount : sum, 0
    );
    const pending = transactions.filter(tx => tx.status === 'PENDING').length;
    const success = transactions.filter(tx => tx.status === 'SUCCESS').length;
    const failed = transactions.filter(tx => tx.status === 'FAILED').length;
    
    return { total, pending, success, failed };
  };

  const filteredTransactions = transactions.filter(tx => 
    filter === 'ALL' ? true : tx.status === filter
  );

  const stats = calculateStats();

  useEffect(() => {
    fetchBalance();
    fetchTransactionHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý tài chính</h1>
          <p className="text-gray-600 mt-2">Quản lý số dư và lịch sử giao dịch của bạn</p>
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Số dư hiện tại</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(balance)}
            </p>
          </div>

          <button 
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleWithdrawClick}
            disabled={balance < MINIMUM_WITHDRAW}
          >
            {balance < MINIMUM_WITHDRAW ? 'Số dư không đủ để rút' : 'Rút tiền'}
          </button>

          {balance < MINIMUM_WITHDRAW && (
            <p className="mt-2 text-xs text-gray-500 text-center">
              Số dư tối thiểu để rút tiền là ${MINIMUM_WITHDRAW}
            </p>
          )}
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

        {/* Transaction History Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Lịch sử giao dịch</h2>
            <button
              onClick={fetchTransactionHistory}
              disabled={transactionsLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${transactionsLoading ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
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

          {/* Transactions Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {transactionsLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải lịch sử giao dịch...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
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

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Rút tiền</h2>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isProcessing}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tài khoản nhận tiền
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-900 font-medium">
                    {creatorInfor?.paymentEmail || 'Chưa có thông tin'}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số dư hiện tại
                </label>
                <div className="px-4 py-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-lg text-blue-900 font-bold">
                    {formatCurrency(balance)}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tiền muốn rút
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={MINIMUM_WITHDRAW}
                  max={balance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder={`Nhập số tiền (tối thiểu $${MINIMUM_WITHDRAW})`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isProcessing}
                  required
                />
                {withdrawError && (
                  <p className="mt-2 text-sm text-red-600">{withdrawError}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Số tiền tối thiểu để rút: ${MINIMUM_WITHDRAW} | Số dư khả dụng: {formatCurrency(balance)}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isProcessing}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Đang xử lý...' : 'Xác nhận rút tiền'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}