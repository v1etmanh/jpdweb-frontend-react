import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, FileText, ImageIcon, XIcon, Loader2Icon, ListChecks } from 'lucide-react';
import { saveImg } from './api/ApiConnect';

const WritingQuestionForm = ({ onSubmit, initialData, onDelete }) => {
  const [questions, setQuestions] = useState([
    { 
      mcId: null, 
      question: '', 
      imageUrl: '', 
      requirements: '',
      taskTypeCategory: 'REPORT',
      criterias: [] 
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const hasLoadedInitialData = useRef(false);

  // Danh sách TaskTypeCategory
  const taskTypes = [
    { value: 'REPORT', label: 'Report (Academic Description)' },
    { value: 'LETTER', label: 'Letter (General)' },
    { value: 'ESSAY', label: 'Essay (Argumentative)' },
    { value: 'INTEGRATED_WRITING', label: 'Integrated Writing' },
    { value: 'EMAIL', label: 'Email' },
    { value: 'SHORT_WRITING', label: 'Short Writing' },
    { value: 'FREE_WRITING', label: 'Free Writing' },
    { value: 'STORY', label: 'Story' },
    { value: 'FORM_FILLING', label: 'Form Filling' }
  ];

  // Load dữ liệu đầu vào
  useEffect(() => {
    console.log(initialData)
    if (initialData && Array.isArray(initialData) && initialData.length > 0 && !hasLoadedInitialData.current) {
      const loadedQuestions = initialData.map(item => ({
        mcId: item.mcId || null,
        question: item.question || '',
        imageUrl: item.imageUrl || item.imgUrl || '',
        requirements: item.requirements || '',
        taskTypeCategory: item.taskTypeCategory || 'REPORT',
        criterias: item.criterias || []
      }));
      setQuestions(loadedQuestions);
      hasLoadedInitialData.current = true;
    }
  }, [initialData]);

  // Thêm câu hỏi mới
  const addQuestion = () => {
    setQuestions([...questions, { 
      mcId: null, 
      question: '', 
      imageUrl: '', 
      requirements: '',
      taskTypeCategory: 'REPORT',
      criterias: [] 
    }]);
  };

  // Xóa câu hỏi
  const removeQuestion = async (index) => {
    const question = questions[index];
    if (!question) return;

    const confirmed = window.confirm("Bạn có chắc muốn xóa câu hỏi này?");
    if (!confirmed) return;

    try {
      if (question.mcId) {
        await onDelete(question.mcId);
      }
      setQuestions(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Lỗi khi xóa câu hỏi:", err);
      alert("Xóa thất bại, vui lòng thử lại.");
    }
  };

  // Cập nhật thông tin câu hỏi
  const updateQuestion = (index, field, value) => {
    const newQuestions = questions.map((question, i) =>
      i === index ? { ...question, [field]: value } : question
    );
    setQuestions(newQuestions);
  };

  // Thêm criteria mới
  const addCriteria = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].criterias.push('');
    setQuestions(newQuestions);
  };

  // Xóa criteria
  const removeCriteria = (questionIndex, criteriaIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].criterias = newQuestions[questionIndex].criterias.filter(
      (_, i) => i !== criteriaIndex
    );
    setQuestions(newQuestions);
  };

  // Cập nhật criteria
  const updateCriteria = (questionIndex, criteriaIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].criterias[criteriaIndex] = value;
    setQuestions(newQuestions);
  };

  // Upload ảnh
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

    setUploadingIndex(index);

    try {
      const formData = new FormData();
      formData.append('img', file);
      const response = await saveImg(formData);
      const downloadUrl = response.data;

      if (!downloadUrl) {
        throw new Error('Không nhận được URL từ server');
      }

      updateQuestion(index, 'imageUrl', downloadUrl);
      console.log(`Ảnh đã upload thành công: ${downloadUrl}`);
      
    } catch (error) {
      console.error('Lỗi khi upload ảnh:', error);
      alert('Upload ảnh thất bại. Vui lòng thử lại.');
    } finally {
      setUploadingIndex(null);
    }
  };

  // Xóa ảnh
  const removeImage = (index) => {
    const confirmed = window.confirm("Bạn có muốn xóa ảnh này không?");
    if (confirmed) {
      updateQuestion(index, 'imageUrl', '');
      const fileInput = document.getElementById(`image-${index}`);
      if (fileInput) fileInput.value = '';
    }
  };

  // Xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validQuestions = questions
      .filter(q => q.question.trim())
      .map(q => ({
        mcId: q.mcId,
        question: q.question.trim(),
        imageUrl: q.imageUrl || null,
        requirements: q.requirements.trim() || null,
        taskTypeCategory: q.taskTypeCategory,
        criterias: q.criterias.filter(c => c.trim()).map(c => c.trim()),
        typeOfContent: "WRITING"
      }));

    if (validQuestions.length === 0) {
      alert('Vui lòng nhập ít nhất 1 câu hỏi hợp lệ!');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(validQuestions);
      setQuestions([{ 
        mcId: null, 
        question: '', 
        imageUrl: '', 
        requirements: '',
        taskTypeCategory: 'REPORT',
        criterias: [] 
      }]);
      hasLoadedInitialData.current = false;
      alert('Upload câu hỏi thành công!');
    } catch (error) {
      console.error('Error uploading questions:', error);
      alert(error.message || 'Có lỗi xảy ra khi upload câu hỏi!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <FileText className="w-7 h-7 text-green-600" />
          Quản lý Writing Questions
        </h2>
        <p className="text-gray-600">
          Thêm câu hỏi viết luận để học viên thực hành kỹ năng viết
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div 
            key={index} 
            className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Câu hỏi #{index + 1}
              </h3>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                  title="Xóa câu hỏi"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Task Type Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại bài viết <span className="text-red-500">*</span>
                </label>
                <select
                  value={question.taskTypeCategory}
                  onChange={(e) => updateQuestion(index, 'taskTypeCategory', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {taskTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung câu hỏi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                  placeholder="Nhập câu hỏi viết luận..."
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh minh họa (tùy chọn)
                </label>

                {!question.imageUrl ? (
                  <div className="relative">
                    <input
                      type="file"
                      id={`image-${index}`}
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleImageUpload(index, file);
                        }
                      }}
                      disabled={uploadingIndex === index}
                      className="hidden"
                    />
                    <label
                      htmlFor={`image-${index}`}
                      className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors ${
                        uploadingIndex === index ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {uploadingIndex === index ? (
                        <>
                          <Loader2Icon className="w-5 h-5 animate-spin text-green-600" />
                          <span className="text-sm text-green-600">Đang upload...</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Click để chọn ảnh (JPG, PNG, GIF, max 5MB)
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                ) : (
                  <div className="relative group">
                    <img
                      src={question.imageUrl}
                      alt={`Question ${index + 1}`}
                      className="w-full max-h-96 object-contain rounded-lg border-2 border-gray-200 bg-gray-50"
                      onLoad={() => console.log('✅ Loaded:', question.imageUrl)}
                      onError={(e) => {
                        console.error('❌ Error loading:', question.imageUrl);
                        e.target.src = 'https://via.placeholder.com/400x300?text=Error+Loading+Image';
                      }}
                    />
                    
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
                      title="Xóa ảnh"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>

                    <p className="text-xs text-gray-500 mt-2 truncate" title={question.imageUrl}>
                      {question.imageUrl}
                    </p>
                  </div>
                )}
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yêu cầu bài viết (tùy chọn)
                </label>
                <textarea
                  value={question.requirements}
                  onChange={(e) => updateQuestion(index, 'requirements', e.target.value)}
                  placeholder="VD: Viết ít nhất 250 từ, sử dụng cấu trúc academic..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Criterias Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ListChecks className="w-4 h-4" />
                  Tiêu chí chấm điểm (tùy chọn)
                </label>
                
                <div className="space-y-2">
                  {question.criterias.map((criteria, criteriaIndex) => (
                    <div key={criteriaIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={criteria}
                        onChange={(e) => updateCriteria(index, criteriaIndex, e.target.value)}
                        placeholder={`Tiêu chí ${criteriaIndex + 1}...`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeCriteria(index, criteriaIndex)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors"
                        title="Xóa tiêu chí"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => addCriteria(index)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm tiêu chí
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4">
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-600 rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Thêm câu hỏi
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setQuestions([{ 
                  mcId: null, 
                  question: '', 
                  imageUrl: '', 
                  requirements: '',
                  taskTypeCategory: 'REPORT',
                  criterias: [] 
                }]);
                hasLoadedInitialData.current = false;
              }}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Làm mới
            </button>
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || uploadingIndex !== null}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2Icon className="animate-spin h-4 w-4" />
                  Đang gửi...
                </span>
              ) : (
                'Upload Questions'
              )}
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500 mt-4">
          <p className="font-semibold mb-1">Gợi ý:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Chỉ những câu hỏi có đầy đủ thông tin mới được gửi</li>
            <li>Ảnh sẽ được upload ngay lập tức khi bạn chọn file</li>
            <li>Kích thước ảnh tối đa: 5MB, định dạng: JPG, PNG, GIF, WEBP</li>
            <li>Có thể thêm nhiều tiêu chí chấm điểm cho mỗi câu hỏi</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WritingQuestionForm;