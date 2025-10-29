import { useEffect, useState } from "react";
import Split from "react-split";
import ReadingMultipleChoiceComponent from "./ReadingMultipleChoiceComponent";

export default function PassageWithQuestions({ text, questionAndOption, increNum }) {

  const [numTrueAns, setNumTrueAns] = useState(0);
  const [isChange, setISChange] = useState(false);

  const incre = () => {
    setNumTrueAns(prev => prev + 1);
  };

  useEffect(() => {
    if (numTrueAns > (questionAndOption.length / 2) && !isChange) {
      increNum();
      setISChange(true);
    }
  }, [numTrueAns]);

  return (
    <div className="w-full px-4 py-6 mt-20 container h-[80vh]">
      <Split
        className="flex h-full"
        sizes={[35, 65]} // Tỉ lệ mặc định
        minSize={200}
        gutterSize={8} // Độ rộng thanh kéo
        direction="horizontal"
      >
        {/* Left side - Questions */}
        <div className="overflow-y-auto p-2">
          {questionAndOption.map((q, idx) => (
            <ReadingMultipleChoiceComponent
              key={idx}
              mulptipleQuizz={q}
              incre={incre}
            />
          ))}
        </div>

        {/* Right side - Passage */}
        <div className="overflow-y-auto border-l border-gray-300 pl-4">
          <div className="bg-white shadow-md rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Passage</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{text}</p>
          </div>
        </div>
      </Split>
    </div>
  );
}
