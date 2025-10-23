import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { courseApi } from './api/courseApi';
import { API_RESPONSE_TYPES, showErrorNotification, showWarningNotification } from "./api/apiClient";

export default function CoursesResultComponent() {
  const { name } = useParams();
  const nav = useNavigate();
  
  const [targetCourses, setTargetCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState(3);
  const [loading, setLoading] = useState(false);

  // ✅ Search courses with cleanup and error handling
  useEffect(() => {
    let isCancelled = false;

    const findCourses = async () => {
      // Validate search term
      if (!name || name.trim().length < 2) {
        setTargetCourses([]);
        return;
      }

      setLoading(true);
      
      try {
        const response = await courseApi.searchCourse(name);
        
        if (!isCancelled) {
          if (response.success) {
            setTargetCourses(response.data || []);
          } else {
            handleSearchCourseError(response);
            setTargetCourses([]);
          }
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Unexpected search error:', error);
          showErrorNotification('Lỗi kết nối. Vui lòng thử lại');
          setTargetCourses([]);
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
  }, [name]);

  // ✅ Handle search errors (FIXED: Remove notification for NOT_FOUND)
  const handleSearchCourseError = (response) => {
    const message = response.message || 'Không thể tìm kiếm khóa học';

    switch (response.responseType) {
      case API_RESPONSE_TYPES.VALIDATION_ERROR:
        showWarningNotification('Từ khóa tìm kiếm không hợp lệ. Vui lòng nhập ít nhất 2 ký tự');
        break;

      case API_RESPONSE_TYPES.NOT_FOUND:
        // ✅ Silent - UI sẽ tự hiển thị empty state
        console.log(`No courses found for: "${name}"`);
        break;

      case API_RESPONSE_TYPES.UNAUTHORIZED:
        showWarningNotification('Bạn cần đăng nhập để tìm kiếm khóa học');
        break;

      default:
        showErrorNotification(message);
        console.error('Search Error:', {
          status: response.status,
          code: response.code,
          traceId: response.traceId,
          searchTerm: name
        });
    }
  };

  // ✅ Handle filter/sort (FIXED: Proper immutable update)
  const handleFilter = (option) => {
    if (option === 3) return; // Default option - no sorting

    let sorted;
    
    switch (option) {
      case 0: // Sort by rating
        sorted = [...targetCourses].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 1: // Sort by students
        sorted = [...targetCourses].sort((a, b) => (b.numberStudent || 0) - (a.numberStudent || 0));
        break;
      case 2: // Sort by price
        sorted = [...targetCourses].sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        return;
    }
    
    setTargetCourses(sorted);
    setSortOption(option);
  };

  // ✅ Handle search with validation
  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    
    if (!trimmed) {
      showWarningNotification('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }
    
    if (trimmed.length < 2) {
      showWarningNotification('Từ khóa tìm kiếm phải có ít nhất 2 ký tự');
      return;
    }
    
    // ✅ Encode URI để xử lý ký tự đặc biệt
    nav(`/course_result/${encodeURIComponent(trimmed)}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-[#1e88e5] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <svg className="w-12 h-12 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#243864] mb-2">Đang tìm kiếm...</h2>
              <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Empty state
  if (targetCourses.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-[#e53935] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h.01M15 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-[#243864] mb-4">Không tìm thấy kết quả</h2>
              <p className="text-xl text-gray-600 mb-8">
                Không có khóa học nào phù hợp với từ khóa <span className="font-semibold text-[#e53935]">"{name}"</span>
              </p>
              <button
                onClick={() => nav('/')}
                className="px-8 py-4 bg-gradient-to-r from-[#1e88e5] to-[#243864] text-white font-bold text-lg rounded-xl hover:from-[#243864] hover:to-[#1e88e5] transition-all duration-300 shadow-lg"
              >
                Xem tất cả khóa học
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Main content
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header với thanh tìm kiếm */}
      <div className="bg-white shadow-lg border-b-4 border-[#1e88e5]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#243864] mb-2">📁 Thư viện khóa học</h1>
            <p className="text-lg text-gray-600">
              Tìm thấy <span className="font-semibold text-[#e53935]">{targetCourses.length}</span> khóa học cho "{name}"
            </p>
          </div>

          {/* Thanh tìm kiếm */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="relative flex shadow-2xl rounded-2xl overflow-hidden">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-[#243864]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tìm kiếm khóa học..."
                className="flex-grow pl-16 pr-6 py-6 text-lg text-[#243864] bg-white focus:outline-none focus:ring-4 focus:ring-[#1e88e5]/20 placeholder-gray-500"
              />
              <button
                onClick={handleSearch}
                className="px-12 py-6 bg-gradient-to-r from-[#1e88e5] to-[#243864] text-white font-bold text-lg hover:from-[#243864] hover:to-[#1e88e5] transition-all duration-300"
              >
                Tìm kiếm
              </button>
            </div>
          </div>

          {/* Bộ lọc */}
          <div className="flex justify-center">
            <select
              value={sortOption}
              onChange={(e) => {
                const value = Number(e.target.value);
                setSortOption(value);
                handleFilter(value);
              }}
              className="bg-[#243864] text-white px-8 py-4 rounded-xl border-0 shadow-lg font-semibold text-lg focus:outline-none cursor-pointer hover:bg-[#1e3a5f] transition-colors"
            >
              <option value={3}>📁 Sắp xếp khóa học</option>
              <option value={0}>⭐ Đánh giá cao nhất</option>
              <option value={1}>👥 Nhiều học viên nhất</option>
              <option value={2}>💰 Giá cao nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danh sách khóa học */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {targetCourses.map((course, index) => (
            <div
              key={course.id || index}
              className="group cursor-pointer transform hover:scale-105 transition-transform duration-300"
              onClick={() => nav(`/course/specific/${course.id}`)}
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
                
                {/* Course Image */}
                <div className="relative aspect-video overflow-hidden bg-gray-200">
                  {course.img ? (
                    <img 
                      src={course.img} 
                      alt={course.name || 'Course'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/default-course-image.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1e88e5] to-[#243864]">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Course Content */}
                <div className="p-4 flex-grow flex flex-col">
                  
                  {/* Course Title */}
                  <h3 className="text-gray-900 font-bold text-base mb-2 line-clamp-2 min-h-[48px]">
                    {course.name || 'Untitled Course'}
                  </h3>

                  {/* Creator */}
                  <p className="text-gray-600 text-sm mb-2">
                    {course.instructor || 'Unknown Creator'}
                  </p>

                  {/* Rating and Students */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-yellow-600 font-bold text-sm">
                      {course.rating ? course.rating.toFixed(1) : '4.5'}
                    </span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`text-xs ${i < Math.floor(course.rating || 4.5) ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-500 text-xs">
                      ({(course.numberStudent || 0).toLocaleString()})
                    </span>
                  </div>

                  {/* Course Info */}
                  <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
                    <span>{course.chapters?.length || 0} chương</span>
                    <span>•</span>
                    <span>{course.language || 'Tiếng Việt'}</span>
                  </div>

                  {/* Price */}
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

                  {/* Badges */}
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#243864] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-2">📁 {targetCourses.length} khóa học</h3>
          <p className="text-[#1e88e5] font-medium">Khám phá kiến thức mới ngay hôm nay!</p>
        </div>
      </div>
    </div>
  );
}