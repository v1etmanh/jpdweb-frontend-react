import React from "react";
import { motion } from "framer-motion";
import { Button } from "../../../components/common/button";

export default function AboutJaenPage() {
  return (
    <div className="flex flex-col items-center w-full text-gray-800 bg-gray-50 overflow-x-hidden">
      {/* ================= Hero Section ================= */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full bg-gradient-to-br from-cyan-100 via-white to-cyan-50 py-24 px-6 text-center"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-cyan-500 font-bold leading-tight">
          Welcome to where language learning becomes smarter
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 mb-10">
          At <span className="font-semibold text-cyan-600">JAEN</span>, we believe languages connect people — and learning them should be simple, interactive, and inspiring.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="bg-cyan-600 text-white px-8 py-4 rounded-xl text-lg shadow-md hover:bg-cyan-700 transition">
            Start Learning
          </Button>
          <Button className="bg-white border-2 border-cyan-600 text-cyan-500 font-bold px-8 py-4 rounded-xl text-lg hover:bg-cyan-50 transition">
            Teach on JAEN
          </Button>
        </div>
      </motion.section>

      {/* ================= Mission Section ================= */}
      <motion.section
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl py-24 px-6 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-cyan-500 font-bold mb-4">
          Our Mission – Sứ mệnh của chúng tôi
        </h2>
        <p className="text-lg md:text-xl text-gray-600 italic mb-6">
          “Empower everyone to teach and learn languages in smarter, simpler, and more effective ways.”<br />
          <span className="text-gray-500">
            “Trao quyền cho mọi người dạy và học ngôn ngữ một cách thông minh, đơn giản và hiệu quả hơn.”
          </span>
        </p>
        <p className="text-gray-700 max-w-3xl mx-auto mb-14">
          JAEN exists to bridge the gap between teachers and learners in the digital era — bringing together everything needed for modern language education in one place.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition">
            <h3 className="font-semibold text-cyan-600 mb-3 text-lg">
              For Learners – Dành cho Người học
            </h3>
            <p className="text-gray-600">
              Learn anytime, anywhere through AI-powered recommendations, interactive modules, and progress tracking.<br />
              <span className="text-gray-500 text-sm">
                Học ở bất kỳ đâu, bất kỳ khi nào với gợi ý từ AI, các module học tương tác và hệ thống theo dõi tiến độ.
              </span>
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition">
            <h3 className="font-semibold text-cyan-600 mb-3 text-lg">
              For Educators – Dành cho Giáo viên
            </h3>
            <p className="text-gray-600">
              Create, publish, and monetize courses effortlessly with powerful integrated tools.<br />
              <span className="text-gray-500 text-sm">
                Tạo, xuất bản và kiếm thu nhập từ khóa học dễ dàng với công cụ tích hợp sẵn.
              </span>
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition">
            <h3 className="font-semibold text-cyan-600 mb-3 text-lg">
              For Everyone – Dành cho Tất cả mọi người
            </h3>
            <p className="text-gray-600">
              Join a growing community of passionate learners and creators sharing knowledge together.<br />
              <span className="text-gray-500 text-sm">
                Tham gia cộng đồng học tập năng động, nơi mọi người cùng chia sẻ và phát triển.
              </span>
            </p>
          </div>
        </div>
      </motion.section>

      {/* ================= Why Learn with JAEN ================= */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full bg-cyan-600 text-white py-24 px-6 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Why Learn with JAEN – Vì sao chọn JAEN
        </h2>
        <div className="grid md:grid-cols-4 gap-10 max-w-6xl mx-auto text-left">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-orange-500 font-bold">
              Integrated & Smart Learning
            </h3>
            <p className="text-cyan-50 text-sm">
              10 interactive modules to develop all skills — listening, speaking, reading, and writing.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-orange-500 font-bold">
              Empowering Educators
            </h3>
            <p className="text-cyan-50 text-sm">
              Design and manage your own courses with no technical barriers.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-orange-500 font-bold">
              Seamless Experience
            </h3>
            <p className="text-cyan-50 text-sm">
              All-in-one platform — from video upload to progress tracking.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-orange-500 font-bold">
              Connected Community
            </h3>
            <p className="text-cyan-50 text-sm">
              Join study groups and forums to learn and grow together.
            </p>
          </div>
        </div>
      </motion.section>

      {/* ================= Vision Section ================= */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl py-24 px-6 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-cyan-500 font-bold mb-4">
          Our Vision – Tầm nhìn
        </h2>
        <p className="text-lg md:text-xl italic text-gray-600 mb-4">
          “To become Southeast Asia’s leading smart language learning platform — where technology meets creativity and education has no borders.”<br />
          <span className="text-gray-500">
            “Trở thành nền tảng học ngôn ngữ thông minh hàng đầu Đông Nam Á — nơi công nghệ gặp gỡ sáng tạo và giáo dục không còn biên giới.”
          </span>
        </p>
        <p className="text-gray-700 max-w-2xl mx-auto">
          JAEN envisions a world where teachers freely share knowledge and learners everywhere achieve language mastery through innovation and connection.
        </p>
      </motion.section>

      {/* ================= Story Section ================= */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full bg-cyan-50 py-24 px-6 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-cyan-500 font-bold mb-6">
          The Story Behind JAEN – Câu chuyện của chúng tôi
        </h2>
        <p className="max-w-3xl mx-auto text-gray-700 mb-10">
          The idea for JAEN was born from the challenges faced by real teachers and learners: fragmented tools, low motivation, and a lack of community. JAEN changes that by creating one unified ecosystem where teaching and learning come together seamlessly.
        </p>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl text-lg shadow-md">
          Join Our Journey
        </Button>
      </motion.section>
    </div>
  );
}
