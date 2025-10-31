import { useState, useEffect } from "react";
import ReactCardFlip from "react-card-flip";

export default function FlashCardComponent({ 
  frontText, 
  backText, 
  currentIndex, 
  totalCards, 
  img, 
  language 
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [bgGradient, setBgGradient] = useState('');

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

  // Random gradient backgrounds
 const gradients = [
  'bg-gradient-to-br from-red-500 via-red-400 to-red-600',       // 🔴 Đỏ
  'bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500', // 🟡 Vàng
  'bg-gradient-to-br from-green-500 via-emerald-500 to-green-600', // 🟢 Xanh lá cây
  'bg-gradient-to-br from-sky-500 via-blue-500 to-sky-600',       // 🔵 Xanh nước biển
];

  // Set random gradient when card changes
  useEffect(() => {
    setIsFlipped(false);
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    setBgGradient(randomGradient);
  }, [currentIndex, frontText]);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageMap[language] || 'en-US';
    window.speechSynthesis.speak(utterance);
  };

return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
    
    {/* Progress indicator */}
    <div className="mb-6 flex items-center gap-3">
      <div className="flex gap-1.5">
        {Array.from({ length: totalCards }).map((_, idx) => (
          <div
            key={idx}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex 
                ? 'w-8 bg-blue-600' 
                : idx < currentIndex 
                ? 'w-2 bg-blue-400' 
                : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-gray-600">
        {currentIndex + 1} / {totalCards}
      </span>
    </div>

    {/* Card + Image in 2 columns */}
    <div className="flex items-center justify-center gap-10">
      {/* Left image */}
      {img && (
        <div className="w-[20rem] h-[20rem] rounded-3xl overflow-hidden shadow-2xl border-8 border-white border-opacity-60">
          <img
            src={img}
            alt="Flashcard illustration"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Right flashcard */}
      <div className="relative">
        <ReactCardFlip 
          isFlipped={isFlipped} 
          flipDirection="horizontal"
          flipSpeedBackToFront={0.6}
          flipSpeedFrontToBack={0.6}
        >
          {/* Front card */}
          <div 
            className={`w-[42rem] h-[28rem] rounded-3xl ${bgGradient} overflow-hidden shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-3xl relative group`}
            onClick={handleClick}
          >
            <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm"></div>
            <div className="relative z-10 flex items-center justify-center h-full px-12">
              <h2 className="text-6xl font-bold text-white text-center drop-shadow-lg leading-tight">
                {frontText}
              </h2>
            </div>

            {/* Speaker */}
            <button 
              className="absolute bottom-8 right-8 w-16 h-16 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg z-10 border-2 border-white border-opacity-30"
              onClick={(e) => { 
                e.stopPropagation(); 
                speak(frontText); 
              }}
              aria-label="Pronounce word"
            >
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.5a.5.5 0 00-.5-.5h-2a.5.5 0 00-.5.5v13a.5.5 0 00.5.5h2a.5.5 0 00.5-.5v-13zM13.5 7a.5.5 0 01.5.5v5a.5.5 0 01-1 0v-5a.5.5 0 01.5-.5zM16 9a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1A.5.5 0 0116 9z"/>
              </svg>
            </button>

            {/* Flip hint */}
            <div className="absolute bottom-8 left-8 flex items-center gap-2 text-white text-opacity-80 text-sm font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Click to flip</span>
            </div>
          </div>

          {/* Back card */}
          <div 
            className="w-[42rem] h-[28rem] rounded-3xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 overflow-hidden shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-3xl relative"
            onClick={handleClick}
          >
            <div className="absolute inset-0 bg-white bg-opacity-5 backdrop-blur-sm"></div>
            <div className="relative z-10 flex items-center justify-center h-full px-12">
              <h2 className="text-6xl font-bold text-white text-center drop-shadow-lg leading-tight">
                {backText}
              </h2>
            </div>
            <div className="absolute bottom-8 left-8 flex items-center gap-2 text-white text-opacity-70 text-sm font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Click to flip</span>
            </div>
          </div>
        </ReactCardFlip>

        {/* Glow effect */}
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44rem] h-[30rem] bg-blue-200 rounded-3xl opacity-20 blur-3xl"></div>
      </div>
    </div>

    {/* Instruction text */}
    <div className="mt-8 flex items-center gap-2 text-gray-600">
      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
      <p className="text-sm font-medium">
        {isFlipped ? "Showing translation - Click to see original" : "Showing original - Click to see translation"}
      </p>
    </div>

  </div>
);


}