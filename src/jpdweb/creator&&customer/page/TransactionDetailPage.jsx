
import React, { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle, Clock, ArrowRight, CreditCard, Shield } from 'lucide-react';

export default function TransactionDetailPage() {
  const [orderInfo, setOrderInfo] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    // Lấy thông tin từ URL parameters
    const params = new URLSearchParams(window.location.search);
    const info = {
      orderId: params.get('orderId'),
      approvalUrl: params.get('approvalUrl'),
      courseTitle: params.get('courseTitle'),
      amount: params.get('amount')
    };
    setOrderInfo(info);

    // Animation cho mũi tên
    setTimeout(() => setShowArrow(true), 500);

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!orderInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-center">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Giao dịch đã được tạo!</h1>
          <p className="text-purple-100">Vui lòng hoàn tất thanh toán qua PayPal</p>
        </div>

        {/* Transaction Details */}
        <div className="p-8">
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
              Thông tin giao dịch
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Mã giao dịch:</span>
                <span className="font-mono text-sm font-semibold text-gray-800">{orderInfo.orderId}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Khóa học:</span>
                <span className="font-semibold text-gray-800 text-right max-w-xs">{orderInfo.courseTitle}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Số tiền:</span>
                <span className="text-2xl font-bold text-purple-600">${orderInfo.amount}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Trạng thái:</span>
                <span className="flex items-center text-yellow-600 font-semibold">
                  <Clock className="w-4 h-4 mr-1" />
                  Chờ thanh toán
                </span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-6">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Hướng dẫn thanh toán
            </h3>
            <ol className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">1</span>
                <span>Nhấn vào nút "Chuyển đến PayPal" bên dưới</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">2</span>
                <span>Đăng nhập vào tài khoản PayPal của bạn</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">3</span>
                <span>Xác nhận thanh toán và hoàn tất giao dịch</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">4</span>
                <span>Bạn sẽ được chuyển về trang thành công sau khi hoàn tất</span>
              </li>
            </ol>
          </div>

          {/* Animated Arrow Pointer */}
          <div className={`text-center mb-4 transition-all duration-500 ${showArrow ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <p className="text-gray-600 font-semibold mb-2">👇 Click vào đây để thanh toán 👇</p>
            <ArrowRight className="w-8 h-8 mx-auto text-purple-600 animate-bounce rotate-90" />
          </div>

          {/* PayPal Button */}
          <a target="_blank" rel="noopener noreferrer"
            href={orderInfo.approvalUrl}
            className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
          >
            <div className="flex items-center justify-center">
              <ExternalLink className="w-6 h-6 mr-2" />
              Chuyển đến PayPal để thanh toán
            </div>
          </a>

          {/* Timer */}
          {countdown > 0 && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Tự động chuyển hướng sau {countdown} giây...
            </p>
          )}

          {/* Security Note */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p className="flex items-center justify-center">
              <Shield className="w-4 h-4 mr-1" />
              Giao dịch được bảo mật bởi PayPal
            </p>
          </div>

          {/* Cancel Link */}
          <div className="mt-4 text-center">
            <button 
              onClick={() => window.history.back()}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Hủy và quay lại
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}