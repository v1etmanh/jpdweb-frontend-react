import React, { useState } from 'react';
import { Plus, Trash2, Image, Check } from 'lucide-react';

const ListeningChoiceForm = ({ onSubmit }) => {
  const [questions, setQuestions] = useState([
    {
      question: '',
      imageUrl: '',
      listionChoiceOptions: [
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false }
      ]
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Thêm câu hỏi
  const addQuestion = () => {
    setQuestions([...questions, {
      question: '',
      imageUrl: '',
      listionChoiceOptions: [
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false }
      ]
    }]);
  };

  // Xóa câu hỏi
  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  // Cập nhật câu hỏi
  const updateQuestion = (questionIndex, field, value) => {
    const newQuestions = questions.map((q, i) =>
      i === questionIndex ? { ...q, [field]: value } : q
    );
    setQuestions(newQuestions);
  };

  // Cập nhật option
  const updateOption = (questionIndex, optionIndex, field, value) => {
    const newQuestions = questions.map((q, i) => {
      if (i === questionIndex) {
        const newOptions = q.listionChoiceOptions.map((opt, j) =>
          j === optionIndex ? { ...opt, [field]: value } : opt
        );
        return { ...q, listionChoiceOptions: newOptions };
      }
      return q;
    });
    setQuestions(newQuestions);
  };

  // Chọn đáp án đúng
  const setCorrectAnswer = (questionIndex, optionIndex) => {
    const newQuestions = questions.map((q, i) => {
      if (i === questionIndex) {
        const newOptions = q.listionChoiceOptions.map((opt, j) => ({
          ...opt,
          isCorrect: j === optionIndex
        }));
        return { ...q, listionChoiceOptions: newOptions };
      }
      return q;
    });
    setQuestions(newQuestions);
  };

  // Validate
  const validateForm = () => {
    return questions.filter(q => {
      const hasQuestion = q.question.trim() !== '';
      const hasValidOptions = q.listionChoiceOptions.some(opt => opt.optionText.trim() !== '');
      const hasCorrectAnswer = q.listionChoiceOptions.some(opt => opt.isCorrect);
      return hasQuestion && hasValidOptions && hasCorrectAnswer;
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validQuestions = validateForm();

    if (validQuestions.length === 0) {
      alert('Vui lòng hoàn thiện ít nhất một câu hỏi đầy đủ!');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(validQuestions);
      setQuestions([{
        question: '',
        imageUrl: '',
        listionChoiceOptions: [
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false }
        ]
      }]);
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Có lỗi xảy ra khi gửi!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Image className="w-7 h-7 text-purple-600" />
        Tạo Câu Hỏi Với Hình Ảnh
      </h2>

      <div className="space-y-8">
        {questions.map((q, questionIndex) => (
          <div key={questionIndex} className="p-6 border-2 border-purple-200 rounded-lg bg-purple-50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-purple-800">
                Câu hỏi #{questionIndex + 1}
              </h3>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(questionIndex)}
                  className="p-2 text-red-500 hover:text-red-700 rounded-full"
                  title="Xóa câu hỏi"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Nội dung câu hỏi */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung câu hỏi <span className="text-red-500">*</span>
              </label>
              <textarea
                value={q.question}
                onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                rows="3"
                placeholder="Nhập nội dung câu hỏi..."
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Ảnh minh họa */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Hình ảnh (tùy chọn)
              </label>
              <input
                type="url"
                value={q.imageUrl}
                onChange={(e) => updateQuestion(questionIndex, 'imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
              />
              {q.imageUrl && (
                <div className="mt-3">
                  <img
                    src={q.imageUrl}
                    alt="Preview"
                    className="max-h-40 rounded border"
                  />
                </div>
              )}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.listionChoiceOptions.map((opt, optionIndex) => (
                <div
                  key={optionIndex}
                  className={`p-4 border-2 rounded-lg ${
                    opt.isCorrect ? 'border-green-400 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">
                      Lựa chọn {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCorrectAnswer(questionIndex, optionIndex)}
                      className={`px-3 py-1 rounded-full text-xs ${
                        opt.isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-green-200'
                      }`}
                    >
                      <Check className="w-3 h-3 inline mr-1" />
                      {opt.isCorrect ? 'Đáp án đúng' : 'Chọn'}
                    </button>
                  </div>

                  <textarea
                    value={opt.optionText}
                    onChange={(e) => updateOption(questionIndex, optionIndex, 'optionText', e.target.value)}
                    rows="2"
                    placeholder="Nhập nội dung lựa chọn..."
                    className="w-full px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center pt-6">
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50"
          >
            <Plus className="w-5 h-5" /> Thêm Câu Hỏi
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi Câu Hỏi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListeningChoiceForm;
