import { useEffect, useState } from "react";
import Split from "react-split";
import ReadingMultipleChoiceComponent from "./ReadingMultipleChoiceComponent";

export default function PassageWithQuestions({ text, questionAndOption, increNum }) {
  const [numTrueAns, setNumTrueAns] = useState(0);
  const [isChange, setISChange] = useState(false);
  const [answers, setAnswers] = useState({}); // Lưu câu trả lời của user
  const [submitted, setSubmitted] = useState(false); // Đã submit chưa

  const handleAnswerChange = (questionId, selectedIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedIndex
    }));
  };

  const handleSubmitAll = () => {
    setSubmitted(true);
    // Tính số câu đúng
    let correctCount = 0;
    questionAndOption.forEach((q, idx) => {
      const userAnswer = answers[q.rqId];
      if (userAnswer !== undefined && q.readingQuestionOptions[userAnswer]?.correct) {
        correctCount++;
      }
    });
    setNumTrueAns(correctCount);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setNumTrueAns(0);
  };

  useEffect(() => {
    if (numTrueAns > (questionAndOption.length / 2) && !isChange && submitted) {
      increNum();
      setISChange(true);
    }
  }, [numTrueAns, submitted]);

  // Check if all questions are answered
  const allAnswered = questionAndOption.every(q => answers[q.rqId] !== undefined);
  const totalQuestions = questionAndOption.length;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="w-full h-screen bg-gray-50">
      <Split
        className="flex h-full"
        sizes={[50, 50]}
        minSize={300}
        gutterSize={10}
        direction="horizontal"
      >
        {/* Left side - Passage */}
        <div className="overflow-y-auto bg-white p-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">EXERCISE 4</h2>
            <h3 className="text-xl font-semibold mb-4">WHY DON'T BABIES TALK LIKE ADULTS?</h3>
            <p className="text-sm italic text-gray-600 mb-6">
              Kids go from 'goo-goo' to talkative one step at a time
            </p>
            <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
              {text}
            </div>
          </div>
        </div>

        {/* Right side - Questions */}
        <div className="overflow-y-auto bg-gray-50 p-6">
          {/* Header with instructions */}
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm font-semibold text-blue-900">
              📘 Questions 14 - 18
            </p>
            <p className="text-sm text-gray-700 mt-2">
              Exercise 4: You should spend about 20 minutes on Questions 14-18, which are based on Reading Passage 1 below. Choose the correct letter A, B, C or D.
            </p>
          </div>

          {/* Progress indicator */}
          <div className="mb-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Progress: {answeredCount} / {totalQuestions} questions answered
              </span>
              {submitted && (
                <span className="text-sm font-bold text-indigo-600">
                  Score: {numTrueAns} / {totalQuestions}
                </span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Questions */}
          {questionAndOption.map((q, idx) => (
            <ReadingMultipleChoiceComponent
              key={idx}
              mulptipleQuizz={q}
              incre={() => {}} // Không tăng ngay, sẽ tính sau khi submit
              questionNumber={14 + idx}
              selectedAnswer={answers[q.rqId]}
              onAnswerChange={handleAnswerChange}
              submitted={submitted}
            />
          ))}

          {/* Submit/Reset buttons */}
          <div className="sticky bottom-0 bg-gray-50 pt-4 pb-2">
            {!submitted ? (
              <button
                onClick={handleSubmitAll}
                disabled={!allAnswered}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                  allAnswered
                    ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {allAnswered ? "Submit All Answers" : `Answer all questions (${answeredCount}/${totalQuestions})`}
              </button>
            ) : (
              <div className="space-y-3">
                {/* Result Summary */}
                <div className={`p-4 rounded-lg border-2 ${
                  numTrueAns >= totalQuestions * 0.6
                    ? "bg-green-50 border-green-500"
                    : "bg-red-50 border-red-500"
                }`}>
                  <p className={`text-center font-bold text-lg ${
                    numTrueAns >= totalQuestions * 0.6 ? "text-green-700" : "text-red-700"
                  }`}>
                    {numTrueAns >= totalQuestions * 0.6 ? "🎉 Great Job!" : "📚 Keep Practicing!"}
                  </p>
                  <p className="text-center text-sm mt-1">
                    You got <span className="font-bold">{numTrueAns}</span> out of{" "}
                    <span className="font-bold">{totalQuestions}</span> correct
                    ({Math.round((numTrueAns / totalQuestions) * 100)}%)
                  </p>
                </div>

                {/* Reset button */}
                <button
                  onClick={handleReset}
                  className="w-full py-3 rounded-lg font-semibold text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50 transition-all"
                >
                  🔄 Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </Split>
    </div>
  );
}