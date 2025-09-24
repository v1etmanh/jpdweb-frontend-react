import React, { useState } from 'react';
import { Plus, Trash2, Video, Upload } from 'lucide-react';

const VideoUploadForm = ({ onSubmit }) => {
  const [videos, setVideos] = useState([
    { file: null, titleVideo: '', duration: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Thêm video mới
  const addVideo = () => {
    setVideos([...videos, { file: null, titleVideo: '', duration: '' }]);
  };

  // Xóa video
  const removeVideo = (index) => {
    if (videos.length > 1) {
      const newVideos = videos.filter((_, i) => i !== index);
      setVideos(newVideos);
    }
  };

  // Cập nhật thông tin video
  const updateVideo = (index, field, value) => {
    const newVideos = videos.map((video, i) => 
      i === index ? { ...video, [field]: value } : video
    );
    setVideos(newVideos);
  };

  // Xử lý file upload
  const handleFileChange = (index, file) => {
    if (file) {
      updateVideo(index, 'file', file);
      
      // Nếu chưa có title, tự động lấy tên file
      if (!videos[index].titleVideo) {
        const fileName = file.name.split('.')[0];
        updateVideo(index, 'titleVideo', fileName);
      }
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const validVideos = videos.filter(video => 
      video.file && video.titleVideo.trim() !== ''
    );
    
    if (validVideos.length === 0) {
      alert('Vui lòng chọn ít nhất một video và nhập tiêu đề!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(validVideos);
      // Reset form
      setVideos([{ file: null, titleVideo: '', duration: '' }]);
    } catch (error) {
      console.error('Error uploading videos:', error);
      alert('Có lỗi xảy ra khi upload video!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Video className="w-7 h-7 text-blue-600" />
          Upload Video Bài Giảng
        </h2>
        <p className="text-gray-600">
          Tải lên các video bài giảng để thêm vào module học tập
        </p>
      </div>

      <div className="space-y-4">
        {videos.map((video, index) => (
          <div 
            key={index} 
            className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Video #{index + 1}
              </h3>
              {videos.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVideo(index)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                  title="Xóa video"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn Video <span className="text-red-500">*</span>
              </label>
              
              {!video.file ? (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 px-2"
                      >
                        <span>Chọn video</span>
                        <input
                          type="file"
                          accept="video/*"
                          className="sr-only"
                          onChange={(e) => handleFileChange(index, e.target.files[0])}
                        />
                      </label>
                      <p className="pl-1">hoặc kéo thả file vào đây</p>
                    </div>
                    <p className="text-xs text-gray-500">MP4, AVI, MOV tối đa 500MB</p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">{video.file.name}</span>
                      <span className="text-xs text-green-600">({formatFileSize(video.file.size)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateVideo(index, 'file', null)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Video Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tiêu đề video <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={video.titleVideo}
                  onChange={(e) => updateVideo(index, 'titleVideo', e.target.value)}
                  placeholder="Nhập tiêu đề video..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Thời lượng (phút)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={video.duration}
                  onChange={(e) => updateVideo(index, 'duration', e.target.value)}
                  placeholder="VD: 15.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4">
          <button
            type="button"
            onClick={addVideo}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Thêm Video
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setVideos([{ file: null, titleVideo: '', duration: '' }])}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Làm mới
            </button>
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang upload...
                </span>
              ) : (
                'Upload Videos'
              )}
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500 mt-4">
          <p>💡 <strong>Gợi ý:</strong></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Chỉ những video có đầy đủ thông tin mới được upload</li>
            <li>Tiêu đề video sẽ tự động lấy từ tên file</li>
            <li>Sử dụng nút + để thêm nhiều video cùng lúc</li>
            <li>Nhấn "Làm mới" để xóa tất cả dữ liệu đã nhập</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadForm;