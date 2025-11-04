import { useEffect, useState } from "react";

export default function PassageMultipleChoiceComponent({
  mulptipleQuizz, 
  questionNumber,
  selectedAnswer,
  onAnswerChange,
  submitted,
  showExplanation: forceShowExplanation // New prop to force show explanation
}) {
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    setShowExplanation(false);
  }, [mulptipleQuizz]);

  // If forceShowExplanation is true, show explanation
  const shouldShowExplanation = showExplanation || forceShowExplanation;

  if (!mulptipleQuizz?.readingQuestionOptions) {
    return (
      <div className="p-3 text-center text-text-secondary bg-surface rounded-lg border border-border-light text-xs">
        No options available
      </div>
    );
  }

  const handleSelect = (index) => {
    if (!submitted) {
      onAnswerChange(mulptipleQuizz.rqId, index);
    }
  };

  const isCorrectAnswer = submitted && selectedAnswer !== undefined && 
    mulptipleQuizz.readingQuestionOptions[selectedAnswer]?.correct;
  const correctOptionIndex = mulptipleQuizz.readingQuestionOptions.findIndex(opt => opt.correct);

  return (
    <div className="bg-white rounded-lg border border-border-light shadow-sm p-3 mb-2">
      {/* Question Header - Compact */}
      <div className="flex items-start gap-2 mb-3">
        <div className="flex-shrink-0 w-6 h-6 bg-accent-10 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">{questionNumber}</span>
        </div>
        <h3 className="text-sm font-semibold text-text-primary flex-1 leading-snug">
          {mulptipleQuizz.question}
        </h3>
      </div>

      {/* Options - Compact */}
      <div className="space-y-1.5 ml-8">
        {mulptipleQuizz.readingQuestionOptions.map((option, i) => {
          const isSelected = selectedAnswer === i;
          const isCorrect = option.correct;
          const optionLetter = String.fromCharCode(65 + i);
          
          let borderColor = "border-border-light";
          let bgColor = "bg-white";
          let textColor = "text-text-primary";
          let hoverEffect = "";
          
          if (submitted) {
            if (isCorrect) {
              borderColor = "border-status-completed";
              bgColor = "bg-status-completed/10";
            } else if (isSelected && !isCorrect) {
              borderColor = "border-red-400";
              bgColor = "bg-red-50";
              textColor = "text-red-700";
            }
          } else if (isSelected) {
            borderColor = "border-primary-30";
            bgColor = "bg-primary-30/10";
          } else {
            hoverEffect = "hover:border-primary-30 hover:shadow-xs transition-all duration-150";
          }

          return (
            <label
              key={`${mulptipleQuizz.rqId}-${i}`}
              className={`flex items-start p-2 rounded-md cursor-pointer border ${borderColor} ${bgColor} ${textColor} ${hoverEffect} ${
                !submitted ? 'group' : ''
              }`}
              onClick={() => handleSelect(i)}
            >
              <div className="flex items-center gap-2 w-full">
                <div className={`flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center font-semibold text-xs transition-all duration-150 ${
                  isSelected && !submitted 
                    ? "border-primary-30 bg-primary-30 text-white" 
                    : submitted && isCorrect 
                    ? "border-status-completed bg-status-completed text-white"
                    : submitted && isSelected && !isCorrect
                    ? "border-red-400 bg-red-400 text-white"
                    : "border-border-main bg-white text-text-secondary group-hover:border-primary-30 group-hover:text-primary-30"
                }`}>
                  {optionLetter}
                </div>
                <span className="text-xs flex-1 font-medium">{option.optionText}</span>
                {submitted && isCorrect && (
                  <span className="text-status-completed font-bold text-base">✓</span>
                )}
                {submitted && isSelected && !isCorrect && (
                  <span className="text-red-400 font-bold text-base">✗</span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Result Message - Compact */}
      {submitted && selectedAnswer !== undefined && (
        <div className={`mt-3 ml-8 p-2 rounded-md text-xs font-medium ${
          isCorrectAnswer 
            ? "bg-status-completed/10 text-status-completed border border-status-completed/20" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {isCorrectAnswer ? "✓ Correct!" : "✗ Incorrect"}
        </div>
      )}

      {/* Explanation Toggle Button - Only show when not forced */}
      {submitted && !forceShowExplanation && (
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="mt-2 ml-8 flex items-center gap-1.5 text-primary-30 hover:text-primary-dark font-medium text-xs transition-colors duration-150"
        >
          <span className="bg-primary-30/10 rounded w-4 h-4 flex items-center justify-center text-xs">
            💡
          </span>
          Explanation
          <span className={`transform transition-transform duration-150 text-xs ${showExplanation ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      )}

      {/* Explanation - Show when toggled or forced */}
      {submitted && shouldShowExplanation && (
        <div className="mt-2 ml-8 p-2 rounded-md bg-primary-30/5 border border-primary-30/20">
          <p className="text-xs text-text-primary">
            <span className="font-semibold text-primary-30">Correct: {String.fromCharCode(65 + correctOptionIndex)}</span>
            <br />
            <span className="text-text-secondary">
              {mulptipleQuizz.feedBack || "This choice best aligns with the passage content."}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}