import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CourseContentOverviewComponent(){

  const contentOverview = {
    "courseName": "Tiếng Anh Giao Tiếp Cơ Bản",
    "moduleType": [
      {
        "moduleName": "Chào hỏi và giới thiệu bản thân",
        "content": [
          { "id":9,
            "type": "video",
            "title": "Video: Các mẫu câu chào hỏi"
          },
          { "id":7,
            "type": "listening",
            "title": "Luyện nghe: Đoạn hội thoại 1"
          },
          { "id":5,
            "type": "speakingPassage",
            "title": "Luyện nói: Đọc theo mẫu câu"
          },
          {  "id":3,
            "type": "multipleChoice",
            "title": "Bài tập trắc nghiệm: Chọn câu trả lời đúng"
          },
          {  "id":1,
            "type": "flashcard",
            "title": "Ôn tập: Từ vựng về gia đình và bạn bè"
          }
        ]
      },
      {
        "moduleName": "Hỏi đường và chỉ đường",
        "content": [
          { "id":9,
            "type": "video",
            "title": "Video: Các cụm từ chỉ phương hướng"
          },
          {"id":4,
            "type": "writing",
            "title": "Viết đoạn văn mô tả đường đi từ A đến B"
          },
          { "id":2,
            "type": "gapfill",
            "title": "Điền từ vào chỗ trống: Đoạn văn chỉ đường"
          },
          {"id":6,
            "type": "speakingPicture",
            "title": "Luyện nói: Mô tả bức tranh về một địa điểm"
          },
          { "id":3,
            "type": "multipleChoice",
            "title": "Bài tập trắc nghiệm: Tình huống chỉ đường"
          }
        ]
      }
    ]
  }

  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedModules, setExpandedModules] = useState(new Set([0])); // Module đầu tiên mở sẵn
  const nav=useNavigate()
  // Icon mapping cho từng loại content - Size lớn hơn
  const getContentIcon = (type) => {
    const icons = {
      video: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      listening: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z"/>
        </svg>
      ),
      speakingPassage: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
        </svg>
      ),
      speakingPicture: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      ),
      multipleChoice: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      flashcard: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
      ),
      writing: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
      ),
      gapfill: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      )
    };
    return icons[type] || icons.video;
  };

  // Tính toán progress cho module
  const getModuleProgress = (moduleIndex) => {
    const progresses = [100, 60, 0];
    return progresses[moduleIndex] || 0;
  };

  // Toggle module expansion
  const toggleModule = (moduleIndex) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleIndex)) {
      newExpanded.delete(moduleIndex);
    } else {
      newExpanded.add(moduleIndex);
    }
    setExpandedModules(newExpanded);
  };

  // Get folder icon based on module status - Size lớn hơn
  const getFolderIcon = (moduleIndex, isExpanded) => {
    const progress = getModuleProgress(moduleIndex);
    const isCompleted = progress === 100;
    const isAvailable = moduleIndex === 0 || getModuleProgress(moduleIndex - 1) === 100;
    
    if (isExpanded) {
      return (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"/>
        </svg>
      );
    }
    
    return (
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
      </svg>
    );
  };

  useEffect(() => {
    async function fetchdata() {
      setIsLoading(true);
      try {
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
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!courseData || !courseData.moduleType) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No course data found.</p>
      </div>
    );
  }

  const modules = courseData.moduleType;
  const completedModules = modules.filter((_, index) => getModuleProgress(index) === 100).length;
  const overallProgress = modules.length > 0 ? Math.round((completedModules / modules.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">
            {courseData.courseName}
          </h1>
          <div className="flex items-center mt-3 space-x-4 text-base text-gray-600">
            <span className="font-medium">{modules.length} modules</span>
            <span>•</span>
            <span className="font-medium">{overallProgress}% completed</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Course Structure - File Explorer Style */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Toolbar */}
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50 rounded-t-lg">
            <div className="flex items-center space-x-3 text-base text-gray-700 font-medium">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
              </svg>
              <span>Course Content</span>
            </div>
          </div>

          {/* File Tree */}
          <div className="p-4">
            {modules.map((module, moduleIndex) => {
              const progress = getModuleProgress(moduleIndex);
              const isCompleted = progress === 100;
              const isAvailable = moduleIndex === 0 || getModuleProgress(moduleIndex - 1) === 100;
              const isExpanded = expandedModules.has(moduleIndex);

              return (
                <div key={moduleIndex} className="mb-2">
                  {/* Module Folder */}
                  <div
                    className={`flex items-center space-x-4 px-4 py-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
                      isExpanded ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
                    }`}
                    onClick={() => toggleModule(moduleIndex)}
                  >
                    {/* Expand/Collapse Arrow */}
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>

                    {/* Folder Icon */}
                    <div className={`${
                      isCompleted 
                        ? 'text-green-500' 
                        : isAvailable 
                          ? 'text-blue-500' 
                          : 'text-gray-400'
                    }`}>
                      {getFolderIcon(moduleIndex, isExpanded)}
                    </div>

                    {/* Module Name */}
                    <div className="flex-1 flex items-center justify-between">
                      <span className={`text-lg font-semibold ${
                        isAvailable ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        Module {moduleIndex + 1}: {module.moduleName}
                      </span>
                      
                      {/* Status Indicators */}
                      <div className="flex items-center space-x-3">
                        {isCompleted && (
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        )}
                        {!isCompleted && isAvailable && progress > 0 && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        )}
                        {!isAvailable && (
                          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                          </svg>
                        )}
                        <span className={`text-base font-bold px-3 py-1 rounded-full ${
                          isCompleted 
                            ? 'text-green-700 bg-green-100'
                            : isAvailable && progress > 0
                              ? 'text-blue-700 bg-blue-100'
                              : 'text-gray-500 bg-gray-100'
                        }`}>
                          {progress}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Module Content (Files) */}
                  {isExpanded && (
                    <div className="ml-10 mt-3 border-l-2 border-gray-200 pl-6 py-2">
                      {module.content.map((item, contentIndex) => (
                        <div
                          key={contentIndex}
                          className="flex items-center space-x-4 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150 group"
                          onClick={() => {
                            if (isAvailable) {
                              nav(`/course/content/${1}/${item.id}`)
                            }
                          }}
                        >
                          
                          {/* Content Icon */}
                          <div className={`${isAvailable ? 'text-gray-600' : 'text-gray-300'}`}>
                            {getContentIcon(item.type)}
                          </div>

                          {/* Content Title */}
                          <span className={`text-base flex-1 ${
                            isAvailable ? 'text-gray-700 font-medium' : 'text-gray-400'
                          }`}>
                            {item.title}
                          </span>

                          {/* File Actions */}
                          {isAvailable && (
                            <button className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-all duration-150">
                              Start
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Learning Progress</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="text-4xl font-bold text-green-600 mb-2">{completedModules}</div>
              <div className="text-base font-medium text-green-700">Completed</div>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {modules.filter((_, i) => getModuleProgress(i) > 0 && getModuleProgress(i) < 100).length}
              </div>
              <div className="text-base font-medium text-blue-700">In Progress</div>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-4xl font-bold text-gray-500 mb-2">
                {modules.filter((_, i) => i > 0 && getModuleProgress(i - 1) < 100).length}
              </div>
              <div className="text-base font-medium text-gray-600">Locked</div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-8">
            <div className="flex justify-between text-lg font-medium text-gray-700 mb-3">
              <span>Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}