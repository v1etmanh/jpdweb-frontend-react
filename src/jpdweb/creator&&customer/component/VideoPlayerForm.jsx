import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Video, Link } from 'lucide-react';

const VideoUploadForm = ({ onSubmit, initialData, onDelete }) => {
  const [videos, setVideos] = useState([
    { mcId: null, titleVideo: '', duration: '', videoUrl: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasLoadedInitialData = useRef(false);

  // Load dữ liệu đầu vào
  useEffect(() => {
    if (initialData && Array.isArray(initialData) && initialData.length > 0 && !hasLoadedInitialData.current) {
      const loadedVideos = initialData.map(item => ({
        mcId: item.mcId || null,
        titleVideo: item.titleVideo || '',
        duration: item.durationMinutes || '',
        videoUrl: item.videoUrl || ''
      }));
      setVideos(loadedVideos);
      hasLoadedInitialData.current = true;
    }
  }, [initialData]);

  // Thêm video mới
  const addVideo = () => {
    setVideos([...videos, { mcId: null, titleVideo: '', duration: '', videoUrl: '' }]);
  };

  // Xóa video (có gọi API onDelete nếu có mcId)
  const removeVideo = async (index) => {
    const video = videos[index];
    if (!video) return;

    const confirmed = window.confirm("Bạn có chắc muốn xóa video này?");
    if (!confirmed) return;

    try {
      if (video.mcId) {
        await onDelete(video.mcId);
      }
      setVideos(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Lỗi khi xóa video:", err);
      alert("Xóa thất bại, vui lòng thử lại.");
    }
  };

  // Cập nhật thông tin video
  const updateVideo = (index, field, value) => {
    const newVideos = videos.map((video, i) =>
      i === index ? { ...video, [field]: value } : video
    );
    setVideos(newVideos);
  };

  // Xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();

   

   /*
      mcId: item.mcId || '',
        titleVideo: item.titleVideo || '',
        duration: item.durationMinutes || '',
        videoUrl: item.videoUrl || ''
    */
const validVideos = videos
  .filter(v => v.titleVideo.trim() && v.videoUrl.trim()) // Lọc video rỗng
  .map(q => ({
    mcId: q.mcId,
    titleVideo: q.titleVideo.trim(),
    videoUrl: q.videoUrl.trim(),
    typeOfContent: "VIDEO",
    durationMinutes: q.duration || 0, // Đảm bảo có giá trị mặc định
  }));

if (validVideos.length === 0) {
  alert('Vui lòng nhập ít nhất 1 video hợp lệ!');
  return;
}
    setIsSubmitting(true);
    try {
      await onSubmit(validVideos);
      setVideos([{ mcId:null, titleVideo: '', duration: '', videoUrl: '' }]);
    } catch (error) {
      console.error('Error uploading videos:', error);
      alert('Có lỗi xảy ra khi upload video!');
    } finally {
      setIsSubmitting(false);
    }
  };
  const getYouTubeID = (url) => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^&\s]+)/,
    /(?:youtube\.com\/embed\/)([^&\s]+)/,
  ];
  for (let pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Video className="w-7 h-7 text-blue-600" />
          Upload Video Bài Giảng
        </h2>
        <p className="text-gray-600">
          Nhập link các video bài giảng để thêm vào module học tập
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

            {/* Video Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đường dẫn video (URL) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <Link className="w-5 h-5 text-blue-600" />
                  <input
                    type="text"
                    value={video.videoUrl}
                    onChange={(e) => updateVideo(index, 'videoUrl', e.target.value)}
                    placeholder="Nhập link video..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                 
                  

                </div>
   {video.videoUrl && (
  <img
    src={`https://img.youtube.com/vi/${getYouTubeID(video.videoUrl)}/0.jpg`}
    alt="Video Thumbnail"
    onError={(e) => e.target.style.display = 'none'} // Ẩn nếu load lỗi
    className="w-60 h-40 object-cover rounded-md"
  />
)}

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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

        {/* Buttons */}
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
              onClick={() => setVideos([{ mcId: null, titleVideo: '', duration: '', videoUrl: '' }])}
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
              {isSubmitting ? "Đang upload..." : "Upload Videos"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadForm;
