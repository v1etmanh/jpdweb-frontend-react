import { useEffect, useState } from "react";
import { aiApi } from "./api/aiApi";
import { FileDown, BookOpen, X, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Button, Container, Row, Col, Card } from "react-bootstrap";

export default function WritingContainer({ writingTasks, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [writingMock, setWritingMock] = useState(null);
  const [answer, setAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    if (writingTasks && writingTasks.length > 0) {
      setWritingMock(writingTasks[currentIndex]);
      setAnswer("");
      setEvaluationResult(null);
    }
  }, [writingTasks, currentIndex]);

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

  const handleSubmit = async () => {
    if (!answer || answer.trim() === "") {
      alert("Vui lòng nhập câu trả lời trước khi nộp bài.");
      return;
    }

    setIsEvaluating(true);
    try {
      const payload = {
        writingText: answer.trim(),
        language: "ENGLISH"
      };

      const response = await aiApi.evaluateWriting(payload);
      const result = response.data;
      const normalizedResult = {
        grammarScore: result.grammarScore || result.grammar || 0,
        vocabularyScore: result.vocabularyScore || result.vocabulary || 0,
        feedback: result.feedback || "Không có nhận xét"
      };

      setEvaluationResult(normalizedResult);
    } catch (error) {
      console.error("Lỗi khi chấm điểm:", error);
      alert("Có lỗi xảy ra khi chấm điểm. Vui lòng thử lại.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const downloadReport = () => {
    if (!evaluationResult) return;

    const reportContent = `
=================================================
            BÁO CÁO ĐÁNH GIÁ BÀI VIẾT
=================================================

📊 ĐIỂM SỐ:
-------------------------------------------------
• Ngữ pháp (Grammar):     ${evaluationResult.grammarScore.toFixed(1)}/10
• Từ vựng (Vocabulary):   ${evaluationResult.vocabularyScore.toFixed(1)}/10
• Điểm trung bình:        ${((evaluationResult.grammarScore + evaluationResult.vocabularyScore) / 2).toFixed(1)}/10

📝 NHẬN XÉT CHI TIẾT:
-------------------------------------------------
${evaluationResult.feedback}

✍️ BÀI VIẾT CỦA BẠN:
-------------------------------------------------
${answer}

=================================================
Ngày tạo: ${new Date().toLocaleString('vi-VN')}
=================================================
    `.trim();

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Writing_Report_${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const selectTemplate = (template) => {
    setAnswer(template);
    setShowTemplates(false);
  };

  if (!writingTasks || writingTasks.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center text-text-secondary">
          <BookOpen size={48} className="mb-3 text-border-dark" />
          <h4>Không có bài viết nào.</h4>
        </div>
      </div>
    );
  }

  if (!writingMock) return <div className="min-vh-100 bg-background d-flex align-items-center justify-content-center text-text-primary">Đang tải...</div>;

  return (
    <Container fluid className="py-4 bg-background min-vh-100">
      <Row className="justify-content-center">
        <Col lg={12}>
          {/* Header */}
          <Card className="border-0 shadow-card mb-4">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="h3 mb-1 text-text-primary fw-bold">
                    Writing Practice
                  </h2>
                  <p className="text-text-secondary mb-0">
                    Hoàn thành bài viết để nhận đánh giá chi tiết
                  </p>
                </div>
                <div className="text-end">
                  <span className="badge bg-primary-30 text-white px-3 py-2 rounded-pill fs-6">
                    Task {currentIndex + 1} / {writingTasks.length}
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Main Content - Single Card */}
          <Card className="border-0 shadow-card">
            <Card.Body className="p-0">
              <Row className="g-0">
                {/* Question Section - Top */}
                <Col xs={12}>
                  <div className="p-4 border-bottom border-border-light">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="bg-primary-30 text-white p-2 rounded-circle">
                        <BookOpen size={20} />
                      </div>
                      <h3 className="h5 mb-0 text-text-primary fw-bold">Đề bài</h3>
                    </div>

                    {writingMock.img && (
                      <div className="mb-4">
                        <img
                          src={writingMock.img}
                          alt="writing-question"
                          className="img-fluid rounded-lg border border-border-light"
                          style={{ maxHeight: '300px', objectFit: 'contain' }}
                        />
                      </div>
                    )}

                    <div className="bg-surface p-4 rounded-lg border border-border-light mb-3">
                      <p className="text-text-primary mb-0 leading-relaxed fs-6">
                        {writingMock.question}
                      </p>
                    </div>

                    {/* Templates Button */}
                    {writingMock.templates && writingMock.templates.length > 0 && (
                      <Button
                        variant="outline-primary"
                        onClick={() => setShowTemplates(true)}
                        className="py-2 rounded-xl fw-medium border-2"
                      >
                        <BookOpen size={18} className="me-2" />
                        Xem bài viết mẫu ({writingMock.templates.length})
                      </Button>
                    )}
                  </div>
                </Col>

                {/* Answer Section - Bottom */}
                <Col xs={12}>
                  <div className="p-4">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="bg-status-completed text-white p-2 rounded-circle">
                        <FileDown size={20} />
                      </div>
                      <h3 className="h5 mb-0 text-text-primary fw-bold">Câu trả lời của bạn</h3>
                    </div>

                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Nhập câu trả lời của bạn ở đây..."
                      className="w-100 min-h-[200px] p-3 border border-border-main rounded-lg text-text-primary focus:outline-none focus:border-primary-30 focus:ring-3 focus:ring-primary-30/20 transition-all resize-none"
                      disabled={isEvaluating}
                      style={{ minHeight: '200px' }}
                    />

                    {/* Submit Button */}
                    <div className="mt-4 text-end">
                      <Button
                        onClick={handleSubmit}
                        disabled={isEvaluating || !answer.trim()}
                        className="py-3 px-5 rounded-xl fw-medium border-0 shadow-sm"
                        style={{ backgroundColor: '#06B6D4' }}
                      >
                        {isEvaluating ? (
                          <>
                            <Loader2 size={20} className="animate-spin me-2" />
                            Đang chấm điểm...
                          </>
                        ) : (
                          "Nộp bài để nhận đánh giá"
                        )}
                      </Button>
                    </div>

                    {/* Evaluation Result */}
                    {evaluationResult && (
                      <div className="mt-4 p-4 bg-surface rounded-lg border border-border-light">
                        <h4 className="h5 mb-3 text-text-primary fw-bold">🎯 Kết quả đánh giá</h4>
                        
                        <Row className="mb-3">
                          <Col md={6} className="mb-3">
                            <div className="text-center p-3 bg-background rounded-lg h-100">
                              <p className="text-sm text-text-secondary mb-1">Ngữ pháp</p>
                              <p className="h4 mb-0 fw-bold text-primary-30">
                                {evaluationResult.grammarScore.toFixed(1)}/10
                              </p>
                            </div>
                          </Col>
                          <Col md={6} className="mb-3">
                            <div className="text-center p-3 bg-background rounded-lg h-100">
                              <p className="text-sm text-text-secondary mb-1">Từ vựng</p>
                              <p className="h4 mb-0 fw-bold text-primary-30">
                                {evaluationResult.vocabularyScore.toFixed(1)}/10
                              </p>
                            </div>
                          </Col>
                        </Row>

                        <div className="mb-3">
                          <p className="text-sm text-text-secondary mb-2">Nhận xét chi tiết:</p>
                          <div className="p-3 bg-background rounded-lg">
                            <p className="text-text-primary mb-0 leading-relaxed">
                              {evaluationResult.feedback}
                            </p>
                          </div>
                        </div>

                        <Button
                          onClick={downloadReport}
                          variant="outline-success"
                          className="w-100 py-2 rounded-xl fw-medium border-2"
                        >
                          <FileDown size={18} className="me-2" />
                          Tải báo cáo về máy
                        </Button>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Navigation */}
          <Card className="border-0 shadow-soft bg-surface mt-4">
            <Card.Body className="p-3">
              <Row className="justify-content-between align-items-center">
                <Col xs="auto">
                  <Button
                    variant="outline-secondary"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="px-4 py-2 rounded-xl fw-medium border-2"
                  >
                    <ArrowLeft className="me-2" size={18} />
                    Quay lại
                  </Button>
                </Col>
                
                <Col xs="auto">
                  {currentIndex === writingTasks.length - 1 ? (
                    <Button
                      variant="success"
                      onClick={handleNext}
                      className="px-4 py-2 rounded-xl fw-medium border-0 shadow-sm"
                    >
                      Hoàn thành
                      <ArrowRight className="ms-2" size={18} />
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleNext}
                      className="px-4 py-2 rounded-xl fw-medium border-0 shadow-sm"
                      style={{ backgroundColor: '#06B6D4' }}
                    >
                      Tiếp theo
                      <ArrowRight className="ms-2" size={18} />
                    </Button>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content border-0 shadow-card">
              <div className="modal-header bg-primary-30 text-white">
                <h5 className="modal-title fw-bold">
                  📚 Bài viết mẫu
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowTemplates(false)}
                ></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {writingMock.templates.map((template, index) => (
                  <Card key={index} className="mb-3 border border-border-light">
                    <Card.Body className="p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-semibold text-text-primary mb-0">
                          Mẫu {index + 1}
                        </h6>
                        <Button
                          size="sm"
                          onClick={() => selectTemplate(template)}
                          className="rounded-lg"
                          style={{ backgroundColor: '#06B6D4', border: 'none' }}
                        >
                          Chọn
                        </Button>
                      </div>
                      <p className="text-text-secondary text-sm mb-0 whitespace-pre-wrap">
                        {template}
                      </p>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}