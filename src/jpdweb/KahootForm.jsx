import React, { useState, useEffect, useRef } from 'react';
import { 
  PlusCircleIcon, Trash2Icon, Loader2Icon, CheckCircleIcon, 
  XIcon, LightbulbIcon, TriangleDashedIcon 
} from 'lucide-react';
import { Markdown } from 'react-bootstrap-icons';
import { generateFeedBack } from './api/ApiConnect';

const MixedQuestionForm = ({ onSubmit, initialData, onDelete }) => {
  const [questions, setQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // AI Feedback States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);  
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState({});
  
  const hasLoadedInitialData = useRef(false);
  const debounceTimerRef = useRef(null);
  const questionHashRef = useRef({});
  const lastGeneratedRef = useRef(0);

  // Load initial data
  useEffect(() => {
    if (initialData && Array.isArray(initialData) && initialData.length > 0 && !hasLoadedInitialData.current) {
      const loadedQuestions = initialData.map(item => {
        if (item.typeOfContent === 'MULTIPLE_CHOICE') {
          return {
            mcId: item.mcId || null,
            type: 'MULTIPLE_CHOICE',
            question: item.questionText || '',
            feedBack: item.feedback || '',
            options: item.options?.map(opt => ({
              mcoId: opt.mcoId || null,
              optionText: opt.optionText || '',
              isCorrect: opt.correct || false
            })) || []
          };
        } else {
          return {
            mcId: item.mcId || null,
            type: 'GAPFILL',
            question: item.questionText || '',
            feedBack: item.feedback || '',
            answers: item.answers?.map(ans => ({ 
              answerId: ans.answerId || null,
              answer: ans.answer || ''
            })) || []
          };
        }
      });
      
      setQuestions(loadedQuestions);
      hasLoadedInitialData.current = true;
    }
  }, [initialData]);

  // Hash computation
  const computeQuestionHash = (question) => {
    if (question.type === 'MULTIPLE_CHOICE') {
      const text = question.question + 
                   question.options.map(o => o.optionText + o.isCorrect).join("|");
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        hash = (hash << 5) - hash + text.charCodeAt(i);
        hash |= 0;
      }
      return hash;
    } else {
      const text = question.question + question.answers.map(a => a.answer).join("|");
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        hash = (hash << 5) - hash + text.charCodeAt(i);
        hash |= 0;
      }
      return hash;
    }
  };

  // Cooldown check
  const canGenerateNow = () => {
    const now = Date.now();
    const COOLDOWN_MS = 10000;
    if (now - lastGeneratedRef.current < COOLDOWN_MS) {
      console.warn("Cooldown active...");
      return false;
    }
    lastGeneratedRef.current = now;
    return true;
  };

  // Validation for AI generation
  const shouldGenerateFeedback = (question) => {
    if (!question) return false;
    
    const hasValidQuestion = question.question.trim().length > 20;
    const hasNoFeedback = !question.feedBack || question.feedBack.trim().length === 0;
    
    if (question.type === 'MULTIPLE_CHOICE') {
      const hasEnoughOptions = question.options.filter(opt => opt.optionText.trim()).length >= 2;
      const hasCorrectAnswer = question.options.some(opt => opt.isCorrect);
      return hasValidQuestion && hasEnoughOptions && hasCorrectAnswer && hasNoFeedback;
    } else {
      const hasAnswers = question.answers.length > 0;
      const allAnswersFilled = question.answers.every(ans => ans.answer.trim().length > 0);
      const hasGaps = detectGaps(question.question) > 0;
      return hasValidQuestion && hasAnswers && allAnswersFilled && hasNoFeedback && hasGaps;
    }
  };

  // Detect gaps for Gap Fill
  const detectGaps = (questionText) => {
    const gapPatterns = [
      /_{3,}/g,
      /\[blank\d*\]/gi,
      /\{gap\d*\}/gi,
      /\(\s*\)/g
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

  // Generate AI Feedback
  const generateAiFeedback = async (questionIndex) => {
    const question = questions[questionIndex];
    if (!shouldGenerateFeedback(question)) return;

    const questionHash = computeQuestionHash(question);
    if (questionHashRef.current[questionIndex] === questionHash) {
      console.log("No change detected, skipping...");
      return;
    }

    if (!canGenerateNow()) {
      console.log("Cooldown active, skipping...");
      return;
    }

    setIsGeneratingFeedback(true);
    try {
      let data;
      
      if (question.type === 'MULTIPLE_CHOICE') {
        const correctOption = question.options.find(opt => opt.isCorrect);
        data = {
          question: question.question,
          answer: correctOption.optionText
        };
      } else {
        const answersText = question.answers.map((ans, idx) => 
          `Gap ${idx + 1}: ${ans.answer}`
        ).join(', ');
        
        data = {
          question: question.question,
          answer: answersText
        };
      }

      const response = await generateFeedBack(data);
      setAiSuggestion(response.data || response);

      questionHashRef.current[questionIndex] = questionHash;

      setFeedbackStatus(prev => ({
        ...prev,
        [questionIndex]: { generated: true, timestamp: Date.now() }
      }));

      if (!sidebarOpen) setSidebarOpen(true);

    } catch (error) {
      console.error("Error generating feedback:", error);
      setAiSuggestion("Không thể tạo feedback tự động. Vui lòng thử lại.");
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  // Auto-generate with debounce
  useEffect(() => {
    if (currentQuestionIndex === null) return;
    
    const question = questions[currentQuestionIndex];
    
    if (!shouldGenerateFeedback(question)) return;
    if (feedbackStatus[currentQuestionIndex]?.generated) return;

    const questionHash = computeQuestionHash(question);
    const previousHash = questionHashRef.current[currentQuestionIndex];
    if (questionHash === previousHash) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      await generateAiFeedback(currentQuestionIndex);
    }, 3000);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [questions, currentQuestionIndex, feedbackStatus]);

  // Apply AI suggestion
  const applySuggestion = () => {
    if (currentQuestionIndex !== null && aiSuggestion) {
      updateQuestion(currentQuestionIndex, 'feedBack', aiSuggestion);
      setAiSuggestion('');
      
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

  // Force regenerate
  const forceRegenerateFeedback = async (questionIndex) => {
    setFeedbackStatus(prev => ({
      ...prev,
      [questionIndex]: { generated: false }
    }));
    delete questionHashRef.current[questionIndex];
    await generateAiFeedback(questionIndex);
  };

  // Add question (with type selection)
  const addQuestion = (type) => {
    if (type === 'MULTIPLE_CHOICE') {
      const newQuestion = {
        mcId: null,
        type: 'MULTIPLE_CHOICE',
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
    } else {
      const newQuestion = {
        mcId: null,
        type: 'GAPFILL',
        question: '',
        feedBack: '',
        answers: []
      };
      setQuestions([...questions, newQuestion]);
    }
  };

  // Remove question
  const removeQuestion = async (questionIndex) => {
    const question = questions[questionIndex];
    if (!question) return;

    const confirmed = window.confirm("Bạn có chắc muốn xóa câu hỏi này?");
    if (!confirmed) return;

    try {
      if (question.mcId) {
        await onDelete(question.mcId);
      }
      setQuestions(prev => prev.filter((_, i) => i !== questionIndex));
      
      if (currentQuestionIndex === questionIndex) {
        setCurrentQuestionIndex(null);
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Xóa thất bại, vui lòng thử lại.");
    }
  };

  // Update question
  const updateQuestion = (questionIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex][field] = value;
    
    // Special handling for Gap Fill question text
    if (field === 'question' && newQuestions[questionIndex].type === 'GAPFILL') {
      const gapCount = detectGaps(value);
      const currentAnswers = newQuestions[questionIndex].answers;
      
      if (gapCount > currentAnswers.length) {
        const newAnswers = [...currentAnswers];
        for (let i = currentAnswers.length; i < gapCount; i++) {
          newAnswers.push({ answerId: null, answer: '' });
        }
        newQuestions[questionIndex].answers = newAnswers;
      } else if (gapCount < currentAnswers.length) {
        newQuestions[questionIndex].answers = currentAnswers.slice(0, gapCount);
      }
    }
    
    if (field === 'feedBack' && !value.trim()) {
      setFeedbackStatus(prev => ({
        ...prev,
        [questionIndex]: { generated: false, hasFeedback: false }
      }));
      delete questionHashRef.current[questionIndex];
    }
    
    if (field === 'question') {
      setCurrentQuestionIndex(questionIndex);
    }
    
    setQuestions(newQuestions);
  };

  // Multiple Choice specific functions
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

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options.length > 2) {
      newQuestions[questionIndex].options.splice(optionIndex, 1);
      setQuestions(newQuestions);
    }
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex][field] = value;
    
    if (field === 'isCorrect' && value === true) {
      newQuestions[questionIndex].options.forEach((option, i) => {
        if (i !== optionIndex) {
          option.isCorrect = false;
        }
      });
      setCurrentQuestionIndex(questionIndex);
    }
    
    setQuestions(newQuestions);
  };

  // Gap Fill specific functions
  const addAnswer = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.push({ 
      answer: '',
      answerId: null
    });
    setQuestions(newQuestions);
  };

  const removeAnswer = (questionIndex, answerIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].answers.length > 1) {
      newQuestions[questionIndex].answers.splice(answerIndex, 1);
      setQuestions(newQuestions);
    }
  };

  const updateAnswer = (questionIndex, answerIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex].answer = value;
    setQuestions(newQuestions);
    setCurrentQuestionIndex(questionIndex);
  };

  // Validation
  const validateForm = () => {
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      if (!question.question.trim()) {
        alert(`Câu hỏi ${i + 1}: Vui lòng nhập nội dung câu hỏi!`);
        return false;
      }

      if (question.type === 'MULTIPLE_CHOICE') {
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
      } else {
        if (question.answers.length === 0) {
          alert(`Câu hỏi ${i + 1}: Cần có ít nhất 1 đáp án!`);
          return false;
        }

        const emptyAnswers = question.answers.filter(ans => !ans.answer.trim());
        if (emptyAnswers.length > 0) {
          alert(`Câu hỏi ${i + 1}: Tất cả đáp án cần được điền đầy đủ!`);
          return false;
        }

        const gapCount = detectGaps(question.question);
        if (gapCount === 0) {
          alert(`Câu hỏi ${i + 1}: Cần có ít nhất 1 chỗ trống!`);
          return false;
        }
      }
    }
    return true;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (questions.length === 0) {
      alert('Vui lòng thêm ít nhất 1 câu hỏi!');
      return;
    }
    
    if (!validateForm()) return;

    const validQuestions = questions.map(q => {
      if (q.type === 'MULTIPLE_CHOICE') {
        return {
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
        };
      } else {
        return {
          mcId: q.mcId || -1,
          typeOfContent: "GAPFILL",
          questionText: q.question.trim(),
          feedback: q.feedBack.trim(),
          answers: q.answers
            .filter(ans => ans.answer.trim() !== '')
            .map(ans => ({
              answerId: null,
              answer: ans.answer.trim()
            }))
        };
      }
    });

    console.log('Submitting mixed questions:', validQuestions);
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'mr-96' : ''}`}>
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
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
                Tạo Câu Hỏi Mixed (Multiple Choice + Gap Fill)
              </h2>
              <p className="text-gray-600">
                Kết hợp nhiều loại câu hỏi trong cùng một bộ đề
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Question List */}
              {questions.map((question, questionIndex) => (
                <div 
                  key={questionIndex}
                  className={`p-6 border-2 rounded-xl transition-all ${
                    question.type === 'MULTIPLE_CHOICE'
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50'
                      : 'bg-gradient-to-br from-green-50 to-emerald-50'
                  } ${
                    currentQuestionIndex === questionIndex 
                      ? question.type === 'MULTIPLE_CHOICE' 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-green-500 ring-2 ring-green-200'
                      : 'border-gray-200'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        question.type === 'MULTIPLE_CHOICE'
                          ? 'bg-blue-500 text-white'
                          : 'bg-green-500 text-white'
                      }`}>
                        {question.type === 'MULTIPLE_CHOICE' ? '📝 Multiple Choice' : '✍️ Gap Fill'}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800">
                        Câu #{questionIndex + 1}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(questionIndex)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                      title="Xóa câu hỏi"
                    >
                      <Trash2Icon className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Question Text */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nội dung câu hỏi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                      onFocus={() => setCurrentQuestionIndex(questionIndex)}
                      placeholder={
                        question.type === 'MULTIPLE_CHOICE'
                          ? 'Nhập nội dung câu hỏi trắc nghiệm...'
                          : 'Nhập câu hỏi với chỗ trống. Ví dụ: The _____ is shining brightly.'
                      }
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    
                    {question.type === 'GAPFILL' && question.question && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Xem trước:</p>
                        <div 
                          className="text-gray-800"
                          dangerouslySetInnerHTML={{ __html: renderQuestionPreview(question.question) }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Multiple Choice Options */}
                  {question.type === 'MULTIPLE_CHOICE' && (
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
                  )}

                  {/* Gap Fill Answers */}
                  {question.type === 'GAPFILL' && (
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
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {question.answers.map((answer, answerIndex) => (
                            <div key={answerIndex} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white">
                              <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {answerIndex + 1}
                              </div>
                              
                              <input
                                type="text"
                                value={answer.answer}
                                onChange={(e) => updateAnswer(questionIndex, answerIndex, e.target.value)}
                                placeholder={`Đáp án ${answerIndex + 1}...`}
                                className="flex-1 px-3 py-2 border-0 bg-transparent focus:outline-none"
                              />

                              {question.answers.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeAnswer(questionIndex, answerIndex)}
                                  className="flex-shrink-0 p-1 text-red-400 hover:text-red-600"
                                >
                                  <TriangleDashedIcon className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Feedback */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giải thích (tùy chọn)
                    </label>
                    <textarea
                      value={question.feedBack}
                      onChange={(e) => updateQuestion(questionIndex, 'feedBack', e.target.value)}
                      placeholder="Nhập giải thích cho câu trả lời..."
                      rows="2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              ))}

              {/* Add Question Buttons */}
              {questions.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-600 mb-6">Chọn loại câu hỏi để bắt đầu</p>
                  <div className="flex gap-4 justify-center">
                    <button
                      type="button"
                      onClick={() => addQuestion('MULTIPLE_CHOICE')}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      📝 Thêm Multiple Choice
                    </button>
                    <button
                      type="button"
                      onClick={() => addQuestion('GAPFILL')}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      ✍️ Thêm Gap Fill
                    </button>
                  </div>
                </div>
              )}

              {/* Controls */}
              {questions.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => addQuestion('MULTIPLE_CHOICE')}
                      className="flex items-center gap-2 px-6 py-3 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 font-medium"
                    >
                      <PlusCircleIcon className="w-5 h-5" />
                      Multiple Choice
                    </button>
                    <button
                      type="button"
                      onClick={() => addQuestion('GAPFILL')}
                      className="flex items-center gap-2 px-6 py-3 text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 font-medium"
                    >
                      <PlusCircleIcon className="w-5 h-5" />
                      Gap Fill
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setQuestions([]);
                        setCurrentQuestionIndex(null);
                        setSidebarOpen(false);
                        setAiSuggestion('');
                      }}
                      className="px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Làm mới
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 disabled:opacity-50 font-medium"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2Icon className="animate-spin h-5 w-5" />
                          Đang gửi...
                        </span>
                      ) : (
                        'Gửi Tất Cả Câu Hỏi'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                <p className="font-semibold mb-2">💡 Hướng dẫn sử dụng:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Multiple Choice:</strong> Cần ít nhất 2 lựa chọn và đúng 1 đáp án đúng</li>
                  <li><strong>Gap Fill:</strong> Dùng _____, [blank], {'{gap}'}, hoặc ( ) để tạo chỗ trống</li>
                  <li>🤖 AI sẽ tự động gợi ý feedback khi bạn hoàn thành câu hỏi</li>
                  <li>Có thể kết hợp nhiều loại câu hỏi trong cùng một bộ đề</li>
                </ul>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* AI Feedback Sidebar */}
      <div 
        className={`fixed right-0 top-0 h-full w-96 bg-white border-l-2 border-gray-200 shadow-2xl transform transition-transform duration-300 z-50 ${
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
            <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-white/20 rounded-full">
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {currentQuestionIndex !== null && 
             questions[currentQuestionIndex]?.feedBack?.trim() && 
             feedbackStatus[currentQuestionIndex]?.hasFeedback ? (
              <div className="space-y-4">
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    Feedback đã được tạo
                  </p>
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
                  className="w-full px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium disabled:opacity-50"
                >
                  🔄 Tạo feedback mới
                </button>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                  <p className="font-semibold mb-1">💡 Lưu ý:</p>
                  <p>Tạo lại sẽ thay thế feedback hiện tại. Hành động này không thể hoàn tác.</p>
                </div>
              </div>
            ) : isGeneratingFeedback ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Loader2Icon className="w-12 h-12 animate-spin mb-4 text-blue-600" />
                <p className="text-sm font-medium">Đang tạo feedback tự động...</p>
                <p className="text-xs text-gray-400 mt-2">Vui lòng đợi 2-3 giây</p>
                
                <div className="mt-4 w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 animate-pulse" style={{width: '70%'}}></div>
                </div>
              </div>
            ) : aiSuggestion ? (
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
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 font-medium shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  Áp dụng feedback này
                </button>

                <button
                  onClick={() => generateAiFeedback(currentQuestionIndex)}
                  disabled={isGeneratingFeedback}
                  className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                >
                  🔄 Tạo lại
                </button>

                <button
                  onClick={() => setAiSuggestion('')}
                  className="w-full px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  Bỏ qua
                </button>
              </div>
            ) : currentQuestionIndex !== null && !shouldGenerateFeedback(questions[currentQuestionIndex]) ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 px-4">
                <span className="text-5xl mb-4">📝</span>
                <p className="text-center text-sm font-medium text-gray-600 mb-4">
                  Cần thêm thông tin để tạo feedback
                </p>
                
                <div className="w-full bg-gray-50 rounded-lg p-4 space-y-2 text-xs">
                  {questions[currentQuestionIndex]?.type === 'MULTIPLE_CHOICE' ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <div className={`flex items-center gap-2 ${
                        questions[currentQuestionIndex]?.question?.trim().length > 20 
                          ? 'text-green-600' 
                          : 'text-gray-400'
                      }`}>
                        {questions[currentQuestionIndex]?.question?.trim().length > 20 ? '✅' : '⭕'}
                        <span>Câu hỏi đủ dài (tối thiểu 20 ký tự)</span>
                      </div>
                      
                      <div className={`flex items-center gap-2 ${
                        detectGaps(questions[currentQuestionIndex]?.question || '') > 0 
                          ? 'text-green-600' 
                          : 'text-gray-400'
                      }`}>
                        {detectGaps(questions[currentQuestionIndex]?.question || '') > 0 ? '✅' : '⭕'}
                        <span>Có ít nhất 1 chỗ trống</span>
                      </div>
                      
                      <div className={`flex items-center gap-2 ${
                        questions[currentQuestionIndex]?.answers?.length > 0 && 
                        questions[currentQuestionIndex]?.answers.every(a => a.answer.trim())
                          ? 'text-green-600' 
                          : 'text-gray-400'
                      }`}>
                        {questions[currentQuestionIndex]?.answers?.length > 0 && 
                         questions[currentQuestionIndex]?.answers.every(a => a.answer.trim()) ? '✅' : '⭕'}
                        <span>Tất cả đáp án đã điền</span>
                      </div>
                    </>
                  )}
                </div>
                
                <p className="text-center text-xs text-gray-500 mt-4">
                  Hoàn thành các mục trên để AI tự động gợi ý feedback
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 px-6">
                <span className="text-6xl mb-4">💭</span>
                <p className="text-center text-sm font-medium text-gray-600 mb-2">
                  AI đang chờ bạn soạn câu hỏi
                </p>
                <p className="text-center text-xs text-gray-500 leading-relaxed">
                  Tạo câu hỏi Multiple Choice hoặc Gap Fill,<br/>
                  AI sẽ tự động gợi ý feedback sau 3 giây!
                </p>
                
                <div className="mt-6 bg-blue-50 rounded-lg p-4 w-full text-xs text-gray-700">
                  <p className="font-semibold mb-2">🎯 Cách hoạt động:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Chọn loại câu hỏi (Multiple Choice/Gap Fill)</li>
                    <li>Nhập nội dung câu hỏi</li>
                    <li>Thêm các đáp án/lựa chọn</li>
                    <li>AI tự động tạo feedback giải thích</li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {currentQuestionIndex !== null && (
            <div className="border-t p-3 bg-gray-50">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>
                  Câu #{currentQuestionIndex + 1} - {
                    questions[currentQuestionIndex]?.type === 'MULTIPLE_CHOICE' 
                      ? 'Multiple Choice' 
                      : 'Gap Fill'
                  }
                </span>
                {feedbackStatus[currentQuestionIndex]?.timestamp && (
                  <span className="text-gray-400">
                    {new Date(feedbackStatus[currentQuestionIndex].timestamp).toLocaleTimeString('vi-VN')}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Sidebar Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed right-4 bottom-4 p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform z-40 animate-bounce"
          title="Mở AI Feedback"
        >
          <span className="text-2xl">🤖</span>
          
          {aiSuggestion && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
          )}
        </button>
      )}
    </div>
  );
};

export default MixedQuestionForm;