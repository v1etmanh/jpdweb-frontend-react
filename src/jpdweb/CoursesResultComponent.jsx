import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Giả sử courseApi và notifications được import đúng
import { courseApi } from "./api/courseApi";
import {
  API_RESPONSE_TYPES,
  showErrorNotification,
  showWarningNotification,
} from "./api/apiClient";

// Helper function to convert sort option to API parameter
const getSortParam = (option) => {
  switch (option) {
    case 0:
      return "rating,desc";
    case 1:
      return "numberStudent,desc";
    case 2:
      return "price,desc";
    default:
      return "courseId,desc"; // Sắp xếp mặc định
  }
};

export default function CoursesResultComponent() {
  const { name } = useParams();
  const nav = useNavigate();

  // ========== STATE MANAGEMENT ==========
  // Chỉ lưu trữ 12 khóa học của trang hiện tại
  const [targetCourses, setTargetCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState(3);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isManualSearch, setIsManualSearch] = useState(false);

  // ========== PAGINATION STATE (TỪ SERVER) ==========
  // Các state này sẽ được cập nhật từ response của API
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed để khớp với Spring Pageable
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(12);

  // ========== PAGINATION FUNCTIONS ==========
  /**
   * Chuyển đến trang cụ thể (0-indexed)
   */
  const goToPage = (pageNumber) => {
    // Đã là 0-indexed, không cần trừ 1
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /**
   * Tạo mảng số trang để hiển thị
   */
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 7;
    const currentDisplayPage = currentPage + 1; // Trang hiển thị (1-indexed)

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      let startPage = Math.max(2, currentDisplayPage - 1);
      let endPage = Math.min(totalPages - 1, currentDisplayPage + 1);

      // Điều chỉnh nếu đang ở gần đầu
      if (currentDisplayPage <= 3) {
        startPage = 2;
        endPage = 4;
      }

      // Điều chỉnh nếu đang ở gần cuối
      if (currentDisplayPage >= totalPages - 2) {
        startPage = totalPages - 3;
        endPage = totalPages - 1;
      }

      if (startPage > 2) {
        pageNumbers.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // ========== HANDLE SEARCH ERRORS ==========
  const handleSearchCourseError = useCallback(
    (response) => {
      const message = response.message || "Không thể tìm kiếm khóa học";

      switch (response.responseType) {
        case API_RESPONSE_TYPES.VALIDATION_ERROR:
          showWarningNotification(
            "Từ khóa tìm kiếm không hợp lệ. Vui lòng nhập ít nhất 2 ký tự"
          );
          break;
        case API_RESPONSE_TYPES.NOT_FOUND:
          console.log(`No courses found for: "${name}"`);
          break;
        case API_RESPONSE_TYPES.UNAUTHORIZED:
          showWarningNotification("Bạn cần đăng nhập để tìm kiếm khóa học");
          break;
        default:
          showErrorNotification(message);
          console.error("Search Error:", {
            status: response.status,
            code: response.code,
            traceId: response.traceId,
            searchTerm: name,
          });
      }
    },
    [name]
  );

  // ========== DEBOUNCE SEARCH TERM ==========
  /**
   * Debounce search term để tránh gọi API quá nhiều lần khi người dùng đang gõ
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Đợi 500ms sau khi người dùng ngừng gõ

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ========== AUTO SEARCH ON DEBOUNCED TERM CHANGE ==========
  /**
   * Tự động navigate đến trang tìm kiếm mới khi debouncedSearchTerm thay đổi
   */
  useEffect(() => {
    if (debouncedSearchTerm.trim().length >= 2) {
      // Reset trang và sort khi tìm kiếm mới
      setCurrentPage(0);
      setSortOption(3);
      setIsManualSearch(false); // Đánh dấu là tìm kiếm tự động
      nav(`/course_result/${encodeURIComponent(debouncedSearchTerm.trim())}`);
    }
  }, [debouncedSearchTerm, nav]);

  // ========== SEARCH COURSES EFFECT (SERVER-SIDE) ==========
  /**
   * Tự động tìm kiếm khi `name`, `currentPage`, `pageSize`, hoặc `sortOption` thay đổi
   */
  useEffect(() => {
    let isCancelled = false;

    const findCourses = async () => {
      // Kiểm tra nếu name là "all" hoặc không có name, lấy tất cả khóa học
      const isExploreAll = !name || name.toLowerCase() === "all";

      if (!isExploreAll && name.trim().length < 2) {
        setTargetCourses([]);
        setTotalPages(0);
        setTotalElements(0);
        return;
      }

      setLoading(true);

      try {
        // Lấy tham số sắp xếp
        const sortParam = getSortParam(sortOption);

        // **GỌI API VỚI PAGINATION VÀ SORT**
        // Nếu là "all", tìm kiếm với empty string hoặc wildcard
        const searchKeyword = isExploreAll ? "" : name;
        const response = await courseApi.searchCourse(
          searchKeyword,
          currentPage,
          pageSize,
          sortParam
        );

        if (!isCancelled) {
          if (response.success && response.data) {
            // **CẬP NHẬT STATE TỪ PHẢN HỒI CỦA SERVER**
            setTargetCourses(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
            setTotalElements(response.data.totalElements || 0);
            setCurrentPage(response.data.number || 0); // 'number' là trang hiện tại (0-indexed)
          } else {
            handleSearchCourseError(response);
            setTargetCourses([]);
            setTotalPages(0);
            setTotalElements(0);
          }
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Unexpected search error:", error);
          showErrorNotification("Lỗi kết nối. Vui lòng thử lại");
          setTargetCourses([]);
          setTotalPages(0);
          setTotalElements(0);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    findCourses();

    return () => {
      isCancelled = true;
    };
    // `useEffect` sẽ chạy lại khi bất kỳ giá trị nào trong đây thay đổi
  }, [name, currentPage, pageSize, sortOption, handleSearchCourseError]);

  // ========== HANDLE FILTER/SORT (SERVER-SIDE) ==========
  /**
   * Xử lý sắp xếp. Chỉ cần cập nhật state, useEffect sẽ tự động gọi lại API.
   */
  const handleFilterChange = (option) => {
    setSortOption(option);
    setCurrentPage(0); // Reset về trang đầu tiên khi sắp xếp
  };

  // ========== HANDLE SEARCH ==========
  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      showWarningNotification("Vui lòng nhập từ khóa tìm kiếm");
      return;
    }
    if (trimmed.length < 2) {
      showWarningNotification("Từ khóa tìm kiếm phải có ít nhất 2 ký tự");
      return;
    }

    // Khi tìm kiếm mới, reset trang và sort
    setCurrentPage(0);
    setSortOption(3);
    setIsManualSearch(true); // Đánh dấu là tìm kiếm thủ công
    nav(`/course_result/${encodeURIComponent(trimmed)}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // ========== LOADING STATE ==========
  if (loading && targetCourses.length === 0) {
    // Chỉ hiển thị loading toàn màn hình khi tải lần đầu
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-[#1e88e5] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <svg
                  className="w-12 h-12 text-white animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#243864] mb-2">
                Đang tìm kiếm...
              </h2>
              <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========== EMPTY STATE ==========
  if (targetCourses.length === 0 && !loading) {
    const isExploreAll = !name || name.toLowerCase() === "all";

    // Chỉ hiển thị empty state khi:
    // 1. Đang xem tất cả khóa học (isExploreAll = true)
    // 2. Hoặc người dùng đã nhấn nút tìm kiếm thủ công (isManualSearch = true)
    const shouldShowEmptyState = isExploreAll || isManualSearch;

    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header với thanh tìm kiếm - Luôn hiển thị */}
        <div className="bg-white shadow-lg border-b-4 border-[#F97316]">
          <div className="max-w-8xl mx-auto px-4 py-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-[#243864] mb-2">
                📁{" "}
                {name && name.toLowerCase() === "all"
                  ? "Khám phá khóa học"
                  : "Thư viện khóa học"}
              </h1>
            </div>

            {/* Thanh tìm kiếm */}
            <div className="max-w-3xl mx-auto mb-6">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border-4 border-white/50 p-1.5 hover:shadow-[#F97316]/30 transition-shadow duration-300">
                <div className="flex items-center gap-2.5">
                  <div className="pl-3 text-[#F97316]">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tìm kiếm khóa học, mô tả hoặc giảng viên..."
                    className="flex-grow px-1.5 py-2 text-base text-gray-700 bg-transparent focus:outline-none placeholder-gray-400"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-bold px-4 py-2.5 rounded-xl hover:from-[#EA580C] hover:to-[#F97316] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-1.5 text-sm"
                  >
                    <span>Tìm kiếm</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Bộ lọc */}
            <div className="flex justify-end">
              <select
                value={sortOption}
                onChange={(e) => handleFilterChange(Number(e.target.value))}
                className="bg-[#243864] text-white px-4 py-2 rounded-lg border-0 shadow-md font-medium text-sm focus:outline-none cursor-pointer hover:bg-[#1e3a5f] transition-colors"
              >
                <option value={3}>📁 Sắp xếp khóa học</option>
                <option value={0}>⭐ Đánh giá cao nhất</option>
                <option value={1}>👥 Nhiều học viên nhất</option>
                <option value={2}>💰 Giá cao nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Nội dung empty state */}
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl mx-auto">
                {shouldShowEmptyState ? (
                  // Hiển thị thông báo không tìm thấy kết quả
                  <>
                    <div className="w-24 h-24 bg-[#e53935] rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-12 h-12 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9.172 16.172a4 4 0 015.656 0M9 12h.01M15 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-[#243864] mb-4">
                      {isExploreAll ? "Chưa có khóa học" : "Không tìm thấy kết quả"}
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                      {isExploreAll ? (
                        "Hiện tại chưa có khóa học nào trong hệ thống"
                      ) : (
                        <>
                          Không có khóa học nào phù hợp với từ khóa{" "}
                          <span className="font-semibold text-[#F97316]">
                            "{name}"
                          </span>
                        </>
                      )}
                    </p>
                    <button
                      onClick={() => nav("/")}
                      className="px-8 py-4 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-bold text-lg rounded-xl hover:from-[#EA580C] hover:to-[#F97316] transition-all duration-300 shadow-lg"
                    >
                      {isExploreAll ? "Về trang chủ" : "Xem tất cả khóa học"}
                    </button>
                  </>
                ) : (
                  // Hiển thị loading khi đang gõ tự động
                  <>
                    <div className="w-24 h-24 bg-[#1e88e5] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <svg
                        className="w-12 h-12 text-white animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        ></path>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-[#243864] mb-2">
                      Đang tìm kiếm...
                    </h2>
                    <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========== MAIN CONTENT ==========
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header với thanh tìm kiếm */}
      <div className="bg-white shadow-lg border-b-4 border-[#F97316]">
        <div className="max-w-8xl mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#243864] mb-2">
              📁{" "}
              {name && name.toLowerCase() === "all"
                ? "Khám phá khóa học"
                : "Thư viện khóa học"}
            </h1>
          </div>

          {/* Thanh tìm kiếm */}
          <div className="max-w-3xl mx-auto mb-6">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border-4 border-white/50 p-1.5 hover:shadow-[#F97316]/30 transition-shadow duration-300">
              <div className="flex items-center gap-2.5">
                <div className="pl-3 text-[#F97316]">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tìm kiếm khóa học, mô tả hoặc giảng viên..."
                  className="flex-grow px-1.5 py-2 text-base text-gray-700 bg-transparent focus:outline-none placeholder-gray-400"
                />
                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-bold px-4 py-2.5 rounded-xl hover:from-[#EA580C] hover:to-[#F97316] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-1.5 text-sm"
                >
                  <span>Tìm kiếm</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Bộ lọc */}
          <div className="flex justify-end">
            <select
              value={sortOption}
              onChange={(e) => handleFilterChange(Number(e.target.value))}
              className="bg-[#243864] text-white px-4 py-2 rounded-lg border-0 shadow-md font-medium text-sm focus:outline-none cursor-pointer hover:bg-[#1e3a5f] transition-colors"
            >
              <option value={3}>📁 Sắp xếp khóa học</option>
              <option value={0}>⭐ Đánh giá cao nhất</option>
              <option value={1}>👥 Nhiều học viên nhất</option>
              <option value={2}>💰 Giá cao nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========== DANH SÁCH KHÓA HỌC ========== */}
      {/* Hiển thị lớp phủ loading khi chuyển trang */}
      <div
        className={`max-w-7xl mx-auto px-4 py-12 relative ${
          loading ? "opacity-50 transition-opacity duration-300" : ""
        }`}
      >
        {/* Render `targetCourses` (chỉ 12 item) trực tiếp */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {targetCourses.map((course, index) => (
            <div
              key={course.id || index}
              className="group cursor-pointer transform hover:scale-105 transition-transform duration-300"
              onClick={() => {
                // Scroll về đầu trang trước khi chuyển trang
                window.scrollTo({ top: 0, behavior: "smooth" });
                nav(`/course/specific/${course.id}`);
              }}
            >
              {/* Course Card (Giữ nguyên) */}
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
                <div className="relative aspect-video overflow-hidden bg-gray-200">
                  {course.img ? (
                    <img
                      src={course.img}
                      alt={course.name || "Course"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "/default-course-image.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1e88e5] to-[#243864]">
                      <svg
                        className="w-16 h-16 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-gray-900 font-bold text-base mb-2 line-clamp-2 min-h-[48px]">
                    {course.name || "Untitled Course"}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {course.instructor || "Unknown Creator"}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-yellow-600 font-bold text-sm">
                      {course.rating ? course.rating.toFixed(1) : "0"}
                    </span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${
                            i < Math.floor(course.rating || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-500 text-xs">
                      ({(course.numberStudent || 0).toLocaleString()})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
                    <span>{course.chapters?.length || 0} chương</span>
                    <span>•</span>
                    <span>{course.language || "Tiếng Việt"}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-gray-900 font-bold text-lg">
                      {course.price === 0 ? (
                        <span className="text-green-600">Miễn phí</span>
                      ) : (
                        `₫${(course.price || 0).toLocaleString()}`
                      )}
                    </span>
                    {course.price > 0 && (
                      <span className="text-gray-400 line-through text-sm">
                        ₫{((course.price || 0) * 1.5).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {course.numberStudent > 1000 && (
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                        Bestseller
                      </span>
                    )}
                    {course.rating >= 4.5 && (
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded">
                        Cao nhất
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Scroll về đầu trang trước khi chuyển trang
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      nav(`/course/specific/${course.id}`);
                    }}
                    className="mt-3 w-full py-2.5 px-4 bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white font-semibold text-sm rounded-lg hover:from-[#0891B2] hover:to-[#06B6D4] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      ></path>
                    </svg>
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ========== PAGINATION UI (SERVER-SIDE) ========== */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            {/* Nút Previous */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0 || loading}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                currentPage === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-[#243864] shadow-md hover:scale-110"
              } ${loading ? "opacity-50 cursor-wait" : ""}`}
              aria-label="Trang trước"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>

            {/* Các số trang */}
            <div className="flex gap-2">
              {getPageNumbers().map((pageNum, index) => {
                if (pageNum === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-4 py-2 text-gray-500"
                    >
                      ...
                    </span>
                  );
                }

                // pageNum là 1-indexed, currentPage là 0-indexed
                const pageIndex = pageNum - 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageIndex)}
                    disabled={loading}
                    className={`min-w-[44px] px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      currentPage === pageIndex
                        ? "bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-lg scale-110"
                        : "bg-white text-[#243864] shadow-md hover:scale-110"
                    } ${loading ? "opacity-50 cursor-wait" : ""}`}
                    aria-label={`Trang ${pageNum}`}
                    aria-current={
                      currentPage === pageIndex ? "page" : undefined
                    }
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Nút Next */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages - 1 || loading}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                currentPage === totalPages - 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-[#243864] shadow-md hover:scale-110"
              } ${loading ? "opacity-50 cursor-wait" : ""}`}
              aria-label="Trang sau"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        )}

        {/* Thông tin trang hiện tại */}
        {totalPages > 0 && (
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Trang{" "}
              <span className="font-semibold text-[#F97316]">
                {currentPage + 1}
              </span>{" "}
              / <span className="font-semibold">{totalPages}</span> • Tổng số{" "}
              <span className="font-semibold text-[#F97316]">
                {totalElements}
              </span>{" "}
              khóa học
            </p>
          </div>
        )}
      </div>

      {/* ========== FOOTER ========== */}
      <div className="bg-[#243864] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-2">
            📁 {totalElements} khóa học
          </h3>
          <p className="text-[#F97316] font-medium">
            Khám phá kiến thức mới ngay hôm nay!
          </p>
        </div>
      </div>
    </div>
  );
}