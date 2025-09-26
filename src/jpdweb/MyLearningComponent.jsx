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
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-all duration-300 cursor-pointer group">
      <div className="relative">
        <img 
          src={course.course_img} 
          alt={course.course_name}
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="bg-white bg-opacity-90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Play size={24} className="text-gray-800 ml-1" />
          </div>
        </div>
        {!isWishlist && (
          <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-semibold">
            {course.progress}% complete
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm mb-3 line-clamp-2 leading-tight">
          {course.course_name}
        </h3>
        
        {!isWishlist && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
              <div 
                className="bg-purple-600 h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          {!isWishlist ? (
            <button className="flex items-center gap-2 text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors"
            onClick={()=>{nav(`/course/content_overview/${course.courseId}`) }}>
              <Play size={14} />
              Continue Learning
            </button>
          ) : (
            <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-gray-800 transition-colors">
              <BookOpen size={14} />
              Add to Cart
            </button>
          )}
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My learning</h1>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        {/* Tabs */}
        <div className="flex gap-2">
          <button 
            className={`px-6 py-3 border-2 font-semibold rounded transition-all ${
              activeTab === 'learning'
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('learning')}
          >
            My Learning ({courses.length})
          </button>
          <button 
            className={`px-6 py-3 border-2 font-semibold rounded transition-all ${
              activeTab === 'wishlist'
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('wishlist')}
          >
            Wishlist ({wishlists.length})
          </button>
          <button 
  className={`px-6 py-3 border-2 font-semibold rounded transition-all ${
    activeTab === 'myCourse'
      ? 'border-gray-900 bg-gray-900 text-white'
      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
  }`}
  onClick={() => setActiveTab('myCourse')}
>
  MyCourse ({myCourse.length})
</button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search my courses"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 border-2 border-gray-300 rounded text-sm w-full sm:w-80 focus:outline-none focus:border-purple-500 transition-colors"
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
        (activeTab === 'wishlist' && filteredWishlists.length === 0)) && (
        <div className="text-center py-16">
          <div className="mb-6">
            {activeTab === 'learning' ? 
              <BookOpen size={64} className="mx-auto text-gray-300" /> : 
              <Heart size={64} className="mx-auto text-gray-300" />
            }
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No courses found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {activeTab === 'learning' 
              ? "Start learning something new today! Browse our course catalog to begin your journey." 
              : "Add courses to your wishlist to save for later. You can find great courses in our catalog."
            }
          </p>
          <button className="mt-6 bg-purple-600 text-white px-6 py-3 rounded font-semibold hover:bg-purple-700 transition-colors">
            Browse Courses
          </button>
        </div>
      )}
    </div>
  );
}