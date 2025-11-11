import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Image, 
  Eye, 
  EyeOff,
  MessageSquare,
  Mic,
  AlertCircle,
  Lightbulb,
  RotateCcw,
  X,
  Loader2,
  Upload
} from 'lucide-react';
import { saveImg } from '../../api/ApiConnect';
import { creatorApi } from '../../api/creator/creatorApi';
import { showWarningNotification } from '../../api/core/apiClient';

const SpeakingPictureForm = ({ onSubmit, initialData, onDelete }) => {
  const [pictureQuestions, setPictureQuestions] = useState([
    {
      mcId: null,
      pictureUrl: '',
      picturePreview: null,
      speakingPictureListQuestions: [
        {
         
          question: '',
          answer: ''
        }
      ]
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePreview, setActivePreview] = useState({});
  const [uploadingIndexes, setUploadingIndexes] = useState(new Set());
  const hasLoadedInitialData = useRef(false);

  // Load initial data
  useEffect(() => {
    if (initialData && Array.isArray(initialData) && initialData.length > 0 && !hasLoadedInitialData.current) {
      const loadedPictureQuestions = initialData.map(item => {
        const loadedQuestions = (item.speakingPictureListQuestions || []).map(q => ({
        
          question: q.question || '',
          answer: q.answer || ''
        }));

        if (loadedQuestions.length === 0) {
          loadedQuestions.push({
          
            question: '',
            answer: ''
          });
        }

        return {
          mcId: item.mcId || null,
          pictureUrl: item.pictureUrl || '',
          picturePreview: null,
          speakingPictureListQuestions: loadedQuestions
        };
      });

      setPictureQuestions(loadedPictureQuestions);
      hasLoadedInitialData.current = true;
    }
  }, [initialData]);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      pictureQuestions.forEach(pq => {
        if (pq.picturePreview) {
          URL.revokeObjectURL(pq.picturePreview);
        }
      });
    };
  }, [pictureQuestions]);

  // Add new picture question
  const addPictureQuestion = () => {
    const newPictureQuestion = {
      mcId: null,
      pictureUrl: '',
      picturePreview: null,
      speakingPictureListQuestions: [
        {
         
          question: '',
          answer: ''
        }
      ]
    };
    setPictureQuestions([...pictureQuestions, newPictureQuestion]);
  };

  // Remove picture question
  const removePictureQuestion = async (pictureIndex) => {
    const pictureQuestion = pictureQuestions[pictureIndex];
    if (!pictureQuestion) return;

    const confirmed = window.confirm("Bạn có chắc muốn xóa bộ câu hỏi này và tất cả câu hỏi liên quan?");
    if (!confirmed) return;

    try {
      if (pictureQuestion.mcId && onDelete) {
        await onDelete(pictureQuestion.mcId);
      }

      if (pictureQuestion.picturePreview) {
        URL.revokeObjectURL(pictureQuestion.picturePreview);
      }

      setPictureQuestions(prev => prev.filter((_, i) => i !== pictureIndex));
    } catch (err) {
      console.error("Lỗi khi xóa bộ câu hỏi:", err);
      alert("Xóa thất bại, vui lòng thử lại.");
    }
  };

  // Update picture URL
  const updatePictureUrl = (pictureIndex, value) => {
    setPictureQuestions(prev => {
      const newQuestions = [...prev];
      newQuestions[pictureIndex].pictureUrl = value;
      return newQuestions;
    });
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

      updatePictureUrl(index, downloadUrl);
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
  const removeImage = async (pictureIndex) => {
  const target = pictureQuestions[pictureIndex];
  if (!target) return;

  // Nếu có ảnh thì xóa trên server trước
  if (target.pictureUrl) {
    try {
      const response = await creatorApi.deleteFile(target.pictureUrl);
      if (!response.success) {
        showWarningNotification("Không thể xóa hình ảnh này");
        return;
      }
    } catch (error) {
      console.error("Lỗi khi xóa ảnh:", error);
      showWarningNotification("Xóa ảnh thất bại");
      return;
    }
  }

  // Sau khi xóa server thành công -> cập nhật state
  setPictureQuestions((prev) => {
    const newQuestions = [...prev];
    if (newQuestions[pictureIndex].picturePreview) {
      URL.revokeObjectURL(newQuestions[pictureIndex].picturePreview);
    }
    newQuestions[pictureIndex].picturePreview = null;
    newQuestions[pictureIndex].pictureUrl = '';
    return newQuestions;
  });
};


  // Add question
  const addQuestion = (pictureIndex) => {
    setPictureQuestions(prev => {
      const newQuestions = [...prev];
      newQuestions[pictureIndex].speakingPictureListQuestions.push({
       
        question: '',
        answer: ''
      });
      return newQuestions;
    });
  };

  // Remove question
  const removeQuestion = (pictureIndex, questionIndex) => {
    setPictureQuestions(prev => {
      const newQuestions = [...prev];
      if (newQuestions[pictureIndex].speakingPictureListQuestions.length > 1) {
        newQuestions[pictureIndex].speakingPictureListQuestions.splice(questionIndex, 1);
      }
      return newQuestions;
    });
  };

  // Update question
  const updateQuestion = (pictureIndex, questionIndex, field, value) => {
    setPictureQuestions(prev => {
      const newQuestions = [...prev];
      newQuestions[pictureIndex].speakingPictureListQuestions[questionIndex][field] = value;
      return newQuestions;
    });
  };

  // Toggle image preview
  const toggleImagePreview = (pictureIndex) => {
    setActivePreview(prev => ({
      ...prev,
      [pictureIndex]: !prev[pictureIndex]
    }));
  };

  // Validate URL format
  const isValidUrl = (url) => {
    if (!url || !url.trim()) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Validate form
  const validateForm = () => {
    for (let i = 0; i < pictureQuestions.length; i++) {
      const pictureQuestion = pictureQuestions[i];
      
      if (!pictureQuestion.pictureUrl.trim()) {
        alert(`Bộ câu hỏi ${i + 1}: Cần có hình ảnh (file hoặc URL)!`);
        return false;
      }

      if (!isValidUrl(pictureQuestion.pictureUrl)) {
        alert(`Bộ câu hỏi ${i + 1}: URL hình ảnh không hợp lệ!`);
        return false;
      }

      if (pictureQuestion.speakingPictureListQuestions.length === 0) {
        alert(`Bộ câu hỏi ${i + 1}: Cần có ít nhất 1 câu hỏi!`);
        return false;
      }

      for (let j = 0; j < pictureQuestion.speakingPictureListQuestions.length; j++) {
        const question = pictureQuestion.speakingPictureListQuestions[j];
        
        if (!question.question.trim()) {
          alert(`Bộ câu hỏi ${i + 1}, Câu hỏi ${j + 1}: Vui lòng nhập nội dung câu hỏi!`);
          return false;
        }

        if (!question.answer.trim()) {
          alert(`Bộ câu hỏi ${i + 1}, Câu hỏi ${j + 1}: Vui lòng nhập gợi ý trả lời!`);
          return false;
        }
      }
    }
    return true;
  };

  // Reset form
  const resetForm = () => {
    pictureQuestions.forEach(pq => {
      if (pq.picturePreview) {
        URL.revokeObjectURL(pq.picturePreview);
      }
    });
    
    setPictureQuestions([{
      mcId: null,
      pictureUrl: '',
      picturePreview: null,
      speakingPictureListQuestions: [
        {
        
          question: '',
          answer: ''
        }
      ]
    }]);
    hasLoadedInitialData.current = false;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const pictureQuestionsData = pictureQuestions.map(pictureQuestion => ({
        mcId: pictureQuestion.mcId,
        typeOfContent: "SPEAKING_PICTURE",
        pictureUrl: pictureQuestion.pictureUrl.trim(),
        speakingPictureListQuestions: pictureQuestion.speakingPictureListQuestions.map(q => ({
        
          question: q.question.trim(),
          answer: q.answer.trim()
        }))
      }));
      
      await onSubmit(pictureQuestionsData);
      
      resetForm();
      alert('Upload câu hỏi Speaking Picture thành công!');
    } catch (error) {
      console.error('Error submitting speaking picture questions:', error);
      alert(error.message || 'Có lỗi xảy ra khi gửi câu hỏi Speaking Picture!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Image className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Quản lý Câu Hỏi Speaking Picture
          </h2>
        </div>
        <p className="text-gray-600">
          Tạo các câu hỏi speaking dựa trên hình ảnh để học sinh mô tả và thảo luận
        </p>
      </div>

      {/* Instructions */}
      <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-purple-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-purple-800 mb-2">Hướng dẫn tạo câu hỏi Speaking Picture:</h4>
            <ul className="text-sm text-purple-700 space-y-1 list-disc list-inside">
              <li>Chọn hình ảnh rõ nét, phù hợp với chủ đề học tập</li>
              <li>Tạo câu hỏi khuyến khích học sinh mô tả, phân tích hình ảnh</li>
              <li>Cung cấp gợi ý trả lời để hướng dẫn học sinh</li>
              <li>Câu hỏi nên đa dạng: mô tả, so sánh, giả định, cảm nhận</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {pictureQuestions.map((pictureQuestion, pictureIndex) => (
          <div 
            key={pictureIndex}
            className="border-2 border-gray-200 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-800">
                  Bộ câu hỏi #{pictureIndex + 1}
                </h3>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {pictureQuestion.speakingPictureListQuestions.length} câu hỏi
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {(pictureQuestion.picturePreview || pictureQuestion.pictureUrl) && (
                  <button
                    type="button"
                    onClick={() => toggleImagePreview(pictureIndex)}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                    title="Xem/Ẩn hình ảnh"
                  >
                    {activePreview[pictureIndex] ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                )}
                {pictureQuestions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePictureQuestion(pictureIndex)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                    title="Xóa bộ câu hỏi"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Image className="w-5 h-5 text-purple-600" />
                  Hình ảnh <span className="text-red-500">*</span>
                </h4>

                {!pictureQuestion.pictureUrl ? (
                  <div className="relative">
                    <input
                      type="file"
                      id={`image-${pictureIndex}`}
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleImageUpload(pictureIndex, file);
                        }
                      }}
                      disabled={uploadingIndexes.has(pictureIndex)}
                      className="hidden"
                    />
                    <label
                      htmlFor={`image-${pictureIndex}`}
                      className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors ${
                        uploadingIndexes.has(pictureIndex) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {uploadingIndexes.has(pictureIndex) ? (
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
                      <label className="block text-sm font-medium text-gray-700">
                        URL Hình ảnh
                      </label>
                      <button
                        type="button"
                        onClick={() => removeImage(pictureIndex)}
                        className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                      >
                        <X className="w-4 h-4" />
                        Xóa ảnh
                      </button>
                    </div>
                    <input
                      type="url"
                      value={pictureQuestion.pictureUrl}
                      onChange={(e) => updatePictureUrl(pictureIndex, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                 {pictureQuestion.pictureUrl && (
  <div className="mt-3 flex justify-center">
    <img
      src={pictureQuestion.pictureUrl}
      alt="Preview"
      className="max-h-60 rounded border border-gray-300 shadow-sm"
    />
  </div>
)}

                  </div>
                )}
              </div>

              {/* Questions Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Mic className="w-5 h-5 text-purple-600" />
                    Câu hỏi Speaking
                  </h4>
                  <button
                    type="button"
                    onClick={() => addQuestion(pictureIndex)}
                    className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm câu hỏi
                  </button>
                </div>

                {pictureQuestion.speakingPictureListQuestions.map((question, questionIndex) => (
                  <div 
                    key={questionIndex}
                    className="bg-white border border-gray-200 rounded-lg p-5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                        <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {questionIndex + 1}
                        </span>
                        Câu hỏi {questionIndex + 1}
                      </h5>
                      {pictureQuestion.speakingPictureListQuestions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(pictureIndex, questionIndex)}
                          className="p-1 text-red-500 hover:text-red-700 transition-colors"
                          title="Xóa câu hỏi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label 
                          htmlFor={`question-${pictureIndex}-${questionIndex}`}
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Nội dung câu hỏi <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id={`question-${pictureIndex}-${questionIndex}`}
                          value={question.question}
                          onChange={(e) => updateQuestion(pictureIndex, questionIndex, 'question', e.target.value)}
                          placeholder="Ví dụ: Describe what you see in this picture..."
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        />
                      </div>

                      <div>
                        <label 
                          htmlFor={`answer-${pictureIndex}-${questionIndex}`}
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Gợi ý trả lời <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id={`answer-${pictureIndex}-${questionIndex}`}
                          value={question.answer}
                          onChange={(e) => updateQuestion(pictureIndex, questionIndex, 'answer', e.target.value)}
                          placeholder="Gợi ý từ vựng, cấu trúc câu, ý tưởng để trả lời..."
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={addPictureQuestion}
            className="flex items-center gap-2 px-6 py-3 text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Thêm Bộ Câu Hỏi
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
                'Upload Câu Hỏi'
              )}
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-800">Thống kê nội dung</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded border-l-4 border-purple-500">
              <div className="font-medium text-gray-700">Số bộ câu hỏi</div>
              <div className="text-2xl font-bold text-purple-600">{pictureQuestions.length}</div>
            </div>
            <div className="bg-white p-3 rounded border-l-4 border-green-500">
              <div className="font-medium text-gray-700">Tổng câu hỏi</div>
              <div className="text-2xl font-bold text-green-600">
                {pictureQuestions.reduce((total, pq) => total + pq.speakingPictureListQuestions.length, 0)}
              </div>
            </div>
            <div className="bg-white p-3 rounded border-l-4 border-blue-500">
              <div className="font-medium text-gray-700">Có hình ảnh</div>
              <div className="text-2xl font-bold text-blue-600">
                {pictureQuestions.filter(pq => pq.pictureUrl.trim()).length}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SpeakingPictureForm;