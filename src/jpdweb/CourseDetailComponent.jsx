import React from "react";
import { motion } from "framer-motion";

// Custom animations
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function CourseDetailComponent() {
  // Sample course data
  const courseData = {
    title: "Japanese Language Mastery 2025",
    level: "N3 Level",
    instructor: {
      name: "Tanaka Yuki",
      title: "Senior Language Instructor",
      image: "/images/instructor.jpg",
    },
    stats: {
      rating: 4.9,
      students: 2458,
      reviews: 384,
      duration: "48 hours",
    },
    price: 299,
    features: [
      "24/7 Lifetime Access",
      "Native Speaker Support",
      "Interactive Exercises",
      "Progress Tracking",
      "Certificate of Completion",
    ],
    modules: [
      {
        title: "Foundation Module",
        lessons: 12,
        duration: "8 hours",
        topics: [
          "Basic Grammar",
          "Essential Vocabulary",
          "Daily Conversations",
        ],
      },
      {
        title: "Intermediate Communication",
        lessons: 15,
        duration: "10 hours",
        topics: ["Business Japanese", "Cultural Context", "Formal Speaking"],
      },
      {
        title: "Advanced Concepts",
        lessons: 18,
        duration: "12 hours",
        topics: ["Complex Grammar", "Writing Skills", "JLPT Preparation"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FFFEF7] font-sans">
      {/* Hero Section */}
      <motion.section
        className="relative py-16 px-4 sm:px-6 lg:px-8"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Course Info */}
            <div className="space-y-8">
              <div>
                <span className="inline-block px-4 py-2 rounded-full bg-[#B8E0E6] bg-opacity-20 text-[#4A4A4A] text-sm font-medium mb-4">
                  {courseData.level}
                </span>
                <h1 className="text-5xl font-bold text-[#4A4A4A] leading-tight mb-4">
                  {courseData.title}
                </h1>
                <div className="flex items-center space-x-4 text-[#4A4A4A]">
                  <div className="flex items-center">
                    <span className="text-[#FF8A80] mr-1">★</span>
                    <span>{courseData.stats.rating}</span>
                  </div>
                  <div>|</div>
                  <div>{courseData.stats.students} students enrolled</div>
                </div>
              </div>

              {/* Instructor Info */}
              <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl shadow-sm">
                <img
                  src={courseData.instructor.image}
                  alt={courseData.instructor.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-[#FF8A80]"
                />
                <div>
                  <h3 className="font-medium text-[#4A4A4A]">
                    {courseData.instructor.name}
                  </h3>
                  <p className="text-sm text-[#4A4A4A] opacity-75">
                    {courseData.instructor.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className="relative">
              <motion.div
                className="rounded-2xl overflow-hidden shadow-lg bg-white aspect-video"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative h-full bg-[#B8E0E6] bg-opacity-20">
                  {/* Replace with actual video player */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-20 h-20 rounded-full bg-[#FF8A80] text-white flex items-center justify-center shadow-lg transform transition hover:scale-105">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Course Stats */}
              <motion.div
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg p-4 w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#FF8A80]">
                      {courseData.stats.duration}
                    </div>
                    <div className="text-sm text-[#4A4A4A]">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#FF8A80]">
                      {courseData.stats.lessons}
                    </div>
                    <div className="text-sm text-[#4A4A4A]">Lessons</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#FF8A80]">
                      {courseData.stats.reviews}
                    </div>
                    <div className="text-sm text-[#4A4A4A]">Reviews</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Course Content Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Course Modules */}
            <div>
              <h2 className="text-2xl font-bold text-[#4A4A4A] mb-6">
                Course Content
              </h2>
              <div className="space-y-4">
                {courseData.modules.map((module, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium text-[#4A4A4A]">
                        {module.title}
                      </h3>
                      <span className="px-3 py-1 bg-[#B8E0E6] bg-opacity-20 rounded-full text-sm">
                        {module.duration}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {module.topics.map((topic, i) => (
                        <div
                          key={i}
                          className="flex items-center text-sm text-[#4A4A4A]"
                        >
                          <svg
                            className="w-4 h-4 text-[#FF8A80] mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {topic}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Enrollment Card */}
          <div>
            <motion.div
              className="sticky top-8 bg-white rounded-2xl shadow-lg p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#4A4A4A]">
                    ${courseData.price}
                  </div>
                  <div className="text-sm text-[#4A4A4A] opacity-75 mt-1">
                    One-time payment
                  </div>
                </div>

                <button className="w-full bg-[#FF8A80] text-white py-4 px-6 rounded-xl hover:bg-opacity-90 transition-colors font-medium text-lg shadow-sm">
                  Enroll Now
                </button>

                <div className="space-y-4">
                  {courseData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center text-[#4A4A4A]"
                    >
                      <svg
                        className="w-5 h-5 text-[#B8E0E6] mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <button className="w-full border-2 border-[#B8E0E6] text-[#4A4A4A] py-3 px-6 rounded-xl hover:bg-[#B8E0E6] hover:bg-opacity-10 transition-colors font-medium">
                    Download Syllabus
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
