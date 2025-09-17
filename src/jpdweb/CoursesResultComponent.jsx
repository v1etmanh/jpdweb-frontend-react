import { Button } from "bootstrap";
import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
//create

export default function CoursesResultComponent(){
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


const {name}=useParams();
const [targetCourses,setTargetCourses]=useState([])
//create function to find courses fit with name 
//if exist => render in screen else return nothing 
const  findCourses=()=>{
    // find in description , creator, name :
    const reDemand=name.toLowerCase();
    return courses.filter(course=>course.name.toLowerCase().includes(reDemand)||
    course.creator.toLocaleLowerCase().includes(reDemand)||course.description.toLocaleLowerCase().includes(reDemand)

)
}
useEffect(()=>{setTargetCourses(findCourses())},[])

// we also need a filter to sort by rating , number of student, and price
// logic: we need a  function get a parameter  when people click that  select option
// we need using that function to sort target by   rating, number of student and price
const[sortOption,setSortOption]=useState(3)
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
//render cac khoa hc do ra man hinh  ,
if (targetCourses.length === 0) {
    return (
      <div className="text-center text-xl font-semibold text-[#e53935] mt-10">
        Không tìm thấy khóa học nào phù hợp với "{name}"
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div>
       <select
  value={sortOption}
  onChange={(e) => {
    const value = Number(e.target.value);
    setSortOption(value);
    filterHandle(value);
  }}
  className="w-60 px-4 py-2 rounded-xl border border-gray-300 shadow-sm
             focus:outline-none focus:ring-2 focus:ring-[#243864] focus:border-[#243864]
             text-gray-700 font-medium bg-white hover:shadow-md transition"
>
  <option value={0}>⭐ Sort by rating</option>
  <option value={1}>👥 Sort by number of students</option>
  <option value={2}>💰 Sort by price</option>
</select>
      </div>
      {targetCourses.map((course, index) => (
        <div
          key={index}
          className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition duration-300"
        >
          <img src={course.img} alt={course.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h2 className="text-lg font-bold text-[#243864]">{course.name}</h2>
            <p className="text-gray-600 text-sm mt-2">{course.description}</p>
            <p className="mt-2 text-sm text-[#1e88e5]">Người tạo: {course.creator.name}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-[#e53935] font-semibold">⭐ {course.rating}</span>
              <span className="text-gray-500 text-sm">{course.numberstudent} học viên</span>
                <span className="text-[#e53935] font-semibold">⭐ {course.numberModuleType} bài học lớn</span>
                 <span className="text-[#e53935] font-semibold">$ price: {course.price} </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}