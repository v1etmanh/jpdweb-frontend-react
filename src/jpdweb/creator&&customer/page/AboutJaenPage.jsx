import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AboutJaenPage() {
  const [lang, setLang] = useState("en"); // 'en' or 'vi'

  const content = {
    en: {
      hero: {
        title: "Where language learning becomes smarter",
        subtitle: "At JAEN, we believe languages connect people — and learning them should be simple, interactive, and inspiring.",
        cta1: "Start Learning",
        cta2: "Teach on JAEN"
      },
      mission: {
        title: "Our Mission",
        quote: "Empower everyone to teach and learn languages in smarter, simpler, and more effective ways.",
        description: "JAEN exists to bridge the gap between teachers and learners in the digital era — bringing together everything needed for modern language education in one place.",
        cards: [
          {
            title: "For Learners",
            body: "Learn anytime, anywhere through AI-powered recommendations, interactive modules, and progress tracking."
          },
          {
            title: "For Educators",
            body: "Create, publish, and monetize courses effortlessly with powerful integrated tools."
          },
          {
            title: "For Everyone",
            body: "Join a growing community of passionate learners and creators sharing knowledge together."
          }
        ]
      },
      why: {
        title: "Why Learn with JAEN",
        items: [
          {
            title: "Integrated Learning",
            desc: "10 interactive modules to develop all skills — listening, speaking, reading, and writing."
          },
          {
            title: "Empowering Educators",
            desc: "Design and manage your own courses with no technical barriers."
          },
          {
            title: "Seamless Experience",
            desc: "All-in-one platform — from video upload to progress tracking."
          },
          {
            title: "Connected Community",
            desc: "Join study groups and forums to learn and grow together."
          }
        ]
      },
      vision: {
        title: "Our Vision",
        quote: "To become Southeast Asia's leading smart language learning platform — where technology meets creativity and education has no borders.",
        description: "JAEN envisions a world where teachers freely share knowledge and learners everywhere achieve language mastery through innovation and connection."
      },
      story: {
        title: "The Story Behind JAEN",
        description: "The idea for JAEN was born from the challenges faced by real teachers and learners: fragmented tools, low motivation, and a lack of community. JAEN changes that by creating one unified ecosystem where teaching and learning come together seamlessly.",
        cta: "Join Our Journey"
      }
    },
    vi: {
      hero: {
        title: "Nơi việc học ngôn ngữ trở nên thông minh hơn",
        subtitle: "Tại JAEN, chúng tôi tin rằng ngôn ngữ kết nối mọi người — và việc học chúng nên đơn giản, tương tác và truyền cảm hứng.",
        cta1: "Bắt đầu học",
        cta2: "Giảng dạy trên JAEN"
      },
      mission: {
        title: "Sứ mệnh của chúng tôi",
        quote: "Trao quyền cho mọi người dạy và học ngôn ngữ một cách thông minh, đơn giản và hiệu quả hơn.",
        description: "JAEN tồn tại để thu hẹp khoảng cách giữa giáo viên và người học trong kỷ nguyên số — tập hợp mọi thứ cần thiết cho giáo dục ngôn ngữ hiện đại tại một nơi.",
        cards: [
          {
            title: "Dành cho Người học",
            body: "Học ở bất kỳ đâu, bất kỳ khi nào với gợi ý từ AI, các module học tương tác và hệ thống theo dõi tiến độ."
          },
          {
            title: "Dành cho Giáo viên",
            body: "Tạo, xuất bản và kiếm thu nhập từ khóa học dễ dàng với công cụ tích hợp mạnh mẽ."
          },
          {
            title: "Dành cho Tất cả",
            body: "Tham gia cộng đồng học tập năng động, nơi mọi người cùng chia sẻ kiến thức và phát triển."
          }
        ]
      },
      why: {
        title: "Vì sao chọn JAEN",
        items: [
          {
            title: "Học tập tích hợp",
            desc: "10 module tương tác để phát triển đầy đủ kỹ năng — nghe, nói, đọc và viết."
          },
          {
            title: "Trao quyền giáo viên",
            desc: "Thiết kế và quản lý khóa học của bạn mà không có rào cản kỹ thuật."
          },
          {
            title: "Trải nghiệm liền mạch",
            desc: "Nền tảng tất cả trong một — từ tải video đến theo dõi tiến độ."
          },
          {
            title: "Cộng đồng kết nối",
            desc: "Tham gia nhóm học tập và diễn đàn để học hỏi và phát triển cùng nhau."
          }
        ]
      },
      vision: {
        title: "Tầm nhìn",
        quote: "Trở thành nền tảng học ngôn ngữ thông minh hàng đầu Đông Nam Á — nơi công nghệ gặp gỡ sáng tạo và giáo dục không còn biên giới.",
        description: "JAEN hình dung một thế giới nơi giáo viên tự do chia sẻ kiến thức và người học ở khắp mọi nơi đạt được sự thành thạo ngôn ngữ thông qua đổi mới và kết nối."
      },
      story: {
        title: "Câu chuyện của JAEN",
        description: "Ý tưởng về JAEN được sinh ra từ những thách thức mà giáo viên và người học thực sự phải đối mặt: công cụ phân mảnh, động lực thấp và thiếu cộng đồng. JAEN thay đổi điều đó bằng cách tạo ra một hệ sinh thái thống nhất nơi giảng dạy và học tập kết hợp liền mạch.",
        cta: "Tham gia hành trình"
      }
    }
  };

  const t = content[lang];

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: i * 0.08 },
    }),
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i = 0) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut", delay: i * 0.08 },
    }),
  };

  const floatY = {
    initial: { y: 0, opacity: 0.6 },
    animate: {
      y: [0, -16, 0],
      opacity: [0.6, 0.9, 0.6],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <div className="flex flex-col items-center w-full text-gray-800 bg-gray-50 overflow-x-hidden relative">
      {/* Language Toggle - Moved to left */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-6 left-6 z-50 bg-black/30 backdrop-blur-md rounded-full shadow-lg p-1 flex gap-1 border border-white/20"
      >
        <button
          onClick={() => setLang("en")}
          className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${
            lang === "en"
              ? "bg-white text-cyan-600 shadow-md"
              : "text-white hover:bg-white/20"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLang("vi")}
          className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${
            lang === "vi"
              ? "bg-white text-cyan-600 shadow-md"
              : "text-white hover:bg-white/20"
          }`}
        >
          VI
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={lang}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-full bg-gradient-to-br from-cyan-100 via-white to-cyan-50 py-32 px-6 text-center"
          >
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-7xl font-bold mb-8 text-cyan-600 leading-tight"
            >
              {t.hero.title}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed"
            >
              {t.hero.subtitle}
            </motion.p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <motion.button
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
                whileHover={{
                  y: -6,
                  scale: 1.03,
                  boxShadow: "0px 16px 40px rgba(8,145,178,0.45)",
                }}
                whileTap={{ scale: 0.97, y: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
                className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-12 md:px-16 py-4 md:py-5 rounded-full text-[15px] md:text-lg font-semibold shadow-[0_10px_28px_rgba(8,145,178,0.35)] transition-all"
              >
                {t.hero.cta1}
              </motion.button>
              <motion.button
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
                whileHover={{
                  y: -6,
                  scale: 1.03,
                  boxShadow: "0px 16px 40px rgba(8,145,178,0.25)",
                }}
                whileTap={{ scale: 0.97, y: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
                className="bg-white/90 backdrop-blur-sm border-2 border-cyan-600 text-cyan-600 font-semibold px-12 md:px-16 py-4 md:py-5 rounded-full text-[15px] md:text-lg hover:bg-white shadow-[0_8px_22px_rgba(8,145,178,0.18)] transition-all"
              >
                {t.hero.cta2}
              </motion.button>
            </div>
          </motion.section>

          {/* Mission Section */}
          <motion.section
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto py-32 px-6 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-cyan-600 mb-8">
              {t.mission.title}
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 italic mb-8 leading-relaxed">
              "{t.mission.quote}"
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-20 leading-relaxed">
              {t.mission.description}
            </p>

            <div className="grid md:grid-cols-3 gap-10">
              {t.mission.cards.map((card, idx) => (
                <motion.div
                  key={idx}
                  variants={scaleIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  custom={idx}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all border border-gray-100"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl mb-6 flex items-center justify-center text-white text-3xl font-bold">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-cyan-600 mb-4 text-2xl">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{card.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Why JAEN Section */}
          <motion.section
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative w-full bg-gradient-to-br from-cyan-600 via-cyan-500 to-blue-500 text-white py-32 px-6 text-center overflow-hidden"
          >
            <motion.div
              className="absolute -top-10 -left-10 w-96 h-96 rounded-full bg-white/10 blur-3xl"
              variants={floatY}
              initial="initial"
              animate="animate"
            />
            <motion.div
              className="absolute bottom-10 -right-10 w-96 h-96 rounded-full bg-white/10 blur-3xl"
              variants={floatY}
              initial="initial"
              animate="animate"
            />

            <div className="relative z-10 max-w-7xl mx-auto">
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold mb-20"
              >
                {t.why.title}
              </motion.h2>

              <div className="grid md:grid-cols-4 gap-12">
                {t.why.items.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    custom={i}
                    whileHover={{ y: -8 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all"
                  >
                    <h3 className="text-2xl font-bold text-orange-300 mb-4">
                      {item.title}
                    </h3>
                    <p className="text-white/90 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Vision Section */}
          <motion.section
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto py-32 px-6 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-cyan-600 mb-8">
              {t.vision.title}
            </h2>
            <p className="text-xl md:text-2xl italic text-gray-700 mb-8 leading-relaxed">
              "{t.vision.quote}"
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t.vision.description}
            </p>
          </motion.section>

          {/* Story Section */}
          <motion.section
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full bg-gradient-to-br from-cyan-50 to-blue-50 py-32 px-6 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-cyan-600 mb-8">
              {t.story.title}
            </h2>
            <p className="max-w-4xl mx-auto text-lg text-gray-700 mb-12 leading-relaxed">
              {t.story.description}
            </p>
            <motion.button
              whileHover={{
                y: -6,
                scale: 1.03,
                boxShadow: "0px 18px 44px rgba(234,88,12,0.45)",
              }}
              whileTap={{ scale: 0.97, y: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-500/95 hover:to-orange-600/95 text-white px-12 md:px-16 py-4 md:py-5 rounded-full text-[15px] md:text-lg font-semibold shadow-[0_10px_28px_rgba(234,88,12,0.35)] transition-all"
            >
              {t.story.cta}
            </motion.button>
          </motion.section>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}