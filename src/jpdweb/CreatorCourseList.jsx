import React from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data
const coursesData = {
  public: [
    {
      id: 1,
      name: "Public Course A",
      image: "https://via.placeholder.com/150",
      createdDate: "2024-09-20",
      studentCount: 120,
      reviewCount: 40,
      rating: 4.5,
    },
    {
      id: 2,
      name: "Public Course B",
      image: "https://via.placeholder.com/150",
      createdDate: "2024-10-01",
      studentCount: 80,
      reviewCount: 20,
      rating: 4.0,
    },
  ],
  private: [
    {
      id: 3,
      name: "Private Course A",
      image: "https://via.placeholder.com/150",
      createdDate: "2024-09-10",
      studentCount: 50,
      reviewCount: 10,
      rating: 3.8,
    },
  ],
  commercial: [
    {
      id: 4,
      name: "Commercial Course A",
      image: "https://via.placeholder.com/150",
      createdDate: "2024-09-05",
      studentCount: 300,
      reviewCount: 120,
      rating: 4.7,
    },
  ],
};

// Component hiển thị 1 course card
const CourseCard = ({ course, onEdit }) => {
  return (
    <div
      onClick={() => onEdit(course)}
      className="cursor-pointer bg-white rounded-md border border-gray-100 hover:border-[#1e88e5]/30 hover:translate-y-[-2px] transition-all duration-300 p-5 flex gap-5 items-center group"
      role="button"
      aria-label={`Edit ${course.name}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onEdit(course);
        }
      }}
    >
      <div className="relative">
        <img
          src={course.image}
          alt={course.name}
          className="w-20 h-20 rounded-md object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-md"></div>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium text-gray-800 group-hover:text-[#1e88e5] transition-colors">{course.name}</h3>
        <p className="text-sm text-gray-500">Ngày tạo: {course.createdDate}</p>
        <div className="flex gap-4 text-sm text-gray-600 mt-2">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#1e88e5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {course.studentCount} học viên
          </span>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#1e88e5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {course.reviewCount} đánh giá
          </span>
        </div>
        <div className="flex items-center mt-2">
          <div className="flex text-[#FFC107]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(course.rating)
                    ? "fill-current"
                    : "text-gray-200"
                }
              />
            ))}
          </div>
          <span className="ml-2 text-[#1e88e5] font-medium">{course.rating}</span>
        </div>
      </div>
    </div>
  );
};

// Component hiển thị danh sách 3 loại
const CoursesList = () => {
    const nav = useNavigate();

    const getCourseTypeTitle = (type) => {
      switch(type) {
        case 'public': return 'Public Courses';
        case 'private': return 'Private Courses';
        case 'commercial': return 'Commercial Courses';
        default: return `${type.charAt(0).toUpperCase() + type.slice(1)} Courses`;
      }
    };

    const getCourseTypeDescription = (type) => {
      switch(type) {
        case 'public': return 'Courses available to all users on the platform';
        case 'private': return 'Courses with restricted access to specific users';
        case 'commercial': return 'Premium courses offered through our commercial partnerships';
        default: return '';
      }
    };

  return (
    <div className="space-y-12 p-8">
      {Object.entries(coursesData).map(([type, courses]) => (
        <div key={type} className="bg-white p-6 rounded-md border border-gray-100">
          <div className="mb-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#1e88e5]/10 text-[#1e88e5] text-sm font-medium mb-2">
              {type.toUpperCase()}
            </div>
            <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {getCourseTypeTitle(type)}
            </h2>
            <p className="text-gray-600 mb-4">{getCourseTypeDescription(type)}</p>
            <div className="w-20 h-1 bg-[#1e88e5] rounded-full mb-4"></div>
          </div>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} onEdit={() => {nav("/creator/course_manage")}} />
            ))}
            
            <div 
              onClick={() => nav("/creator/create_course")}
              className="cursor-pointer bg-[#1e88e5]/5 rounded-md border border-dashed border-[#1e88e5]/40 hover:border-[#1e88e5] hover:bg-[#1e88e5]/10 transition-all duration-300 p-5 flex flex-col items-center justify-center gap-3 h-[140px]"
              role="button"
              aria-label="Create new course"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  nav("/creator/create_course");
                }
              }}
            >
              <div className="w-12 h-12 rounded-full bg-[#1e88e5]/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1e88e5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-[#1e88e5] font-medium">Create New Course</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoursesList;
