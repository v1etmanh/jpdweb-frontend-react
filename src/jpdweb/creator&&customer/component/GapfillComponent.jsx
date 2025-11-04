import { useEffect, useState } from "react";

export default function GapfillComponent({ questionData, inCreNum }) {
  const [inputs, setInputs] = useState({});
  const [suggestions, setSuggestions] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setInputs({});
    setSuggestions({});
    setSubmitted(false);
  }, [questionData]);

  const parseQuestion = () => {
    const parts = questionData.questionText.split(/_{3,}/);
    const blanksCount = parts.length - 1;
    return { parts, blanksCount };
  };

  const { parts, blanksCount } = parseQuestion();

  const handleInputChange = (blankIndex, value) => {
    setInputs(prev => ({
      ...prev,
      [blankIndex]: value
    }));
  };

  const checkAnswers = () => {
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

  const handleSubmit = () => {
    const allFilled = Array.from({ length: blanksCount }, (_, i) => 
      (inputs[i] || "").trim() !== ""
    ).every(Boolean);

    if (allFilled) {
      setSubmitted(true);
      const { allCorrect } = checkAnswers();
      
      if (allCorrect) {
        inCreNum();
      }
    }
  };

  const canSubmit = Array.from({ length: blanksCount }, (_, i) => 
    (inputs[i] || "").trim() !== ""
  ).every(Boolean);

  const { correctAnswers, allCorrect } = submitted ? checkAnswers() : { correctAnswers: [], allCorrect: false };

  const renderQuestionWithInputs = () => {
    return parts.map((part, index) => (
      <span key={index} className="text-sm">
        {part}
        {index < blanksCount && (
          <span className="relative inline-block pointer-events-auto mx-1">
            <input
              type="text"
              value={inputs[index] || ""}
              onChange={(e) => handleInputChange(index, e.target.value)}
              disabled={submitted}
              autoFocus={index === 0}
              className={`inline-block w-20 mx-0.5 px-2 py-1 text-xs font-medium transition-all duration-200 rounded-lg border ${
                submitted
                  ? correctAnswers[index]
                    ? "border-status-completed bg-green-50 text-green-800"
                    : "border-accent-10 bg-orange-50 text-orange-800"
                  : "border-border-main bg-surface text-text-primary placeholder-text-muted focus:border-primary-30 focus:ring-1 focus:ring-primary-30/20"
              } ${!submitted ? "hover:border-primary-30/50" : ""}`}
              placeholder="..."
              size="8"
            />
          </span>
        )}
      </span>
    ));
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg pointer-events-auto">
      <h2 className="text-sm font-semibold text-text-primary mb-2">
        Điền vào chỗ trống ({blanksCount} chỗ):
      </h2>

      <div className="text-sm leading-relaxed mb-3 pointer-events-auto p-2 bg-background/30 rounded-lg min-h-[60px]">
        {renderQuestionWithInputs()}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitted || !canSubmit}
        className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-200 ${
          submitted
            ? allCorrect
              ? "bg-status-completed text-white"
              : "bg-accent-10 text-white"
            : "bg-primary-30 text-white hover:bg-primary-dark"
        } ${!canSubmit ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {submitted 
          ? (allCorrect ? "✅ Đúng" : "❌ Sai") 
          : "Kiểm tra"
        }
      </button>

      {submitted && (
        <div className="mt-2 space-y-2 animate-slide-up">
          <div
            className={`p-2 rounded-lg font-semibold text-center text-xs ${
              allCorrect 
                ? "bg-green-50 text-status-completed border border-status-completed/20" 
                : "bg-orange-50 text-accent-10 border border-accent-10/20"
            }`}
          >
            {allCorrect 
              ? "✅ Tất cả đều chính xác!" 
              : "📝 Cần điều chỉnh:"
            }
          </div>

          {!allCorrect && (
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {Array.from({ length: blanksCount }, (_, i) => {
                const isCorrect = correctAnswers[i];
                const userAnswer = inputs[i] || "";
                const correctAnswer = questionData.answers[i]?.answer || "";
                
                if (!isCorrect) {
                  return (
                    <div
                      key={i}
                      className="p-2 rounded bg-orange-50 border border-orange-100 text-orange-800 text-xs"
                    >
                      <div className="font-semibold mb-1 flex items-center gap-1">
                        <span className="w-4 h-4 bg-accent-10 text-white rounded-full flex items-center justify-center text-xs">
                          {i + 1}
                        </span>
                        Chỗ trống {i + 1}
                      </div>
                      <div className="flex justify-between gap-2 text-xs">
                        <div className="flex-1 bg-white p-1 rounded border">
                          <div className="text-text-secondary">Bạn trả lời:</div>
                          <div className="font-mono truncate">{userAnswer || "(trống)"}</div>
                        </div>
                        <div className="flex-1 bg-white p-1 rounded border border-status-completed/30">
                          <div className="text-text-secondary">Đáp án:</div>
                          <div className="font-mono text-status-completed font-semibold truncate">{correctAnswer}</div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}

          {questionData.feedBack && (
            <div className="p-2 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 text-xs">
              <div className="font-semibold mb-1">💡 Ghi chú:</div>
              <div className="text-text-secondary">{questionData.feedBack}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}