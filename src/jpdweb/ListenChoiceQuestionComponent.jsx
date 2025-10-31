import { useState, useEffect, useRef } from "react";
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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const utteranceRef = useRef(null);
  
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

  const handlePlayPause = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(question);
      utterance.lang = languageMap[language] || 'en-US';
      utterance.rate = 0.8;
      
      // Estimate duration (rough calculation)
      const wordCount = question.split(' ').length;
      const estimatedDuration = (wordCount / 2.5) * 1000; // ~2.5 words per second
      setDuration(estimatedDuration / 1000);
      
      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      
      // Simulate progress
      const startTime = Date.now();
      const interval = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(interval);
          setCurrentTime(0);
          return;
        }
        const elapsed = (Date.now() - startTime) / 1000;
        setCurrentTime(Math.min(elapsed, estimatedDuration / 1000));
      }, 100);
    }
  };

  const handleSkipBackward = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSkipForward = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(Math.floor((seconds % 1) * 100)).padStart(2, '0')}`;
  };

  const isCorrect = submitted && options[selected]?.correct;

  if (!options || !question) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col min-h-screen">

        {/* HEADER - Full Width Audio Player */}
        <div className="w-full py-8 px-12 border-b border-gray-200 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
          {/* Audio Player - Full Width */}
          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl px-16 py-8 border border-gray-100">
            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-8 mb-6">
              {/* Skip Backward 10s */}
              <button
                onClick={handleSkipBackward}
                className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors relative"
              >
                <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.5 15l-3-3m0 0l3-3m-3 3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="absolute text-[9px] font-bold">10</span>
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={handlePlayPause}
                className="w-20 h-20 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                {isPlaying ? (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              {/* Skip Forward 10s */}
              <button
                onClick={handleSkipForward}
                className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors relative"
              >
                <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.5 15l3-3m0 0l-3-3m3 3h-7.5M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                </svg>
                <span className="absolute text-[9px] font-bold">10</span>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700 min-w-[70px]">
                {formatTime(currentTime)}
              </span>
              
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-300 relative"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                >
                  <div className="w-4 h-4 bg-blue-600 rounded-full absolute right-0 top-1/2 -translate-y-1/2 shadow-lg"></div>
                </div>
              </div>
              
              <span className="text-sm font-semibold text-gray-700 min-w-[70px] text-right">
                {formatTime(duration)}
              </span>

              {/* Volume & Settings */}
              <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors ml-4">
                <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
              </button>

              <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                </svg>
              </button>
            </div>
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
                  hover:scale-[1.02] active:scale-[0.98] hover:brightness-110 px-6
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