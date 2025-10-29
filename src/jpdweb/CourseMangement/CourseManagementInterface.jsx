// CourseManagementInterface.jsx - REFACTORED
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Context

import { CourseProvider } from './contexts/CourseContext';
// Hooks
import { useCourseData } from './hooks/useCourseData';
import { useChapterOperations } from './hooks/useChapterOperations';
import { useModuleOperations } from './hooks/useModuleOperations';

// Layout Components

import {Sidebar} from './layout/Sidebar'
import { ContentArea } from './layout/ContentArea';

// Modals
import { AddChapterModal } from './modals/AddChapterModal';
import { AddModuleModal } from './modals/AddModuleModal';

// Common
import { LoadingSpinner } from './common/LoadingSpinner';

const CourseManagementInterface = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  return (
    <CourseProvider courseId={courseId}>
      <CourseManagementContent navigate={navigate} />
    </CourseProvider>
  );
};

const CourseManagementContent = ({ navigate }) => {
  const { loading, courseMetadata } = useCourseData();
  const { addChapter } = useChapterOperations();
  const { addModule } = useModuleOperations();

  // Modal states
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [selectedChapterForModule, setSelectedChapterForModule] = useState(null);

  // Handlers
  const handleAddChapter = async (chapterName) => {
    try {
      await addChapter(chapterName);
      setShowChapterModal(false);
    } catch (error) {
      alert('Cannot create chapter. Please try again.');
    }
  };

  const handleAddModule = async (moduleTitle) => {
    try {
      await addModule(selectedChapterForModule, moduleTitle);
      setShowModuleModal(false);
      setSelectedChapterForModule(null);
    } catch (error) {
      alert('Cannot create module. Please try again.');
    }
  };

  const handleOpenModuleModal = (chapterId) => {
    setSelectedChapterForModule(chapterId);
    setShowModuleModal(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner message="Loading course data..." />
      </div>
    );
  }

  // Error state
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
      <Sidebar
        onAddChapter={() => setShowChapterModal(true)}
        onAddModule={handleOpenModuleModal}
      />

      {/* Right Content Area */}
      <ContentArea />

      {/* Modals */}
      <AddChapterModal
        isOpen={showChapterModal}
        onClose={() => setShowChapterModal(false)}
        onSubmit={handleAddChapter}
      />

      <AddModuleModal
        isOpen={showModuleModal}
        onClose={() => {
          setShowModuleModal(false);
          setSelectedChapterForModule(null);
        }}
        onSubmit={handleAddModule}
        chapterName={
          courseMetadata.chapters?.find((ch) => ch.chapterId === selectedChapterForModule)
            ?.chapterName
        }
      />
    </div>
  );
};

export default CourseManagementInterface;