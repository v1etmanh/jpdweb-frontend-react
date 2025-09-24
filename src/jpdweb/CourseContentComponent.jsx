import { useParams } from "react-router-dom"
import FlashCardContainer from "./FlashCardContainer"
import GapFillContainer from "./GapfillContainer"
import ListenChoiceContainer from "./ListenChoiceContainer"
import MultipleChoicContainer from "./MutipleChoiceContainer"
import PassageContainer from "./PassageContainer"
import SpeakingPage from "./SpeakingPage" // Import component đã sửa
import WritingComponent from "./WritingComponent"
import { useEffect, useState } from "react"
import VideoPlayer from "./VideoPlayerComponent"
import PdfComponent from "./PdfComponent"

// Import mock data
import {
  
  gapFillMockData,
  listeningChoiceMockData,
  multipleQuizMockData,
  mockPassageData,
  urlvideo,
  writingMock,
  mockParagraphsData,
  mockPictureAndQuestionsData,
  flashcards
} from "./MockData" // Adjust path as needed

export default function CourseContentComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { moduleid, contentid } = useParams();

  useEffect(() => {
    // Simulate API call with mock data
    const fetchData = async () => {
      setLoading(true)
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock logic để quyết định loại content dựa trên contentid
        let mockData = null
        let contentType = null

        // Simple logic để assign content type dựa trên contentid
        const id = parseInt(contentid)
        if (id === 1) {
          contentType = 'FLASHCARD'
          mockData = { contentType, data: flashcards }
        } else if (id === 2) {
          contentType = 'GAPFILL'
          mockData = { contentType, data: gapFillMockData }
        } else if (id === 3) {
          contentType = 'MULTIPLE_CHOICE'
          mockData = { contentType, data: multipleQuizMockData }
        } else if (id === 4) {
          contentType = 'WRITING'
          mockData = { contentType, data: writingMock }
        } else if (id === 5) {
          contentType = 'SPEAKING_PASSAGE'
          mockData = { contentType, data: mockParagraphsData }
        } else if (id === 6) {
          contentType = 'SPEAKING_PICTURE'
          mockData = { contentType, data: mockPictureAndQuestionsData }
        } else if (id === 7) {
          contentType = 'LISTEN_CHOICE'
          mockData = { contentType, data: listeningChoiceMockData }
        } else if (id === 8) {
          contentType = 'READING'
          mockData = { contentType, data: mockPassageData }
        } else if (id === 9) {
          contentType = 'VIDEO'
          mockData = { contentType, data: urlvideo.videoUrl }
        } else if (id === 10) {
          contentType = 'PDF'
          mockData = { contentType, data: { courseId: 1, pdfId: 2 } }
        } else {
          // Default fallback
          contentType = 'MULTIPLE_CHOICE'
          mockData = { contentType, data: multipleQuizMockData }
        }

        setData(mockData)
      } catch (err) {
        setError('Failed to load content')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (moduleid && contentid) {
      fetchData()
    }
  }, [moduleid, contentid])

  const onComplete = () => {
    // Call API to post customer progress and answers
    console.log('Content completed!', { moduleid, contentid })
    // You can implement actual API call here
  }

  const handlePost = () => {
    console.log('Speaking exercise completed!')
    onComplete()
  }

  const defineContent = () => {
    if (!data) return null

    switch (data.contentType) {
      case 'FLASHCARD':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <FlashCardContainer 
              flashcards={data.data} 
              onComplete={onComplete} 
            />
          </div>
        )

      case 'GAPFILL':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <GapFillContainer 
              questions={data.data} 
              onComplete={onComplete} 
            />
          </div>
        )

      case 'MULTIPLE_CHOICE':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <MultipleChoicContainer 
              quizData={data.data} 
              onComplete={onComplete} 
            />
          </div>
        )

      case 'WRITING':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <WritingComponent 
              data={data.data} 
              onComplete={onComplete} 
            />
          </div>
        )

      case 'SPEAKING_PASSAGE':
        return (
          <div className="max-w-6xl mx-auto p-6">
            <SpeakingPage 
              paragraphs={data.data}
              pictureAndQuestions={null}
              isSave={false}
              postP={handlePost}
            />
          </div>
        )

      case 'SPEAKING_PICTURE':
        return (
          <div className="max-w-6xl mx-auto p-6">
            <SpeakingPage 
              paragraphs={null}
              pictureAndQuestions={data.data}
              isSave={false}
              postP={handlePost}
            />
          </div>
        )

      case 'LISTEN_CHOICE':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <ListenChoiceContainer 
              questions={data.data} 
              onComplete={onComplete} 
            />
          </div>
        )

      case 'READING':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <PassageContainer 
              passageContent={data.data} 
              isSave={false}
               postP={onComplete} 
            />
          </div>
        )

      case 'VIDEO':
        return (
          <div className="max-w-6xl mx-auto p-6">
            <VideoPlayer videoUrl={data.data} />
          </div>
        )

      case 'PDF':
        return (
          <div className="max-w-6xl mx-auto p-6">
            <PdfComponent 
              course_id={data.data.courseId}  
              pdf_id={data.data.pdfId}  
            />
          </div>
        )

      default:
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              Unknown content type: {data.contentType}
            </div>
          </div>
        )
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading content...</p>
        </div>
      </div>
    )
  }

  // Error state
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
    )
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
                Module: {moduleid} | Content: {contentid}
              </p>
            </div>
            {data && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {data.contentType.replace('_', ' ')}
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
  )
}