import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
//addToWishlist,enrollCourse
//createOrder
//getCourseDetail
import { customerApi } from "./api/customerApi";
import { paymentApi } from "./api/paymentApi";
import { courseApi } from "./api/courseApi";
import {
  API_RESPONSE_TYPES,
  showSuccessNotification,
  showWarningNotification,
  showErrorUI,
} from "./api/apiClient";
// ==================== CONSTANTS ====================
const ACCESS_MODE = {
  PAID: "PAID",
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
};

export default function CourseDescription() {
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState({});
  const { id } = useParams();
  const nav = useNavigate();

  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };
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
        nav("/login");
        break;

      case API_RESPONSE_TYPES.NOT_FOUND:
        showWarningNotification(
          "Khóa học không được tìm thấy hoặc có vấn đề gì đó"
        );
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
      // Error notification đã được handle bởi wrapper
      console.error("Error:", result.message, result.traceId);
    }
  };

  // ==================== ENROLLMENT HANDLERS ====================

  const handlePaidCourse = async () => {
    const confirmed = window.confirm(
      `Bạn muốn mua khóa học "${course.name}"?\n\n` +
        `Giá: $${course.price}\n` +
        `Phương thức thanh toán: PayPal\n\n` +
        `Nhấn OK để tiếp tục thanh toán`
    );

    if (!confirmed) return;

    setIsProcessing(true);
    const response = await paymentApi.createOrder(
      course.courseId,
      course.price
    );

    if (response.success) {
      const { order_id, approval_url } = response.data;

      nav(
        `/transaction-detail?orderId=${order_id}` +
          `&approvalUrl=${encodeURIComponent(approval_url)}` +
          `&courseTitle=${encodeURIComponent(course.name)}` +
          `&amount=${course.price}`
      );
    } else {
      handleEnrollmentError(response);
    }
    setIsProcessing(false);
  };

  const handlePublicCourse = async () => {
    setIsProcessing(true);
    const response = await customerApi.enrollCourse(course.courseId, "hehe");

    if (response.success) {
      showSuccessNotification("Đăng ký khóa học thành công!");
      // Optional: Redirect to course learning page
      // nav(`/courses/${course.courseId}/learn`);
    } else {
      handleEnrollmentError(response);
    }

    setIsProcessing(false);
  };

  // add wishlist
  const addWishlist = async () => {
    setIsProcessing(true);
    const response = await customerApi.addToWishlist(course.courseId);
    // addToWishlist( course.courseId);
    if (response.success) {
      showSuccessNotification("Thêm vào danh sách yêu thích thành công!");
    } else {
      handleEnrollmentError(response);
    }
    setIsProcessing(false);
  };
  const handlePrivateCourse = async () => {
    const joinKey = window.prompt("Vui lòng nhập mã tham gia khóa học:");

    if (!joinKey || joinKey.trim() === "") {
      alert("Vui lòng nhập mã tham gia hợp lệ");
      return;
    }

    setIsProcessing(true);
    const result = await customerApi.enrollCourse(
      course.courseId,
      joinKey.trim()
    );
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
      await handlePaidCourse();
    } else if (course.accessMode === ACCESS_MODE.PUBLIC) {
      await handlePublicCourse();
    } else if (course.accessMode === ACCESS_MODE.PRIVATE) {
      await handlePrivateCourse();
    } else {
      alert("Loại khóa học không hợp lệ");
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

  // Tính toán discount nếu có originalPrice
  const discount = course.originalPrice
    ? Math.round(
        ((course.originalPrice - course.price) / course.originalPrice) * 100
      )
    : 0;

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-cyan-50 min-h-screen">
      {/* Compact Hero Section */}
      <div 
        className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden"
        style={{
          backgroundImage: `url(${course.img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-800/90 to-slate-900/95"></div>
        
        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
          {/* Breadcrumb */}
          <div className="text-xs text-gray-300 mb-3 flex items-center gap-2">
            <span className="hover:underline cursor-pointer">
              IT & Software
            </span>
            <span>/</span>
            <span className="hover:underline cursor-pointer">
              Language Learning
            </span>
            <span>/</span>
            <span>{course.language}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left: Course Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3 leading-tight">
                {course.name}
              </h1>
              <p className="text-base text-gray-200 mb-5">
                {course.description}
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                {course.averageRating >= 4.5 && (
                  <span className="bg-[#F97316] text-white px-3 py-1 rounded-full font-bold">
                    ⭐ Bestseller
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-[#F97316]">★</span>
                  <span className="font-bold">
                    {course.averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-300">
                    ({course.totalFeedbacks})
                  </span>
                </div>
                <span>👥 {course.totalStudents.toLocaleString()} học viên</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300">
                <span>👤 {course.creator.fullName}</span>
                <span>🔄 {course.lastUpdate}</span>
                <span>🌐 {course.language}</span>
              </div>
            </div>

            {/* Right: Price Card (Compact) */}
            <div className="bg-white rounded-2xl shadow-2xl p-3 w-full lg:w-72 text-gray-900">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold text-[#F97316]">
                  ₫{course.price.toLocaleString()}
                </span>
                {discount > 0 && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400 line-through">
                      ₫{course.originalPrice?.toLocaleString()}
                    </span>
                    <span className="bg-green-500 text-white px-2 py-1 text-xs rounded-full font-bold">
                      -{discount}%
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <button
                  className="w-full bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white py-3 rounded-xl font-bold hover:from-[#F97316] hover:to-[#EA580C] transition-all shadow-lg"
                  onClick={handleBuyNow}
                  disabled={isProcessing}
                >
                  {isProcessing ? "⏳ Đang xử lý..." : "🛒 Mua ngay"}
                </button>
                <button
                  className="w-full border-2 border-[#06B6D4] text-[#06B6D4] py-3 rounded-xl font-bold hover:bg-[#06B6D4] hover:text-white transition-all"
                  onClick={addWishlist}
                  disabled={isProcessing}
                >
                  💝 Yêu thích
                </button>
              </div>

              <div className="text-center text-xs text-gray-600 bg-gray-100 py-2 rounded-lg mb-3">
                ✅ Hoàn tiền trong 30 ngày
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                <div className="flex items-center gap-1">
                  <span>📚</span>
                  <span>{course.chapters?.length || 0} chương</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📄</span>
                  <span>{course.totalModules} bài</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📱</span>
                  <span>Mọi thiết bị</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>♾️</span>
                  <span>Trọn đời</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b-2 border-[#06B6D4] sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {["overview", "curriculum", "instructor", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 font-bold transition-all whitespace-nowrap text-sm ${
                  activeTab === tab
                    ? "bg-[#06B6D4] text-white border-b-4 border-[#0891B2]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab === "overview" && "📋 Tổng quan"}
                {tab === "curriculum" && "📖 Nội dung"}
                {tab === "instructor" && "👨‍🏫 Giảng viên"}
                {tab === "reviews" && "💬 Đánh giá"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* What you'll learn */}
              {course.learningObject && (
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h2 className="text-xl font-bold mb-5 text-gray-900 flex items-center gap-2">
                    <span className="text-3xl">🎯</span>
                    Bạn sẽ học được gì
                  </h2>
                  <div className="bg-blue-50 p-5 rounded-xl">
                    <div className="flex items-start gap-3">
                      <span className="text-xl text-[#06B6D4]">✓</span>
                      <p className="text-gray-700 text-base leading-relaxed">
                        {course.learningObject}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Requirements */}
              {course.requirements && (
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h2 className="text-xl font-bold mb-5 text-gray-900 flex items-center gap-2">
                    <span className="text-3xl">📋</span>
                    Yêu cầu
                  </h2>
                  <div className="bg-orange-50 p-5 rounded-xl">
                    <div className="flex items-start gap-3">
                      <span className="text-xl text-[#F97316]">•</span>
                      <p className="text-gray-700 text-base leading-relaxed">
                        {course.requirements}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Target Audience */}
              {course.targetAudience && (
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h2 className="text-xl font-bold mb-5 text-gray-900 flex items-center gap-2">
                    <span className="text-3xl">👥</span>
                    Đối tượng phù hợp
                  </h2>
                  <div className="bg-purple-50 p-5 rounded-xl">
                    <div className="flex items-start gap-3">
                      <span className="text-xl text-purple-500">•</span>
                      <p className="text-gray-700 text-base leading-relaxed">
                        {course.targetAudience}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-5 rounded-2xl shadow-lg sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Thông tin khóa học
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-xl text-sm">
                    <span className="text-gray-700">📚 Số chương</span>
                    <span className="font-bold text-gray-900">
                      {course.chapters?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-orange-50 rounded-xl text-sm">
                    <span className="text-gray-700">📄 Số bài học</span>
                    <span className="font-bold text-gray-900">
                      {course.totalModules}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-yellow-50 rounded-xl text-sm">
                    <span className="text-gray-700">⭐ Đánh giá</span>
                    <span className="font-bold text-gray-900">
                      {course.averageRating.toFixed(1)}/5
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-cyan-50 rounded-xl text-sm">
                    <span className="text-gray-700">👥 Học viên</span>
                    <span className="font-bold text-gray-900">
                      {course.totalStudents.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Curriculum Tab */}
        {activeTab === "curriculum" &&
          course.chapters &&
          course.chapters.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span>📖</span>
                  Nội dung khóa học
                </h2>
                <div className="bg-blue-100 px-3 py-1.5 rounded-full text-sm">
                  <span className="text-gray-900 font-bold">
                    {course.chapters.length} chương • {course.totalModules} bài
                    học
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {course.chapters.map((chapter, index) => (
                  <div
                    key={chapter.chapterId}
                    className="border-2 border-[#06B6D4] rounded-xl overflow-hidden"
                  >
                    <div
                      className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 flex justify-between items-center cursor-pointer hover:from-[#06B6D4] hover:to-[#0891B2] hover:text-white transition-all group"
                      onClick={() => toggleChapter(chapter.chapterId)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-white bg-[#06B6D4] w-10 h-10 rounded-full flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-white text-base">
                            {chapter.chapterName}
                          </h3>
                          <div className="text-xs text-gray-700 group-hover:text-white mt-0.5">
                            📚 {chapter.modules?.length || 0} bài học
                          </div>
                        </div>
                      </div>
                      <button
                        className={`text-gray-900 group-hover:text-white text-lg transform transition-transform duration-300 ${
                          expandedChapters[chapter.chapterId]
                            ? "rotate-180"
                            : ""
                        }`}
                      >
                        ▼
                      </button>
                    </div>

                    {expandedChapters[chapter.chapterId] && (
                      <div className="p-4 bg-white space-y-2">
                        {chapter.modules?.map((module, idx) => (
                          <div
                            key={module.moduleId}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition-all group"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-[#06B6D4] font-bold text-base">
                                {idx + 1}.
                              </span>
                              <span className="text-gray-700 group-hover:font-semibold text-sm">
                                {module.titleOfModule}
                              </span>
                            </div>
                            <div className="flex gap-1.5">
                              {module.contentTypes?.map((type, typeIdx) => (
                                <span
                                  key={typeIdx}
                                  className="text-xs bg-[#F97316] text-white px-2.5 py-0.5 rounded-full font-semibold"
                                >
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Instructor Tab */}
        {activeTab === "instructor" && course.creator && (
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <span>👨‍🏫</span>
              Giảng viên
            </h2>
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <img
                src={
                  course.creator.imageUrl || "https://via.placeholder.com/150"
                }
                alt={course.creator.fullName}
                className="w-32 h-32 rounded-full object-cover border-4 border-[#06B6D4] shadow-xl"
              />
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-1.5">
                  {course.creator.fullName}
                </h3>
                <p className="text-lg text-[#06B6D4] font-semibold mb-4">
                  {course.creator.titleSelf}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-blue-50 p-3 rounded-xl text-center">
                    <div className="text-2xl mb-1">⭐</div>
                    <div className="text-xl font-bold text-gray-900">
                      {course.creator.averageRating.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-700">Đánh giá</div>
                  </div>
                  <div className="bg-cyan-50 p-3 rounded-xl text-center">
                    <div className="text-2xl mb-1">👥</div>
                    <div className="text-xl font-bold text-gray-900">
                      {course.creator.totalStudents.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-700">Học viên</div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-xl text-center">
                    <div className="text-2xl mb-1">🎬</div>
                    <div className="text-xl font-bold text-gray-900">
                      {course.creator.totalCourses}
                    </div>
                    <div className="text-xs text-gray-700">Khóa học</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" &&
          course.feedbacks &&
          course.feedbacks.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <span>💬</span>
                Đánh giá từ học viên
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {course.feedbacks.map((feedback) => (
                  <div
                    key={feedback.feedbackId}
                    className="bg-blue-50 p-5 rounded-xl hover:shadow-lg transition-all"
                  >
                    <div className="flex gap-3 mb-3">
                      <img
                        src={
                          feedback.customer.imageUrl ||
                          "https://via.placeholder.com/50"
                        }
                        alt={feedback.customer.fullName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#06B6D4]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-gray-900">
                            {feedback.customer.fullName}
                          </span>
                          <span className="text-xs text-gray-600">
                            {feedback.createDate}
                          </span>
                        </div>
                        <div className="flex text-yellow-400 text-sm">
                          {"★".repeat(feedback.rate)}
                          {"☆".repeat(5 - feedback.rate)}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {feedback.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
