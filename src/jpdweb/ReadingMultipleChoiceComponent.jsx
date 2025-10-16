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
    return <div>No options available</div>;
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
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl border p-4 mb-6">
      <div className="max-h-40 overflow-y-auto mb-4 pr-2">
        <h2 className="text-base font-semibold text-gray-800">
          {mulptipleQuizz.question}
        </h2>
      </div>

      <form className="space-y-2 text-sm">
        {mulptipleQuizz.readingQuestionOptions.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = option.correct;
          
          return (
            <label
              key={`${mulptipleQuizz.rqId}-${i}`}
              htmlFor={`option-${mulptipleQuizz.rqId}-${i}`}
              className={`flex items-start p-2 rounded-md cursor-pointer border transition text-sm ${
                submitted
                  ? isCorrect
                    ? "border-green-500 bg-green-50"
                    : isSelected
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200"
                  : isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "hover:border-blue-400 border-gray-200"
              }`}
            >
              <input
                type="radio"
                name={`quiz-${mulptipleQuizz.rqId}`}  // ✅ Use rqId
                id={`option-${mulptipleQuizz.rqId}-${i}`}
                value={i}
                checked={isSelected}
                onChange={handSelect}
                disabled={false}
                className="mt-1 mr-2 accent-blue-600"
              />
              <span className="text-gray-700">{option.optionText}</span>
            </label>
          );
        })}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitted || selected === null}
          className={`w-full py-1.5 rounded-md font-medium text-sm text-white transition ${
            submitted || selected === null
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {submitted ? "Đáp án đã được chọn" : "Xác nhận"}
        </button>
      </form>

      {submitted && (
        <div
          className={`mt-3 p-2 rounded-md text-xs font-medium ${
            isCorrectAnswer ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {isCorrectAnswer ? "Correct!" : mulptipleQuizz.feedBack || "Wrong answer!"}
        </div>
      )}
    </div>
  );
}