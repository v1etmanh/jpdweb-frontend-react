// components/sidebar/ContentTypeItem.jsx
import React from 'react';
import { Trash2, FileText } from 'lucide-react';
import { useCourse } from '../../contexts/CourseContext';
import { useContentCache } from '../../hooks/useContentCache';
import { CONTENT_TYPES } from '../../constants/contentTypes';

export const ContentTypeItem = ({ contentType, chapterId, moduleId }) => {
  const { selectedItem } = useCourse();
  const { fetchContentByType } = useContentCache();

  const ContentIcon = CONTENT_TYPES[contentType]?.icon || FileText;
  const iconColor = CONTENT_TYPES[contentType]?.color || 'text-gray-600';

  const isSelected =
    selectedItem?.type === 'content' &&
    selectedItem?.data?.[0]?.typeOfContent === contentType &&
    selectedItem?.data?.chapterId === chapterId &&
    selectedItem?.data?.moduleId === moduleId;

  const handleClick = async () => {
    const contents = await fetchContentByType(chapterId, moduleId, contentType);
    // Handle selection...
  };

  return (
    <div
      className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
        isSelected ? 'bg-orange-100 border-2 border-orange-300' : 'hover:bg-gray-100'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <ContentIcon className={`w-3 h-3 ${iconColor} flex-shrink-0`} />
        <span className="text-xs text-gray-600 truncate">
          {CONTENT_TYPES[contentType]?.label || contentType}
        </span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          // Handle delete...
        }}
        className="p-1 hover:bg-red-200 rounded flex-shrink-0"
        title="Delete all"
      >
        <Trash2 className="w-2.5 h-2.5 text-red-600" />
      </button>
    </div>
  );
};