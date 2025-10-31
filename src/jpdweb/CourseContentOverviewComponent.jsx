import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { customerApi } from "./api/customerApi";
import { API_RESPONSE_TYPES, showErrorNotification, showWarningNotification, showSuccessNotification } from "./api/apiClient";
import { reportApi } from "./api/reportApi";
import { feedbackApi } from "./api/feedbackApi";
import CourseContentComponent from "./CourseContentComponent";

export default function CourseContentOverviewComponent(){
  const { id } = useParams();
  const nav = useNavigate();
  
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(null);
  const [error, setError] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState(new Set([0]));
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [isFinish,setFinish]=useState(false)
  // Current content state
  const [currentContent, setCurrentContent] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [currentContentType, setCurrentContentType] = useState(null);
  const [feedbackRate, setFeedbackRate] = useState(0);

  // Report popup states
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [reportType, setReportType] = useState('');
  const [reportDetail, setReportDetail] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Feedback popup states
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [feedbackDetail, setFeedbackDetail] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const reportTypes = [
    { value: 'INAPPROPRIATE_CONTENT', label: 'Nội dung phản cảm, tục tĩu, không phù hợp' },
    { value: 'MISLEADING_INFORMATION', label: 'Thông tin sai lệch hoặc gây hiểu nhầm' },
    { value: 'COPYRIGHT_VIOLATION', label: 'Vi phạm bản quyền' },
    { value: 'DISCRIMINATION_OR_HATE', label: 'Ngôn từ thù ghét hoặc phân biệt đối xử' },
    { value: 'POOR_QUALITY', label: 'Chất lượng khóa học kém' },
    { value: 'SCAM_OR_FRAUD', label: 'Lừa đảo hoặc yêu cầu thanh toán bất hợp pháp' },
    { value: 'RELIGIOUS_OR_POLITICAL_CONTENT', label: 'Nội dung tôn giáo hoặc chính trị không phù hợp' },
    { value: 'OTHER', label: 'Khác' }
  ];

  const handleError = (response) => {
    switch (response.responseType) {
      case API_RESPONSE_TYPES.UNAUTHORIZED:
        showWarningNotification("Bạn không có quyền truy cập khóa học này")
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

  const handleFeedback = async () => {
    if (!feedbackDetail.trim()) {
      showWarningNotification("Vui lòng nhập nội dung phản hồi");
      return;
    }
    

    setIsSubmittingFeedback(true);
    
    try {
      const response = await feedbackApi.createFeedback(id, feedbackDetail.trim(),feedbackRate);
     
      if (response.success) {
        showSuccessNotification("Cảm ơn bạn đã gửi phản hồi!");
        setShowFeedbackPopup(false);
        setFeedbackDetail('');
      } else {
        showErrorNotification("Không thể gửi phản hồi, vui lòng thử lại");
      }
    } catch (error) {
      showErrorNotification("Có lỗi xảy ra khi gửi phản hồi");
      console.error("Feedback error:", error);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const loadCourseOverview = async () => {
    setIsLoading(true);
    
    const response = await customerApi.loadContentOverview(id);
   
    if (response.success) {
      const data = response.data;
     
      setCourseData(data);
    
      // Auto load first content
      if (data.chapters && data.chapters.length > 0) {
        const firstChapter = data.chapters[0];
        if (firstChapter.modules && firstChapter.modules.length > 0) {
          const firstModule = firstChapter.modules[0];
          if (firstModule.contentTypes && firstModule.contentTypes.length > 0) {
            await handleContentClick(firstChapter, firstModule, firstModule.contentTypes[0]);
          }
        }
      }
    } else {
      handleError(response)
    } 
    setIsLoading(false);
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    
    if (!reportType) {
      showWarningNotification("Vui lòng chọn loại báo cáo");
      return;
    }
    
    if (!reportDetail.trim()) {
      showWarningNotification("Vui lòng nhập chi tiết báo cáo");
      return;
    }

    setIsSubmittingReport(true);
    
    try {
      const reportData = {
        type: reportType,
        detail: reportDetail.trim(),
        courseId: parseInt(id)
      };

      const response = await reportApi.createReport(reportData);
      
      if (response.success) {
        showSuccessNotification("Báo cáo của bạn đã được gửi thành công");
        setShowReportPopup(false);
        setReportType('');
        setReportDetail('');
      } else {
        showErrorNotification("Không thể gửi báo cáo, vui lòng thử lại");
      }
    } catch (error) {
      showErrorNotification("Có lỗi xảy ra khi gửi báo cáo");
      console.error("Report error:", error);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleCloseReportPopup = () => {
    if (!isSubmittingReport) {
      setShowReportPopup(false);
      setReportType('');
      setReportDetail('');
    }
  };

  const handleCloseFeedbackPopup = () => {
    if (!isSubmittingFeedback) {
      setShowFeedbackPopup(false);
      setFeedbackDetail('');
    }
  };

  useEffect(() => {
    if (id) {
      loadCourseOverview()
    }
  }, [id])
 const onComplete = async () => {
  // Đã check finish rồi nên chắc chắn chưa hoàn thành
  if(!isFinish){
  try {
    setLoadingContent(`${currentModule.moduleId}-${currentContentType}`);
    
    const response = await customerApi.finishContent(
      id, 
      currentModule.moduleId, 
      currentContentType
    );

    if (response.success) {
      // Cập nhật courseData - THÊM TRỰC TIẾP không cần check
      setCourseData(prevData => {
        if (!prevData || !prevData.chapters) return prevData;

        return {
          ...prevData,
          chapters: prevData.chapters.map(chapter => ({
            ...chapter,
            modules: chapter.modules?.map(module => {
              if (module.moduleId === currentModule.moduleId) {
                return {
                  ...module,
                  customerModuleContents: [
                    ...(module.customerModuleContents || []),
                    {
                      cqId: response.data?.cqId || Date.now(),
                      availableRequest: response.data?.availableRequest || 5,
                      typeOfContent: [currentContentType]
                    }
                  ]
                };
              }
              return module;
            })
          }))
        };
      });

      showSuccessNotification('Bạn đã hoàn thành nội dung', currentContentType);
      setFinish(true);
      
    } else {
      showWarningNotification(response.message || "Không lưu thành công");
    }
    
  } catch (error) {
    console.error('Error finishing content:', error);
    showWarningNotification("Có lỗi xảy ra, vui lòng thử lại!");
  } finally {
    setLoadingContent(null);
  }
}
};
   
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
const checkFinish = (moduleId, contentType, allModules) => {
  // Tìm module theo moduleId
  const module = allModules?.find(m => m.moduleId === moduleId);
  
  if (!module) {
    return false;
  }
  
  // Kiểm tra hoàn thành
  return module.customerModuleContents?.some(
    content => content.typeOfContent?.includes(contentType)
  ) || false;
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
      setLoadingContent(null);
    } else {
      const contents = response.data;
      setCurrentContent(contents);
      setCurrentChapter(chapter);
      setCurrentModule(module);
      setCurrentContentType(contentType);
      setLoadingContent(null);
      const isFinished = checkFinish(module.moduleId, contentType, chapter.modules);
  
      setFinish(isFinished)
    }
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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            {courseData.name}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span>{overallProgress}% completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Side - Content Area */}
        <div className="flex-1 flex flex-col bg-black">
          {/* Content Display */}
          <div className="flex-1 overflow-auto">
            {currentContent ? (
            <div className="w-full max-w-[1400px] mx-auto px-8 py-6">
                <CourseContentComponent contents={currentContent}
                moduleid={currentModule.moduleId}
                  contentType={currentContentType}
                  language={courseData.language}
                  isFinish={isFinish}
                  onComplete={onComplete}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z"/>
                  </svg>
                  <p className="text-lg">Chọn một nội dung để bắt đầu học</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex items-center space-x-4">
                <button 
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  onClick={() => setShowFeedbackPopup(true)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                  </svg>
                  <span>Gửi phản hồi</span>
                </button>

                <button 
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  onClick={() => setShowReportPopup(true)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <span>Báo cáo</span>
                </button>
              </div>

              {currentModule && (
                <div className="text-sm text-gray-300">
                  <span className="font-medium">{currentModule.titleOfModule}</span>
                  {currentContentType && (
                    <span className="ml-2 text-gray-400">• {formatContentType(currentContentType)}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Course Structure */}
        <div className="w-96 bg-gray-800 border-l border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-bold text-white mb-4">Nội dung khóa học</h2>
            
            <div className="space-y-2">
              {chapters.map((chapter, chapterIndex) => {
                const isChapterExpanded = expandedChapters.has(chapterIndex);
                const chapterModules = chapter.modules || [];

                return (
                  <div key={chapterIndex}>
                    <div
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg cursor-pointer transition ${
                        isChapterExpanded 
                          ? 'bg-gray-700 text-white' 
                          : 'text-gray-300 hover:bg-gray-700/50'
                      }`}
                      onClick={() => toggleChapter(chapterIndex)}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          isChapterExpanded ? 'rotate-90' : ''
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                      </svg>

                      <div className="flex-1">
                        <div className="font-semibold text-sm">
                          {chapterIndex + 1}. {chapter.chapterName}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {chapterModules.length} bài học
                        </div>
                      </div>
                    </div>

                    {isChapterExpanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {chapterModules.map((module) => {
                          const moduleKey = `ch${chapterIndex}-mod${module.moduleId}`;
                          const isModuleExpanded = expandedModules.has(moduleKey);
                          const contentTypes = module.contentTypes || [];
                          const isCurrentModule = currentModule?.moduleId === module.moduleId;

                          return (
                            <div key={module.moduleId}>
    <div
      className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition text-sm ${
        isModuleExpanded
          ? 'bg-gray-700 text-white'
          : isCurrentModule
          ? 'bg-blue-900/30 text-blue-300'
          : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
      }`}
      onClick={() => toggleModule(moduleKey)}
    >
      <svg
        className={`w-4 h-4 transition-transform ${
          isModuleExpanded ? 'rotate-90' : ''
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
      </svg>

      <div className="flex-1 min-w-0">
        <div className="truncate">{module.titleOfModule}</div>
        <div className="text-xs text-gray-500 mt-0.5">
          {contentTypes.length} nội dung
          {/* Hiển thị số content đã hoàn thành */}
         <span className="ml-2 text-green-400">
  ({
    contentTypes.filter(type => 
      module.customerModuleContents?.some(
        content => content.typeOfContent?.includes(type)
      )
    ).length
  }/{contentTypes.length} hoàn thành)
</span>
        </div>
      </div>

      {/* Icon check nếu module hoàn thành tất cả content */}
      {module.customerModuleContents?.length === contentTypes.length && contentTypes.length > 0 && (
        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
        </svg>
      )}
    </div>

    {isModuleExpanded && (
      <div className="ml-6 mt-1 space-y-1">
        {contentTypes.map((contentType, contentIndex) => {
          const isLoadingThis = loadingContent === `${module.moduleId}-${contentType}`;
          const isActive = 
            isCurrentModule && 
            currentContentType === contentType;
          
          // Kiểm tra xem content type này đã hoàn thành chưa
          const isCompleted = module.customerModuleContents?.some(
    content => content.typeOfContent?.includes(contentType)
    
  );

          return (
            <div
              key={contentIndex}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition text-sm ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : isCompleted
                  ? 'bg-green-900/30 text-green-300 hover:bg-green-800/40'
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
              } ${isLoadingThis ? 'opacity-60 cursor-wait' : ''}`}
              onClick={() => {
                if (!loadingContent) {
                  handleContentClick(chapter, module, contentType);
                }
              }}
            >
              <div className="flex-shrink-0">
                {isLoadingThis ? (
                  <div className="animate-spin">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m6.364 1.636l-.707.707M21 12h-1m1.364 6.364l-.707-.707M12 21v-1m-6.364-1.636l.707-.707M3 12h1M3.636 5.636l.707.707"/>
                    </svg>
                  </div>
                ) : (
                  getContentIcon(mapContentType(contentType))
                )}
              </div>

              <span className="flex-1 truncate">
                {formatContentType(contentType)}
              </span>

              {/* Hiển thị icon check cho content đã hoàn thành */}
              {isCompleted && !isActive && (
                <svg className="w-4 h-4 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              )}

              {/* Hiển thị icon active cho content đang xem */}
              {isActive && (
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
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

            {/* Progress Summary */}
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Tiến độ học tập</span>
                <span className="font-bold">{overallProgress}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-400">
                <div>
                  <span className="text-green-400 font-bold">{completedModules}</span> Hoàn thành
                </div>
                <div>
                  <span className="text-blue-400 font-bold">{totalModules - completedModules}</span> Còn lại
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

      {/* Feedback Popup */}
      {showFeedbackPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Gửi phản hồi</h2>
              <button
                onClick={handleCloseFeedbackPopup}
                disabled={isSubmittingFeedback}
                className="text-gray-400 hover:text-white transition disabled:opacity-50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
  <label className="block text-sm font-bold text-gray-300 mb-2">
    Mức độ hài lòng <span className="text-red-500">*</span>
  </label>
  <div className="flex items-center space-x-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setFeedbackRate(star)} 
        disabled={isSubmittingFeedback}
        className={`text-3xl transition ${
          star <= feedbackRate ? "text-yellow-400" : "text-gray-500"
        } hover:scale-110`}
      >
        ★
      </button>
    ))}
  </div>
  <p className="text-sm text-gray-400 mt-2">
    {feedbackRate === 0
      ? "Vui lòng chọn số sao (1-5)"
      : `Bạn đã chọn ${feedbackRate} sao`}
  </p>
</div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Nội dung phản hồi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={feedbackDetail}
                  onChange={(e) => setFeedbackDetail(e.target.value)}
                  disabled={isSubmittingFeedback}
                  placeholder="Chia sẻ suy nghĩ của bạn về khóa học này... Chúng tôi rất mong nhận được phản hồi của bạn để cải thiện chất lượng!"
                  rows="6"
                  className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                />
                
                <p className="mt-2 text-sm text-gray-400">
                  Hãy cho chúng tôi biết điều gì bạn thích hoặc muốn cải thiện trong khóa học này.
                </p>
              </div>

              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  <div className="text-sm text-blue-300">
                    <p className="font-medium mb-1">Lưu ý:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Phản hồi của bạn giúp chúng tôi cải thiện khóa học</li>
                      <li>Thông tin của bạn sẽ được bảo mật tuyệt đối</li>
                      <li>Chúng tôi có thể liên hệ để biết thêm chi tiết nếu cần</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleCloseFeedbackPopup}
                  disabled={isSubmittingFeedback}
                  className="flex-1 px-6 py-3 border-2 border-gray-600 text-gray-300 font-bold rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleFeedback}
                  disabled={isSubmittingFeedback || !feedbackDetail.trim()}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmittingFeedback ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                      </svg>
                      <span>Gửi phản hồi</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Popup */}
      {showReportPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Báo cáo khóa học</h2>
              <button
                onClick={handleCloseReportPopup}
                disabled={isSubmittingReport}
                className="text-gray-400 hover:text-white transition disabled:opacity-50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-300 mb-3">
                  Loại báo cáo <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {reportTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                        reportType === type.value
                          ? 'border-red-500 bg-red-900/30'
                          : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reportType"
                        value={type.value}
                        checked={reportType === type.value}
                        onChange={(e) => setReportType(e.target.value)}
                        disabled={isSubmittingReport}
                        className="mt-1 mr-3 accent-red-500"
                      />
                      <div>
                        <div className="font-medium text-white">{type.label}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Chi tiết báo cáo <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reportDetail}
                  onChange={(e) => setReportDetail(e.target.value)}
                  disabled={isSubmittingReport}
                  placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải với khóa học này..."
                  rows="6"
                  className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/50 outline-none transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                />
                <p className="mt-2 text-sm text-gray-400">
                  Tối thiểu 10 ký tự. Hãy cung cấp thông tin cụ thể để chúng tôi có thể xử lý tốt hơn.
                </p>
              </div>

              <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <div className="text-sm text-yellow-300">
                    <p className="font-medium mb-1">Lưu ý:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Báo cáo sai sự thật có thể bị xử lý</li>
                      <li>Chúng tôi sẽ xem xét báo cáo trong vòng 24-48 giờ</li>
                      <li>Thông tin của bạn sẽ được bảo mật</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleCloseReportPopup}
                  disabled={isSubmittingReport}
                  className="flex-1 px-6 py-3 border-2 border-gray-600 text-gray-300 font-bold rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReport || !reportType || !reportDetail.trim()}
                  className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmittingReport ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                      </svg>
                      <span>Gửi báo cáo</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}