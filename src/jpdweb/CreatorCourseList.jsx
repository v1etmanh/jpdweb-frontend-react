"use client";

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { changeCourseStatus, retriveCourseOfCreator } from "./api/ApiConnect";
import { creatorApi } from "./api/creatorApi";
import { showErrorNotification, showSuccessNotification } from "./api/apiClient";

const CourseCard = ({ course, onEdit, onStatusChanged }) => {
  const [isPublic, setIsPublic] = useState(course.public || false);
  const [isChanging, setIsChanging] = useState(false);

  const handlePublicStatusChange = async () => {
    setIsChanging(true);
    
   const response=   await creatorApi.changeCoursesStatus(course.id);
if(response.success){
      showSuccessNotification('Cập nhật trạng thái thành công!');
      // Notify parent component về sự thay đổi
      if (onStatusChanged) {
        onStatusChanged(course.id, isPublic);
      }
    } else {
      showErrorNotification('Lỗi khi thay đổi trạng thái:');
         } 
      setIsChanging(false);
    
  };

  return (
    <div className="space-y-3">
      {/* Course Info Card */}
      <div
        onClick={() => onEdit(course)}
        className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 flex gap-4 items-center border border-gray-100"
      >
        <img
          src={course.image}
          alt={course.name}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-[#243864] truncate">{course.name}</h3>
          <p className="text-sm text-gray-500">Ngày tạo: {course.createdDate}</p>
          <div className="flex gap-3 text-sm text-gray-600 mt-1">
            <span>{course.studentCount} học viên</span>
            <span>{course.joinKey} join key</span>
            <span>{course.reviewCount} đánh giá</span>
          </div>
          <div className="flex items-center mt-1 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.floor(course.rating)
                    ? "fill-current"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="ml-2 text-gray-600">{course.rating}</span>
          </div>
        </div>
      </div>

      {/* Public Status Control - Fixed Layout */}
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <label className="text-sm font-medium text-gray-700 flex-shrink-0 sm:w-24">
            Trạng thái: {course.public?'công khai':'ẩn'}
          </label>
         
          <button
            onClick={handlePublicStatusChange}
            disabled={isChanging }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium flex-shrink-0"
          >
            {isChanging ? 'Đang lưu...' : 'chuyển sang'} {course.public?'ẩn':'công khai'}
          </button>
        </div>
      </div>
    </div>
  );
};

const CoursesList = () => {
  const nav = useNavigate();
  const [coursesByType, setCoursesByType] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
   
      const response = await creatorApi.getCourses();
      if (response.success) {
        const grouped = response.data.reduce((acc, course) => {
          const type = course.type || "UNKNOWN";
          if (!acc[type]) acc[type] = [];
          acc[type].push(course);
          return acc;
        }, {});
        setCoursesByType(grouped);
      } else {
        showErrorNotification("Không thể tải danh sách khóa học");
      }
   
      setLoading(false);
    
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleStatusChanged = (courseId, newStatus) => {
    // Cập nhật course.public trong state
    setCoursesByType(prevState => {
      const updated = { ...prevState };
      Object.keys(updated).forEach(type => {
        updated[type] = updated[type].map(course =>
          course.id === courseId ? { ...course, public: newStatus } : course
        );
      });
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Lỗi:</p>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          <button
            onClick={fetchCourses}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (Object.keys(coursesByType).length === 0) {
    return (
      <div className="flex items-center justify-center p-6 h-64">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Bạn chưa tạo khóa học nào</p>
          <button
            onClick={() => nav('/create-course')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Tạo khóa học mới
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {Object.entries(coursesByType).map(([type, courses]) => (
        <div key={type}>
          <h2 className="text-xl font-bold mb-4 text-[#1e88e5] uppercase">
            {type} Courses
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={() => nav(`/creator/course_manage/${course.id}`)}
                onStatusChanged={handleStatusChanged}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoursesList;