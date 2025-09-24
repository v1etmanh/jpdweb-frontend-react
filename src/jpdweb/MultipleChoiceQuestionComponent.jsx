import { useEffect, useState } from "react";

export default function QuestionCard({ mulptipleQuizz, isFeedBack,increNum }) {
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
    if (selected !== null) {setSubmitted(true);
     const isCorrect = mulptipleQuizz.mutipleChoiceOption[selected]?.correct;
     if(isCorrect)increNum()
    }
  };

  const isCorrect =
    submitted && mulptipleQuizz.mutipleChoiceOption[selected]?.correct;

  return (
    <div className="max-w-md w-full mx-auto mt-6 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {mulptipleQuizz.question}
      </h2>
      <form>
        <div className="space-y-3">
          {mulptipleQuizz.mutipleChoiceOption.map((option, i) => {
            const isOptionSelected = selected === i;
            const isOptionCorrect = submitted && option.correct;
            const isOptionWrong = submitted && isOptionSelected && !option.correct;

            const baseClasses =
              "relative rounded-lg px-4 py-2 border cursor-pointer transition-all duration-300 hover:scale-105 active:bg-red-500";
            const selectedBorder = isOptionSelected
              ? "border-blue-500"
              : "border-gray-200";  
           const bgColor = isOptionCorrect
  ? "bg-green-100"
  : isOptionWrong
  ? "bg-red-100"
  : isOptionSelected
  ? "bg-blue-100"  // Màu nền khi chọn nhưng chưa submit
  : "bg-white";

            return (
              <label
                key={i}
                htmlFor={`option-${mulptipleQuizz.mcqId}-${option.optionId}`}
                className={`${baseClasses} ${selectedBorder} ${bgColor} block`}
              >
                <input
                  type="radio"
                  name={`quiz-${mulptipleQuizz.mcqId}`}
                  id={`option-${mulptipleQuizz.mcqId}-${option.optionId}`}
                  value={i}
                  checked={isOptionSelected}
                  onChange={handleSelect}
                  disabled={submitted}
                  className="hidden"
                />
                {option.optionText}
                {submitted && option.correct && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-xl">
                    ✓
                  </span>
                )}
                {isOptionWrong && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-xl">
                    ✕
                  </span>
                )}
              </label>
            );
          })}   
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitted || selected === null}
          className={`mt-4 w-full py-2 text-white font-semibold rounded-lg transition-all ${
            submitted
              ? isCorrect
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-600 hover:bg-red-700"
              : "bg-indigo-500 hover:bg-indigo-600"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {submitted
            ? isCorrect
              ? "✅ Correct Answer!"
              : "❌ Incorrect Answer"
            : "Submit Answer"}
        </button>
      </form>

      {isFeedBack && submitted && (
        <div
          className={`mt-4 p-4 rounded-lg text-sm ${
            isCorrect
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <div className="flex items-start gap-2">
            <div>
           
              <div className="mt-1 font-bold">
                {isCorrect
                  ? "Great job!"
                  : mulptipleQuizz.feedBack ||
                    "Incorrect answer"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
