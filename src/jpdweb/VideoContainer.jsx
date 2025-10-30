import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  List,
  Play,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Button, Container, Row, Col } from "react-bootstrap";
import VideoPlayer from "./VideoPlayerComponent";

export default function VideoContainer({ videos, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const handleNext = () => {
    if (currentIndex === videos.length - 1) {
      onComplete();
    } else {
      setCurrentIndex(currentIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSelectVideo = (index) => {
    setCurrentIndex(index);
    setShowPlaylist(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!videos || videos.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
        <p className="text-red-600 font-medium text-sm">Không có video nào.</p>
      </div>
    );
  }

  const currentVideo = videos[currentIndex];

  return (
    <Container fluid className="py-4 px-3 bg-background min-h-screen">
      {/* Header - Very Compact */}
      <Row className="mb-3">
        <Col>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-text-primary font-sans">
                Bài Giảng Video
              </h1>
              <p className="text-text-secondary text-xs mt-1">
                Video {currentIndex + 1} / {videos.length}
              </p>
            </div>
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary-30 hover:bg-primary-dark text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-xs"
            >
              <List className="w-3 h-3" />
              <span>Playlist</span>
            </button>
          </div>
        </Col>
      </Row>

      {/* Playlist on Top when Showed */}
      {showPlaylist && (
        <Row className="mb-3 animate-scale-in">
          <Col>
            <div className="bg-surface rounded-lg shadow-sm p-3 max-h-[200px] overflow-y-auto border border-border-light">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-text-primary font-sans">
                  Danh sách video ({videos.length} bài)
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {videos.map((video, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectVideo(index)}
                    className={`w-full text-left p-2 rounded-lg transition-all duration-200 border text-sm ${
                      currentIndex === index
                        ? "bg-primary-30 text-white border-primary-30 shadow-sm"
                        : "bg-surface text-text-primary border-border-light hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded ${
                          currentIndex === index
                            ? "bg-white bg-opacity-20"
                            : "bg-primary-30 bg-opacity-10 text-primary-30"
                        }`}
                      >
                        {currentIndex === index ? (
                          <Play className="w-2.5 h-2.5 fill-current" />
                        ) : (
                          <span className="text-xs font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium text-left leading-tight line-clamp-1 ${
                            currentIndex === index
                              ? "text-white"
                              : "text-text-primary"
                          }`}
                        >
                          {video.title}
                        </p>
                        {video.duration && (
                          <p
                            className={`text-xs mt-0.5 ${
                              currentIndex === index
                                ? "text-white text-opacity-80"
                                : "text-text-muted"
                            }`}
                          >
                            {video.duration}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      )}

      {/* Main Video Player - Larger */}
      <Row className="mb-4">
        <Col>
          <div className="bg-surface rounded-xl shadow-sm p-3 border border-border-light">
            <VideoPlayer
              videoUrl={currentVideo.videoUrl}
              title={currentVideo.title}
              description={currentVideo.durationMinutes}
              width="100%"
              height="420px"
              showControls={true}
              autoplay={false}
            />
          </div>
        </Col>
      </Row>

      {/* Video Info - Compact */}
      <Row className="mb-4">
        <Col>
          <div className="bg-gradient-to-r from-primary-30 to-primary-dark rounded-lg p-3 text-white shadow-sm">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-6 h-6 bg-white bg-opacity-20 rounded flex items-center justify-center">
                <Play className="w-3 h-3 fill-current" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold mb-1 font-sans line-clamp-2">
                  {currentVideo.title}
                </h3>
                {currentVideo.description && (
                  <p className="text-white text-opacity-90 text-xs leading-relaxed mb-2 line-clamp-2">
                    {currentVideo.description}
                  </p>
                )}
                <div className="flex items-center gap-3 flex-wrap">
                  {currentVideo.duration && (
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="w-3 h-3 text-white text-opacity-80" />
                      <span>{currentVideo.duration}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs">
                    <CheckCircle className="w-3 h-3 text-white text-opacity-80" />
                    <span>
                      {currentIndex + 1}/{videos.length} bài
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Navigation Controls - Compact */}
      <Row>
        <Col xs={12}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-surface rounded-lg p-3 shadow-sm border border-border-light">
            <Button
              variant="outline-secondary"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              size="sm"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-main hover:border-primary-30 hover:bg-primary-30 hover:text-white transition-all duration-200 font-medium text-xs"
            >
              <ArrowLeft className="w-3 h-3" />
              Trước
            </Button>

            {/* Progress Indicator */}
            <div className="flex-1 max-w-xs flex flex-col items-center gap-1">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-primary-30 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / videos.length) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="flex items-center gap-1 text-text-secondary text-xs">
                <span className="font-medium">
                  {currentIndex + 1}/{videos.length}
                </span>
                <span>• Tiến độ</span>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleNext}
              size="sm"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md text-xs"
            >
              Tiếp
              <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
