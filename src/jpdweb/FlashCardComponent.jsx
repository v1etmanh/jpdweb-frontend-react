
import { useState } from "react";
import ReactCardFlip from "react-card-flip";

export default function FlashCardComponent({ frontText, backText, currentIndex, totalCards }) {
  const [isFlipped, setIsFlipped] = useState(false);
  // chinh lai ham ni de nhan dau vao la ngon ngu
  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };
  
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
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
          className="w-80 h-52 rounded-xl bg-white border-4 border-blue-700 overflow-hidden shadow-md cursor-pointer transition transform hover:-translate-y-1 duration-300 relative"
          onClick={handleClick}
        >
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
          className="w-80 h-52 rounded-xl bg-white border-4 border-blue-700 overflow-hidden shadow-md cursor-pointer transition transform hover:-translate-y-1 duration-300 relative"
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