// hooks/useChapterOperations.js
import { useCallback } from 'react';
import { useCourse } from '../contexts/CourseContext';
import { useContentCache } from './useContentCache';
import { createNewChapter, deleteChapter } from '../api/ApiConnect';

export const useChapterOperations = () => {
  const { courseId, courseMetadata, setCourseMetadata } = useCourse();
  const { clearCache } = useContentCache();

  const addChapter = useCallback(async (chapterName) => {
    try {
      const response = await createNewChapter({
        name: chapterName,
        courseId,
      });

      const createdChapter = {
        ...response.data,
        modules: response.data.modules || [],
      };

      setCourseMetadata(prev => ({
        ...prev,
        chapters: [...(prev.chapters || []), createdChapter],
      }));

      return createdChapter;
    } catch (error) {
      console.error('Failed to create chapter:', error);
      throw error;
    }
  }, [courseId]);

  const updateChapter = useCallback((chapterId, newName) => {
    setCourseMetadata(prev => ({
      ...prev,
      chapters: prev.chapters.map(chapter =>
        chapter.chapterId === chapterId
          ? { ...chapter, chapterName: newName }
          : chapter
      ),
    }));
  }, []);

  const removeChapter = useCallback(async (chapterId) => {
    try {
      await deleteChapter(courseId, chapterId);
      
      // Clear related cache
      clearCache(`${courseId}_${chapterId}_`);

      setCourseMetadata(prev => ({
        ...prev,
        chapters: prev.chapters.filter(chapter => chapter.chapterId !== chapterId),
      }));
    } catch (error) {
      console.error('Failed to delete chapter:', error);
      throw error;
    }
  }, [courseId]);

  return {
    addChapter,
    updateChapter,
    removeChapter,
  };
};