import React, { useState, useEffect } from 'react';
import { Play, Clock, BookOpen, Heart, Star, MoreHorizontal, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock Data - Simple Format
const mockData = {
  courses: [
    {
      courseId: 1,
      course_name: "Complete React Developer Course",
      course_img: "https://img-c.udemycdn.com/course/240x135/851712_fc61_6.jpg",
      progress: 65
    },
    {
      courseId: 2,
      course_name: "JavaScript: The Complete Guide 2024",
      course_img: "https://img-c.udemycdn.com/course/240x135/947098_02ec.jpg",
      progress: 23
    },
    {
      courseId: 3,
      course_name: "Python for Data Science",
      course_img: "https://img-c.udemycdn.com/course/240x135/567828_67d0.jpg",
      progress: 89
    },
    {
      courseId: 4,
      course_name: "UI/UX Design Masterclass",
      course_img: "https://img-c.udemycdn.com/course/240x135/449532_2aa9_7.jpg",
      progress: 12
    }
  ],
  wishlists: [
    {
      courseId: 5,
      course_name: "Machine Learning A-Z",
      course_img: "https://img-c.udemycdn.com/course/240x135/950390_270f_3.jpg",
      progress: 0
    },
    {
      courseId: 6,
      course_name: "The Web Developer Bootcamp 2024",
      course_img: "https://img-c.udemycdn.com/course/240x135/625204_436a_3.jpg",
      progress: 0
    },
    {
      courseId: 7,
      course_name: "AWS Certified Solutions Architect",
      course_img: "https://img-c.udemycdn.com/course/240x135/362070_d944_2.jpg",
      progress: 0
    }
  ],
   myCourse: [
    {
      courseId: 5,
      course_name: "Machine Learning A-Z",
      course_img: "https://img-c.udemycdn.com/course/240x135/950390_270f_3.jpg",
      progress: 0
    },
    {
      courseId: 6,
      course_name: "The Web Developer Bootcamp 2024",
      course_img: "https://img-c.udemycdn.com/course/240x135/625204_436a_3.jpg",
      progress: 0
    },
    {
      courseId: 7,
      course_name: "AWS Certified Solutions Architect",
      course_img: "https://img-c.udemycdn.com/course/240x135/362070_d944_2.jpg",
      progress: 0
    }
  ]
};

export default function MyLearningComponent() {
  const [activeTab, setActiveTab] = useState('learning');
  const [courses, setCourses] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const[myCourse,setMycourse]=useState([])
  useEffect(() => {
    // Simulate API call
    setCourses(mockData.courses);
    setWishlists(mockData.wishlists);
   setMycourse(mockData.myCourse);
  }, []);
  const nav=useNavigate()

  const filteredCourses = courses.filter(course =>
    course.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredWishlists = wishlists.filter(course =>
    course.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
const filteredMyCourse = myCourse.filter(course =>
    course.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const CourseCard = ({ course, isWishlist = false }) => (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100 transition-all duration-300 cursor-pointer group hover:translate-y-[-4px]">
      <div className="relative">
        <img 
          src={course.course_img} 
          alt={course.course_name}
          className="w-full h-44 object-cover transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white bg-opacity-90 rounded-full p-3 transform scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
            <Play size={24} className="text-[#1e88e5] ml-1" />
          </div>
        </div>
        {!isWishlist && (
          <div className="absolute bottom-2 left-2 bg-white bg-opacity-95 px-3 py-1 rounded-md text-xs font-medium border border-[#1e88e5]/10">
            {course.progress}% complete
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-gray-800 text-sm mb-3 line-clamp-2 leading-tight group-hover:text-[#1e88e5] transition-colors">
          {course.course_name}
        </h3>
        
        {!isWishlist && (
          <div className="mb-4">
            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
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
              className="flex items-center gap-2 text-[#1e88e5] font-medium text-sm hover:text-[#1976d2] hover:underline transition-colors"
              onClick={()=>{nav(`/course/content_overview/${course.courseId}`) }}
            >
              <Play size={14} />
              Continue Learning
            </button>
          ) : (
            <button className="flex items-center gap-2 bg-[#1e88e5] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1976d2] transition-colors border border-[#1e88e5]">
              <BookOpen size={14} />
              Add to Cart
            </button>
          )}
          <button className="p-2 text-gray-500 hover:text-[#1e88e5] hover:bg-gray-50 rounded-full transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-[#1e88e5]/10 text-[#1e88e5] text-sm font-medium mb-4">
          YOUR LEARNING CENTER
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
          My Learning
        </h1>
        <div className="w-20 h-1 bg-[#1e88e5] rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">Continue your learning journey with our comprehensive courses designed to help you master new skills.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 pb-6 border-b border-gray-100">
        {/* Tabs */}
        <div className="flex gap-3 flex-wrap">
          <button 
            className={`px-6 py-2.5 font-medium rounded-md transition-all ${
              activeTab === 'learning'
                ? 'bg-[#1e88e5] text-white'
                : 'bg-white text-gray-700 hover:bg-[#1e88e5]/5 border border-gray-200'
            }`}
            onClick={() => setActiveTab('learning')}
            aria-pressed={activeTab === 'learning'}
          >
            <span className="flex items-center gap-2">
              <BookOpen size={18} />
              My Learning <span className="ml-1 px-2 py-0.5 bg-white bg-opacity-20 rounded text-xs text-black">{courses.length}</span>
            </span>
          </button>
          <button 
            className={`px-6 py-2.5 font-medium rounded-md transition-all ${
              activeTab === 'wishlist'
                ? 'bg-[#1e88e5] text-white'
                : 'bg-white text-gray-700 hover:bg-[#1e88e5]/5 border border-gray-200'
            }`}
            onClick={() => setActiveTab('wishlist')}
            aria-pressed={activeTab === 'wishlist'}
          >
            <span className="flex items-center gap-2">
              <Heart size={18} />
              Wishlist <span className="ml-1 px-2 py-0.5 bg-white bg-opacity-20 rounded text-xs text-black">{wishlists.length}</span>
            </span>
          </button>
          <button 
            className={`px-6 py-2.5 font-medium rounded-md transition-all ${
              activeTab === 'myCourse'
                ? 'bg-[#1e88e5] text-white'
                : 'bg-white text-gray-700 hover:bg-[#1e88e5]/5 border border-gray-200'
            }`}
            onClick={() => setActiveTab('myCourse')}
            aria-pressed={activeTab === 'myCourse'}
          >
            <span className="flex items-center gap-2">
              <Play size={18} />
              MyCourse <span className="ml-1 px-2 py-0.5 bg-white bg-opacity-20 rounded text-xs text-black">{myCourse.length}</span>
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-auto">
          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1e88e5]" />
          <input
            type="text"
            placeholder="Search my courses"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-2.5 border border-gray-200 rounded-md text-sm w-full sm:w-80 focus:outline-none focus:border-[#1e88e5] focus:ring-1 focus:ring-[#1e88e5]/20 transition-all bg-white"
            aria-label="Search courses"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {activeTab === 'learning' && 
          filteredCourses.map(course => (
            <CourseCard key={course.courseId} course={course} />
          ))
        }
        
        {activeTab === 'wishlist' && 
          filteredWishlists.map(course => (
            <CourseCard key={course.courseId} course={course} isWishlist={true} />
          ))
        }
        
        {activeTab === 'myCourse' && 
          filteredMyCourse.map(course => (
            <CourseCard key={course.courseId} course={course} isWishlist={false} />
          ))
        }
      </div>

      {/* Empty State */}
      {((activeTab === 'learning' && filteredCourses.length === 0) ||
        (activeTab === 'wishlist' && filteredWishlists.length === 0) ||
        (activeTab === 'myCourse' && filteredMyCourse.length === 0)) && (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-100 mt-8">
          <div className="mb-6 relative inline-block">
            {activeTab === 'learning' ? (
              <div className="bg-[#1e88e5]/10 p-6 rounded-full">
                <BookOpen size={64} className="text-[#1e88e5]" />
              </div>
            ) : activeTab === 'wishlist' ? (
              <div className="bg-[#1e88e5]/10 p-6 rounded-full">
                <Heart size={64} className="text-[#1e88e5]" />
              </div>
            ) : (
              <div className="bg-[#1e88e5]/10 p-6 rounded-full">
                <Play size={64} className="text-[#1e88e5]" />
              </div>
            )}
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">
            No courses found
          </h3>
          <p className="text-gray-600 max-w-md mx-auto text-lg">
            {activeTab === 'learning' 
              ? "Start learning something new today! Browse our course catalog to begin your journey." 
              : activeTab === 'wishlist'
                ? "Add courses to your wishlist to save for later. You can find great courses in our catalog."
                : "You haven't enrolled in any courses yet. Explore our catalog to find courses that interest you."
            }
          </p>
          <button className="mt-8 bg-[#1e88e5] text-white px-8 py-3 rounded-md font-medium hover:bg-[#1976d2] transition-all duration-300 border border-[#1e88e5]">
            Browse Courses
          </button>
        </div>
      )}
    </div>
  );
}