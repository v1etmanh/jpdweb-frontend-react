import { useState, useRef, useEffect } from "react";


export default function ListeningQuiz({ question, options,inCreNum }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const audioRef = useRef(null);
  console.log(question)
   console.log(options)
useEffect(() => {
  
   
  setSelected(null);
  setSubmitted(false);
}, [question, options]);

  const handleSelect = (e) => {
    setSelected(parseInt(e.target.value));
  };

  const handleSubmit = () => {
    if (selected !== null) {
      setSubmitted(true);
       const isCorrect =  options[selected]?.correct;
     if(isCorrect)
      inCreNum()
    }
    
  };
const handleReset=()=>{
  if(submitted)
     setSelected(null);
  setSubmitted(false);
}

  const  speak=(text)=>{
    const utterance=new SpeechSynthesisUtterance(text)
    utterance.lang="ja-JP"
    window.speechSynthesis.speak(utterance)
}

  const isCorrect = submitted && options[selected]?.correct;
if(!options||!question)return <>a</>
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
      <h5 className="text-lg font-semibold mb-4">🎧 Listen and choose the correct answer:</h5>

      <button
        onClick={() => {
          const utterance = new SpeechSynthesisUtterance(question);
          utterance.lang = "ja-JP";
          utterance.rate = 0.8;
          window.speechSynthesis.speak(utterance);
        }}
        className="mb-4 px-3 py-1 rounded-full bg-[#6556FF] text-white hover:bg-indigo-600 transition"
      >
        🔊
      </button>
    {question.question!=null &&<span>${question.question}</span>}
      <form>
        <div className="space-y-3">
          {options.map((option, i) => {
            const isOptionSelected = selected === i;
            const isOptionCorrect = submitted && option.correct;
            const isOptionWrong = submitted && isOptionSelected && !option.correct;

            const baseClasses =
              "relative block rounded-lg px-4 py-2 border cursor-pointer transition-transform duration-300 hover:scale-105";
            const selectedBorder = isOptionSelected ? "border-blue-500" : "border-gray-300";
            const bgColor = isOptionCorrect
              ? "bg-green-100"
              : isOptionWrong
              ? "bg-red-100"
              : isOptionSelected
              ? "bg-blue-100"
              : "bg-white";

            return (
              <label
                key={i}
                htmlFor={`option-${i}`}
                className={`${baseClasses} ${selectedBorder} ${bgColor}`}
              >
                <input
                  type="radio"
                  id={`option-${i}`}
                  name="quiz"
                  value={i}
                  checked={isOptionSelected}
                  onChange={handleSelect}
                  disabled={submitted}
                  className="hidden"
                />
                {option.optionText}
                 
                {submitted && option.correct && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-xl">
                    ✓
                  </span>
                )}
                {isOptionWrong && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-xl">
                    ✕
                  </span>
                )}
              </label>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitted || selected === null}
          className={`mt-6 w-full py-2 text-white font-semibold rounded-lg transition-all ${
            submitted
              ? isCorrect
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
              : "bg-indigo-500 hover:bg-indigo-600"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {submitted ? (isCorrect ? `✅ Correct Answer! this is question :${question}` : `❌ Incorrect Answer this is question :${question}`) : "Submit Answer"}
        </button>

        {submitted && !isCorrect && (
          <button
            type="button"
            onClick={handleReset}
            className="mt-3 w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Try Again
          </button>
        )}
      </form>

      {submitted && (
        <div
          className={`mt-4 p-4 rounded-lg text-sm ${
            isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          <div className="flex items-start gap-2 font-bold">
          
            <div className="mt-1">
              {isCorrect ? "Great job!" : "Incorrect answer, please try again."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
