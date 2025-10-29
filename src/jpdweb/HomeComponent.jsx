import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import home1 from "../images/bird.png";
import BlurFadeText from "../jpdweb/BlurFadeText";
import flashcard from "../images/flashcard.png";
import AIvoice from "../images/AIvoice.png";
import qiuz from "../images/qiuz.png";
import { Search } from "lucide-react";
import { courseApi } from "./api/courseApi";
import { showWarningNotification } from "./api/apiClient";

//addToWishlist,enrollCourse
//createOrder
//getCourseDetail
import { customerApi } from "./api/customerApi";
import { paymentApi } from "./api/paymentApi";

// Component để hiển thị course card
const CourseCard = ({ course, type }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [hoverTimer, setHoverTimer] = useState(null);

  const formatNumber = (num) => {
    return num.toLocaleString("vi-VN");
  };
  const nav = useNavigate();

  const handleMouseEnter = () => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 800); // 2 seconds delay
    setHoverTimer(timer);
  };

  const handleMouseLeave = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
    setShowPopup(false);
  };

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

  return (
    <div
      className="bg-white rounded-2xl shadow-xl overflow-visible border-4 border-transparent group relative w-[400px] h-[450px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Popup with detailed information */}
      {showPopup && (
        <div className="absolute top-0 left-0 w-full h-full z-50 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-white rounded-2xl shadow-2xl border-4 border-[#F97316] p-4 pointer-events-auto animate-fade-in-only overflow-hidden">
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPopup(false);
              }}
              className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors z-10 text-xs"
            >
              ✕
            </button>

            {/* Popup content with scroll */}
            <div className="h-full overflow-hidden pr-2 space-y-1.5 flex flex-col">
              {/* Course image */}
              <div className="relative overflow-hidden rounded-xl flex-shrink-0">
                <img
                  src={course.img}
                  alt={course.name}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-1.5 left-2 right-2">
                  <h3 className="font-bold text-[17px] text-white drop-shadow-lg line-clamp-1">
                    {course.name}
                  </h3>
                </div>
              </div>

              {/* Instructor info */}
              <div className="bg-gradient-to-r from-[#06B6D4]/10 to-[#F97316]/10 p-2 rounded-lg">
                <p className="flex items-center gap-1.5 text-[15px] text-gray-500 font-semibold mb-1">
                  <svg
                    className="w-3.5 h-3.5 text-[#06B6D4] flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  Giảng viên
                </p>
                <p className="text-[12px] font-bold text-gray-800">
                  {course.instructor}
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-1.5 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-1">
                    <span className="text-xs">⭐</span>
                    <p className="text-[12px] text-gray-600 font-semibold">
                      Đánh giá
                    </p>
                  </div>
                  <p className="text-base font-black text-[#F97316]">
                    {course.rating}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-1.5 rounded-lg border border-cyan-200">
                  <div className="flex items-center gap-1">
                    <span className="text-xs">👥</span>
                    <p className="text-[12px] text-gray-600 font-semibold">
                      Học viên
                    </p>
                  </div>
                  <p className="text-base font-black text-[#06B6D4]">
                    {formatNumber(course.numberStudent)}
                  </p>
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <div>
                  <p className="text-[10px] text-gray-500 mb-0.5">
                    Giá khóa học
                  </p>
                  {course.price === 0 ? (
                    <p className="text-lg font-black text-green-600">
                      Miễn phí
                    </p>
                  ) : (
                    <p className="text-lg font-black text-[#F97316]">
                      {formatNumber(course.price)}₫
                    </p>
                  )}
                </div>
                <div className="flex gap-1.5">
                  {/* Favorite button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add favorite logic here
                    }}
                    className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold px-3 py-2 rounded-lg hover:from-pink-600 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-1.5"
                    title="Add to wishlist"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                    <span className="text-[10px] whitespace-nowrap">
                      Add to wishlist
                    </span>
                  </button>

                  {/* Detail button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nav(`/course/specific/${course.id}`);
                    }}
                    className="bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white font-bold py-2 px-3 rounded-lg hover:from-[#F97316] hover:to-[#EA580C] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-1"
                  >
                    <span className="text-xs">Chi tiết</span>
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#F97316]/20 to-transparent rounded-full -mr-8 -mt-8"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#06B6D4]/20 to-transparent rounded-full -ml-8 -mb-8"></div>
          </div>
        </div>
      )}

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-17 h-17 bg-gradient-to-bl from-[#F97316] to-transparent opacity-20 group-hover:opacity-40 transition-opacity"></div>

      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={course.img}
          alt={course.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-450 ease-out"
        />
        {/* Gradient overlay - always visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent"></div>

        {/* Course name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-lg text-white drop-shadow-lg line-clamp-2 leading-tight">
            {course.name}
          </h3>
        </div>

        {course.isNew && (
          <span className="absolute top-2.5 right-2.5 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
            ✨ NEW
          </span>
        )}

        {/* Quick preview button */}
        <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-[#06B6D4] rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-xl">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
          </svg>
        </button>
      </div>

      <div className="p-5 bg-gradient-to-br from-white to-slate-50">
        <div className="flex justify-between items-center mb-3 mt-[-20px] pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow-md">
              <span className="mr-0.5">⭐</span>
              {course.rating}
            </div>
            <div className="flex text-yellow-400 text-sm">
              {renderStars(course.rating)}
            </div>
          </div>

          <div className="relative">
            {course.price === 0 ? (
              <span className="bg-green-500 text-white font-bold text-base px-3 py-1 rounded-lg">
                Miễn phí
              </span>
            ) : (
              <span className="bg-orange-500 text-white font-bold text-lg px-3 py-1 rounded-lg">
                {formatNumber(course.price)}₫
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            nav(`/course/specific/${course.id}`);
          }}
          className="w-full bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white font-bold py-2.5 px-5 rounded-xl hover:from-[#F97316] hover:to-[#EA580C] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-1.5 text-sm"
        >
          <span>Khám phá ngay</span>
          <svg
            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>

      {/* Animated corner accent */}
      <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[40px] border-l-transparent border-b-[40px] border-b-[#06B6D4] opacity-20 group-hover:opacity-40 transition-opacity"></div>
    </div>
  );
};

// Component để hiển thị section khóa học

const CourseSection = ({ title, courses, type, icon }) => {
  return (
    <div className="mb-17 relative">
      {/* Decorative background elements */}
      <div className="absolute -top-8 -right-8 w-34 h-34 bg-gradient-to-br from-[#06B6D4]/20 to-[#F97316]/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-8 -left-8 w-51 h-51 bg-gradient-to-tr from-[#F97316]/10 to-[#06B6D4]/10 rounded-full blur-3xl"></div>

      <div className="text-center mb-10 relative">
        <BlurFadeText>
          <div className="inline-block relative">
            <h2 className="font-special text-3xl md:text-4xl font-black mb-3 bg-gradient-to-r from-[#06B6D4] via-[#0891B2] to-[#F97316] bg-clip-text text-transparent flex items-center justify-center gap-3">
              <span className="text-4xl animate-bounce">{icon}</span>
              {title}
            </h2>
            {/* Underline decoration */}
            <div className="h-1.5 bg-gradient-to-r from-transparent via-[#F97316] to-transparent rounded-full mt-1.5"></div>
          </div>
        </BlurFadeText>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <div
            key={course.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CourseCard course={course} type={type} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function HomepageComponent() {
  const [courseInL, setCourseInL] = useState([]);
  const [name, setName] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    const response = await courseApi.getRecommendCourses();
    //   const data = response.data;

    // Nhóm dữ liệu theo 'language'
    if (!response.success) {
      showWarningNotification(response.message);
      return;
    }
    const data = response.data;
    const grouped = data.reduce((acc, obj) => {
      const key = obj.language || "Unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push(obj);
      return acc;
    }, {});

    // Cập nhật state
    setCourseInL(grouped);
  };

  const scrollToCourses = () => {
    const coursesSection = document.getElementById("courses-section");

    if (coursesSection) {
      const targetPosition = coursesSection.offsetTop - 100;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 1000; // 1 giây
      let start = null;

      // Hàm easing để tạo hiệu ứng mượt
      const easeInOutCubic = (t) => {
        return t < 0.5
          ? 4 * t * t * t
          : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };

      const animation = (currentTime) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-cyan-50 min-h-screen" style={{ marginTop: '-90px' }}>
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInOnly {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in-only {
          animation: fadeInOnly 0.5s ease-out forwards;
        }
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll-left 30s linear infinite;
        }
      `}</style>

      {/* Hero Section with Dynamic Parallax Effect */}
      <section
        id="home-section"
        className="relative w-full pt-32 pb-20 px-17 bg-cover bg-center bg-no-repeat min-h-[calc(100vh-400px)] overflow-hidden -mt-0"
        style={{ backgroundImage: `url(${home1})` }}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4]/80 via-[#0891B2]/70 to-[#F97316]/60 animate-gradient"></div>

        {/* Floating geometric shapes */}
        <div
          className="absolute top-17 right-17 w-27 h-27 bg-white/10 backdrop-blur-sm rounded-full"
          style={{ animation: "float 6s ease-in-out infinite" }}
        ></div>
        <div
          className="absolute bottom-34 left-8 w-20 h-20 bg-[#F97316]/20 backdrop-blur-sm rotate-45"
          style={{ animation: "float 8s ease-in-out infinite 1s" }}
        ></div>
        <div
          className="absolute top-34 left-1/3 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full"
          style={{ animation: "float 7s ease-in-out infinite 2s" }}
        ></div>

        <div className="container mx-auto max-w-screen-xl px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-7">
            {/* TEXT SECTION */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left gap-7">
              <div className="space-y-2 animate-fade-in-up mb-[50px]">
                <div className="inline-block py-2">
                  <span className="bg-white/20 backdrop-blur-md text-white px-5 py-1.5 rounded-full text-xs font-bold border border-white/30 shadow-lg">
                    🚀 Nền tảng học ngôn ngữ #1
                  </span>
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-2xl leading-tight">
                  Welcome to Your
                  <span className="block mt-1.5 bg-gradient-to-r from-[#F97316] via-white to-[#F97316] bg-clip-text text-transparent">
                    JPD Learning Journey
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-white/95 drop-shadow-lg max-w-2xl leading-relaxed">
                  Học ngôn ngữ dễ dàng với cấu trúc khóa học được hướng dẫn và
                  tài liệu thân thiện.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <button
                    onClick={scrollToCourses}
                    className="group relative bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-bold py-3 px-7 rounded-full shadow-2xl transition duration-300 hover:scale-110 hover:shadow-[#F97316]/50 overflow-hidden text-base"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Bắt đầu học ngay
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative 3D Card */}
          </div>
        </div>
      </section>
      {/* Modern Search Bar with Glass Effect */}
      <div className="flex justify-center -mt-7 px-4 relative z-20">
        <div className="w-full max-w-4xl bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border-4 border-white/50 p-1.5 hover:shadow-[#06B6D4]/30 transition-shadow duration-300">
          <div className="flex items-center gap-2.5">
            <div className="pl-3 text-[#06B6D4]">
              <Search className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tìm kiếm khóa học, mô tả hoặc giảng viên..."
              className="flex-grow px-1.5 py-0 text-base text-gray-700 bg-transparent focus:outline-none placeholder-gray-400"
            />

            <button
              onClick={() => nav(`/course_result/${name}`)}
              className="bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-bold px-2.5 py-2.5 rounded-xl hover:from-[#EA580C] hover:to-[#F97316] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-1.5 text-sm"
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

      {/* Dynamic Language Carousel */}
      <div className="pt-14 pb-10 overflow-hidden relative">
        <div className="text-center mb-10">
          <h2 className="font-special text-3xl md:text-4xl font-black mb-3 bg-gradient-to-r from-[#06B6D4] to-[#F97316] bg-clip-text text-transparent">
            Ngôn ngữ nào bạn muốn học?
          </h2>
          <p className="text-gray-600 text-base">
            Chọn từ hơn 10+ ngôn ngữ phổ biến
          </p>
        </div>

        <div className="relative">
          <div className="language-track flex">
            <div className="flex animate-scroll gap-8 px-4">
              {/* First set of languages */}
              <div className="flex gap-8">
                {[
                  {
                    flag: "🇬🇧",
                    name: "English",
                    color: "from-blue-500 to-indigo-600",
                  },
                  {
                    flag: "🇫🇷",
                    name: "French",
                    color: "from-indigo-500 to-purple-600",
                  },
                  {
                    flag: "🇪🇸",
                    name: "Spanish",
                    color: "from-yellow-500 to-orange-600",
                  },
                  {
                    flag: "🇯🇵",
                    name: "Japanese",
                    color: "from-red-500 to-pink-600",
                  },
                  {
                    flag: "🇮🇹",
                    name: "Italian",
                    color: "from-green-500 to-emerald-600",
                  },
                  {
                    flag: "🇩🇪",
                    name: "German",
                    color: "from-gray-700 to-gray-900",
                  },
                  {
                    flag: "🇷🇺",
                    name: "Russian",
                    color: "from-blue-600 to-indigo-700",
                  },
                  {
                    flag: "🇨🇳",
                    name: "Chinese",
                    color: "from-red-600 to-yellow-600",
                  },
                  {
                    flag: "🇵🇹",
                    name: "Portuguese",
                    color: "from-green-600 to-teal-600",
                  },
                ].map((lang, idx) => (
                  <div key={idx} className="group relative flex-shrink-0">
                    <div
                      className={`w-40 h-36 bg-gradient-to-br ${lang.color} rounded-3xl shadow-2xl hover:shadow-[#F97316]/50 transition-all duration-500 cursor-pointer transform hover:scale-105 overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all"></div>
                      <div className="relative h-full flex flex-col items-center justify-center p-3 text-white">
                        <div className="text-5xl mb-2 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                          {lang.flag}
                        </div>
                        <p className="font-bold text-base tracking-wide">
                          {lang.name}
                        </p>
                        <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full">
                            Khám phá →
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10"></div>
                  </div>
                ))}
              </div>

              {/* Duplicate set for seamless loop */}
              <div className="flex gap-8">
                {[
                  {
                    flag: "🇬🇧",
                    name: "English",
                    color: "from-blue-500 to-indigo-600",
                  },
                  {
                    flag: "🇫🇷",
                    name: "French",
                    color: "from-indigo-500 to-purple-600",
                  },
                  {
                    flag: "🇪🇸",
                    name: "Spanish",
                    color: "from-yellow-500 to-orange-600",
                  },
                  {
                    flag: "🇯🇵",
                    name: "Japanese",
                    color: "from-red-500 to-pink-600",
                  },
                  {
                    flag: "🇮🇹",
                    name: "Italian",
                    color: "from-green-500 to-emerald-600",
                  },
                  {
                    flag: "🇩🇪",
                    name: "German",
                    color: "from-gray-700 to-gray-900",
                  },
                  {
                    flag: "🇷🇺",
                    name: "Russian",
                    color: "from-blue-600 to-indigo-700",
                  },
                  {
                    flag: "🇨🇳",
                    name: "Chinese",
                    color: "from-red-600 to-yellow-600",
                  },
                  {
                    flag: "🇵🇹",
                    name: "Portuguese",
                    color: "from-green-600 to-teal-600",
                  },
                ].map((lang, idx) => (
                  <div
                    key={`dup-${idx}`}
                    className="group relative flex-shrink-0"
                  >
                    <div
                      className={`w-40 h-36 bg-gradient-to-br ${lang.color} rounded-3xl shadow-2xl hover:shadow-[#F97316]/50 transition-all duration-500 cursor-pointer transform hover:scale-105 overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all"></div>
                      <div className="relative h-full flex flex-col items-center justify-center p-3 text-white">
                        <div className="text-5xl mb-2 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                          {lang.flag}
                        </div>
                        <p className="font-bold text-base tracking-wide">
                          {lang.name}
                        </p>
                        <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full">
                            Khám phá →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Learning Options */}
      <div className="py-17 px-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/4 w-82 h-82 bg-gradient-to-br from-[#06B6D4]/10 to-[#F97316]/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <BlurFadeText>
              <h1 className="font-special text-3xl md:text-5xl font-black mb-6 mt-8 py-2 bg-gradient-to-r from-[#06B6D4] to-[#F97316] bg-clip-text text-transparent">
                Không biết bắt đầu từ đâu?
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Khám phá các phương pháp học hiệu quả nhất dành cho bạn
              </p>
            </BlurFadeText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto py-10">
            {[
              {
                icon: "📚",
                title: "Từ vựng",
                desc: "Ghi nhớ nhanh với flashcard thông minh",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: "🗣️",
                title: "Giao tiếp",
                desc: "Luyện nói với AI phát âm chuẩn",
                color: "from-cyan-500 to-teal-500",
              },
              {
                icon: "📖",
                title: "Đọc hiểu",
                desc: "Nâng cao khả năng đọc hiểu bài văn",
                color: "from-teal-500 to-green-500",
              },
            ].map((item, idx) => (
              <div key={idx} className="group relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}
                ></div>
                <div className="relative bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-[#F97316]">
                  <div className="text-5xl mb-3 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#06B6D4] mb-2 group-hover:text-[#F97316] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm">{item.desc}</p>
                  <button className="w-full bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white font-semibold py-2.5 rounded-xl hover:from-[#F97316] hover:to-[#EA580C] transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                    <span>Bắt đầu ngay</span>
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Sections */}
      <div
        id="courses-section"
        className="py-14 px-6 md:px-17 container mx-auto"
      >
        {/* Khóa học có nhiều học viên */}
        {Object.entries(courseInL).map(([lang, courses]) => (
          <div key={lang}>
            <h2 className="text-xl font-bold mb-3">{lang}</h2>
            <CourseSection
              title={`Khóa học ${lang}`}
              courses={courses}
              type="popular"
            />
          </div>
        ))}
      </div>

      {/* Features Section with Bento Grid Layout */}
      <div className="bg-gradient-to-br from-slate-100 via-cyan-50 to-orange-50 py-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-17 right-17 w-61 h-61 bg-[#06B6D4]/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-17 left-17 w-82 h-82 bg-[#F97316]/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <BlurFadeText>
              <h1 className="font-special text-4xl md:text-5xl font-black mb-6 py-2 bg-gradient-to-r from-[#06B6D4] via-[#0891B2] to-[#F97316] bg-clip-text text-transparent">
                Tính năng vượt trội
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Phương pháp học hiện đại kết hợp công nghệ AI tiên tiến, giúp
                bạn tiến bộ mỗi ngày
              </p>
            </BlurFadeText>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto">
            {/* Feature 1 - Large Card */}
            <div className="md:col-span-2 md:row-span-2 group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative h-full bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-3xl p-8 shadow-2xl hover:shadow-[#06B6D4]/50 transition-all duration-500 transform hover:scale-[1.02] cursor-pointer overflow-hidden">
                <div className="absolute top-0 right-0 w-54 h-54 bg-white/10 rounded-full -mr-27 -mt-27"></div>
                <div className="relative z-10">
                  <img
                    src={flashcard}
                    alt="Smart Flashcards"
                    className="w-20 h-20 mb-5 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 drop-shadow-2xl"
                  />
                  <h3 className="font-special font-black text-3xl text-white mb-3">
                    Smart Flashcards
                  </h3>
                  <p className="text-lg text-white/90 mb-5 leading-relaxed">
                    Hệ thống flashcard thông minh với thuật toán lặp lại ngắt
                    quãng (Spaced Repetition). Ghi nhớ từ vựng hiệu quả gấp 10
                    lần!
                  </p>
                  <div className="flex gap-2.5 flex-wrap">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-full text-xs font-semibold">
                      ✨ AI-Powered
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-full text-xs font-semibold">
                      🎯 Hiệu quả cao
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-full text-xs font-semibold">
                      ⚡ Nhanh chóng
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - Medium Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative h-full bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-6 shadow-2xl hover:shadow-[#F97316]/50 transition-all duration-500 transform hover:scale-[1.02] cursor-pointer overflow-hidden">
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-20"></div>
                <div className="relative z-10">
                  <img
                    src={AIvoice}
                    alt="AI Voice"
                    className="w-14 h-14 mb-3 transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 drop-shadow-2xl"
                  />
                  <h3 className="font-special font-black text-xl text-white mb-2.5">
                    AI Voice Scoring
                  </h3>
                  <p className="text-white/90 leading-relaxed text-sm">
                    Chấm điểm phát âm tức thì với công nghệ AI
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 - Medium Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 transform hover:scale-[1.02] cursor-pointer overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                <div className="relative z-10">
                  <img
                    src={qiuz}
                    alt="Dictionary"
                    className="w-14 h-14 mb-3 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 drop-shadow-2xl"
                  />
                  <h3 className="font-special font-black text-xl text-white mb-2.5">
                    Từ điển thông minh
                  </h3>
                  <p className="text-white/90 leading-relaxed text-sm">
                    Tra cứu nhanh với ví dụ thực tế và phát âm chuẩn
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features Pills */}
          <div className="mt-16 flex flex-wrap justify-center gap-3">
            {[
              "🏆 Gamification",
              "📊 Thống kê tiến độ",
              "👥 Học cùng bạn bè",
              "🎮 Mini games",
              "🔔 Nhắc nhở thông minh",
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-[#06B6D4]"
              >
                <span className="font-semibold text-gray-700 text-sm">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
