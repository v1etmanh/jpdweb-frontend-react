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
      className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 flex gap-4 items-center border border-gray-100"
    >
      <img
        src={course.image}
        alt={course.name}
        className="w-20 h-20 rounded-lg object-cover"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-[#243864]">{course.name}</h3>
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
  );
};

// Component hiển thị danh sách 3 loại
const CoursesList = () => {
    const nav=useNavigate()
  return (
    <div className="space-y-8 p-6">
      {Object.entries(coursesData).map(([type, courses]) => (
        <div key={type}>
          <h2 className="text-xl font-bold mb-4 text-[#1e88e5] uppercase">
            {type} Courses
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} onEdit={()=>{nav("/creator/course_manage")}} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoursesList;
