// hooks/useContentCache.js
import { useCallback } from 'react';
import { useCourse } from '../contexts/CourseContext';
import { getContentByTypeAndModule } from '../api/ApiConnect';

export const useContentCache = () => {
  const {
    courseId,
    loadedContents,
    setLoadedContents,
    setContentLoading,
  } = useCourse();

  const getCacheKey = (chapterId, moduleId, contentType) => {
    return `${courseId}_${chapterId}_${moduleId}_${contentType}`;
  };

  const fetchContentByType = useCallback(async (chapterId, moduleId, contentType) => {
    const cacheKey = getCacheKey(chapterId, moduleId, contentType);
    
    // Check cache
    if (loadedContents[cacheKey]) {
      return loadedContents[cacheKey];
    }

    // Fetch from API
    setContentLoading(true);
    try {
      const response = await getContentByTypeAndModule(
        contentType,
        moduleId,
        chapterId,
        courseId
      );
      const contents = response.data;

      // Update cache
      setLoadedContents(prev => ({
        ...prev,
        [cacheKey]: contents,
      }));

      return contents;
    } catch (error) {
      console.error('Error fetching content:', error);
      return [];
    } finally {
      setContentLoading(false);
    }
  }, [courseId, loadedContents]);

  const updateCache = useCallback((chapterId, moduleId, contentType, contents) => {
    const cacheKey = getCacheKey(chapterId, moduleId, contentType);
    setLoadedContents(prev => ({
      ...prev,
      [cacheKey]: contents,
    }));
  }, [courseId]);

  const clearCache = useCallback((pattern) => {
    setLoadedContents(prev => {
      const newCache = { ...prev };
      Object.keys(newCache).forEach(key => {
        if (key.includes(pattern)) {
          delete newCache[key];
        }
      });
      return newCache;
    });
  }, []);

  return {
    fetchContentByType,
    updateCache,
    clearCache,
    getCacheKey,
  };
};