import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import home1 from "../images/main-home.jpg";
import BlurFadeText from "../jpdweb/BlurFadeText";
import flashcard from "../images/flashcard.png";
import AIvoice from "../images/AIvoice.png";
import qiuz from "../images/qiuz.png";
import { Search } from "lucide-react";
import { courseApi } from "./api/courseApi";
import { showWarningNotification } from "./api/apiClient";

// Component để hiển thị course card
const CourseCard = ({ course, type }) => {
  const formatNumber = (num) => {
    return num.toLocaleString("vi-VN");
  };
  const nav = useNavigate();

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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="relative">
        <img
          src={course.img}
          alt={course.name}
          className="w-full h-48 object-cover"
        />
        {course.isNew && (
          <span className="absolute top-2 right-2 bg-[#e53935] text-white px-2 py-1 rounded-full text-xs font-bold">
            NEW
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-[#243864] mb-2 line-clamp-2">
          {course.name}
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          Giảng viên: {course.instructor}
        </p>

        <div className="flex items-center mb-2">
          <div className="flex mr-2">{renderStars(course.rating)}</div>
          <span className="text-[#1e88e5] font-semibold">{course.rating}</span>
        </div>

        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600 text-sm">
            👥 {formatNumber(course.numberStudent)} học viên
          </span>
          <span className="text-[#e53935] font-bold text-lg">
            {formatNumber(course.price)}đ
          </span>
        </div>

        <button
          onClick={() => {
            nav(`/course/specific/${course.id}`);
          }}
          className="w-full bg-[#D4B896] text-[#5D4E37] font-semibold py-2 px-4 rounded-lg hover:bg-[#C4A886] hover:text-[#FFFEF7] transition duration-300 shadow-md hover:shadow-lg"
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

// Component để hiển thị section khóa học
const CourseSection = ({ title, courses, type, icon }) => {
  return (
    <div className="mb-16">
      <div className="text-center mb-8">
        <BlurFadeText>
          <h2 className="font-special text-3xl md:text-4xl font-bold mb-4 text-[#243864] flex items-center justify-center gap-3">
            <span className="text-2xl">{icon}</span>
            {title}
          </h2>
        </BlurFadeText>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    setCourseData(data);
    setCourseInL(grouped);
  };
  return (
    <div className="bg-[#F5E6D3]">
      {/* Hero Section */}
      <section
        id="home-section"
        className="w-full p-20 mt-10 bg-cover bg-center bg-no-repeat relative min-h-[520px]"
        style={{ backgroundImage: `url(${home1})` }}
      >
        {/* Overlay để làm tối background và text nổi bật hơn */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="container mx-auto max-w-screen-xl px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* TEXT SECTION (LEFT) */}
            <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
              <h1 className="text-left text-3xl md:text-5xl font-bold font-special text-[#B8E0E6] drop-shadow-lg">
                Welcome to Your JPD Learning Journey
              </h1>
              <p className="text-left text-lg text-[#B8E0E6] drop-shadow-md">
                Learn languages easily with our guided course structure and
                friendly materials.
              </p>
              <button
                className="bg-[#D4B896] text-[#5D4E37] font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 hover:scale-105 hover:bg-[#C4A886] hover:text-[#FFFEF7]"
                onClick={() => {}}
              >
                Start Learning
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className="flex justify-center mt-10 px-4">
        <div className="flex items-center w-full max-w-3xl bg-white rounded-full shadow-lg border border-gray-300 overflow-hidden">
          {/* Icon search */}
          <span className="px-3 text-gray-500">
            <Search className="w-5 h-5" />
          </span>

          {/* Input */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tìm kiếm khóa học, mô tả hoặc giảng viên..."
            className="flex-grow px-1 py-3 text-base text-gray-700 focus:outline-none"
          />

          {/* Button */}
          <button
            onClick={() => nav(`/course_result/${name}`)}
            className="px-4 py-3 bg-[#D4B896] text-[#5D4E37] font-semibold text-base hover:bg-[#C4A886] hover:text-[#FFFEF7] transition duration-300 shadow-md hover:shadow-lg"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Language Slideshow Section */}
      <div className="pt-8 pb-0 overflow-hidden bg-[#F5E6D3]">
        <div className="text-center mb-8 pb-1">
          <h2 className="font-special text-3xl md:text-4xl font-bold text-[#5D4E37]">
            Which language do you want to learn?
          </h2>
        </div>

        <div className="relative">
          <style>{`
            @keyframes scroll-left {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .animate-scroll {
              animation: scroll-left 30s linear infinite;
            }
          `}</style>

          <div className="language-track flex">
            <div className="flex animate-scroll">
              {/* First set of languages */}
              <div className="flex gap-6 px-3">
                <div className="flex flex-col items-center justify-center w-40 h-40 bg-[#FFFEF7] rounded-2xl border-2 border-gray-200 hover:border-[#D4B896] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-[100px] inline-block leading-none">🇬🇧</span>
                  </div>
                  <p className="font-semibold text-lg text-gray-800">English</p>
                </div>

                <div className="flex flex-col items-center justify-center w-40 h-40 bg-[#FFFEF7] rounded-2xl border-2 border-gray-200 hover:border-[#D4B896] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-[100px] inline-block leading-none">🇫🇷</span>
                  </div>
                  <p className="font-semibold text-lg text-gray-800">French</p>
                </div>

                <div className="flex flex-col items-center justify-center w-40 h-40 bg-[#FFFEF7] rounded-2xl border-2 border-gray-200 hover:border-[#D4B896] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-[100px] inline-block leading-none">🇪🇸</span>
                  </div>
                  <p className="font-semibold text-lg text-gray-800">Spanish</p>
                </div>

                <div className="flex flex-col items-center justify-center w-40 h-40 bg-[#FFFEF7] rounded-2xl border-2 border-gray-200 hover:border-[#D4B896] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-[100px] inline-block leading-none">🇯🇵</span>
                  </div>
                  <p className="font-semibold text-lg text-gray-800">
                    Japanese
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center w-40 h-40 bg-[#FFFEF7] rounded-2xl border-2 border-gray-200 hover:border-[#D4B896] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-[100px] inline-block leading-none">🇮🇹</span>
                  </div>
                  <p className="font-semibold text-lg text-gray-800">Italian</p>
                </div>

                <div className="flex flex-col items-center justify-center w-40 h-40 bg-[#FFFEF7] rounded-2xl border-2 border-gray-200 hover:border-[#D4B896] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-[100px] inline-block leading-none">🇩🇪</span>
                  </div>
                  <p className="font-semibold text-lg text-gray-800">German</p>
                </div>

                <div className="flex flex-col items-center justify-center w-40 h-40 bg-[#FFFEF7] rounded-2xl border-2 border-gray-200 hover:border-[#D4B896] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-[100px] inline-block leading-none">🇷🇺</span>
                  </div>
                  <p className="font-semibold text-lg text-gray-800">Russian</p>
                </div>

                <div className="flex flex-col items-center justify-center w-40 h-40 bg-[#FFFEF7] rounded-2xl border-2 border-gray-200 hover:border-[#D4B896] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-[100px] inline-block leading-none">🇨🇳</span>
                  </div>
                  <p className="font-semibold text-lg text-gray-800">Chinese</p>
                </div>

                <div className="flex flex-col items-center justify-center w-40 h-40 bg-[#FFFEF7] rounded-2xl border-2 border-gray-200 hover:border-[#D4B896] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-[100px] inline-block leading-none">🇵🇹</span>
                  </div>
                  <p className="font-semibold text-lg text-gray-800">
                    Portuguese
                  </p>
                </div>
              </div>

              {/* Duplicate set for seamless loop */}
              <div className="flex gap-6 px-3">
                <div className="flex flex-col items-center justify-center w-40 h-40 bg-[#FFFEF7] rounded-2xl border-2 border-gray-200 hover:border-[#D4B896] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-[100px] inline-block leading-none">🇬🇧</span>
                  </div>
                  <p className="font-semibold text-lg text-gray-800">English</p>
                </div>

                <div className="flex flex-col items-center justify-center w-40 h-40 bg-[#FFFEF7] rounded-2xl border-2 border-gray-200 hover:border-[#D4B896] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-[100px] inline-block leading-none">🇫🇷</span>
                  </div>
                  <p className="font-semibold text-lg text-gray-800">French</p>
                </div>

                <div className="flex flex-col items-center justify-center w-40 h-40 bg-[#FFFEF7] rounded-2xl border-2 border-gray-200 hover:border-[#D4B896] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-[100px] inline-block leading-none">🇪🇸</span>
                  </div>
                  <p className="font-semibold text-lg text-gray-800">Spanish</p>
                </div>

                <div className="flex flex-col items-center justify-center w-40 h-40 bg-[#FFFEF7] rounded-2xl border-2 border-gray-200 hover:border-[#D4B896] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-[100px] inline-block leading-none">🇯🇵</span>
                  </div>
                  <p className="font-semibold text-lg text-gray-800">
                    Japanese
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center w-40 h-40 bg-[#FFFEF7] rounded-2xl border-2 border-gray-200 hover:border-[#D4B896] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-[100px] inline-block leading-none">🇮🇹</span>
                  </div>
                  <p className="font-semibold text-lg text-gray-800">Italian</p>
                </div>

                <div className="flex flex-col items-center justify-center w-40 h-40 bg-[#FFFEF7] rounded-2xl border-2 border-gray-200 hover:border-[#D4B896] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-[100px] inline-block leading-none">🇩🇪</span>
                  </div>
                  <p className="font-semibold text-lg text-gray-800">German</p>
                </div>

                <div className="flex flex-col items-center justify-center w-40 h-40 bg-[#FFFEF7] rounded-2xl border-2 border-gray-200 hover:border-[#D4B896] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-[100px] inline-block leading-none">🇷🇺</span>
                  </div>
                  <p className="font-semibold text-lg text-gray-800">Russian</p>
                </div>

                <div className="flex flex-col items-center justify-center w-40 h-40 bg-[#FFFEF7] rounded-2xl border-2 border-gray-200 hover:border-[#D4B896] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-[100px] inline-block leading-none">🇨🇳</span>
                  </div>
                  <p className="font-semibold text-lg text-gray-800">Chinese</p>
                </div>

                <div className="flex flex-col items-center justify-center w-40 h-40 bg-[#FFFEF7] rounded-2xl border-2 border-gray-200 hover:border-[#D4B896] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-[100px] inline-block leading-none">🇵🇹</span>
                  </div>
                  <p className="font-semibold text-lg text-gray-800">
                    Portuguese
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Options Section */}
      <div className="py-16 px-6 md:px-20 container mx-auto">
        <div className="text-center mb-12">
          <BlurFadeText>
            <h1 className="font-special text-4xl md:text-5xl font-bold mb-6 text-[#5D4E37]">
              Don't know how to start learning Japanese?
            </h1>
          </BlurFadeText>

          <div className="flex flex-wrap justify-center gap-4 font-special">
            <button className="px-6 py-2 rounded-full bg-[#D4B896] text-[#5D4E37] font-medium hover:scale-105 transition shadow-md hover:shadow-lg hover:bg-[#C4A886] hover:text-[#FFFEF7]">
              Vocabulary?
            </button>
            <button className="px-6 py-2 rounded-full bg-[#D4B896] text-[#5D4E37] font-medium hover:scale-105 transition shadow-md hover:shadow-lg hover:bg-[#C4A886] hover:text-[#FFFEF7]">
              Speaking?
            </button>
            <button className="px-6 py-2 rounded-full bg-[#D4B896] text-[#5D4E37] font-medium hover:scale-105 transition shadow-md hover:shadow-lg hover:bg-[#C4A886] hover:text-[#FFFEF7]">
              Reading?
            </button>
          </div>
        </div>
      </div>

      {/* Courses Sections */}
      <div className="py-16 px-6 md:px-20 container mx-auto">
        {/* Khóa học có nhiều học viên */}
        {Object.entries(courseInL).map(([lang, courses]) => (
          <div key={lang}>
            <h2 className="text-2xl font-bold mb-4">{lang}</h2>
            <CourseSection
              title={`Khóa học ${lang}`}
              courses={courses}
              type="popular"
              icon="🔥"
            />
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-br from-[#F5E6D3] to-[#E8D5B5] py-16">
        <div className="text-center mb-12">
          <BlurFadeText>
            <h1 className="font-special text-4xl md:text-5xl font-bold mb-6 text-[#5D4E37]">
              Modern way to master Japanese with powerful features?
            </h1>
          </BlurFadeText>
          <p className="font-special text-xl md:text-xl mb-6 text-[#5D4E37]">
            Perfect for students, self-learners, and anyone aiming to improve
            their Japanese skills every day.
          </p>
        </div>

        <section className="mb-28 p-5">
          <div className="container mx-auto text-center">
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
              {/* Card 1 */}
              <div className="w-64 h-64 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center text-center p-6 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:bg-gradient-to-br hover:from-[#FFFEF7] hover:to-[#F5E6D3] border-2 border-[#D4B896]/30 hover:border-[#D4B896] hover:-rotate-2 cursor-pointer group">
                <img
                  src={flashcard}
                  alt="Smart Flashcards"
                  className="w-12 h-12 mb-4 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12"
                />
                <h3 className="font-special font-bold text-2xl text-[#5D4E37] mb-2 transition-colors duration-300 group-hover:text-[#C4A886]">
                  Smart Flashcards
                </h3>
                <p className="text-md font-special text-[#8B7355] transition-colors duration-300 group-hover:text-[#5D4E37]">
                  Learn and review vocabulary effortlessly
                </p>
              </div>

              {/* Card 2 */}
              <div className="w-64 h-64 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center text-center p-6 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:bg-gradient-to-br hover:from-[#FFFEF7] hover:to-[#F5E6D3] border-2 border-[#D4B896]/30 hover:border-[#D4B896] hover:rotate-2 cursor-pointer group">
                <img
                  src={AIvoice}
                  alt="AI Voice"
                  className="w-12 h-12 mb-4 transition-all duration-500 group-hover:scale-125 group-hover:-rotate-12"
                />
                <h3 className="font-special font-bold text-2xl text-[#5D4E37] mb-2 transition-colors duration-300 group-hover:text-[#C4A886]">
                  AI Voice Scoring
                </h3>
                <p className="text-md font-special text-[#8B7355] transition-colors duration-300 group-hover:text-[#5D4E37]">
                  Get instant feedback on your pronunciation
                </p>
              </div>

              {/* Card 3 */}
              <div className="w-64 h-64 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center text-center p-6 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:bg-gradient-to-br hover:from-[#FFFEF7] hover:to-[#F5E6D3] border-2 border-[#D4B896]/30 hover:border-[#D4B896] hover:-rotate-2 cursor-pointer group">
                <img
                  src={qiuz}
                  alt="Dictionary"
                  className="w-12 h-12 mb-4 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12"
                />
                <h3 className="font-special font-bold text-2xl text-[#5D4E37] mb-2 transition-colors duration-300 group-hover:text-[#C4A886]">
                  Flexible Dictionary
                </h3>
                <p className="text-md font-special text-[#8B7355] transition-colors duration-300 group-hover:text-[#5D4E37]">
                  Track your learning and stay on pace
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
