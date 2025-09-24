import { useEffect, useState } from "react";

export default function WritingComponent({data,onComplete}) {
  // const writingMock = {
  //   img: "https://via.placeholder.com/1000x600.png?text=Describe+the+picture",
  //   question:
  //     "Describe the picture in your own words. Focus on the main elements and details you find interesting. Consider the colors, objects, atmosphere, and any actions taking place. Write at least 150 words.",
  // };
  const[writingMock,setWritingMock]=useState()
  const [answer, setAnswer] = useState(null);

  const handleSubmit = () => {
    if (answer.trim() === "") {
      alert("Please type your answer before submitting.");
    } else {
      alert("Your answer has been submitted: " + answer);
    }
  };
  useEffect(()=>{
setWritingMock(data)
console.log(writingMock)
  },[])
  if(writingMock==null)return <>a</>
  else 
  return (
    <div className="min-h-screen w-full bg-[#243864] text-white flex flex-col md:flex-row">
      {/* LEFT COLUMN */}
      <div className="md:w-1/2 w-full flex flex-col p-6 md:p-10 overflow-y-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1e88e5] mb-6">
          Writing Task
        </h1>

        {writingMock.img && (
          <img
            src={writingMock.img}
            alt="writing-question"
            className="w-full h-auto rounded-xl mb-6 border-4 border-[#1e88e5]"
          />
        )}

        <p className="bg-white text-[#243864] p-5 rounded-lg text-lg leading-relaxed">
          {writingMock.question}
        </p>
      </div>

      {/* RIGHT COLUMN */}
      <div className="md:w-1/2 w-full flex flex-col p-6 md:p-10 bg-white text-[#243864]">
        <h2 className="text-2xl font-semibold mb-4">Your Answer</h2>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full flex-grow min-h-[300px] p-5 border-2 border-[#243864] rounded-lg text-lg focus:outline-none focus:border-[#1e88e5] focus:ring-4 focus:ring-[#1e88e5]/30 transition-all resize-none"
        />

        <div className="pt-6 text-right">
          <button
            onClick={handleSubmit}
            className="bg-[#1e88e5] hover:bg-[#e53935] text-white font-semibold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 text-lg"
          >
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
}
