import { useEffect, useState } from "react";

export default function KahootMutiplechoice({ 
  mulptipleQuizz, 
  sessionCode,
  participantId,
  onSubmitAnswer, // Callback từ parent để gọi WebSocket
  isAnswerSubmitted, // Nhận từ parent qua WebSocket response
  questionResult // Kết quả từ teacher khi end question
}) {
  const [selected, setSelected] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset khi câu hỏi mới
  useEffect(() => {
    setSelected(null);
    setIsSubmitting(false);
  }, [mulptipleQuizz.mcId]);

  const handleSelect = async (e) => {
    const selectedIndex = parseInt(e.target.value);
    const selectedOption = mulptipleQuizz.options[selectedIndex];
    console.log(selectedOption.mcoId)
    if (isAnswerSubmitted || isSubmitting) return; // Prevent double submit
    
    setSelected(selectedIndex);
    setIsSubmitting(true);

    try {
      // 🚀 GỌI API NGAY LẬP TỨC
      await onSubmitAnswer({
        sessionCode,
        participantId,
        questionId: mulptipleQuizz.mcId,
        answer: String(selectedOption.mcoId)// Gửi ID của option
      });
      
      console.log("✅ Answer submitted successfully");
    } catch (error) {
      console.error("❌ Submit error:", error);
      setIsSubmitting(false);
      // Có thể show toast error ở đây
    }
  };

  // Kiểm tra xem có phải đáp án đúng không (sau khi teacher end question)
  const isCorrect = questionResult && 
    questionResult.results.find(r => r.participantId === participantId)?.correct;

  return (
    <div className="max-w-md w-full mx-auto mt-6 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {mulptipleQuizz.questionText}
      </h2>
      
      <div className="space-y-3">
        {mulptipleQuizz.options.map((option, i) => {
          const isOptionSelected = selected === i;
          const isOptionCorrect = questionResult && option.correct;
          const isOptionWrong = questionResult && isOptionSelected && !option.correct;

          const baseClasses =
            "relative rounded-lg px-4 py-2 border cursor-pointer transition-all duration-300 hover:scale-105";
          
          const selectedBorder = isOptionSelected
            ? "border-blue-500"
            : "border-gray-200";
          
          const bgColor = isOptionCorrect
            ? "bg-green-100"
            : isOptionWrong
            ? "bg-red-100"
            : isOptionSelected
            ? "bg-blue-100"
            : "bg-white";

          return (
            <label
              key={i}
              htmlFor={`option-${mulptipleQuizz.mcId}-${option.mcoId}`}
              className={`${baseClasses} ${selectedBorder} ${bgColor} block ${
                isAnswerSubmitted || isSubmitting ? 'cursor-not-allowed opacity-75' : ''
              }`}
            >
              <input
                type="radio"
                name={`quiz-${mulptipleQuizz.mcId}`}
                id={`option-${mulptipleQuizz.mcId}-${option.mcoId}`}
                value={i}
                checked={isOptionSelected}
                onChange={handleSelect}
                disabled={isAnswerSubmitted || isSubmitting}
                className="hidden"
              />
              {option.optionText}
              
              {/* Show tick/cross after teacher ends question */}
              {questionResult && option.correct && (
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

      {/* Status indicator */}
      <div className="mt-4 text-center">
        {isSubmitting && (
          <div className="text-blue-600 font-semibold animate-pulse">
            ⏳ Submitting answer...
          </div>
        )}
        {isAnswerSubmitted && !questionResult && (
          <div className="text-green-600 font-semibold">
            ✅ Answer submitted! Waiting for results...
          </div>
        )}
        {questionResult && (
          <div className={`p-4 rounded-lg text-sm font-bold ${
            isCorrect
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}>
            {isCorrect ? "✅ Correct Answer!" : "❌ Incorrect Answer"}
            {!isCorrect && mulptipleQuizz.feedBack && (
              <div className="mt-2 font-normal">{mulptipleQuizz.feedBack}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}