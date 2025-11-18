import React, { useState, useEffect } from 'react';
import { XCircle, AlertCircle, Home, RefreshCw, ArrowRight } from 'lucide-react';

export default function FailPayment() {
  const [showPopup, setShowPopup] = useState(true);
  const [reason, setReason] = useState('Thanh toán không thành công');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');

    // Tùy biến thông báo theo loại lỗi (nếu backend có gửi thêm)
    if (status === 'fail') {
      setReason('Giao dịch đã bị hủy hoặc gặp lỗi từ cổng thanh toán');
    }

    // Tự động ẩn popup sau 5 giây
    const timer = setTimeout(() => setShowPopup(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FEF2F2] p-6">
      {/* Popup cảnh báo */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-slideUp">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-red-600 mb-2">Thanh toán thất bại</h3>
                <p className="text-gray-600">{reason}</p>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-500 text-center">
                Vui lòng kiểm tra lại thông tin thanh toán và thử lại
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nội dung chính */}
      <div className="max-w-4xl mx-auto text-center">
        {/* Icon lớn */}
        <div className="inline-block mb-8 animate-bounce">
          <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center shadow-lg">
            <AlertCircle className="w-20 h-20 text-red-600" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-red-600 mb-6">
          Thanh toán không thành công
        </h1>

        <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-10">
          Rất tiếc, giao dịch của bạn chưa được hoàn tất. Có thể do:
        </p>

        {/* Lý do phổ biến */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 max-w-2xl mx-auto">
          <ul className="space-y-4 text-left">
            {[
              'Số dư tài khoản không đủ',
              'Thông tin thẻ/tài khoản không chính xác',
              'Giao dịch bị từ chối bởi ngân hàng',
              'Hết thời gian thanh toán',
              'Bạn đã hủy giao dịch'
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-3">•</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Nút hành động */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => window.history.back()}
            className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold py-4 px-10 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center text-lg"
          >
            <RefreshCw className="w-6 h-6 mr-3" />
            Thử thanh toán lại
            <ArrowRight className="w-5 h-5 ml-3" />
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-4 px-10 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center text-lg"
          >
            <Home className="w-6 h-6 mr-3" />
            Về trang chủ
          </button>
        </div>

        {/* Hỗ trợ */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6 max-w-2xl mx-auto">
          <p className="text-blue-800 font-medium mb-2">
            Cần hỗ trợ?
          </p>
          <p className="text-gray-700">
            Liên hệ chúng tôi qua email: <strong>support@jpdweb.com</strong> hoặc hotline <strong>1900 1234</strong>
          </p>
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideUp { animation: slideUp 0.6s ease-out; }
        .animate-bounce { animation: bounce 2s infinite; }
      `}</style>
    </div>
  );
}