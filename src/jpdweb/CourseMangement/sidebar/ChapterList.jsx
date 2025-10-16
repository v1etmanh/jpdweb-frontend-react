// components/sidebar/ChapterList.jsx (Advanced with DnD)
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ChapterItem } from './ChapterItem';
import { useCourse } from '../../contexts/CourseContext';
import { useChapterOperations } from '../../hooks/useChapterOperations';
import { EmptyState } from '../common/EmptyState';
import { Folder, GripVertical } from 'lucide-react';

/**
 * ChapterList Component with Drag & Drop
 * Allows reordering chapters by dragging
 */
export const ChapterList = ({ onAddModule }) => {
  const { courseMetadata, setCourseMetadata } = useCourse();
  const { updateChapter, removeChapter } = useChapterOperations();
  const [isDragging, setIsDragging] = useState(false);

  // Handle drag end
  const handleDragEnd = (result) => {
    setIsDragging(false);

    if (!result.destination) return;

    const { source, destination } = result;

    // No change in position
    if (source.index === destination.index) return;

    // Reorder chapters
    const chapters = Array.from(courseMetadata.chapters);
    const [movedChapter] = chapters.splice(source.index, 1);
    chapters.splice(destination.index, 0, movedChapter);

    // Update order numbers
    const updatedChapters = chapters.map((chapter, index) => ({
      ...chapter,
      orderInCourse: index + 1,
    }));

    // Update state
    setCourseMetadata({
      ...courseMetadata,
      chapters: updatedChapters,
    });

    // TODO: Call API to save new order
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  // No chapters state
  if (!courseMetadata.chapters || courseMetadata.chapters.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          icon={Folder}
          title="No chapters yet"
          description="Start by adding your first chapter"
        />
      </div>
    );
  }

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Droppable droppableId="chapters-list">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-4 space-y-2 transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50' : ''
            }`}
          >
            {courseMetadata.chapters.map((chapter, index) => (
              <Draggable
                key={chapter.chapterId.toString()}
                draggableId={chapter.chapterId.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`transition-shadow ${
                      snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {/* Drag Handle */}
                      <div
                        {...provided.dragHandleProps}
                        className="pt-2 cursor-grab active:cursor-grabbing opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <GripVertical className="w-4 h-4 text-gray-400" />
                      </div>

                      {/* Chapter Item */}
                      <div className="flex-1">
                        <ChapterItem
                          chapter={chapter}
                          index={index}
                          onEdit={updateChapter}
                          onDelete={removeChapter}
                          onAddModule={onAddModule}
                          isDragging={snapshot.isDragging}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChapterList;