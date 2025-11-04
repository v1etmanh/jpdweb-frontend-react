import { useEffect, useState, useCallback, useRef } from "react";
import PassageWithQuestions from "./PassageQuestionComponent";

export default function PassageQuestionContainer({ passageContent, isSave, postP }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numTrueAns, setNumTrueAns] = useState(0);
  const [hasSave, setHasSave] = useState(isSave);
  const [showOptions, setShowOptions] = useState(false);
  const [showScrollToPassage, setShowScrollToPassage] = useState(false);

  const passageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setHasSave(isSave);
  }, [isSave]);

  // Handle scroll to show/hide scroll to passage button
  useEffect(() => {
    const handleScroll = () => {
      if (passageRef.current) {
        const passageRect = passageRef.current.getBoundingClientRect();
        // Show button when passage is out of view (scrolled down)
        setShowScrollToPassage(passageRect.top < -100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const increNum = useCallback(() => {
    setNumTrueAns(prev => prev + 1);
    if (!hasSave) {
      postP();
      setHasSave(true);
    }
  }, [hasSave, postP]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prevIndex =>
      prevIndex !== passageContent.length - 1 ? prevIndex + 1 : 0
    );
    // Scroll to top when changing passage
    scrollToPassage();
  }, [passageContent?.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prevIndex =>
      prevIndex !== 0 ? prevIndex - 1 : passageContent.length - 1
    );
    // Scroll to top when changing passage
    scrollToPassage();
  }, [passageContent?.length]);

  const handleSelectPassage = (index) => {
    setCurrentIndex(index);
    setShowOptions(false);
    // Scroll to top when changing passage
    setTimeout(scrollToPassage, 100);
  };

  const scrollToPassage = () => {
    if (passageRef.current) {
      passageRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (!Array.isArray(passageContent) || passageContent.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface rounded-xl shadow-card p-8 text-center max-w-md">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-text-primary mb-2">No passage content available</h3>
          <p className="text-text-secondary">Please check back later for new content.</p>
        </div>
      </div>
    );
  }

  const currentPassage = passageContent[currentIndex];

  return (
    <div className="relative min-h-screen bg-background" ref={containerRef}>
      {/* Header với nút chọn đoạn văn - GIỮ NGUYÊN VỊ TRÍ CỦA BẠN */}
      <div className="relative p-4">
        {/* Nút chọn đoạn văn - GIỮ NGUYÊN VỊ TRÍ VÀ THIẾT KẾ NHƯ BẠN MUỐN */}
        <div className="absolute left-0 top-0 z-10">
          <button
            className="bg-primary-30 text-white px-4 py-2 rounded-br-xl hover:bg-primary-dark shadow-medium transition-all duration-200 flex items-center gap-2"
            onClick={() => setShowOptions(!showOptions)}
          >
            <span>📖</span>
            Chọn đoạn
          </button>
          {showOptions && (
            <div className="bg-white border border-border-light rounded-lg shadow-card mt-1 w-48">
              <div className="p-2">
                <div className="text-sm font-semibold text-text-primary px-3 py-2 border-b border-border-light">
                  Chọn đoạn văn
                </div>
                {passageContent.map((_, index) => (
                  <button
                    key={index}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                      currentIndex === index 
                        ? "bg-primary-30/10 text-primary-30 border border-primary-30/30" 
                        : "hover:bg-background text-text-primary"
                    }`}
                    onClick={() => handleSelectPassage(index)}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentIndex === index 
                        ? "bg-primary-30 text-white" 
                        : "bg-border-light text-text-secondary"
                    }`}>
                      {index + 1}
                    </div>
                    <span>Đoạn {index + 1}</span>
                    {currentIndex === index && (
                      <span className="ml-auto text-primary-30">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons trong header */}
    
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-8 pt-20"> {/* Thêm padding-top để tránh header */}
        {/* Passage Section với ref cho scrolling */}
        <div ref={passageRef}>
          <PassageWithQuestions
            text={currentPassage.content}
            questionAndOption={currentPassage.readingQuestion}
            increNum={increNum}
          />
        </div>

        {/* Navigation Buttons ở footer */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-border-light">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
              currentIndex === 0
                ? "bg-border-light text-text-muted cursor-not-allowed"
                : "bg-white text-primary-30 border border-primary-30 hover:bg-primary-30/10 shadow-soft hover:shadow-medium"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Đoạn trước
          </button>

          {/* Passage Progress */}
          <div className="flex flex-col items-center">
            <div className="text-sm text-text-secondary mb-1">
              Đoạn {currentIndex + 1} của {passageContent.length}
            </div>
            <div className="flex gap-1">
              {passageContent.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentIndex === index 
                      ? "bg-primary-30" 
                      : "bg-border-light"
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={goToNext}
            disabled={currentIndex === passageContent.length - 1}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
              currentIndex === passageContent.length - 1
                ? "bg-border-light text-text-muted cursor-not-allowed"
                : "bg-primary-30 text-white hover:bg-primary-dark shadow-medium hover:shadow-card"
            }`}
          >
            Đoạn tiếp theo
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Floating Scroll to Passage Button */}
      {showScrollToPassage && (
        <button
          onClick={scrollToPassage}
          className="fixed right-6 bottom-6 bg-accent-10 text-white p-4 rounded-xl shadow-lg hover:bg-accent-dark transition-all duration-300 z-50 flex items-center gap-2 font-semibold animate-bounce-gentle"
          title="Cuộn lên đoạn văn"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
          </svg>
          Đọc đoạn văn
        </button>
      )}

      {/* Mobile Navigation */}
      <div className="fixed bottom-4 left-4 right-4 sm:hidden z-10 bg-surface border border-border-light rounded-xl shadow-card p-3">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className={`p-3 rounded-lg flex items-center gap-1 ${
              currentIndex === 0
                ? "text-text-muted"
                : "text-primary-30 hover:bg-primary-30/10"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Trước</span>
          </button>

          <div className="text-center">
            <div className="text-sm font-semibold text-text-primary">
              {currentIndex + 1}/{passageContent.length}
            </div>
            <div className="text-xs text-text-secondary">Đoạn</div>
          </div>

          <button
            onClick={goToNext}
            disabled={currentIndex === passageContent.length - 1}
            className={`p-3 rounded-lg flex items-center gap-1 ${
              currentIndex === passageContent.length - 1
                ? "text-text-muted"
                : "text-primary-30 hover:bg-primary-30/10"
            }`}
          >
            <span className="text-sm font-medium">Sau</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}