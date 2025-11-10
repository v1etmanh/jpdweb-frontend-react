import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminCourseApi } from "../api/admin/adminCourseApi";
// import {
//   showSuccessNotification,
//   showErrorNotification,
// } from "../api/core/";
import {
  FaStar,
  FaUsers,
  FaBook,
  FaChalkboardTeacher,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaLock,
  FaLockOpen,
  FaBan,
  FaArrowLeft,
} from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { showErrorNotification, showSuccessNotification } from "../api/core/apiClient";

const REPORT_STATUS = {
  NEW: { label: "Mới", color: "blue" },
  REVIEWING: { label: "Đang xem xét", color: "yellow" },
  RESOLVED: { label: "Đã giải quyết", color: "green" },
  DISMISSED: { label: "Đã bỏ qua", color: "gray" },
};

const REPORT_TYPE = {
  INAPPROPRIATE_CONTENT: "Nội dung không phù hợp",
  COPYRIGHT: "Vi phạm bản quyền",
  MISLEADING: "Thông tin sai lệch",
  SPAM: "Spam",
  OTHER: "Khác",
};

export default function AdminCourseDetailPage() {
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedChapters, setExpandedChapters] = useState({});
  const [expandedReports, setExpandedReports] = useState({});
  const { courseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourseDetail();
  }, [courseId]);

  const fetchCourseDetail = async () => {
    try {
      setIsLoading(true);
      const response = await adminCourseApi.getCourseById(courseId);
      console.log(response)
      if (response.success) {
        setCourse(response.data.data);
      } else {
        showErrorNotification("Không thể tải chi tiết khóa học");
      }
    } catch (error) {
      showErrorNotification("Lỗi kết nối");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanCourse = async () => {
    if (!window.confirm("Bạn có chắc muốn khóa khóa học này?")) return;

    try {
      const response = await adminCourseApi.banCourse(courseId);
      if (response.success) {
        showSuccessNotification("Đã khóa khóa học thành công");
        fetchCourseDetail();
      } else {
        showErrorNotification("Không thể khóa khóa học");
      }
    } catch (error) {
      showErrorNotification("Lỗi khi khóa khóa học");
    }
  };

  const handleUnbanCourse = async () => {
    if (!window.confirm("Bạn có chắc muốn mở khóa khóa học này?")) return;

    try {
      const response = await adminCourseApi.unbanCourse(courseId);
      if (response.success) {
        showSuccessNotification("Đã mở khóa khóa học thành công");
        fetchCourseDetail();
      } else {
        showErrorNotification("Không thể mở khóa khóa học");
      }
    } catch (error) {
      showErrorNotification("Lỗi khi mở khóa khóa học");
    }
  };

  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const toggleReport = (reportId) => {
    setExpandedReports((prev) => ({
      ...prev,
      [reportId]: !prev[reportId],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600">Không tìm thấy khóa học</p>
          <button
            onClick={() => navigate("/admin/courses")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/admin/courses")}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft /> Quay lại
          </button>

          <div className="flex items-center gap-3">
            {course.isBan ? (
              <>
                <span className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium flex items-center gap-2">
                  <FaBan /> Đã khóa
                </span>
                <button
                  onClick={handleUnbanCourse}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FaLockOpen /> Mở khóa
                </button>
              </>
            ) : (
              <>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium flex items-center gap-2">
                  <FaCheckCircle /> Hoạt động
                </span>
                <button
                  onClick={handleBanCourse}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <FaLock /> Khóa khóa học
                </button>
              </>
            )}
          </div>
        </div>

        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={course.urlImg}
              alt={course.name}
              className="w-full md:w-64 h-40 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {course.name}
              </h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Giá:</span>
                  <p className="font-semibold text-green-600">
                    {course.price === 0 ? "Miễn phí" : `${course.price} VNĐ`}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Học viên:</span>
                  <p className="font-semibold">{course.totalStudents}</p>
                </div>
                <div>
                  <span className="text-gray-500">Đánh giá:</span>
                  <p className="font-semibold flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    {course.averageRating} ({course.totalFeedbacks})
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Cập nhật:</span>
                  <p className="font-semibold">{course.lastUpdate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b overflow-x-auto">
            {[
              { id: "overview", label: "Tổng quan" },
              { id: "curriculum", label: "Nội dung khóa học" },
              { id: "instructor", label: "Giảng viên" },
              { id: "reports", label: `Báo cáo (${course.reports?.length || 0})` },
              { id: "reviews", label: "Đánh giá" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {course.learningObject && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Mục tiêu học tập</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-700">{course.learningObject}</p>
                    </div>
                  </div>
                )}

                {course.requirements && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Yêu cầu</h3>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-gray-700">{course.requirements}</p>
                    </div>
                  </div>
                )}

                {course.targetAudience && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Đối tượng phù hợp</h3>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-gray-700">{course.targetAudience}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-3">Thông tin chi tiết</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border p-4 rounded-lg">
                      <span className="text-gray-500 text-sm">Ngôn ngữ khóa học</span>
                      <p className="font-semibold">{course.language}</p>
                    </div>
                    <div className="border p-4 rounded-lg">
                      <span className="text-gray-500 text-sm">Ngôn ngữ giảng dạy</span>
                      <p className="font-semibold">{course.teachingLanguage}</p>
                    </div>
                    <div className="border p-4 rounded-lg">
                      <span className="text-gray-500 text-sm">Chế độ truy cập</span>
                      <p className="font-semibold">{course.accessMode}</p>
                    </div>
                    <div className="border p-4 rounded-lg">
                      <span className="text-gray-500 text-sm">Trạng thái công khai</span>
                      <p className="font-semibold">
                        {course.isPublic ? "Công khai" : "Riêng tư"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Curriculum Tab */}
            {activeTab === "curriculum" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Nội dung khóa học</h3>
                  <span className="text-sm text-gray-600">
                    {course.chapters?.length || 0} chương • {course.totalModules} bài học
                  </span>
                </div>

                {course.chapters?.map((chapter, index) => (
                  <div key={chapter.chapterId} className="border rounded-lg">
                    <div
                      className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleChapter(chapter.chapterId)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-blue-600">{index + 1}</span>
                        <div>
                          <h4 className="font-semibold">{chapter.chapterName}</h4>
                          <p className="text-sm text-gray-600">
                            {chapter.modules?.length || 0} bài học
                          </p>
                        </div>
                      </div>
                      <MdKeyboardArrowDown
                        className={`transform transition-transform ${
                          expandedChapters[chapter.chapterId] ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {expandedChapters[chapter.chapterId] && (
                      <div className="p-4 space-y-2">
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
                                  className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded"
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

            {/* Instructor Tab */}
            {activeTab === "instructor" && course.creator && (
              <div>
                <div className="flex items-start gap-6">
                  <img
                    src={course.creator.imageUrl || "/default-avatar.png"}
                    alt={course.creator.fullName}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{course.creator.fullName}</h3>
                    <p className="text-blue-600 font-medium mb-4">
                      {course.creator.titleSelf}
                    </p>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <div className="text-2xl font-bold">{course.creator.averageRating.toFixed(1)}</div>
                        <div className="text-sm text-gray-600">Đánh giá</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {course.creator.totalStudents.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Học viên</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{course.creator.totalCourses}</div>
                        <div className="text-sm text-gray-600">Khóa học</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === "reports" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Danh sách báo cáo</h3>
                  {course.reports && course.reports.length > 0 && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      {course.reports.length} báo cáo
                    </span>
                  )}
                </div>

                {!course.reports || course.reports.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FaCheckCircle className="mx-auto text-4xl mb-2 text-green-500" />
                    <p>Không có báo cáo nào</p>
                  </div>
                ) : (
                  course.reports.map((report) => (
                    <div key={report.reportId} className="border rounded-lg">
                      <div
                        className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                        onClick={() => toggleReport(report.reportId)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <FaExclamationTriangle className="text-red-500 text-xl" />
                          <div>
                            <h4 className="font-semibold">
                              {REPORT_TYPE[report.type] || report.type}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Người báo cáo: {report.customer?.fullName || "N/A"} • {" "}
                              {new Date(report.createdAt).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              report.status === "NEW"
                                ? "bg-blue-100 text-blue-800"
                                : report.status === "REVIEWING"
                                ? "bg-yellow-100 text-yellow-800"
                                : report.status === "RESOLVED"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {REPORT_STATUS[report.status]?.label || report.status}
                          </span>
                          <MdKeyboardArrowDown
                            className={`transform transition-transform ${
                              expandedReports[report.reportId] ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>

                      {expandedReports[report.reportId] && (
                        <div className="p-4 bg-white space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-700">Chi tiết:</span>
                            <p className="text-gray-600 mt-1">{report.detail}</p>
                          </div>

                          {report.reviewedByAdmin && (
                            <>
                              <div>
                                <span className="text-sm font-medium text-gray-700">
                                  Người xem xét:
                                </span>
                                <p className="text-gray-600">{report.reviewedByAdmin}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-700">
                                  Thời gian xem xét:
                                </span>
                                <p className="text-gray-600">
                                  {new Date(report.reviewedAt).toLocaleString("vi-VN")}
                                </p>
                              </div>
                            </>
                          )}

                          {report.adminNote && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">
                                Ghi chú của admin:
                              </span>
                              <p className="text-gray-600 mt-1">{report.adminNote}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">
                  Đánh giá ({course.feedbacks?.length || 0})
                </h3>
                
                {!course.feedbacks || course.feedbacks.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    Chưa có đánh giá nào
                  </div>
                ) : (
                  course.feedbacks.map((feedback) => (
                    <div
                      key={feedback.feedbackId}
                      className="border-b pb-4 last:border-b-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={feedback.customer.imageUrl || "/default-avatar.png"}
                            alt={feedback.customer.fullName}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium">{feedback.customer.fullName}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="text-yellow-400">
                                {"★".repeat(feedback.rate)}
                                {"☆".repeat(5 - feedback.rate)}
                              </div>
                              <span>•</span>
                              <span>{feedback.createDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 ml-13">{feedback.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}