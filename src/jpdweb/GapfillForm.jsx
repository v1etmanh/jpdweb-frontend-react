import React, { useState, useEffect, useRef } from 'react';
import { LightbulbIcon, PlusCircleIcon, Trash2Icon, TriangleDashedIcon, XIcon, Loader2Icon, CheckCircleIcon } from 'lucide-react';
import { Markdown } from 'react-bootstrap-icons';
import { generateFeedBack } from './api/ApiConnect';

const GapFillForm = ({ onSubmit, initialData, onDelete }) => {
  const [questions, setQuestions] = useState([
    {
      mcId: null,
      question: '',
      feedBack: '',
      answers: []
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 🎯 AI Feedback States
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
      const loadedQuestions = initialData.map(item => ({
        mcId: item.mcId || null,
        question: item.questionText || '',
        feedBack: item.feedback || '',
        answers: item.answers?.map(ans => ({ 
          answerId: ans.answerId || null,
          answer: ans.answer || ''
        })) || []
      }));
      
      setQuestions(loadedQuestions);
      hasLoadedInitialData.current = true;
    }
  }, [initialData]);

  // 🔧 Hash computation
  const computeQuestionHash = (question) => {
    const text = question.question + question.answers.map(a => a.answer).join("|");
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  };

  // 🔧 Cooldown check
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

  // 🔧 Validation for AI generation
  const shouldGenerateFeedback = (question) => {
    if (!question) return false;
    
    const hasValidQuestion = question.question.trim().length > 20;
    const hasAnswers = question.answers.length > 0;
    const allAnswersFilled = question.answers.every(ans => ans.answer.trim().length > 0);
    const hasNoFeedback = !question.feedBack || question.feedBack.trim().length === 0;
    const hasGaps = detectGaps(question.question) > 0;
    
    return hasValidQuestion && hasAnswers && allAnswersFilled && hasNoFeedback && hasGaps;
  };

  // 🤖 Generate AI Feedback
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
      // Format: câu hỏi + đáp án cho gap fill
      const answersText = question.answers.map((ans, idx) => 
        `Gap ${idx + 1}: ${ans.answer}`
      ).join(', ');

      const data = {
        question: question.question,
        answer: answersText
      };

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

  // 🔥 Auto-generate với debounce
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

  // 📝 Apply AI suggestion
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

  // 🔄 Force regenerate
  const forceRegenerateFeedback = async (questionIndex) => {
    setFeedbackStatus(prev => ({
      ...prev,
      [questionIndex]: { generated: false }
    }));
    delete questionHashRef.current[questionIndex];
    await generateAiFeedback(questionIndex);
  };

  // Tự động phát hiện gaps
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

  // Cập nhật câu hỏi
  const updateQuestion = (questionIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex][field] = value;
    
    if (field === 'question') {
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
      
      // Track current question for AI
      setCurrentQuestionIndex(questionIndex);
    }
    
    // Reset feedback status if user deletes feedback
    if (field === 'feedBack' && !value.trim()) {
      setFeedbackStatus(prev => ({
        ...prev,
        [questionIndex]: { generated: false, hasFeedback: false }
      }));
      delete questionHashRef.current[questionIndex];
    }
    
    setQuestions(newQuestions);
  };

  // Thêm câu hỏi
  const addQuestion = () => {
    const newQuestion = {
      mcId: null,
      question: '',
      feedBack: '',
      answers: []
    };
    setQuestions([...questions, newQuestion]);
  };

  // Xóa câu hỏi
  const removeQuestion = async (questionIndex) => {
    const gapf = questions[questionIndex];
    if (!gapf) return;

    const confirmed = window.confirm("Bạn có chắc muốn xóa câu hỏi này?");
    if (!confirmed) return;

    try {
      if (gapf.mcId) {
        await onDelete(gapf.mcId);
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

  // Cập nhật answer
  const updateAnswer = (questionIndex, answerIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex].answer = value;
    setQuestions(newQuestions);
    
    // Trigger AI when answer changes
    setCurrentQuestionIndex(questionIndex);
  };

  // Thêm answer
  const addAnswer = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.push({ 
      answer: '',
      answerId: null
    });
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
      
      if (!question.question.trim()) {
        alert(`Câu hỏi ${i + 1}: Vui lòng nhập nội dung câu hỏi!`);
        return false;
      }

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
    return true;
  };

  // Reset form
  const resetForm = () => {
    setQuestions([{
      mcId: null,
      question: '',
      feedBack: '',
      answers: []
    }]);
    hasLoadedInitialData.current = false;
    setCurrentQuestionIndex(null);
    setSidebarOpen(false);
    setAiSuggestion('');
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const validQuestions = questions.map(q => ({
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
    }));

    setIsSubmitting(true);
    
    try {
      await onSubmit(validQuestions);
      resetForm();
    } catch (error) {
      console.error('Error submitting questions:', error);
      alert('Có lỗi xảy ra khi gửi câu hỏi!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview
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
                Thêm Câu Hỏi Điền Từ (Gap Fill)
              </h2>
              <p className="text-gray-600">
                Tạo các câu hỏi điền từ với chỗ trống để học sinh hoàn thiện
              </p>
            </div>

            {/* Hướng dẫn */}
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
                    <p className="mt-2 text-green-700 font-medium">🤖 AI sẽ tự động gợi ý feedback khi bạn hoàn thành câu hỏi!</p>
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
                    className={`p-6 border-2 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 transition-all ${
                      currentQuestionIndex === questionIndex ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-800">
                          Câu hỏi #{questionIndex + 1}
                        </h3>
                        {gapCount > 0 && question.answers.length !== gapCount && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                            ⚠️ {question.answers.length} đáp án / {gapCount} chỗ trống
                          </span>
                        )}
                      </div>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(questionIndex)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                        >
                          <Trash2Icon className="w-6 h-6" />
                        </button>
                      )}
                    </div>

                    {/* Question */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nội dung câu hỏi <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={question.question}
                        onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                        onFocus={() => setCurrentQuestionIndex(questionIndex)}
                        placeholder="Nhập câu hỏi với chỗ trống. Ví dụ: The _____ is shining brightly today."
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      />
                      
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

                    {/* Answers */}
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      />
                    </div>
                  </div>
                );
              })}

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t">
                <button
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center gap-2 px-6 py-3 text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 font-medium"
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  Thêm Câu Hỏi
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Làm mới
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
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
            </form>
          </div>
        </div>
      </div>

      {/* 🎯 AI Feedback Sidebar */}
      <div 
        className={`fixed right-0 top-0 h-full w-96 bg-white border-l-2 border-gray-200 shadow-2xl transform transition-transform duration-300 z-50 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-600 to-emerald-600 text-white">
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
                  className="w-full px-4 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 font-medium disabled:opacity-50"
                >
                  🔄 Tạo feedback mới
                </button>
              </div>
            ) : isGeneratingFeedback ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Loader2Icon className="w-12 h-12 animate-spin mb-4 text-green-600" />
                <p className="text-sm font-medium">Đang tạo feedback tự động...</p>
              </div>
            ) : aiSuggestion ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">💡 Gợi ý từ AI:</p>
                  <div className="text-gray-800 leading-relaxed text-sm max-h-64 overflow-y-auto">
                    {aiSuggestion}
                  </div>
                </div>

                <button
                  onClick={applySuggestion}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium shadow-lg flex items-center justify-center gap-2"
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
              </div>
            ) : currentQuestionIndex !== null && !shouldGenerateFeedback(questions[currentQuestionIndex]) ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 px-4">
                <span className="text-5xl mb-4">📝</span>
                <p className="text-center text-sm font-medium text-gray-600 mb-4">
                  Cần thêm thông tin để tạo feedback
                </p>
                
                <div className="w-full bg-gray-50 rounded-lg p-4 space-y-2 text-xs">
                  <div className={questions[currentQuestionIndex]?.question?.trim().length > 20 ? 'text-green-600' : 'text-gray-400'}>
                    {questions[currentQuestionIndex]?.question?.trim().length > 20 ? '✅' : '⭕'}
                    <span className > Câu hỏi đủ dài (tối thiểu 20 ký tự)</span>
                  </div>
                  
                  <div className={detectGaps(questions[currentQuestionIndex]?.question || '') > 0 ? 'text-green-600' : 'text-gray-400'}>
                    {detectGaps(questions[currentQuestionIndex]?.question || '') > 0 ? '✅' : '⭕'}
                    <span> Có ít nhất 1 chỗ trống</span>
                  </div>
                  
                  <div className={questions[currentQuestionIndex]?.answers?.length > 0 && questions[currentQuestionIndex]?.answers.every(a => a.answer.trim()) ? 'text-green-600' : 'text-gray-400'}>
                    {questions[currentQuestionIndex]?.answers?.length > 0 && questions[currentQuestionIndex]?.answers.every(a => a.answer.trim()) ? '✅' : '⭕'}
                    <span> Tất cả đáp án đã điền</span>
                  </div>
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
                  Nhập câu hỏi với chỗ trống và điền đáp án,<br/>
                  AI sẽ tự động gợi ý feedback sau 3 giây!
                </p>
                
                <div className="mt-6 bg-green-50 rounded-lg p-4 w-full text-xs text-gray-700">
                  <p className="font-semibold mb-2">🎯 Cách hoạt động:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Nhập câu hỏi với chỗ trống (_____)</li>
                    <li>Điền đáp án cho các chỗ trống</li>
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
                <span>Câu hỏi #{currentQuestionIndex + 1}</span>
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

      {/* Toggle Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed right-4 bottom-4 p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform z-40"
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

export default GapFillForm;