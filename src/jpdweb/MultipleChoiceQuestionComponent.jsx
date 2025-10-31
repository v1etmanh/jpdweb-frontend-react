import { useEffect, useState } from "react";

export default function QuestionCard({ mulptipleQuizz, isFeedBack, increNum }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSelected(null);
    setSubmitted(false);
  }, [mulptipleQuizz]);

  const handleSelect = (e) => {
    setSelected(parseInt(e.target.value));
  };

  const handleSubmit = () => {
    if (selected !== null) {
      setSubmitted(true);
      const isCorrect = mulptipleQuizz.options[selected]?.correct;
      if (isCorrect) increNum();
    }
  };

  const isCorrect = submitted && mulptipleQuizz.options[selected]?.correct;

  // Modern color schemes based on 30-10 rule
  const optionColors = [
    { 
      bg: "bg-[#06B6D4]", 
      hover: "hover:bg-[#0891B2]", 
      selected: "bg-[#0891B2]",
      light: "bg-[#ECFEFF]",
      border: "border-[#06B6D4]"
    },
    { 
      bg: "bg-[#0EA5E9]", 
      hover: "hover:bg-[#0284C7]", 
      selected: "bg-[#0284C7]",
      light: "bg-[#F0F9FF]",
      border: "border-[#0EA5E9]"
    },
    { 
      bg: "bg-[#06B6D4]", 
      hover: "hover:bg-[#0891B2]", 
      selected: "bg-[#0891B2]",
      light: "bg-[#ECFEFF]",
      border: "border-[#06B6D4]"
    },
    { 
      bg: "bg-[#0EA5E9]", 
      hover: "hover:bg-[#0284C7]", 
      selected: "bg-[#0284C7]",
      light: "bg-[#F0F9FF]",
      border: "border-[#0EA5E9]"
    }
  ];

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="question-card-container">
      {/* Question Header - No card, directly on container */}
      <div className="question-header">
        <h2 className="question-text">
          {mulptipleQuizz.questionText}
        </h2>
      </div>

      {/* Options Grid */}
      <div className="options-grid">
        {mulptipleQuizz.options.map((option, i) => {
          const isOptionSelected = selected === i;
          const isOptionCorrect = submitted && option.correct;
          const isOptionWrong = submitted && isOptionSelected && !option.correct;
          const colorScheme = optionColors[i];

          return (
            <label
              key={i}
              htmlFor={`option-${mulptipleQuizz.mcId}-${option.mcoId}`}
              className={`
                option-card
                ${isOptionSelected && !submitted ? 'option-selected' : ''}
                ${submitted ? 'option-submitted' : ''}
                ${isOptionCorrect ? 'option-correct' : ''}
                ${isOptionWrong ? 'option-wrong' : ''}
              `}
              style={{
                '--primary-color': colorScheme.bg.replace('bg-', ''),
                '--hover-color': colorScheme.hover.replace('hover:', '').replace('bg-', ''),
                '--selected-color': colorScheme.selected.replace('bg-', ''),
                '--light-color': colorScheme.light.replace('bg-', '')
              }}
            >
              <input
                type="radio"
                name={`quiz-${mulptipleQuizz.mcId}`}
                id={`option-${mulptipleQuizz.mcId}-${option.mcoId}`}
                value={i}
                checked={isOptionSelected}
                onChange={handleSelect}
                disabled={submitted}
                className="option-input"
              />
              
              {/* Option Indicator - Only letter */}
              <div className="option-indicator">
                <span className="option-label">{optionLabels[i]}</span>
              </div>

              {/* Option Content */}
              <div className="option-content">
                <span className="option-text">
                  {option.optionText}
                </span>
                
                {/* Feedback Icons */}
                {submitted && option.correct && (
                  <div className="feedback-icon correct">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                )}
                {isOptionWrong && (
                  <div className="feedback-icon wrong">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Selection Glow */}
              {isOptionSelected && !submitted && (
                <div className="selection-glow"></div>
              )}
            </label>
          );
        })}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div className="submit-section">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selected === null}
            className={`submit-button ${selected !== null ? 'submit-active' : 'submit-disabled'}`}
          >
            {selected !== null ? (
              <>
                <svg className="button-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Xác nhận câu trả lời
              </>
            ) : (
              'Chọn một đáp án'
            )}
          </button>
        </div>
      )}

      {/* Feedback Section - Updated with subtle design */}
      {isFeedBack && submitted && (
        <div className="feedback-section">
          <div className={`feedback-card ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
            <div className="feedback-content">
              <div className="feedback-title">
                {isCorrect ? "Chính xác! 🎉" : "Cần cải thiện"}
              </div>
              <div className="feedback-message">
                {isCorrect
                  ? "Bạn đã trả lời đúng!"
                  : mulptipleQuizz.feedBack || "Hãy xem lại kiến thức và thử lại!"}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .question-card-container {
          background: #F1F5F9;
          width: 100%;
          padding: 1.5rem;
          font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
          border-radius: 12px;
          box-sizing: border-box;
        }

        .question-header {
          text-align: center;
          margin-bottom: 1.5rem;
          padding: 0;
        }

        .question-text {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1E293B;
          line-height: 1.5;
          margin: 0;
        }

        .options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .option-card {
          position: relative;
          background: white;
          border: 2px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 1rem;
          min-height: 80px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          box-sizing: border-box;
        }

        .option-card:hover:not(.option-submitted) {
          border-color: var(--primary-color);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(6, 182, 212, 0.15);
        }

        .option-selected {
          border-color: var(--selected-color) !important;
          background: var(--light-color);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(6, 182, 212, 0.2);
        }

        .option-correct {
          border-color: #10B981 !important;
          background: #ECFDF5 !important;
          color: #065F46;
        }

        .option-wrong {
          border-color: #EF4444 !important;
          background: #FEF2F2 !important;
          color: #7F1D1D;
          opacity: 0.7;
        }

        .option-input {
          display: none;
        }

        .option-indicator {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .option-label {
          background: #06B6D4;
          color: white;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .option-selected .option-label {
          background: #F97316;
          transform: scale(1.1);
        }

        .option-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1;
          gap: 1rem;
        }

        .option-text {
          font-weight: 500;
          color: #1E293B;
          font-size: 0.95rem;
          line-height: 1.4;
          flex: 1;
        }

        .option-correct .option-text,
        .option-wrong .option-text {
          font-weight: 600;
        }

        .feedback-icon {
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .feedback-icon.correct {
          background: #10B981;
          color: white;
        }

        .feedback-icon.wrong {
          background: #EF4444;
          color: white;
        }

        .selection-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 12px;
          background: linear-gradient(45deg, #06B6D4, #F97316);
          z-index: -1;
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .submit-section {
          padding: 0.5rem 0 1rem;
          text-align: center;
        }

        .submit-button {
          background: #06B6D4;
          color: white;
          border: none;
          border-radius: 50px;
          padding: 0.875rem 2rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
        }

        .submit-active:hover {
          background: #0891B2;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4);
        }

        .submit-disabled {
          background: #CBD5E1;
          color: #64748B;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .button-icon {
          width: 1.125rem;
          height: 1.125rem;
        }

        .feedback-section {
          padding: 0.5rem 0 1rem;
        }

        .feedback-card {
          max-width: 100%;
          margin: 0 auto;
          padding: 1rem 1.25rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          box-sizing: border-box;
          border: 1px solid #E2E8F0;
        }

        .feedback-correct {
          background: #F8FAFC;
          color: #1E293B;
          border-left: 4px solid #06B6D4;
        }

        .feedback-wrong {
          background: #F8FAFC;
          color: #1E293B;
          border-left: 4px solid #EF4444;
        }

        .feedback-content {
          flex: 1;
          text-align: center;
        }

        .feedback-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #06B6D4;
        }

        .feedback-wrong .feedback-title {
          color: #EF4444;
        }

        .feedback-message {
          font-size: 0.875rem;
          opacity: 0.8;
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .question-card-container {
            padding: 1rem;
          }

          .question-header {
            margin-bottom: 1rem;
          }

          .question-text {
            font-size: 1.1rem;
          }

          .options-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
            margin-bottom: 1rem;
          }

          .option-card {
            padding: 1rem;
            min-height: 70px;
            gap: 0.75rem;
          }

          .option-text {
            font-size: 0.9rem;
          }

          .submit-button {
            padding: 0.75rem 1.5rem;
            font-size: 0.95rem;
          }

          .feedback-card {
            padding: 0.875rem 1rem;
          }

          .feedback-title {
            font-size: 0.95rem;
          }

          .feedback-message {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .question-card-container {
            padding: 0.75rem;
          }

          .question-text {
            font-size: 1rem;
          }

          .option-card {
            padding: 0.875rem;
            min-height: 65px;
            gap: 0.625rem;
          }

          .option-label {
            width: 2rem;
            height: 2rem;
            font-size: 0.85rem;
            border-radius: 8px;
          }

          .option-text {
            font-size: 0.875rem;
          }

          .submit-button {
            padding: 0.625rem 1.25rem;
            font-size: 0.9rem;
          }
          
          .feedback-card {
            padding: 0.75rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}