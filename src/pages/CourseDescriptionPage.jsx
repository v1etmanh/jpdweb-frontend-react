import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function CourseDescriptionPage( ) {
  // Enhanced course data structure
  const courses = [
    {
      id: 0,
      creator: { 
        name: "Nguyen Van A", 
        description: "Giáo viên tiếng Anh nhiều năm kinh nghiệm",
        bio: "Có hơn 10 năm kinh nghiệm giảng dạy tiếng Anh tại các trung tâm uy tín. Chuyên gia về phương pháp giao tiếp thực tế.",
        email: "a@gmail.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        totalStudents: 15000,
        totalCourses: 8,
        rating: 4.8
      },
      name: "Tiếng Anh Giao Tiếp Cơ Bản",
      description: "Khóa học giúp bạn nắm vững các mẫu câu và từ vựng thông dụng trong giao tiếp hàng ngày.",
      longDescription: "Khóa học được thiết kế dành cho người mới bắt đầu học tiếng Anh. Bạn sẽ học cách giao tiếp tự nhiên trong các tình huống thực tế như: chào hỏi, mua sắm, đặt món ăn, hỏi đường, và nhiều tình huống khác.",
      rating: 4.7,
      totalRatings: 2856,
      numberModuleType: 12,
      numberstudent: 3200,
      img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
      price: 200,
      originalPrice: 350,
      discount: 43,
      currency: "USD",
      lastUpdated: "2/2025",
      language: "Tiếng Việt",
      subtitles: ["English", "Tiếng Việt"],
      level: "Beginner",
      duration: "8.5 giờ",
      totalLectures: 45,
      hasLifetimeAccess: true,
      hasMobileAccess: true,
      hasCertificate: true,
      hasClosedCaptions: true,
      
      // What you'll learn
      learningOutcomes: [
        "Giao tiếp tự tin trong các tình huống hàng ngày",
        "Nắm vững 500+ từ vựng thông dụng",
        "Phát âm chuẩn theo giọng Mỹ",
        "Hiểu và sử dụng các mẫu câu cơ bản",
        "Luyện nghe hiểu với native speakers",
        "Xây dựng nền tảng ngữ pháp vững chắc"
      ],

      // Course requirements
      requirements: [
        "Không cần kiến thức tiếng Anh trước đó",
        "Có máy tính hoặc điện thoại để học online",
        "Dành 30 phút mỗi ngày để luyện tập",
        "Tinh thần học hỏi và kiên trì"
      ],

      // Course content structure
      curriculum: [
        {
          section: "Giới thiệu khóa học",
          lectures: 3,
          duration: "15 phút",
          topics: ["Cách học hiệu quả", "Giới thiệu giảng viên", "Mục tiêu khóa học"]
        },
        {
          section: "Bảng chữ cái và phát âm",
          lectures: 5,
          duration: "45 phút",
          topics: ["26 chữ cái tiếng Anh", "Phát âm chuẩn", "Luyện tập phát âm"]
        },
        {
          section: "Chào hỏi và làm quen",
          lectures: 6,
          duration: "1 giờ",
          topics: ["Các cách chào hỏi", "Tự giới thiệu", "Hỏi thông tin cá nhân"]
        },
        {
          section: "Gia đình và bạn bè",
          lectures: 8,
          duration: "1.5 giờ",
          topics: ["Từ vựng về gia đình", "Miêu tả người", "Nói về mối quan hệ"]
        }
      ],

      feedback: [
        { 
          user: "Minh Anh", 
          context: "Khóa học rất dễ hiểu, giảng viên nhiệt tình. Tôi đã cải thiện được khả năng giao tiếp rất nhiều.", 
          createAt: "2025-09-01",
          rating: 5,
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b742?w=50"
        },
        { 
          user: "Thanh Long", 
          context: "Nội dung khóa học phong phú, bài tập thực hành nhiều. Rất recommend!", 
          createAt: "2025-09-05",
          rating: 5,
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50"
        },
        {
          user: "Hương Giang",
          context: "Phương pháp giảng dạy hiệu quả, sau 2 tháng học tôi đã tự tin giao tiếp cơ bản.",
          createAt: "2025-08-28",
          rating: 4,
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50"
        }
      ],

      tags: ["English", "Communication", "Beginner", "Conversation"],
      category: "Language Learning",
      subcategory: "English",
      
      // Promotional info
      bestSeller: true,
      featured: true,
      guaranteeInfo: "30-Day Money-Back Guarantee"
    },
    {
      id: 1,
      creator: { 
        name: "Nguyen Van A", 
        description: "Giáo viên tiếng Anh nhiều năm kinh nghiệm",
        bio: "Có hơn 10 năm kinh nghiệm giảng dạy tiếng Anh tại các trung tâm uy tín. Chuyên gia về phương pháp giao tiếp thực tế.",
        email: "a@gmail.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        totalStudents: 15000,
        totalCourses: 8,
        rating: 4.8
      },
      name: "Tiếng Anh Giao Tiếp Cơ Bản",
      description: "Khóa học giúp bạn nắm vững các mẫu câu và từ vựng thông dụng trong giao tiếp hàng ngày.",
      longDescription: "Khóa học được thiết kế dành cho người mới bắt đầu học tiếng Anh. Bạn sẽ học cách giao tiếp tự nhiên trong các tình huống thực tế như: chào hỏi, mua sắm, đặt món ăn, hỏi đường, và nhiều tình huống khác.",
      rating: 4.7,
      totalRatings: 2856,
      numberModuleType: 12,
      numberstudent: 3200,
      img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
      price: 200,
      originalPrice: 350,
      discount: 43,
      currency: "USD",
      lastUpdated: "2/2025",
      language: "Tiếng Việt",
      subtitles: ["English", "Tiếng Việt"],
      level: "Beginner",
      duration: "8.5 giờ",
      totalLectures: 45,
      hasLifetimeAccess: true,
      hasMobileAccess: true,
      hasCertificate: true,
      hasClosedCaptions: true,
      
      // What you'll learn
      learningOutcomes: [
        "Giao tiếp tự tin trong các tình huống hàng ngày",
        "Nắm vững 500+ từ vựng thông dụng",
        "Phát âm chuẩn theo giọng Mỹ",
        "Hiểu và sử dụng các mẫu câu cơ bản",
        "Luyện nghe hiểu với native speakers",
        "Xây dựng nền tảng ngữ pháp vững chắc"
      ],

      // Course requirements
      requirements: [
        "Không cần kiến thức tiếng Anh trước đó",
        "Có máy tính hoặc điện thoại để học online",
        "Dành 30 phút mỗi ngày để luyện tập",
        "Tinh thần học hỏi và kiên trì"
      ],

      // Course content structure
      curriculum: [
        {
          section: "Giới thiệu khóa học",
          lectures: 3,
          duration: "15 phút",
          topics: ["Cách học hiệu quả", "Giới thiệu giảng viên", "Mục tiêu khóa học"]
        },
        {
          section: "Bảng chữ cái và phát âm",
          lectures: 5,
          duration: "45 phút",
          topics: ["26 chữ cái tiếng Anh", "Phát âm chuẩn", "Luyện tập phát âm"]
        },
        {
          section: "Chào hỏi và làm quen",
          lectures: 6,
          duration: "1 giờ",
          topics: ["Các cách chào hỏi", "Tự giới thiệu", "Hỏi thông tin cá nhân"]
        },
        {
          section: "Gia đình và bạn bè",
          lectures: 8,
          duration: "1.5 giờ",
          topics: ["Từ vựng về gia đình", "Miêu tả người", "Nói về mối quan hệ"]
        }
      ],

      feedback: [
        { 
          user: "Minh Anh", 
          context: "Khóa học rất dễ hiểu, giảng viên nhiệt tình. Tôi đã cải thiện được khả năng giao tiếp rất nhiều.", 
          createAt: "2025-09-01",
          rating: 5,
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b742?w=50"
        },
        { 
          user: "Thanh Long", 
          context: "Nội dung khóa học phong phú, bài tập thực hành nhiều. Rất recommend!", 
          createAt: "2025-09-05",
          rating: 5,
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50"
        },
        {
          user: "Hương Giang",
          context: "Phương pháp giảng dạy hiệu quả, sau 2 tháng học tôi đã tự tin giao tiếp cơ bản.",
          createAt: "2025-08-28",
          rating: 4,
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50"
        }
      ],

      tags: ["English", "Communication", "Beginner", "Conversation"],
      category: "Language Learning",
      subcategory: "English",
      
      // Promotional info
      bestSeller: true,
      featured: true,
      guaranteeInfo: "30-Day Money-Back Guarantee"
    }
    
    // Add similar enhanced structure for other courses...
  ];

  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const { id } = useParams();

  useEffect(() => {
    setCourse(courses[id]);
  }, [id]);

  if (!course) {
    return (
      <div className="text-center text-lg font-semibold text-red-500 mt-10">
        Không tìm thấy thông tin khóa học
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-[#1c1d1f] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              {/* Breadcrumb */}
              <div className="text-sm text-gray-300 mb-4">
                <span>IT & Software</span> &gt; <span>Language Learning</span> &gt; <span>English</span>
              </div>

              <h1 className="text-3xl font-bold mb-4">{course.name}</h1>
              <p className="text-lg text-gray-300 mb-6">{course.longDescription}</p>

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {course.bestSeller && (
                  <span className="bg-yellow-400 text-black px-3 py-1 rounded font-bold">
                    Bestseller
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <span className="text-orange-400">★</span>
                  <span>{course.rating}</span>
                  <span className="text-blue-400">({course.totalRatings.toLocaleString()} ratings)</span>
                </div>
                <span>{course.numberstudent.toLocaleString()} students</span>
              </div>

              <div className="flex items-center gap-4 mt-4 text-sm text-gray-300">
                <span>Created by {course.creator.name}</span>
                <span>Last updated {course.lastUpdated}</span>
                <span>{course.language}</span>
                <span>{course.subtitles.join(', ')}</span>
              </div>
            </div>

            {/* Course Preview Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-xl p-6 text-black">
                <img
                  src={course.img}
                  alt={course.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl font-bold">₫{course.price.toLocaleString()}</span>
                  <span className="text-gray-500 line-through">₫{course.originalPrice.toLocaleString()}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 text-sm rounded">
                    {course.discount}% off
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <button className="w-full bg-purple-600 text-white py-3 rounded font-bold hover:bg-purple-700 transition">
                    Add to cart
                  </button>
                  <button className="w-full border border-black py-3 rounded font-bold hover:bg-gray-50 transition">
                    Buy now
                  </button>
                </div>

                <div className="text-center text-sm text-gray-600 mb-4">
                  {course.guaranteeInfo}
                </div>

                {/* This course includes */}
                <div className="space-y-3">
                  <h3 className="font-bold">This course includes:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span>🎥</span>
                      <span>{course.duration} on-demand video</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📄</span>
                      <span>{course.totalLectures} lectures</span>
                    </div>
                    {course.hasMobileAccess && (
                      <div className="flex items-center gap-2">
                        <span>📱</span>
                        <span>Access on mobile and TV</span>
                      </div>
                    )}
                    {course.hasLifetimeAccess && (
                      <div className="flex items-center gap-2">
                        <span>♾️</span>
                        <span>Full lifetime access</span>
                      </div>
                    )}
                    {course.hasCertificate && (
                      <div className="flex items-center gap-2">
                        <span>🏆</span>
                        <span>Certificate of completion</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* What you'll learn */}
        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.learningOutcomes.map((outcome, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <span>{outcome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-6">Course content</h2>
          <div className="text-sm text-gray-600 mb-4">
            {course.curriculum.length} sections • {course.totalLectures} lectures • {course.duration} total length
          </div>
          
          <div className="space-y-4">
            {course.curriculum.map((section, idx) => (
              <div key={idx} className="border border-gray-200 rounded">
                <div className="p-4 bg-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{section.section}</h3>
                    <div className="text-sm text-gray-600">
                      {section.lectures} lectures • {section.duration}
                    </div>
                  </div>
                  <button className="text-blue-600">▼</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-6">Requirements</h2>
          <ul className="space-y-2">
            {course.requirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructor */}
        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-6">Instructor</h2>
          <div className="flex items-start gap-6">
            <img
              src={course.creator.avatar}
              alt={course.creator.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl font-bold text-blue-600 mb-2">
                {course.creator.name}
              </h3>
              <p className="text-gray-600 mb-4">{course.creator.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <span>⭐</span>
                  <span>{course.creator.rating} Instructor Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>👥</span>
                  <span>{course.creator.totalStudents.toLocaleString()} Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🎬</span>
                  <span>{course.creator.totalCourses} Courses</span>
                </div>
              </div>
              
              <p className="text-gray-700">{course.creator.bio}</p>
            </div>
          </div>
        </div>

        {/* Student Reviews */}
        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-6">Student feedback</h2>
          <div className="space-y-6">
            {course.feedback.map((review, idx) => (
              <div key={idx} className="flex gap-4 pb-6 border-b border-gray-200 last:border-b-0">
                <img
                  src={review.avatar}
                  alt={review.user}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{review.user}</span>
                    <div className="flex text-orange-400">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                    </div>
                    <span className="text-sm text-gray-500">{review.createAt}</span>
                  </div>
                  <p className="text-gray-700">{review.context}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
