import { useEffect, useState } from "react";
import GapfillComponent from "./GapfillComponent";
import { ArrowLeft, ArrowRight, CheckCircleFill, StarFill } from "react-bootstrap-icons";

export default function GapFillContainer({ questions, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numTrueAns, setNumTrueAns] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showCompleteEffect, setShowCompleteEffect] = useState(false);

  const increNumTrueAns = () => {
    setNumTrueAns(prev => prev + 1);
  };

  const next = () => {
    setCurrentIndex(prev =>
      prev < questions.length - 1 ? prev + 1 : prev
    );
  };
  
  const handlePreNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  useEffect(() => {
    if (
      !finished &&
      questions.length > 0 &&
      numTrueAns >= (questions.length/2)
    ) {
      setFinished(true);
      if(currentIndex === questions.length-1) {
        setShowCompleteEffect(true);
        setTimeout(() => {
          setShowCompleteEffect(false);
        }, 3000);
      }
      onComplete();
    }
  }, [numTrueAns, questions.length, finished, onComplete, currentIndex]);
  
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const completionRate = Math.round((numTrueAns / questions.length) * 100);
 
  return (
    <div className="w-full max-w-2xl mx-auto bg-background flex flex-col">
      {/* Hiệu ứng hoàn thành */}
      {showCompleteEffect && (
        <div className="completion-overlay">
          <div className="completion-content animate-bounce-gentle">
            <div className="completion-icon">
              <CheckCircleFill className="text-status-completed" />
            </div>
            <div className="completion-title">🎉 Xuất sắc! 🎉</div>
            <div className="completion-subtitle">
              Bạn đã hoàn thành {completionRate}% bài tập
            </div>
            <div className="completion-stats">
              Điểm số: {numTrueAns}/{questions.length}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col p-4">
        {/* Header Progress Card - Tối ưu kích thước */}
        <div className="bg-surface rounded-lg shadow-card border border-border-light p-3 mb-3 animate-fade-in">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-primary-30 text-white px-2 py-1 rounded-md font-bold text-xs">
                Câu {currentIndex + 1} / {questions.length}
              </div>
              <div className="flex items-center gap-1 text-text-secondary text-xs">
                <StarFill className="text-accent-10 w-3 h-3" />
                <span className="font-semibold">{numTrueAns}/{questions.length}</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-status-completed to-green-400 text-white px-2 py-1 rounded-md text-center min-w-[50px]">
              <div className="text-xs font-bold">{completionRate}%</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-background rounded-full h-1 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-primary-30 to-primary-dark h-1 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card - Container linh hoạt */}
        <div className="bg-surface rounded-lg shadow-card border border-border-light overflow-hidden mb-3 animate-scale-in">
          <div className="p-0.5 bg-gradient-to-r from-primary-30 to-accent-10"></div>
          <div className="p-3">
            <GapfillComponent
              questionData={currentQuestion}
              inCreNum={increNumTrueAns}
            />
          </div>
        </div>

        {/* Navigation Buttons - Nhỏ gọn */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePreNext}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-semibold text-white transition-all duration-200 text-xs ${
              currentIndex === 0 
                ? "bg-gray-400 cursor-not-allowed opacity-50" 
                : "bg-primary-30 hover:bg-primary-dark hover:shadow-medium"
            }`}
          >
            <ArrowLeft className="w-3 h-3" />
            Trước
          </button>

          {/* Progress Dots - Nhỏ gọn */}
          <div className="flex gap-1">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary-30 scale-110"
                    : index < currentIndex
                    ? "bg-status-completed"
                    : "bg-border-main"
                } ${
                  index <= currentIndex ? "cursor-pointer" : "cursor-default"
                }`}
                onClick={() => index <= currentIndex && setCurrentIndex(index)}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={currentIndex === questions.length - 1}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-semibold text-white transition-all duration-200 text-xs ${
              currentIndex === questions.length - 1
                ? "bg-gray-400 cursor-not-allowed opacity-50" 
                : "bg-accent-10 hover:bg-accent-dark hover:shadow-medium"
            }`}
          >
            Tiếp
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .completion-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .completion-content {
          background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 20px 60px rgba(6, 182, 212, 0.3);
          border: 2px solid #06B6D4;
          max-width: 300px;
          width: 90%;
        }

        .completion-icon {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
        }

        .completion-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: #1E293B;
          margin-bottom: 0.5rem;
        }

        .completion-subtitle {
          font-size: 0.875rem;
          color: #475569;
          margin-bottom: 0.75rem;
        }

        .completion-stats {
          background: #06B6D4;
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-weight: bold;
          font-size: 0.875rem;
        }

        @keyframes bounceGentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        .animate-bounce-gentle {
          animation: bounceGentle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}