// utils/dataTransformers.js
export const normalizeMetadata = (data) => {
  if (!data.chapters) data.chapters = [];

  data.chapters = data.chapters.map((chapter) => ({
    ...chapter,
    modules: (chapter.modules || []).map((module) => ({
      moduleId: module.moduleId,
      titleOfModule: module.titleOfModule,
      createDate: module.createDate,
      orderInChapter: module.orderInChapter,
      contentTypes: module.contentTypes || [],
    })),
  }));

  return data;
};

export const createEmptyContent = (contentType) => {
  const baseContent = {
    mcId: Date.now(),
    typeOfContent: contentType,
  };

  const templates = {
    FLASHCARD: { word: '', meaning: '', imageUrl: null },
    GAPFILL: { questionText: '', feedback: '' },
    MULTIPLE_CHOICE: { questionText: '', feedback: '' },
    VIDEO: { titleVideo: '', videoUrl: '', capacityMB: 0, durationMinutes: 0 },
    WRITING: { question: '', requirements: null, imageUrl: null },
    LISTEN_CHOICE: { question: '', audioUrl: '', options: [] },
    READING: { title: '', content: '', readingQuestion: [] },
    SPEAKING_PASSAGE: { passage: '', title: '' },
    SPEAKING_PICTURE: { pictureUrl: '', speakingPictureListQuestions: [] },
    PDF: { pdfUrl: '', titlePdf: '', capacityMB: 0 },
  };

  return { ...baseContent, ...(templates[contentType] || {}) };
};