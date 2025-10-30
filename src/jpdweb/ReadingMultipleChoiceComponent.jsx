import { useEffect, useState } from "react";

export default function ReadingMultipleChoiceComponent({ mulptipleQuizz, incre }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    console.log("Question data:", mulptipleQuizz);
    setSelected(null);
    setSubmitted(false);
  }, [mulptipleQuizz]);

  if (!mulptipleQuizz?.readingQuestionOptions) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-surface rounded-2xl shadow-soft border border-border-light animate-fade-in">
        <div className="text-center text-text-secondary font-medium">
          No options available
        </div>
      </div>
    );
  }

  const handSelect = (e) => {
    console.log("Selected option:", e.target.value, "Submitted:", submitted);
    
    if (!submitted) {
      setSelected(parseInt(e.target.value));
    }
  };

  const handleSubmit = () => {
    if (selected !== null) {
      setSubmitted(true);
      const isCorrect = mulptipleQuizz.readingQuestionOptions[selected]?.correct;
      console.log("Is correct:", isCorrect);
      if (isCorrect) incre();
    }
  };

  const isCorrectAnswer = submitted && mulptipleQuizz.readingQuestionOptions[selected]?.correct;

  return (
    <div className="max-w-2xl mx-auto bg-surface rounded-2xl shadow-card border border-border-light p-6 mb-6 animate-slide-up">
      {/* Question Section */}
      <div className="max-h-48 overflow-y-auto mb-6 pr-3 custom-scrollbar">
        <h2 className="text-lg font-semibold text-text-primary leading-relaxed">
          {mulptipleQuizz.question}
        </h2>
      </div>

      {/* Options Section */}
      <form className="space-y-3">
        {mulptipleQuizz.readingQuestionOptions.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = option.correct;
          
          let optionStyle = "";
          if (submitted) {
            if (isCorrect) {
              optionStyle = "border-status-completed bg-green-50 shadow-sm";
            } else if (isSelected) {
              optionStyle = "border-red-400 bg-red-50 shadow-sm";
            } else {
              optionStyle = "border-border-main bg-white";
            }
          } else {
            optionStyle = isSelected 
              ? "border-primary-30 bg-cyan-50 shadow-soft" 
              : "border-border-main hover:border-primary-30 hover:shadow-soft bg-white transition-all duration-200";
          }
          
          return (
            <label
              key={`${mulptipleQuizz.rqId}-${i}`}
              htmlFor={`option-${mulptipleQuizz.rqId}-${i}`}
              className={`flex items-start p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 ${optionStyle} animate-scale-in`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <input
                type="radio"
                name={`quiz-${mulptipleQuizz.rqId}`}
                id={`option-${mulptipleQuizz.rqId}-${i}`}
                value={i}
                checked={isSelected}
                onChange={handSelect}
                disabled={submitted}
                className="mt-0.5 mr-3 accent-primary-30 scale-110"
              />
              <span className="text-text-primary flex-1 leading-relaxed">
                {option.optionText}
              </span>
              
              {/* Status icons for submitted state */}
              {submitted && isCorrect && (
                <div className="ml-2 text-status-completed text-lg animate-scale-in">
                  ✓
                </div>
              )}
              {submitted && isSelected && !isCorrect && (
                <div className="ml-2 text-red-500 text-lg animate-scale-in">
                  ✗
                </div>
              )}
            </label>
          );
        })}

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitted || selected === null}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 mt-4 ${
            submitted || selected === null
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-primary-30 hover:bg-primary-dark shadow-soft hover:shadow-medium transform hover:scale-[1.02]"
          }`}
        >
          {submitted ? "Đáp án đã được chọn" : "Xác nhận đáp án"}
        </button>
      </form>

      {/* Feedback Section */}
      {submitted && (
        <div
          className={`mt-4 p-4 rounded-xl text-sm font-medium animate-fade-in ${
            isCorrectAnswer 
              ? "bg-green-100 text-status-completed border border-status-completed" 
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-3 ${
              isCorrectAnswer ? "bg-status-completed" : "bg-red-500"
            }`}></div>
            {isCorrectAnswer 
              ? "Chính xác! Bạn đã trả lời đúng." 
              : mulptipleQuizz.feedBack || "Chưa chính xác! Hãy thử lại lần sau."}
          </div>
        </div>
      )}
    </div>
  );
}