import { useEffect, useState } from "react";
import QuestionCard from "./MultipleChoiceQuestionComponent";
import { ArrowLeft, ArrowRight, CheckCircleFill } from "react-bootstrap-icons";
import { Button, Row, Col, FormLabel, ProgressBar } from "react-bootstrap";

export default function MultipleChoicContainer({quizData, isFeedBack=false, onComplete}) {
  const [showCompleteEffect, setShowCompleteEffect] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numTrueAns, setNumTrueAns] = useState(0);
  const [finished, setFinished] = useState(false);

  const handlePreNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev < quizData.length - 1 ? prev + 1 : prev // không quay lại từ đầu
    );
  };

  // Sửa callback để tránh stale state
  const increNum = () => {
    setNumTrueAns(prev => prev + 1);
  };

  // Sửa useEffect để tránh gọi onComplete nhiều lần
  useEffect(() => {
    if (
      !finished &&
      quizData.length > 0 &&
      numTrueAns >= (quizData.length / 2)
    ) {
      setFinished(true);
      
      
      onComplete();
      if(currentIndex==quizData.length-1)
      {
      setShowCompleteEffect(true);
      
      // Ẩn hiệu ứng sau 3 giây
      setTimeout(() => {
        setShowCompleteEffect(false);
      }, 3000);
    }
    }
  }, [numTrueAns, quizData.length, finished, onComplete]);

  const progress = ((currentIndex + 1) / quizData.length) * 100;

  return (
    <div style={{ textAlign: "center", position: "relative" }}>
      {/* Thanh tiến độ */}
      <div className="mb-4">
        <FormLabel className="fw-bold mb-2">
          Câu {currentIndex + 1} / {quizData.length}
        </FormLabel>
        <ProgressBar 
          now={progress} 
          variant="success"
          style={{ height: "8px" }}
          className="mb-2"
        />
        <small className="text-muted">
          Đã trả lời đúng: {numTrueAns} / {quizData.length} câu
        </small>
      </div>

      {/* Hiệu ứng hoàn thành */}
      {showCompleteEffect && (
        <div 
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            background: "rgba(0, 0, 0, 0.8)",
            borderRadius: "20px",
            padding: "30px",
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
            animation: "bounce 0.6s ease-in-out",
            textAlign: "center"
          }}
        >
          <CheckCircleFill size={60} className="text-success mb-3" />
          <div>🎉 Chúc mừng! 🎉</div>
          <div style={{ fontSize: "18px", marginTop: "10px" }}>
            Bạn đã hoàn thành bài quiz!
          </div>
        </div>
      )}

      <QuestionCard
        mulptipleQuizz={quizData[currentIndex]}
        isFeedBack={isFeedBack}
        increNum={increNum}
      />
     
      <Row className="justify-content-center mt-4">
        <Col xs="auto">
          <Button
            variant="primary"
            onClick={handlePreNext}
            disabled={currentIndex === 0}
            className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow"
          >
            <ArrowLeft />
            Trước
          </Button>
        </Col>
        <Col xs="auto">
          <Button
            variant="primary"
            onClick={goToNext}
            disabled={currentIndex === quizData.length - 1}
            className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow"
          >
            Tiếp
            <ArrowRight />
          </Button>
        </Col>
      </Row>

      {/* CSS Animation */}
      <style jsx>{`
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
      `}</style>
    </div>
  );
}