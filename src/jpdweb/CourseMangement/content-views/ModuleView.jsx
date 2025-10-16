// components/content-views/ModuleView.jsx
import React, { useState } from 'react';
import { FileText, Plus, Brain } from 'lucide-react';
import { useCourse } from '../../contexts/CourseContext';
import { useContentCache } from '../../hooks/useContentCache';
import { CONTENT_TYPES } from '../../constants/contentTypes';
import { ContentTypeDropdown } from '../modals/ContentTypeDropdown';
import { EmptyState } from '../common/EmptyState';
import { createEmptyContent } from '../../utils/dataTransformers';

export const ModuleView = ({ module }) => {
  const { setCourseMetadata, setSelectedItem } = useCourse();
  const { fetchContentByType } = useContentCache();
  const [showContentDropdown, setShowContentDropdown] = useState(false);

  const handleSelectContentType = async (contentType) => {
    try {
      const contents = await fetchContentByType(module.chapterId, module.moduleId, contentType);

      setSelectedItem({
        type: 'content',
        data: {
          0: contents[0] || createEmptyContent(contentType),
          ...contents.slice(1).reduce((acc, item, idx) => {
            acc[idx + 1] = item;
            return acc;
          }, {}),
          chapterId: module.chapterId,
          moduleId: module.moduleId,
        },
      });
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const handleAddContentType = async (contentType) => {
    // Add to metadata
    setCourseMetadata((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch) =>
        ch.chapterId === module.chapterId
          ? {
              ...ch,
              modules: ch.modules.map((mod) =>
                mod.moduleId === module.moduleId
                  ? {
                      ...mod,
                      contentTypes: Array.from(new Set([...(mod.contentTypes || []), contentType])),
                    }
                  : mod
              ),
            }
          : ch
      ),
    }));

    // Load content
    await handleSelectContentType(contentType);
  };

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
            onClick={() => setShowContentDropdown(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Content
          </button>

          <ContentTypeDropdown
            isOpen={showContentDropdown}
            onClose={() => setShowContentDropdown(false)}
            onSelect={handleAddContentType}
          />
        </div>
      </div>

      {/* Module content types list */}
      {(module.contentTypes || []).length === 0 ? (
        <EmptyState
          icon={Brain}
          title="No content in this module yet"
          description="Add some content to get started"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {module.contentTypes.map((type) => (
            <ContentTypeCard
              key={type}
              contentType={type}
              onClick={() => handleSelectContentType(type)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ContentTypeCard = ({ contentType, onClick }) => {
  const ContentIcon = CONTENT_TYPES[contentType]?.icon || FileText;
  const iconColor = CONTENT_TYPES[contentType]?.color || 'text-gray-600';

  return (
    <div
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <ContentIcon className={`w-6 h-6 ${iconColor}`} />
        <div>
          <h3 className="font-medium text-gray-800">
            {CONTENT_TYPES[contentType]?.label || contentType}
          </h3>
          <p className="text-xs text-gray-500">Click to edit</p>
        </div>
      </div>
    </div>
  );
};