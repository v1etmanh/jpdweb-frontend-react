import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { creatorApi } from "../../api/creator/creatorApi";
import { showErrorNotification } from "../../api/core/apiClient";

const CoursesTable = () => {
  const nav = useNavigate();
  const [coursesData, setCourseData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [sortOption, setSortOption] = useState("id");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await creatorApi.getCommercialCourse();
      if (response.success) {
        setCourseData(response.data);
      } else {
        showErrorNotification("Lỗi khi tải dữ liệu");
      }
    } catch (error) {
      showErrorNotification("Lỗi kết nối");
    } finally {
      setIsLoading(false);
    }
  };

  const getSortedCourses = () => {
    if (!coursesData.length) return [];

    const sorted = [...coursesData];
    switch (sortOption) {
      case "id":
        return sorted.sort((a, b) => a.courseId - b.courseId);
      case "students_desc":
        return sorted.sort((a, b) => b.students - a.students);
      case "revenue_desc":
        return sorted.sort((a, b) => b.revenue - a.revenue);
      case "students_asc":
        return sorted.sort((a, b) => a.students - b.students);
      case "revenue_asc":
        return sorted.sort((a, b) => a.revenue - b.revenue);
      default:
        return sorted;
    }
  };

  const sortedCourses = getSortedCourses();

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#06B6D4] mx-auto mb-4"></div>
          <p className="text-[#06B6D4] font-semibold text-lg animate-pulse">
            Đang tải dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#06B6D4] mb-2">
            Quản Lý Doanh Thu Khóa Học
          </h1>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Theo dõi và phân tích hiệu suất các khóa học của bạn
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {[
            {
              label: "Tổng Doanh Thu",
              value: formatCurrency(
                coursesData.reduce((sum, course) => sum + course.revenue, 0)
              ),
              icon: (
                <svg
                  width="24"
                  height="24"
                  stroke="black"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3v18h18" />
                  <polyline points="7 14 10 11 13 14 17 10" />
                </svg>
              ),
              bgColor: "bg-gradient-to-r from-green-50 to-emerald-100",
              textColor: "text-green-700",
            },
            {
              label: "Tổng Học Viên",
              value: coursesData
                .reduce((sum, course) => sum + course.students, 0)
                .toLocaleString(),
              icon: (
                <svg
                  width="24"
                  height="24"
                  stroke="black"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              ),
              bgColor: "bg-gradient-to-r from-blue-50 to-cyan-100",
              textColor: "text-blue-700",
            },
            {
              label: "Số Khóa Học",
              value: coursesData.length,
              icon: (
                <svg
                  width="24"
                  height="24"
                  stroke="black"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 4h8a2 2 0 012 2v14a2 2 0 00-2-2H2z" />
                  <path d="M22 4h-8a2 2 0 00-2 2v14a2 2 0 012-2h8z" />
                </svg>
              ),
              bgColor: "bg-gradient-to-r from-purple-50 to-violet-100",
              textColor: "text-purple-700",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-xl p-3 shadow-md transition-all duration-300 transform hover:scale-[1.03]`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{stat.icon}</div>
                <div>
                  <p className="text-gray-500 text-xs font-medium">
                    {stat.label}
                  </p>
                  <p className={`text-sm font-bold ${stat.textColor} mt-1`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200 bg-[#06B6D4] flex items-center justify-between rounded-t-xl">
            <h2 className="text-white font-semibold text-lg flex items-center">
              <span className="mr-2">
              </span>
              Danh Sách Khóa Học
            </h2>
            <div className="flex items-center space-x-2">
              <label htmlFor="sort" className="text-white text-sm font-medium">
                Sắp xếp:
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-white text-gray-800 px-3 py-1 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#06B6D4] transition-all text-sm"
              >
                <option value="id">ID</option>
                <option value="students_desc">Học viên (Cao → Thấp)</option>
                <option value="students_asc">Học viên (Thấp → Cao)</option>
                <option value="revenue_desc">Doanh thu (Cao → Thấp)</option>
                <option value="revenue_asc">Doanh thu (Thấp → Cao)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-cyan-50 text-cyan-800">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold uppercase">
                    Khóa Học
                  </th>
                  <th className="px-4 py-3 text-left font-semibold uppercase">
                    Học Viên
                  </th>
                  <th className="px-4 py-3 text-left font-semibold uppercase">
                    Đánh Giá
                  </th>
                  <th className="px-4 py-3 text-center font-semibold uppercase">
                    Giá
                  </th>
                  <th className="px-4 py-3 text-center font-semibold uppercase">
                    Doanh Thu
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedCourses.map((course) => (
                  <tr
                    key={course.courseId}
                    onMouseEnter={() => setHoveredRow(course.courseId)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() =>
                      nav(`/creator/commercial/courseDetail/${course.courseId}`)
                    }
                    className={`cursor-pointer transition-all duration-300 ${
                      hoveredRow === course.courseId
                        ? "bg-cyan-50 shadow-inner"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 flex items-center space-x-3">
                      <img
                        src={course.urlImg}
                        alt={course.title}
                        className="w-12 h-12 rounded-lg object-cover shadow-sm"
                      />
                      <div className="truncate">
                        <p className="font-semibold text-gray-800 truncate">
                          {course.title}
                        </p>
                        <p className="text-gray-400 text-xs">
                          ID: {course.courseId}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-[#06B6D4] text-white px-2 py-1 rounded-full text-xs font-medium">
                        {course.students.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(course.rating)
                                ? "text-[#F97316] fill-current"
                                : "text-gray-300"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-gray-700 text-sm font-semibold">
                          {course.rating > 0
                            ? course.rating.toFixed(1)
                            : "Chưa có"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-gray-800 font-bold text-sm bg-gray-50 px-2 py-1 rounded-lg inline-block">
                        {formatCurrency(course.price)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[#F97316] font-bold text-sm bg-orange-50 px-2 py-1 rounded-lg inline-block">
                        {formatCurrency(course.revenue)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between rounded-b-xl">
            <p className="text-gray-600 text-xs">
              Hiển thị{" "}
              <span className="font-semibold text-[#06B6D4]">
                {sortedCourses.length}
              </span>{" "}
              khóa học
            </p>
            <button className="bg-[#F97316] text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-lg">
              Xuất Báo Cáo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesTable;
