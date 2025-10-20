import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import home1 from '../images/home1.png';
import BlurFadeText from '../jpdweb/BlurFadeText';
import flashcard from '../images/flashcard.png';
import AIvoice from '../images/AIvoice.png'
import qiuz from '../images/qiuz.png'
import { Search } from "lucide-react";
import PolicyModal from './PolicyModal';
import PolicyModalDetail from './PolicyModalDetail';
import ReactDOM from "react-dom";



// Mock data cho các khóa học
const lCourses = [
    {
        id: 1,
        name: 'Japanese for Beginners',
        img: 'https://th.bing.com/th/id/OIP.FymLBD9dBOSq9f1EkTi-dgHaFF?w=251&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
        numberStudent: 15000,
        rating: 4.8,
        instructor: 'Takeshi Yamamoto',
        price: 299000
    },
    {
        id: 2,
        name: 'JLPT N5 Preparation',
        img: 'https://hvcgroup.edu.vn/uploads/details/2021/04/images/hoc-tieng-nhat-co-ban.jpg',
        numberStudent: 12500,
        rating: 4.7,
        instructor: 'Yuki Tanaka',
        price: 399000
    },
    {
        id: 3,
        name: 'Business Japanese Communication',
        img: 'https://tiengnhatvui.com/wp-content/uploads/2023/12/30-ngay-hoc-tieng-nhat-giao-tiep-22.jpg',
        numberStudent: 8900,
        rating: 4.9,
        instructor: 'Hiroshi Sato',
        price: 599000
    }
];

const rCourses = [
    {
        id: 4,
        name: 'Advanced Japanese Grammar',
        img: 'https://hvcgroup.edu.vn/uploads/details/2021/04/images/hoc-tieng-nhat-co-kho-khong.jpg',
        numberStudent: 3200,
        rating: 4.9,
        instructor: 'Kenji Nakamura',
        price: 799000
    },
    {
        id: 5,
        name: 'Japanese Conversation Mastery',
        img: 'https://dichthuattiengnhatban.com/wp-content/uploads/2024/04/App-hc-tieng-nhat-N3-1-300x300.jpg',
        numberStudent: 4500,
        rating: 4.8,
        instructor: 'Akiko Suzuki',
        price: 699000
    },
    {
        id: 6,
        name: 'Kanji Mastery Course',
        img: 'https://thuthuat.taimienphi.vn/cf/Images/dvv/2020/2/6/ung-dung-hoc-tieng-nhat-tot-nhat.jpg',
        numberStudent: 6200,
        rating: 4.8,
        instructor: 'Ryuji Watanabe',
        price: 549000
    }
];

const nCourses = [
    {
        id: 7,
        name: 'Japanese Culture & Language',
        img: 'https://ngoainguhanoi.com/wp-content/uploads/2018/05/hinh-anh-hoc-tieng-nhat-online2.jpg',
        numberStudent: 1200,
        rating: 4.6,
        instructor: 'Miyuki Ito',
        price: 449000,
        isNew: true
    },
    {
        id: 8,
        name: 'Anime Japanese Learning',
        img: 'https://cdt.caothang.edu.vn/images/images/H%C3%ACnh%20Nh%E1%BA%ADt%20Huy%20Khang/h%E1%BB%8Dc%20ti%C3%AAng%20Nh%E1%BA%ADt.jpg',
        numberStudent: 890,
        rating: 4.5,
        instructor: 'Daiki Yamada',
        price: 349000,
        isNew: true
    },
    {
        id: 9,
        name: 'Japanese Writing Skills',
        img: 'https://tse1.mm.bing.net/th/id/OIP.F-Jer9k_Wq5QF8Pv5Txk4QHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
        numberStudent: 650,
        rating: 4.4,
        instructor: 'Nanami Kato',
        price: 399000,
        isNew: true
    }
];

// Component để hiển thị course card
const CourseCard = ({ course, type }) => {
    const formatNumber = (num) => {
        return num.toLocaleString('vi-VN');
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                        <span key={i} className={i <= Math.floor(rating) ? "text-[#FFC107]" : "text-gray-200"}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:translate-y-[-4px] group">
            <div className="relative">
                <img src={course.img} alt={course.name} className="w-full h-48 object-cover" />
                {course.isNew && (
                    <span className="absolute top-3 right-3 bg-[#1e88e5] text-white px-2 py-1 rounded-md text-xs font-bold">
                        NEW
                    </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-[#1e88e5] transition-colors">{course.name}</h3>
                <p className="text-gray-600 text-sm mb-3">Giảng viên: {course.instructor}</p>
                
                <div className="flex items-center mb-3">
                    <div className="flex mr-2">
                        {renderStars(course.rating)}
                    </div>
                    <span className="text-[#1e88e5] font-semibold">{course.rating}</span>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600 text-sm flex items-center gap-1">
                        <span className="text-[#1e88e5]">👥</span> {formatNumber(course.numberStudent)} học viên
                    </span>
                    <span className="text-[#1e88e5] font-bold text-lg">
                        {formatNumber(course.price)}đ
                    </span>
                </div>

                <button className="w-full bg-[#1e88e5] text-white font-semibold py-2.5 px-4 rounded-md hover:bg-[#1976d2] transition duration-300 border border-[#1e88e5]">
                    Xem chi tiết
                </button>
            </div>
        </div>
    );
};

// Component để hiển thị section khóa học
const CourseSection = ({ title, courses, type, icon }) => {
    return (
        <div className="mb-20">
            <div className="flex flex-col items-center mb-10">
                <BlurFadeText>
                    <div className="inline-block px-4 py-1.5 rounded-full bg-[#1e88e5]/10 text-[#1e88e5] text-sm font-medium mb-3">
                        {type === 'popular' ? 'MOST POPULAR' : type === 'rating' ? 'HIGHEST RATED' : 'JUST LAUNCHED'}
                    </div>
                    <h2 className="font-special text-3xl md:text-4xl font-bold mb-3 flex items-center justify-center gap-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        <span className="text-2xl">{icon}</span>
                        {title}
                    </h2>
                </BlurFadeText>
                
                <div className="w-20 h-1 bg-[#1e88e5] rounded-full mt-2 mb-2"></div>
                
                <p className="text-gray-500 max-w-2xl text-center">
                    {type === 'popular' ? 'Các khóa học được nhiều học viên theo học và đánh giá tích cực nhất.' : 
                    type === 'rating' ? 'Những khóa học có điểm đánh giá và phản hồi tốt nhất từ học viên.' : 
                    'Khóa học mới được cập nhật với nội dung hiện đại và phương pháp giảng dạy tiên tiến.'}
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map(course => (
                    <CourseCard key={course.id} course={course} type={type} />
                ))}
            </div>
            
            <div className="flex justify-center mt-10">
                <button className="px-6 py-2.5 bg-white text-[#1e88e5] font-medium rounded-md border border-[#1e88e5] hover:bg-[#1e88e5]/5 transition">
                    Xem thêm khóa học {type === 'popular' ? 'phổ biến' : type === 'rating' ? 'đánh giá cao' : 'mới'}
                </button>
            </div>
        </div>
    );
};

export default function HomepageComponent() {
    const [largesCourses, setLargesCourses] = useState([])
    const [ratingCourses, setRatingCourses] = useState([])
    const [newCourses, setNewCourses] = useState([])
    const [name,setName]=useState("")
    const [showPolicyPopup, setShowPolicyPopup] = useState(false);
const [showDetail, setShowDetail] = useState(false);

   const nav=useNavigate()
    useEffect(() => {
        setLargesCourses(lCourses)
        setNewCourses(nCourses)
        setRatingCourses(rCourses)
setShowPolicyPopup(true); // luôn hiển thị modal

    }, [])

    return (
        <div className='bg-white'>
            {/* Hero Section */}
            <section id="home-section" className="w-full bg-gradient-to-r from-[#f5f9ff] to-[#e8f4fd] py-16 px-4 sm:py-20 sm:px-6 lg:px-8 mt-10">
                <div className="container mx-auto max-w-screen-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
                        {/* TEXT SECTION (LEFT) */}
                        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
                            <div className="inline-block px-3 py-1 rounded-full bg-[#1e88e5]/10 text-[#1e88e5] text-sm font-medium mb-2">
                                Học tiếng Nhật hiệu quả
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold font-special bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Welcome to Your JPD Learning Journey
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl">
                                Learn languages easily with our guided course structure and friendly materials.
                            </p>
                            <div className="flex flex-wrap gap-4 mt-2">
                                <button
                                    className="bg-[#1e88e5] text-white font-medium py-3 px-8 rounded-md transition duration-300 hover:bg-[#1976d2] border border-[#1e88e5]"
                                    onClick={() => {}}
                                >
                                    Start Learning
                                </button>
                                <button
                                    className="bg-white text-[#1e88e5] font-medium py-3 px-8 rounded-md transition duration-300 hover:bg-[#1e88e5]/5 border border-[#1e88e5]"
                                    onClick={() => {}}
                                >
                                    Browse Courses
                                </button>
                            </div>
                        </div>
                    
                        {/* IMAGE SECTION (RIGHT) */}
                        <div className="lg:col-span-6 flex justify-center">
                            <div className="relative">
                                <div className="absolute -inset-1 rounded-full bg-[#1e88e5]/10 blur-2xl opacity-70"></div>
                                <img src={home1} alt="LANDINGPAGE1" className="w-full max-w-md relative z-10" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
          <div className="flex justify-center -mt-8 px-4 relative z-20">
      <div className="flex items-center w-full max-w-3xl bg-white rounded-md border border-gray-200 overflow-hidden">
        {/* Icon search */}
        <span className="px-4 text-[#1e88e5]">
          <Search className="w-5 h-5" />
        </span>

        {/* Input */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tìm kiếm khóa học, mô tả hoặc giảng viên..."
          className="flex-grow px-4 py-3.5 text-base text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1e88e5]"
        />

        {/* Button */}
        <button
          onClick={() => nav(`/course_result/${name}`)}
          className="px-6 py-3.5 bg-[#1e88e5] text-white font-medium hover:bg-[#1976d2] transition duration-300 h-full"
        >
          Tìm kiếm
        </button>
      </div>
    </div>
            {/* Learning Options Section */}
            <div className="py-20 px-6 md:px-20 container mx-auto">
                <div className="text-center mb-12">
                    <BlurFadeText>
                        <div className="inline-block px-4 py-1.5 rounded-full bg-[#1e88e5]/10 text-[#1e88e5] text-sm font-medium mb-4">
                            BEGIN YOUR JOURNEY
                        </div>
                        <h2 className="font-special text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Don't know how to start learning Japanese?
                        </h2>
                    </BlurFadeText>

                    <div className="flex flex-wrap justify-center gap-4 font-special mt-8">
                        <button className="px-8 py-2.5 rounded-md bg-white text-[#1e88e5] font-medium hover:bg-[#1e88e5]/5 transition border border-[#1e88e5] flex items-center gap-2">
                            <span className="text-lg">🔤</span> Vocabulary
                        </button>
                        <button className="px-8 py-2.5 rounded-md bg-white text-[#1e88e5] font-medium hover:bg-[#1e88e5]/5 transition border border-[#1e88e5] flex items-center gap-2">
                            <span className="text-lg">🗣️</span> Speaking
                        </button>
                        <button className="px-8 py-2.5 rounded-md bg-white text-[#1e88e5] font-medium hover:bg-[#1e88e5]/5 transition border border-[#1e88e5] flex items-center gap-2">
                            <span className="text-lg">📖</span> Reading
                        </button>
                        <button className="px-8 py-2.5 rounded-md bg-[#1e88e5] text-white font-medium hover:bg-[#1976d2] transition border border-[#1e88e5] flex items-center gap-2">
                            <span className="text-lg">✨</span> All Skills
                        </button>
                    </div>
                </div>
            </div>

            {/* Courses Sections */}
            <div className="py-16 px-6 md:px-20 container mx-auto">
                {/* Khóa học có nhiều học viên */}
                <CourseSection 
                    title="Khóa học được yêu thích nhất" 
                    courses={largesCourses} 
                    type="popular"
                    icon="🔥"
                />

                {/* Khóa học đánh giá cao */}
                <CourseSection 
                    title="Khóa học đánh giá cao nhất" 
                    courses={ratingCourses} 
                    type="rating"
                    icon="⭐"
                />

                {/* Khóa học mới */}
                <CourseSection 
                    title="Khóa học mới nhất" 
                    courses={newCourses} 
                    type="new"
                    icon="🆕"
                />
            </div>

            {/* Features Section */}
            <div className="bg-gradient-to-r from-[#f5f9ff] to-[#e8f4fd] py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <BlurFadeText>
                            <div className="inline-block px-4 py-1.5 rounded-full bg-[#1e88e5]/10 text-[#1e88e5] text-sm font-medium mb-3">
                                POWERFUL LEARNING TOOLS
                            </div>
                            <h2 className="font-special text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Modern way to master Japanese with powerful features
                            </h2>
                        </BlurFadeText>
                        <div className="w-20 h-1 bg-[#1e88e5] rounded-full mx-auto mt-4 mb-6"></div>
                        <p className="font-special text-lg max-w-3xl mx-auto text-gray-600">
                            Perfect for students, self-learners, and anyone aiming to improve their Japanese skills every day.
                        </p>
                    </div>

                    <section className="mb-16">
                        <div className="container mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Card 1 */}
                                <div className="bg-white rounded-lg border border-[#1e88e5]/20 flex flex-col items-center text-center p-8 transition-transform hover:-translate-y-2">
                                    <div className="w-16 h-16 flex items-center justify-center bg-[#1e88e5]/10 rounded-full mb-6">
                                        <img src={flashcard} alt="Smart Flashcards" className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-special font-bold text-xl text-gray-800 mb-3">Smart Flashcards</h3>
                                    <p className="text-gray-600 mb-4">
                                        Learn and review vocabulary effortlessly with our intelligent spaced repetition system
                                    </p>
                                    <a href="#" className="text-[#1e88e5] font-medium hover:underline mt-auto inline-flex items-center">
                                        Explore feature <span className="ml-1">→</span>
                                    </a>
                                </div>

                                {/* Card 2 */}
                                <div className="bg-white rounded-lg border border-[#1e88e5]/20 flex flex-col items-center text-center p-8 transition-transform hover:-translate-y-2">
                                    <div className="w-16 h-16 flex items-center justify-center bg-[#1e88e5]/10 rounded-full mb-6">
                                        <img src={AIvoice} alt="AI Voice" className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-special font-bold text-xl text-gray-800 mb-3">AI Voice Scoring</h3>
                                    <p className="text-gray-600 mb-4">
                                        Get instant feedback on your pronunciation and speaking skills with advanced AI technology
                                    </p>
                                    <a href="#" className="text-[#1e88e5] font-medium hover:underline mt-auto inline-flex items-center">
                                        Try it out <span className="ml-1">→</span>
                                    </a>
                                </div>

                                {/* Card 3 */}
                                <div className="bg-white rounded-lg border border-[#1e88e5]/20 flex flex-col items-center text-center p-8 transition-transform hover:-translate-y-2">
                                    <div className="w-16 h-16 flex items-center justify-center bg-[#1e88e5]/10 rounded-full mb-6">
                                        <img src={qiuz} alt="Dictionary" className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-special font-bold text-xl text-gray-800 mb-3">Flexible Dictionary</h3>
                                    <p className="text-gray-600 mb-4">
                                        Access comprehensive Japanese-English dictionary with examples, kanji info, and audio
                                    </p>
                                    <a href="#" className="text-[#1e88e5] font-medium hover:underline mt-auto inline-flex items-center">
                                        Learn more <span className="ml-1">→</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    <div className="text-center mt-12">
                        <button className="px-8 py-3 bg-[#1e88e5] text-white font-medium rounded-md hover:bg-[#1976d2] transition">
                            Explore all features
                        </button>
                    </div>
                </div>
            </div>
 
{showPolicyPopup && (
  <PolicyModal
  onAccept={() => setShowPolicyPopup(false)}
  onDecline={() => setShowPolicyPopup(false)}
  onOpenDetail={() => { 
    setShowPolicyPopup(false); // tắt modal nhỏ
    setShowDetail(true);       // mở modal chi tiết
  }}
/>

)}

{showDetail && (
  <PolicyModalDetail
    isOpen={showDetail}
    onClose={() => setShowDetail(false)}
  />
)}


        </div>
    );
}
