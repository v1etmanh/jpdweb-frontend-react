import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, RotateCcw, ExternalLink, Share2, BookOpen } from 'lucide-react';

const VideoPlayer = ({ 
  videoUrl, 
  width = "100%", 
  height = "500px",
  title = "Video Bài Giảng",
  description = "",
  thumbnail = null,
  showControls = true,
  autoplay = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const iframeRef = useRef(null);

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = extractVideoId(videoUrl);

  useEffect(() => {
    if (videoId) {
      setIsLoading(false);
    } else {
      setIsError(true);
      setIsLoading(false);
    }
  }, [videoId]);

  const handleShare = async () => {
    if (navigator.share && videoUrl) {
      try {
        await navigator.share({
          title: title,
          text: description || 'Xem video bài giảng này',
          url: videoUrl,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(videoUrl);
        alert('Đã copy link video vào clipboard!');
      }
    } else {
      navigator.clipboard.writeText(videoUrl);
      alert('Đã copy link video vào clipboard!');
    }
  };

  const openInYoutube = () => {
    window.open(videoUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl overflow-hidden shadow-2xl" style={{ width, height }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white font-medium">Đang tải video...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !videoId) {
    return (
      <div className="relative bg-gradient-to-br from-red-900 via-red-800 to-red-700 rounded-2xl overflow-hidden shadow-2xl" style={{ width, height }}>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-4">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">URL YouTube không hợp lệ</h3>
            <p className="text-red-100 mb-6 max-w-md">
              Vui lòng kiểm tra lại đường dẫn video YouTube. URL phải có định dạng hợp lệ.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-6 py-3 bg-white text-red-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors mx-auto"
            >
              <RotateCcw className="w-5 h-5" />
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Video Header */}
      {(title || description) && (
        <div className="bg-white rounded-t-2xl shadow-lg border-b border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              </div>
              {description && (
                <p className="text-gray-600 leading-relaxed">{description}</p>
              )}
            </div>
            
            {showControls && (
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                  title="Chia sẻ video"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={openInYoutube}
                  className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Mở trên YouTube"
                >
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Container */}
      <div 
        className={`relative bg-black ${title || description ? 'rounded-b-2xl' : 'rounded-2xl'} overflow-hidden shadow-2xl group`}
        style={{ width, height }}
      >
        {/* Video Frame */}
        <iframe
          ref={iframeRef}
          width="100%"
          height="100%"
          src={embedUrl}
          title={title || "YouTube video player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
          onLoad={() => setIsLoading(false)}
          onError={() => setIsError(true)}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white text-sm">Đang tải video...</p>
            </div>
          </div>
        )}

        {/* Gradient Overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Custom Controls Overlay (optional) */}
        {showControls && (
          <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/70 backdrop-blur-sm rounded-xl px-3 py-2">
              <span className="text-white text-sm font-medium">HD</span>
            </div>
          </div>
        )}

        {/* Video Info Tooltip */}
        {showInfo && (
          <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-xl p-4 text-white transform transition-transform duration-300">
            <h4 className="font-semibold mb-1">{title}</h4>
            <p className="text-sm text-gray-300">{description}</p>
          </div>
        )}
      </div>

      {/* Video Stats/Info Bar */}
      <div className="bg-gray-50 rounded-b-xl border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Video đang phát
            </span>
            <span>Chất lượng: HD</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Thông tin
            </button>
            <span>YouTube Player</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;