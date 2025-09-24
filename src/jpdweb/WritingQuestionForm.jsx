import { useState } from "react";

export default function WritingQuestionForm({onSubmit}) 
{
  const [questions, setQuestions] = useState([
    {
      question: "",
      urlImage: "",
      userAnswer: "",
      feedback: "",
      mark: "",
    },
  ]);

  // Xử lý thay đổi dữ liệu
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...questions];
    updated[index][name] = value;
    setQuestions(updated);
  };

  // Thêm form mới
  const handleAddForm = () => {
    setQuestions([
      ...questions,
      { question: "", urlImage: "", userAnswer: "", feedback: "", mark: "" },
    ]);
  };

  // Xóa form
  const handleRemoveForm = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  // Submit tất cả
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Danh sách Writing Questions:", questions);

    // Gọi API POST gửi lên backend
    // fetch("/api/writing-questions", { method: "POST", body: JSON.stringify(questions) })

    alert("Đã submit danh sách Writing Questions!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Thêm nhiều Writing Questions
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg shadow-sm bg-gray-50 space-y-4 relative"
          >
            <h3 className="font-semibold text-lg text-gray-700">
              Câu hỏi {index + 1}
            </h3>

            {/* Question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Câu hỏi <span className="text-red-500">*</span>
              </label>
              <textarea
                name="question"
                value={q.question}
                onChange={(e) => handleChange(index, e)}
                rows="3"
                placeholder="Nhập câu hỏi viết..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* URL Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Ảnh minh họa
              </label>
              <input
                type="text"
                name="urlImage"
                value={q.urlImage}
                onChange={(e) => handleChange(index, e)}
                placeholder="https://example.com/image.png"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

           

            {/* Remove button */}
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveForm(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                Xóa
              </button>
            )}
          </div>
        ))}

        {/* Add form */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleAddForm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + Thêm câu hỏi
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Submit tất cả
          </button>
        </div>
      </form>
    </div>
  );
}