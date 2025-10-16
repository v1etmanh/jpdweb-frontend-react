"use client";

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { changeCourseStatus, retriveCourseOfCreator } from "./api/ApiConnect";

const CourseCard = ({ course, onEdit }) => {
  const [isPublic, setIsPublic] = useState(course.public || false);
  const [isChanging, setIsChanging] = useState(false);

  const handlePublicStatusChange = async () => {
    setIsChanging(true);
    try {
      await changeCourseStatus(course.id);
      alert('Cập nhật trạng thái thành công!');
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại!');
      setIsPublic(course.public);
    } finally {
      setIsChanging(false);
    }
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
            Trạng thái:
          </label>
          <select
            value={isPublic}
            onChange={(e) => setIsPublic(e.target.value === 'true')}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-0"
            disabled={isChanging}
          >
            <option value="true">Public (Công khai)</option>
            <option value="false">Private (Riêng tư)</option>
          </select>
          <button
            onClick={handlePublicStatusChange}
            disabled={isChanging || isPublic === course.public}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium flex-shrink-0"
          >
            {isChanging ? 'Đang lưu...' : 'Cập nhật'}
          </button>
        </div>
      </div>
    </div>
  );
};

const CoursesList = () => {
  const nav = useNavigate();
  const [coursesByType, setCoursesByType] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await retriveCourseOfCreator();
        if (response.status === 200) {
          const grouped = response.data.reduce((acc, course) => {
            const type = course.type || "UNKNOWN"; // phòng null
            if (!acc[type]) acc[type] = [];
            acc[type].push(course);
            return acc;
          }, {});
          setCoursesByType(grouped);
          console.log(response.data)
        } else {
          alert("error to retrieve course");
        }
      } catch (error) {
        alert("error to retrieve course");
        console.error("error", error);
      }
    };
    fetchData();
  }, []);

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
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoursesList;
