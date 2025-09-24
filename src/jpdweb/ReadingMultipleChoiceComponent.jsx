    import { useEffect, useState } from "react";
   
    //question,options,index}
    export default  function ReadingMultipleChoiceComponent({mulptipleQuizz,incre}){
    const [selected,setSelected]=useState(null)
    const[submitted,setSubmitted]=useState(false)
   
    useEffect(()=>{
        function reData(){
            setSelected(null)
            setSubmitted(false)
        };
        reData()
    },[mulptipleQuizz])
    const handSelect=(e)=>{
        setSelected(parseInt(e.target.value))

    }
    const handleSubmit=()=>{
        if(selected!==null){
            setSubmitted(true)
           let isCorrect= mulptipleQuizz.readingQuestionOptions[selected]?.correct;
            if(isCorrect)incre()
        }
    }
   
    const isCorrect= submitted&&mulptipleQuizz.readingQuestionOptions[selected]?.correct;
    return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl border p-4 mb-6">
  <div className="max-h-40 overflow-y-auto mb-4 pr-2">
    <h2 className="text-base font-semibold text-gray-800">
      {mulptipleQuizz.question}
    </h2>
  </div>

  <form className="space-y-2 text-sm">
    {mulptipleQuizz.readingQuestionOptions.map((option, i) => (
      <label
        key={i}
        htmlFor={`option-${mulptipleQuizz.mcqId}-${option.optionId}`}
        className={`flex items-start p-2 rounded-md cursor-pointer border transition text-sm ${
          submitted
            ? option.correct
              ? "border-green-500 bg-green-50"
              : selected === i
              ? "border-red-500 bg-red-50"
              : "border-gray-200"
            : "hover:border-blue-400 border-gray-200"
        }`}
      >
        <input
          type="radio"
          name={`quiz-${mulptipleQuizz.mcqId}`}
          id={`option-${mulptipleQuizz.mcqId}-${option.optionId}`}
          value={i}
          checked={selected === i}
          onChange={handSelect}
          disabled={submitted}
          className="mt-1 mr-2 accent-blue-600"
        />
        <span className="text-gray-700">{option.optionText}</span>
      </label>
    ))}

    <button
      type="button"
      onClick={handleSubmit}
      disabled={submitted || selected === null}
      className={`w-full py-1.5 rounded-md font-medium text-sm text-white transition ${
        submitted || selected === null
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {submitted ? "Đáp án đã được chọn" : "Xác nhận"}
    </button>
  </form>

  {submitted && (
    <div
      className={`mt-3 p-2 rounded-md text-xs font-medium ${
        isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {isCorrect ? "Correct!" : mulptipleQuizz.feedBack || "Wrong answer!"}
    </div>
  )}
</div>

  );
    }