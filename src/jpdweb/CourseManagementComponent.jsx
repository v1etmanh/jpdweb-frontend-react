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
  Loader2
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
  createNewChapter, 
  createNewModule, 
  deleteChapter, 
  deleteModule, 
  deleteModuleContent, 
  deleteModuleContentByType, 
  getCourseById, 
  updateCourse, 
  updateCourseMaterial,
  getContentByTypeAndModule 
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

  // Render left sidebar
  const renderLeftSidebar = () => {
    if (loading) {
      return (
        <div className="w-80 bg-gray-50 border-r border-gray-200 p-4 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      );
    }

    return (
      <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        {/* Course Header */}
        <div className="p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
          <div 
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
              selectedItem?.type === 'course' ? 'bg-blue-100 border-2 border-blue-300' : 'hover:bg-gray-100'
            }`}
            onClick={() => handleSelectItem('course', courseMetadata)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="font-semibold text-gray-800 truncate">{courseMetadata.name}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowChapterForm(true);
              }}
              className="p-1 hover:bg-blue-200 rounded flex-shrink-0"
              title="Add Chapter"
            >
              <Plus className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>

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
      </div>
    );
  };

  // Render right content area
  const renderRightContent = () => {
    if (loading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading course data...</div>
        </div>
      );
    }

    if (!selectedItem) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p>Select an item from the sidebar to view details</p>
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
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{courseMetadata.name}</h2>
              <p className="text-gray-600">Course Overview and Management</p>
            </div>
            <button
              onClick={handleSaveCourse}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Course
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Folder className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Chapters</p>
                  <p className="text-2xl font-bold text-blue-800">{courseMetadata.chapters?.length || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-green-600 font-medium">Modules</p>
                  <p className="text-2xl font-bold text-green-800">{totalModules}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-600 font-medium">Content Types</p>
                  <p className="text-2xl font-bold text-purple-800">{totalContentTypes}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Course Status</h3>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                courseMetadata.public ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {courseMetadata.public ? 'Public' : 'Private'}
              </span>
            </div>
          </div>
        </div>
      );
    }

    // Chapter View
    if (selectedItem.type === 'chapter') {
      const chapter = selectedItem.data;
      
      return (
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Folder className="w-8 h-8 text-yellow-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{chapter.chapterName}</h2>
                <p className="text-gray-600">Chapter #{chapter.orderInCourse}</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                setSelectedChapterForModule(chapter.chapterId);
                setShowModuleForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Module
            </button>
          </div>

          {chapter.modules?.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="mb-4">No modules in this chapter yet.</p>
              <button
                onClick={() => {
                  setSelectedChapterForModule(chapter.chapterId);
                  setShowModuleForm(true);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add First Module
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chapter.modules.map((module) => (
                <div
                  key={module.moduleId}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleSelectItem('module', { ...module, chapterId: chapter.chapterId })}
                >
                  <div className="flex items-center justify-between mb-3">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs text-gray-500">
                      {module.contentTypes?.length || 0} types
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">{module.titleOfModule}</h3>
                  <p className="text-sm text-gray-500">Order: {module.orderInChapter}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Module View
    if (selectedItem.type === 'module') {
      const module = selectedItem.data;
      
      return (
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{module.titleOfModule}</h2>
                <p className="text-gray-600">Module Management</p>
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
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Content
              </button>
              
              {/* Content Type Dropdown */}
              {showContentDropdown && selectedModuleForContent?.moduleId === module.moduleId && (
                <div className="absolute right-0 top-12 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <h4 className="font-semibold text-gray-800">Select Content Type</h4>
                    <button
                      onClick={() => setShowContentDropdown(false)}
                      className="absolute top-3 right-3 p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-3">
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
                          className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors group"
                        >
                          <IconComponent className={`w-6 h-6 ${config.color} group-hover:scale-110 transition-transform`} />
                          <span className="text-xs text-center font-medium text-gray-700">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(module.contentTypes || []).map((type) => {
              const ContentIcon = CONTENT_TYPES[type]?.icon || FileText;
              const iconColor = CONTENT_TYPES[type]?.color || "text-gray-600";
              
              return (
                <div
                  key={type}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleSelectContentType(module.chapterId, module.moduleId, type)}
                >
                  <div className="flex items-center gap-3">
                    <ContentIcon className={`w-6 h-6 ${iconColor}`} />
                    <div>
                      <h3 className="font-medium text-gray-800">{CONTENT_TYPES[type]?.label || type}</h3>
                      <p className="text-xs text-gray-500">Click to edit</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {(module.contentTypes || []).length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p>No content in this module yet. Add some content to get started.</p>
            </div>
          )}
        </div>
      );
    }

    // Content View - Display appropriate form based on content type
    if (selectedItem.type === 'content') {
      if (contentLoading) {
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading content...</p>
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
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg bg-gray-100`}>
                <ContentIcon className={`w-8 h-8 ${iconColor}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{label}</h2>
                <p className="text-gray-600">Edit Content</p>
              </div>
            </div>

            <button
              onClick={savedata}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
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
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      {renderLeftSidebar()}

      {/* Right Content */}
      {renderRightContent()}

      {/* Add Chapter Modal */}
      {showChapterForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add New Chapter</h3>
              <button
                onClick={() => setShowChapterForm(false)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <input
              type="text"
              placeholder="Enter chapter name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
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
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Enter chapter name..."]');
                  if (input?.value.trim()) {
                    handleAddChapter(input.value.trim());
                  }
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Chapter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Module Modal */}
      {showModuleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add New Module</h3>
              <button
                onClick={() => {
                  setShowModuleForm(false);
                  setSelectedChapterForModule(null);
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <input
              type="text"
              placeholder="Enter module title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
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
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Enter module title..."]');
                  if (input?.value.trim()) {
                    handleAddModule(selectedChapterForModule, input.value.trim());
                  }
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Add Module
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagementInterface;