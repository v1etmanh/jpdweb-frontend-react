import React, { useState } from 'react';

import { ArrowLeft, ArrowRight, List } from 'lucide-react';
import { Button, Container, Row, Col } from "react-bootstrap";
import VideoPlayer from './VideoPlayerComponent';

export default function VideoContainer({ videos, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const handleNext = () => {
    if (currentIndex === videos.length - 1) {
      onComplete();
    } else {
      setCurrentIndex(currentIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectVideo = (index) => {
    setCurrentIndex(index);
    setShowPlaylist(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!videos || videos.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600 font-semibold">Không có video nào.</p>
      </div>
    );
  }

  const currentVideo = videos[currentIndex];

  return (
    <Container fluid className="py-6 px-4">
      {/* Header */}
      <Row className="mb-6">
        <Col>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bài Giảng Video
              </h1>
              <p className="text-gray-600">
                Video {currentIndex + 1} / {videos.length}
              </p>
            </div>
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              <List className="w-5 h-5" />
              Danh sách ({videos.length})
            </button>
          </div>
        </Col>
      </Row>

      <Row className="gap-4">
        {/* Main Video Player */}
        <Col lg={showPlaylist ? 9 : 12}>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <VideoPlayer
              videoUrl={currentVideo.videoUrl}
              title={currentVideo.title}
              description={currentVideo.durationMinutes}
              width="100%"
              height="500px"
              showControls={true}
              autoplay={false}
            />
          </div>
        </Col>

        {/* Playlist Sidebar */}
        {showPlaylist && (
          <Col lg={3}>
            <div className="bg-white rounded-lg shadow-lg p-4 max-h-[600px] overflow-y-auto">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Danh sách video</h3>
              <div className="space-y-2">
                {videos.map((video, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectVideo(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentIndex === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded bg-opacity-50 bg-gray-600 text-xs font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate text-sm">
                          {video.title}
                        </p>
                        {video.duration && (
                          <p className="text-xs opacity-75">{video.duration}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Col>
        )}
      </Row>

      {/* Navigation Controls */}
      <Row className="mt-8 justify-content-center gap-3">
        <Col xs="auto">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            size="lg"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Trước
          </Button>
        </Col>

        {/* Progress Indicator */}
        <Col xs="auto" className="flex items-center">
          <div className="bg-gray-200 rounded-full h-2 w-48">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / videos.length) * 100}%`,
              }}
            ></div>
          </div>
          <span className="ml-3 text-gray-600 font-semibold whitespace-nowrap">
            {currentIndex + 1}/{videos.length}
          </span>
        </Col>

        <Col xs="auto">
          <Button
            variant={currentIndex === videos.length - 1 ? "success" : "primary"}
            onClick={handleNext}
            size="lg"
            className="flex items-center gap-2"
          >
            {currentIndex === videos.length - 1 ? "Hoàn Thành" : "Tiếp"}
            {currentIndex !== videos.length - 1 && (
              <ArrowRight className="w-5 h-5" />
            )}
          </Button>
        </Col>
      </Row>

      {/* Video Info */}
      <Row className="mt-8">
        <Col>
          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {currentVideo.title}
            </h3>
            {currentVideo.description && (
              <p className="text-gray-700">{currentVideo.description}</p>
            )}
            {currentVideo.duration && (
              <p className="text-sm text-gray-600 mt-3">
                <strong>Thời lượng:</strong> {currentVideo.duration}
              </p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}