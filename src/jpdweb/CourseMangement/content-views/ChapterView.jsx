// components/content-views/ChapterView.jsx
import React from 'react';
import { Folder, Plus, FileText } from 'lucide-react';
import { useCourse } from '../../contexts/CourseContext';
import { EmptyState } from '../common/EmptyState';

export const ChapterView = ({ chapter }) => {
  const { setSelectedItem } = useCourse();

  const handleAddModule = () => {
    // Trigger add module modal through parent
    // This can be improved with a callback prop
  };

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
          onClick={handleAddModule}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Module
        </button>
      </div>

      {chapter.modules?.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No modules in this chapter yet"
          description="Add your first module to get started"
          action={
            <button
              onClick={handleAddModule}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add First Module
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapter.modules.map((module) => (
            <ModuleCard
              key={module.moduleId}
              module={module}
              onClick={() =>
                setSelectedItem({ type: 'module', data: { ...module, chapterId: chapter.chapterId } })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ModuleCard = ({ module, onClick }) => {
  return (
    <div
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <FileText className="w-5 h-5 text-indigo-600" />
        <span className="text-xs text-gray-500">{module.contentTypes?.length || 0} types</span>
      </div>
      <h3 className="font-medium text-gray-800 mb-2">{module.titleOfModule}</h3>
      <p className="text-sm text-gray-500">Order: {module.orderInChapter}</p>
    </div>
  );
};