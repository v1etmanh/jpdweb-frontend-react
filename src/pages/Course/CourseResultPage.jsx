import { Button } from "bootstrap";
import { useEffect,useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
//create

export default function CourseResultPage(){
    //create list course {creator: , name: , description:, rating:, numberModuleType:, numberstudent:}
    const courses = [ 
  {
    creator: { name: "Nguyen Van A", description: "Giáo viên tiếng Anh nhiều năm kinh nghiệm", email: "a@gmail.com" },
    name: "Tiếng Anh Giao Tiếp Cơ Bản",
    description: "Khóa học giúp bạn nắm vững các mẫu câu và từ vựng thông dụng trong giao tiếp hàng ngày.",
    rating: 4.7,
    numberModuleType: 12,
    numberstudent: 3200,
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
    price: 200,
    feedback: [
      { user: "student1", context: "Khóa học dễ hiểu", createAt: "2025-09-01" },
      { user: "student2", context: "Giảng viên nhiệt tình", createAt: "2025-09-05" }
    ]
  },
  {
    creator: { name: "Tran Thi B", description: "Chuyên gia tiếng Nhật JLPT", email: "b@gmail.com" },
    name: "Tiếng Nhật N5 Từ Căn Bản",
    description: "Học bảng chữ cái Hiragana, Katakana và các mẫu câu cơ bản cho kỳ thi JLPT N5.",
    rating: 4.8,
    numberModuleType: 15,
    numberstudent: 4500,
    img: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800",
    price: 120,
    feedback: []
  },
  {
    creator: { name: "Le Van C", description: "Giảng viên tiếng Hàn giao tiếp", email: "c@gmail.com" },
    name: "Tiếng Hàn Nhập Môn",
    description: "Khóa học giúp bạn học bảng chữ cái Hangul và các cấu trúc câu cơ bản trong tiếng Hàn.",
    rating: 4.6,
    numberModuleType: 10,
    numberstudent: 2800,
    img: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800",
    price: 190,
    feedback: []
  },
  {
    creator: { name: "Pham Thi D", description: "Giáo viên tiếng Trung 10 năm kinh nghiệm", email: "d@gmail.com" },
    name: "Tiếng Trung Giao Tiếp",
    description: "Khóa học dạy tiếng Trung hiện đại, từ cơ bản đến giao tiếp trong đời sống.",
    rating: 4.9,
    numberModuleType: 18,
    numberstudent: 5000,
    img: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800",
    price: 220,
    feedback: []
  },
  {
    creator: { name: "Nguyen Van E", description: "Giảng viên tiếng Tây Ban Nha", email: "e@gmail.com" },
    name: "Tiếng Tây Ban Nha Cho Người Mới Bắt Đầu",
    description: "Khóa học nhập môn tiếng Tây Ban Nha, ngôn ngữ phổ biến thứ hai trên thế giới.",
    rating: 4.5,
    numberModuleType: 14,
    numberstudent: 2100,
    img: "https://images.unsplash.com/photo-1504615755583-2916b52192d7?w=800",
    price: 90,
    feedback: []
  },
  {
    creator: { name: "Hoang Thi F", description: "Chuyên tiếng Pháp giao tiếp", email: "f@gmail.com" },
    name: "Tiếng Pháp Cơ Bản",
    description: "Khóa học giúp bạn học phát âm, ngữ pháp và hội thoại cơ bản bằng tiếng Pháp.",
    rating: 4.6,
    numberModuleType: 11,
    numberstudent: 1900,
    img: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=800",
    price: 330,
    feedback: []
  },
  {
    creator: { name: "Pham Van G", description: "Giảng viên tiếng Đức cơ bản", email: "g@gmail.com" },
    name: "Tiếng Đức Cho Người Mới",
    description: "Làm quen với bảng chữ cái, phát âm và các mẫu câu chào hỏi trong tiếng Đức.",
    rating: 4.4,
    numberModuleType: 9,
    numberstudent: 1700,
    img: "https://images.unsplash.com/photo-1551854838-212c50b4c184?w=800",
    price: 145,
    feedback: []
  },
  {
    creator: { name: "Tran Van H", description: "Giáo viên tiếng Ý", email: "h@gmail.com" },
    name: "Tiếng Ý Giao Tiếp",
    description: "Khóa học tiếng Ý nhập môn với các chủ đề gần gũi trong đời sống hàng ngày.",
    rating: 4.7,
    numberModuleType: 13,
    numberstudent: 2400,
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    price: 90,
    feedback: []
  },
  {
    creator: { name: "Nguyen Thi I", description: "Giảng viên tiếng Nga", email: "i@gmail.com" },
    name: "Tiếng Nga Cơ Bản",
    description: "Khóa học giới thiệu bảng chữ cái Cyrillic và những mẫu câu giao tiếp đơn giản.",
    rating: 4.5,
    numberModuleType: 12,
    numberstudent: 1600,
    img: "https://images.unsplash.com/photo-1530023367847-a683933f417f?w=800",
    price: 71,
    feedback: []
  },
  {
    creator: { name: "Le Van J", description: "Giáo viên tiếng Bồ Đào Nha", email: "j@gmail.com" },
    name: "Tiếng Bồ Đào Nha Nhập Môn",
    description: "Khóa học giúp bạn học những kiến thức căn bản của tiếng Bồ Đào Nha.",
    rating: 4.3,
    numberModuleType: 8,
    numberstudent: 1400,
    img: "https://images.unsplash.com/photo-1524492449090-1a065f3a1a22?w=800",
    price: 332,
    feedback: []
  },
  {
    creator: { name: "Pham Thi K", description: "Chuyên tiếng Ả Rập", email: "k@gmail.com" },
    name: "Tiếng Ả Rập Cho Người Mới",
    description: "Bắt đầu học bảng chữ cái và phát âm chuẩn trong tiếng Ả Rập.",
    rating: 4.6,
    numberModuleType: 11,
    numberstudent: 1500,
    img: "https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=800",
    price: 22,
    feedback: []
  },
  {
    creator: { name: "Nguyen Van L", description: "Giảng viên tiếng Việt cho người nước ngoài", email: "l@gmail.com" },
    name: "Tiếng Việt Cho Người Nước Ngoài",
    description: "Khóa học tiếng Việt cơ bản cho người mới bắt đầu, tập trung vào giao tiếp.",
    rating: 4.9,
    numberModuleType: 16,
    numberstudent: 2200,
    img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
    price: 290,
    feedback: []
  },
  {
    creator: { name: "Tran Thi M", description: "Giảng viên tiếng Thái", email: "m@gmail.com" },
    name: "Tiếng Thái Lan Cơ Bản",
    description: "Khóa học nhập môn tiếng Thái, giúp bạn học phát âm và câu chào hỏi.",
    rating: 4.4,
    numberModuleType: 10,
    numberstudent: 1300,
    img: "https://images.unsplash.com/photo-1524492449090-1a065f3a1a22?w=800",
    price: 122,
    feedback: []
  },
  {
    creator: { name: "Hoang Van N", description: "Giảng viên tiếng Hindi", email: "n@gmail.com" },
    name: "Tiếng Hindi Nhập Môn",
    description: "Khóa học giới thiệu bảng chữ cái Devanagari và những mẫu câu cơ bản.",
    rating: 4.5,
    numberModuleType: 12,
    numberstudent: 1600,
    img: "https://images.unsplash.com/photo-1562072545-17e7f8c8d87b?w=800",
    price: 189,
    feedback: []
  },
  {
    creator: { name: "Le Thi O", description: "Giảng viên tiếng Indonesia", email: "o@gmail.com" },
    name: "Tiếng Indonesia Cơ Bản",
    description: "Khóa học giúp bạn làm quen với ngữ pháp và từ vựng phổ biến trong tiếng Indonesia.",
    rating: 4.3,
    numberModuleType: 9,
    numberstudent: 1200,
    img: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800",
    price: 590,
    feedback: []
  }
];
 const {name} = useParams();
    const [targetCourses, setTargetCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState(3);
    const nav = useNavigate();

    const findCourses = () => {
        const reDemand = name.toLowerCase();
        return courses.filter(course=>
            course.name.toLowerCase().includes(reDemand) ||
            course.creator.name.toLowerCase().includes(reDemand) ||
            course.description.toLowerCase().includes(reDemand)
        );
    }

    useEffect(() => {
        setTargetCourses(findCourses());
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
                    {targetCourses.map((course, index) => (
  <div
    key={index}
    className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
  >
    {/* Folder Shape */}
    <div className="relative">
      {/* Folder Tab */}
      <div className="absolute -top-3 left-4 z-10">
        <div className="bg-white border border-blue-200 px-6 py-2 rounded-t-xl shadow-md">
          <span className="text-[#1e88e5] font-bold text-sm">
            📚 {course.numberModuleType} bài
          </span>
        </div>
      </div>

      {/* Main Folder Body */}
      <div className="bg-white p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 min-h-[300px] relative overflow-hidden border border-blue-200">
        
        {/* Hover Shine */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Price Tag */}
        <div className="absolute top-4 right-4 bg-[#1e88e5] text-white px-4 py-2 rounded-full font-bold shadow-lg">
          ${course.price}
        </div>

        {/* Course Image */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg border-4 border-blue-100">
          <img 
            src={course.img} 
            alt={course.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Course Title */}
        <h3 className="text-[#243864] font-bold text-lg text-center mb-3 line-clamp-2 min-h-[56px]">
          {course.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm text-center mb-4 line-clamp-3 min-h-[60px]">
          {course.description}
        </p>

        {/* Stats */}
        <div className="flex justify-center items-center space-x-4 mb-4">
          <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
            <span className="text-yellow-500 mr-1">⭐</span>
            <span className="text-[#243864] font-semibold text-sm">{course.rating}</span>
          </div>
          <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
            <span className="text-[#243864] mr-1">👥</span>
            <span className="text-[#243864] font-semibold text-sm">{course.numberstudent.toLocaleString()}</span>
          </div>
        </div>

        {/* Creator */}
        <div className="text-center mb-4">
          <div className="w-8 h-8 bg-[#1e88e5] rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-white font-bold text-sm">
              {course.creator.name.charAt(0)}
            </span>
          </div>
          <p className="text-gray-700 text-sm font-medium">
            {course.creator.name}
          </p>
        </div>

        {/* Open Button */}
        <button className="w-full bg-[#1e88e5] hover:bg-[#1565c0] text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        onClick={()=>{nav(`/course/specific/${index}`)}}
        >
          🔓 Mở thư mục
        </button>

        {/* Folder Bottom Edge */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-100 to-blue-300 opacity-60"></div>
      </div>

      {/* Folder Shadow */}
      <div className="absolute -bottom-2 left-2 right-2 h-4 bg-gray-300/30 rounded-b-xl blur-sm -z-10"></div>
    </div>
  </div>
))}

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