import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Mic, FileText } from 'lucide-react';

const SpeakingPassageForm = ({ onSubmit, initialData, onDelete }) => {
  const [passages, setPassages] = useState([
    { mcId: null, title: '', passage: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasLoadedInitialData = useRef(false);

  // Load dữ liệu đầu vào
  useEffect(() => {
    console.log(initialData)
    if (initialData && Array.isArray(initialData) && initialData.length > 0 && !hasLoadedInitialData.current) {
      const loadedPassages = initialData.map(item => ({
        mcId: item.mcId || null,
        title: item.title || '',
        passage: item.passage || ''
      }));
      setPassages(loadedPassages);
      hasLoadedInitialData.current = true;
    }
  }, [initialData]);

  // Thêm đoạn văn mới
  const addPassage = () => {
    setPassages([...passages, { mcId: null, title: '', passage: '' }]);
  };

  // Xóa đoạn văn (có gọi API onDelete nếu có mcId)
  const removePassage = async (index) => {
    const passage = passages[index];
    if (!passage) return;

    const confirmed = window.confirm("Bạn có chắc muốn xóa đoạn văn này?");
    if (!confirmed) return;

    try {
      if (passage.mcId) {
        await onDelete(passage.mcId);
      }
      setPassages(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Lỗi khi xóa đoạn văn:", err);
      alert("Xóa thất bại, vui lòng thử lại.");
    }
  };

  // Cập nhật thông tin đoạn văn
  const updatePassage = (index, field, value) => {
    const newPassages = passages.map((passage, i) =>
      i === index ? { ...passage, [field]: value } : passage
    );
    setPassages(newPassages);
  };

  // Validate
  const validateForm = () => {
    const validPassages = passages.filter(p => 
      p.title.trim() !== '' && p.passage.trim() !== ''
    );

    if (validPassages.length === 0) {
      alert('Vui lòng nhập ít nhất một đoạn văn với đầy đủ tiêu đề và nội dung!');
      return false;
    }

    return true;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Transform data theo format API
    const validPassages = passages
      .filter(p => p.title.trim() !== '' && p.passage.trim() !== '')
      .map(p => ({
        mcId: p.mcId,
        typeOfContent: "SPEAKING_PASSAGE",
        title: p.title.trim(),
        passage: p.passage.trim()
      }));

    setIsSubmitting(true);

    try {
      await onSubmit(validPassages);

      // Reset form
      setPassages([{ mcId: null, title: '', passage: '' }]);
      hasLoadedInitialData.current = false;
      alert('Upload đoạn văn speaking thành công!');
    } catch (error) {
      console.error("Error submitting passages:", error);
      alert(error.message || "Có lỗi xảy ra khi gửi!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Mic className="w-7 h-7 text-orange-600" />
          Quản lý Speaking Passages
        </h2>
        <p className="text-gray-600">
          Thêm đoạn văn để học viên thực hành kỹ năng nói
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {passages.map((passage, index) => (
          <div 
            key={index} 
            className="p-5 border-2 border-orange-200 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Đoạn văn #{index + 1}
                </h3>
              </div>
              {passages.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePassage(index)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                  title="Xóa đoạn văn"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Title */}
            <div className="mb-4">
              <label 
                htmlFor={`title-${index}`}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                id={`title-${index}`}
                type="text"
                value={passage.title}
                onChange={(e) => updatePassage(index, 'title', e.target.value)}
                placeholder="Nhập tiêu đề đoạn văn..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              />
            </div>

            {/* Passage Content */}
            <div>
              <label 
                htmlFor={`passage-${index}`}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nội dung đoạn văn <span className="text-red-500">*</span>
              </label>
              <textarea
                id={`passage-${index}`}
                value={passage.passage}
                onChange={(e) => updatePassage(index, 'passage', e.target.value)}
                placeholder="Nhập đoạn văn để học viên thực hành speaking..."
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none bg-white"
              />
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>{passage.passage.length} ký tự</span>
                <span>{passage.passage.split(' ').filter(word => word.length > 0).length} từ</span>
              </div>
            </div>
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={addPassage}
            className="flex items-center gap-2 px-6 py-3 text-orange-600 border-2 border-orange-600 rounded-lg hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Thêm Đoạn Văn
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setPassages([{ mcId: null, title: '', passage: '' }]);
                hasLoadedInitialData.current = false;
              }}
              className="px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium"
            >
              Làm mới
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang gửi...
                </span>
              ) : (
                'Upload Passages'
              )}
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-3 rounded border-l-4 border-orange-500">
              <div className="font-medium text-gray-700">Số đoạn văn</div>
              <div className="text-2xl font-bold text-orange-600">{passages.length}</div>
            </div>
            <div className="bg-white p-3 rounded border-l-4 border-blue-500">
              <div className="font-medium text-gray-700">Tổng từ vựng</div>
              <div className="text-2xl font-bold text-blue-600">
                {passages.reduce((total, passage) => 
                  total + passage.passage.split(' ').filter(word => word.length > 0).length, 0
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SpeakingPassageForm;