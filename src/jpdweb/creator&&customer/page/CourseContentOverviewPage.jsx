import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { customerApi } from "../../api/customer/customerApi";
import { API_RESPONSE_TYPES, showErrorNotification, showWarningNotification, showSuccessNotification } from "../../api/core/apiClient";
import { reportApi } from "../../api/system/reportApi";
import { feedbackApi } from "../../api/system/feedbackApi";
import CourseContentComponent from "../component/CourseContentComponent";
import CommentComponent from "../component/CommentComponent";

export default function CourseContentOverviewPage(){
  const { id } = useParams();
  const nav = useNavigate();
  
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(null);
  const [error, setError] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState(new Set([0]));
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [isFinish,setFinish]=useState(false)
  
  // ========== THÊM STATE CHẾ ĐỘ TẬP TRUNG ==========
  const [isFocusMode, setIsFocusMode] = useState(false);
  
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
  const [hiddenComment,setHiddentComment]=useState(true)
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

  // ========== XỬ LÝ ESC KEY ĐỂ THOÁT FOCUS MODE ==========
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
      }
    };

    if (isFocusMode) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isFocusMode]);

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
    
    if (feedbackRate === 0) {
      showWarningNotification("Vui lòng chọn mức độ hài lòng");
      return;
    }

    setIsSubmittingFeedback(true);
    
    try {
      const response = await feedbackApi.createFeedback(id, feedbackDetail.trim(), feedbackRate);
     
      if (response.success) {
        showSuccessNotification("Cảm ơn bạn đã gửi phản hồi!");
        setShowFeedbackPopup(false);
        setFeedbackDetail('');
        setFeedbackRate(0);
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
      setFeedbackRate(0);
    }
  };

  useEffect(() => {
    if (id) {
      loadCourseOverview()
    }
  }, [id])
  
  const onComplete = async () => {
    if(!isFinish){
      try {
        setLoadingContent(`${currentModule.moduleId}-${currentContentType}`);
        
        const response = await customerApi.finishContent(
          id, 
          currentModule.moduleId, 
          currentContentType
        );

        if (response.success) {
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
    const module = allModules?.find(m => m.moduleId === moduleId);
    
    if (!module) {
      return false;
    }
    
    return module.customerModuleContents?.some(
      content => content.typeOfContent?.includes(contentType)
    ) || false;
  };
const numberFinish = () => {
  const chapters = courseData.chapters;
  let numberF = 0;

  chapters.forEach(chapter => {
    const modules = chapter.modules;
    modules.forEach(module => {
      numberF += module.customerModuleContents.length;
    });
  });

  return numberF;
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
        <div className="p-1.5 bg-primary-30/10 rounded-lg text-primary-30">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      ),
      listening: (
        <div className="p-1.5 bg-primary-30/10 rounded-lg text-primary-30">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728"/>
          </svg>
        </div>
      ),
      speakingPassage: (
        <div className="p-1.5 bg-primary-30/10 rounded-lg text-primary-30">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
          </svg>
        </div>
      ),
      speakingPicture: (
        <div className="p-1.5 bg-primary-30/10 rounded-lg text-primary-30">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
      ),
      multipleChoice: (
        <div className="p-1.5 bg-primary-30/10 rounded-lg text-primary-30">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      ),
      flashcard: (
        <div className="p-1.5 bg-primary-30/10 rounded-lg text-primary-30">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
        </div>
      ),
      writing: (
        <div className="p-1.5 bg-primary-30/10 rounded-lg text-primary-30">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
        </div>
      ),
      gapfill: (
        <div className="p-1.5 bg-primary-30/10 rounded-lg text-primary-30">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
      ),
      reading: (
        <div className="p-1.5 bg-primary-30/10 rounded-lg text-primary-30">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z"/>
          </svg>
        </div>
      ),
      pdf: (
        <div className="p-1.5 bg-primary-30/10 rounded-lg text-primary-30">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
        </div>
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
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-30 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="bg-surface border border-border-light shadow-medium rounded-xl px-8 py-6 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">Đã xảy ra lỗi</h3>
          <p className="text-text-secondary mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary-30 text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!courseData || !courseData.chapters) {
    return (
      <div className="p-6 text-center text-text-muted bg-background min-h-screen">
        <p>Không tìm thấy dữ liệu khóa học.</p>
      </div>
    );
  }

  const chapters = courseData.chapters || [];

const totalModules = chapters.reduce((sum, ch) => {
  if (!ch.modules) return sum; // Nếu không có modules thì bỏ qua
  const moduleCount = ch.modules.reduce(
    (innerSum, m) => innerSum + ((m.contentTypes && m.contentTypes.length) || 0),
    0
  );
  return sum + moduleCount;
}, 0);

const completedModules = numberFinish();

const overallProgress =
  totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  // ========== FOCUS MODE RENDER ==========
  if (isFocusMode && currentContent) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Focus Mode Header - Compact */}
        <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsFocusMode(false)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors group"
              title="Thoát chế độ tập trung (ESC)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            
            <div className="border-l border-gray-700 pl-4">
              <div className="text-sm font-semibold text-white">{currentModule?.titleOfModule}</div>
              <div className="text-xs text-gray-400 flex items-center space-x-2">
                <span>{formatContentType(currentContentType)}</span>
                {isFinish && (
                  <>
                    <span>•</span>
                    <span className="text-green-400">✓ Đã hoàn thành</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 hidden sm:block">Nhấn ESC để thoát</span>
          </div>
        </div>

        {/* Focus Mode Content */}
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="max-w-6xl mx-auto p-6">
            <CourseContentComponent 
              contents={currentContent}
              moduleid={currentModule.moduleId}
              contentType={currentContentType}
              language={courseData.language}
              isFinish={isFinish}
              onComplete={onComplete}
            />
          </div>
        </div>
      
      </div>
    );
  }
  if(!hiddenComment)
    return <div>
           <button 
                className="flex items-center space-x-2 px-3 py-2 bg-accent-10 text-white rounded-lg hover:bg-accent-dark transition-all duration-300 shadow-medium hover:shadow-card font-medium text-sm group"
                onClick={() => setHiddentComment((prev)=>!prev)}
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <span className="hidden sm:inline">quay lại</span>
              </button>
          <CommentComponent courseId={id}></CommentComponent>
        
    </div>
  

  // ========== NORMAL MODE RENDER ==========
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Compact Header */}
      <div className="bg-surface border-b border-border-light shadow-soft px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <h1 className="text-xl font-bold text-text-primary leading-tight">
                {courseData.name}
              </h1>
              <p className="text-text-secondary text-xs mt-0.5">Tiếp tục hành trình học tập của bạn</p>
            </div>
            
            {/* Current Module Info */}
            {currentModule && (
              <div className="hidden md:flex items-center space-x-4 pl-4 border-l border-border-light">
                <div className="text-right">
                  <div className="text-sm font-semibold text-text-primary leading-tight max-w-xs truncate">
                    {currentModule.titleOfModule}
                  </div>
                  {currentContentType && (
                    <div className="text-text-secondary text-xs mt-0.5 flex items-center space-x-1">
                      <span className="bg-background px-2 py-0.5 rounded-full border border-border-light">
                        {formatContentType(currentContentType)}
                      </span>
                      {isFinish && (
                        <span className="bg-status-completed text-white px-2 py-0.5 rounded-full">
                          Đã hoàn thành
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* ========== NÚT CHẾ ĐỘ TẬP TRUNG ========== */}
              {currentContent && (
                <button 
                  className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-medium hover:shadow-card font-medium text-sm group"
                  onClick={() => setIsFocusMode(true)}
                  title="Chế độ tập trung - Xem toàn màn hình"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                  </svg>
                  <span className="hidden sm:inline">Tập trung</span>
                </button>
              )}
            {/* Action Buttons - Moved from bottom bar */}
            
              <button 
                className="flex items-center space-x-2 px-3 py-2 bg-primary-30 text-white rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-medium hover:shadow-card font-medium text-sm group"
                onClick={() => setShowFeedbackPopup(true)}
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                </svg>
                <span className="hidden sm:inline">Phản hồi</span>
              </button>

              <button 
                className="flex items-center space-x-2 px-3 py-2 bg-accent-10 text-white rounded-lg hover:bg-accent-dark transition-all duration-300 shadow-medium hover:shadow-card font-medium text-sm group"
                onClick={() => setShowReportPopup(true)}
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <span className="hidden sm:inline">Báo cáo</span>
              </button>
              <button 
                className="flex items-center space-x-2 px-3 py-2 bg-accent-10 text-white rounded-lg hover:bg-accent-dark transition-all duration-300 shadow-medium hover:shadow-card font-medium text-sm group"
                onClick={() => setHiddentComment((prev)=>!prev)}
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <span className="hidden sm:inline">Comment</span>
              </button>
            </div>

            {/* Progress Display */}
            <div className="text-right hidden lg:block">
              <div className="text-xs text-text-secondary mb-1">Tiến độ tổng thể</div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-primary-30 to-accent-10 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-text-primary min-w-8">{overallProgress}%</span>
              </div>
            </div>
          </div>
          {!hiddenComment&&
          <CommentComponent courseId={id}></CommentComponent>}
        </div>

        {/* Mobile Progress Bar */}
        <div className="lg:hidden mt-3">
          <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
            <span>Tiến độ tổng thể</span>
            <span className="font-bold text-text-primary">{overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-primary-30 to-accent-10 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex" style={{ height: 'calc(100vh - 88px)' }}>
        {/* Left Side - Content Area */}
        <div className="flex-1 flex flex-col bg-surface rounded-tr-2xl shadow-card min-h-0">
          {/* Content Display */}
          <div className="flex-1 overflow-hidden">
            {currentContent ? (
              <div className="h-full overflow-y-auto">
                <div className="p-6">
                  <CourseContentComponent 
                    contents={currentContent}
                    moduleid={currentModule.moduleId}
                    contentType={currentContentType}
                    language={courseData.language}
                    isFinish={isFinish}
                    onComplete={onComplete}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-text-muted animate-fade-in">
                  <div className="w-24 h-24 mx-auto mb-6 bg-background rounded-2xl flex items-center justify-center shadow-medium">
                    <svg className="w-12 h-12 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">Chào mừng đến với khóa học!</h3>
                  <p className="text-text-secondary max-w-md mx-auto">Chọn một nội dung từ danh sách bên phải để bắt đầu học tập và khám phá kiến thức mới.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Course Structure */}
        <div className="w-80 bg-surface border-l border-border-light shadow-card overflow-y-auto flex-shrink-0">
          <div className="p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-text-primary">Nội dung khóa học</h2>
              <div className="text-xs text-text-secondary bg-background px-2.5 py-1 rounded-full border border-border-light">
                {totalModules} bài học
              </div>
            </div>
            
            <div className="space-y-2">
              {chapters.map((chapter, chapterIndex) => {
                const isChapterExpanded = expandedChapters.has(chapterIndex);
                const chapterModules = chapter.modules || [];

                return (
                  <div key={chapterIndex} className="bg-background rounded-lg border border-border-light overflow-hidden shadow-soft">
                    <div
                      className={`flex items-center space-x-3 px-4 py-3 cursor-pointer transition-all duration-200 ${
                        isChapterExpanded 
                          ? 'bg-primary-30/5 border-b border-border-light' 
                          : 'hover:bg-primary-30/3'
                      }`}
                      onClick={() => toggleChapter(chapterIndex)}
                    >
                      <div className={`p-1.5 rounded-lg transition-colors ${
                        isChapterExpanded ? 'bg-primary-30 text-white' : 'bg-primary-30/10 text-primary-30'
                      }`}>
                        <svg
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isChapterExpanded ? 'rotate-90' : ''
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-text-primary text-sm leading-tight">
                          {chapterIndex + 1}. {chapter.chapterName}
                        </div>
                        <div className="text-text-secondary text-xs mt-0.5 flex items-center space-x-1">
                          <span>{chapterModules.length} bài học</span>
                          <span>•</span>
                          <span className="text-status-completed font-medium">
                            {Math.round((chapterModules.filter(module => 
                              module.customerModuleContents?.length === module.contentTypes?.length
                            ).length / chapterModules.length) * 100)}% hoàn thành
                          </span>
                        </div>
                      </div>
                    </div>

                    {isChapterExpanded && (
                      <div className="p-2 space-y-1.5 animate-slide-up">
                        {chapterModules.map((module) => {
                          const moduleKey = `ch${chapterIndex}-mod${module.moduleId}`;
                          const isModuleExpanded = expandedModules.has(moduleKey);
                          const contentTypes = module.contentTypes || [];
                          const isCurrentModule = currentModule?.moduleId === module.moduleId;
                          const completedContents = contentTypes.filter(type => 
                            module.customerModuleContents?.some(content => content.typeOfContent?.includes(type))
                          ).length;

                          return (
                            <div key={module.moduleId} className="bg-white rounded-lg border border-border-light overflow-hidden shadow-soft">
                              <div
                                className={`flex items-center space-x-2 px-3 py-2.5 cursor-pointer transition-all ${
                                  isModuleExpanded
                                    ? 'bg-background border-b border-border-light'
                                    : isCurrentModule
                                    ? 'bg-primary-30/5 border-l-2 border-l-primary-30'
                                    : 'hover:bg-background'
                                }`}
                                onClick={() => toggleModule(moduleKey)}
                              >
                                <svg
                                  className={`w-3.5 h-3.5 text-text-secondary transition-transform duration-200 ${
                                    isModuleExpanded ? 'rotate-90' : ''
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                                </svg>

                                <div className="flex-1 min-w-0">
                                  <div className={`font-medium text-sm truncate ${
                                    isCurrentModule ? 'text-primary-30' : 'text-text-primary'
                                  }`}>
                                    {module.titleOfModule}
                                  </div>
                                  <div className="text-text-secondary text-xs mt-0.5 flex items-center space-x-1">
                                    <span>{contentTypes.length} nội dung</span>
                                    <span>•</span>
                                    <span className="text-status-completed font-medium">
                                      {completedContents}/{contentTypes.length} hoàn thành
                                    </span>
                                  </div>
                                </div>

                                {completedContents === contentTypes.length && contentTypes.length > 0 && (
                                  <div className="p-0.5 bg-status-completed rounded-full">
                                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                    </svg>
                                  </div>
                                )}
                              </div>

                              {isModuleExpanded && (
                                <div className="p-1.5 space-y-1 animate-scale-in">
                                  {contentTypes.map((contentType, contentIndex) => {
                                    const isLoadingThis = loadingContent === `${module.moduleId}-${contentType}`;
                                    const isActive = 
                                      isCurrentModule && 
                                      currentContentType === contentType;
                                    
                                    const isCompleted = module.customerModuleContents?.some(
                                      content => content.typeOfContent?.includes(contentType)
                                    );

                                    return (
                                      <div
                                        key={contentIndex}
                                        className={`flex items-center space-x-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-200 group ${
                                          isActive
                                            ? 'bg-primary-30 text-white shadow-medium'
                                            : isCompleted
                                            ? 'bg-status-completed/10 text-status-completed border border-status-completed/20'
                                            : 'text-text-secondary hover:bg-background hover:text-text-primary hover:shadow-soft'
                                        } ${isLoadingThis ? 'opacity-60 cursor-wait' : ''}`}
                                        onClick={() => {
                                          if (!loadingContent) {
                                            handleContentClick(chapter, module, contentType);
                                          }
                                        }}
                                      >
                                        <div className="flex-shrink-0">
                                          {isLoadingThis ? (
                                            <div className="animate-spin text-primary-30">
                                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m6.364 1.636l-.707.707M21 12h-1m1.364 6.364l-.707-.707M12 21v-1m-6.364-1.636l.707-.707M3 12h1M3.636 5.636l.707.707"/>
                                              </svg>
                                            </div>
                                          ) : (
                                            getContentIcon(mapContentType(contentType))
                                          )}
                                        </div>

                                        <span className="flex-1 truncate text-sm font-medium">
                                          {formatContentType(contentType)}
                                        </span>

                                        {isCompleted && !isActive && (
                                          <svg className="w-3.5 h-3.5 flex-shrink-0 text-status-completed" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                          </svg>
                                        )}

                                        {isActive && (
                                          <svg className="w-3.5 h-3.5 flex-shrink-0 text-white" fill="currentColor" viewBox="0 0 20 20">
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
         
          </div>
        </div>
      </div>

      {/* Feedback Popup */}
      {showFeedbackPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-surface rounded-2xl shadow-card max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border-light animate-scale-in">
            <div className="sticky top-0 bg-surface border-b border-border-light px-8 py-6 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-text-primary">Gửi phản hồi</h2>
                <p className="text-text-secondary mt-1">Chia sẻ ý kiến của bạn để chúng tôi cải thiện</p>
              </div>
              <button
                onClick={handleCloseFeedbackPopup}
                disabled={isSubmittingFeedback}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-colors disabled:opacity-50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-8">
                <label className="block text-lg font-bold text-text-primary mb-4">
                  Bạn cảm thấy thế nào về khóa học này? <span className="text-accent-10">*</span>
                </label>
                <div className="flex items-center justify-center space-x-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRate(star)} 
                      disabled={isSubmittingFeedback}
                      className={`text-5xl transition-all duration-300 transform hover:scale-110 ${
                        star <= feedbackRate ? "text-accent-10" : "text-border-dark"
                      } ${star === feedbackRate ? "animate-bounce-gentle" : ""}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <p className="text-center text-text-secondary mt-4">
                  {feedbackRate === 0
                    ? "Vui lòng chọn số sao đánh giá"
                    : `Cảm ơn bạn đã chọn ${feedbackRate} sao!`}
                </p>
              </div>

              <div className="mb-8">
                <label className="block text-lg font-bold text-text-primary mb-4">
                  Nội dung phản hồi <span className="text-accent-10">*</span>
                </label>
                <textarea
                  value={feedbackDetail}
                  onChange={(e) => setFeedbackDetail(e.target.value)}
                  disabled={isSubmittingFeedback}
                  placeholder="Hãy chia sẻ chi tiết về trải nghiệm học tập của bạn. Điều gì bạn thích? Điều gì chúng tôi có thể cải thiện?"
                  rows="6"
                  className="w-full px-5 py-4 bg-background border-2 border-border-light rounded-xl text-text-primary placeholder-text-muted focus:border-primary-30 focus:ring-4 focus:ring-primary-30/20 outline-none transition-all duration-300 resize-none disabled:bg-border-light disabled:cursor-not-allowed"
                />
                
                <p className="mt-3 text-text-secondary text-sm">
                  Phản hồi của bạn sẽ được gửi ẩn danh và giúp chúng tôi cải thiện chất lượng khóa học.
                </p>
              </div>

              <div className="bg-primary-30/5 border border-primary-30/20 rounded-xl p-5 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary-30/10 rounded-lg">
                    <svg className="w-5 h-5 text-primary-30" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className="text-text-primary">
                    <p className="font-semibold mb-2">Phản hồi của bạn rất quan trọng</p>
                    <ul className="text-sm text-text-secondary space-y-1">
                      <li>• Mọi ý kiến đều được ghi nhận và đánh giá nghiêm túc</li>
                      <li>• Thông tin cá nhân của bạn được bảo mật hoàn toàn</li>
                      <li>• Chúng tôi có thể liên hệ để làm rõ thêm nếu cần</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleCloseFeedbackPopup}
                  disabled={isSubmittingFeedback}
                  className="flex-1 px-6 py-4 border-2 border-border-light text-text-primary font-bold rounded-xl hover:bg-background transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleFeedback}
                  disabled={isSubmittingFeedback || !feedbackDetail.trim() || feedbackRate === 0}
                  className="flex-1 px-6 py-4 bg-primary-30 text-white font-bold rounded-xl hover:bg-primary-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-medium"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-surface rounded-2xl shadow-card max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border-light animate-scale-in">
            <div className="sticky top-0 bg-surface border-b border-border-light px-8 py-6 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-text-primary">Báo cáo vấn đề</h2>
                <p className="text-text-secondary mt-1">Giúp chúng tôi duy trì chất lượng nội dung</p>
              </div>
              <button
                onClick={handleCloseReportPopup}
                disabled={isSubmittingReport}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-colors disabled:opacity-50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="p-6">
              <div className="mb-8">
                <label className="block text-lg font-bold text-text-primary mb-4">
                  Loại vấn đề <span className="text-accent-10">*</span>
                </label>
                <div className="grid gap-3">
                  {reportTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        reportType === type.value
                          ? 'border-accent-10 bg-accent-10/5 shadow-soft'
                          : 'border-border-light hover:border-border-dark hover:shadow-soft bg-background'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reportType"
                        value={type.value}
                        checked={reportType === type.value}
                        onChange={(e) => setReportType(e.target.value)}
                        disabled={isSubmittingReport}
                        className="mt-1 mr-4 text-accent-10 focus:ring-accent-10"
                      />
                      <div>
                        <div className="font-semibold text-text-primary">{type.label}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-lg font-bold text-text-primary mb-4">
                  Mô tả chi tiết <span className="text-accent-10">*</span>
                </label>
                <textarea
                  value={reportDetail}
                  onChange={(e) => setReportDetail(e.target.value)}
                  disabled={isSubmittingReport}
                  placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải. Càng chi tiết, chúng tôi càng có thể xử lý nhanh chóng và hiệu quả hơn..."
                  rows="6"
                  className="w-full px-5 py-4 bg-background border-2 border-border-light rounded-xl text-text-primary placeholder-text-muted focus:border-accent-10 focus:ring-4 focus:ring-accent-10/20 outline-none transition-all duration-300 resize-none disabled:bg-border-light disabled:cursor-not-allowed"
                />
                <p className="mt-3 text-text-secondary text-sm">
                  Tối thiểu 10 ký tự. Thông tin bạn cung cấp sẽ được bảo mật.
                </p>
              </div>

              <div className="bg-accent-10/5 border border-accent-10/20 rounded-xl p-5 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-accent-10/10 rounded-lg">
                    <svg className="w-5 h-5 text-accent-10" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className="text-text-primary">
                    <p className="font-semibold mb-2">Trước khi gửi báo cáo</p>
                    <ul className="text-sm text-text-secondary space-y-1">
                      <li>• Đảm bảo thông tin bạn cung cấp là chính xác và trung thực</li>
                      <li>• Báo cáo sai sự thật có thể ảnh hưởng đến tài khoản của bạn</li>
                      <li>• Chúng tôi sẽ xem xét và phản hồi trong vòng 24-48 giờ</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleCloseReportPopup}
                  disabled={isSubmittingReport}
                  className="flex-1 px-6 py-4 border-2 border-border-light text-text-primary font-bold rounded-xl hover:bg-background transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReport || !reportType || !reportDetail.trim()}
                  className="flex-1 px-6 py-4 bg-accent-10 text-white font-bold rounded-xl hover:bg-accent-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-medium"
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