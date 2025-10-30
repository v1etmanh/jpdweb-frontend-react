import React, { useEffect, useRef, useState } from 'react';
import { 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  Folder,
  FileText,
  Video,
  Brain,
  Headphones,
  CheckSquare,
  Edit,
  Mic,
  PenTool,
  MicIcon,
  Trash2,
  Save,
  X,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import VideoUploadForm from './VideoPlayerForm';
import PdfUploadForm from './PdfFormComponent';
import ListeningChoiceForm from './ListenChoiceForm';
import MultipleChoiceForm from './MultipleChoiceForm';
import FlashCardForm from './FlashcardForm';
import GapFillForm from './GapfillForm';
import ReadingQuestionForm from './ReadingQuestionForm';
import SpeakingPassageForm from './SpeakingPassageForm';
import WritingQuestionForm from './WritingQuestionForm';
import SpeakingPictureForm from './SpeakingPictureForm';
import { useNavigate, useParams } from 'react-router-dom';
import {
  updateCourse, 
 
} from './api/ApiConnect';
import { creatorApi } from './api/creatorApi';
import { API_RESPONSE_TYPES, showSuccessNotification, showWarningNotification } from './api/apiClient';
import { apiclient } from './api/BaseApi';

// Content type mapping
const CONTENT_TYPES = {
  FLASHCARD: { icon: Brain, label: "Flashcard", color: "text-blue-600" },
  VIDEO: { icon: Video, label: "Video Upload", color: "text-green-600" },
  LISTEN_CHOICE: { icon: Headphones, label: "Listening Choice", color: "text-purple-600" },
  MULTIPLE_CHOICE: { icon: CheckSquare, label: "Multiple Choice", color: "text-orange-600" },
  GAPFILL: { icon: Edit, label: "Gap Fill", color: "text-indigo-600" },
  READING: { icon: BookOpen, label: "Reading Question", color: "text-teal-600" },
  SPEAKING_PASSAGE: { icon: Mic, label: "Speaking Passage", color: "text-pink-600" },
  SPEAKING_PICTURE: { icon: MicIcon, label: "Speaking Picture", color: "text-rose-600" },
  WRITING: { icon: PenTool, label: "Writing Question", color: "text-amber-600" },
  PDF: { icon: FileText, label: "PDF Document", color: "text-amber-600" }
};

const CourseManagementInterface = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const tempIdCounter = useRef(-1);
  
  // State management
  const [courseMetadata, setCourseMetadata] = useState(null);
  const [loadedContents, setLoadedContents] = useState({}); // Cache for loaded contents
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState(new Set());
  const [expandedModules, setExpandedModules] = useState(new Set());
  
  // Layout states  
  const [sidebarWidth, setSidebarWidth] = useState(350);
  const [isResizing, setIsResizing] = useState(false);
  
  // Modal states
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showContentDropdown, setShowContentDropdown] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [editingModule, setEditingModule] = useState(null);
  const [selectedChapterForModule, setSelectedChapterForModule] = useState(null);
  const [selectedModuleForContent, setSelectedModuleForContent] = useState(null);
//
const handleApiError = (response, defaultMessage = 'Có lỗi xảy ra') => {
    const message = response.message || defaultMessage

    switch (response.responseType) {
      case API_RESPONSE_TYPES.UNAUTHORIZED:
        showWarningNotification('Bạn không có quyền thực hiện tác vụ này')
        break

      case API_RESPONSE_TYPES.NOT_FOUND:
        showWarningNotification('Tài nguyên không được tìm thấy')
        break

      case API_RESPONSE_TYPES.CONFLICT:
        showWarningNotification(message || 'Dữ liệu bị xung đột')
        break

      case API_RESPONSE_TYPES.VALIDATION_ERROR:
        showWarningNotification('Dữ liệu không hợp lệ')
        console.error('Validation errors:', response.details)
        break

      default:
        showWarningNotification(message)
        console.error('API Error:', {
          status: response.status,
          code: response.code,
          traceId: response.traceId,
          details: response.details
        })
    }
  }
  // Load course metadata only
  useEffect(() => {
    fetchCourseMetadata();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // Auto save metadata when changes
  useEffect(() => {
    if (courseMetadata && courseId) {
      localStorage.setItem(`course_metadata_${courseId}`, JSON.stringify(courseMetadata));
    }
  }, [courseMetadata, courseId]);

  // 📥 Fetch course metadata (without full moduleContent)
  const fetchCourseMetadata = async () => {
  
      const cached = localStorage.getItem(`course_metadata_${courseId}`);
      if (cached) {
        try{
        const parsed = JSON.parse(cached);
        setCourseMetadata(normalizeMetadata(parsed));
        // neu chapter do dai lon .0
       setupInitialExpanded(parsed)
        setLoading(false);
        return;
        }catch(e){
           console.warn('Cache parse error:', e)
        }
      }
      // setup expand chapter and expand module
      // chức năng về UI nó cho phép khi render ta sẽ mặc định ban đầu list các content từ chapter tới module ở chapter 1
      // sau này mỗi khi người dùng click 1 chapter khác ta sẽ thêm nó vào dựa vào nó ta sẽ có cách để render riêng 

      setLoading(true);
      //loading sẽ hiển thị trạng thái  tải để tránh lỗi
      const response = await creatorApi.getCourseById(courseId);
      if(response.success){
      const data = response.data;
      
      const normalized = normalizeMetadata(data);
      setCourseMetadata(normalized);
      localStorage.setItem(`course_metadata_${courseId}`, JSON.stringify(normalized));

     setupInitialExpanded(data)

    } else  {
      handleApiError(response, 'Không thể tải thông tin khóa học')
      setCourseMetadata({ chapters: [], public: false });
    }
      setLoading(false);
    
  };

  //
 const handleBeforeCreateContent = async(chapterId, moduleId, type) => {
  // Tìm chapter
  const chapter = courseMetadata.chapters.find(ch => ch.chapterId === chapterId)
  
  if (!chapter) {
    showWarningNotification('Chương không tồn tại')
    return
  }
  
  // Tìm module trong chapter
  const module = chapter.modules.find(m => m.moduleId === moduleId)
  
  if (!module) {
    showWarningNotification('Mô-đun không tồn tại')
    return
  }
  
  // Check xem contentType có tồn tại không
  if (!module.contentTypes.includes(type)) {
    
    return
  }
  
  // Nếu tất cả valid, load content
  await handleSelectContentType(chapterId, moduleId, type)
}
  //
  const setupInitialExpanded = (data) => {
    if (data.chapters?.length > 0) {
      setExpandedChapters(new Set([data.chapters[0].chapterId]))

      if (data.chapters[0].modules?.length > 0) {
        setExpandedModules(new Set([data.chapters[0].modules[0].moduleId]))
      }
    }
  }
/*
ta hiểu được cơ chế ban đầu sẽ là load data vào local storage  từ api

*/
  // Normalize metadata structure (remove moduleContent, keep contentTypes)
  //chuẩn hóa dữ liệu giúp ta tránh null ở các chapter và module
  const normalizeMetadata = (data) => {
    if (!data.chapters) data.chapters = [];
    
    data.chapters = data.chapters.map(chapter => ({
      ...chapter,
      modules: (chapter.modules || []).map(module => ({
        moduleId: module.moduleId,
        titleOfModule: module.titleOfModule,
        createDate: module.createDate,
        orderInChapter: module.orderInChapter,
        contentTypes: module.contentTypes || []
      }))
    }));
    
    return data;
  };

  // 📤 Lazy load content by type when user clicks on content type
  // hàm sau tải data bằng content type và moduleId +chapter id course Id
  // vì là lazyload nó chỉ dc tải khi ta click vào 
  // ta sẽ  chekc nếu nội dung đã được tải rồi thì ta ko tải nữa 
  const fetchContentByType = async (chapterId, moduleId, contentType) => {
    const cacheKey = `${courseId}_${chapterId}_${moduleId}_${contentType}`;
    
    // Check cache first
    if (loadedContents[cacheKey]) {
      return loadedContents[cacheKey];
    }

    setContentLoading(true);
   
      const response = await creatorApi.getContentByType( courseId,chapterId,moduleId, contentType);
      console.log(response)

      // Cache the loaded content
       if (response.success){
      setLoadedContents(prev => ({
        ...prev,
        [cacheKey]: response.data
      }));
     setContentLoading(false)
      return response.data;
    }
    else{
     //  handleApiError(response, 'Không thể tải nội dung')
     setContentLoading(false)
      return []
    }
  };

  // Save module content to server
  const saveModuleContent = async (chapterId, moduleId, updateData) => {
    const data = {
      courseId: courseId,
      chapterId: chapterId,
      moduleId: moduleId,
      moduleContent: updateData
    };
    
    
      const response = await creatorApi.updateModuleContent(courseId, chapterId, moduleId, data);
      
      // Update cache with saved content
      if(response.success){
      const contentType = updateData[0]?.typeOfContent;
      if (contentType) {
        const cacheKey = `${courseId}_${chapterId}_${moduleId}_${contentType}`;
        setLoadedContents(prev => ({
          ...prev,
          [cacheKey]: response.data
        }));
      }
      
     showSuccessNotification("Save Successfull")
    }
    else{
    handleApiError(response,"fail to fetch content ")
      
    }
  };

  // Toggle expand/collapse
  const toggleChapter = (chapterId) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };
  //toggle là cái drop down của các chapter và module nó có chức năng khi ta click vào chapter nó sẽ ghi lại
  // dựa vào đó chapter nào drop sẽ dc xác định
  // nếu ta click lại vào 1 chapter đã và dang toggg thì ta đóng nó lại 

  const toggleModule = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  // CRUD Operations for Chapter
  const handleAddChapter = async (chapterName) => {
    if (!chapterName.trim()) {
      showWarningNotification('Vui lòng nhập tên chương')
      return
    }
      const response =  await creatorApi.createChapter(courseId, chapterName.trim())
 if (response.success) {
      const createdChapter = {
        ...response.data,
        modules: response.data.modules || []
      };

      setCourseMetadata({
        ...courseMetadata,
        chapters: [...(courseMetadata.chapters || []), createdChapter]
      });

      setShowChapterForm(false);
 }
      else {
      handleApiError(response, 'Không thể thêm chương')
    }
    
  };

  const handleUpdateChapter = async(chapterId, newName) => {
    if (!newName.trim()) {
      showWarningNotification('Vui lòng nhập tên chương')
      return
    }
      const response =  await creatorApi.updateChapter( newName.trim(),chapterId,courseId)
      if(response.success){
    setCourseMetadata({
      ...courseMetadata,
      chapters: courseMetadata.chapters.map(chapter =>
        chapter.chapterId === chapterId
          ? { ...chapter, chapterName: newName }
          : chapter
      )
    });
     setEditingChapter(null);
  }
  else{
     handleApiError(response, 'Không thể update chương')
  }
   
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm('Are you sure you want to delete this chapter?')) return;

   
    const response=  await creatorApi.deleteChapter(courseId, chapterId);

      // Clear related cache
      if(response.success){
      const keysToDelete = Object.keys(loadedContents).filter(key => 
        key.includes(`${courseId}_${chapterId}_`)
      );
      setLoadedContents(prev => {
        const newCache = { ...prev };
        keysToDelete.forEach(key => delete newCache[key]);
        return newCache;
      });

      setCourseMetadata({
        ...courseMetadata,
        chapters: courseMetadata.chapters.filter(chapter => chapter.chapterId !== chapterId)
      });
    }
    else{
     handleApiError(response,"Server gap loi trong qua trinh xu li deletechapter")
    }
  };

  // CRUD Operations for Module
  const handleAddModule = async (chapterId, moduleTitle) => {
  
      const response = await creatorApi.createModule(courseId, chapterId, moduleTitle);
       if (response.success) {
      const createdModule = {
        ...response.data,
        contentTypes: response.data.contentTypes || []
      };

      setCourseMetadata({
        ...courseMetadata,
        chapters: (courseMetadata.chapters || []).map(chapter =>
          chapter.chapterId === chapterId
            ? {
                ...chapter,
                modules: [...(chapter.modules || []), createdModule]
              }
            : chapter
        )
      });

      setShowModuleForm(false);
      setSelectedChapterForModule(null);
       }
       else{
       handleApiError(response, 'Không thể thêm mô-đun')
       }
  };

  const handleUpdateModule = async(chapterId, moduleId, newTitle) => {
     if (!newTitle.trim()) {
      showWarningNotification('Vui lòng nhập tên chương')
      return
    }
      const response =  await creatorApi.updateModule( newTitle.trim(),moduleId,chapterId,courseId)
      if(response.success){
    setCourseMetadata({
      ...courseMetadata,
      chapters: courseMetadata.chapters.map(chapter =>
        chapter.chapterId === chapterId
          ? {
              ...chapter,
              modules: chapter.modules.map(module =>
                module.moduleId === moduleId
                  ? { ...module, titleOfModule: newTitle }
                  : module
              )
            }
          : chapter
      )
    });
    setEditingModule(null);
  }
  else{
   handleApiError(response, 'Không thể update mô-đun')
  }
  };

  const handleDeleteModule = async (chapterId, moduleId) => {
    if (!window.confirm('Are you sure you want to delete this module?')) return;

    
     const response= await  creatorApi.deleteModule(courseId, chapterId, moduleId);

      // Clear related cache
      if (response.success) {
      const keysToDelete = Object.keys(loadedContents).filter(key => 
        key.includes(`${courseId}_${chapterId}_${moduleId}_`)
      );
      setLoadedContents(prev => {
        const newCache = { ...prev };
        keysToDelete.forEach(key => delete newCache[key]);
        return newCache;
      });

      setCourseMetadata({
        ...courseMetadata,
        chapters: courseMetadata.chapters.map(chapter =>
          chapter.chapterId === chapterId
            ? {
                ...chapter,
                modules: chapter.modules.filter(module => module.moduleId !== moduleId)
              }
            : chapter
        )
      });
    }
     else {
          handleApiError(response, 'Không thể xóa mô-đun')
        }
    
  };

  // Handle content selection with lazy loading
  //khi 1 modulecontent dc chọn ta gọi api để lấy content đso và chuyển nó về dạng object
  // {[{mcid,...},{}],moduleId, chapterId}
  const handleSelectContentType = async (chapterId, moduleId, contentType) => {
    try {
      const contents = await fetchContentByType(chapterId, moduleId, contentType);
      
      handleSelectItem('content', {
        0: contents[0] || createEmptyContent(contentType),
        ...contents.slice(1).reduce((acc, item, idx) => {
          acc[idx + 1] = item;
          return acc;
        }, {}),
        chapterId,
        moduleId
      });
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  // Update content in cache
  const handleUpdateContent = (chapterId, moduleId, mcId, updatedData) => {
    const contentType = updatedData[0]?.typeOfContent;
    if (!contentType) return;

    const cacheKey = `${courseId}_${chapterId}_${moduleId}_${contentType}`;
    const cachedContent = loadedContents[cacheKey] || [];

    const toUpdate = updatedData.filter(u =>
      cachedContent.some(content => content.mcId === u.mcId)
    );
    
    const toAdd = updatedData
      .filter(u => !u.mcId || !cachedContent.some(content => content.mcId === u.mcId))
      .map(u => ({ ...u, mcId: u.mcId ?? tempIdCounter.current-- }));

    const updatedCache = cachedContent.map(content => {
      const found = toUpdate.find(u => u.mcId === content.mcId);
      return found ? { ...content, ...found } : content;
    });

    setLoadedContents(prev => ({
      ...prev,
      [cacheKey]: [...updatedCache, ...toAdd]
    }));

    // Update contentTypes in metadata if new type added
    if (toAdd.length > 0) {
      setCourseMetadata(prev => ({
        ...prev,
        chapters: prev.chapters.map(ch =>
          ch.chapterId === chapterId
            ? {
                ...ch,
                modules: ch.modules.map(mod =>
                  mod.moduleId === moduleId
                    ? {
                        ...mod,
                        contentTypes: Array.from(new Set([...(mod.contentTypes || []), contentType]))
                      }
                    : mod
                )
              }
            : ch
        )
      }));
    }
  };

   const handleDeleteContent = async (chapterId, moduleId, mcId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
     
     const response=   await  creatorApi.deleteModuleContent(courseId, chapterId, moduleId, mcId);
        
        // Update cache
        if(response.success){
        Object.keys(loadedContents).forEach(key => {
          if (key.includes(`${courseId}_${chapterId}_${moduleId}_`)) {
            setLoadedContents(prev => ({
              ...prev,
              [key]: prev[key].filter(content => content.mcId !== mcId)
            }));
          }
        });
      }
      else{
        handleApiError(response, 'Không thể xóa content')
      }
        
      
    }
  }; 

 const handleDeleteTypeOfContent = async (chapterId, moduleId, typeOfContent) => {
    if (window.confirm(`Are you sure you want to delete all ${typeOfContent} contents in this module?`)) {
     
     const response=   await creatorApi.deleteContentByType(typeOfContent, moduleId, chapterId, courseId);
    if(response.success){
        // Clear cache for this type
        const cacheKey = `${courseId}_${chapterId}_${moduleId}_${typeOfContent}`;
        setLoadedContents(prev => {
          const newCache = { ...prev };
          delete newCache[cacheKey];
          return newCache;
        });

        // Update metadata
        setCourseMetadata(prev => ({
          ...prev,
          chapters: prev.chapters.map(ch =>
            ch.chapterId === chapterId
              ? {
                  ...ch,
                  modules: ch.modules.map(mod =>
                    mod.moduleId === moduleId
                      ? {
                          ...mod,
                          contentTypes: mod.contentTypes.filter(type => type !== typeOfContent)
                        }
                      : mod
                  )
                }
              : ch
          )
        }));
      }else{
       handleApiError(response, 'Không thể xóa  content type nafy ')
      }
    }
  }; 

  // Create empty content based on type
  const createEmptyContent = (contentType) => {
    const baseContent = {
      mcId: Date.now(),
      typeOfContent: contentType
    };
  
    switch (contentType) {
      case 'FLASHCARD':
        return { ...baseContent, word: '', meaning: '', imageUrl: null };
      case 'GAPFILL':
        return { ...baseContent, questionText: '', feedback: '' };
      case 'MULTIPLE_CHOICE':
        return { ...baseContent, questionText: '', feedback: '' };
      case 'VIDEO':
        return { ...baseContent, titleVideo: '', videoUrl: '', capacityMB: 0, durationMinutes: 0 };
      case 'WRITING':
        return { ...baseContent, question: '', requirements: null, imageUrl: null };
      case 'LISTEN_CHOICE':
        return { ...baseContent, question: '', audioUrl: '', options: [] };
      case 'READING':
        return { ...baseContent, title: '', content: '', readingQuestion: [] };
      case 'SPEAKING_PASSAGE':
        return { ...baseContent, passage: '', title: '' };
      case 'SPEAKING_PICTURE':
        return { ...baseContent, pictureUrl: '', speakingPictureListQuestions: [] };
      case 'PDF':
        return { ...baseContent, pdfUrl: '', titlePdf: '', capacityMB: 0 };
      default:
        return baseContent;
    }
  };

  // Save course data
  const handleSaveCourse = async () => {
    try {
      await updateCourse(courseId, courseMetadata);
      alert('Course saved successfully!');
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course');
    }
  };

  // Handle item selection
  const handleSelectItem = (type, data) => {
    setSelectedItem({ type, data });
  };

  // Resize handler for sidebar
  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    
    const newWidth = e.clientX;
    if (newWidth >= 280 && newWidth <= 500) {
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResizing]);

  // Render header
  const renderHeader = () => (
    <div className="bg-white border-b border-gray-200 shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Quay lại</span>
        </button>
        
        <div className="h-6 w-px bg-gray-300"></div>
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {courseMetadata?.name || 'Course Management'}
            </h1>
            <p className="text-xs text-gray-500">Quản lý nội dung khóa học</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4" />
            <span>{courseMetadata?.chapters?.length || 0} chương</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>
              {(courseMetadata?.chapters || []).reduce((sum, chapter) => 
                sum + ((chapter.modules || []).length), 0)} mô-đun
            </span>
          </div>
        </div>
        
        <button
          onClick={handleSaveCourse}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span className="font-medium">Lưu</span>
        </button>
      </div>
    </div>
  );

  // Render left sidebar
  const renderLeftSidebar = () => {
    if (loading) {
      return (
        <div 
          className="bg-white border-r border-gray-200 overflow-hidden flex items-center justify-center"
          style={{ width: sidebarWidth }}
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-sm text-gray-500">Đang tải...</span>
          </div>
        </div>
      );
    }

    return (
      <div 
        className="bg-white border-r border-gray-200 overflow-hidden flex flex-col relative"
        style={{ width: sidebarWidth }}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div 
            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 group ${
              selectedItem?.type === 'course' 
                ? 'bg-white shadow-sm ring-2 ring-blue-200' 
                : 'hover:bg-white hover:shadow-sm'
            }`}
            onClick={() => handleSelectItem('course', courseMetadata)}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate text-sm">
                  {courseMetadata.name}
                </h3>
                <p className="text-xs text-gray-500">Khóa học</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowChapterForm(true);
              }}
              className="p-1.5 hover:bg-blue-100 rounded-lg flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Thêm chương"
            >
              <Plus className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {courseMetadata.chapters?.map((chapter) => (
            <div key={chapter.chapterId} className="space-y-1">
              {/* Chapter Item */}
              <div 
                className={`group flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedItem?.type === 'chapter' && selectedItem?.data?.chapterId === chapter.chapterId
                    ? 'bg-green-50 ring-2 ring-green-200 shadow-sm'
                    : 'hover:bg-gray-50 hover:shadow-sm'
                }`}
              >
                <div 
                  className="flex items-center gap-2.5 flex-1 min-w-0"
                  onClick={() => handleSelectItem('chapter', chapter)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleChapter(chapter.chapterId);
                    }}
                    className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    {expandedChapters.has(chapter.chapterId) ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  
                  <div className="p-1.5 bg-yellow-100 rounded-md">
                    <Folder className="w-3.5 h-3.5 text-yellow-600" />
                  </div>
                  
                  {editingChapter === chapter.chapterId ? (
                    <input
                      type="text"
                      defaultValue={chapter.chapterName}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                      onBlur={(e) => handleUpdateChapter(chapter.chapterId, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateChapter(chapter.chapterId, e.target.value);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800 truncate">
                          {chapter.chapterName}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                          {chapter.modules?.length || 0}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Chapter Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingChapter(chapter.chapterId);
                    }}
                    className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                    title="Sửa chương"
                  >
                    <Edit className="w-3 h-3 text-gray-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedChapterForModule(chapter.chapterId);
                      setShowModuleForm(true);
                    }}
                    className="p-1 hover:bg-green-200 rounded-md transition-colors"
                    title="Thêm mô-đun"
                  >
                    <Plus className="w-3 h-3 text-green-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChapter(chapter.chapterId);
                    }}
                    className="p-1 hover:bg-red-200 rounded-md transition-colors"
                    title="Xóa chương"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              </div>

              {/* Modules List */}
              {expandedChapters.has(chapter.chapterId) && (
                <div className="ml-8 space-y-1">
                  {chapter.modules?.map((module) => (
                    <div key={module.moduleId} className="space-y-1">
                      {/* Module Item */}
                      <div
                        className={`group flex items-center justify-between p-2 rounded-md cursor-pointer transition-all duration-200 ${
                          selectedItem?.type === 'module' && selectedItem?.data?.moduleId === module.moduleId
                            ? 'bg-purple-50 ring-2 ring-purple-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div 
                          className="flex items-center gap-2 flex-1 min-w-0"
                          onClick={() => handleSelectItem('module', { ...module, chapterId: chapter.chapterId })}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleModule(module.moduleId);
                            }}
                            className="p-0.5 hover:bg-gray-200 rounded transition-colors"
                          >
                            {expandedModules.has(module.moduleId) ? (
                              <ChevronDown className="w-3 h-3 text-gray-500" />
                            ) : (
                              <ChevronRight className="w-3 h-3 text-gray-500" />
                            )}
                          </button>
                          
                          <div className="p-1 bg-indigo-100 rounded">
                            <FileText className="w-3 h-3 text-indigo-600" />
                          </div>
                          
                          {editingModule === module.moduleId ? (
                            <input
                              type="text"
                              defaultValue={module.titleOfModule}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                              autoFocus
                              onBlur={(e) => handleUpdateModule(chapter.chapterId, module.moduleId, e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleUpdateModule(chapter.chapterId, module.moduleId, e.target.value);
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-700 truncate">
                                  {module.titleOfModule}
                                </span>
                                <span className="text-xs text-gray-400 bg-gray-100 px-1 py-0.5 rounded">
                                  {module.contentTypes?.length || 0}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Module Actions */}
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingModule(module.moduleId);
                            }}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Sửa mô-đun"
                          >
                            <Edit className="w-2.5 h-2.5 text-gray-500" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedModuleForContent({ chapterId: chapter.chapterId, moduleId: module.moduleId });
                              setShowContentDropdown(true);
                            }}
                            className="p-1 hover:bg-blue-200 rounded transition-colors"
                            title="Thêm nội dung"
                          >
                            <Plus className="w-2.5 h-2.5 text-blue-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteModule(chapter.chapterId, module.moduleId);
                            }}
                            className="p-1 hover:bg-red-200 rounded transition-colors"
                            title="Xóa mô-đun"
                          >
                            <Trash2 className="w-2.5 h-2.5 text-red-500" />
                          </button>
                        </div>
                      </div>

                      {/* Content Types List */}
                      {expandedModules.has(module.moduleId) && (
                        <div className="ml-6 space-y-0.5">
                          {(module.contentTypes || []).map((type) => {
                            const ContentIcon = CONTENT_TYPES[type]?.icon || FileText;
                            const iconColor = CONTENT_TYPES[type]?.color || "text-gray-600";

                            return (
                              <div
                                key={type}
                                className={`group flex items-center justify-between p-2 rounded-md cursor-pointer transition-all duration-200 ${
                                  selectedItem?.type === 'content' &&
                                  selectedItem?.data?.[0]?.typeOfContent === type &&
                                  selectedItem?.data?.chapterId === chapter.chapterId &&
                                  selectedItem?.data?.moduleId === module.moduleId
                                    ? 'bg-orange-50 ring-2 ring-orange-200'
                                    : 'hover:bg-gray-50'
                                }`}
                                onClick={() => handleSelectContentType(chapter.chapterId, module.moduleId, type)}
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <div className="p-1 bg-white rounded shadow-sm">
                                    <ContentIcon className={`w-3 h-3 ${iconColor}`} />
                                  </div>
                                  <span className="text-xs text-gray-600 truncate">
                                    {CONTENT_TYPES[type]?.label || type}
                                  </span>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTypeOfContent(chapter.chapterId, module.moduleId, type);
                                  }}
                                  className="p-1 hover:bg-red-200 rounded opacity-0 group-hover:opacity-100 transition-all"
                                  title={`Xóa tất cả ${CONTENT_TYPES[type]?.label || type}`}
                                >
                                  <Trash2 className="w-2 h-2 text-red-500" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Resize Handle */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-1 bg-transparent hover:bg-blue-200 cursor-col-resize group transition-colors"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gray-300 group-hover:bg-blue-400 rounded-l transition-colors"></div>
        </div>
      </div>
    );
  };

        {/* Chapters List */}
        <div className="p-4 space-y-2">
          {courseMetadata.chapters?.map((chapter) => (
            <div key={chapter.chapterId}>
              {/* Chapter Item */}
              <div 
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedItem?.type === 'chapter' && selectedItem?.data?.chapterId === chapter.chapterId
                    ? 'bg-green-100 border-2 border-green-300'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div 
                  className="flex items-center gap-2 flex-1 min-w-0"
                  onClick={() => handleSelectItem('chapter', chapter)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleChapter(chapter.chapterId);
                    }}
                    className="p-0.5 hover:bg-gray-200 rounded flex-shrink-0"
                  >
                    {expandedChapters.has(chapter.chapterId) ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  <Folder className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                  
                  {editingChapter === chapter.chapterId ? (
                    <input
                      type="text"
                      defaultValue={chapter.chapterName}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                      autoFocus
                      onBlur={(e) => handleUpdateChapter(chapter.chapterId, e.target.value)}
                     onKeyDown={(e) => {
  if (e.key === 'Enter') {
    handleUpdateChapter(chapter.chapterId, e.target.value);
  }
}}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <>
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {chapter.chapterName}
                      </span>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        ({chapter.modules?.length || 0})
                      </span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingChapter(chapter.chapterId);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Edit Chapter"
                  >
                    <Edit className="w-3 h-3 text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedChapterForModule(chapter.chapterId);
                      setShowModuleForm(true);
                    }}
                    className="p-1 hover:bg-green-200 rounded"
                    title="Add Module"
                  >
                    <Plus className="w-3 h-3 text-green-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChapter(chapter.chapterId);
                    }}
                    className="p-1 hover:bg-red-200 rounded"
                    title="Delete Chapter"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Modules List */}
              {expandedChapters.has(chapter.chapterId) && (
                <div className="ml-6 mt-1 space-y-1">
                  {chapter.modules?.map((module) => (
                    <div key={module.moduleId}>
                      {/* Module Item */}
                      <div
                        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                          selectedItem?.type === 'module' && selectedItem?.data?.moduleId === module.moduleId
                            ? 'bg-purple-100 border-2 border-purple-300'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div 
                          className="flex items-center gap-2 flex-1 min-w-0"
                          onClick={() => handleSelectItem('module', { ...module, chapterId: chapter.chapterId })}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleModule(module.moduleId);
                            }}
                            className="p-0.5 hover:bg-gray-200 rounded flex-shrink-0"
                          >
                            {expandedModules.has(module.moduleId) ? (
                              <ChevronDown className="w-3 h-3 text-gray-500" />
                            ) : (
                              <ChevronRight className="w-3 h-3 text-gray-500" />
                            )}
                          </button>
                          <FileText className="w-3 h-3 text-indigo-600 flex-shrink-0" />
                          
                          {editingModule === module.moduleId ? (
                            <input
                              type="text"
                              defaultValue={module.titleOfModule}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                              autoFocus
                              onBlur={(e) => handleUpdateModule(chapter.chapterId, module.moduleId, e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleUpdateModule(chapter.chapterId, module.moduleId, e.target.value);
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <>
                              <span className="text-xs text-gray-600 truncate">
                                {module.titleOfModule}
                              </span>
                              <span className="text-xs text-gray-400 flex-shrink-0">
                                ({module.contentTypes?.length || 0})
                              </span>
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingModule(module.moduleId);
                            }}
                            className="p-1 hover:bg-gray-200 rounded"
                            title="Edit Module"
                          >
                            <Edit className="w-2.5 h-2.5 text-gray-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedModuleForContent({ chapterId: chapter.chapterId, moduleId: module.moduleId });
                              setShowContentDropdown(true);
                            }}
                            className="p-1 hover:bg-blue-200 rounded"
                            title="Add Content"
                          >
                            <Plus className="w-2.5 h-2.5 text-blue-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteModule(chapter.chapterId, module.moduleId);
                            }}
                            className="p-1 hover:bg-red-200 rounded"
                            title="Delete Module"
                          >
                            <Trash2 className="w-2.5 h-2.5 text-red-600" />
                          </button>
                        </div>
                      </div>

                      {/* Content Types List */}
                      {expandedModules.has(module.moduleId) && (
                        <div className="ml-6 mt-1 space-y-1">
                          {(module.contentTypes || []).map((type) => {
                            const ContentIcon = CONTENT_TYPES[type]?.icon || FileText;
                            const iconColor = CONTENT_TYPES[type]?.color || "text-gray-600";

                            return (
                              <div
                                key={type}
                                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                                  selectedItem?.type === 'content' &&
                                  selectedItem?.data?.[0]?.typeOfContent === type &&
                                  selectedItem?.data?.chapterId === chapter.chapterId &&
                                  selectedItem?.data?.moduleId === module.moduleId
                                    ? 'bg-orange-100 border-2 border-orange-300'
                                    : 'hover:bg-gray-100'
                                }`}
                                onClick={() => handleSelectContentType(chapter.chapterId, module.moduleId, type)}
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <ContentIcon className={`w-3 h-3 ${iconColor} flex-shrink-0`} />
                                  <span className="text-xs text-gray-600 truncate">
                                    {CONTENT_TYPES[type]?.label || type}
                                  </span>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTypeOfContent(chapter.chapterId, module.moduleId, type);
                                  }}
                                  className="p-1 hover:bg-red-200 rounded flex-shrink-0"
                                  title={`Delete all ${CONTENT_TYPES[type]?.label || type}`}
                                >
                                  <Trash2 className="w-2.5 h-2.5 text-red-600" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Resize Handle */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-1 bg-transparent hover:bg-blue-200 cursor-col-resize group transition-colors"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gray-300 group-hover:bg-blue-400 rounded-l transition-colors"></div>
        </div>
      </div>
    );
  };

  // Render right content area
  const renderRightContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full bg-white">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải dữ liệu khóa học...</p>
          </div>
        </div>
      );
    }

    if (!selectedItem) {
      return (
        <div className="flex items-center justify-center h-full bg-white">
          <div className="text-center max-w-md">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl mb-6">
              <BookOpen className="w-20 h-20 mx-auto text-blue-400 mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Chọn một mục để xem chi tiết</h3>
            <p className="text-gray-500">
              Chọn khóa học, chương, mô-đun hoặc nội dung từ sidebar bên trái để bắt đầu chỉnh sửa.
            </p>
          </div>
        </div>
      );
    }

    // Course Overview
    if (selectedItem.type === 'course') {
      const totalModules = (courseMetadata.chapters || []).reduce((sum, chapter) => 
        sum + ((chapter.modules || []).length), 0);
      
      const totalContentTypes = (courseMetadata.chapters || []).reduce((sum, chapter) => 
        sum + ((chapter.modules || []).reduce((mSum, module) => 
          mSum + ((module.contentTypes || []).length), 0)), 0);

      return (
        <div className="h-full overflow-y-auto bg-white">
          <div className="p-8">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{courseMetadata.name}</h1>
                  <p className="text-gray-600">Tổng quan và quản lý khóa học</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-semibold mb-1">Chương</p>
                    <p className="text-3xl font-bold text-blue-800">{courseMetadata.chapters?.length || 0}</p>
                  </div>
                  <div className="p-3 bg-blue-200 rounded-xl">
                    <Folder className="w-6 h-6 text-blue-700" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-semibold mb-1">Mô-đun</p>
                    <p className="text-3xl font-bold text-green-800">{totalModules}</p>
                  </div>
                  <div className="p-3 bg-green-200 rounded-xl">
                    <FileText className="w-6 h-6 text-green-700" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-semibold mb-1">Nội dung</p>
                    <p className="text-3xl font-bold text-purple-800">{totalContentTypes}</p>
                  </div>
                  <div className="p-3 bg-purple-200 rounded-xl">
                    <Brain className="w-6 h-6 text-purple-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* Course Status & Actions */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái khóa học</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold ${
                    courseMetadata.public 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      courseMetadata.public ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    {courseMetadata.public ? 'Công khai' : 'Riêng tư'}
                  </span>
                </div>
                
                <button
                  onClick={() => {
                    setSelectedChapterForModule(null);
                    setShowChapterForm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Thêm chương mới
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            {courseMetadata.chapters?.length === 0 && (
              <div className="mt-8 text-center py-12">
                <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-dashed border-blue-200 max-w-md mx-auto">
                  <BookOpen className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Khóa học trống</h3>
                  <p className="text-gray-600 mb-6">Bắt đầu bằng cách thêm chương đầu tiên cho khóa học của bạn.</p>
                  <button
                    onClick={() => {
                      setSelectedChapterForModule(null);
                      setShowChapterForm(true);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    Thêm chương đầu tiên
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Chapter View
    if (selectedItem.type === 'chapter') {
      const chapter = selectedItem.data;
      
      return (
        <div className="h-full overflow-y-auto bg-white">
          <div className="p-8">
            {/* Chapter Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg">
                  <Folder className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{chapter.chapterName}</h1>
                  <p className="text-gray-600">Chương #{chapter.orderInCourse}</p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setSelectedChapterForModule(chapter.chapterId);
                  setShowModuleForm(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              >
                <Plus className="w-5 h-5" />
                Thêm mô-đun
              </button>
            </div>

            {chapter.modules?.length === 0 ? (
              <div className="text-center py-16">
                <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-dashed border-green-200 max-w-md mx-auto">
                  <FileText className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Chương trống</h3>
                  <p className="text-gray-600 mb-6">Chương này chưa có mô-đun nào. Hãy thêm mô-đun đầu tiên.</p>
                  <button
                    onClick={() => {
                      setSelectedChapterForModule(chapter.chapterId);
                      setShowModuleForm(true);
                    }}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                  >
                    Thêm mô-đun đầu tiên
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapter.modules.map((module) => (
                  <div
                    key={module.moduleId}
                    className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 cursor-pointer"
                    onClick={() => handleSelectItem('module', { ...module, chapterId: chapter.chapterId })}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-indigo-100 group-hover:bg-indigo-200 rounded-xl transition-colors">
                        <FileText className="w-6 h-6 text-indigo-600" />
                      </div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600">
                        {module.contentTypes?.length || 0} loại nội dung
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-900 transition-colors">
                      {module.titleOfModule}
                    </h3>
                    <p className="text-sm text-gray-500">Thứ tự: {module.orderInChapter}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Module View
    if (selectedItem.type === 'module') {
      const module = selectedItem.data;
      
      return (
        <div className="h-full overflow-y-auto bg-white">
          <div className="p-8">
            {/* Module Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{module.titleOfModule}</h1>
                  <p className="text-gray-600">Quản lý mô-đun</p>
                </div>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => {
                    setSelectedModuleForContent({ 
                      chapterId: module.chapterId, 
                      moduleId: module.moduleId 
                    });
                    setShowContentDropdown(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Thêm nội dung
                </button>
                
                {/* Content Type Dropdown */}
                {showContentDropdown && selectedModuleForContent?.moduleId === module.moduleId && (
                  <div className="absolute right-0 top-16 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 max-h-96 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">Chọn loại nội dung</h4>
                        <button
                          onClick={() => setShowContentDropdown(false)}
                          className="p-1.5 hover:bg-white rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 p-4 max-h-80 overflow-y-auto">
                      {Object.entries(CONTENT_TYPES).map(([type, config]) => {
                        const IconComponent = config.icon;
                        return (
                          <button
                            key={type}
                            onClick={async () => {
                              setShowContentDropdown(false);
                              
                              // Create empty content and trigger lazy load
                              await handleBeforeCreateContent(
                                selectedModuleForContent.chapterId,
                                selectedModuleForContent.moduleId,
                                type
                              );
                              
                              // Update contentTypes in metadata
                              setCourseMetadata(prev => ({
                                ...prev,
                                chapters: prev.chapters.map(ch =>
                                  ch.chapterId === selectedModuleForContent.chapterId
                                    ? {
                                        ...ch,
                                        modules: ch.modules.map(mod =>
                                          mod.moduleId === selectedModuleForContent.moduleId
                                            ? {
                                                ...mod,
                                                contentTypes: Array.from(new Set([...(mod.contentTypes || []), type]))
                                              }
                                            : mod
                                        )
                                      }
                                    : ch
                                )
                              }));
                            }}
                            className="flex flex-col items-center gap-3 p-4 hover:bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 group hover:border-gray-300 hover:shadow-sm"
                          >
                            <div className="p-3 bg-gray-50 group-hover:bg-white rounded-xl transition-colors">
                              <IconComponent className={`w-6 h-6 ${config.color} group-hover:scale-110 transition-transform`} />
                            </div>
                            <span className="text-sm text-center font-medium text-gray-700 group-hover:text-gray-900">
                              {config.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Module content types list */}
            {(module.contentTypes || []).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(module.contentTypes || []).map((type) => {
                  const ContentIcon = CONTENT_TYPES[type]?.icon || FileText;
                  const iconColor = CONTENT_TYPES[type]?.color || "text-gray-600";
                  
                  return (
                    <div
                      key={type}
                      className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200 cursor-pointer"
                      onClick={() => handleSelectContentType(module.chapterId, module.moduleId, type)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-50 group-hover:bg-blue-50 rounded-xl transition-colors">
                          <ContentIcon className={`w-6 h-6 ${iconColor} group-hover:text-blue-600`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                            {CONTENT_TYPES[type]?.label || type}
                          </h3>
                          <p className="text-sm text-gray-500">Nhấp để chỉnh sửa</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-dashed border-purple-200 max-w-md mx-auto">
                  <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Mô-đun trống</h3>
                  <p className="text-gray-600 mb-6">Mô-đun này chưa có nội dung nào. Hãy thêm nội dung để bắt đầu.</p>
                  <button
                    onClick={() => {
                      setSelectedModuleForContent({ 
                        chapterId: module.chapterId, 
                        moduleId: module.moduleId 
                      });
                      setShowContentDropdown(true);
                    }}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
                  >
                    Thêm nội dung đầu tiên
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Content View - Display appropriate form based on content type
    if (selectedItem.type === 'content') {
      if (contentLoading) {
        return (
          <div className="h-full flex items-center justify-center bg-white">
            <div className="text-center">
              <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-6" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Đang tải nội dung</h3>
              <p className="text-gray-600">Vui lòng chờ trong giây lát...</p>
            </div>
          </div>
        );
      }

      const content = selectedItem.data;
      const arr = Object.keys(content)
        .filter(key => !isNaN(key))
        .map(key => content[key]);
      
      const ContentIcon = CONTENT_TYPES[arr[0]?.typeOfContent]?.icon || FileText;
      const iconColor = CONTENT_TYPES[arr[0]?.typeOfContent]?.color || "text-gray-600";
      const label = CONTENT_TYPES[arr[0]?.typeOfContent]?.label || arr[0]?.typeOfContent;
     
      const handleDeleteM = (mcId) => {
        handleDeleteContent(content.chapterId, content.moduleId, mcId);
      };
      
      const handleContentSubmit = (updatedData) => {
        handleUpdateContent(
          content.chapterId, 
          content.moduleId, 
          content.mcId, 
          updatedData
        );
      };
      
      const savedata = () => {
        saveModuleContent(content.chapterId, content.moduleId, arr);
      };
  
      return (
        <div className="h-full overflow-y-auto bg-white">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl shadow-lg">
                  <ContentIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{label}</h1>
                  <p className="text-gray-600">Chỉnh sửa nội dung</p>
                </div>
              </div>

              <button
                onClick={savedata}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              >
                <Save className="w-5 h-5" />
                Lưu thay đổi
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            {/* Render appropriate form based on content type */}
            {arr[0]?.typeOfContent === 'VIDEO' && (
              <VideoUploadForm 
                initialData={arr}
                onSubmit={handleContentSubmit} 
                onDelete={handleDeleteM}
              />
            )}
            
            {arr[0]?.typeOfContent === 'FLASHCARD' && (
              <FlashCardForm 
                initialData={arr}
                onSubmit={handleContentSubmit} 
                onDelete={handleDeleteM}
              />
            )}
            
            {arr[0]?.typeOfContent === 'LISTEN_CHOICE' && (
              <ListeningChoiceForm 
                initialData={arr}
                onSubmit={handleContentSubmit} 
                onDelete={handleDeleteM}
              />
            )}
            
            {arr[0]?.typeOfContent === 'MULTIPLE_CHOICE' && (
              <MultipleChoiceForm 
                initialData={arr}
                onSubmit={handleContentSubmit} 
                onDelete={handleDeleteM}
              />
            )}
            
            {arr[0]?.typeOfContent === 'GAPFILL' && (
              <GapFillForm 
                initialData={arr}
                onSubmit={handleContentSubmit} 
                onDelete={handleDeleteM}
              />
            )}
            
            {arr[0]?.typeOfContent === 'READING' && (
              <ReadingQuestionForm 
                initialData={arr}
                onSubmit={handleContentSubmit}
                onDelete={handleDeleteM}
              />
            )}
            
            {arr[0]?.typeOfContent === 'SPEAKING_PASSAGE' && (
              <SpeakingPassageForm 
                initialData={arr}
                onSubmit={handleContentSubmit} 
                onDelete={handleDeleteM}
              />
            )}
            
            {arr[0]?.typeOfContent === 'SPEAKING_PICTURE' && (
              <SpeakingPictureForm 
                initialData={arr}
                onSubmit={handleContentSubmit} 
                onDelete={handleDeleteM}
              />
            )}
            
            {arr[0]?.typeOfContent === 'WRITING' && (
              <WritingQuestionForm 
                initialData={arr}
                onSubmit={handleContentSubmit} 
                onDelete={handleDeleteM}
              />
            )}
            
            {arr[0]?.typeOfContent === 'PDF' && (
              <PdfUploadForm 
                initialData={arr}
                onSubmit={handleContentSubmit} 
                onDelete={handleDeleteM}
              />
            )}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course data...</p>
        </div>
      </div>
    );
  }

  if (!courseMetadata) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error loading course</p>
          <button
            onClick={() => navigate('/creator/create_course')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      {renderHeader()}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        {renderLeftSidebar()}

        {/* Right Content */}
        <div className="flex-1 overflow-hidden">
          {renderRightContent()}
        </div>
      </div>

      {/* Add Chapter Modal */}
      {showChapterForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl transform animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Folder className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Thêm chương mới</h3>
              </div>
              <button
                onClick={() => setShowChapterForm(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <input
              type="text"
              placeholder="Nhập tên chương..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6 text-gray-900"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleAddChapter(e.target.value.trim());
                }
              }}
              autoFocus
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowChapterForm(false)}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Nhập tên chương..."]');
                  if (input?.value.trim()) {
                    handleAddChapter(input.value.trim());
                  }
                }}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                Thêm chương
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Module Modal */}
      {showModuleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl transform animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Thêm mô-đun mới</h3>
              </div>
              <button
                onClick={() => {
                  setShowModuleForm(false);
                  setSelectedChapterForModule(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <input
              type="text"
              placeholder="Nhập tiêu đề mô-đun..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-6 text-gray-900"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleAddModule(selectedChapterForModule, e.target.value.trim());
                }
              }}
              autoFocus
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModuleForm(false);
                  setSelectedChapterForModule(null);
                }}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Nhập tiêu đề mô-đun..."]');
                  if (input?.value.trim()) {
                    handleAddModule(selectedChapterForModule, input.value.trim());
                  }
                }}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                Thêm mô-đun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagementInterface;