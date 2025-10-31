import { useEffect, useState } from "react";

export default function QuestionCard({ mulptipleQuizz, isFeedBack, increNum }) {
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
    if (selected !== null) {
      setSubmitted(true);
      const isCorrect = mulptipleQuizz.options[selected]?.correct;
      if (isCorrect) increNum();
    }
  };

  const isCorrect = submitted && mulptipleQuizz.options[selected]?.correct;

  // Kahoot color schemes for options
  const optionColors = [
    { bg: "bg-red-500", hover: "hover:bg-red-600", border: "border-red-600", selected: "bg-red-600" },
    { bg: "bg-blue-500", hover: "hover:bg-blue-600", border: "border-blue-600", selected: "bg-blue-600" },
    { bg: "bg-yellow-500", hover: "hover:bg-yellow-600", border: "border-yellow-600", selected: "bg-yellow-600" },
    { bg: "bg-green-600", hover: "hover:bg-green-700", border: "border-green-700", selected: "bg-green-700" }
  ];

  // Kahoot shapes for options
  const shapes = [
    <svg viewBox="0 0 100 100" className="w-12 h-12" fill="currentColor">
      <polygon points="50,10 90,90 10,90" />
    </svg>,
    <svg viewBox="0 0 100 100" className="w-12 h-12" fill="currentColor">
      <polygon points="50,15 85,50 50,85 15,50" />
    </svg>,
    <svg viewBox="0 0 100 100" className="w-12 h-12" fill="currentColor">
      <circle cx="50" cy="50" r="40" />
    </svg>,
    <svg viewBox="0 0 100 100" className="w-12 h-12" fill="currentColor">
      <rect x="15" y="15" width="70" height="70" />
    </svg>
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white flex flex-col">

      {/* Header with question */}
      <div className="flex justify-center p-4 mb-4">
        <h2 className="text-4xl md:text-5xl font-bold text-black text-center max-w-4xl drop-shadow-lg">
          {mulptipleQuizz.questionText}
        </h2>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-2 gap-4 p-4 pb-8">
        {mulptipleQuizz.options.map((option, i) => {
          const isOptionSelected = selected === i;
          const isOptionCorrect = submitted && option.correct;
          const isOptionWrong = submitted && isOptionSelected && !option.correct;
          const colorScheme = optionColors[i % 4];

          return (
            <label
              key={i}
              htmlFor={`option-${mulptipleQuizz.mcId}-${option.mcoId}`}
              className={`
                relative rounded-xl p-6 cursor-pointer transition-all duration-300 
                ${isOptionSelected && !submitted ? colorScheme.selected : colorScheme.bg}
                ${!submitted && !isOptionSelected && colorScheme.hover}
                ${isOptionSelected && !submitted ? 'ring-8 ring-white ring-offset-4 ring-offset-purple-300 scale-105 shadow-2xl' : 'hover:scale-105'}
                ${submitted ? 'cursor-default' : ''}
                ${isOptionCorrect ? 'ring-8 ring-green-400 ring-offset-4 ring-offset-green-200 scale-105' : ''}
                ${isOptionWrong ? 'ring-8 ring-red-400 ring-offset-4 ring-offset-red-200 opacity-60' : ''}
                ${!isOptionSelected && !submitted ? 'shadow-lg hover:shadow-xl' : ''}
                flex items-center gap-4
                min-h-[120px]
                ${isOptionSelected && !submitted ? 'animate-pulse-soft' : ''}
              `}
              style={{
                transform: isOptionSelected && !submitted ? 'translateY(-4px)' : 'translateY(0)',
              }}
            >
              <input
                type="radio"
                name={`quiz-${mulptipleQuizz.mcId}`}
                id={`option-${mulptipleQuizz.mcId}-${option.mcoId}`}
                value={i}
                checked={isOptionSelected}
                onChange={handleSelect}
                disabled={submitted}
                className="hidden"
              />
              
              {/* Shape icon with glow effect when selected */}
              <div className={`text-white flex-shrink-0 transition-all duration-300 ${
                isOptionSelected && !submitted ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] scale-110' : ''
              }`}>
                {shapes[i % 4]}
              </div>

              {/* Option text */}
              <span className={`text-white font-bold text-xl flex-1 transition-all duration-300 ${
                isOptionSelected && !submitted ? 'scale-105' : ''
              }`}>
                {option.optionText}
              </span>

              {/* Selection indicator */}
              {isOptionSelected && !submitted && (
                <div className="absolute -top-2 -right-2 bg-white text-purple-700 rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl shadow-lg animate-bounce-soft">
                  ✓
                </div>
              )}

              {/* Feedback icons */}
              {submitted && option.correct && (
                <span className="text-white text-4xl flex-shrink-0 animate-bounce-soft">✓</span>
              )}
              {isOptionWrong && (
                <span className="text-white text-4xl flex-shrink-0">✕</span>
              )}
            </label>
          );
        })}
      </div>

      {/* Submit button */}
      {!submitted && (
        <div className="p-4 pb-8">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selected === null}
            className={`w-full max-w-md mx-auto block py-4 px-8 font-bold text-xl rounded-xl shadow-lg transition-all
              ${selected !== null 
                ? 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-xl hover:scale-105 animate-pulse-soft' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {selected !== null ? '✓ Submit Answer' : 'Select an answer'}
          </button>
        </div>
      )}

      {/* Feedback section */}
      {isFeedBack && submitted && (
        <div className="p-4 pb-8">
          <div
            className={`max-w-md mx-auto p-6 rounded-xl shadow-lg ${
              isCorrect
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">
                {isCorrect ? "🎉" : "😔"}
              </div>
              <div className="font-bold text-2xl">
                {isCorrect
                  ? "Great job!"
                  : mulptipleQuizz.feedBack || "Incorrect answer"}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse-soft {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.95;
          }
        }
        
        @keyframes bounce-soft {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }
        
        .animate-bounce-soft {
          animation: bounce-soft 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}