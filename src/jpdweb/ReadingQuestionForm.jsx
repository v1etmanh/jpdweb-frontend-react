import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  BookOpen, 
  FileText, 
  Check, 
  X, 
  Eye,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

const ReadingQuestionForm = ({ onSubmit }) => {
  const [passages, setPassages] = useState([
    {
      title: '',
      content: '',
      questions: [
        {
          question: '',
          feedBack: '',
          readingQuestionOptions: [
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false }
          ]
        }
      ]
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePreview, setActivePreview] = useState(null);

  // Thêm passage mới
  const addPassage = () => {
    const newPassage = {
      title: '',
      content: '',
      questions: [
        {
          question: '',
          feedBack: '',
          readingQuestionOptions: [
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false }
          ]
        }
      ]
    };
    setPassages([...passages, newPassage]);
  };

  // Xóa passage
  const removePassage = (passageIndex) => {
    if (passages.length > 1) {
      const newPassages = passages.filter((_, i) => i !== passageIndex);
      setPassages(newPassages);
    }
  };

  // Cập nhật passage
  const updatePassage = (passageIndex, field, value) => {
    const newPassages = [...passages];
    newPassages[passageIndex][field] = value;
    setPassages(newPassages);
  };

  // Thêm câu hỏi cho passage
  const addQuestion = (passageIndex) => {
    const newPassages = [...passages];
    const newQuestion = {
      question: '',
      feedBack: '',
      readingQuestionOptions: [
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false }
      ]
    };
    newPassages[passageIndex].questions.push(newQuestion);
    setPassages(newPassages);
  };

  // Xóa câu hỏi
  const removeQuestion = (passageIndex, questionIndex) => {
    const newPassages = [...passages];
    if (newPassages[passageIndex].questions.length > 1) {
      newPassages[passageIndex].questions.splice(questionIndex, 1);
      setPassages(newPassages);
    }
  };

  // Cập nhật câu hỏi
  const updateQuestion = (passageIndex, questionIndex, field, value) => {
    const newPassages = [...passages];
    newPassages[passageIndex].questions[questionIndex][field] = value;
    setPassages(newPassages);
  };

  // Thêm option cho câu hỏi
  const addOption = (passageIndex, questionIndex) => {
    const newPassages = [...passages];
    const question = newPassages[passageIndex].questions[questionIndex];
    if (question.readingQuestionOptions.length < 6) {
      question.readingQuestionOptions.push({ optionText: '', isCorrect: false });
      setPassages(newPassages);
    }
  };

  // Xóa option
  const removeOption = (passageIndex, questionIndex, optionIndex) => {
    const newPassages = [...passages];
    const question = newPassages[passageIndex].questions[questionIndex];
    if (question.readingQuestionOptions.length > 2) {
      question.readingQuestionOptions.splice(optionIndex, 1);
      setPassages(newPassages);
    }
  };

  // Cập nhật option
  const updateOption = (passageIndex, questionIndex, optionIndex, field, value) => {
    const newPassages = [...passages];
    const options = newPassages[passageIndex].questions[questionIndex].readingQuestionOptions;
    options[optionIndex][field] = value;
    
    // Nếu đánh dấu đáp án đúng, bỏ đánh dấu các option khác
    if (field === 'isCorrect' && value === true) {
      options.forEach((option, i) => {
        if (i !== optionIndex) {
          option.isCorrect = false;
        }
      });
    }
    
    setPassages(newPassages);
  };

  // Validate form
  const validateForm = () => {
    for (let i = 0; i < passages.length; i++) {
      const passage = passages[i];
      
      // Kiểm tra passage có tiêu đề và nội dung
      if (!passage.title.trim()) {
        alert(`Đoạn văn ${i + 1}: Vui lòng nhập tiêu đề!`);
        return false;
      }
      
      if (!passage.content.trim()) {
        alert(`Đoạn văn ${i + 1}: Vui lòng nhập nội dung đoạn văn!`);
        return false;
      }

      // Kiểm tra từng câu hỏi
      for (let j = 0; j < passage.questions.length; j++) {
        const question = passage.questions[j];
        
        if (!question.question.trim()) {
          alert(`Đoạn văn ${i + 1}, Câu hỏi ${j + 1}: Vui lòng nhập nội dung câu hỏi!`);
          return false;
        }

        // Kiểm tra có ít nhất 2 option có nội dung
        const validOptions = question.readingQuestionOptions.filter(opt => opt.optionText.trim() !== '');
        if (validOptions.length < 2) {
          alert(`Đoạn văn ${i + 1}, Câu hỏi ${j + 1}: Cần có ít nhất 2 lựa chọn!`);
          return false;
        }

        // Kiểm tra có đáp án đúng
        const correctOptions = question.readingQuestionOptions.filter(opt => opt.isCorrect);
        if (correctOptions.length !== 1) {
          alert(`Đoạn văn ${i + 1}, Câu hỏi ${j + 1}: Cần có đúng 1 đáp án đúng!`);
          return false;
        }
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
    const validData = passages.map(passage => ({
      title: passage.title.trim(),
      content: passage.content.trim(),
      questions: passage.questions.map(q => ({
        question: q.question.trim(),
        feedBack: q.feedBack.trim(),
        readingQuestionOptions: q.readingQuestionOptions
          .filter(opt => opt.optionText.trim() !== '')
          .map(opt => ({
            optionText: opt.optionText.trim(),
            isCorrect: opt.isCorrect
          }))
      }))
    }));

    setIsSubmitting(true);
    
    try {
      await onSubmit(validData);
      // Reset form
      setPassages([{
        title: '',
        content: '',
        questions: [{
          question: '',
          feedBack: '',
          readingQuestionOptions: [
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false }
          ]
        }]
      }]);
    } catch (error) {
      console.error('Error submitting reading questions:', error);
      alert('Có lỗi xảy ra khi gửi câu hỏi đọc hiểu!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOptionLabel = (index) => {
    return String.fromCharCode(65 + index); // A, B, C, D, E, F
  };

  const togglePreview = (passageIndex) => {
    setActivePreview(activePreview === passageIndex ? null : passageIndex);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Thêm Câu Hỏi Đọc Hiểu
          </h2>
        </div>
        <p className="text-gray-600">
          Tạo đoạn văn và các câu hỏi đọc hiểu cho học sinh
        </p>
      </div>

      {/* Hướng dẫn */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">💡 Hướng dẫn tạo câu hỏi đọc hiểu:</h4>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>Nhập đoạn văn có nội dung phù hợp với trình độ học sinh</li>
              <li>Tạo câu hỏi kiểm tra khả năng hiểu nội dung, suy luận</li>
              <li>Đảm bảo đáp án có thể tìm được từ đoạn văn</li>
              <li>Sử dụng "Xem trước" để kiểm tra giao diện hiển thị</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {passages.map((passage, passageIndex) => (
          <div 
            key={passageIndex}
            className="border-2 border-gray-200 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 overflow-hidden"
          >
            {/* Header đoạn văn */}
            <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-800">
                  Đoạn văn #{passageIndex + 1}
                </h3>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {passage.questions.length} câu hỏi
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => togglePreview(passageIndex)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                  title="Xem trước"
                >
                  <Eye className="w-5 h-5" />
                </button>
                {passages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePassage(passageIndex)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                    title="Xóa đoạn văn"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Tiêu đề đoạn văn */}
              <div>
                <label 
                  htmlFor={`passage-title-${passageIndex}`}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tiêu đề đoạn văn <span className="text-red-500">*</span>
                </label>
                <input
                  id={`passage-title-${passageIndex}`}
                  type="text"
                  value={passage.title}
                  onChange={(e) => updatePassage(passageIndex, 'title', e.target.value)}
                  placeholder="Nhập tiêu đề cho đoạn văn..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Nội dung đoạn văn */}
              <div>
                <label 
                  htmlFor={`passage-content-${passageIndex}`}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nội dung đoạn văn <span className="text-red-500">*</span>
                </label>
                <textarea
                  id={`passage-content-${passageIndex}`}
                  value={passage.content}
                  onChange={(e) => updatePassage(passageIndex, 'content', e.target.value)}
                  placeholder="Nhập nội dung đoạn văn để đọc hiểu..."
                  rows="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>{passage.content.length} ký tự</span>
                  <span>{passage.content.split(' ').filter(word => word.length > 0).length} từ</span>
                </div>
              </div>

              {/* Preview đoạn văn */}
              {activePreview === passageIndex && passage.content && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Xem trước đoạn văn</span>
                  </div>
                  <div className="prose max-w-none">
                    {passage.title && (
                      <h4 className="text-lg font-bold text-gray-800 mb-3">{passage.title}</h4>
                    )}
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {passage.content}
                    </div>
                  </div>
                </div>
              )}

              {/* Câu hỏi */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-800">Câu hỏi cho đoạn văn</h4>
                  <button
                    type="button"
                    onClick={() => addQuestion(passageIndex)}
                    className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm câu hỏi
                  </button>
                </div>

                {passage.questions.map((question, questionIndex) => (
                  <div 
                    key={questionIndex}
                    className="bg-white border border-gray-200 rounded-lg p-5"
                  >
                    {/* Header câu hỏi */}
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-md font-semibold text-gray-800">
                        Câu hỏi {questionIndex + 1}
                      </h5>
                      {passage.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(passageIndex, questionIndex)}
                          className="p-1 text-red-500 hover:text-red-700 transition-colors"
                          title="Xóa câu hỏi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Nội dung câu hỏi */}
                    <div className="mb-4">
                      <label 
                        htmlFor={`question-${passageIndex}-${questionIndex}`}
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Nội dung câu hỏi <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id={`question-${passageIndex}-${questionIndex}`}
                        value={question.question}
                        onChange={(e) => updateQuestion(passageIndex, questionIndex, 'question', e.target.value)}
                        placeholder="Nhập câu hỏi về đoạn văn..."
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Các lựa chọn */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Các lựa chọn <span className="text-red-500">*</span>
                        </label>
                        {question.readingQuestionOptions.length < 6 && (
                          <button
                            type="button"
                            onClick={() => addOption(passageIndex, questionIndex)}
                            className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                          >
                            + Thêm lựa chọn
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        {question.readingQuestionOptions.map((option, optionIndex) => (
                          <div 
                            key={optionIndex}
                            className={`flex items-center gap-3 p-3 rounded-md border transition-colors ${
                              option.isCorrect 
                                ? 'border-green-300 bg-green-50' 
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            {/* Label */}
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              option.isCorrect 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-300 text-gray-600'
                            }`}>
                              {getOptionLabel(optionIndex)}
                            </div>

                            {/* Input */}
                            <input
                              type="text"
                              value={option.optionText}
                              onChange={(e) => updateOption(passageIndex, questionIndex, optionIndex, 'optionText', e.target.value)}
                              placeholder={`Lựa chọn ${getOptionLabel(optionIndex)}...`}
                              className="flex-1 px-3 py-1 border-0 bg-transparent focus:outline-none"
                            />

                            {/* Correct answer button */}
                            <button
                              type="button"
                              onClick={() => updateOption(passageIndex, questionIndex, optionIndex, 'isCorrect', !option.isCorrect)}
                              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                option.isCorrect 
                                  ? 'bg-green-500 text-white hover:bg-green-600' 
                                  : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                              }`}
                              title={option.isCorrect ? 'Đáp án đúng' : 'Đánh dấu đáp án đúng'}
                            >
                              {option.isCorrect ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              )}
                            </button>

                            {/* Remove option */}
                            {question.readingQuestionOptions.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(passageIndex, questionIndex, optionIndex)}
                                className="flex-shrink-0 p-1 text-red-400 hover:text-red-600 transition-colors"
                                title="Xóa lựa chọn"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Feedback */}
                    <div>
                      <label 
                        htmlFor={`feedback-${passageIndex}-${questionIndex}`}
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Giải thích (tùy chọn)
                      </label>
                      <textarea
                        id={`feedback-${passageIndex}-${questionIndex}`}
                        value={question.feedBack}
                        onChange={(e) => updateQuestion(passageIndex, questionIndex, 'feedBack', e.target.value)}
                        placeholder="Giải thích tại sao đây là đáp án đúng..."
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Nút điều khiển */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={addPassage}
            className="flex items-center gap-2 px-6 py-3 text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Thêm Đoạn Văn
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPassages([{
                title: '',
                content: '',
                questions: [{
                  question: '',
                  feedBack: '',
                  readingQuestionOptions: [
                    { optionText: '', isCorrect: false },
                    { optionText: '', isCorrect: false },
                    { optionText: '', isCorrect: false },
                    { optionText: '', isCorrect: false }
                  ]
                }]
              }])}
              className="px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium"
            >
              Làm mới
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang gửi...
                </span>
              ) : (
                'Gửi Câu Hỏi Đọc Hiểu'
              )}
            </button>
          </div>
        </div>

        {/* Thống kê */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-800">Thống kê nội dung</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded border-l-4 border-purple-500">
              <div className="font-medium text-gray-700">Số đoạn văn</div>
              <div className="text-2xl font-bold text-purple-600">{passages.length}</div>
            </div>
            <div className="bg-white p-3 rounded border-l-4 border-blue-500">
              <div className="font-medium text-gray-700">Tổng câu hỏi</div>
              <div className="text-2xl font-bold text-blue-600">
                {passages.reduce((total, passage) => total + passage.questions.length, 0)}
              </div>
            </div>
            <div className="bg-white p-3 rounded border-l-4 border-green-500">
              <div className="font-medium text-gray-700">Tổng từ vựng</div>
              <div className="text-2xl font-bold text-green-600">
                {passages.reduce((total, passage) => 
                  total + passage.content.split(' ').filter(word => word.length > 0).length, 0
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReadingQuestionForm;