import React, { useState, useEffect } from 'react';
import { CheckCircle, X, Download, ArrowRight, Book, Clock, Award } from 'lucide-react';

export default function SuccessPayment() {
  const [showPopup, setShowPopup] = useState(true);
  const [orderInfo, setOrderInfo] = useState({
    status: 'success',
    order: '',
    amount: '',
    hasOrderDetails: false, // true nếu là VNPay (có đầy đủ thông tin)
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const order = params.get('order') || params.get('token'); // PayPal có thể dùng token
    const amount = params.get('amount');

    if (status !== 'success') {
      setOrderInfo({ status: 'fail', order: '', amount: '', hasOrderDetails: false });
      return;
    }

    // Nếu có order + amount → chắc chắn là VNPay
    if (order && amount && amount !== '0') {
      setOrderInfo({
        status: 'success',
        order,
        amount,
        hasOrderDetails: true,
      });
    } else {
      // Chỉ có status=success → là PayPal
      setOrderInfo({
        status: 'success',
        order: '',
        amount: '',
        hasOrderDetails: false,
      });
    }

    // Tự động ẩn popup sau 4 giây
    const timer = setTimeout(() => setShowPopup(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const formatAmount = (amount) => {
  const num = parseInt(amount, 10);
  if (isNaN(num)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

  // Trường hợp thất bại
  if (orderInfo.status === 'fail') {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center p-10">
          <X className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-red-600 mb-4">Thanh toán thất bại</h1>
          <p className="text-lg text-gray-700">Vui lòng thử lại hoặc liên hệ hỗ trợ nếu cần.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-6">
      {/* Popup thông báo */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-slideUp">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="w-16 h-16 bg-[#06B6D4] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-[#06B6D4]" />
                </div>
                <h3 className="text-2xl font-bold text-[#06B6D4] mb-2">Thanh toán thành công!</h3>
                <p className="text-gray-600">
                  {orderInfo.hasOrderDetails
                    ? 'Đơn hàng của bạn đã được xác nhận'
                    : 'Bạn đã hoàn tất thanh toán qua PayPal'}
                </p>
              </div>
              <button onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {orderInfo.hasOrderDetails && (
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-semibold text-gray-900 truncate max-w-[180px]">{orderInfo.order}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-bold text-[#F97316] text-lg">{formatAmount(orderInfo.amount)}</span>
                </div>
              </div>
            )}

            {!orderInfo.hasOrderDetails && (
              <div className="border-t border-gray-100 pt-4 text-center">
                <p className="text-sm text-gray-500">Thông tin chi tiết đã được gửi về email của bạn</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nội dung chính */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-block mb-6">
            <div className="w-24 h-24 bg-[#06B6D4] rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#06B6D4] mb-4">
            Chào mừng bạn đến với khóa học!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Cảm ơn bạn đã tin tưởng và đăng ký khóa học của chúng tôi. 
            Hành trình học tập của bạn chính thức bắt đầu từ đây!
          </p>
        </div>

        {/* Thông tin đơn hàng - Chỉ hiển thị nếu có dữ liệu (VNPay) */}
        {orderInfo.hasOrderDetails && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-slideUp">
            <h2 className="text-2xl font-bold text-[#06B6D4] mb-6">Thông tin đơn hàng</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#F1F5F9] rounded-xl p-6">
                <div className="text-gray-600 mb-2">Mã đơn hàng</div>
                <div className="font-bold text-gray-900 text-lg break-all">{orderInfo.order}</div>
              </div>
              <div className="bg-[#F1F5F9] rounded-xl p-6">
                <div className="text-gray-600 mb-2">Số tiền thanh toán</div>
                <div className="font-bold text-[#F97316] text-lg">{formatAmount(orderInfo.amount)}</div>
              </div>
              <div className="bg-[#F1F5F9] rounded-xl p-6">
                <div className="text-gray-600 mb-2">Trạng thái</div>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  <span className="font-bold text-green-600 text-lg">Thành công</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nếu là PayPal → hiện thông báo nhẹ nhàng */}
        {!orderInfo.hasOrderDetails && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-8 text-center animate-slideUp">
            <CheckCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <p className="text-lg text-blue-800 font-medium">
              Thanh toán PayPal thành công!
            </p>
            <p className="text-gray-600 mt-2">
              Thông tin đơn hàng đã được gửi đến email của bạn.
            </p>
          </div>
        )}

        {/* Các phần còn lại giữ nguyên 100% */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-slideUp">
          <h2 className="text-2xl font-bold text-[#06B6D4] mb-6">Bước tiếp theo của bạn</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Giữ nguyên 3 card: Truy cập khóa học, Tài liệu, Lịch học */}
            <div className="group hover:bg-[#F1F5F9] rounded-xl p-6 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#06B6D4]">
              <div className="w-12 h-12 bg-[#06B6D4] bg-opacity-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Book className="w-6 h-6 text-[#06B6D4]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Truy cập khóa học</h3>
              <p className="text-gray-600 mb-4">Bắt đầu học ngay với bài giảng đầu tiên</p>
              <button className="text-[#F97316] font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                Bắt đầu học <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>

            <div className="group hover:bg-[#F1F5F9] rounded-xl p-6 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#06B6D4]">
              <div className="w-12 h-12 bg-[#06B6D4] bg-opacity-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Download className="w-6 h-6 text-[#06B6D4]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Tài liệu khóa học</h3>
              <p className="text-gray-600 mb-4">Tải xuống tài liệu và bài tập thực hành</p>
              <button className="text-[#F97316] font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                Tải tài liệu <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>

            <div className="group hover:bg-[#F1F5F9] rounded-xl p-6 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#06B6D4]">
              <div className="w-12 h-12 bg-[#06B6D4] bg-opacity-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-[#06B6D4]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Lịch học</h3>
              <p className="text-gray-600 mb-4">Xem lịch trình và thời gian học phù hợp</p>
              <button className="text-[#F97316] font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                Xem lịch <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Phần lợi ích & CTA giữ nguyên */}
        <div className="bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-2xl shadow-lg p-8 text-white mb-8 animate-slideUp">
          <div className="flex items-start mb-6">
            <Award className="w-8 h-8 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Những gì bạn sẽ nhận được</h2>
              <p className="text-white text-opacity-90">Khóa học được thiết kế để giúp bạn đạt được mục tiêu học tập</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {['Truy cập trọn đời', 'Chứng chỉ hoàn thành', 'Hỗ trợ từ giảng viên', 'Cộng đồng học tập'].map((item, i) => (
              <div key={i} className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold mb-1">{item}</div>
                  <div className="text-sm text-white text-opacity-80">
                    {i === 0 && 'Học mọi lúc mọi nơi không giới hạn thời gian'}
                    {i === 1 && 'Nhận chứng chỉ khi hoàn thành khóa học'}
                    {i === 2 && 'Đặt câu hỏi và nhận phản hồi trực tiếp'}
                    {i === 3 && 'Kết nối với học viên khác cùng đam mê'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12 animate-fadeIn">
          <button className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold py-4 px-12 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center text-lg">
            Vào học ngay
            <ArrowRight className="w-6 h-6 ml-3" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideUp { animation: slideUp 0.6s ease-out; }
      `}</style>
    </div>
  );
}