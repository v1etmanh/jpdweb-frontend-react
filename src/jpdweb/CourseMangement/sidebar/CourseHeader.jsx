// components/sidebar/CourseHeader.jsx
import React from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { useCourse } from '../../contexts/CourseContext';

export const CourseHeader = ({ onAddChapter }) => {
  const { courseMetadata, selectedItem, setSelectedItem } = useCourse();

  const isSelected = selectedItem?.type === 'course';

  return (
    <div className="p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
      <div
        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
          isSelected ? 'bg-blue-100 border-2 border-blue-300' : 'hover:bg-gray-100'
        }`}
        onClick={() => setSelectedItem({ type: 'course', data: courseMetadata })}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <span className="font-semibold text-gray-800 truncate">
            {courseMetadata.name}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddChapter();
          }}
          className="p-1 hover:bg-blue-200 rounded flex-shrink-0"
          title="Add Chapter"
        >
          <Plus className="w-4 h-4 text-blue-600" />
        </button>
      </div>
    </div>
  );
};