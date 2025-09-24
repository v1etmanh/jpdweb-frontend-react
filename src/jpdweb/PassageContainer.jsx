import { useEffect, useState, useCallback } from "react";
import PassageWithQuestions from "./PassageQuestionComponent";

export default function PassageContainer({ passageContent, isSave, postP }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numTrueAns, setNumTrueAns] = useState(0);
  const [hasSave, setHasSave] = useState(isSave);
  const [showOptions, setShowOptions] = useState(false); // Hiển thị dropdown

  useEffect(() => {
    setHasSave(isSave);
    if(passageContent==null)console.log('a')
  }, [isSave]);

  const increNum = useCallback(() => {
    setNumTrueAns(prev => prev + 1);
    if (!hasSave) {
      postP();
      setHasSave(true);
    }
  }, [hasSave, postP]);

  const changeIndex = useCallback(() => {
    setCurrentIndex(prevIndex =>
      prevIndex !== passageContent.length - 1 ? prevIndex + 1 : 0
    );
  }, [passageContent?.length]);

  const handleSelectPassage = (index) => {
    setCurrentIndex(index);
    setShowOptions(false);
  };

  if (!Array.isArray(passageContent) || passageContent.length === 0) {
    return <div>No passage content available.</div>;
  }

  return (
    <div className="relative p-4">
      {/* Nút chọn đoạn văn */}
      <div className="absolute left-0 top-0 z-10">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-br-xl hover:bg-green-700"
          onClick={() => setShowOptions(!showOptions)}
        >
          📖 Chọn đoạn
        </button>
        {showOptions && (
          <div className="bg-white border rounded-lg shadow-md mt-1 w-40">
            {passageContent.map((_, index) => (
              <div
                key={index}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                  currentIndex === index ? "bg-blue-100 font-semibold" : ""
                }`}
                onClick={() => handleSelectPassage(index)}
              >
                Đoạn {index + 1}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nội dung câu hỏi */}
      <div className="mt-12">
        <PassageWithQuestions
          text={passageContent[currentIndex].text}
          questionAndOption={passageContent[currentIndex].questions}
          increNum={increNum}
        />

        <button
          className="bg-[#1A21BC] text-white font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300 hover:scale-105 mt-6"
          onClick={changeIndex}
        >
          Next question →
        </button>
      </div>
    </div>
  );
}
