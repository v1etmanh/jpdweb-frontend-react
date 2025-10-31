import React, { useState, useRef, useEffect } from 'react';
import { Play, Settings, RotateCcw, ExternalLink, Share2, BookOpen } from 'lucide-react';

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
      <div className="relative bg-gradient-to-br from-background via-surface to-border-light rounded-xl overflow-hidden shadow-soft" style={{ width, height }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 border-4 border-primary-30 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-text-secondary font-medium">Đang tải video...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !videoId) {
    return (
      <div className="relative bg-gradient-to-br from-red-50 via-surface to-red-100 rounded-xl overflow-hidden shadow-soft border border-border-light" style={{ width, height }}>
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-accent-10 rounded-full flex items-center justify-center mb-3 mx-auto">
              <Play className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-1">URL YouTube không hợp lệ</h3>
            <p className="text-text-secondary text-sm mb-4 max-w-md">
              Vui lòng kiểm tra lại đường dẫn video YouTube. URL phải có định dạng hợp lệ.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-primary-30 text-white font-medium rounded-lg hover:bg-primary-dark transition-colors mx-auto text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`;

  return (
    <div className="w-full mx-auto animate-fade-in">
      {/* Video Header - Compact */}
      <div className="bg-surface rounded-t-xl border-b border-border-light p-1 mb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-primary-30 to-primary-dark rounded-lg flex-shrink-0">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-text-primary truncate">{title}</h2>
              
            </div>
          </div>
          
          {showControls && (
            <div className="flex items-center gap-1 ml-3 flex-shrink-0">
              <button
                onClick={handleShare}
                className="flex items-center justify-center w-8 h-8 text-text-muted hover:text-primary-30 hover:bg-background rounded-lg transition-colors"
                title="Chia sẻ video"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={openInYoutube}
                className="flex items-center justify-center w-8 h-8 text-text-muted hover:text-accent-10 hover:bg-background rounded-lg transition-colors"
                title="Mở trên YouTube"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Video Container - Đơn giản hóa, loại bỏ các overlay chặn click */}
      <div 
        className="relative bg-black rounded-b-xl overflow-hidden shadow-card"
        style={{ width, height }}
      >
        {/* Video Frame - Đảm bảo iframe có thể nhận click */}
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

        {/* Loading Overlay - Chỉ hiển thị khi loading */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white text-xs">Đang tải video...</p>
            </div>
          </div>
        )}
      </div>

      {/* Video Stats/Info Bar - Compact */}
      <div className="bg-background rounded-b-lg border border-border-light border-t-0 px-3 py-2">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-status-completed rounded-full animate-pulse"></div>
              Sẵn sàng phát
            </span>
            <span>Chất lượng: HD</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center gap-1 hover:text-primary-30 transition-colors text-xs"
            >
              <Settings className="w-3 h-3" />
              Thông tin
            </button>
            <span>YouTube</span>
          </div>
        </div>
      </div>

      {/* Video Info Panel */}
      {showInfo && (
        <div className="mt-3 bg-surface rounded-lg border border-border-light p-4 animate-slide-up">
          <h4 className="font-semibold text-text-primary mb-2 text-sm">Thông tin video</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Tiêu đề:</span>
              <span className="text-text-primary font-medium">{title}</span>
            </div>
            {description && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Mô tả:</span>
                <span className="text-text-primary text-right">{description}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-text-secondary">Nguồn:</span>
              <span className="text-primary-30">YouTube</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;