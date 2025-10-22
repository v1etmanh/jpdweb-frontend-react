import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { customerApi } from "./api/customerApi";
import { API_RESPONSE_TYPES, showErrorNotification, showWarningNotification } from "./api/apiClient";
export default function CourseContentOverviewComponent(){
  const { id } = useParams();
  const nav = useNavigate();
  
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(null);
  const [error, setError] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState(new Set([0]));
  const [expandedModules, setExpandedModules] = useState(new Set());
  const handleError = (response) => {
    switch (response.responseType) {
      case API_RESPONSE_TYPES.UNAUTHORIZED:
        showWarningNotification("Bạn không có quyền truy cập khóa học này")
        // Redirect to course list
        nav('/courses')
        break
      
      case API_RESPONSE_TYPES.NOT_FOUND:
        showWarningNotification("Khóa học không được tìm thấy")
        nav('/courses')
        break
      
      case API_RESPONSE_TYPES.CONFLICT:
        showWarningNotification("Có lỗi xảy ra với khóa học này")
        break
      
      default:
        showWarningNotification("Có lỗi xảy ra, vui lòng thử lại sau")
        console.error("Error:", response.traceId, response.message)
    }
  }
   
    const loadCourseOverview = async () => {
      setIsLoading(true);
      
        const response = await customerApi.loadContentOverview(id);
        
        if (response.success) {
       
        

        const data = response.data;
        setCourseData(data);
        }
       else {
       handleError(response)
      } 
        setIsLoading(false);
      
    };
 useEffect(() => {
    if (id) {
      loadCourseOverview()
    }
  }, [id])
   

  const mapContentType = (type) => {
    const typeMap = {
      'VIDEO': 'video',
      'LISTEN_CHOICE': 'listening',
      'SPEAKING_PASSAGE': 'speakingPassage',
      'SPEAKING_PICTURE': 'speakingPicture',
      'MULTIPLE_CHOICE': 'multipleChoice',
      'FLASHCARD': 'flashcard',
      'WRITING': 'writing',
      'GAPFILL': 'gapfill',
      'READING': 'reading',
      'PDF': 'pdf'
    };
    return typeMap[type] || 'video';
  };

  const formatContentType = (type) => {
    return type
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getContentIcon = (type) => {
    const icons = {
      video: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      listening: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728"/>
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
      ),
      reading: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z"/>
        </svg>
      ),
      pdf: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
      )
    };
    return icons[type] || icons.video;
  };

  const toggleChapter = (chapterIndex) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterIndex)) {
      newExpanded.delete(chapterIndex);
    } else {
      newExpanded.add(chapterIndex);
    }
    setExpandedChapters(newExpanded);
  };

  const toggleModule = (moduleKey) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleKey)) {
      newExpanded.delete(moduleKey);
    } else {
      newExpanded.add(moduleKey);
    }
    setExpandedModules(newExpanded);
  };

  const handleContentClick = async (chapter, module, contentType) => {
    
      const contentKey = `${module.moduleId}-${contentType}`;
      setLoadingContent(contentKey);
      
      const response = await customerApi.loadModuleContent(id, chapter.chapterId, module.moduleId, contentType);

    if(!response.success){
      handleError(response)
    }
else{
      const contents = response.data;
        const languageMap = {
    'ENGLISH': 'en-US',
    'VIETNAMESE': 'vi-VN',
    'CHINESE': 'zh-CN',
    'JAPANESE': 'ja-JP',
    'KOREAN': 'ko-KR',
    'FRENCH': 'fr-FR',
    'GERMAN': 'de-DE',
    'SPANISH': 'es-ES',
    'ITALIAN': 'it-IT',
    'RUSSIAN': 'ru-RU',
  };
      // ✅ Fixed: Navigate with contentType in URL, pass contents in state
      nav(`/course/content/${module.moduleId}/${contentType}?language=${languageMap[courseData.language]}&teachingLanguage=${languageMap[courseData.teachingLanguage]}`, {
        state: { contents }
      });
    }
      setLoadingContent(null);
    
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!courseData || !courseData.chapters) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No course data found.</p>
      </div>
    );
  }

  const chapters = courseData.chapters;
  const totalModules = chapters.reduce((sum, ch) => sum + (ch.modules?.length || 0), 0);
  const completedModules = Math.floor(totalModules * 0.3);
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">
            {courseData.name}
          </h1>
          <div className="flex items-center mt-3 space-x-4 text-base text-gray-600">
            <span className="font-medium">{totalModules} modules</span>
            <span>•</span>
            <span className="font-medium">{chapters.length} chapters</span>
            <span>•</span>
            <span className="font-medium">{overallProgress}% completed</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50 rounded-t-lg">
            <div className="flex items-center space-x-3 text-base text-gray-700 font-medium">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
              </svg>
              <span>Course Structure</span>
            </div>
          </div>

          <div className="p-4">
            {chapters.map((chapter, chapterIndex) => {
              const isChapterExpanded = expandedChapters.has(chapterIndex);
              const chapterModules = chapter.modules || [];

              return (
                <div key={chapterIndex} className="mb-4">
                  <div
                    className={`flex items-center space-x-4 px-4 py-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
                      isChapterExpanded ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
                    }`}
                    onClick={() => toggleChapter(chapterIndex)}
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                          isChapterExpanded ? 'rotate-90' : ''
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>

                    <div className="text-blue-500">
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                      </svg>
                    </div>

                    <div className="flex-1">
                      <span className="text-lg font-semibold text-gray-900">
                        Chapter {chapterIndex + 1}: {chapter.chapterName}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        {chapterModules.length} module(s)
                      </p>
                    </div>
                  </div>

                  {isChapterExpanded && (
                    <div className="ml-4 mt-3 border-l-2 border-blue-200 pl-4 space-y-2">
                      {chapterModules.map((module) => {
                        const moduleKey = `ch${chapterIndex}-mod${module.moduleId}`;
                        const isModuleExpanded = expandedModules.has(moduleKey);
                        const contentTypes = module.contentTypes || [];

                        return (
                          <div key={module.moduleId}>
                            <div
                              className={`flex items-center space-x-4 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                isModuleExpanded ? 'bg-purple-50 border border-purple-200' : 'border border-transparent'
                              }`}
                              onClick={() => toggleModule(moduleKey)}
                            >
                              <div className="w-6 h-6 flex items-center justify-center">
                                <svg
                                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                                    isModuleExpanded ? 'rotate-90' : ''
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                                </svg>
                              </div>

                              <div className="text-purple-500">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                                </svg>
                              </div>

                              <div className="flex-1">
                                <span className="font-semibold text-gray-900">
                                  {module.titleOfModule}
                                </span>
                                <p className="text-sm text-gray-500">
                                  {contentTypes.length} content(s)
                                </p>
                              </div>
                            </div>

                            {isModuleExpanded && (
                              <div className="ml-8 mt-2 border-l-2 border-purple-200 pl-4 space-y-1">
                                {contentTypes.map((contentType, contentIndex) => {
                                  const isLoadingThis = loadingContent === `${module.moduleId}-${contentType}`;

                                  return (
                                    <div
                                      key={contentIndex}
                                      className={`flex items-center space-x-4 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group ${
                                        isLoadingThis ? 'opacity-60 cursor-wait' : ''
                                      }`}
                                      onClick={() => {
                                        if (!loadingContent) {
                                          handleContentClick(chapter, module, contentType);
                                        }
                                      }}
                                    >
                                      <div className="text-gray-600">
                                        {isLoadingThis ? (
                                          <div className="animate-spin">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m6.364 1.636l-.707.707M21 12h-1m1.364 6.364l-.707-.707M12 21v-1m-6.364-1.636l.707-.707M3 12h1M3.636 5.636l.707.707"/>
                                            </svg>
                                          </div>
                                        ) : (
                                          getContentIcon(mapContentType(contentType))
                                        )}
                                      </div>

                                      <span className="text-sm font-medium text-gray-700 flex-1">
                                        {formatContentType(contentType)}
                                      </span>

                                      {!loadingContent && (
                                        <button className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-all duration-150">
                                          Start
                                        </button>
                                      )}
                                      {isLoadingThis && (
                                        <span className="text-xs text-blue-600 font-medium">Loading...</span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Learning Progress</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="text-4xl font-bold text-green-600 mb-2">{completedModules}</div>
              <div className="text-base font-medium text-green-700">Completed</div>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">{totalModules - completedModules}</div>
              <div className="text-base font-medium text-blue-700">Remaining</div>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-4xl font-bold text-gray-600 mb-2">{chapters.length}</div>
              <div className="text-base font-medium text-gray-700">Chapters</div>
            </div>
          </div>

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