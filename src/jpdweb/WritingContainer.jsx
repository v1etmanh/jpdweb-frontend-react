import { useState } from "react";
import WritingComponent from "./WritingComponent";
import { Button, Container, Row, Col } from "react-bootstrap";
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";

export default function WritingContainer({ writingTasks, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex === writingTasks.length - 1) {
      onComplete();
    } else {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  if (!writingTasks || writingTasks.length === 0) {
    return <div>Không có bài viết nào.</div>;
  }

  return (
    <Container fluid className="py-5">
      <Row className="mb-4">
        <Col className="text-center">
          <h2>Writing Task {currentIndex + 1} / {writingTasks.length}</h2>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <WritingComponent 
            data={writingTasks[currentIndex]} 
            onComplete={handleNext}
          />
        </Col>
      </Row>

      <Row className="justify-content-center gap-3">
        <Col xs="auto">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="me-2" />
            Trước
          </Button>
        </Col>
        <Col xs="auto">
          <Button
            variant="primary"
            onClick={handleNext}
          >
            Tiếp
            <ArrowRight className="ms-2" />
          </Button>
        </Col>
      </Row>
    </Container>
  );
}