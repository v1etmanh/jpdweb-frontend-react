// CoursesTable.jsx
import React from 'react';
import { coursesData } from './MockData';
import { useNavigate } from 'react-router-dom';

const CoursesTable = ({  }) => {
    const nav=useNavigate()
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#243864] mb-8 text-center">
          Danh Sách Khóa Học
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#243864] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Khóa Học
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Giá Tiền
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Học Viên
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Đánh Giá
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Doanh Thu
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Ngày Tạo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {coursesData.map((course) => (
                  <tr 
                    key={course.id}
                    onClick={() =>{nav(`/creator/commercial/courseDetail/${course.id}`)}}//navigate qua trang khac vs id do
                    className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={course.image}
                          alt={course.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-[#243864]">
                            {course.name}
                          </h3>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#1e88e5] font-semibold text-lg">
                        {formatCurrency(course.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="bg-[#1e88e5] text-white px-3 py-1 rounded-full text-sm font-medium">
                          {course.studentCount.toLocaleString()}
                        </span>
                        <span className="text-gray-600 text-sm">học viên</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${i < Math.floor(course.rating) ? 'fill-current' : 'text-gray-300'}`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-gray-600 font-medium">{course.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#e53935] font-bold text-lg">
                        {course.revenue} VNĐ
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">
                        {formatDate(course.createdDate)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesTable;