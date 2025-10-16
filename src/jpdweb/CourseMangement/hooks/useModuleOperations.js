// hooks/useModuleOperations.js
import { useCallback } from 'react';
import { useCourse } from '../contexts/CourseContext';
import { useContentCache } from './useContentCache';
import { createNewModule, deleteModule } from '../api/ApiConnect';

export const useModuleOperations = () => {
  const { courseId, setCourseMetadata } = useCourse();
  const { clearCache } = useContentCache();

  const addModule = useCallback(async (chapterId, moduleTitle) => {
    try {
      const response = await createNewModule(courseId, chapterId, moduleTitle);
      const createdModule = {
        ...response.data,
        contentTypes: response.data.contentTypes || [],
      };

      setCourseMetadata(prev => ({
        ...prev,
        chapters: prev.chapters.map(chapter =>
          chapter.chapterId === chapterId
            ? {
                ...chapter,
                modules: [...(chapter.modules || []), createdModule],
              }
            : chapter
        ),
      }));

      return createdModule;
    } catch (error) {
      console.error('Failed to create module:', error);
      throw error;
    }
  }, [courseId]);

  const updateModule = useCallback((chapterId, moduleId, newTitle) => {
    setCourseMetadata(prev => ({
      ...prev,
      chapters: prev.chapters.map(chapter =>
        chapter.chapterId === chapterId
          ? {
              ...chapter,
              modules: chapter.modules.map(module =>
                module.moduleId === moduleId
                  ? { ...module, titleOfModule: newTitle }
                  : module
              ),
            }
          : chapter
      ),
    }));
  }, []);

  const removeModule = useCallback(async (chapterId, moduleId) => {
    try {
      await deleteModule(courseId, chapterId, moduleId);
      
      // Clear related cache
      clearCache(`${courseId}_${chapterId}_${moduleId}_`);

      setCourseMetadata(prev => ({
        ...prev,
        chapters: prev.chapters.map(chapter =>
          chapter.chapterId === chapterId
            ? {
                ...chapter,
                modules: chapter.modules.filter(module => module.moduleId !== moduleId),
              }
            : chapter
        ),
      }));
    } catch (error) {
      console.error('Failed to delete module:', error);
      throw error;
    }
  }, [courseId]);

  return {
    addModule,
    updateModule,
    removeModule,
  };
};