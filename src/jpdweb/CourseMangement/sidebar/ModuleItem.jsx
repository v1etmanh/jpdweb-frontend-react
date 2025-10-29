// components/sidebar/ModuleItem.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Edit, Plus, Trash2 } from 'lucide-react';
import { useCourse } from '../../contexts/CourseContext';
import { useModuleOperations } from '../../hooks/useModuleOperations';
import { ContentTypeItem } from './ContentTypeItem';

export const ModuleItem = ({ module, chapterId }) => {
  const {
    selectedItem,
    setSelectedItem,
    expandedModules,
    setExpandedModules,
  } = useCourse();

  const { updateModule, removeModule } = useModuleOperations();
  const [isEditing, setIsEditing] = useState(false);

  const isExpanded = expandedModules.has(module.moduleId);
  const isSelected = selectedItem?.type === 'module' && 
                     selectedItem?.data?.moduleId === module.moduleId;

  const toggleExpand = (e) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedModules);
    if (isExpanded) {
      newExpanded.delete(module.moduleId);
    } else {
      newExpanded.add(module.moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleSave = (newTitle) => {
    updateModule(chapterId, module.moduleId, newTitle);
    setIsEditing(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this module?')) {
      removeModule(chapterId, module.moduleId);
    }
  };

  return (
    <div>
      {/* Module Item */}
      <div
        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
          isSelected ? 'bg-purple-100 border-2 border-purple-300' : 'hover:bg-gray-100'
        }`}
      >
        <div
          className="flex items-center gap-2 flex-1 min-w-0"
          onClick={() => setSelectedItem({ type: 'module', data: { ...module, chapterId } })}
        >
          <button onClick={toggleExpand} className="p-0.5 hover:bg-gray-200 rounded flex-shrink-0">
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-500" />
            )}
          </button>
          <FileText className="w-3 h-3 text-indigo-600 flex-shrink-0" />

          {isEditing ? (
            <input
              type="text"
              defaultValue={module.titleOfModule}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
              autoFocus
              onBlur={(e) => handleSave(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSave(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <>
              <span className="text-xs text-gray-600 truncate">{module.titleOfModule}</span>
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
              setIsEditing(true);
            }}
            className="p-1 hover:bg-gray-200 rounded"
            title="Edit"
          >
            <Edit className="w-2.5 h-2.5 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-blue-200 rounded" title="Add Content">
            <Plus className="w-2.5 h-2.5 text-blue-600" />
          </button>
          <button onClick={handleDelete} className="p-1 hover:bg-red-200 rounded" title="Delete">
            <Trash2 className="w-2.5 h-2.5 text-red-600" />
          </button>
        </div>
      </div>

      {/* Content Types List */}
      {isExpanded && (
        <div className="ml-6 mt-1 space-y-1">
          {(module.contentTypes || []).map((type) => (
            <ContentTypeItem
              key={type}
              contentType={type}
              chapterId={chapterId}
              moduleId={module.moduleId}
            />
          ))}
        </div>
      )}
    </div>
  );
};