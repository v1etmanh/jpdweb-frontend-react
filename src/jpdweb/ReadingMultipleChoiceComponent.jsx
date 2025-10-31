import { useEffect, useState } from "react";

export default function ReadingMultipleChoiceComponent({ 
  mulptipleQuizz, 
  incre, 
  questionNumber,
  selectedAnswer,
  onAnswerChange,
  submitted 
}) {
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    setShowExplanation(false);
  }, [mulptipleQuizz]);

  if (!mulptipleQuizz?.readingQuestionOptions) {
    return <div>No options available</div>;
  }

  const handleSelect = (index) => {
    if (!submitted) {
      onAnswerChange(mulptipleQuizz.rqId, index);
    }
  };

  const isCorrectAnswer = submitted && selectedAnswer !== undefined && mulptipleQuizz.readingQuestionOptions[selectedAnswer]?.correct;
  const correctOptionIndex = mulptipleQuizz.readingQuestionOptions.findIndex(opt => opt.correct);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 mb-4">
      {/* Question Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">{questionNumber}</span>
        </div>
        <h3 className="text-base font-semibold text-gray-900 flex-1">
          {mulptipleQuizz.question}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-2 ml-11">
        {mulptipleQuizz.readingQuestionOptions.map((option, i) => {
          const isSelected = selectedAnswer === i;
          const isCorrect = option.correct;
          const optionLetter = String.fromCharCode(65 + i); // A, B, C, D
          
          let borderColor = "border-gray-200";
          let bgColor = "bg-white";
          
          if (submitted) {
            if (isCorrect) {
              borderColor = "border-green-500";
              bgColor = "bg-green-50";
            } else if (isSelected && !isCorrect) {
              borderColor = "border-red-500";
              bgColor = "bg-red-50";
            }
          } else if (isSelected) {
            borderColor = "border-blue-500";
            bgColor = "bg-blue-50";
          }

          return (
            <label
              key={`${mulptipleQuizz.rqId}-${i}`}
              className={`flex items-start p-3 rounded-lg cursor-pointer border-2 transition-all ${borderColor} ${bgColor} ${
                !submitted ? 'hover:border-blue-400' : ''
              }`}
              onClick={() => handleSelect(i)}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex-shrink-0 w-7 h-7 rounded border-2 border-gray-300 flex items-center justify-center font-semibold text-sm text-gray-600">
                  {optionLetter}
                </div>
                <span className="text-sm text-gray-800 flex-1">{option.optionText}</span>
                {submitted && isCorrect && (
                  <span className="text-green-600 font-bold text-xl">✓</span>
                )}
                {submitted && isSelected && !isCorrect && (
                  <span className="text-red-600 font-bold text-xl">✗</span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Explanation Toggle Button */}
      {submitted && (
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="mt-4 ml-11 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          <span className="bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center text-xs">
            ℹ️
          </span>
          Giải thích đáp án
          <span className={`transform transition-transform ${showExplanation ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      )}

      {/* Explanation */}
      {submitted && showExplanation && (
        <div className="mt-3 ml-11 p-4 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm text-gray-800">
            <span className="font-semibold">Đáp án đúng: {String.fromCharCode(65 + correctOptionIndex)}</span>
            <br />
            {mulptipleQuizz.feedBack || "Sự lựa chọn này phù hợp nhất với nội dung của đoạn văn."}
          </p>
        </div>
      )}

      {/* Result Message */}
      {submitted && selectedAnswer !== undefined && (
        <div className={`mt-4 ml-11 p-3 rounded-lg text-sm font-medium ${
          isCorrectAnswer 
            ? "bg-green-100 text-green-800 border border-green-300" 
            : "bg-red-100 text-red-800 border border-red-300"
        }`}>
          {isCorrectAnswer ? "✓ Chính xác!" : "✗ Sai rồi. Hãy xem giải thích bên dưới."}
        </div>
      )}
    </div>
  );
}