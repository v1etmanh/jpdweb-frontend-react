import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Image, 
  Upload, 
  Eye, 
  EyeOff,
  MessageSquare,
  Mic,
  AlertCircle,
  Lightbulb,
  RotateCcw,
  Link,
  X
} from 'lucide-react';

const SpeakingPictureForm = ({ onSubmit }) => {
  const [pictureQuestions, setPictureQuestions] = useState([
    {
      pictureUrl: '',
      pictureFile: null,
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
  
  const fileInputRefs = useRef({});

  // Thêm picture question mới
  const addPictureQuestion = () => {
    const newPictureQuestion = {
      pictureUrl: '',
      pictureFile: null,
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

  // Xóa picture question
  const removePictureQuestion = (pictureIndex) => {
    if (pictureQuestions.length > 1) {
      const newPictureQuestions = pictureQuestions.filter((_, i) => i !== pictureIndex);
      
      // Cleanup preview URL
      if (pictureQuestions[pictureIndex].picturePreview) {
        URL.revokeObjectURL(pictureQuestions[pictureIndex].picturePreview);
      }
      
      setPictureQuestions(newPictureQuestions);
    }
  };

  // Cập nhật picture URL
  const updatePictureUrl = (pictureIndex, value) => {
    const newPictureQuestions = [...pictureQuestions];
    newPictureQuestions[pictureIndex].pictureUrl = value;
    setPictureQuestions(newPictureQuestions);
  };

  // Xử lý upload hình ảnh
  const handleImageUpload = (pictureIndex, file) => {
    if (file && file.type.startsWith('image/')) {
      const newPictureQuestions = [...pictureQuestions];
      
      // Cleanup previous preview URL
      if (newPictureQuestions[pictureIndex].picturePreview) {
        URL.revokeObjectURL(newPictureQuestions[pictureIndex].picturePreview);
      }
      
      newPictureQuestions[pictureIndex].pictureFile = file;
      newPictureQuestions[pictureIndex].picturePreview = URL.createObjectURL(file);
      newPictureQuestions[pictureIndex].pictureUrl = ''; // Clear URL input
      setPictureQuestions(newPictureQuestions);
    } else {
      alert('Vui lòng chọn file hình ảnh hợp lệ!');
    }
  };

  // Xóa hình ảnh
  const removeImage = (pictureIndex) => {
    const newPictureQuestions = [...pictureQuestions];
    
    if (newPictureQuestions[pictureIndex].picturePreview) {
      URL.revokeObjectURL(newPictureQuestions[pictureIndex].picturePreview);
    }
    
    newPictureQuestions[pictureIndex].pictureFile = null;
    newPictureQuestions[pictureIndex].picturePreview = null;
    newPictureQuestions[pictureIndex].pictureUrl = '';
    setPictureQuestions(newPictureQuestions);
  };

  // Thêm câu hỏi cho picture
  const addQuestion = (pictureIndex) => {
    const newPictureQuestions = [...pictureQuestions];
    newPictureQuestions[pictureIndex].speakingPictureListQuestions.push({
      question: '',
      answer: ''
    });
    setPictureQuestions(newPictureQuestions);
  };

  // Xóa câu hỏi
  const removeQuestion = (pictureIndex, questionIndex) => {
    const newPictureQuestions = [...pictureQuestions];
    if (newPictureQuestions[pictureIndex].speakingPictureListQuestions.length > 1) {
      newPictureQuestions[pictureIndex].speakingPictureListQuestions.splice(questionIndex, 1);
      setPictureQuestions(newPictureQuestions);
    }
  };

  // Cập nhật câu hỏi
  const updateQuestion = (pictureIndex, questionIndex, field, value) => {
    const newPictureQuestions = [...pictureQuestions];
    newPictureQuestions[pictureIndex].speakingPictureListQuestions[questionIndex][field] = value;
    setPictureQuestions(newPictureQuestions);
  };

  // Toggle preview hình ảnh
  const toggleImagePreview = (pictureIndex) => {
    setActivePreview({
      ...activePreview,
      [pictureIndex]: !activePreview[pictureIndex]
    });
  };

  // Validate form
  const validateForm = () => {
    for (let i = 0; i < pictureQuestions.length; i++) {
      const pictureQuestion = pictureQuestions[i];
      
      // Kiểm tra có hình ảnh
      if (!pictureQuestion.pictureFile && !pictureQuestion.pictureUrl.trim()) {
        alert(`Bộ câu hỏi ${i + 1}: Cần có hình ảnh (file hoặc URL)!`);
        return false;
      }

      // Kiểm tra có ít nhất 1 câu hỏi
      if (pictureQuestion.speakingPictureListQuestions.length === 0) {
        alert(`Bộ câu hỏi ${i + 1}: Cần có ít nhất 1 câu hỏi!`);
        return false;
      }

      // Kiểm tra từng câu hỏi
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

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      const pictureQuestionsData = pictureQuestions.map((pictureQuestion, index) => {
        const data = {
          speakingPictureListQuestions: pictureQuestion.speakingPictureListQuestions.map(q => ({
            question: q.question.trim(),
            answer: q.answer.trim()
          }))
        };
        
        if (pictureQuestion.pictureFile) {
          formData.append(`imageFile_${index}`, pictureQuestion.pictureFile);
          data.hasImageFile = true;
          data.imageFileName = pictureQuestion.pictureFile.name;
        } else if (pictureQuestion.pictureUrl.trim()) {
          data.pictureUrl = pictureQuestion.pictureUrl.trim();
        }
        
        return data;
      });
      
      formData.append('pictureQuestions', JSON.stringify(pictureQuestionsData));
      formData.append('moduleId', '1'); // Replace with actual module ID
      
      await onSubmit(formData);
      
      // Reset form and cleanup URLs
      pictureQuestions.forEach(pq => {
        if (pq.picturePreview) {
          URL.revokeObjectURL(pq.picturePreview);
        }
      });
      
      setPictureQuestions([{
        pictureUrl: '',
        pictureFile: null,
        picturePreview: null,
        speakingPictureListQuestions: [
          {
            question: '',
            answer: ''
          }
        ]
      }]);
    } catch (error) {
      console.error('Error submitting speaking picture questions:', error);
      alert('Có lỗi xảy ra khi gửi câu hỏi Speaking Picture!');
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
            Thêm Câu Hỏi Speaking Picture
          </h2>
        </div>
        <p className="text-gray-600">
          Tạo các câu hỏi speaking dựa trên hình ảnh để học sinh mô tả và thảo luận
        </p>
      </div>

      {/* Hướng dẫn */}
      <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-purple-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-purple-800 mb-2">💡 Hướng dẫn tạo câu hỏi Speaking Picture:</h4>
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

                {/* Image URL Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Hình ảnh
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={pictureQuestion.pictureUrl}
                      onChange={(e) => updatePictureUrl(pictureIndex, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      disabled={!!pictureQuestion.pictureFile}
                    />
                    <Link className="w-5 h-5 text-gray-400 self-center" />
                  </div>
                </div>

                <div className="text-center text-gray-500 text-sm mb-4">hoặc</div>

                {/* Image Upload */}
                {!pictureQuestion.pictureFile ? (
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(pictureIndex, e.target.files[0])}
                      className="hidden"
                      ref={(el) => fileInputRefs.current[pictureIndex] = el}
                    />
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[pictureIndex]?.click()}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      disabled={!!pictureQuestion.pictureUrl.trim()}
                    >
                      Chọn hình ảnh
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      JPG, PNG, GIF tối đa 5MB
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Image className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Hình ảnh đã tải lên
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(pictureIndex)}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                        title="Xóa hình ảnh"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span>Tên file: {pictureQuestion.pictureFile.name}</span>
                      <span className="ml-4">
                        Kích thước: {(pictureQuestion.pictureFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                )}

                {/* Image Preview */}
                {activePreview[pictureIndex] && (pictureQuestion.picturePreview || pictureQuestion.pictureUrl) && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Xem trước hình ảnh:</p>
                    <div className="flex justify-center">
                      <img
                        src={pictureQuestion.picturePreview || pictureQuestion.pictureUrl}
                        alt="Preview"
                        className="max-w-full max-h-96 rounded-lg shadow-md object-contain"
                        onError={() => alert('Không thể tải hình ảnh. Vui lòng kiểm tra URL!')}
                      />
                    </div>
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
                    {/* Header câu hỏi */}
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
                      {/* Câu hỏi */}
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

                      {/* Gợi ý trả lời */}
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

        {/* Nút điều khiển */}
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
              onClick={() => {
                pictureQuestions.forEach(pq => {
                  if (pq.picturePreview) {
                    URL.revokeObjectURL(pq.picturePreview);
                  }
                });
                setPictureQuestions([{
                  pictureUrl: '',
                  pictureFile: null,
                  picturePreview: null,
                  speakingPictureListQuestions: [
                    {
                      question: '',
                      answer: ''
                    }
                  ]
                }]);
              }}
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
                'Gửi Câu Hỏi Speaking Picture'
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
                {pictureQuestions.filter(pq => pq.pictureFile || pq.pictureUrl.trim()).length}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SpeakingPictureForm;