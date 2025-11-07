import React, { useEffect, useState } from 'react';
import { PlusCircleIcon, Trash2Icon, ImageIcon, XIcon, Loader2Icon } from 'lucide-react';
import { saveImg } from '../../api/ApiConnect';
import { creatorApi } from '../../api/creator/creatorApi';
import { showErrorNotification } from '../../api/core/apiClient';

const FlashCardForm = ({ onSubmit, initialData, onDelete }) => {
  const [flashCards, setFlashCards] = useState([
    { mcId: null, word: '', meaning: '', imageUrl: '', typeOfContent: "FLASHCARD" }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  
  // ✅ SỬA: Map imgUrl từ backend → imageUrl trong state
  useEffect(() => {
   console.log(initialData)
     
    if (initialData && Array.isArray(initialData) && initialData.length > 0) {
   
      setFlashCards(initialData.map(card => ({
        mcId: card.mcId || null,
        word: card.word || '',
        meaning: card.meaning || '',
        imageUrl: card.imgUrl|| '', // ← Lấy từ imgUrl
        typeOfContent: "FLASHCARD"
      })));
    }
  }, [initialData]);

  // ✅ SỬA: Dùng imageUrl trong state
  const addFlashCard = () => {
    setFlashCards([...flashCards, { 
      mcId: null, 
      word: '', 
      meaning: '', 
      imageUrl: '', // ← Dùng imageUrl
      typeOfContent: "FLASHCARD" 
    }]);
  };

  const removeFlashCard = async (index) => {
    const card = flashCards[index];
    if (!card) return;

    const confirmed = window.confirm("Bạn có chắc muốn xóa flashcard này?");
    if (!confirmed) return;

    try {
      if (card.mcId) {
        await onDelete(card.mcId);
      }
      setFlashCards(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Lỗi khi xóa flashcard:", error);
      alert("Xóa thất bại, vui lòng thử lại.");
    }
  };

  const updateFlashCard = (index, field, value) => {
    const newFlashCards = flashCards.map((card, i) => 
      i === index ? { ...card, [field]: value } : card
    );
    setFlashCards(newFlashCards);
  };

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

      // ✅ Cập nhật vào imageUrl trong state
      updateFlashCard(index, 'imageUrl', downloadUrl);
      console.log(`Ảnh đã upload thành công: ${downloadUrl}`);
      
    } catch (error) {
      console.error('Lỗi khi upload ảnh:', error);
      alert('Upload ảnh thất bại. Vui lòng thử lại.');
    } finally {
      setUploadingIndex(null);
    }
  };

  const removeImage = async(index) => {
    const confirmed = window.confirm("Bạn có muốn xóa ảnh này không?");
    if (confirmed) {
     const response=await creatorApi.deleteFile(flashCards[index].imageUrl);
     if(response.success)
      updateFlashCard(index, 'imageUrl', '');
    else {
      showErrorNotification("khong the xoa hinh anh nay")
    }
    }
  };

  // ✅ SỬA: Map imageUrl trong state → imgUrl khi submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate và map đúng field cho backend
    const validFlashCards = flashCards
      .filter(card => card.word.trim() !== '' && card.meaning.trim() !== '')
      .map(card => ({
        mcId: card.mcId,
        word: card.word.trim(),
        meaning: card.meaning.trim(),
        typeOfContent: "FLASHCARD",
        imgUrl: card.imageUrl // ← Map imageUrl → imgUrl để gửi backend
      }));
    
    if (validFlashCards.length === 0) {
      alert('Vui lòng nhập ít nhất một flashcard với đầy đủ thông tin!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(validFlashCards);
      
      // Reset form
      setFlashCards([{ 
        mcId: null, 
        word: '', 
        meaning: '', 
        imageUrl: '', 
        typeOfContent: "FLASHCARD" 
      }]);
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

            {/* Image Upload Section */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh minh họa (tùy chọn)
              </label>

              {!card.imageUrl ? (
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
                    className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors ${
                      uploadingIndex === index ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploadingIndex === index ? (
                      <>
                        <Loader2Icon className="w-5 h-5 animate-spin text-blue-600" />
                        <span className="text-sm text-blue-600">Đang upload...</span>
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
    src={card.imageUrl}
    alt={card.word}
    className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
    // Tăng h-48 → h-64 (256px)
    // Đổi object-contain → object-cover
    // Bỏ bg-white
  />
  
  <button
    type="button"
    onClick={() => removeImage(index)}
     title="Xóa ảnh"
  >
    <XIcon className="w-5 h-5" />
  </button>

  <a
    href={card.imageUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="text-xs text-blue-500 underline truncate block hover:text-blue-600"
  >
   link
  </a>
  
</div>
              )}
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
              onClick={() => setFlashCards([{ 
                mcId: null, 
                word: '', 
                meaning: '', 
                imageUrl: '', 
                typeOfContent: "FLASHCARD" 
              }])}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Làm mới
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || uploadingIndex !== null}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2Icon className="animate-spin h-4 w-4" />
                  Đang gửi...
                </span>
              ) : (
                'Gửi Flashcards'
              )}
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500 mt-4">
          <p className="font-semibold mb-1">Gợi ý:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Chỉ những flashcard có đầy đủ thông tin mới được gửi</li>
            <li>Ảnh sẽ được upload ngay lập tức khi bạn chọn file</li>
            <li>Kích thước ảnh tối đa: 5MB, định dạng: JPG, PNG, GIF, WEBP</li>
            <li>Sử dụng nút + để thêm nhiều flashcard cùng lúc</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default FlashCardForm;