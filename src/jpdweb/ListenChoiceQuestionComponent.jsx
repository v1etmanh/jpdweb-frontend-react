import { useState, useEffect } from "react";
import qiuz from "../images/audio.jpg";

// Định nghĩa các icon hình học Kahoot! (chỉ dùng trong JSX)
const IconTriangle = ({ className = "w-10 h-10" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L2 22h20L12 2z" />
  </svg>
);
const IconDiamond = ({ className = "w-10 h-10" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l10 10-10 10-10-10 10-10z" />
  </svg>
);
const IconCircle = ({ className = "w-10 h-10" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
  </svg>
);
const IconSquare = ({ className = "w-10 h-10" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M2 2h20v20H2z" />
  </svg>
);

// Dữ liệu mock để khớp màu sắc và icon với Kahoot!
const kahootOptionsMap = [
    { color: 'bg-red-600 hover:bg-red-700', icon: IconTriangle, text: 'Something else' },
    { color: 'bg-blue-600 hover:bg-blue-700', icon: IconDiamond, text: 'Events' },
    { color: 'bg-yellow-500 hover:bg-yellow-600', icon: IconCircle, text: 'Training' },
    { color: 'bg-green-600 hover:bg-green-700', icon: IconSquare, text: 'Presentations/meetings' },
];

export default function ListeningQuiz({ question, options, inCreNum, img, language }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
   console.log(question)
  const languageMap = {
    'ENGLISH': 'en-US',
    'VIETNAMESE': 'vi-VN',
    'CHINESE': 'zh-CN',
    'JAPANESE': 'ja-JP',
    'KOREAN': 'ko-KR',
    'FRENCH': 'fr-FR',
    'GERMAN': 'de-DE',
    'SPANISH': 'es-ES',
    'ITALIAN': 'it-IT',
    'RUSSIAN': 'ru-RU',
  };

  useEffect(() => {
    setSelected(null);
    setSubmitted(false);
  }, [question, options]);

  const handleSelect = (value) => {
    if (!submitted) {
      setSelected(value);
    }
  };

  const handleSubmit = () => {
    if (selected !== null) {
      setSubmitted(true);
      const isCorrect = options[selected]?.correct;
      if (isCorrect) inCreNum();
    }
  };

  const handleReset = () => {
    setSelected(null);
    setSubmitted(false);
  };

  const handlePlayAudio = () => {
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(question);
    utterance.lang = languageMap[language] || 'en-US';
    utterance.rate = 0.8;
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const isCorrect = submitted && options[selected]?.correct;

  if (!options || !question) return null;

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
    <div className="w-full max-w-7xl bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col min-h-screen">

      {/* HEADER */}
      <div className="w-full py-4 px-8 border-b border-gray-200 flex items-center justify-between relative bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
        
        {/* Câu hỏi bên trái */}
        <h2 className="text-2xl font-bold text-gray-800">
          Hãy chọn keyword mà bạn nghe được
        </h2>

        {/* Audio Player - compact version */}
        <button
          onClick={handlePlayAudio}
          disabled={isPlaying}
          className={`relative px-6 py-3 rounded-xl font-semibold text-base flex items-center gap-3 transition-all duration-300 transform shadow-lg
            ${isPlaying
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 hover:scale-105 active:scale-95'
            }`}
        >
          {isPlaying ? (
            <>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map(bar => (
                  <div
                    key={bar}
                    className="w-1 bg-white rounded-full animate-pulse"
                    style={{ height: `${Math.random() * 12 + 8}px`, animationDelay: `${bar * 100}ms` }}
                  />
                ))}
              </div>
              <span className="text-white">Playing...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span className="text-white">Play Audio</span>
            </>
          )}
        </button>

        {/* Icon menu bên phải */}
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-gray-500 cursor-pointer hover:text-indigo-500 transition" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
          </svg>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 flex items-stretch gap-6">
        {/* Điểm số */}
        <div className="flex-shrink-0 flex items-center justify-center w-24">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl font-extrabold text-white drop-shadow-md">17</span>
          </div>
        </div>

        {/* Ảnh quiz */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
      <div className="w-full max-w-3xl h-[300px] bg-gray-100 rounded-xl overflow-hidden shadow-md border border-gray-200">

            <img src={img || "https://via.placeholder.com/800x450?text=Kahoot+Image"} alt="Quiz illustration" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Answers count */}
        <div className="flex-shrink-0 flex items-center justify-center w-24">
          <div className="text-center">
            <span className="text-5xl font-extrabold text-gray-800">0</span>
            <p className="text-gray-500 font-semibold text-lg uppercase leading-none">Answers</p>
          </div>
        </div>
      </div>

      {/* OPTIONS */}
      <div className="grid grid-cols-2 gap-6 px-16 py-10 w-full max-w-[1400px] mx-auto">
        {options.map((option, i) => {
          const isOptionSelected = selected === i;
          const kahootStyle = kahootOptionsMap[i] || kahootOptionsMap[0];
          const IconComponent = kahootStyle.icon;
          const isAnswered = submitted && (isCorrect ? option.correct : isOptionSelected);
          return (
            <button
              key={i}
              onClick={() => !submitted && handleSelect(i)}
              className={`
                ${isAnswered ? 'bg-gray-400/70' : kahootStyle.color}
                ${isOptionSelected && !submitted ? 'ring-8 ring-white ring-opacity-60 scale-[0.98]' : ''}
                text-white font-bold text-2xl py-8 rounded-2xl flex items-center justify-start gap-5 
                shadow-inner uppercase transition-all duration-300 cursor-pointer
                hover:scale-[1.02] active:scale-[0.98] hover:brightness-110
              `}
            >
              <div className="flex items-center justify-center w-10 h-10">
                <IconComponent className="w-8 h-8 drop-shadow-sm" />
              </div>
              <span className="text-left tracking-wide">{option.optionText}</span>
            </button>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="w-full px-6 py-3 bg-gray-50 border-t border-gray-200 flex flex-col items-center">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitted || selected === null}
          className={`w-full max-w-xs py-3 mb-2 text-sm rounded-lg font-bold text-white transition-all duration-300 transform shadow-md ${
            submitted
              ? isCorrect
                ? "bg-green-500"
                : "bg-red-500"
              : "bg-indigo-500 hover:bg-indigo-600"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {submitted 
            ? (isCorrect ? "🎉 Correct!" : "❌ Incorrect") 
            : "Submit Answer"}
        </button>

        {submitted && !isCorrect && (
          <button
            type="button"
            onClick={handleReset}
            className="w-full max-w-xs py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all font-semibold text-gray-700 text-sm"
          >
            🔄 Try Again
          </button>
        )}

        <div className="w-full flex justify-between items-center text-xs text-gray-500 font-semibold mt-3">
          <span>4 / 13</span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0..." />
            </svg>
            <span>kahoot.it</span>
            <span className="ml-1 text-gray-800 font-bold">PIN: 2902063</span>
          </span>
        </div>
      </div>
    </div>
  </div>
);
}