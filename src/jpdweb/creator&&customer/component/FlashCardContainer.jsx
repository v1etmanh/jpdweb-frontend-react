import { useState, useEffect } from "react";
import FlashCardComponent from "./FlashCardComponent";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Book,
  X,
  Shuffle,
} from "react-bootstrap-icons";
import { RotateCw } from "lucide-react";
export default function FlashCardContainer({
  flashcards,
  onComplete,
  language,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [cardStatus, setCardStatus] = useState({});
  const [trackingProgress, setTrackingProgress] = useState(false);
  const [currentFlashcards, setCurrentFlashcards] = useState(flashcards);

  // Khởi tạo trạng thái cho các flashcard
  useEffect(() => {
    const initialStatus = {};
    currentFlashcards.forEach((card, index) => {
      initialStatus[index] = "learning"; // Mặc định là "đang học"
    });
    setCardStatus(initialStatus);
  }, [currentFlashcards]);

  // Xáo trộn flashcard
  const shuffleFlashcards = () => {
    const shuffled = [...currentFlashcards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setCurrentFlashcards(shuffled);
    setCurrentIndex(0);
    setShowCompletion(false);

    // Reset trạng thái về learning cho tất cả thẻ sau khi xáo trộn
    const resetStatus = {};
    shuffled.forEach((card, index) => {
      resetStatus[index] = "learning";
    });
    setCardStatus(resetStatus);
  };

  const handleNext = () => {
    if (currentIndex === currentFlashcards.length - 1) {
      setShowCompletion(true);
    } else {
      setCurrentIndex((prevIndex) =>
        prevIndex < currentFlashcards.length - 1 ? prevIndex + 1 : 0
      );
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    setShowCompletion(false);
  };

  const handleComplete = () => {
    onComplete();
  };

  const handleMarkAsLearning = () => {
    setCardStatus((prev) => ({
      ...prev,
      [currentIndex]: "learning",
    }));
    handleNext();
  };

  const handleMarkAsKnown = () => {
    setCardStatus((prev) => ({
      ...prev,
      [currentIndex]: "known",
    }));
    handleNext();
  };

  const focusOnLearningCards = () => {
    const learningCards = currentFlashcards.filter(
      (card, index) => cardStatus[index] === "learning"
    );
    if (learningCards.length > 0) {
      const firstLearningIndex = currentFlashcards.indexOf(learningCards[0]);
      setCurrentIndex(firstLearningIndex);
      setShowCompletion(false);
    }
  };

  const resetAllCards = () => {
    const resetStatus = {};
    currentFlashcards.forEach((card, index) => {
      resetStatus[index] = "learning";
    });
    setCardStatus(resetStatus);
    setCurrentIndex(0);
    setShowCompletion(false);
  };

  // Thống kê tiến độ
  const knownCount = Object.values(cardStatus).filter(
    (status) => status === "known"
  ).length;
  const learningCount = Object.values(cardStatus).filter(
    (status) => status === "learning"
  ).length;

  if (!currentFlashcards || currentFlashcards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-background rounded-2xl">
        <div className="text-center text-text-muted">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
            <svg
              className="w-8 h-8 opacity-60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-lg font-medium">Không có flashcard nào</p>
          <p className="text-sm mt-1">Vui lòng kiểm tra lại nội dung học tập</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-text-primary">
            Thẻ {currentIndex + 1} / {currentFlashcards.length}
          </span>
          <div className="flex items-center space-x-4">
            {/* Nút xáo trộn */}
            <button
              onClick={shuffleFlashcards}
              className="flex items-center space-x-2 px-3 py-2 bg-white text-text-primary rounded-xl border border-border-light shadow-soft hover:shadow-medium transition-all duration-300 hover:bg-gray-50 font-medium"
              title="Xáo trộn thẻ"
            >
              <Shuffle className="w-4 h-4" />
              <span className="text-sm">Xáo trộn</span>
            </button>

            {/* Toggle theo dõi tiến độ */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-text-secondary">
                Theo dõi tiến độ
              </span>
              <button
                onClick={() => setTrackingProgress(!trackingProgress)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  trackingProgress ? "bg-primary-30" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    trackingProgress ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center space-x-2 text-accent-10">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Học từ vựng</span>
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary-30 to-accent-10 h-2 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${
                ((currentIndex + 1) / currentFlashcards.length) * 100
              }%`,
            }}
          ></div>
        </div>
      </div>

      {/* FlashCard Content - Ẩn khi showCompletion và trackingProgress */}
      {!showCompletion && (
        <div className="relative">
          <FlashCardComponent
            frontText={currentFlashcards[currentIndex].word}
            backText={currentFlashcards[currentIndex].meaning}
            currentIndex={currentIndex}
            totalCards={currentFlashcards.length}
            img={currentFlashcards[currentIndex].imgUrl}
            language={language}
          />
        </div>
      )}

      {/* Navigation Controls */}
      {!showCompletion && (
        <div className="flex items-center justify-between mt-8 px-4">
          {trackingProgress ? (
            // Chế độ theo dõi tiến độ
            <>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center space-x-2 px-6 py-3 bg-white text-text-primary rounded-xl border border-border-light shadow-soft hover:shadow-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </button>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleMarkAsLearning}
                  className="flex items-center space-x-2 px-6 py-3 bg-white text-red-600 rounded-xl border border-red-200 shadow-soft hover:shadow-medium transition-all duration-300 hover:bg-red-50 font-medium"
                >
                  <X className="w-4 h-4" />
                  <span>Đang học</span>
                </button>

                <button
                  onClick={handleMarkAsKnown}
                  className="flex items-center space-x-2 px-6 py-3 bg-status-completed text-white rounded-xl shadow-medium hover:shadow-card transition-all duration-300 font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Đã biết</span>
                </button>
              </div>
              <div className="w-24"></div> {/* Placeholder để căn đều */}
            </>
          ) : (
            // Chế độ bình thường
            <>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center space-x-2 px-6 py-3 bg-white text-text-primary rounded-xl border border-border-light shadow-soft hover:shadow-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Trước</span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  {currentFlashcards.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? "bg-primary-30 w-6"
                          : trackingProgress && cardStatus[index] === "known"
                          ? "bg-status-completed"
                          : "bg-border-light"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-30 to-accent-10 text-white rounded-xl shadow-medium hover:shadow-card transition-all duration-300 transform hover:scale-105 font-medium"
              >
                <span>
                  {currentIndex === currentFlashcards.length - 1
                    ? "Kết thúc"
                    : "Tiếp theo"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Completion Message - Chỉ hiển thị khi trackingProgress */}
      {showCompletion && trackingProgress && (
        <div className="mt-8 p-6 bg-white rounded-2xl border border-border-light shadow-soft">
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-3 bg-status-completed rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-text-primary">
              Chúc mừng! Bạn đã hoàn thành tất cả flashcard
            </h3>
            <p className="text-text-secondary mt-2">
              Dưới đây là tiến độ học tập của bạn
            </p>
          </div>

          {/* Tiến độ học tập */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-medium text-text-primary mb-3">
              Tiến độ của bạn
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border border-border-light">
                <div className="text-2xl font-bold text-status-completed">
                  {knownCount}
                </div>
                <div className="text-text-secondary text-sm">Đã biết</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-border-light">
                <div className="text-2xl font-bold text-primary-30">
                  {learningCount}
                </div>
                <div className="text-text-secondary text-sm">Đang học</div>
              </div>
            </div>
          </div>

          {/* Bước tiếp theo */}
          <div className="mb-6">
            <h4 className="font-medium text-text-primary mb-3">
              Bước tiếp theo
            </h4>
            <div className="space-y-3">
              <button
                onClick={focusOnLearningCards}
                disabled={learningCount === 0}
                className="w-full flex items-center justify-between p-4 bg-white border border-border-light rounded-xl hover:shadow-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-10 rounded-lg flex items-center justify-center">
                    <Book className="w-4 h-4 text-primary-30" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-text-primary">
                      Tập trung vào học {learningCount} thẻ
                    </div>
                    <div className="text-sm text-text-secondary">
                      Chỉ học những thẻ bạn chưa nắm vững
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-secondary" />
              </button>

              <button
                onClick={resetAllCards}
                className="w-full flex items-center justify-between p-4 bg-white border border-border-light rounded-xl hover:shadow-medium transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent-10 rounded-lg flex items-center justify-center">
                    <RotateCw className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-text-primary">
                      Đặt lại thẻ ghi nhớ
                    </div>
                    <div className="text-sm text-text-secondary">
                      Reset trạng thái về ban đầu
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Message - Chế độ bình thường */}
      {showCompletion && !trackingProgress && (
        <div className="mt-6 p-4 bg-gradient-to-r from-status-completed/10 to-green-100 border border-status-completed/20 rounded-2xl text-center animate-fade-in">
          <div className="flex items-center justify-center space-x-2 text-status-completed">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">
              Chúc mừng! Bạn đã hoàn thành tất cả flashcard
            </span>
          </div>
          <p className="text-text-secondary text-sm mt-1">
            Nhấn "Hoàn thành" để lưu tiến độ học tập
          </p>
          <button
            onClick={handleComplete}
            className="mt-4 px-6 py-2 bg-status-completed text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            Hoàn thành
          </button>
        </div>
      )}

      {/* Study Tips - Ẩn khi showCompletion */}
      {!showCompletion && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Mẹo học hiệu quả</h4>
              <p className="text-blue-700 text-sm mt-1">
                {trackingProgress
                  ? "Sử dụng nút 'Đang học' và 'Đã biết' để theo dõi tiến độ. Hệ thống sẽ giúp bạn tập trung vào những thẻ cần học thêm."
                  : "Lật thẻ để xem nghĩa và hình ảnh. Lặp lại nhiều lần để ghi nhớ từ vựng lâu hơn."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
