// components/sidebar/ChapterItem.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, Edit, Plus, Trash2 } from 'lucide-react';
import { useCourse } from '../../contexts/CourseContext';
import { ModuleItem } from './ModuleItem';

export const ChapterItem = ({ chapter, onEdit, onDelete, onAddModule }) => {
  const {
    selectedItem,
    setSelectedItem,
    expandedChapters,
    setExpandedChapters,
  } = useCourse();

  const [isEditing, setIsEditing] = useState(false);

  const isExpanded = expandedChapters.has(chapter.chapterId);
  const isSelected = selectedItem?.type === 'chapter' && 
                     selectedItem?.data?.chapterId === chapter.chapterId;

  const toggleExpand = (e) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedChapters);
    if (isExpanded) {
      newExpanded.delete(chapter.chapterId);
    } else {
      newExpanded.add(chapter.chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = (newName) => {
    onEdit(chapter.chapterId, newName);
    setIsEditing(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      onDelete(chapter.chapterId);
    }
  };

  return (
    <div>
      {/* Chapter Item */}
      <div
        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
          isSelected ? 'bg-green-100 border-2 border-green-300' : 'hover:bg-gray-100'
        }`}
      >
        <div
          className="flex items-center gap-2 flex-1 min-w-0"
          onClick={() => setSelectedItem({ type: 'chapter', data: chapter })}
        >
          <button onClick={toggleExpand} className="p-0.5 hover:bg-gray-200 rounded flex-shrink-0">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          <Folder className="w-4 h-4 text-yellow-600 flex-shrink-0" />

          {isEditing ? (
            <input
              type="text"
              defaultValue={chapter.chapterName}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
              autoFocus
              onBlur={(e) => handleSave(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSave(e.target.value)}
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
          <button onClick={handleEdit} className="p-1 hover:bg-gray-200 rounded" title="Edit">
            <Edit className="w-3 h-3 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddModule(chapter.chapterId);
            }}
            className="p-1 hover:bg-green-200 rounded"
            title="Add Module"
          >
            <Plus className="w-3 h-3 text-green-600" />
          </button>
          <button onClick={handleDelete} className="p-1 hover:bg-red-200 rounded" title="Delete">
            <Trash2 className="w-3 h-3 text-red-600" />
          </button>
        </div>
      </div>

      {/* Modules List */}
      {isExpanded && (
        <div className="ml-6 mt-1 space-y-1">
          {chapter.modules?.map((module) => (
            <ModuleItem
              key={module.moduleId}
              module={module}
              chapterId={chapter.chapterId}
            />
          ))}
        </div>
      )}
    </div>
  );
};