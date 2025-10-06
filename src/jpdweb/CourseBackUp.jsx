import React, { useEffect, useState } from 'react';
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
  FileImage,
  MicIcon,
  Trash2,
  Save,
  X
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
import { getCourseById, updateCourse } from './api/ApiConnect';

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
  WRITING: { icon: PenTool, label: "Writing Question", color: "text-amber-600" }
};

const CourseManagementInterface = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
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
  const [type_flashcardData, setTypeFlashcardData] = useState(null);
const [groupData, setGroupData] = useState([]);

  // Load course data
  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const response = await getCourseById(courseId);
      setCourseData(response.data);
      
      // Auto expand first chapter and module
      if (response.data.chapters?.length > 0) {
        setExpandedChapters(new Set([response.data.chapters[0].chapterId]));
        if (response.data.chapters[0].modules?.length > 0) {
          setExpandedModules(new Set([response.data.chapters[0].modules[0].moduleId]));
        }
        console.log(response.data)
 
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
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
  const handleAddChapter = (chapterName) => {
    const newChapter = {
      chapterId: Date.now(),
      orderInCourse: courseData.chapters.length + 1,
      chapterName: chapterName,
      modules: []
    };

    setCourseData({
      ...courseData,
      chapters: [...courseData.chapters, newChapter]
    });
    setShowChapterForm(false);
  };

  const handleUpdateChapter = (chapterId, newName) => {
    setCourseData({
      ...courseData,
      chapters: courseData.chapters.map(chapter =>
        chapter.chapterId === chapterId
          ? { ...chapter, chapterName: newName }
          : chapter
      )
    });
    setEditingChapter(null);
  };

  const handleDeleteChapter = (chapterId) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      setCourseData({
        ...courseData,
        chapters: courseData.chapters.filter(chapter => chapter.chapterId !== chapterId)
      });
    }
  };

  // CRUD Operations for Module
  const handleAddModule = (chapterId, moduleTitle) => {
    setCourseData({
      ...courseData,
      chapters: courseData.chapters.map(chapter =>
        chapter.chapterId === chapterId
          ? {
              ...chapter,
              modules: [
                ...chapter.modules,
                {
                  moduleId: Date.now(),
                  titleOfModule: moduleTitle,
                  orderInChapter: chapter.modules.length + 1,
                  moduleContent: []
                }
              ]
            }
          : chapter
      )
    });
    setShowModuleForm(false);
    setSelectedChapterForModule(null);
  };

  const handleUpdateModule = (chapterId, moduleId, newTitle) => {
    setCourseData({
      ...courseData,
      chapters: courseData.chapters.map(chapter =>
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
  };

  const handleDeleteModule = (chapterId, moduleId) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      setCourseData({
        ...courseData,
        chapters: courseData.chapters.map(chapter =>
          chapter.chapterId === chapterId
            ? {
                ...chapter,
                modules: chapter.modules.filter(module => module.moduleId !== moduleId)
              }
            : chapter
        )
      });
    }
  };

  // CRUD Operations for Module Content
  const handleAddContent = (chapterId, moduleId, contentType) => {
    const newContent = createEmptyContent(contentType);
    
    setCourseData({
      ...courseData,
      chapters: courseData.chapters.map(chapter =>
        chapter.chapterId === chapterId
          ? {
              ...chapter,
              modules: chapter.modules.map(module =>
                module.moduleId === moduleId
                  ? {
                      ...module,
                      moduleContent: [...module.moduleContent, newContent]
                    }
                  : module
              )
            }
          : chapter
      )
    });
    setShowContentDropdown(false);
    setSelectedModuleForContent(null);
  };

  const handleUpdateContent = (chapterId, moduleId, mcId, updatedData) => {
    setCourseData({
      ...courseData,
      chapters: courseData.chapters.map(chapter =>
        chapter.chapterId === chapterId
          ? {
              ...chapter,
              modules: chapter.modules.map(module =>
                module.moduleId === moduleId
                  ? {
                      ...module,
                      moduleContent: module.moduleContent.map(content =>
                        content.mcId === mcId
                          ? { ...content, ...updatedData }
                          : content
                      )
                    }
                  : module
              )
            }
          : chapter
      )
    });
  };

  const handleDeleteContent = (chapterId, moduleId, mcId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      setCourseData({
        ...courseData,
        chapters: courseData.chapters.map(chapter =>
          chapter.chapterId === chapterId
            ? {
                ...chapter,
                modules: chapter.modules.map(module =>
                  module.moduleId === moduleId
                    ? {
                        ...module,
                        moduleContent: module.moduleContent.filter(content => content.mcId !== mcId)
                      }
                    : module
                )
              }
            : chapter
        )
      });
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
        return { 
          ...baseContent, 
          titleVideo: '', 
          videoUrl: '', 
          capacityMB: 0, 
          durationMinutes: 0 
        };
      
      case 'WRITING':
        return { 
          ...baseContent, 
          question: '', 
          requirements: null, 
          imageUrl: null 
        };
      
      case 'LISTEN_CHOICE':
        return { 
          ...baseContent, 
          question: '', 
          audioUrl: '', 
          options: [] 
        };
      
      case 'READING':
        return { 
          ...baseContent, 
          title: '', 
          content: '', 
          readingQuestion: [] 
        };
      
      case 'SPEAKING_PASSAGE':
        return { ...baseContent, passage: '', title: '' };
      
      case 'SPEAKING_PICTURE':
        return { 
          ...baseContent, 
          pictureUrl: '', 
          speakingPictureListQuestions: [] 
        };
      
      default:
        return baseContent;
    }
  };

  // Save course data
  const handleSaveCourse = async () => {
    try {
      await updateCourse(courseId, courseData);
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
            onClick={() => handleSelectItem('course', courseData)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="font-semibold text-gray-800 truncate">{courseData.name}</span>
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
          {courseData.chapters?.map((chapter, chapterIndex) => (
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
                      onKeyPress={(e) => {
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
                  {chapter.modules?.map((module, moduleIndex) => (
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
                                ({module.moduleContent?.length || 0})
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

                      {/* Module Contents */}
                      {expandedModules.has(module.moduleId) && (
                        <div className="ml-6 mt-1 space-y-1">
                          {  
                          
                          module.moduleContent?.map((content, contentIndex) => {
                            const ContentIcon = CONTENT_TYPES[content.typeOfContent]?.icon || FileText;
                            const iconColor = CONTENT_TYPES[content.typeOfContent]?.color || "text-gray-600";
                            
                            return (
                              <div
                                key={content.mcId}
                                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                                  selectedItem?.type === 'content' && selectedItem?.data?.mcId === content.mcId
                                    ? 'bg-orange-100 border-2 border-orange-300'
                                    : 'hover:bg-gray-100'
                                }`}
                                onClick={() => handleSelectItem('content', { 
                                  ...content, 
                                  chapterId: chapter.chapterId, 
                                  moduleId: module.moduleId 
                                })}
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <ContentIcon className={`w-3 h-3 ${iconColor} flex-shrink-0`} />
                                  <span className="text-xs text-gray-600 truncate">
                                    {CONTENT_TYPES[content.typeOfContent]?.label || content.typeOfContent}
                                  </span>
                                </div>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteContent(chapter.chapterId, module.moduleId, content.mcId);
                                  }}
                                  className="p-1 hover:bg-red-200 rounded flex-shrink-0"
                                  title="Delete Content"
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
      const totalModules = courseData.chapters?.reduce((sum, chapter) => 
        sum + (chapter.modules?.length || 0), 0) || 0;
      const totalContents = courseData.chapters?.reduce((sum, chapter) => 
        sum + (chapter.modules?.reduce((mSum, module) => 
          mSum + (module.moduleContent?.length || 0), 0) || 0), 0) || 0;

      return (
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{courseData.name}</h2>
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
                  <p className="text-2xl font-bold text-blue-800">{courseData.chapters?.length || 0}</p>
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
                  <p className="text-sm text-purple-600 font-medium">Contents</p>
                  <p className="text-2xl font-bold text-purple-800">{totalContents}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Course Status</h3>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                courseData.public ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {courseData.public ? 'Public' : 'Private'}
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
                      {module.moduleContent?.length || 0} items
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
                          onClick={() => handleAddContent(module.chapterId, module.moduleId, type)}
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

          {module.moduleContent?.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="mb-4">No content in this module yet.</p>
              <button
                onClick={() => {
                  setSelectedModuleForContent({ 
                    chapterId: module.chapterId, 
                    moduleId: module.moduleId 
                  });
                  setShowContentDropdown(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add First Content
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {module.moduleContent.map((content, index) => {
                const ContentIcon = CONTENT_TYPES[content.typeOfContent]?.icon || FileText;
                const iconColor = CONTENT_TYPES[content.typeOfContent]?.color || "text-gray-600";
                const label = CONTENT_TYPES[content.typeOfContent]?.label || content.typeOfContent;
                
                return (
                  <div
                    key={content.mcId}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => handleSelectItem('content', { 
                      ...content, 
                      chapterId: module.chapterId, 
                      moduleId: module.moduleId 
                    })}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-gray-100`}>
                          <ContentIcon className={`w-5 h-5 ${iconColor}`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{label}</h4>
                          <p className="text-sm text-gray-500">Content #{index + 1}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteContent(module.chapterId, module.moduleId, content.mcId);
                        }}
                        className="p-2 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Content"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Content View - Display appropriate form based on content type
    if (selectedItem.type === 'content') {
      const content = selectedItem.data;
      const ContentIcon = CONTENT_TYPES[content.typeOfContent]?.icon || FileText;
      const iconColor = CONTENT_TYPES[content.typeOfContent]?.color || "text-gray-600";
      const label = CONTENT_TYPES[content.typeOfContent]?.label || content.typeOfContent;
      
      const handleContentSubmit = (updatedData) => {
        handleUpdateContent(
          content.chapterId, 
          content.moduleId, 
          content.mcId, 
          updatedData
        );
      };

      return (
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-lg bg-gray-100`}>
              <ContentIcon className={`w-8 h-8 ${iconColor}`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{label}</h2>
              <p className="text-gray-600">Edit Content</p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            {/* Render appropriate form based on content type */}
            {content.typeOfContent === 'VIDEO' && (
              <VideoUploadForm 
                initialData={content}
                onSubmit={handleContentSubmit} 
              />
            )}
            
            {content.typeOfContent === 'FLASHCARD' && (
              <FlashCardForm 
                data={content}
                onSubmit={handleContentSubmit} 
              />
            )}
            
            {content.typeOfContent === 'LISTEN_CHOICE' && (
              <ListeningChoiceForm 
                initialData={content}
                onSubmit={handleContentSubmit} 
              />
            )}
            
            {content.typeOfContent === 'MULTIPLE_CHOICE' && (
              <MultipleChoiceForm 
                initialData={content}
                onSubmit={handleContentSubmit} 
              />
            )}
            
            {content.typeOfContent === 'GAPFILL' && (
              <GapFillForm 
                initialData={content}
                onSubmit={handleContentSubmit} 
              />
            )}
            
            {content.typeOfContent === 'READING' && (
              <ReadingQuestionForm 
                initialData={content}
                onSubmit={handleContentSubmit} 
              />
            )}
            
            {content.typeOfContent === 'SPEAKING_PASSAGE' && (
              <SpeakingPassageForm 
                initialData={content}
                onSubmit={handleContentSubmit} 
              />
            )}
            
            {content.typeOfContent === 'SPEAKING_PICTURE' && (
              <SpeakingPictureForm 
                initialData={content}
                onSubmit={handleContentSubmit} 
              />
            )}
            
            {content.typeOfContent === 'WRITING' && (
              <WritingQuestionForm 
                initialData={content}
                onSubmit={handleContentSubmit} 
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

  if (!courseData) {
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