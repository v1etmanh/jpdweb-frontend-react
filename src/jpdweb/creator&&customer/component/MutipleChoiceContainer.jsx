import { useEffect, useState } from "react";
import QuestionCard from "./MultipleChoiceComponent";
import { ArrowLeft, ArrowRight, CheckCircleFill } from "react-bootstrap-icons";
import { Button, Row, Col, FormLabel, ProgressBar, Card } from "react-bootstrap";

export default function MultipleChoiceContainer({ quizData, isFeedBack = false, onComplete }) {
  const [showCompleteEffect, setShowCompleteEffect] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numTrueAns, setNumTrueAns] = useState(0);
  const [finished, setFinished] = useState(false);

  const handlePreNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev < quizData.length - 1 ? prev + 1 : prev
    );
  };

  const increNum = () => {
    setNumTrueAns(prev => prev + 1);
  };

  useEffect(() => {
    if (
      !finished &&
      quizData.length > 0 &&
      numTrueAns >= (quizData.length / 2)
    ) {
      setFinished(true);
      onComplete();
      if (currentIndex === quizData.length - 1) {
        setShowCompleteEffect(true);
        setTimeout(() => {
          setShowCompleteEffect(false);
        }, 3000);
      }
    }
  }, [numTrueAns, quizData.length, finished, onComplete, currentIndex]);

  const progress = ((currentIndex + 1) / quizData.length) * 100;

  return (
    <div className="quiz-container">
      {/* Thanh tiến độ */}
      <div className="progress-section">
        <FormLabel className="progress-label">
          Câu {currentIndex + 1} / {quizData.length}
        </FormLabel>
        <ProgressBar 
          now={progress} 
          className="custom-progress-bar"
        />
        <div className="progress-stats">
          <span className="correct-count">
            Đã trả lời đúng: <strong>{numTrueAns}</strong> / {quizData.length} câu
          </span>
        </div>
      </div>

      {/* Hiệu ứng hoàn thành */}
      {showCompleteEffect && (
        <div className="completion-effect">
          <CheckCircleFill className="completion-icon" />
          <div className="completion-title">🎉 Chúc mừng! 🎉</div>
          <div className="completion-subtitle">
            Bạn đã hoàn thành bài quiz!
          </div>
        </div>
      )}

      {/* Card câu hỏi */}
      <Card className="question-card">
        <QuestionCard
          mulptipleQuizz={quizData[currentIndex]}
          isFeedBack={isFeedBack}
          increNum={increNum}
        />
      </Card>
     
      {/* Navigation Buttons */}
      <Row className="navigation-buttons">
        <Col xs="auto">
          <Button
            variant="primary"
            onClick={handlePreNext}
            disabled={currentIndex === 0}
            className="nav-button prev-button"
          >
            <ArrowLeft className="button-icon" />
            Trước
          </Button>
        </Col>
        <Col xs="auto">
          <Button
            variant="primary"
            onClick={goToNext}
            disabled={currentIndex === quizData.length - 1}
            className="nav-button next-button"
          >
            Tiếp
            <ArrowRight className="button-icon" />
          </Button>
        </Col>
      </Row>

      <style jsx>{`
        .quiz-container {
          background: #F1F5F9;
          min-height: 100vh;
          padding: 2rem;
          font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
        }

        .progress-section {
          background: white;
          padding: 1.5rem;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin-bottom: 1.5rem;
        }

        .progress-label {
          font-weight: 700;
          color: #1E293B;
          font-size: 1.1rem;
          display: block;
          margin-bottom: 0.75rem;
        }

        .custom-progress-bar {
          height: 8px;
          background-color: #E2E8F0;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .custom-progress-bar .progress-bar {
          background-color: #06B6D4;
          transition: width 0.3s ease;
        }

        .progress-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .correct-count {
          color: #64748B;
          font-size: 0.9rem;
        }

        .correct-count strong {
          color: #06B6D4;
        }

        .question-card {
          border: none;
          border-radius: 16px;
          box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          margin-bottom: 2rem;
          transition: transform 0.2s ease;
        }

        .question-card:hover {
          transform: translateY(-2px);
        }

        .navigation-buttons {
          margin-top: 2rem;
          gap: 1rem;
        }

        .nav-button {
          background: #06B6D4;
          border: none;
          border-radius: 50px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-button:hover:not(:disabled) {
          background: #0891B2;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(6, 182, 212, 0.4);
        }

        .nav-button:disabled {
          background: #CBD5E1;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .button-icon {
          font-size: 1.1rem;
        }

        .completion-effect {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9999;
          background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
          border-radius: 24px;
          padding: 3rem;
          color: white;
          text-align: center;
          box-shadow: 0 20px 40px rgba(249, 115, 22, 0.3);
          animation: bounce 0.6s ease-in-out;
        }

        .completion-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .completion-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .completion-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translate(-50%, -50%) translateY(0);
          }
          40% {
            transform: translate(-50%, -50%) translateY(-30px);
          }
          60% {
            transform: translate(-50%, -50%) translateY(-15px);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .quiz-container {
            padding: 1rem;
          }
          
          .progress-section {
            padding: 1rem;
          }
          
          .nav-button {
            padding: 0.6rem 1.2rem;
          }
          
          .completion-effect {
            padding: 2rem;
            margin: 1rem;
          }
          
          .completion-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}