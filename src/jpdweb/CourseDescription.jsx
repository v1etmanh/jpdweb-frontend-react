import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { customerApi } from "./api/customerApi";
import { paymentApi } from "./api/paymentApi";
import { courseApi } from "./api/courseApi";
import { 
  API_RESPONSE_TYPES, 
  showSuccessNotification,
  showWarningNotification,
  showErrorUI
} from "./api/apiClient";

// ==================== CONSTANTS ====================
const ACCESS_MODE = {
  PAID: 'PAID',
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE'
};

const PAYMENT_METHOD = {
  PAYPAL: 'PAYPAL',
  VNPAY: 'VNPAY'
};

export default function CourseDescription() {
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_METHOD.VNPAY);
  const { id } = useParams();
  const nav = useNavigate();

  const handleEnrollmentError = (result) => {
    switch (result.responseType) {
      case API_RESPONSE_TYPES.CONFLICT:
        showWarningNotification("Bạn đã đăng ký khóa học này rồi");
        break;
      
      case API_RESPONSE_TYPES.VALIDATION_ERROR:
        console.error("Validation error:", result.details);
        showWarningNotification("Dữ liệu không hợp lệ");
        break;
              
      case API_RESPONSE_TYPES.UNAUTHORIZED:
        showWarningNotification("Vui lòng đăng nhập để tiếp tục");
        nav('/login');
        break;
      
      case API_RESPONSE_TYPES.NOT_FOUND:
        showWarningNotification("Khóa học không được tìm thấy hoặc có vấn đề gì đó");
        break;
      
      default:
        console.error("Error:", result.traceId, result.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const result = await courseApi.getCourseDetail(id);
    if (result.success) {
      setCourse(result.data);
    } else {
      console.error('Error:', result.message, result.traceId);
    }
  };

  // ==================== PAYMENT MODAL COMPONENT ====================
  const PaymentMethodModal = () => {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#243864] mb-2">
              Chọn phương thức thanh toán
            </h2>
            <p className="text-gray-600">
              Chọn cách thanh toán phù hợp với bạn
            </p>
          </div>

          {/* Course Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-100">
            <p className="text-sm text-gray-600 mb-1">Khóa học</p>
            <p className="font-semibold text-[#243864] mb-2">{course?.name}</p>
            <p className="text-2xl font-bold text-[#1e88e5]">
              {course?.price.toLocaleString()}đ
            </p>
          </div>

          {/* Payment Options */}
          <div className="space-y-3 mb-6">
            {/* VNPay Option */}
            <button
              onClick={() => setSelectedPaymentMethod(PAYMENT_METHOD.VNPAY)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedPaymentMethod === PAYMENT_METHOD.VNPAY
                  ? 'border-[#1e88e5] bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPaymentMethod === PAYMENT_METHOD.VNPAY
                    ? 'border-[#1e88e5]'
                    : 'border-gray-300'
                }`}>
                  {selectedPaymentMethod === PAYMENT_METHOD.VNPAY && (
                    <div className="w-3 h-3 rounded-full bg-[#1e88e5]"></div>
                  )}
                </div>
                
                <div className="flex-1 flex items-center justify-between">
                  <div className="text-left">
                    <p className="font-semibold text-[#243864]">VNPay</p>
                    <p className="text-xs text-gray-600">Thanh toán nội địa (ATM, QR)</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold">
                    VNPAY
                  </div>
                </div>
              </div>
            </button>

            {/* PayPal Option */}
            <button
              onClick={() => setSelectedPaymentMethod(PAYMENT_METHOD.PAYPAL)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedPaymentMethod === PAYMENT_METHOD.PAYPAL
                  ? 'border-[#1e88e5] bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPaymentMethod === PAYMENT_METHOD.PAYPAL
                    ? 'border-[#1e88e5]'
                    : 'border-gray-300'
                }`}>
                  {selectedPaymentMethod === PAYMENT_METHOD.PAYPAL && (
                    <div className="w-3 h-3 rounded-full bg-[#1e88e5]"></div>
                  )}
                </div>
                
                <div className="flex-1 flex items-center justify-between">
                  <div className="text-left">
                    <p className="font-semibold text-[#243864]">PayPal</p>
                    <p className="text-xs text-gray-600">Thanh toán quốc tế</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 py-1 rounded-lg text-xs font-bold">
                    PayPal
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-300"
              disabled={isProcessing}
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#1e88e5] to-[#243864] text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                'Xác nhận thanh toán'
              )}
            </button>
          </div>

          {/* Security Note */}
          <div className="mt-4 text-center text-xs text-gray-500 flex items-center justify-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Thanh toán được bảo mật an toàn
          </div>
        </div>
      </div>
    );
  };

  // ==================== PAYMENT HANDLERS ====================
  
  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    
    try {
      let response;
      
      if (selectedPaymentMethod === PAYMENT_METHOD.VNPAY) {
        response = await paymentApi.createVNPAYOrder(course.courseId, course.price);
      } else {
        response = await paymentApi.createOrder(course.courseId, course.price);
      }

      if (response.success) {
        const { order_id, approval_url } = response.data;
        
        nav(
          `/transaction-detail?orderId=${order_id}` +
          `&approvalUrl=${encodeURIComponent(approval_url)}` +
          `&courseTitle=${encodeURIComponent(course.name)}` +
          `&amount=${course.price}` +
          `&paymentMethod=${selectedPaymentMethod}`
        );
      } else {
        handleEnrollmentError(response);
      }
    } catch (error) {
      console.error('Payment error:', error);
      showWarningNotification('Có lỗi xảy ra khi xử lý thanh toán');
    } finally {
      setIsProcessing(false);
      setShowPaymentModal(false);
    }
  };

  const handlePaidCourse = () => {
    setShowPaymentModal(true);
  };

  const handlePublicCourse = async () => {
    setIsProcessing(true);
    const response = await customerApi.enrollCourse(course.courseId, "hehe");
    
    if (response.success) {
      showSuccessNotification("Đăng ký khóa học thành công!");
    } else {
      handleEnrollmentError(response);
    }
    
    setIsProcessing(false);
  };

  const addWishlist = async () => {
    setIsProcessing(true);
    const response = await customerApi.addToWishlist(course.courseId);
    
    if (response.success) {
      showSuccessNotification("Thêm vào danh sách yêu thích thành công!");
    } else {
      handleEnrollmentError(response);
    }
    
    setIsProcessing(false);
  };

  const handlePrivateCourse = async () => {
    const joinKey = window.prompt('Vui lòng nhập mã tham gia khóa học:');
    
    if (!joinKey || joinKey.trim() === '') {
      alert('Vui lòng nhập mã tham gia hợp lệ');
      return;
    }

    setIsProcessing(true);
    const result = await customerApi.enrollCourse(course.courseId, joinKey.trim());
    
    if (result.success) {
      showSuccessNotification("Đăng ký khóa học thành công!");
    } else {
      handleEnrollmentError(result);
    }
    
    setIsProcessing(false);
  };

  const handleBuyNow = async () => {
    if (isProcessing) return;

    if (course.accessMode === ACCESS_MODE.PAID) {
      handlePaidCourse();
    } else if (course.accessMode === ACCESS_MODE.PUBLIC) {
      await handlePublicCourse();
    } else if (course.accessMode === ACCESS_MODE.PRIVATE) {
      await handlePrivateCourse();
    } else {
      alert('Loại khóa học không hợp lệ');
    }
  };

  // ==================== RENDER ====================
  
  if (!course) {
    return (
      <div className="text-center text-lg font-semibold text-red-500 mt-10">
        Không tìm thấy thông tin khóa học
      </div>
    );
  }

  const discount = course.originalPrice 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Payment Method Modal */}
      {showPaymentModal && <PaymentMethodModal />}

      {/* Header Section */}
      <div className="bg-[#1c1d1f] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="text-sm text-gray-300 mb-4">
                <span>IT & Software</span> &gt; <span>Language Learning</span> &gt;{" "}
                <span>{course.language}</span>
              </div>

              <h1 className="text-3xl font-bold mb-4">{course.name}</h1>
              <p className="text-lg text-gray-300 mb-6">{course.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                {course.averageRating >= 4.5 && (
                  <span className="bg-yellow-400 text-black px-3 py-1 rounded font-bold">
                    Bestseller
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <span className="text-orange-400">★</span>
                  <span>{course.averageRating.toFixed(1)}</span>
                  <span className="text-blue-400">
                    ({course.totalFeedbacks} ratings)
                  </span>
                </div>
                <span>{course.totalStudents.toLocaleString()} students</span>
              </div>

              <div className="flex items-center gap-4 mt-4 text-sm text-gray-300">
                <span>Created by {course.creator.fullName}</span>
                <span>Last updated {course.lastUpdate}</span>
                <span>{course.language}</span>
              </div>
            </div>

            {/* Course Preview Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-xl p-6 text-black">
                <img
                  src={course.urlImg}
                  alt={course.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl font-bold">
                    ₫{course.price.toLocaleString()}
                  </span>
                  {discount > 0 && (
                    <>
                      <span className="text-gray-500 line-through">
                        ₫{course.originalPrice?.toLocaleString()}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 text-sm rounded">
                        {discount}% off
                      </span>
                    </>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <button 
                    className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition"
                    onClick={addWishlist}
                    disabled={isProcessing}
                  >
                    Add to wishlist
                  </button>
                  <button 
                    className="w-full border border-black py-3 rounded font-bold hover:bg-gray-50 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    onClick={handleBuyNow}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Đang xử lý...' : 'Buy now'}
                  </button>
                </div>

                <div className="text-center text-sm text-gray-600 mb-4">
                  30-Day Money-Back Guarantee
                </div>

                {/* This course includes */}
                <div className="space-y-3">
                  <h3 className="font-bold">This course includes:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span>📚</span>
                      <span>{course.chapters?.length || 0} chapters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📄</span>
                      <span>{course.totalModules} modules</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📱</span>
                      <span>Access on mobile and TV</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>♾️</span>
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🏆</span>
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same... */}
      {/* Course Content sections */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* What you'll learn */}
        {course.learningObject && (
          <div className="bg-white p-8 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>{course.learningObject}</span>
            </div>
          </div>
        )}

        {/* Course Content */}
        {course.chapters && course.chapters.length > 0 && (
          <div className="bg-white p-8 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-bold mb-6">Course content</h2>
            <div className="text-sm text-gray-600 mb-4">
              {course.chapters.length} chapters • {course.totalModules} modules
            </div>

            <div className="space-y-4">
              {course.chapters.map((chapter) => (
                <div key={chapter.chapterId} className="border border-gray-200 rounded">
                  <div className="p-4 bg-gray-50 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{chapter.chapterName}</h3>
                      <div className="text-sm text-gray-600">
                        {chapter.modules?.length || 0} modules
                      </div>
                    </div>
                    <button className="text-blue-600">▼</button>
                  </div>
                  <div className="p-4 space-y-2">
                    {chapter.modules?.map((module) => (
                      <div
                        key={module.moduleId}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-700">{module.titleOfModule}</span>
                        <div className="flex gap-2">
                          {module.contentTypes?.map((type, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requirements, Target Audience, Instructor, Reviews sections remain the same... */}
      </div>
    </div>
  );
}