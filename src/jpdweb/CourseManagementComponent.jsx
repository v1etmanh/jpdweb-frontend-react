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
  MicIcon
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
import { useNavigate } from 'react-router-dom';

// Mock data structure
const initialCourse = {
  id: 1,
  title: "Introduction to Quantum Physics",
  moduleTypes: [
    {
      id: 1,
      title: "Core Modules",
      modules: [
        { id: 1, title: "Basic Concepts", type: "pdf" },
        { id: 2, title: "Video Lecture 1", type: "video" }
      ]
    },
    {
      id: 2,
      title: "Mi-long",
      modules: []
    },
    {
      id: 3,
      title: "Articles",
      modules: []
    }
  ]
};

const moduleTypeIcons = {
  flashcard: { icon: Brain, label: "Flashcard", color: "text-blue-600" },
  pdf: { icon: FileText, label: "PDF p", color: "text-red-600" },
  video: { icon: Video, label: "Video Upload", color: "text-green-600" },
  listening: { icon: Headphones, label: "Listening Choice", color: "text-purple-600" },
  multiple: { icon: CheckSquare, label: "Multiple Choice", color: "text-orange-600" },
  gap: { icon: Edit, label: "Gap Fill", color: "text-indigo-600" },
  reading: { icon: BookOpen, label: "Reading Question", color: "text-teal-600" },
  speaking: { icon: Mic, label: "Speaking Passage", color: "text-pink-600" },
  speakingPicture: { icon: MicIcon, label: "Speaking picture", color: "text-pink-600" },
  writing: { icon: PenTool, label: "Writing Question", color: "text-amber-600" }
};

const CourseManagementInterface = () => {
  const [course, setCourse] = useState(initialCourse);
  const [selectedItem, setSelectedItem] = useState({ type: 'course', id: course.id });
  const [expandedModuleTypes, setExpandedModuleTypes] = useState(new Set([1, 2, 3]));
  const [showModuleTypeForm, setShowModuleTypeForm] = useState(false);
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const [selectedModuleType, setSelectedModuleType] = useState(null);
  const[isRegis,setIsRegis]=useState(false)
  const nav=useNavigate()
//   useEffect(()=>{if(!isRegis){
//     nav("/creator/create_course")
//   }},[])
  // Toggle expand/collapse module type
  const toggleModuleType = (moduleTypeId) => {
    const newExpanded = new Set(expandedModuleTypes);
    if (newExpanded.has(moduleTypeId)) {
      newExpanded.delete(moduleTypeId);
    } else {
      newExpanded.add(moduleTypeId);
    }
    setExpandedModuleTypes(newExpanded);
  };

  // Add new module type
  const addModuleType = (title) => {
    const newModuleType = {
      id: Date.now(),
      title: title,
      modules: []
    };
    setCourse({
      ...course,
      moduleTypes: [...course.moduleTypes, newModuleType]
    });
    setShowModuleTypeForm(false);
  };

  // Add new module
  const addModule = (moduleTypeId, moduleData) => {
    const newModule = {
      id: Date.now(),
      title: moduleData.title || `New ${moduleData.type} Module`,
      type: moduleData.type,
      data: moduleData.data
    };

    setCourse({
      ...course,
      moduleTypes: course.moduleTypes.map(mt => 
        mt.id === moduleTypeId 
          ? { ...mt, modules: [...mt.modules, newModule] }
          : mt
      )
    });
    setShowModuleDropdown(false);
  };

  // Handle item selection
  const handleItemSelect = (type, id, parentId = null) => {
    setSelectedItem({ type, id, parentId });
    setShowModuleDropdown(false);
  };

  // Render left sidebar tree
  const renderLeftSidebar = () => (
    <div className="w-80 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      {/* Course Level */}
      <div className="mb-4">
        <div 
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
            selectedItem.type === 'course' ? 'bg-blue-100 border-2 border-blue-300' : 'hover:bg-gray-100'
          }`}
          onClick={() => handleItemSelect('course', course.id)}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-800">{course.title}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowModuleTypeForm(true);
            }}
            className="p-1 hover:bg-blue-200 rounded"
            title="Add Module Type"
          >
            <Plus className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Module Types */}
      <div className="space-y-2">
        {course.moduleTypes.map(moduleType => (
          <div key={moduleType.id}>
            <div 
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                selectedItem.type === 'moduleType' && selectedItem.id === moduleType.id 
                  ? 'bg-green-100 border-2 border-green-300' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <div 
                className="flex items-center gap-2 flex-1"
                onClick={() => handleItemSelect('moduleType', moduleType.id)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleModuleType(moduleType.id);
                  }}
                  className="p-0.5 hover:bg-gray-200 rounded"
                >
                  {expandedModuleTypes.has(moduleType.id) ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                <Folder className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">{moduleType.title}</span>
                <span className="text-xs text-gray-500">({moduleType.modules.length})</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedModuleType(moduleType.id);
                  setShowModuleDropdown(true);
                  handleItemSelect('moduleType', moduleType.id);
                }}
                className="p-1 hover:bg-green-200 rounded ml-2"
                title="Add Module"
              >
                <Plus className="w-3 h-3 text-green-600" />
              </button>
            </div>

            {/* Modules */}
            {expandedModuleTypes.has(moduleType.id) && (
              <div className="ml-6 mt-1 space-y-1">
                {moduleType.modules.map(module => {
                  const ModuleIcon = moduleTypeIcons[module.type]?.icon || FileText;
                  const iconColor = moduleTypeIcons[module.type]?.color || "text-gray-600";
                  
                  return (
                    <div
                      key={module.id}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                        selectedItem.type === 'module' && selectedItem.id === module.id
                          ? 'bg-purple-100 border-2 border-purple-300'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleItemSelect('module', module.id, moduleType.id)}
                    >
                      <ModuleIcon className={`w-4 h-4 ${iconColor}`} />
                      <span className="text-sm text-gray-600">{module.title}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render right content area
  const renderRightContent = () => {
    if (selectedItem.type === 'course') {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{course.title}</h2>
          <p className="text-gray-600 mb-6">Course Overview and Management</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Course Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-blue-600 font-medium">Module Types: </span>
                <span className="text-blue-800">{course.moduleTypes.length}</span>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Total Modules: </span>
                <span className="text-blue-800">
                  {course.moduleTypes.reduce((sum, mt) => sum + mt.modules.length, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedItem.type === 'moduleType') {
      const moduleType = course.moduleTypes.find(mt => mt.id === selectedItem.id);
      
      return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{moduleType.title}</h2>
              <p className="text-gray-600">Module Type Management</p>
            </div>
            
            {/* Module Type Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowModuleDropdown(!showModuleDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Module
              </button>
              
              {showModuleDropdown && selectedModuleType === moduleType.id && (
                <div className="absolute right-0 top-12 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800">Select Module Type</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-3">
                    {Object.entries(moduleTypeIcons).map(([type, config]) => {
                      const IconComponent = config.icon;
                      return (
                        <button
                          key={type}
                          onClick={() => {
                            // Here you would show the actual form component
                            addModule(moduleType.id, { 
                              type, 
                              title: `New ${config.label}`,
                              data: {} 
                            });
                          }}
                          className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                        >
                          <IconComponent className={`w-6 h-6 ${config.color}`} />
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

          {/* Module List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700">Modules ({moduleType.modules.length})</h3>
            
            {moduleType.modules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileImage className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No modules yet. Click "Add Module" to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {moduleType.modules.map(module => {
                  const ModuleIcon = moduleTypeIcons[module.type]?.icon || FileText;
                  const iconColor = moduleTypeIcons[module.type]?.color || "text-gray-600";
                  const label = moduleTypeIcons[module.type]?.label || "Unknown";
                  
                  return (
                    <div
                      key={module.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleItemSelect('module', module.id, moduleType.id)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <ModuleIcon className={`w-5 h-5 ${iconColor}`} />
                        <span className="font-medium text-gray-800">{module.title}</span>
                      </div>
                      <span className="text-sm text-gray-500">{label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (selectedItem.type === 'module') {
      const moduleType = course.moduleTypes.find(mt => mt.id === selectedItem.parentId);
      const module = moduleType?.modules.find(m => m.id === selectedItem.id);
      
      if (!module) return null;
      
      const ModuleIcon = moduleTypeIcons[module.type]?.icon || FileText;
      const iconColor = moduleTypeIcons[module.type]?.color || "text-gray-600";
      const label = moduleTypeIcons[module.type]?.label || "Unknown";
      
      return (
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <ModuleIcon className={`w-8 h-8 ${iconColor}`} />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{module.title}</h2>
              <p className="text-gray-600">{label}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <p className="text-gray-600 text-center">
              Module content editor would appear here based on the selected module type.
              <br />
              <span className="text-sm text-gray-500">
              {module.type === 'video' && <VideoUploadForm onSubmit={()=>{}} />}
{module.type === 'pdf' && <PdfUploadForm onSubmit={()=>{}}/>}
{module.type === 'listening' && <ListeningChoiceForm onSubmit={()=>{}} />}
    {module.type === 'multiple' && <MultipleChoiceForm onSubmit={()=>{}} />}
        {module.type === 'flashcard' && <FlashCardForm onSubmit={()=>{}} />}
            {module.type === 'gap' && <GapFillForm onSubmit={()=>{}} />}
                {module.type === 'reading' && <ReadingQuestionForm onSubmit={()=>{}} />}
                    {module.type === 'speaking' && <SpeakingPassageForm onSubmit={()=>{}} />}
                        {module.type === 'writing' && <WritingQuestionForm onSubmit={()=>{}} />}
                            {module.type === 'speakingPicture' && <SpeakingPictureForm onSubmit={()=>{}} />}
                             
           
              </span>
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      {renderLeftSidebar()}

      {/* Right Content */}
      <div className="flex-1 overflow-y-auto">
        {renderRightContent()}
      </div>

      {/* Module Type Form Modal */}
      {showModuleTypeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Module Type</h3>
            <input
              type="text"
              placeholder="Enter module type title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  addModuleType(e.target.value.trim());
                  e.target.value = '';
                }
              }}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowModuleTypeForm(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Enter module type title..."]');
                  if (input.value.trim()) {
                    addModuleType(input.value.trim());
                  }
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagementInterface;