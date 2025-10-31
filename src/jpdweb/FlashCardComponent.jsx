
import { useState } from "react";
import ReactCardFlip from "react-card-flip";
import { useSearchParams } from "react-router-dom";

export default function FlashCardComponent({ frontText, backText, currentIndex, totalCards,img,language }) {
  const [isFlipped, setIsFlipped] = useState(false);
  // chinh lai ham ni de nhan dau vao la ngon ngu
 
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
  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };
  
  const speak = (text) => {
 
  

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang =languageMap[language] || 'en-US';
  window.speechSynthesis.speak(utterance);
};
return (<div className="flex flex-col items-center my-8">
      <ReactCardFlip 
        isFlipped={isFlipped} 
        flipDirection="vertical"
        flipSpeedBackToFront={1}
        flipSpeedFrontToBack={1}
      >
  <div 
  className="w-[28rem] h-80 rounded-xl bg-white border-4 border-blue-700 overflow-hidden shadow-md cursor-pointer transition transform hover:-translate-y-1 duration-300 relative"
  onClick={handleClick}
>
         {/* Ảnh ở góc trên bên trái */}
  {img && (
    <div className="absolute top-2 left-2 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
      <img
        src={img}
        alt="Flashcard illustration"
        className="w-full h-full object-cover"
      />
    </div>
  )}
          <div className="text-center flex justify-center items-center  text-3xl font-bold  h-[100%]">
            {frontText}
          </div>
          
          <button 
            className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all duration-200 active:scale-95"
            onClick={(e) => { 
              e.stopPropagation(); 
              speak(frontText); 
            }}
            aria-label="Pronounce word"
          >
            <span className="text-xl">🔊</span>
          </button>
        </div>

    
        <div 
          className="w-[28rem] h-80 rounded-xl bg-white border-4 border-blue-700 overflow-hidden shadow-md cursor-pointer transition transform hover:-translate-y-1 duration-300 relative"
          onClick={handleClick}
        >
          <div className="text-center flex justify-center items-center  text-3xl font-bold  h-[100%]">
            {backText}
          </div>
        </div>
      </ReactCardFlip>


       <div className="px-3 py-1 bg-blue-300 rounded-full m-4 text-sm font-bold">
          {currentIndex + 1} / {totalCards}
        </div>


      <p className="  text-md">
        {isFlipped ? "Click to see word" : "Click to see translation"}
      </p>
    </div>)

}