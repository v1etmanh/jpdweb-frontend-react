import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addToWishlist, createTransaction, enrollCourse, getCourseDetail } from "./api/ApiConnect";

// ==================== CONSTANTS ====================
const ACCESS_MODE = {
  PAID: 'PAID',
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE'
};

export default function CourseDescription() {
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isProcessing, setIsProcessing] = useState(false);
  const { id } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await getCourseDetail(id);
      if (response.status !== 200) {
        return;
      }
      setCourse(response.data);
    } catch (e) {
      console.error("error to fetch data", e);
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

    try {
      setIsProcessing(true);
      const response = await createTransaction(course.price, id);

      if (response.status === 200) {
        const { order_id, approval_url } = response.data;
        
        nav(
          `/transaction-detail?orderId=${order_id}` +
          `&approvalUrl=${encodeURIComponent(approval_url)}` +
          `&courseTitle=${encodeURIComponent(course.name)}` +
          `&amount=${course.price}`
        );
      } else {
        alert('Có lỗi xảy ra: ' + response.data.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Không thể kết nối đến server: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublicCourse = async () => {
    try {
      setIsProcessing(true);
      const response = await enrollCourse("hehe", course.courseId);
      
      if (response.status === 200) {
        alert("Đăng ký khóa học thành công!");
        // Optional: Redirect to course learning page
        // nav(`/courses/${course.courseId}/learn`);
      } else {
        alert('Đăng ký thất bại: ' + response.data.message);
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Không thể đăng ký khóa học: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // add wishlist
   const addWishlist = async () => {
    try {
      setIsProcessing(true);
      const response = await addToWishlist( course.courseId);
      
      if (response.status === 201) {
        alert("Đăng ký khóa học thành công!");
        // Optional: Redirect to course learning page
        // nav(`/courses/${course.courseId}/learn`);
      } else {
        alert('Đăng ký thất bại: ' + response.data.message);
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Không thể đăng ký khóa học: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };
  const handlePrivateCourse = async () => {
    const joinKey = window.prompt('Vui lòng nhập mã tham gia khóa học:');
    
    if (!joinKey || joinKey.trim() === '') {
      alert('Vui lòng nhập mã tham gia hợp lệ');
      return;
    }

    try {
      setIsProcessing(true);
      const response = await enrollCourse(joinKey.trim(), course.courseId);
      
      if (response.status === 200) {
        alert('Đăng ký khóa học thành công!');
        // Optional: Redirect to course learning page
        // nav(`/courses/${course.courseId}/learn`);
      } else {
        alert('Mã tham gia không hợp lệ: ' + response.data.message);
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Mã tham gia không hợp lệ: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
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

  // Tính toán discount nếu có originalPrice
  const discount = course.originalPrice 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-[#1c1d1f] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              {/* Breadcrumb */}
              <div className="text-sm text-gray-300 mb-4">
                <span>IT & Software</span> &gt; <span>Language Learning</span> &gt;{" "}
                <span>{course.language}</span>
              </div>

              <h1 className="text-3xl font-bold mb-4">{course.name}</h1>
              <p className="text-lg text-gray-300 mb-6">{course.description}</p>

              {/* Course Stats */}
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
                  <button className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-purple-700 transition"
                  onClick={addWishlist}
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

      {/* Course Content */}
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
                  {/* Module list */}
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

        {/* Requirements */}
        {course.requirements && (
          <div className="bg-white p-8 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-bold mb-6">Requirements</h2>
            <div className="flex items-start gap-3">
              <span className="text-gray-400 mt-1">•</span>
              <span>{course.requirements}</span>
            </div>
          </div>
        )}

        {/* Target Audience */}
        {course.targetAudience && (
          <div className="bg-white p-8 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-bold mb-6">Who this course is for</h2>
            <div className="flex items-start gap-3">
              <span className="text-gray-400 mt-1">•</span>
              <span>{course.targetAudience}</span>
            </div>
          </div>
        )}

        {/* Instructor */}
        {course.creator && (
          <div className="bg-white p-8 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-bold mb-6">Instructor</h2>
            <div className="flex items-start gap-6">
              <img
                src={course.creator.imageUrl || "https://via.placeholder.com/150"}
                alt={course.creator.fullName}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-2">
                  {course.creator.fullName}
                </h3>
                <p className="text-gray-600 mb-4">{course.creator.titleSelf}</p>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <span>⭐</span>
                    <span>{course.creator.averageRating.toFixed(1)} Instructor Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>{course.creator.totalStudents.toLocaleString()} Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🎬</span>
                    <span>{course.creator.totalCourses} Courses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student Reviews */}
        {course.feedbacks && course.feedbacks.length > 0 && (
          <div className="bg-white p-8 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-bold mb-6">Student feedback</h2>
            <div className="space-y-6">
              {course.feedbacks.map((feedback) => (
                <div
                  key={feedback.feedbackId}
                  className="flex gap-4 pb-6 border-b border-gray-200 last:border-b-0"
                >
                  <img
                    src={feedback.customer.imageUrl || "https://via.placeholder.com/50"}
                    alt={feedback.customer.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{feedback.customer.fullName}</span>
                      <div className="flex text-orange-400">
                        {"★".repeat(feedback.rate)}
                        {"☆".repeat(5 - feedback.rate)}
                      </div>
                      <span className="text-sm text-gray-500">{feedback.createDate}</span>
                    </div>
                    <p className="text-gray-700">{feedback.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}