import { useEffect, useState } from "react";
import { X, Wallet, CreditCard, TrendingUp, AlertCircle } from "lucide-react";
import { creatorApi } from "../../api/creator/creatorApi";
import { showErrorNotification } from "../../api/core/apiClient";

export default function BalancePage() {
  const MINIMUM_WITHDRAW = 30;
  
  const [balance, setBalance] = useState(0);
  const [creatorInfor, setCreatorInfor] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const fetchData = async () => {
    try {
      const result = await creatorApi.getBalance();
      if (result.success) {
        setBalance(result.data);
        console.log(result);
      } else {
        console.error('Error:', result.message, result.traceId);
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
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
        fetchData();
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Tài chính</h1>
        <p className="text-gray-600">Theo dõi và quản lý số dư tài khoản của bạn</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Balance Overview Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Tổng quan số dư</h2>
              <p className="text-gray-600">Số dư hiện tại có sẵn để rút</p>
            </div>
            <div className="p-4 bg-[#06B6D4] rounded-xl">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Số dư hiện tại</p>
              <p className="text-4xl font-bold text-gray-900">
                {formatCurrency(balance)}
              </p>
            </div>
            
            <div className="text-right">
              <div className="flex items-center text-green-600 mb-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+12.5% tháng này</span>
              </div>
              <p className="text-xs text-gray-500">So với tháng trước</p>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Thao tác nhanh</h3>
              <p className="text-gray-600">Quản lý số dư và rút tiền</p>
            </div>
          </div>

          <button 
            className="w-full bg-[#06B6D4] text-white py-4 px-6 rounded-xl font-bold hover:bg-[#0891b2] transition-all duration-300 transform hover:-translate-y-1 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
            onClick={handleWithdrawClick}
            disabled={balance < MINIMUM_WITHDRAW}
          >
            <div className="flex items-center justify-center space-x-3">
              <CreditCard className="w-5 h-5" />
              <span>
                {balance < MINIMUM_WITHDRAW ? 'Số dư không đủ để rút' : 'Rút tiền ngay'}
              </span>
            </div>
          </button>

          {balance < MINIMUM_WITHDRAW && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-orange-800">
                    Số dư tối thiểu để rút tiền là ${MINIMUM_WITHDRAW}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    Tiếp tục tạo nội dung chất lượng để tăng thu nhập của bạn
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#06B6D4]">2-3</p>
              <p className="text-xs text-gray-600 mt-1">Ngày xử lý</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#06B6D4]">${MINIMUM_WITHDRAW}</p>
              <p className="text-xs text-gray-600 mt-1">Tối thiểu rút</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#06B6D4]">24/7</p>
              <p className="text-xs text-gray-600 mt-1">Hỗ trợ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Rút tiền</h2>
                <p className="text-sm text-gray-600 mt-1">Nhập số tiền bạn muốn rút</p>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                disabled={isProcessing}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="p-6">
              {/* Payment Account */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tài khoản nhận tiền
                </label>
                <div className="px-4 py-3 bg-[#F1F5F9] rounded-xl border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-[#06B6D4]" />
                    <p className="text-sm text-gray-900 font-medium">
                      {creatorInfor?.paymentEmail || 'Chưa có thông tin thanh toán'}
                    </p>
                  </div>
                </div>
                {!creatorInfor?.paymentEmail && (
                  <p className="mt-2 text-xs text-[#F97316]">
                    Vui lòng cập nhật thông tin thanh toán trong cài đặt tài khoản
                  </p>
                )}
              </div>

              {/* Current Balance */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Số dư hiện tại
                </label>
                <div className="px-4 py-4 bg-[#06B6D4]/10 rounded-xl border border-[#06B6D4]/20">
                  <p className="text-2xl text-[#06B6D4] font-bold text-center">
                    {formatCurrency(balance)}
                  </p>
                </div>
              </div>

              {/* Withdraw Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Số tiền muốn rút
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min={MINIMUM_WITHDRAW}
                    max={balance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder={`${MINIMUM_WITHDRAW}.00`}
                    className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#06B6D4] focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                    disabled={isProcessing}
                    required
                  />
                </div>
                
                {withdrawError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {withdrawError}
                    </p>
                  </div>
                )}
                
                <div className="mt-3 flex justify-between text-xs text-gray-500">
                  <span>Tối thiểu: ${MINIMUM_WITHDRAW}</span>
                  <span>Khả dụng: {formatCurrency(balance)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isProcessing}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-[#F97316] text-white rounded-xl hover:bg-orange-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang xử lý...</span>
                    </div>
                  ) : (
                    'Xác nhận rút tiền'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}