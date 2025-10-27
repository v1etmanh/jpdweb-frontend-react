import React, { useState, useEffect } from 'react';
import { Play, BookOpen, Heart, MoreHorizontal, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loadLearningList } from './api/ApiConnect';

export default function MyLearningComponent() {
  const [activeTab, setActiveTab] = useState('learning');
  const [courses, setCourses] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchdata();
  }, []);

  const nav = useNavigate();

  const fetchdata = async () => {
    try {
      const response = await loadLearningList();
      if (response.status === 200) {
        // Thêm index để tạo ID duy nhất vì courseId đều là 0
        const coursesWithId = response.data.cardDtos.map((course, index) => ({
          ...course,
          uniqueId: `course_${index}`
        }));
        const wishlistsWithId = response.data.wishlistDtos.map((course, index) => ({
          ...course,
          uniqueId: `wishlist_${index}`
        }));
        
        setCourses(coursesWithId);
        setWishlists(wishlistsWithId);
      } else {
        alert("Lỗi khi tải dữ liệu");
      }
    } catch (e) {
      console.error("Lỗi kết nối server", e);
      alert("Không thể kết nối đến server");
    }
  };

  const filteredCourses = courses.filter(course =>
    course.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredWishlists = wishlists.filter(course =>
    course.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CourseCard = ({ course, isWishlist = false }) => (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-all duration-300 cursor-pointer group">
      <div className="relative">
        <img 
          src={course.course_img} 
          alt={course.course_name}
          className="w-full h-40 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Course+Image';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="bg-[#D4B896] bg-opacity-90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Play size={24} className="text-[#5D4E37] ml-1" />
          </div>
        </div>
        {!isWishlist && course.progress > 0 && (
          <div className="absolute bottom-2 left-2 bg-[#D4B896] bg-opacity-95 px-2 py-1 rounded text-xs font-semibold text-[#5D4E37]">
            {Math.round(course.progress)}% hoàn thành
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-[#243864] text-sm mb-3 line-clamp-2 leading-tight">
          {course.course_name}
        </h3>
        
        {!isWishlist && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
              <div 
                className="bg-[#1e88e5] h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          {!isWishlist ? (
            <button 
              className="flex items-center gap-2 text-[#1e88e5] font-semibold text-sm hover:text-[#243864] transition-colors"
              onClick={() => nav(`/course/content_overview/${course.courseId}`)}
            >
              <Play size={14} />
              Tiếp tục học
            </button>
          ) : (
            <button 
            onClick={()=>{nav(`/course/specific/${course.courseId}`)}}
            className="flex items-center gap-2 bg-[#D4B896] text-[#5D4E37] px-4 py-2 rounded text-sm font-semibold hover:bg-[#C4A886] hover:text-[#FFFEF7] transition-colors">
              <BookOpen size={14} />
              Thêm vào giỏ
            </button>
          )}
          <button className="p-2 text-gray-500 hover:text-[#243864] hover:bg-[#FFFEF7] rounded transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#F5E6D3] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#243864]">Khóa học của tôi</h1>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        {/* Tabs */}
        <div className="flex gap-2">
          <button 
            className={`px-6 py-3 border-2 font-semibold rounded transition-all ${
              activeTab === 'learning'
                ? 'border-[#243864] bg-[#243864] text-white'
                : 'border-gray-300 bg-white text-[#5D4E37] hover:bg-[#FFFEF7]'
            }`}
            onClick={() => setActiveTab('learning')}
          >
            Khóa học của tôi ({courses.length})
          </button>
          <button 
            className={`px-6 py-3 border-2 font-semibold rounded transition-all ${
              activeTab === 'wishlist'
                ? 'border-[#243864] bg-[#243864] text-white'
                : 'border-gray-300 bg-white text-[#5D4E37] hover:bg-[#FFFEF7]'
            }`}
            onClick={() => setActiveTab('wishlist')}
          >
            Danh sách yêu thích ({wishlists.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm khóa học"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 border-2 border-gray-300 rounded text-sm w-full sm:w-80 focus:outline-none focus:border-[#1e88e5] transition-colors"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {activeTab === 'learning' && 
          filteredCourses.map(course => (
            <CourseCard key={course.uniqueId} course={course} />
          ))
        }
        
        {activeTab === 'wishlist' && 
          filteredWishlists.map(course => (
            <CourseCard key={course.uniqueId} course={course} isWishlist={true} />
          ))
        }
      </div>

      {/* Empty State */}
      {((activeTab === 'learning' && filteredCourses.length === 0) ||
        (activeTab === 'wishlist' && filteredWishlists.length === 0)) && (
        <div className="text-center py-16">
          <div className="mb-6">
            {activeTab === 'learning' ? 
              <BookOpen size={64} className="mx-auto text-gray-300" /> : 
              <Heart size={64} className="mx-auto text-gray-300" />
            }
          </div>
          <h3 className="text-xl font-semibold text-[#5D4E37] mb-2">
            Không tìm thấy khóa học
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {activeTab === 'learning' 
              ? "Bắt đầu học ngay hôm nay! Duyệt danh sách khóa học để bắt đầu hành trình của bạn." 
              : "Thêm khóa học vào danh sách yêu thích để lưu để sau. Bạn có thể tìm thấy các khóa học tuyệt vời trong danh mục."
            }
          </p>
          <button className="mt-6 bg-[#D4B896] text-[#5D4E37] px-6 py-3 rounded font-semibold hover:bg-[#C4A886] hover:text-[#FFFEF7] transition-colors shadow-md hover:shadow-lg">
            Duyệt khóa học
          </button>
        </div>
      )}
      </div>
    </div>
  );
}