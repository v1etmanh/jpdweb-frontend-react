// hooks/useCourseData.js
import { useEffect } from 'react';
import { useCourse } from '../contexts/CourseContext';
import { getCourseById } from '../api/ApiConnect';
import { normalizeMetadata } from '../utils/dataTransformers';

export const useCourseData = () => {
  const {
    courseId,
    setCourseMetadata,
    setExpandedChapters,
    setExpandedModules,
    setLoading,
  } = useCourse();

  useEffect(() => {
    fetchCourseMetadata();
  }, [courseId]);

  const fetchCourseMetadata = async () => {
    try {
      // Check cache
      const cached = localStorage.getItem(`course_metadata_${courseId}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        setCourseMetadata(normalizeMetadata(parsed));
        autoExpandFirst(parsed);
        setLoading(false);
        return;
      }

      // Fetch from API
      setLoading(true);
      const response = await getCourseById(courseId);
      const normalized = normalizeMetadata(response.data);
      
      setCourseMetadata(normalized);
      localStorage.setItem(`course_metadata_${courseId}`, JSON.stringify(normalized));
      autoExpandFirst(normalized);
    } catch (error) {
      console.error('Error fetching course:', error);
      setCourseMetadata({ chapters: [], public: false });
    } finally {
      setLoading(false);
    }
  };

  const autoExpandFirst = (data) => {
    if (data.chapters?.length > 0) {
      setExpandedChapters(new Set([data.chapters[0].chapterId]));
      if (data.chapters[0].modules?.length > 0) {
        setExpandedModules(new Set([data.chapters[0].modules[0].moduleId]));
      }
    }
  };

  return { fetchCourseMetadata };
};