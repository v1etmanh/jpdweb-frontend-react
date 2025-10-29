import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Image, Check, X, Loader2, Upload, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { saveImg } from './api/ApiConnect';

const MIN_OPTIONS = 2;
const DEFAULT_OPTIONS_COUNT = 4;

const ListeningChoiceForm = ({ onSubmit, initialData, onDelete }) => {
  const [questions, setQuestions] = useState([createEmptyQuestion()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingIndexes, setUploadingIndexes] = useState(new Set());
  const [previewIndexes, setPreviewIndexes] = useState(new Set());
  const hasLoadedInitialData = useRef(false);

  // Helper function to create empty question
  function createEmptyQuestion() {
    return {
      mcId: null,
      question: '',
      imgUrl: '',
      options: Array(DEFAULT_OPTIONS_COUNT).fill(null).map(() => ({
        optionId: null,
        optionText: '',
        correct: false
      }))
    };
  }

  // Load initial data
  useEffect(() => {
    if (initialData && Array.isArray(initialData) && initialData.length > 0 && !hasLoadedInitialData.current) {
      const loadedQuestions = initialData.map(item => {
        const loadedOptions = item.options || [];
        const normalizedOptions = [
          ...loadedOptions.map(opt => ({
            optionId: opt.optionId || null,
            optionText: opt.optionText || '',
            correct: opt.correct || false
          })),
          ...Array(Math.max(0, DEFAULT_OPTIONS_COUNT - loadedOptions.length)).fill(null).map(() => ({
            optionId: null,
            optionText: '',
            correct: false
          }))
        ];

        return {
          mcId: item.mcId || null,
          question: item.question || '',
          imgUrl: item.imgUrl || '',
          options: normalizedOptions
        };
      });
      setQuestions(loadedQuestions);
      hasLoadedInitialData.current = true;
    }
  }, [initialData]);

  // Add new question
  const addQuestion = () => {
    setQuestions(prev => [...prev, createEmptyQuestion()]);
  };

  // Remove question
  const removeQuestion = async (index) => {
    const question = questions[index];
    if (!question) return;

    const confirmed = window.confirm("Bạn có chắc muốn xóa câu hỏi này?");
    if (!confirmed) return;

    try {
      if (question.mcId && onDelete) {
        await onDelete(question.mcId);
      }
      setQuestions(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Lỗi khi xóa câu hỏi:", err);
      alert("Xóa thất bại, vui lòng thử lại.");
    }
  };

  // Update question field
  const updateQuestion = (questionIndex, field, value) => {
    setQuestions(prev => prev.map((q, i) =>
      i === questionIndex ? { ...q, [field]: value } : q
    ));
  };

  // Update option field
  const updateOption = (questionIndex, optionIndex, field, value) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i === questionIndex) {
        const newOptions = q.options.map((opt, j) =>
          j === optionIndex ? { ...opt, [field]: value } : opt
        );
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  // Set correct answer (only one correct answer per question)
  const setCorrectAnswer = (questionIndex, optionIndex) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i === questionIndex) {
        const newOptions = q.options.map((opt, j) => ({
          ...opt,
          correct: j === optionIndex
        }));
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  // Add option
  const addOption = (questionIndex) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i === questionIndex) {
        return {
          ...q,
          options: [...q.options, { optionId: null, optionText: '', correct: false }]
        };
      }
      return q;
    }));
  };

  // Remove option
  const removeOption = (questionIndex, optionIndex) => {
    const question = questions[questionIndex];
    if (question.options.length <= MIN_OPTIONS) {
      alert(`Phải có ít nhất ${MIN_OPTIONS} lựa chọn!`);
      return;
    }

    setQuestions(prev => prev.map((q, i) => {
      if (i === questionIndex) {
        return {
          ...q,
          options: q.options.filter((_, j) => j !== optionIndex)
        };
      }
      return q;
    }));
  };

  // Handle image upload
  const handleImageUpload = async (index, file) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    setUploadingIndexes(prev => new Set([...prev, index]));

    try {
      const formData = new FormData();
      formData.append('img', file);
      const response = await saveImg(formData);
      const downloadUrl = response.data;

      if (!downloadUrl) {
        throw new Error('Không nhận được URL từ server');
      }

      updateQuestion(index, 'imgUrl', downloadUrl);
      console.log(`Ảnh đã upload thành công: ${downloadUrl}`);
      
    } catch (error) {
      console.error('Lỗi khi upload ảnh:', error);
      alert('Upload ảnh thất bại. Vui lòng thử lại.');
    } finally {
      setUploadingIndexes(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  // Remove image
  const removeImage = (questionIndex) => {
    updateQuestion(questionIndex, 'imgUrl', '');
  };

  // Toggle image preview
  const togglePreview = (index) => {
    setPreviewIndexes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Validate URL format
  const isValidUrl = (url) => {
    if (!url || !url.trim()) return true; // URL is optional
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Validate form
  const validateForm = () => {
    const validQuestions = [];
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      if (!q.question.trim()) continue;
      
      if (q.imgUrl && !isValidUrl(q.imgUrl)) {
        alert(`Câu hỏi ${i + 1}: URL hình ảnh không hợp lệ!`);
        return null;
      }
      
      const validOptions = q.options.filter(opt => opt.optionText.trim() !== '');
      if (validOptions.length < MIN_OPTIONS) continue;
      
      const hasCorrectAnswer = q.options.some(opt => opt.correct);
      if (!hasCorrectAnswer) continue;
      
      validQuestions.push(q);
    }
    
    return validQuestions;
  };

  // Reset form
  const resetForm = () => {
    const confirmed = window.confirm("Bạn có chắc muốn làm mới form? Tất cả dữ liệu chưa lưu sẽ bị xóa.");
    if (!confirmed) return;
    
    setQuestions([createEmptyQuestion()]);
    setPreviewIndexes(new Set());
    hasLoadedInitialData.current = false;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validQuestions = validateForm();

    if (!validQuestions) return;

    if (validQuestions.length === 0) {
      alert('Vui lòng hoàn thiện ít nhất một câu hỏi đầy đủ!\n(Cần có nội dung câu hỏi, ít nhất 2 lựa chọn và 1 đáp án đúng)');
      return;
    }

    const formattedQuestions = validQuestions.map(q => ({
      mcId: q.mcId,
      typeOfContent: "LISTEN_CHOICE",
      question: q.question.trim(),
      imgUrl: q.imgUrl.trim() || null,
      options: q.options
        .filter(opt => opt.optionText.trim() !== '')
        .map(opt => ({
          optionId: null,
          optionText: opt.optionText.trim(),
          correct: opt.correct
        }))
    }));

    setIsSubmitting(true);
    try {
      await onSubmit(formattedQuestions);
      setQuestions([createEmptyQuestion()]);
      setPreviewIndexes(new Set());
      hasLoadedInitialData.current = false;
      alert('Upload câu hỏi thành công!');
    } catch (error) {
      console.error('Error submitting:', error);
      alert(error.message || 'Có lỗi xảy ra khi gửi!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Image className="w-7 h-7 text-purple-600" />
          Quản lý Listening Choice Questions
        </h2>
        <p className="text-gray-600">
          Tạo câu hỏi trắc nghiệm với hình ảnh minh họa cho bài nghe
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((q, questionIndex) => (
          <div key={questionIndex} className="p-6 border-2 border-purple-200 rounded-lg bg-purple-50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-purple-800">
                Câu hỏi #{questionIndex + 1}
              </h3>
              <div className="flex items-center gap-2">
                {q.imgUrl && (
                  <button
                    type="button"
                    onClick={() => togglePreview(questionIndex)}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                    title="Xem/Ẩn hình ảnh"
                  >
                    {previewIndexes.has(questionIndex) ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                )}
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                    title="Xóa câu hỏi"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Question content */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung câu hỏi <span className="text-red-500">*</span>
              </label>
              <textarea
                value={q.question}
                onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                rows="3"
                placeholder="Nhập nội dung câu hỏi..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            {/* Image section */}
            <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Hình ảnh minh họa (tùy chọn)
              </label>

              {!q.imgUrl ? (
                <div className="relative">
                  <input
                    type="file"
                    id={`image-${questionIndex}`}
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleImageUpload(questionIndex, file);
                      }
                    }}
                    disabled={uploadingIndexes.has(questionIndex)}
                    className="hidden"
                  />
                  <label
                    htmlFor={`image-${questionIndex}`}
                    className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors ${
                      uploadingIndexes.has(questionIndex) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploadingIndexes.has(questionIndex) ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                        <span className="text-sm text-purple-600">Đang upload...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Click để chọn ảnh (JPG, PNG, GIF, max 5MB)
                        </span>
                      </>
                    )}
                  </label>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">URL Hình ảnh</span>
                    <button
                      type="button"
                      onClick={() => removeImage(questionIndex)}
                      className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                    >
                      <X className="w-4 h-4" />
                      Xóa ảnh
                    </button>
                  </div>
                  <input
                    type="url"
                    value={q.imgUrl}
                    onChange={(e) => updateQuestion(questionIndex, 'imgUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {q.imgUrl  &&
                    <div className="mt-3 flex justify-center">
                      <img
                        src={q.imgUrl}
                        alt="Preview"
                        onError={(e) => {
                          e.target.src = '';
                          e.target.alt = '❌ Không thể tải ảnh. Vui lòng kiểm tra URL.';
                          e.target.className = 'text-red-500 text-sm p-4 bg-red-50 rounded border border-red-200';
                        }}
                        className="max-h-60 rounded border border-gray-300 shadow-sm"
                      />
                    </div>
                  }
                </div>
              )}
            </div>

            {/* Options */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Các lựa chọn <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">(Tối thiểu {MIN_OPTIONS} lựa chọn)</span>
                </label>
                <button
                  type="button"
                  onClick={() => addOption(questionIndex)}
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 font-medium"
                >
                  <Plus className="w-4 h-4" /> Thêm lựa chọn
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((opt, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      opt.correct ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-700">
                        Lựa chọn {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCorrectAnswer(questionIndex, optionIndex)}
                          className={`px-3 py-1 rounded-full text-xs transition-colors ${
                            opt.correct
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-green-200'
                          }`}
                        >
                          <Check className="w-3 h-3 inline mr-1" />
                          {opt.correct ? 'Đáp án đúng' : 'Chọn'}
                        </button>
                        {q.options.length > MIN_OPTIONS && (
                          <button
                            type="button"
                            onClick={() => removeOption(questionIndex, optionIndex)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded"
                            title="Xóa lựa chọn"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <textarea
                      value={opt.optionText}
                      onChange={(e) => updateOption(questionIndex, optionIndex, 'optionText', e.target.value)}
                      rows="2"
                      placeholder="Nhập nội dung lựa chọn..."
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-2 px-6 py-3 text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" /> Thêm Câu Hỏi
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium"
            >
              <RotateCcw className="w-4 h-4" />
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
                'Upload Questions'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ListeningChoiceForm;