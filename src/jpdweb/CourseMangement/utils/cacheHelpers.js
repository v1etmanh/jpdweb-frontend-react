// utils/cacheHelpers.js
export const createCacheKey = (courseId, chapterId, moduleId, contentType) => {
  return `${courseId}_${chapterId}_${moduleId}_${contentType}`;
};

export const parseCacheKey = (cacheKey) => {
  const [courseId, chapterId, moduleId, contentType] = cacheKey.split('_');
  return { courseId, chapterId, moduleId, contentType };
};

export const filterCacheByPattern = (cache, pattern) => {
  return Object.keys(cache)
    .filter((key) => key.includes(pattern))
    .reduce((acc, key) => {
      acc[key] = cache[key];
      return acc;
    }, {});
};

export const removeCacheByPattern = (cache, pattern) => {
  const newCache = { ...cache };
  Object.keys(newCache).forEach((key) => {
    if (key.includes(pattern)) {
      delete newCache[key];
    }
  });
  return newCache;
};