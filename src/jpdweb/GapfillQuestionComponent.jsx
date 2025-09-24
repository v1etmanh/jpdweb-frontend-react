
import { useEffect, useState } from "react";
import { toHiragana } from "wanakana";

export default function GapFillQuestionComponent({ questionData, inCreNum }) {
  const [inputs, setInputs] = useState({});
  const [suggestions, setSuggestions] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Reset state khi questionData thay đổi
  useEffect(() => {
    function restate() {
      setInputs({});
      setSuggestions({});
      setSubmitted(false);
    }
    restate();
  }, [questionData]);

  // Tách câu hỏi thành các phần và xác định số lượng blanks
  const parseQuestion = () => {
    const parts = questionData.question.split("____");
    const blanksCount = parts.length - 1;
    return { parts, blanksCount };
  };

  const { parts, blanksCount } = parseQuestion();

  // Xử lý thay đổi input cho từng blank
  const handleInputChange = (blankIndex, value) => {
    setInputs(prev => ({
      ...prev,
      [blankIndex]: value
    }));

    // Xử lý gợi ý Hiragana
    const romajiMatch = value.match(/[a-z']+$/i);
    if (romajiMatch) {
      const romaji = romajiMatch[0];
      const kana = toHiragana(romaji);
      setSuggestions(prev => ({
        ...prev,
        [blankIndex]: kana
      }));
    } else {
      setSuggestions(prev => ({
        ...prev,
        [blankIndex]: ""
      }));
    }
  };

  // Xử lý keydown cho từng input
  const handleKeyDown = (e, blankIndex) => {
    if (e.key === " " || e.key === "Enter") {
      const inputValue = inputs[blankIndex] || "";
      const match = inputValue.match(/(.*?)([a-z']+)$/i);
      if (match) {
        const before = match[1];
        const romaji = match[2];
        const kana = toHiragana(romaji);
        if (kana) {
          e.preventDefault();
          const newValue = before + kana + (e.key === " " ? " " : "");
          handleInputChange(blankIndex, newValue);
          setSuggestions(prev => ({
            ...prev,
            [blankIndex]: ""
          }));
        }
      }
    }
  };

  // Kiểm tra tính đúng đắn của câu trả lời
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
    // Kiểm tra xem tất cả các blank đã được điền chưa
    const allFilled = Array.from({ length: blanksCount }, (_, i) => 
      (inputs[i] || "").trim() !== ""
    ).every(Boolean);

    if (allFilled) {
      setSubmitted(true);
      const { allCorrect } = checkAnswers();
      
      if (allCorrect) {
        inCreNum(); // Gọi hàm khi tất cả đáp án đúng
      }
    }
  };

  // Kiểm tra xem có thể submit không
  const canSubmit = Array.from({ length: blanksCount }, (_, i) => 
    (inputs[i] || "").trim() !== ""
  ).every(Boolean);

  const { correctAnswers, allCorrect } = submitted ? checkAnswers() : { correctAnswers: [], allCorrect: false };

  // Render câu hỏi với các input
  const renderQuestionWithInputs = () => {
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < blanksCount && (
          <span className="relative inline-block">
            <input
              type="text"
              value={inputs[index] || ""}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={submitted}
              className={`inline-block w-36 mx-2 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                submitted
                  ? correctAnswers[index]
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              } disabled:cursor-not-allowed`}
              placeholder={`Answer ${index + 1}`}
            />
            {suggestions[index] && !submitted && (
              <div className="absolute top-full left-2 mt-1 text-sm text-gray-500 bg-white px-2 py-1 rounded shadow-sm border z-10">
                👉 Gợi ý: <strong>{suggestions[index]}</strong>
              </div>
            )}
          </span>
        )}
      </span>
    ));
  };

  return (
    <div className="max-w-2xl w-full mx-auto mt-6 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Fill in the blanks ({blanksCount} {blanksCount === 1 ? 'blank' : 'blanks'}):
      </h2>

      <div className="text-base leading-relaxed mb-6 min-h-[60px]">
        {renderQuestionWithInputs()}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitted || !canSubmit}
        className={`mt-4 w-full py-2 rounded-lg font-semibold text-white transition-all ${
          submitted
            ? allCorrect
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
            : "bg-indigo-500 hover:bg-indigo-600"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {submitted 
          ? (allCorrect ? "✅ All Correct!" : "❌ Some Incorrect") 
          : "Submit"
        }
      </button>

      {submitted && (
        <div className="mt-4 space-y-2">
          {/* Feedback tổng quan */}
          <div
            className={`p-4 rounded-lg font-bold ${
              allCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="mt-1">
                {allCorrect 
                  ? "🎉 Perfect! All answers are correct!" 
                  : "Some answers need correction. Check the details below:"
                }
              </div>
            </div>
          </div>

          {/* Feedback chi tiết cho từng blank */}
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

          {/* Feedback chung từ questionData */}
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