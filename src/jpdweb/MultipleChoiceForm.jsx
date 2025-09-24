import React, { useState } from 'react';
import { CheckCircleIcon, PlusCircleIcon, Trash2Icon } from 'lucide-react';
import { Markdown } from 'react-bootstrap-icons';

const MultipleChoiceForm = ({ onSubmit }) => {
  const [questions, setQuestions] = useState([
    {
      question: '',
      feedBack: '',
      options: [
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false }
      ]
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Thêm câu hỏi mới
  const addQuestion = () => {
    const newQuestion = {
      question: '',
      feedBack: '',
      options: [
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false }
      ]
    };
    setQuestions([...questions, newQuestion]);
  };

  // Xóa câu hỏi
  const removeQuestion = (questionIndex) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== questionIndex);
      setQuestions(newQuestions);
    }
  };

  // Cập nhật câu hỏi
  const updateQuestion = (questionIndex, field, value) => {
    const newQuestions = questions.map((q, i) => 
      i === questionIndex ? { ...q, [field]: value } : q
    );
    setQuestions(newQuestions);
  };

  // Thêm option cho câu hỏi
  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options.length < 6) { // Tối đa 6 option
      newQuestions[questionIndex].options.push({ optionText: '', isCorrect: false });
      setQuestions(newQuestions);
    }
  };

  // Xóa option
  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options.length > 2) { // Tối thiểu 2 option
      newQuestions[questionIndex].options.splice(optionIndex, 1);
      setQuestions(newQuestions);
    }
  };

  // Cập nhật option
  const updateOption = (questionIndex, optionIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex][field] = value;
    
    // Nếu đánh dấu đáp án đúng, bỏ đánh dấu các option khác
    if (field === 'isCorrect' && value === true) {
      newQuestions[questionIndex].options.forEach((option, i) => {
        if (i !== optionIndex) {
          option.isCorrect = false;
        }
      });
    }
    
    setQuestions(newQuestions);
  };

  // Validate form
  const validateForm = () => {
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      // Kiểm tra câu hỏi không rỗng
      if (!question.question.trim()) {
        alert(`Câu hỏi ${i + 1}: Vui lòng nhập nội dung câu hỏi!`);
        return false;
      }

      // Kiểm tra có ít nhất 2 option có nội dung
      const validOptions = question.options.filter(opt => opt.optionText.trim() !== '');
      if (validOptions.length < 2) {
        alert(`Câu hỏi ${i + 1}: Cần có ít nhất 2 lựa chọn!`);
        return false;
      }

      // Kiểm tra có đáp án đúng
      const correctOptions = question.options.filter(opt => opt.isCorrect);
      if (correctOptions.length !== 1) {
        alert(`Câu hỏi ${i + 1}: Cần có đúng 1 đáp án đúng!`);
        return false;
      }
    }
    return true;
  };

  // Xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Lọc và format dữ liệu
    const validQuestions = questions.map(q => ({
      question: q.question.trim(),
      feedBack: q.feedBack.trim(),
      mutipleChoiceOption: q.options
        .filter(opt => opt.optionText.trim() !== '')
        .map(opt => ({
          optionText: opt.optionText.trim(),
          isCorrect: opt.isCorrect
        }))
    }));

    setIsSubmitting(true);
    
    try {
      await onSubmit(validQuestions);
      // Reset form
      setQuestions([{
        question: '',
        feedBack: '',
        options: [
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false }
        ]
      }]);
    } catch (error) {
      console.error('Error submitting questions:', error);
      alert('Có lỗi xảy ra khi gửi câu hỏi!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOptionLabel = (index) => {
    return String.fromCharCode(65 + index); // A, B, C, D, E, F
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Thêm Câu Hỏi Trắc Nghiệm
        </h2>
        <p className="text-gray-600">
          Tạo các câu hỏi trắc nghiệm mới cho module học tập
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((question, questionIndex) => (
          <div 
            key={questionIndex}
            className="p-6 border-2 border-gray-200 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50"
          >
            {/* Header câu hỏi */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Câu hỏi #{questionIndex + 1}
              </h3>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(questionIndex)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                  title="Xóa câu hỏi"
                >
                  <Trash2Icon className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Nội dung câu hỏi */}
            <div className="mb-6">
              <label 
                htmlFor={`question-${questionIndex}`}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nội dung câu hỏi <span className="text-red-500">*</span>
              </label>
              <textarea
                id={`question-${questionIndex}`}
                value={question.question}
                onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                placeholder="Nhập nội dung câu hỏi..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Các lựa chọn */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Các lựa chọn <span className="text-red-500">*</span>
                </label>
                {question.options.length < 6 && (
                  <button
                    type="button"
                    onClick={() => addOption(questionIndex)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + Thêm lựa chọn
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <div 
                    key={optionIndex}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                      option.isCorrect 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    {/* Label A, B, C, D */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      option.isCorrect 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {getOptionLabel(optionIndex)}
                    </div>

                    {/* Input nội dung */}
                    <input
                      type="text"
                      value={option.optionText}
                      onChange={(e) => updateOption(questionIndex, optionIndex, 'optionText', e.target.value)}
                      placeholder={`Nhập lựa chọn ${getOptionLabel(optionIndex)}...`}
                      className="flex-1 px-3 py-2 border-0 bg-transparent focus:outline-none focus:ring-0"
                    />

                    {/* Checkbox đáp án đúng */}
                    <button
                      type="button"
                      onClick={() => updateOption(questionIndex, optionIndex, 'isCorrect', !option.isCorrect)}
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        option.isCorrect 
                          ? 'bg-green-500 text-white hover:bg-green-600' 
                          : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                      }`}
                      title={option.isCorrect ? 'Đáp án đúng' : 'Đánh dấu là đáp án đúng'}
                    >
                      {option.isCorrect ? (
                        <CheckCircleIcon className="w-5 h-5" />
                      ) : (
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      )}
                    </button>

                    {/* Nút xóa option */}
                    {question.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(questionIndex, optionIndex)}
                        className="flex-shrink-0 p-1 text-red-400 hover:text-red-600 transition-colors"
                        title="Xóa lựa chọn"
                      >
                        <Markdown className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback */}
            <div>
              <label 
                htmlFor={`feedback-${questionIndex}`}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Giải thích (tùy chọn)
              </label>
              <textarea
                id={`feedback-${questionIndex}`}
                value={question.feedBack}
                onChange={(e) => updateQuestion(questionIndex, 'feedBack', e.target.value)}
                placeholder="Nhập giải thích cho câu trả lời..."
                rows="2"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        ))}

        {/* Nút điều khiển */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t">
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-2 px-6 py-3 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Thêm Câu Hỏi
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setQuestions([{
                question: '',
                feedBack: '',
                options: [
                  { optionText: '', isCorrect: false },
                  { optionText: '', isCorrect: false },
                  { optionText: '', isCorrect: false },
                  { optionText: '', isCorrect: false }
                ]
              }])}
              className="px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium"
            >
              Làm mới
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang gửi...
                </span>
              ) : (
                'Gửi Câu Hỏi'
              )}
            </button>
          </div>
        </div>

        {/* Hướng dẫn */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          <p className="font-semibold mb-2">💡 Hướng dẫn sử dụng:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Mỗi câu hỏi cần có ít nhất 2 lựa chọn và đúng 1 đáp án đúng</li>
            <li>Click vào biểu tượng tích xanh để đánh dấu đáp án đúng</li>
            <li>Có thể thêm tối đa 6 lựa chọn cho mỗi câu hỏi</li>
            <li>Phần "Giải thích" giúp học sinh hiểu rõ hơn về đáp án</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default MultipleChoiceForm;