import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function CourseContentOverviewComponent(){

  const contentOverview = {
    "courseName": "Tiếng Anh Giao Tiếp Cơ Bản",
    "moduleType": [
      {
        "moduleName": "Chào hỏi và giới thiệu bản thân",
        "content": [
          {
            "type": "video",
            "title": "Video: Các mẫu câu chào hỏi"
          },
          {
            "type": "listening",
            "title": "Luyện nghe: Đoạn hội thoại 1"
          },
          {
            "type": "speakingPassage",
            "title": "Luyện nói: Đọc theo mẫu câu"
          },
          {
            "type": "multipleChoice",
            "title": "Bài tập trắc nghiệm: Chọn câu trả lời đúng"
          },
          {
            "type": "flashcard",
            "title": "Ôn tập: Từ vựng về gia đình và bạn bè"
          }
        ]
      },
      {
        "moduleName": "Hỏi đường và chỉ đường",
        "content": [
          {
            "type": "video",
            "title": "Video: Các cụm từ chỉ phương hướng"
          },
          {
            "type": "writing",
            "title": "Viết đoạn văn mô tả đường đi từ A đến B"
          },
          {
            "type": "gapfill",
            "title": "Điền từ vào chỗ trống: Đoạn văn chỉ đường"
          },
          {
            "type": "speakingPicture",
            "title": "Luyện nói: Mô tả bức tranh về một địa điểm"
          },
          {
            "type": "multipleChoice",
            "title": "Bài tập trắc nghiệm: Tình huống chỉ đường"
          }
        ]
      }
    ]
  }

  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Icon mapping cho từng loại content
  const getContentIcon = (type) => {
    const icons = {
      video: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      ),
      listening: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
      ),
      speakingPassage: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
        </svg>
      ),
      speakingPicture: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
      ),
      multipleChoice: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      flashcard: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      ),
      writing: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
      ),
      gapfill: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
      )
    };
    return icons[type] || icons.video;
  };

  // Tính toán progress cho module
  const getModuleProgress = (moduleIndex) => {
    // Tạm thời return random progress, thay thế bằng logic thực tế
    const progresses = [100, 60, 0]; // Ví dụ: module 1 hoàn thành, module 2 60%, module 3 chưa bắt đầu
    return progresses[moduleIndex] || 0;
  };

  useEffect(() => {
    async function fetchdata() {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCourseData(contentOverview);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchdata();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-2" style={{borderColor: '#1e88e5'}}></div>
      </div>
    );
  }

  if (!courseData || !courseData.moduleType) {
    return (
      <div className="mx-auto pt-8 mt-10 mb-10">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
          <div className="p-8 text-center text-gray-500">
            <p>No course data found.</p>
          </div>
        </div>
      </div>
    );
  }

  const modules = courseData.moduleType;
  const completedModules = modules.filter((_, index) => getModuleProgress(index) === 100).length;
  const overallProgress = modules.length > 0 ? Math.round((completedModules / modules.length) * 100) : 0;

  return (
    <div className="mx-auto pt-8 mt-10 mb-10">
      <section className="p-4 mb-5 mt-10" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md text-left">
          <h1 className="text-4xl font-bold" style={{color: '#243864'}}>
            {courseData.courseName}
          </h1>
          <p className="text-lg mt-2 text-gray-600">Khóa học gồm {modules.length} modules</p>
        </div>
      </section>

      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md flex flex-col lg:flex-row gap-6">
        {/* MODULES CONTENT */}
        <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-lg overflow-hidden p-8">
          <h2 className="text-2xl font-bold mb-8 text-left" style={{color: '#243864'}}>
            Learning Path
          </h2>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-16 top-8 bottom-0 w-1 bg-gray-200 z-0"></div>
            
            {modules.map((module, moduleIndex) => {
              const progress = getModuleProgress(moduleIndex);
              const isCompleted = progress === 100;
              const isAvailable = moduleIndex === 0 || getModuleProgress(moduleIndex - 1) === 100;
              
              return (
                <div key={moduleIndex} className="relative mb-12 last:mb-0">
                  {/* Step Circle */}
                  <div className="flex items-start">
                    <div className="relative z-10 flex-shrink-0">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                        style={{
                          backgroundColor: isCompleted 
                            ? '#4caf50' 
                            : isAvailable 
                              ? '#1e88e5' 
                              : '#9e9e9e'
                        }}
                      >
                        {isCompleted ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        ) : (
                          <span>{moduleIndex + 1}</span>
                        )}
                      </div>
                      
                      {/* Step Label */}
                      <div 
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white px-2 py-1 rounded text-xs font-bold"
                        style={{backgroundColor: '#e53935'}}
                      >
                        MODULE
                      </div>
                    </div>
                    
                    {/* Module Content */}
                    <div className="ml-6 flex-1">
                      <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition duration-200 border border-gray-200">
                        <h3 className="text-xl font-semibold mb-3" style={{color: '#243864'}}>
                          {module.moduleName}
                        </h3>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600">Progress</span>
                            <span className="text-sm font-medium" style={{color: '#243864'}}>
                              {progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${progress}%`,
                                backgroundColor: isCompleted ? '#4caf50' : '#1e88e5'
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Content List */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Nội dung bài học:</h4>
                          <div className="space-y-2">
                            {module.content.map((item, contentIndex) => (
                              <div key={contentIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                                <div style={{color: '#1e88e5'}}>
                                  {getContentIcon(item.type)}
                                </div>
                                <span>{item.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            {isCompleted && (
                              <span 
                                className="text-xs font-medium px-2 py-1 rounded-full text-white"
                                style={{backgroundColor: '#4caf50'}}
                              >
                                Completed
                              </span>
                            )}
                            {!isCompleted && isAvailable && (
                              <span 
                                className="text-xs font-medium px-2 py-1 rounded-full text-white"
                                style={{backgroundColor: '#1e88e5'}}
                              >
                                Available
                              </span>
                            )}
                            {!isAvailable && (
                              <span className="bg-gray-400 text-white text-xs font-medium px-2 py-1 rounded-full">
                                Locked
                              </span>
                            )}
                          </div>
                          
                          <button
                            className={`font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300 hover:scale-105 text-white ${
                              !isAvailable ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            style={{
                              backgroundColor: isCompleted ? '#4caf50' : '#1e88e5'
                            }}
                            onClick={() => {
                              if (isAvailable) {
                                // Navigate to module
                                console.log(`Navigate to module ${moduleIndex + 1}: ${module.moduleName}`);
                              }
                            }}
                            disabled={!isAvailable}
                          >
                            {isCompleted ? 'Review' : 'Start Learning'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDEBAR: Progress Summary */}
        <div className="w-full lg:w-1/3 rounded-xl shadow-lg p-6" style={{backgroundColor: '#f3f4f6'}}>
          <h2 className="text-xl font-bold mb-4" style={{color: '#243864'}}>
            Your Progress
          </h2>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span style={{color: '#243864'}}>Overall Completion</span>
                <span className="font-medium" style={{color: '#243864'}}>
                  {overallProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${overallProgress}%`,
                    background: 'linear-gradient(to right, #1e88e5, #4caf50)'
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-medium mb-2" style={{color: '#243864'}}>
                Modules Status
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="text-sm font-semibold" style={{color: '#4caf50'}}>
                    {completedModules}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="text-sm font-semibold" style={{color: '#1e88e5'}}>
                    {modules.filter((_, i) => getModuleProgress(i) > 0 && getModuleProgress(i) < 100).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Locked</span>
                  <span className="text-sm font-semibold text-gray-500">
                    {modules.filter((_, i) => i > 0 && getModuleProgress(i - 1) < 100).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-medium mb-2" style={{color: '#243864'}}>
                Time Working Recommend For You
              </h3>
              <div className="flex justify-between space-x-1 h-20">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const heights = ['30%', '60%', '40%', '80%', '50%', '20%', '10%'];
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center justify-end">
                      <div
                        className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                        style={{ 
                          height: heights[index],
                          background: 'linear-gradient(to top, #1e88e5, #64b5f6)'
                        }}
                      ></div>
                      <span className="text-xs mt-1 text-gray-600">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-medium" style={{color: '#243864'}}>
                Learning Streak
              </h3>
              <p className="text-3xl font-bold mt-2" style={{color: '#1e88e5'}}>
                7 Days
              </p>
              <p className="text-sm text-gray-600">Keep going! You're making great progress.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}