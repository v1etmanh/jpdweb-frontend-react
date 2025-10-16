// hooks/useContentOperations.js
import { useCallback } from 'react';
import { useCourse } from '../contexts/CourseContext';
import { useContentCache } from './useContentCache';
import {
  updateCourseMaterial,
  deleteModuleContent,
  deleteModuleContentByType,
} from '../api/ApiConnect';

export const useContentOperations = () => {
  const { courseId, setCourseMetadata, tempIdCounter } = useCourse();
  const { updateCache, clearCache, getCacheKey } = useContentCache();

  const updateContent = useCallback(
    (chapterId, moduleId, mcId, updatedData) => {
      const contentType = updatedData[0]?.typeOfContent;
      if (!contentType) return;

      const cacheKey = getCacheKey(chapterId, moduleId, contentType);
      const cachedContent = loadedContents[cacheKey] || [];

      // Separate updates and additions
      const toUpdate = updatedData.filter((u) =>
        cachedContent.some((content) => content.mcId === u.mcId)
      );

      const toAdd = updatedData
        .filter((u) => !u.mcId || !cachedContent.some((content) => content.mcId === u.mcId))
        .map((u) => ({ ...u, mcId: u.mcId ?? tempIdCounter.current-- }));

      // Update cache
      const updatedCache = cachedContent.map((content) => {
        const found = toUpdate.find((u) => u.mcId === content.mcId);
        return found ? { ...content, ...found } : content;
      });

      updateCache(chapterId, moduleId, contentType, [...updatedCache, ...toAdd]);

      // Update metadata if new content added
      if (toAdd.length > 0) {
        setCourseMetadata((prev) => ({
          ...prev,
          chapters: prev.chapters.map((ch) =>
            ch.chapterId === chapterId
              ? {
                  ...ch,
                  modules: ch.modules.map((mod) =>
                    mod.moduleId === moduleId
                      ? {
                          ...mod,
                          contentTypes: Array.from(
                            new Set([...(mod.contentTypes || []), contentType])
                          ),
                        }
                      : mod
                  ),
                }
              : ch
          ),
        }));
      }
    },
    [courseId, tempIdCounter]
  );

  const saveContent = useCallback(
    async (chapterId, moduleId, contentArray) => {
      const data = {
        courseId,
        chapterId,
        moduleId,
        moduleContent: contentArray,
      };

      try {
        const response = await updateCourseMaterial(courseId, chapterId, moduleId, data);

        // Update cache with server response
        const contentType = contentArray[0]?.typeOfContent;
        if (contentType) {
          updateCache(chapterId, moduleId, contentType, response.data);
        }

        alert('Save successful');
      } catch (error) {
        console.error('Save failed:', error);
        alert('Failed to save content');
      }
    },
    [courseId]
  );

  const deleteContent = useCallback(
    async (chapterId, moduleId, mcId) => {
      if (!window.confirm('Are you sure you want to delete this content?')) return;

      try {
        await deleteModuleContent(courseId, chapterId, moduleId, mcId);

        // Update cache - remove deleted content
        clearCache(`${courseId}_${chapterId}_${moduleId}_`);
      } catch (error) {
        console.error('Error deleting content:', error);
        alert('Error to delete: ' + error);
      }
    },
    [courseId]
  );

   const deleteContentType = useCallback(
    async (chapterId, moduleId, contentType) => {
      if (
        !window.confirm(
          `Are you sure you want to delete all ${contentType} contents in this module?`
        )
      )
        return;

      try {
        await deleteModuleContentByType(contentType, moduleId, chapterId, courseId);

        // Clear cache for this type
        const cacheKey = getCacheKey(chapterId, moduleId, contentType);
        clearCache(cacheKey);

        // Update metadata - remove content type
        setCourseMetadata((prev) => ({
          ...prev,
          chapters: prev.chapters.map((ch) =>
            ch.chapterId === chapterId
              ? {
                  ...ch,
                  modules: ch.modules.map((mod) =>
                    mod.moduleId === moduleId
                      ? {
                          ...mod,
                          contentTypes: mod.contentTypes.filter((type) => type !== contentType),
                        }
                      : mod
                  ),
                }
              : ch
          ),
        }));
      } catch (error) {
        console.error('Error deleting content type:', error);
        alert('Error to delete: ' + error);
      }
    },
    [courseId]
  );

  return {
    updateContent,
    saveContent,
    deleteContent,
    deleteContentType,
  };
};