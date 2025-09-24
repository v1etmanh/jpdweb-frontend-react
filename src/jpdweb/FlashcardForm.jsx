import React, { useState } from 'react';

import { PlusCircleIcon, Trash2Icon } from 'lucide-react';

const FlashCardForm = ({ onSubmit }) => {
  const [flashCards, setFlashCards] = useState([
    { word: '', meaning: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Thêm flashcard mới
  const addFlashCard = () => {
    setFlashCards([...flashCards, { word: '', meaning: '' }]);
  };

  // Xóa flashcard
  const removeFlashCard = (index) => {
    if (flashCards.length > 1) {
      const newFlashCards = flashCards.filter((_, i) => i !== index);
      setFlashCards(newFlashCards);
    }
  };

  // Cập nhật giá trị flashcard
  const updateFlashCard = (index, field, value) => {
    const newFlashCards = flashCards.map((card, i) => 
      i === index ? { ...card, [field]: value } : card
    );
    setFlashCards(newFlashCards);
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const validFlashCards = flashCards.filter(card => 
      card.word.trim() !== '' && card.meaning.trim() !== ''
    );
    
    if (validFlashCards.length === 0) {
      alert('Vui lòng nhập ít nhất một flashcard với đầy đủ thông tin!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(validFlashCards);
      // Reset form sau khi submit thành công
      setFlashCards([{ word: '', meaning: '' }]);
    } catch (error) {
      console.error('Error submitting flashcards:', error);
      alert('Có lỗi xảy ra khi gửi flashcard!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Thêm Flashcards
        </h2>
        <p className="text-gray-600">
          Tạo các flashcard mới để thêm vào module học tập
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {flashCards.map((card, index) => (
          <div 
            key={index} 
            className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Flashcard #{index + 1}
              </h3>
              {flashCards.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFlashCard(index)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                  title="Xóa flashcard"
                >
                  <Trash2Icon className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor={`word-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Từ vựng <span className="text-red-500">*</span>
                </label>
                <input
                  id={`word-${index}`}
                  type="text"
                  value={card.word}
                  onChange={(e) => updateFlashCard(index, 'word', e.target.value)}
                  placeholder="Nhập từ vựng..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label 
                  htmlFor={`meaning-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nghĩa <span className="text-red-500">*</span>
                </label>
                <textarea
                  id={`meaning-${index}`}
                  value={card.meaning}
                  onChange={(e) => updateFlashCard(index, 'meaning', e.target.value)}
                  placeholder="Nhập nghĩa của từ..."
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4">
          <button
            type="button"
            onClick={addFlashCard}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Thêm Flashcard
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFlashCards([{ word: '', meaning: '' }])}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Làm mới
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang gửi...
                </span>
              ) : (
                'Gửi Flashcards'
              )}
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500 mt-4">
          <p>💡 <strong>Gợi ý:</strong></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Chỉ những flashcard có đầy đủ thông tin mới được gửi</li>
            <li>Sử dụng nút + để thêm nhiều flashcard cùng lúc</li>
            <li>Nhấn "Làm mới" để xóa tất cả dữ liệu đã nhập</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default FlashCardForm;