// components/layout/ContentArea.jsx
import React from 'react';
import { BookOpen } from 'lucide-react';
import { useCourse } from '../../contexts/CourseContext';
import { CourseOverview } from '../content-views/CourseOverview';
import { ChapterView } from '../content-views/ChapterView';
import { ModuleView } from '../content-views/ModuleView';
import { ContentEditor } from '../content-views/ContentEditor';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';

export const ContentArea = () => {
  const { selectedItem, loading, contentLoading } = useCourse();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner message="Loading course data..." />
      </div>
    );
  }

  if (!selectedItem) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <EmptyState
          icon={BookOpen}
          title="Select an item from the sidebar"
          description="Choose a course, chapter, module, or content to view details"
        />
      </div>
    );
  }

  if (contentLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner message="Loading content..." />
      </div>
    );
  }

  // Render based on selection type
  switch (selectedItem.type) {
    case 'course':
      return <CourseOverview />;
    case 'chapter':
      return <ChapterView chapter={selectedItem.data} />;
    case 'module':
      return <ModuleView module={selectedItem.data} />;
    case 'content':
      return <ContentEditor content={selectedItem.data} />;
    default:
      return null;
  }
};