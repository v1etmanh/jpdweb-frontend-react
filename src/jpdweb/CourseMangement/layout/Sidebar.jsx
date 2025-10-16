// components/layout/Sidebar.jsx (Updated)
import React from 'react';
import { useCourse } from '../../contexts/CourseContext';
import { CourseHeader } from '../sidebar/CourseHeader';
import { ChapterList } from '../sidebar/ChapterList';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const Sidebar = ({ onAddChapter, onAddModule }) => {
  const { loading } = useCourse();

  if (loading) {
    return (
      <div className="w-full h-full bg-gray-50 border-r border-gray-200 p-4 flex items-center justify-center">
        <LoadingSpinner size="sm" message="Loading..." />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-50 border-r border-gray-200 overflow-hidden flex flex-col">
      {/* Course Header - Fixed */}
      <CourseHeader onAddChapter={onAddChapter} />

      {/* Chapters List - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <ChapterList onAddModule={onAddModule} />
      </div>
    </div>
  );
};

export default Sidebar;