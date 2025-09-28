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
                <span key={i} className={i <= Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="relative">
                <img src={course.img} alt={course.name} className="w-full h-48 object-cover" />
                {course.isNew && (
                    <span className="absolute top-2 right-2 bg-[#e53935] text-white px-2 py-1 rounded-full text-xs font-bold">
                        NEW
                    </span>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-bold text-lg text-[#243864] mb-2 line-clamp-2">{course.name}</h3>
                <p className="text-gray-600 text-sm mb-2">Giảng viên: {course.instructor}</p>
                
                <div className="flex items-center mb-2">
                    <div className="flex mr-2">
                        {renderStars(course.rating)}
                    </div>
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

                <button className="w-full bg-[#243864] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#1e88e5] transition duration-300">
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
                {courses.map(course => (
                    <CourseCard key={course.id} course={course} type={type} />
                ))}
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
            <section id="home-section" className="w-full bg-gradient-to-br from-[#F6FAFF] to-[#E8F4FD] p-20 mt-10">
                <div className="container mx-auto max-w-screen-xl px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                        {/* TEXT SECTION (LEFT) */}
                        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
                            <h1 className="text-left text-3xl md:text-5xl font-bold font-special text-[#243864]">
                                Welcome to Your JPD Learning Journey
                            </h1>
                            <p className="text-left text-lg text-gray-700">
                                Learn languages easily with our guided course structure and friendly materials.
                            </p>
                            <button
                                className="bg-[#1e88e5] text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 hover:scale-105 hover:bg-[#243864]"
                                onClick={() => {}}
                            >
                                Start Learning
                            </button>
                        </div>
                    

                        {/* IMAGE SECTION (RIGHT) */}
                        <div className="lg:col-span-6 flex justify-center">
                            <img src={home1} alt="LANDINGPAGE1" className="w-full max-w-md" />
                        </div>
                    </div>
                </div>
            </section>
          <div className="flex justify-center mt-10 px-4">
      <div className="flex items-center w-full max-w-3xl bg-white rounded-full shadow-lg border border-gray-300 overflow-hidden">
        {/* Icon search */}
        <span className="px-4 text-gray-500">
          <Search className="w-6 h-6" />
        </span>

        {/* Input */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tìm kiếm khóa học, mô tả hoặc giảng viên..."
          className="flex-grow px-4 py-4 text-lg text-gray-700 focus:outline-none"
        />

        {/* Button */}
        <button
          onClick={() => nav(`/course_result/${name}`)}
          className="px-6 py-4 bg-[#1e88e5] text-white font-semibold text-lg hover:bg-[#243864] transition duration-300"
        >
          Tìm kiếm
        </button>
      </div>
    </div>
            {/* Learning Options Section */}
            <div className="py-16 px-6 md:px-20 container mx-auto">
                <div className="text-center mb-12">
                    <BlurFadeText>
                        <h1 className="font-special text-4xl md:text-5xl font-bold mb-6 text-[#243864]">
                            Don't know how to start learning Japanese?
                        </h1>
                    </BlurFadeText>

                    <div className="flex flex-wrap justify-center gap-4 font-special">
                        <button className="px-6 py-2 rounded-full bg-[#1e88e5] text-white font-medium hover:scale-105 transition shadow-lg hover:bg-[#243864]">
                            Vocabulary?
                        </button>
                        <button className="px-6 py-2 rounded-full bg-[#1e88e5] text-white font-medium hover:scale-105 transition shadow-lg hover:bg-[#243864]">
                            Speaking?
                        </button>
                        <button className="px-6 py-2 rounded-full bg-[#1e88e5] text-white font-medium hover:scale-105 transition shadow-lg hover:bg-[#243864]">
                            Reading?
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
            <div className="bg-gradient-to-br from-[#F6FAFF] to-[#E8F4FD] py-16">
                <div className="text-center mb-12">
                    <BlurFadeText>
                        <h1 className="font-special text-4xl md:text-5xl font-bold mb-6 text-[#243864]">
                            Modern way to master Japanese with powerful features?
                        </h1>
                    </BlurFadeText>
                    <p className="font-special text-xl md:text-xl mb-6 text-gray-700">
                        Perfect for students, self-learners, and anyone aiming to improve their Japanese skills every day.
                    </p>
                </div>

                <section className="mb-28 p-5">
                    <div className="container mx-auto text-center">
                        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                            {/* Card 1 */}
                            <div className="w-64 h-64 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center text-center p-6 transition hover:scale-105 border-2 border-[#1e88e5]/20">
                                <img src={flashcard} alt="Smart Flashcards" className="w-12 h-12 mb-4" />
                                <h3 className="font-special font-bold text-2xl text-[#243864] mb-2">Smart Flashcards</h3>
                                <p className="text-md font-special text-[#1e88e5]">
                                    Learn and review vocabulary effortlessly
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="w-64 h-64 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center text-center p-6 transition hover:scale-105 border-2 border-[#1e88e5]/20">
                                <img src={AIvoice} alt="AI Voice" className="w-12 h-12 mb-4" />
                                <h3 className="font-special font-bold text-2xl text-[#243864] mb-2">AI Voice Scoring</h3>
                                <p className="text-md font-special text-[#1e88e5]">
                                    Get instant feedback on your pronunciation
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="w-64 h-64 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center text-center p-6 transition hover:scale-105 border-2 border-[#1e88e5]/20">
                                <img src={qiuz} alt="Dictionary" className="w-12 h-12 mb-4" />
                                <h3 className="font-special font-bold text-2xl text-[#243864] mb-2">Flexible Dictionary</h3>
                                <p className="text-md font-special text-[#1e88e5]">
                                    Track your learning and stay on pace
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
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
