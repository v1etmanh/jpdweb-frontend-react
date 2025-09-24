import React, { useState } from "react";

const SpeakingPassageForm = ({ onSubmit }) => {
  const [passages, setPassages] = useState([{ passageText: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Thêm đoạn văn mới
  const addPassage = () => {
    setPassages([...passages, { passageText: "" }]);
  };

  // Cập nhật nội dung đoạn văn
  const updatePassageText = (index, value) => {
    const newPassages = [...passages];
    newPassages[index].passageText = value;
    setPassages(newPassages);
  };

  // Xóa đoạn văn
  const removePassage = (index) => {
    if (passages.length > 1) {
      setPassages(passages.filter((_, i) => i !== index));
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // chỉ lấy text đoạn văn gửi đi
      await onSubmit(passages.map((p) => p.passageText.trim()));

      // reset form
      setPassages([{ passageText: "" }]);
    } catch (error) {
      console.error("Error submitting passages:", error);
      alert("Có lỗi xảy ra khi gửi!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Thêm đoạn văn</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {passages.map((p, i) => (
          <div key={i} className="border p-4 rounded-lg bg-gray-50">
            <label
              htmlFor={`passage-${i}`}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Đoạn văn #{i + 1}
            </label>
            <textarea
              id={`passage-${i}`}
              value={p.passageText}
              onChange={(e) => updatePassageText(i, e.target.value)}
              placeholder="Nhập đoạn văn..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
            />
            {passages.length > 1 && (
              <button
                type="button"
                onClick={() => removePassage(i)}
                className="mt-2 text-sm text-red-600 hover:underline"
              >
                Xóa đoạn văn
              </button>
            )}
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={addPassage}
            className="px-4 py-2 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50"
          >
            + Thêm đoạn văn
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            {isSubmitting ? "Đang gửi..." : "Gửi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SpeakingPassageForm;
