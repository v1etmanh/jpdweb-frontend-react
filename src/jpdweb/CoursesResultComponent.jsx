import { Button } from "bootstrap";
import { useEffect,useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {courseApi} from './api/courseApi'
import { showErrorNotification, showSuccessNotification } from "./api/apiClient";
//create

export default function CoursesResultComponent(){
    //create list course {creator: , name: , description:, rating:, numberModuleType:, numberstudent:}

 const {name} = useParams();
 console.log(name)
    const [targetCourses, setTargetCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState(3);
    const nav = useNavigate();
    
    const findCourses = async() => {
   
      const response=await courseApi.searchCourse(name)
      if(response.success){
        
        setTargetCourses(response.data);
      }
      else{
  showErrorNotification("Error fetching courses");
        setTargetCourses([]);
      }
    }

    useEffect(() => {
       findCourses()
    }, [name]);

    const filterHandle = (e) => {
        switch (e) {
            case 0:
                setTargetCourses([...targetCourses].sort((a, b) => b.rating - a.rating));
                break;
            case 1:
                setTargetCourses([...targetCourses].sort((a, b) => b.numberstudent - a.numberstudent));
                break;
            case 2:
                setTargetCourses([...targetCourses].sort((a, b) => b.price - a.price));
                break;
            default:
                break;
        }
    };

    const handleSearch = () => {
        if (searchTerm.trim()) {
            nav(`/course_result/${searchTerm.trim()}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    if (targetCourses.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center">
                        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl mx-auto">
                            <div className="w-24 h-24 bg-[#e53935] rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-[#243864] mb-4">Không tìm thấy kết quả</h2>
                            <p className="text-xl text-gray-600 mb-8">
                                Không có khóa học nào phù hợp với từ khóa <span className="font-semibold text-[#e53935]">"{name}"</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header với thanh tìm kiếm */}
            <div className="bg-white shadow-lg border-b-4 border-[#1e88e5]">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-[#243864] mb-2">📁 Thư viện khóa học</h1>
                        <p className="text-lg text-gray-600">
                            Tìm thấy <span className="font-semibold text-[#e53935]">{targetCourses.length}</span> thư mục cho "{name}"
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
                                placeholder="Tìm kiếm thư mục khóa học..."
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
                                filterHandle(value);
                            }}
                            className="bg-[#243864] text-white px-8 py-4 rounded-xl border-0 shadow-lg font-semibold text-lg focus:outline-none cursor-pointer"
                        >
                            <option value={3}>📁 Sắp xếp thư mục</option>
                            <option value={0}>⭐ Đánh giá cao nhất</option>
                            <option value={1}>👥 Nhiều học viên nhất</option>
                            <option value={2}>💰 Giá cao nhất</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Danh sách thư mục khóa học */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {targetCourses.map((course, index) => {
  console.log("Course object:", course); // Debug each course
  console.log("Creator:", course.creator); // Debug creator
  
  return (
    <div
      key={course.id || index}
      className="group cursor-pointer"
      onClick={()=>{nav(`/course/specific/${course.id}`)}}
    >
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        
        {/* Course Image */}
        <div className="relative aspect-video overflow-hidden bg-gray-200">
          <img 
            src={course.img || '/default-course-image.jpg'} 
            alt={course.name || 'Course'}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Course Content */}
        <div className="p-4">
          
          {/* Course Title */}
          <h3 className="text-gray-900 font-bold text-base mb-2 line-clamp-2 min-h-[48px]">
            {course.name || 'Untitled Course'}
          </h3>

          {/* Creator - FIXED */}
          <p className="text-gray-600 text-sm mb-2">
            {course.instructor|| 'Unknown Creator'}
          </p>

          {/* Rating and Students */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-yellow-600 font-bold text-sm">4.5</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xs">★</span>
              ))}
            </div>
            <span className="text-gray-500 text-xs">
              ({(course.numberStudent || 0).toLocaleString()} students)
            </span>
          </div>

          {/* Course Info */}
          <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
            <span>{course.chapters?.length || 0} chapters</span>
            <span>•</span>
            <span>{course.language || 'N/A'}</span>
            <span>•</span>
            <span>All Levels</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-gray-900 font-bold text-lg">
              ₫{(course.price || 0).toLocaleString()}
            </span>
            {course.price > 0 && (
              <span className="text-gray-400 line-through text-sm">
                ₫{((course.price || 0) * 1.5).toLocaleString()}
              </span>
            )}
          </div>

          {/* Bestseller Badge */}
          <div className="mt-2">
            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
              Bestseller
            </span>
          </div>
        </div>
      </div>
    </div>
  );
})}

                </div>
            </div>

            {/* Footer */}
            <div className="bg-[#243864] text-white py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold mb-2">📁 {targetCourses.length} thư mục khóa học</h3>
                    <p className="text-[#1e88e5] font-medium">Mở thư mục để khám phá kiến thức bên trong!</p>
                </div>
            </div>
        </div>
    );
}