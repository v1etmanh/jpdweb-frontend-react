import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import home1 from "../images/main-home.jpg";
import BlurFadeText from "../jpdweb/BlurFadeText";
import flashcard from "../images/flashcard.png";
import AIvoice from "../images/AIvoice.png";
import qiuz from "../images/qiuz.png";
import { Search, Heart } from "lucide-react";
import { courseApi } from "./api/courseApi";
import { showWarningNotification } from "./api/apiClient";

// Hàm lấy màu sắc theo ngôn ngữ - cập nhật với palette đa dạng hơn
const getLanguageColor = (language) => {
  const colors = {
    'English': { 
      primary: '#2563eb', 
      secondary: '#dbeafe', 
      accent: '#3b82f6',
      gradient: 'from-blue-500 to-blue-600'
    },
    'French': { 
      primary: '#dc2626', 
      secondary: '#fecaca', 
      accent: '#ef4444',
      gradient: 'from-red-500 to-red-600'
    },
    'Spanish': { 
      primary: '#059669', 
      secondary: '#a7f3d0', 
      accent: '#10b981',
      gradient: 'from-green-500 to-green-600'
    },
    'Japanese': { 
      primary: '#7c2d12', 
      secondary: '#fed7aa', 
      accent: '#ea580c',
      gradient: 'from-orange-700 to-orange-800'
    },
    'Italian': { 
      primary: '#4338ca', 
      secondary: '#c7d2fe', 
      accent: '#4f46e5',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    'German': { 
      primary: '#1f2937', 
      secondary: '#e5e7eb', 
      accent: '#4b5563',
      gradient: 'from-gray-700 to-gray-800'
    },
    'Russian': { 
      primary: '#7e22ce', 
      secondary: '#e9d5ff', 
      accent: '#a855f7',
      gradient: 'from-purple-600 to-purple-700'
    },
    'Chinese': { 
      primary: '#b91c1c', 
      secondary: '#fecaca', 
      accent: '#dc2626',
      gradient: 'from-red-600 to-red-700'
    },
    'Portuguese': { 
      primary: '#0f766e', 
      secondary: '#99f6e4', 
      accent: '#14b8a6',
      gradient: 'from-teal-500 to-teal-600'
    },
    'Vietnamese': { 
      primary: '#e11d48', 
      secondary: '#fecdd3', 
      accent: '#f43f5e',
      gradient: 'from-rose-600 to-rose-700'
    },
    'Korean': { 
      primary: '#1d4ed8', 
      secondary: '#dbeafe', 
      accent: '#2563eb',
      gradient: 'from-blue-600 to-blue-700'
    }
  };
  return colors[language] || { 
    primary: '#6b7280', 
    secondary: '#f3f4f6', 
    accent: '#9ca3af',
    gradient: 'from-gray-500 to-gray-600'
  };
};

// Component để hiển thị course card - ĐÃ CẬP NHẬT HOÀN TOÀN
const CourseCard = ({ course, type }) => {
  const [isHovered, setIsHovered] = useState(false);
  const formatNumber = (num) => {
    return num.toLocaleString("vi-VN");
  };
  const nav = useNavigate();
  
  const colors = getLanguageColor(course.language || 'English');

  // Hàm render rating sao
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={
            i <= Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
          }
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Ảnh mặc định nếu không có ảnh từ API
  const courseImage = course.image || 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div 
      className="relative h-80 rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
        style={{ 
          backgroundImage: `url(${courseImage})`,
          transform: isHovered ? 'scale(1.1)' : 'scale(1)'
        }}
      ></div>
      
      {/* Overlay gradient từ trong suốt đến đen ở dưới */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      
      {/* Nội dung chính (tên và giá) nằm ở dưới */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="font-bold text-lg mb-1 line-clamp-2">{course.name}</h3>
        <p className="font-semibold text-sm">{formatNumber(course.price || 0)}đ</p>
      </div>

      {/* Popup hiện khi hover */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm rounded-xl p-4 flex flex-col">
          {/* Top: Ảnh, tên, rating, số học sinh, giảng viên */}
          <div className="flex-1">
            <div 
              className="w-full h-32 bg-cover bg-center rounded-lg mb-3"
              style={{ backgroundImage: `url(${courseImage})` }}
            ></div>
            <h3 className="font-bold text-white text-lg mb-2 line-clamp-2">{course.name}</h3>
            
            <div className="flex items-center mb-2">
              <div className="flex text-sm mr-2">
                {renderStars(course.rating || 0)}
              </div>
              <span className="text-yellow-400 text-sm font-semibold">
                {course.rating || 0}
              </span>
            </div>
            
            <div className="flex items-center text-gray-300 text-sm mb-2">
              <span className="mr-3">👥 {formatNumber(course.numberStudent || 0)} học sinh</span>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">
              Giảng viên: <span className="font-medium text-white">{course.instructor}</span>
            </p>
          </div>

          {/* Bottom: Hai nút */}
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                nav(`/course/specific/${course.id}`);
              }}
              className="flex-1 bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg transition duration-300 hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <span>Xem chi tiết</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Thêm logic cho wishlist ở đây
                console.log('Add to wishlist:', course.id);
              }}
              className="flex items-center justify-center bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 hover:bg-red-700"
            >
              <Heart size={18} className="mr-1" />
              <span className="text-sm">Thích</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Component để hiển thị section khóa học - CẬP NHẬT
const CourseSection = ({ title, courses, type, icon }) => {
  const languageName = title.replace('Khóa học ', '');
  const colors = getLanguageColor(languageName);
  
  return (
    <div className="mb-12">
      <div className="text-center mb-6">
        <BlurFadeText>
          <div 
            className="font-special text-xl md:text-2xl font-bold mb-3 text-white py-3 px-8 rounded-2xl inline-block shadow-lg"
            style={{ backgroundColor: colors.primary }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">{icon}</span>
              <span>{title}</span>
            </div>
          </div>
        </BlurFadeText>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} type={type} />
        ))}
      </div>
    </div>
  );
};

export default function HomepageComponent() {
  const [courseData, setCourseData] = useState([]);
  const [courseInL, setCourseInL] = useState([]);
  const [name, setName] = useState("");
  const nav = useNavigate();
  
  useEffect(() => {
    fetchdata();
  }, []);
  
  const fetchdata = async () => {
    const response = await courseApi.getRecommendCourses();
    if (!response.success) {
      showWarningNotification(response.message);
      return;
    }
    const data = response.data;
    const grouped = data.reduce((acc, obj) => {
      const key = obj.language || "English";
      if (!acc[key]) acc[key] = [];
      acc[key].push(obj);
      return acc;
    }, {});

    setCourseData(data);
    setCourseInL(grouped);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        id="home-section"
        className="w-full p-20 mt-10 bg-cover bg-center bg-no-repeat relative min-h-[520px]"
        style={{ backgroundImage: `url(${home1})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="container mx-auto max-w-screen-xl px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
              <h1 className="text-left text-3xl md:text-5xl font-bold font-special text-white drop-shadow-lg">
                Welcome to Your JPD Learning Journey
              </h1>
              <p className="text-left text-lg text-white drop-shadow-md">
                Learn languages easily with our guided course structure and
                friendly materials.
              </p>
              <button
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-700"
                onClick={() => {}}
              >
                Start Learning
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="flex justify-center mt-10 px-4">
        <div className="flex items-center w-full max-w-3xl bg-white rounded-full shadow-lg border border-gray-300 overflow-hidden">
          <span className="px-3 text-gray-500">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tìm kiếm khóa học, mô tả hoặc giảng viên..."
            className="flex-grow px-1 py-3 text-base text-gray-700 focus:outline-none"
          />
          <button
            onClick={() => nav(`/course_result/${name}`)}
            className="px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold text-base hover:from-green-600 hover:to-blue-600 transition duration-300 shadow-md"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Language Slideshow Section */}
      <div className="pt-8 pb-0 overflow-hidden bg-white">
        <div className="text-center mb-8 pb-1">
          <h2 className="font-special text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Which language do you want to learn?
          </h2>
        </div>

        <div className="relative">
          <style>{`
            @keyframes scroll-left {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll {
              animation: scroll-left 30s linear infinite;
            }
          `}</style>

          <div className="language-track flex">
            <div className="flex animate-scroll">
              {['English', 'French', 'Spanish', 'Japanese', 'Italian', 'German', 'Russian', 'Chinese', 'Portuguese', 'Vietnamese', 'Korean'].map((language, index) => {
                const colors = getLanguageColor(language);
                return (
                  <div key={index} className="flex gap-6 px-3">
                    <div 
                      className="flex flex-col items-center justify-center w-28 h-28 rounded-2xl border-2 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                      style={{ 
                        backgroundColor: colors.secondary,
                        borderColor: colors.primary 
                      }}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <span className="text-4xl">{
                          language === 'English' ? '🇬🇧' :
                          language === 'French' ? '🇫🇷' :
                          language === 'Spanish' ? '🇪🇸' :
                          language === 'Japanese' ? '🇯🇵' :
                          language === 'Italian' ? '🇮🇹' :
                          language === 'German' ? '🇩🇪' :
                          language === 'Russian' ? '🇷🇺' :
                          language === 'Chinese' ? '🇨🇳' : 
                          language === 'Portuguese' ? '🇵🇹' :
                          language === 'Vietnamese' ? '🇻🇳' : '🇰🇷'
                        }</span>
                      </div>
                      <p className="font-semibold text-xs" style={{ color: colors.primary }}>
                        {language}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {/* Duplicate set for seamless loop */}
              {['English', 'French', 'Spanish', 'Japanese', 'Italian', 'German', 'Russian', 'Chinese', 'Portuguese', 'Vietnamese', 'Korean'].map((language, index) => {
                const colors = getLanguageColor(language);
                return (
                  <div key={`dup-${index}`} className="flex gap-6 px-3">
                    <div 
                      className="flex flex-col items-center justify-center w-28 h-28 rounded-2xl border-2 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                      style={{ 
                        backgroundColor: colors.secondary,
                        borderColor: colors.primary 
                      }}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <span className="text-4xl">{
                          language === 'English' ? '🇬🇧' :
                          language === 'French' ? '🇫🇷' :
                          language === 'Spanish' ? '🇪🇸' :
                          language === 'Japanese' ? '🇯🇵' :
                          language === 'Italian' ? '🇮🇹' :
                          language === 'German' ? '🇩🇪' :
                          language === 'Russian' ? '🇷🇺' :
                          language === 'Chinese' ? '🇨🇳' : 
                          language === 'Portuguese' ? '🇵🇹' :
                          language === 'Vietnamese' ? '🇻🇳' : '🇰🇷'
                        }</span>
                      </div>
                      <p className="font-semibold text-xs" style={{ color: colors.primary }}>
                        {language}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Courses Sections */}
      <div className="py-16 px-6 md:px-20 container mx-auto">
        {Object.entries(courseInL).map(([lang, courses]) => (
          <div key={lang}>
            <CourseSection
              title={`Khóa học ${lang}`}
              courses={courses}
              type="popular"
              icon="📚"
            />
          </div>
        ))}
      </div>

      {/* Features Section - giữ nguyên từ trước */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
        {/* ... giữ nguyên phần features ... */}
      </div>
    </div>
  );
}