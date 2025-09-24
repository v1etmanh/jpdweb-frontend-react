import React, { useState, useEffect } from 'react';

import { LightbulbIcon, PlusCircleIcon, Trash2Icon, TriangleDashedIcon } from 'lucide-react';
import { Markdown } from 'react-bootstrap-icons';

const GapFillForm = ({ onSubmit }) => {
  const [questions, setQuestions] = useState([
    {
      question: '',
      feedBack: '',
      answers: []
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tự động phát hiện và cập nhật gaps từ câu hỏi
  const detectGaps = (questionText) => {
    // Tìm tất cả các gap được đánh dấu bằng _____ hoặc [blank] hoặc {gap}
    const gapPatterns = [
      /_{3,}/g,           // _____ (3 dấu gạch dưới trở lên)
      /\[blank\d*\]/gi,   // [blank] hoặc [blank1], [blank2]
      /\{gap\d*\}/gi,     // {gap} hoặc {gap1}, {gap2}
      /\(\s*\)/g          // ( ) - dấu ngoặc trống
    ];
    
    let gapCount = 0;
    gapPatterns.forEach(pattern => {
      const matches = questionText.match(pattern);
      if (matches) {
        gapCount += matches.length;
      }
    });
    
    return gapCount;
  };

  // Cập nhật số lượng gaps khi câu hỏi thay đổi
  const updateQuestion = (questionIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex][field] = value;
    
    if (field === 'question') {
      const gapCount = detectGaps(value);
      const currentAnswers = newQuestions[questionIndex].answers;
      
      // Điều chỉnh số lượng answers theo số gaps
      if (gapCount > currentAnswers.length) {
        // Thêm answers
        const newAnswers = [...currentAnswers];
        for (let i = currentAnswers.length; i < gapCount; i++) {
          newAnswers.push({ answer: '' });
        }
        newQuestions[questionIndex].answers = newAnswers;
      } else if (gapCount < currentAnswers.length) {
        // Giảm answers
        newQuestions[questionIndex].answers = currentAnswers.slice(0, gapCount);
      }
    }
    
    setQuestions(newQuestions);
  };

  // Thêm câu hỏi mới
  const addQuestion = () => {
    const newQuestion = {
      question: '',
      feedBack: '',
      answers: []
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

  // Cập nhật answer
  const updateAnswer = (questionIndex, answerIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex].answer = value;
    setQuestions(newQuestions);
  };

  // Thêm answer thủ công
  const addAnswer = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.push({ answer: '' });
    setQuestions(newQuestions);
  };

  // Xóa answer
  const removeAnswer = (questionIndex, answerIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].answers.length > 1) {
      newQuestions[questionIndex].answers.splice(answerIndex, 1);
      setQuestions(newQuestions);
    }
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

      // Kiểm tra có ít nhất 1 answer
      if (question.answers.length === 0) {
        alert(`Câu hỏi ${i + 1}: Cần có ít nhất 1 đáp án!`);
        return false;
      }

      // Kiểm tra tất cả answers đều có nội dung
      const emptyAnswers = question.answers.filter(ans => !ans.answer.trim());
      if (emptyAnswers.length > 0) {
        alert(`Câu hỏi ${i + 1}: Tất cả đáp án cần được điền đầy đủ!`);
        return false;
      }

      // Kiểm tra có gap trong câu hỏi
      const gapCount = detectGaps(question.question);
      if (gapCount === 0) {
        alert(`Câu hỏi ${i + 1}: Cần có ít nhất 1 chỗ trống (sử dụng _____, [blank], {gap}, hoặc ( ))!`);
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

    // Format dữ liệu
    const validQuestions = questions.map(q => ({
      question: q.question.trim(),
      feedBack: q.feedBack.trim(),
      answers: q.answers
        .filter(ans => ans.answer.trim() !== '')
        .map(ans => ({
          answer: ans.answer.trim()
        }))
    }));

    setIsSubmitting(true);
    
    try {
      await onSubmit(validQuestions);
      // Reset form
      setQuestions([{
        question: '',
        feedBack: '',
        answers: []
      }]);
    } catch (error) {
      console.error('Error submitting questions:', error);
      alert('Có lỗi xảy ra khi gửi câu hỏi!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hiển thị preview câu hỏi
  const renderQuestionPreview = (questionText) => {
    if (!questionText) return '';
    
    let preview = questionText;
    const patterns = [
      { regex: /_{3,}/g, replacement: '<span class="gap-highlight">_____</span>' },
      { regex: /\[blank\d*\]/gi, replacement: '<span class="gap-highlight">[BLANK]</span>' },
      { regex: /\{gap\d*\}/gi, replacement: '<span class="gap-highlight">{GAP}</span>' },
      { regex: /\(\s*\)/g, replacement: '<span class="gap-highlight">( __ )</span>' }
    ];
    
    patterns.forEach(pattern => {
      preview = preview.replace(pattern.regex, pattern.replacement);
    });
    
    return preview;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <style jsx>{`
        .gap-highlight {
          background-color: #fef3c7;
          padding: 2px 8px;
          border-radius: 4px;
          border: 2px dashed #f59e0b;
          font-weight: bold;
          color: #d97706;
        }
      `}</style>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Thêm Câu Hỏi Điền Từ (Gap Fill)
        </h2>
        <p className="text-gray-600">
          Tạo các câu hỏi điền từ với chỗ trống để học sinh hoàn thiện
        </p>
      </div>

      {/* Hướng dẫn sử dụng */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <LightbulbIcon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Cách tạo chỗ trống:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><code className="bg-blue-100 px-2 py-1 rounded">_____</code> - Dùng 3 dấu gạch dưới trở lên</p>
              <p><code className="bg-blue-100 px-2 py-1 rounded">[blank]</code> - Dùng [blank], [blank1], [blank2]...</p>
              <p><code className="bg-blue-100 px-2 py-1 rounded">&#123;gap&#125;</code> - Dùng &#123;gap&#125;, &#123;gap1&#125;, &#123;gap2&#125;...</p>
              <p><code className="bg-blue-100 px-2 py-1 rounded">( )</code> - Dùng dấu ngoặc trống</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((question, questionIndex) => {
          const gapCount = detectGaps(question.question);
          
          return (
            <div 
              key={questionIndex}
              className="p-6 border-2 border-gray-200 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50"
            >
              {/* Header câu hỏi */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-gray-800">
                    Câu hỏi #{questionIndex + 1}
                  </h3>
                  {gapCount > 0 && (
                    <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium">
                      {gapCount} chỗ trống
                    </span>
                  )}
                </div>
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
                  placeholder="Nhập câu hỏi với chỗ trống. Ví dụ: The _____ is shining brightly today."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
                
                {/* Preview câu hỏi */}
                {question.question && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Xem trước:</p>
                    <div 
                      className="text-gray-800"
                      dangerouslySetInnerHTML={{ __html: renderQuestionPreview(question.question) }}
                    />
                  </div>
                )}
              </div>

              {/* Đáp án */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Đáp án cho các chỗ trống <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => addAnswer(questionIndex)}
                    className="text-sm text-green-600 hover:text-green-800 font-medium"
                  >
                    + Thêm đáp án
                  </button>
                </div>

                {question.answers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Markdown className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Nhập câu hỏi với chỗ trống để tự động tạo đáp án</p>
                    <p className="text-sm">hoặc click "Thêm đáp án" để thêm thủ công</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.answers.map((answer, answerIndex) => (
                      <div 
                        key={answerIndex}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {answerIndex + 1}
                        </div>
                        
                        <input
                          type="text"
                          value={answer.answer}
                          onChange={(e) => updateAnswer(questionIndex, answerIndex, e.target.value)}
                          placeholder={`Đáp án ${answerIndex + 1}...`}
                          className="flex-1 px-3 py-2 border-0 bg-transparent focus:outline-none focus:ring-0"
                        />

                        {question.answers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAnswer(questionIndex, answerIndex)}
                            className="flex-shrink-0 p-1 text-red-400 hover:text-red-600 transition-colors"
                            title="Xóa đáp án"
                          >
                            <TriangleDashedIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {gapCount > 0 && question.answers.length !== gapCount && (
                  <div className="mt-3 p-3 bg-amber-100 border border-amber-300 rounded-lg">
                    <p className="text-sm text-amber-700">
                      ⚠️ Số đáp án ({question.answers.length}) khác với số chỗ trống ({gapCount}) trong câu hỏi
                    </p>
                  </div>
                )}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          );
        })}

        {/* Nút điều khiển */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t">
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-2 px-6 py-3 text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors font-medium"
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
                answers: []
              }])}
              className="px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium"
            >
              Làm mới
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
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

        {/* Ví dụ */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
          <p className="font-semibold mb-3">📝 Ví dụ câu hỏi Gap Fill:</p>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded border-l-4 border-green-500">
              <p className="font-medium">Câu hỏi:</p>
              <p>The _____ is shining brightly and the birds are _____ in the trees.</p>
              <p className="font-medium mt-2">Đáp án:</p>
              <p>1. sun &nbsp;&nbsp;&nbsp; 2. singing</p>
            </div>
            
            <div className="bg-white p-3 rounded border-l-4 border-blue-500">
              <p className="font-medium">Câu hỏi:</p>
              <p>She [blank1] to the store and [blank2] some groceries.</p>
              <p className="font-medium mt-2">Đáp án:</p>
              <p>1. went &nbsp;&nbsp;&nbsp; 2. bought</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default GapFillForm;