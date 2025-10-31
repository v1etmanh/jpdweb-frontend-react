import { useLocation, useParams } from "react-router-dom";
import FlashCardContainer from "./FlashCardContainer";
import GapFillContainer from "./GapfillContainer";
import ListenChoiceContainer from "./ListenChoiceContainer";
import MultipleChoicContainer from "./MutipleChoiceContainer";
import PassageContainer from "./PassageContainer";
import SpeakingPage from "./SpeakingPage";
import WritingComponent from "./WritingComponent";
import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayerComponent";
import PdfComponent from "./PdfComponent";
import WritingContainer from "./WritingContainer";
import VideoContainer from "./VideoContainer";
import PdfContainer from "./PdfContainer";
import { customerApi } from "./api/customerApi";
import { showSuccessNotification, showWarningNotification } from "./api/apiClient";

export default function CourseContentComponent({contents,moduleid,contentType,language,isFinish,onComplete}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const{id}=useParams()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!contents) throw new Error("No content received");
        console.log("Loaded contents:", contents);

        setData(contents);
      } catch (err) {
        setError("Failed to load content");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (moduleid && contentType) {
      fetchData();
    }
  }, [moduleid, contentType, contents]);

  const handlePost = () => {
    console.log('Speaking exercise completed!');
    onComplete();
  };

  const formatContentType = (type) => {
    return type
      ?.split('_')
      ?.map(word => word.charAt(0) + word.slice(1).toLowerCase())
      ?.join(' ') || '';
  };

  // Các loại content có thể đánh dấu hoàn thành bằng nút
  const canMarkAsComplete = () => {
    const completableTypes = ['VIDEO', 'PDF', 'FLASHCARD'];
    return completableTypes.includes(contentType);
  };

  const defineContent = () => {
    if (!data) return null;

    switch (data[0].typeOfContent) {
      case 'FLASHCARD':
        return (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <FlashCardContainer 
              flashcards={data} 
              onComplete={onComplete} 
              language={language}
            />
          </div>
        );

      case 'GAPFILL':
        return (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <GapFillContainer 
              questions={data} 
              onComplete={onComplete} 
            />
          </div>
        );

      case 'MULTIPLE_CHOICE':
        return (
          <div className="w-[90%] mx-auto p-6">
            <MultipleChoicContainer 
              quizData={data} 
              onComplete={onComplete} 
            />
          </div>
        );

      case 'WRITING':
        return (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <WritingContainer 
              writingTasks={data} 
              onComplete={onComplete} 
            />
          </div>
        );

      case 'SPEAKING_PASSAGE':
        return (
          <div className="max-w-6xl mx-auto animate-fade-in">
            <SpeakingPage 
              paragraphs={data}
              pictureAndQuestions={null}
              isSave={false}
              postP={handlePost}
              language={language}
            />
          </div>
        );

      case 'SPEAKING_PICTURE':
        return (
          <div className="max-w-6xl mx-auto animate-fade-in">
            <SpeakingPage 
              paragraphs={null}
              pictureAndQuestions={data}
              isSave={false}
              postP={handlePost}
              language={language}
            />
          </div>
        );

      case 'LISTEN_CHOICE':
        return (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <ListenChoiceContainer 
              questions={data} 
              onComplete={onComplete} 
              language={language}
            />
          </div>
        );

      case 'READING':
        return (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <PassageContainer 
              passageContent={data} 
              isSave={false}
              postP={onComplete} 
            />
          </div>
        );

      case 'VIDEO':
        return (
          <div className="max-w-6xl mx-auto animate-fade-in">
            <VideoContainer videos={data} 
            onComplete={onComplete}/>
          </div>
        );

      case 'PDF':
        return (
          <div className="max-w-6xl mx-auto animate-fade-in">
            <PdfContainer 
              pdfs={data}  
              onComplete={onComplete}
            />
          </div>
        );

      default:
        return (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-2xl shadow-soft">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-100 rounded-xl">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900">Loại nội dung chưa được hỗ trợ</h3>
                  <p className="text-amber-700 text-sm mt-1">Không thể hiển thị: {data[0].typeOfContent}</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px] bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl">
        <div className="text-center animate-pulse-soft">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-30/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-30 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-text-secondary mt-4 font-medium">Đang tải nội dung học tập...</p>
          <p className="text-text-muted text-sm mt-2">Sẵn sàng cho trải nghiệm học tập tuyệt vời</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <div className="max-w-md mx-auto text-center animate-scale-in">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-soft mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-red-900 mb-2">Không thể tải nội dung</h2>
            <p className="text-red-700">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary-30 hover:bg-primary-dark text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-medium hover:shadow-card font-medium"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <span>Thử lại</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[500px] bg-background rounded-2xl">
      {/* Content Header - Modern 2025 Design */}
      <div className="bg-gradient-to-r from-primary-30/5 to-primary-30/10 border-b border-border-light/50 rounded-t-2xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white rounded-xl shadow-soft border border-border-light">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-30 to-accent-10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z"/>
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary bg-gradient-to-r from-text-primary to-text-primary/80 bg-clip-text text-transparent">
                  Nội dung học tập
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2 text-text-secondary">
                    <svg className="w-4 h-4 text-primary-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                    <span className="text-sm font-medium">Module {moduleid}</span>
                  </div>
                  <div className="w-px h-4 bg-border-light"></div>
                  <div className="flex items-center space-x-2 text-text-secondary">
                    <svg className="w-4 h-4 text-accent-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <span className="text-sm font-medium">{formatContentType(contentType)}</span>
                  </div>
                </div>
              </div>
            </div>

            {data && (
              <div className="flex items-center space-x-3">
                {isFinish && (
                  <div className="flex items-center space-x-2 bg-status-completed/10 text-status-completed px-4 py-2 rounded-xl border border-status-completed/20">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-sm font-medium">Đã hoàn thành</span>
                  </div>
                )}
                <div className="bg-white px-4 py-2 rounded-xl shadow-soft border border-border-light">
                  <span className="text-text-primary text-sm font-medium bg-gradient-to-r from-primary-30 to-accent-10 bg-clip-text text-transparent">
                    {formatContentType(data[0]?.typeOfContent)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 animate-slide-up">
        {defineContent()}
      </div>

      {/* Completion Status Bar - Chỉ hiển thị với các loại content có thể đánh dấu hoàn thành */}
      {!isFinish && data && canMarkAsComplete() && (
        <div className="border-t border-border-light/50 bg-white/50 mt-8">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-30/10 rounded-lg">
                  <svg className="w-5 h-5 text-primary-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-text-primary font-medium">Hoàn thành bài học để tiếp tục</p>
                  <p className="text-text-secondary text-sm">Hoàn thành nội dung này để mở khóa tiến độ học tập</p>
                </div>
              </div>
              <button
                onClick={onComplete}
                className="bg-gradient-to-r from-primary-30 to-accent-10 hover:from-primary-dark hover:to-accent-dark text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-medium hover:shadow-card font-medium transform hover:scale-105"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Đánh dấu hoàn thành</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thông báo cho các loại content cần hoàn thành bằng cách làm bài */}
      {!isFinish && data && !canMarkAsComplete() && (
        <div className="border-t border-border-light/50 bg-gradient-to-r from-blue-50 to-indigo-50/50 mt-8">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-30/20 rounded-lg">
                <svg className="w-5 h-5 text-primary-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p className="text-text-primary font-medium">Hoàn thành bài tập để tiếp tục</p>
                <p className="text-text-secondary text-sm">Làm đầy đủ các câu hỏi và bài tập để tự động đánh dấu hoàn thành</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}