"use client";

import React, { useEffect, useState } from "react";
import { Star, Filter, Plus, ChevronDown, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { creatorApi } from "../../api/creator/creatorApi";
import { showErrorNotification, showSuccessNotification } from "../../api/core/apiClient";

const CourseCard = ({ course, onEdit, onStatusChanged }) => {
  const [isChanging, setIsChanging] = useState(false);
  const [copied, setCopied] = useState(false);
const nav=useNavigate()
  const handlePublicStatusChange = async () => {
    setIsChanging(true);
    const response = await creatorApi.changeCoursesStatus(course.id);
    if(response.success){
      showSuccessNotification('Cập nhật trạng thái thành công!');
      if (onStatusChanged) {
        onStatusChanged(course.id, !course.public);
      }
    } else {
      showErrorNotification('Lỗi khi thay đổi trạng thái:');
    } 
    setIsChanging(false);
  };

  const handleCopyJoinKey = async () => {
    try {
      await navigator.clipboard.writeText(course.joinKey);
      setCopied(true);
      showSuccessNotification('Đã sao chép Join Key vào clipboard!');
      
      // Reset copy status after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      showErrorNotification('Không thể sao chép Join Key');
    }
  };

  const getCourseTypeBadge = () => {
    const types = {
      PUBLIC: { label: 'Công khai', color: 'bg-[#06B6D4] text-white' },
      PRIVATE: { label: 'Riêng tư', color: 'bg-[#F97316] text-white' },
      PAID: { label: 'Trả phí', color: 'bg-green-500 text-white' }
    };
    return types[course.type] || { label: course.type, color: 'bg-gray-500 text-white' };
  };

  const typeInfo = getCourseTypeBadge();

  return (
    <div className="bg-white rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 border border-gray-100 overflow-hidden group">
      {/* Course Header with Type Badge */}
      <div className="relative">
        <img
          src={course.image}
          alt={course.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${typeInfo.color}`}>
          {typeInfo.label}
        </div>
      </div>

      {/* Course Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 
            onClick={() => onEdit(course)}
            className="text-xl font-bold text-gray-800 cursor-pointer hover:text-[#06B6D4] transition-colors line-clamp-2 flex-1 mr-2"
          >
            {course.name}
          </h3>
        </div>

        <p className="text-sm text-gray-500 mb-4">Ngày tạo: {course.createdDate}</p>

        {/* Course Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-[#F1F5F9] rounded-lg p-2">
            <div className="font-bold text-gray-800">{course.studentCount}</div>
            <div className="text-xs text-gray-500">Học viên</div>
          </div>
          <div className="bg-[#F1F5F9] rounded-lg p-2">
            <div className="font-bold text-gray-800">{course.reviewCount}</div>
            <div className="text-xs text-gray-500">Đánh giá</div>
          </div>
          <div className="bg-[#F1F5F9] rounded-lg p-2">
            <div className="flex items-center justify-center text-yellow-400">
              <Star size={14} className="fill-current" />
              <span className="ml-1 font-bold text-gray-800">{course.rating}</span>
            </div>
            <div className="text-xs text-gray-500">Rating</div>
          </div>
        </div>

        {/* Join Key for Private Courses */}
        {course.type === 'PRIVATE' && course.joinKey && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-amber-800">Join Key:</span>
              <button
                onClick={handleCopyJoinKey}
                className="flex items-center gap-1 px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors text-xs font-medium"
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    <span>Đã copy!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <code className="text-lg font-bold text-amber-900 bg-amber-100 px-3 py-2 rounded-lg flex-1 text-center tracking-wider">
                {course.joinKey}
              </code>
            </div>
          </div>
        )}

        {/* Status Control */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              course.public ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
            <span className="text-sm font-medium text-gray-700">
              {course.public ? 'Đang công khai' : 'Đang ẩn'}
            </span>
          </div>
          
          <button
            onClick={handlePublicStatusChange}
            disabled={isChanging}
            className="px-4 py-2 bg-[#06B6D4] text-white rounded-xl hover:bg-[#0891b2] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
          >
            {isChanging ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Đang xử lý...
              </div>
            ) : (
              `Chuyển sang ${course.public ? 'ẩn' : 'công khai'}`
            )}
          </button>
        </div>
        <div className="flex items-center justify-center pt-4 border-t border-gray-100">
  <button
    onClick={() => nav(`/course/content_overview/${course.id}`)}
    disabled={isChanging}
    className="px-4 py-2 bg-[#06B6D4] text-white rounded-xl hover:bg-[#0891b2] 
               focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-opacity-50 
               disabled:opacity-50 disabled:cursor-not-allowed transition-all 
               duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
  >
    Review
  </button>
</div>

      </div>
    </div>
  );
};

const CoursesList = () => {
  const nav = useNavigate();
  const [coursesByType, setCoursesByType] = useState({});
  const [filteredCourses, setFilteredCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filterOptions = [
    { value: 'ALL', label: 'Tất cả khóa học' },
    { value: 'PUBLIC', label: 'Khóa học công khai' },
    { value: 'PRIVATE', label: 'Khóa học riêng tư' },
    { value: 'PAID', label: 'Khóa học trả phí' }
  ];

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await creatorApi.getCourses();
      if (response.success) {
        const grouped = response.data.reduce((acc, course) => {
          const type = course.type || "UNKNOWN";
          if (!acc[type]) acc[type] = [];
          acc[type].push(course);
          return acc;
        }, {});
        setCoursesByType(grouped);
        setFilteredCourses(grouped);
      } else {
        showErrorNotification("Không thể tải danh sách khóa học");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải khóa học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    applyFilter(selectedFilter);
  }, [coursesByType, selectedFilter]);

  const applyFilter = (filter) => {
    if (filter === 'ALL') {
      setFilteredCourses(coursesByType);
    } else {
      const filtered = {};
      Object.keys(coursesByType).forEach(type => {
        if (type === filter) {
          filtered[type] = coursesByType[type];
        }
      });
      setFilteredCourses(filtered);
    }
  };

  const handleStatusChanged = (courseId, newStatus) => {
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
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#06B6D4] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-soft p-8 max-w-md w-full">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800 font-semibold text-lg mb-2">Lỗi tải dữ liệu</p>
            <p className="text-red-700 text-sm mb-4">{error}</p>
            <button
              onClick={fetchCourses}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalCourses = Object.values(coursesByType).reduce((total, courses) => total + courses.length, 0);

  if (totalCourses === 0) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-6">
        <div className="text-center bg-white rounded-2xl shadow-soft p-12 max-w-md w-full">
          <div className="w-20 h-20 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus size={32} className="text-[#06B6D4]" />
          </div>
          <p className="text-gray-600 text-lg font-medium mb-4">Bạn chưa tạo khóa học nào</p>
          <button
            onClick={() => nav('/creator/create_course')}
            className="px-8 py-3 bg-[#F97316] text-white rounded-xl hover:bg-[#ea580c] font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Tạo khóa học mới
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý khóa học</h1>
            <p className="text-gray-600">Quản lý và theo dõi tất cả khóa học của bạn</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-[#06B6D4] transition-colors shadow-sm"
              >
                <Filter size={18} className="text-gray-600" />
                <span className="font-medium text-gray-700">
                  {filterOptions.find(opt => opt.value === selectedFilter)?.label}
                </span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              
              {showFilterDropdown && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-card border border-gray-200 z-10 overflow-hidden">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedFilter(option.value);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-[#F1F5F9] transition-colors ${
                        selectedFilter === option.value ? 'bg-[#06B6D4] text-white hover:bg-[#06B6D4]' : ''
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => nav('/creator/create_course')}
              className="flex items-center gap-2 px-6 py-3 bg-[#F97316] text-white rounded-xl hover:bg-[#ea580c] font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus size={20} />
              Tạo khóa học mới
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">{totalCourses}</div>
            <div className="text-gray-500 text-sm">Tổng số khóa học</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
            <div className="text-2xl font-bold text-[#06B6D4]">
              {coursesByType.PUBLIC?.length || 0}
            </div>
            <div className="text-gray-500 text-sm">Khóa học công khai</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
            <div className="text-2xl font-bold text-[#F97316]">
              {coursesByType.PRIVATE?.length || 0}
            </div>
            <div className="text-gray-500 text-sm">Khóa học riêng tư</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
            <div className="text-2xl font-bold text-green-500">
              {coursesByType.PAID?.length || 0}
            </div>
            <div className="text-gray-500 text-sm">Khóa học trả phí</div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto">
        {Object.entries(filteredCourses).map(([type, courses]) => (
          <div key={type} className="mb-12 animate-slideUp">
            <h2 className="text-2xl font-bold mb-6 text-[#06B6D4] border-b border-gray-200 pb-3">
              {type === 'PUBLIC' && 'Khóa học công khai'}
              {type === 'PRIVATE' && 'Khóa học riêng tư'}
              {type === 'PAID' && 'Khóa học trả phí'}
              {!['PUBLIC', 'PRIVATE', 'PAID'].includes(type) && `${type} Courses`}
              <span className="ml-3 text-lg font-semibold text-gray-500 bg-[#F1F5F9] px-3 py-1 rounded-full">
                {courses.length} khóa học
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
    </div>
  );
};

export default CoursesList;