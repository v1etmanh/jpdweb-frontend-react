import { useEffect, useState } from "react";

export default function KahootGapfill({ 
  questionData, 
  sessionCode,
  participantId,
  onSubmitAnswer,
  isAnswerSubmitted,
  questionResult 
}) {
  const [inputs, setInputs] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setInputs({});
    setIsSubmitting(false);
  }, [questionData.mcId]);

  const parseQuestion = () => {
    const parts = questionData.questionText.split(/_{3,}/);
    const blanksCount = parts.length - 1;
    return { parts, blanksCount };
  };

  const { parts, blanksCount } = parseQuestion();

  const handleInputChange = (blankIndex, value) => {
    if (isAnswerSubmitted || isSubmitting) return;
    
    setInputs(prev => ({
      ...prev,
      [blankIndex]: value
    }));
  };

  const handleSubmit = async () => {
    const allFilled = Array.from({ length: blanksCount }, (_, i) => 
      (inputs[i] || "").trim() !== ""
    ).every(Boolean);

    if (!allFilled || isAnswerSubmitted || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 🚀 Gộp tất cả answers thành string, cách nhau bằng dấu phẩy
      const answersArray = Array.from({ length: blanksCount }, (_, i) => 
        (inputs[i] || "").trim()
      );
      const answersString = answersArray.join(",");

      await onSubmitAnswer({
        sessionCode,
        participantId,
        questionId: questionData.mcId,
        answer: answersString // Format: "answer1,answer2,answer3"
      });

      console.log("✅ Gap-fill answers submitted");
    } catch (error) {
      console.error("❌ Submit error:", error);
      setIsSubmitting(false);
    }
  };

  const canSubmit = Array.from({ length: blanksCount }, (_, i) => 
    (inputs[i] || "").trim() !== ""
  ).every(Boolean);

  // Check correctness after teacher ends question
  const checkAnswers = () => {
    if (!questionResult) return { correctAnswers: [], allCorrect: false };

    const correctAnswers = [];
    let allCorrect = true;

    for (let i = 0; i < blanksCount; i++) {
      const userAnswer = (inputs[i] || "").trim().toLowerCase();
      const correctAnswer = questionData.answers[i]?.answer.trim().toLowerCase() || "";
      const isCorrect = userAnswer === correctAnswer;
      
      correctAnswers.push(isCorrect);
      if (!isCorrect) allCorrect = false;
    }

    return { correctAnswers, allCorrect };
  };

  const { correctAnswers, allCorrect } = checkAnswers();

  const renderQuestionWithInputs = () => {
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < blanksCount && (
          <span className="relative inline-block pointer-events-auto">
            <input
              type="text"
              value={inputs[index] || ""}
              onChange={(e) => handleInputChange(index, e.target.value)}
              disabled={isAnswerSubmitted || isSubmitting}
              autoFocus={index === 0}
              className={`inline-block w-40 mx-2 px-4 py-3 text-lg border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                questionResult
                  ? correctAnswers[index]
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              } ${(isAnswerSubmitted || isSubmitting) ? 'bg-gray-50' : ''}`}
              placeholder={`Answer ${index + 1}`}
            />
          </span>
        )}
      </span>
    ));
  };

  return (
    <div className="max-w-2xl w-full mx-auto mt-6 bg-white shadow-lg rounded-xl p-6 pointer-events-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Fill in the blanks ({blanksCount} {blanksCount === 1 ? 'blank' : 'blanks'}):
      </h2>

      <div className="text-lg leading-relaxed mb-6 min-h-[80px] pointer-events-auto">
        {renderQuestionWithInputs()}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || isAnswerSubmitted || !canSubmit}
        className={`mt-4 w-full py-3 text-lg rounded-lg font-semibold text-white transition-all ${
          isSubmitting
            ? "bg-blue-400"
            : questionResult
            ? allCorrect
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
            : "bg-indigo-500 hover:bg-indigo-600"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isSubmitting 
          ? "⏳ Submitting..." 
          : isAnswerSubmitted && !questionResult
          ? "✅ Submitted! Waiting for results..."
          : questionResult
          ? (allCorrect ? "✅ All Correct!" : "❌ Some Incorrect")
          : "Submit Answers"
        }
      </button>

      {questionResult && (
        <div className="mt-4 space-y-2">
          <div
            className={`p-4 rounded-lg font-bold ${
              allCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {allCorrect 
              ? "Perfect! All answers are correct!" 
              : "Some answers need correction. Check the details below:"
            }
          </div>

          {!allCorrect && (
            <div className="space-y-2">
              {Array.from({ length: blanksCount }, (_, i) => {
                const isCorrect = correctAnswers[i];
                const userAnswer = inputs[i] || "";
                const correctAnswer = questionData.answers[i]?.answer || "";
                
                return (
                  <div
                    key={i}
                    className={`p-3 rounded-lg text-sm ${
                      isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}
                  >
                    <div className="font-semibold mb-1">Blank {i + 1}:</div>
                    <div>Your answer: <span className="font-mono">{userAnswer}</span></div>
                    {!isCorrect && (
                      <div>Correct answer: <span className="font-mono font-bold">{correctAnswer}</span></div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {questionData.feedBack && (
            <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
              <div className="font-semibold mb-1">Additional Notes:</div>
              <div>{questionData.feedBack}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}