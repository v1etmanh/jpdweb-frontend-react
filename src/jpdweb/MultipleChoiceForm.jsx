import React, { useEffect, useRef, useState } from 'react';
import { CheckCircleIcon, PlusCircleIcon, Trash2Icon, XIcon, Loader2Icon } from 'lucide-react';
import { Markdown } from 'react-bootstrap-icons';
import { generateFeedBack } from './api/ApiConnect';

const MultipleChoiceForm = ({ onSubmit, initialData, onDelete }) => {
  const [questions, setQuestions] = useState([
    {
      mcId: null,
      question: '',
      feedBack: '',
      options: [
        { mcoId: null, optionText: '', isCorrect: false },
        { mcoId: null, optionText: '', isCorrect: false },
        { mcoId: null, optionText: '', isCorrect: false },
        { mcoId: null, optionText: '', isCorrect: false }
      ]
    }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasLoadedInitialData = useRef(false);
  
  // 🎯 States cho AI Feedback Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const debounceTimerRef = useRef(null);

  //
    const [feedbackStatus, setFeedbackStatus] = useState({}); // Track feedback state
  
  // Hash để detect thay đổi có ý nghĩa
  const questionHashRef = useRef({});
  //

const lastGeneratedRef = useRef(0);
//
const computeQuestionHash = (question) => {
  const text = question.question + 
               question.options.map(o => o.optionText + o.isCorrect).join("|");
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0; // convert to 32-bit
  }
  return hash;
};
//
const canGenerateNow = () => {
  const now = Date.now();
  const COOLDOWN_MS = 10000; // 10 giây
  if (now - lastGeneratedRef.current < COOLDOWN_MS) {
    console.warn("Đang cooldown, vui lòng chờ thêm vài giây...");
    return false;
  }
  lastGeneratedRef.current = now;
  return true;
};

  // Tính hash cho câu hỏi
  const getQuestionHash = (question) => {
    const correctAnswer = question.options.find(o => o.isCorrect)?.optionText || '';
    return `${question.question.trim()}_${correctAnswer}`.toLowerCase();
  };
//
const shouldGenerateFeedback = (question) => {
  if (!question) return false;
  
  const hasValidQuestion = question.question.trim().length > 20;
  const hasEnoughOptions = question.options.filter(opt => opt.optionText.trim()).length >= 2;
  const hasCorrectAnswer = question.options.some(opt => opt.isCorrect);
  const hasNoFeedback = !question.feedBack || question.feedBack.trim().length === 0;
  
  return hasValidQuestion && hasEnoughOptions && hasCorrectAnswer && hasNoFeedback;
};
  // Auto-generate với điều kiện
  useEffect(() => {
    if (currentQuestionIndex === null) return;
    
    const question = questions[currentQuestionIndex];
    const questionHash = getQuestionHash(question);
    const previousHash = questionHashRef.current[currentQuestionIndex];
    
    // ✅ Điều kiện generate
    const shouldGenerate = 
      question.question.trim().length > 20 && // Câu hỏi đủ dài
      question.options.some(opt => opt.isCorrect) && // Có đáp án đúng
      question.options.filter(opt => opt.optionText.trim()).length >= 2 && // Đủ 2 options
      !feedbackStatus[currentQuestionIndex]?.generated && // Chưa generate
      questionHash !== previousHash; // Nội dung thay đổi đáng kể
    
    if (!shouldGenerate) return;

    // Clear timer cũ
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce 3s
    debounceTimerRef.current = setTimeout(async () => {
      await generateAiFeedback(currentQuestionIndex);
      
      // Lưu hash để tránh generate lại
      questionHashRef.current[currentQuestionIndex] = questionHash;
      
      // Đánh dấu đã generate
      setFeedbackStatus(prev => ({
        ...prev,
        [currentQuestionIndex]: { generated: true, timestamp: Date.now() }
      }));
    }, 3000);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [questions, currentQuestionIndex]);

  //
   const forceRegenerateFeedback = async (questionIndex) => {
    // Reset flag
    setFeedbackStatus(prev => ({
      ...prev,
      [questionIndex]: { generated: false }
    }));
    
    // Clear hash để cho phép generate lại
    delete questionHashRef.current[questionIndex];
    
    // Generate ngay
    await generateAiFeedback(questionIndex);
  };

  // Load initial data
  useEffect(() => {
    if (initialData && Array.isArray(initialData) && initialData.length > 0 && !hasLoadedInitialData.current) {
      const loadedQuestions = initialData.map(item => ({
        mcId: item.mcId || null,
        question: item.questionText || '',
        feedBack: item.feedback || '',
        options: item.options?.map(opt => ({
          mcoId: opt.mcoId || null,
          optionText: opt.optionText || '',
          isCorrect: opt.correct || false
        })) || []
      }));
      
      setQuestions(loadedQuestions);
      hasLoadedInitialData.current = true;
    }
  }, [initialData]);

  // 🔥 Auto-generate feedback khi user gõ xong (debounce 2.5s)
  useEffect(() => {
    if (currentQuestionIndex === null) return;
    
    const question = questions[currentQuestionIndex];
    const correctOption = question.options.find(opt => opt.isCorrect);
    
    // Chỉ generate khi có câu hỏi và đáp án đúng
    if (!question.question.trim() || !correctOption?.optionText.trim()) {
      return;
    }

    // Clear timer cũ
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set timer mới
    debounceTimerRef.current = setTimeout(async () => {
      await generateAiFeedback(currentQuestionIndex);
    }, 2500); // 2.5 giây

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [questions, currentQuestionIndex]);

  // 🤖 Generate AI Feedback


// 🚀 Hàm generate AI feedback được chỉnh lại hoàn chỉnh
const generateAiFeedback = async (questionIndex) => {
  const question = questions[questionIndex];
  const correctOption = question.options.find(opt => opt.isCorrect);
  if (!question.question.trim() || !correctOption) return;

  // 1️⃣ Tính hash và kiểm tra xem có thay đổi không
  const questionHash = computeQuestionHash(question);
  if (questionHashRef.current[questionIndex] === questionHash) {
    console.log("⏭️ Bỏ qua: nội dung không thay đổi.");
    return;
  }

  // 2️⃣ Kiểm tra cooldown
  if (!canGenerateNow()) {
    console.log("⏳ Cooldown đang hoạt động, bỏ qua.");
    return;
  }

  // 3️⃣ Gọi API nếu qua được các kiểm tra
  setIsGeneratingFeedback(true);
  try {
    const data = {
      question: question.question,
      answer: correctOption.optionText
    };

    const response = await generateFeedBack(data);
    setAiSuggestion(response.data || response);

    // Lưu hash để tránh gọi lại với cùng nội dung
    questionHashRef.current[questionIndex] = questionHash;

    // Mở sidebar nếu đang đóng
    if (!sidebarOpen) setSidebarOpen(true);

  } catch (error) {
    console.error("❌ Lỗi khi tạo feedback:", error);
    setAiSuggestion("Không thể tạo feedback tự động. Vui lòng thử lại sau.");
  } finally {
    setIsGeneratingFeedback(false);
  }
};

  // 📝 Apply AI suggestion vào feedback
const applySuggestion = () => {
    if (currentQuestionIndex !== null && aiSuggestion) {
      updateQuestion(currentQuestionIndex, 'feedBack', aiSuggestion);
      setAiSuggestion('');
      
      // Đánh dấu câu hỏi này đã có feedback
      setFeedbackStatus(prev => ({
        ...prev,
        [currentQuestionIndex]: { 
          generated: true, 
          hasFeedback: true, 
          timestamp: Date.now() 
        }
      }));
    }
  };

  // Thêm câu hỏi mới
  const addQuestion = () => {
    const newQuestion = {
      mcId: null,
      question: '',
      feedBack: '',
      options: [
        { mcoId: null, optionText: '', isCorrect: false },
        { mcoId: null, optionText: '', isCorrect: false },
        { mcoId: null, optionText: '', isCorrect: false },
        { mcoId: null, optionText: '', isCorrect: false }
      ]
    };
    setQuestions([...questions, newQuestion]);
  };

  // Xóa câu hỏi
  const removeQuestion = async (questionIndex) => {
    const mulp = questions[questionIndex];
    if (!mulp) return;

    const confirmed = window.confirm("Bạn có chắc muốn xóa câu hỏi này?");
    if (!confirmed) return;

    try {
      if (mulp.mcId) {
        await onDelete(mulp.mcId);
      }
      setQuestions(prev => prev.filter((_, i) => i !== questionIndex));
      
      // Reset sidebar nếu đang mở câu hỏi bị xóa
      if (currentQuestionIndex === questionIndex) {
        setCurrentQuestionIndex(null);
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error("Lỗi khi xóa câu hỏi:", error);
      alert("Xóa thất bại, vui lòng thử lại.");
    }
  };

  // Cập nhật câu hỏi
  const updateQuestion = (questionIndex, field, value) => {
    const newQuestions = questions.map((q, i) => 
      i === questionIndex ? { ...q, [field]: value } : q
    );
    setQuestions(newQuestions);
    
    // Nếu user xóa feedback → cho phép generate lại
    if (field === 'feedBack' && !value.trim()) {
      setFeedbackStatus(prev => ({
        ...prev,
        [questionIndex]: { ...prev[questionIndex], generated: false, hasFeedback: false }
      }));
      delete questionHashRef.current[questionIndex];
    }
    
    if (field === 'question') {
      setCurrentQuestionIndex(questionIndex);
    }
  };

  // Thêm option
  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options.length < 6) {
      newQuestions[questionIndex].options.push({ 
        mcoId: null,
        optionText: '', 
        isCorrect: false 
      });
      setQuestions(newQuestions);
    }
  };

  // Xóa option
  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options.length > 2) {
      newQuestions[questionIndex].options.splice(optionIndex, 1);
      setQuestions(newQuestions);
    }
  };

  // Cập nhật option
  const updateOption = (questionIndex, optionIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex][field] = value;
    
    if (field === 'isCorrect' && value === true) {
      newQuestions[questionIndex].options.forEach((option, i) => {
        if (i !== optionIndex) {
          option.isCorrect = false;
        }
      });
      // Trigger AI feedback khi user chọn đáp án đúng
      setCurrentQuestionIndex(questionIndex);
    }
    
    setQuestions(newQuestions);
  };

  // Validate form
  const validateForm = () => {
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      if (!question.question.trim()) {
        alert(`Câu hỏi ${i + 1}: Vui lòng nhập nội dung câu hỏi!`);
        return false;
      }

      const validOptions = question.options.filter(opt => opt.optionText.trim() !== '');
      if (validOptions.length < 2) {
        alert(`Câu hỏi ${i + 1}: Cần có ít nhất 2 lựa chọn!`);
        return false;
      }

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
    
    if (!validateForm()) return;

    const validQuestions = questions.map(q => ({
      mcId: q.mcId,
      questionText: q.question.trim(),
      feedback: q.feedBack.trim(),
      typeOfContent: "MULTIPLE_CHOICE",
      options: q.options
        .filter(opt => opt.optionText.trim() !== '')
        .map(opt => ({
          mcoId: null,
          optionText: opt.optionText.trim(),
          correct: opt.isCorrect
        }))
    }));
    console.log(validQuestions)
    setIsSubmitting(true);
    
    try {
      await onSubmit(validQuestions);
    } catch (error) {
      console.error('Error submitting questions:', error);
      alert('Có lỗi xảy ra khi gửi câu hỏi!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOptionLabel = (index) => {
    return String.fromCharCode(65 + index);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'mr-96' : ''}`}>
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
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
                  className={`p-6 border-2 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 transition-all ${
                    currentQuestionIndex === questionIndex ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                  }`}
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
                      onFocus={() => setCurrentQuestionIndex(questionIndex)}
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
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            option.isCorrect 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {getOptionLabel(optionIndex)}
                          </div>

                          <input
                            type="text"
                            value={option.optionText}
                            onChange={(e) => updateOption(questionIndex, optionIndex, 'optionText', e.target.value)}
                            placeholder={`Nhập lựa chọn ${getOptionLabel(optionIndex)}...`}
                            className="flex-1 px-3 py-2 border-0 bg-transparent focus:outline-none focus:ring-0"
                          />

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
                    onClick={() => {
                      setQuestions([{
                        mcId: null,
                        question: '',
                        feedBack: '',
                        options: [
                          { mcoId: null, optionText: '', isCorrect: false },
                          { mcoId: null, optionText: '', isCorrect: false },
                          { mcoId: null, optionText: '', isCorrect: false },
                          { mcoId: null, optionText: '', isCorrect: false }
                        ]
                      }]);
                      setCurrentQuestionIndex(null);
                      setSidebarOpen(false);
                    }}
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
                        <Loader2Icon className="animate-spin h-5 w-5" />
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
                  <li>🤖 AI sẽ tự động gợi ý feedback khi bạn gõ xong câu hỏi</li>
                  <li>Có thể thêm tối đa 6 lựa chọn cho mỗi câu hỏi</li>
                </ul>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 🎯 AI Feedback Sidebar */}
     {/* 🎯 AI Feedback Sidebar */}
<div 
  className={`fixed right-0 top-0 h-full w-96 bg-white border-l-2 border-gray-200 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
    sidebarOpen ? 'translate-x-0' : 'translate-x-full'
  }`}
>
  <div className="flex flex-col h-full">
    {/* Header */}
    <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🤖</span>
        <h3 className="font-bold text-lg">AI Feedback</h3>
      </div>
      <button
        onClick={() => setSidebarOpen(false)}
        className="p-1 hover:bg-white/20 rounded-full transition-colors"
      >
        <XIcon className="w-5 h-5" />
      </button>
    </div>

    {/* Content */}
    <div className="flex-1 overflow-y-auto p-4">
      {/* Case 1: Feedback đã tồn tại và đã được áp dụng */}
      {currentQuestionIndex !== null && 
       questions[currentQuestionIndex]?.feedBack?.trim() && 
       feedbackStatus[currentQuestionIndex]?.hasFeedback ? (
        <div className="space-y-4">
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
            <p className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5" />
              Feedback đã được tạo
            </p>
            <p className="text-xs text-gray-600 mb-3">
              Câu hỏi này đã có feedback. Bạn có muốn tạo lại không?
            </p>
            
            {/* Hiển thị feedback hiện tại */}
            <div className="bg-white rounded-lg p-3 border border-green-200 text-sm text-gray-700">
              <p className="font-medium mb-1">Feedback hiện tại:</p>
              <p className="text-xs leading-relaxed">
                {questions[currentQuestionIndex].feedBack.substring(0, 150)}
                {questions[currentQuestionIndex].feedBack.length > 150 && '...'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => forceRegenerateFeedback(currentQuestionIndex)}
            disabled={isGeneratingFeedback}
            className="w-full px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔄 Tạo feedback mới
          </button>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
            <p className="font-semibold mb-1">💡 Lưu ý:</p>
            <p>Tạo lại sẽ thay thế feedback hiện tại. Hành động này không thể hoàn tác.</p>
          </div>
        </div>
      ) 
      
      /* Case 2: Đang generate feedback */
      : isGeneratingFeedback ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <Loader2Icon className="w-12 h-12 animate-spin mb-4 text-blue-600" />
          <p className="text-sm font-medium">Đang tạo feedback tự động...</p>
          <p className="text-xs text-gray-400 mt-2">Vui lòng đợi 2-3 giây</p>
          
          {/* Progress indicator */}
          <div className="mt-4 w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 animate-pulse" style={{width: '70%'}}></div>
          </div>
        </div>
      ) 
      
      /* Case 3: Có AI suggestion (chưa apply) */
      : aiSuggestion ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200">
            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-lg">💡</span>
              Gợi ý từ AI:
            </p>
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm max-h-64 overflow-y-auto">
              {aiSuggestion}
            </div>
          </div>

          <button
            onClick={applySuggestion}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium shadow-lg flex items-center justify-center gap-2"
          >
            <CheckCircleIcon className="w-5 h-5" />
            Áp dụng feedback này
          </button>

          <button
            onClick={() => generateAiFeedback(currentQuestionIndex)}
            disabled={isGeneratingFeedback}
            className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔄 Tạo lại
          </button>

          <button
            onClick={() => setAiSuggestion('')}
            className="w-full px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Bỏ qua
          </button>
        </div>
      ) 
      
      /* Case 4: Chưa đủ điều kiện để generate */
      : currentQuestionIndex !== null && !shouldGenerateFeedback(questions[currentQuestionIndex]) ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 px-4">
          <span className="text-5xl mb-4">📝</span>
          <p className="text-center text-sm font-medium text-gray-600 mb-4">
            Cần thêm thông tin để tạo feedback
          </p>
          
          {/* Checklist */}
          <div className="w-full bg-gray-50 rounded-lg p-4 space-y-2 text-xs">
            <div className={`flex items-center gap-2 ${
              questions[currentQuestionIndex]?.question?.trim().length > 20 
                ? 'text-green-600' 
                : 'text-gray-400'
            }`}>
              {questions[currentQuestionIndex]?.question?.trim().length > 20 ? '✅' : '⭕'}
              <span>Câu hỏi đủ dài (tối thiểu 20 ký tự)</span>
            </div>
            
            <div className={`flex items-center gap-2 ${
              questions[currentQuestionIndex]?.options?.filter(opt => opt.optionText.trim()).length >= 2
                ? 'text-green-600' 
                : 'text-gray-400'
            }`}>
              {questions[currentQuestionIndex]?.options?.filter(opt => opt.optionText.trim()).length >= 2 ? '✅' : '⭕'}
              <span>Có ít nhất 2 lựa chọn</span>
            </div>
            
            <div className={`flex items-center gap-2 ${
              questions[currentQuestionIndex]?.options?.some(opt => opt.isCorrect)
                ? 'text-green-600' 
                : 'text-gray-400'
            }`}>
              {questions[currentQuestionIndex]?.options?.some(opt => opt.isCorrect) ? '✅' : '⭕'}
              <span>Đã chọn đáp án đúng</span>
            </div>
          </div>
          
          <p className="text-center text-xs text-gray-500 mt-4">
            Hoàn thành các mục trên để AI tự động gợi ý feedback
          </p>
        </div>
      )
      
      /* Case 5: Empty state (chưa chọn câu hỏi) */
      : (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 px-6">
          <span className="text-6xl mb-4">💭</span>
          <p className="text-center text-sm font-medium text-gray-600 mb-2">
            AI đang chờ bạn soạn câu hỏi
          </p>
          <p className="text-center text-xs text-gray-500 leading-relaxed">
            Gõ câu hỏi và chọn đáp án đúng,<br/>
            AI sẽ tự động gợi ý feedback cho bạn sau 3 giây!
          </p>
          
          {/* Mini tutorial */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4 w-full text-xs text-gray-700">
            <p className="font-semibold mb-2">🎯 Cách hoạt động:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Nhập nội dung câu hỏi</li>
              <li>Thêm các lựa chọn trả lời</li>
              <li>Đánh dấu đáp án đúng</li>
              <li>AI tự động tạo feedback</li>
            </ol>
          </div>
        </div>
      )}
    </div>

    {/* Footer - Usage info (optional) */}
    {currentQuestionIndex !== null && (
      <div className="border-t p-3 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Câu hỏi #{currentQuestionIndex + 1}</span>
          {feedbackStatus[currentQuestionIndex]?.timestamp && (
            <span className="text-gray-400">
              Cập nhật {new Date(feedbackStatus[currentQuestionIndex].timestamp).toLocaleTimeString('vi-VN')}
            </span>
          )}
        </div>
      </div>
    )}
  </div>
</div>

{/* Toggle Sidebar Button (khi đóng) */}
{!sidebarOpen && (
  <button
    onClick={() => setSidebarOpen(true)}
    className="fixed right-4 bottom-4 p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform z-40 animate-bounce"
    title="Mở AI Feedback"
  >
    <span className="text-2xl">🤖</span>
    
    {/* Badge thông báo nếu có suggestion */}
    {aiSuggestion && (
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
    )}
  </button>
)}
    </div>
  );
};

export default MultipleChoiceForm;