import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { creatorApi } from "./api/creatorApi";
import { showErrorNotification } from "./api/apiClient";

export default function BalanceComponent() {
  const MINIMUM_WITHDRAW = 30; // ✅ Define constant
  
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
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
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
    </>
  );
}