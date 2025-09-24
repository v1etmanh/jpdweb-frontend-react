import { useState } from "react";
import FlashCardComponent from "./FlashCardComponent";
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";
import { Button, Container, Row, Col } from "react-bootstrap";

export default function FlashCardContainer({ flashcards, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex === flashcards.length - 1) onComplete();
    setCurrentIndex((prevIndex) =>
      prevIndex < flashcards.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePreNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  if (!flashcards || flashcards.length === 0) {
    return <p>Không có flashcard nào.</p>;
  }

  return (
    <Container className="text-center mt-4">
      <FlashCardComponent
        frontText={flashcards[currentIndex].word}
        backText={flashcards[currentIndex].meaning}
        currentIndex={currentIndex}
        totalCards={flashcards.length}
      />

      <Row className="justify-content-center mt-4">
        <Col xs="auto">
          <Button
            variant="primary"
            onClick={handlePreNext}
            className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow"
          >
            <ArrowLeft />
            Trước
          </Button>
        </Col>
        <Col xs="auto">
          <Button
            variant="primary"
            onClick={handleNext}
            className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow"
          >
            Tiếp
            <ArrowRight />
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
