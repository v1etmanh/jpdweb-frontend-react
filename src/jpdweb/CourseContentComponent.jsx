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
  // ✅ Fixed: Use contentType instead of contentid to match route
 
  

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

  const defineContent = () => {
    if (!data) return null;

    switch (data[0].typeOfContent) {
      case 'FLASHCARD':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <FlashCardContainer 
              flashcards={data} 
              onComplete={onComplete} 
               language={language}
            />
          </div>
        );

      case 'GAPFILL':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <GapFillContainer 
              questions={data} 
              onComplete={onComplete} 
            />
          </div>
        );

      case 'MULTIPLE_CHOICE':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <MultipleChoicContainer 
              quizData={data} 
              onComplete={onComplete} 
            />
          </div>
        );

      case 'WRITING':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <WritingContainer 
              writingTasks={data} 
              onComplete={onComplete} 
            />
          </div>
        );

      case 'SPEAKING_PASSAGE':
        return (
          <div className="max-w-6xl mx-auto p-6">
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
          <div className="max-w-6xl mx-auto p-6">
            <SpeakingPage 
              paragraphs={null}
              pictureAndQuestions={data}
              isSave={false}
              postP={handlePost}
              language={language

              }
            />
          </div>
        );

      case 'LISTEN_CHOICE':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <ListenChoiceContainer 
              questions={data} 
              onComplete={onComplete} 
              language={language}
            />
          </div>
        );

      case 'READING':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <PassageContainer 
              passageContent={data} 
              isSave={false}
              postP={onComplete} 
            />
          </div>
        );

      case 'VIDEO':
        return (
          <div className="max-w-6xl mx-auto p-6">
            <VideoContainer videos={data} 
            onComplete={onComplete}/>
          </div>
        );

      case 'PDF':
        return (
          <div className="max-w-6xl mx-auto p-6">
            <PdfContainer 
              pdfs={data}  
              onComplete={onComplete}
            />
          </div>
        );

      default:
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              Unknown content type: {data[0].typeOfContent}
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h2 className="text-lg font-semibold mb-2">Error Loading Content</h2>
            <p>{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Content</h1>
              <p className="text-gray-600 mt-1">
                Module: {moduleid} | Content: {contentType}
              </p>
            </div>
            {data && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {data?.contentType?.replace(/_/g, ' ')}

              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        {defineContent()}
      </div>
    </div>
  );
}