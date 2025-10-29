import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { customerApi } from "./api/customerApi";
import { paymentApi } from "./api/paymentApi";
import { courseApi } from "./api/courseApi";
import {
  API_RESPONSE_TYPES,
  showSuccessNotification,
  showWarningNotification,
} from "./api/apiClient";

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
        showWarningNotification("Dữ liệu không hợp lệ");
        break;
      case API_RESPONSE_TYPES.UNAUTHORIZED:
        showWarningNotification("Vui lòng đăng nhập để tiếp tục");
        nav("/login");
        break;
      case API_RESPONSE_TYPES.NOT_FOUND:
        showWarningNotification("Khóa học không được tìm thấy");
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
      console.error("Error:", result.message, result.traceId);
    }
  };

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

  if (!course) {
    return (
      <div className="text-center text-lg font-semibold text-red-500 mt-10">
        Không tìm thấy thông tin khóa học
      </div>
    );
  }

  const discount = course.originalPrice
    ? Math.round(
        ((course.originalPrice - course.price) / course.originalPrice) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      {/* Header Section - Redesigned Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Course Thumbnail */}
                <div className="flex-shrink-0">
                  <img
                    src={course.urlImg}
                    alt={course.name}
                    className="w-48 h-32 object-cover rounded-xl shadow-md"
                  />
                </div>

                {/* Course Basic Info */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {course.name}
                  </h1>
                  <p className="text-gray-600 mb-4 text-left">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-12 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <span>⭐</span>
                      <span className="font-semibold">
                        {course.averageRating.toFixed(1)}
                      </span>
                      <span>({course.totalFeedbacks})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>👥</span>
                      <span>
                        {course.totalStudents.toLocaleString()} học viên
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🔄</span>
                      <span>{course.lastUpdate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-lg">
              <div className="flex overflow-x-auto border-b">
                {[
                  { id: "overview", label: "📋 Tổng quan", icon: "" },
                  { id: "curriculum", label: "📖 Nội dung", icon: "" },
                  { id: "instructor", label: "👨‍🏫 Giảng viên", icon: "" },
                  { id: "reviews", label: "💬 Đánh giá", icon: "" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-semibold whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? "text-[#06B6D4] border-b-2 border-[#06B6D4]"
                        : "text-gray-600 hover:text-[#06B6D4]"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {course.learningObject && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                          🎯 Bạn sẽ học được gì
                        </h3>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-gray-700">
                            {course.learningObject}
                          </p>
                        </div>
                      </div>
                    )}

                    {course.requirements && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                          📋 Yêu cầu
                        </h3>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <p className="text-gray-700">{course.requirements}</p>
                        </div>
                      </div>
                    )}

                    {course.targetAudience && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                          👥 Đối tượng phù hợp
                        </h3>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-gray-700">
                            {course.targetAudience}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "curriculum" && course.chapters && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        Nội dung khóa học
                      </h3>
                      <div className="text-sm text-gray-600">
                        {course.chapters.length} chương • {course.totalModules}{" "}
                        bài học
                      </div>
                    </div>
                    {course.chapters.map((chapter, index) => (
                      <div
                        key={chapter.chapterId}
                        className="border border-gray-200 rounded-lg"
                      >
                        <div
                          className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                          onClick={() => toggleChapter(chapter.chapterId)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-[#06B6D4]">
                              {index + 1}
                            </span>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {chapter.chapterName}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {chapter.modules?.length || 0} bài học
                              </p>
                            </div>
                          </div>
                          <span
                            className={`transform transition-transform ${
                              expandedChapters[chapter.chapterId]
                                ? "rotate-180"
                                : ""
                            }`}
                          >
                            ▼
                          </span>
                        </div>
                        {expandedChapters[chapter.chapterId] && (
                          <div className="p-4 bg-white space-y-2">
                            {chapter.modules?.map((module, idx) => (
                              <div
                                key={module.moduleId}
                                className="flex justify-between items-center py-2 px-3 hover:bg-blue-50 rounded"
                              >
                                <span className="text-gray-700">
                                  {idx + 1}. {module.titleOfModule}
                                </span>
                                <div className="flex gap-2">
                                  {module.contentTypes?.map((type, typeIdx) => (
                                    <span
                                      key={typeIdx}
                                      className="text-xs bg-[#F97316] text-white px-2 py-1 rounded"
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
                )}

                {activeTab === "instructor" && course.creator && (
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <img
                      src={
                        course.creator.imageUrl ||
                        "https://via.placeholder.com/150"
                      }
                      alt={course.creator.fullName}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {course.creator.fullName}
                      </h3>
                      <p className="text-[#06B6D4] font-semibold mb-4">
                        {course.creator.titleSelf}
                      </p>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {course.creator.averageRating.toFixed(1)}
                          </div>
                          <div className="text-sm text-gray-600">Đánh giá</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {course.creator.totalStudents.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Học viên</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {course.creator.totalCourses}
                          </div>
                          <div className="text-sm text-gray-600">Khóa học</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && course.feedbacks && (
                  <div className="space-y-3">
                    {course.feedbacks.map((feedback) => (
                      <div
                        key={feedback.feedbackId}
                        className="border-b border-gray-200 pb-3 last:border-b-0"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                feedback.customer.imageUrl ||
                                "https://via.placeholder.com/40"
                              }
                              alt={feedback.customer.fullName}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="font-medium text-gray-900 text-sm">
                              {feedback.customer.fullName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-yellow-400 text-sm">
                              {"★".repeat(feedback.rate)}
                              {"☆".repeat(5 - feedback.rate)}
                            </div>
                            <span className="text-xs text-gray-500">
                              {feedback.createDate}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm text-left pl-10">
                          {feedback.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Right 1/3 */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Price Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center mb-4">
                  {discount > 0 && (
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-sm text-gray-500 line-through">
                        ₫{course.originalPrice?.toLocaleString()}
                      </span>
                      <span className="bg-green-500 text-white px-2 py-1 text-xs rounded-full font-bold">
                        -{discount}%
                      </span>
                    </div>
                  )}
                  <div className="text-3xl font-bold text-[#F97316] mb-4">
                    ₫{course.price.toLocaleString()}
                  </div>
                </div>

                <div className="space-y-3">
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
                    💝 Thêm vào yêu thích
                  </button>
                </div>

                <div className="mt-4 text-center text-sm text-gray-600 bg-gray-100 py-2 rounded-lg">
                  ✅ Hoàn tiền trong 30 ngày
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span>📚</span>
                    <span>{course.chapters?.length || 0} chương</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📄</span>
                    <span>{course.totalModules} bài học</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📱</span>
                    <span>Mọi thiết bị</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>♾️</span>
                    <span>Trọn đời</span>
                  </div>
                </div>
              </div>

              {/* Course Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  Thông tin khóa học
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Đánh giá</span>
                    <span className="font-semibold">
                      {course.averageRating.toFixed(1)}/5
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Học viên</span>
                    <span className="font-semibold">
                      {course.totalStudents.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Bài học</span>
                    <span className="font-semibold">{course.totalModules}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Ngôn ngữ</span>
                    <span className="font-semibold">{course.language}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
