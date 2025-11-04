import React, { useState } from 'react';
import { FileText, Download, Search, ChevronRight, ExternalLink, BookOpen, Clock } from 'lucide-react';
import { Container, Row, Col } from "react-bootstrap";

export default function PdfContainer({ pdfs, onComplete }) {
  const [selectedPdf, setSelectedPdf] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc PDFs theo tìm kiếm
  const filteredPdfs = pdfs.filter(pdf => 
    pdf.docName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (pdf) => {
    const link = document.createElement('a');
    link.href = pdf.docUrl;
    link.download = pdf.docName || 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenPdf = (pdf) => {
    if (pdf.docUrl) {
      window.open(pdf.docUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (!pdfs || pdfs.length === 0) {
    return (
      <Container fluid className="py-6">
        <div className="flex items-center justify-center p-8 bg-surface rounded-lg shadow-soft border border-border-light">
          <p className="text-text-muted font-semibold">Không có tài liệu PDF nào.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 px-4 bg-background min-h-screen">
      {/* Header đơn giản */}
      <Row className="mb-6">
        <Col>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-30 to-primary-dark rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Tài Liệu PDF</h1>
          </div>
          <p className="text-text-secondary">
            {pdfs.length} tài liệu học tập có sẵn
          </p>
        </Col>
      </Row>

      <Row className="gap-4" style={{ minHeight: '75vh' }}>
        {/* Cột trái - Danh sách tài liệu */}
        <Col lg={4}>
          <div className="bg-surface rounded-xl shadow-soft border border-border-light h-full flex flex-col">
            {/* Thanh tìm kiếm */}
            <div className="p-4 border-b border-border-light">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tài liệu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-30 focus:border-transparent"
                />
              </div>
            </div>

            {/* Danh sách tài liệu */}
            <div className="flex-1 overflow-y-auto">
              {filteredPdfs.map((pdf, index) => {
                const originalIndex = pdfs.indexOf(pdf);
                return (
                  <div
                    key={originalIndex}
                    className={`border-b border-border-light transition-all duration-200 cursor-pointer group ${
                      selectedPdf === originalIndex
                        ? 'bg-primary-30/10 border-l-4 border-l-primary-30'
                        : 'hover:bg-background'
                    }`}
                    onClick={() => setSelectedPdf(originalIndex)}
                  >
                    <div className="p-4 flex items-center gap-3">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                        selectedPdf === originalIndex 
                          ? 'bg-primary-30 text-white' 
                          : 'bg-background text-primary-30 group-hover:bg-primary-30/10'
                      }`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-text-primary text-sm leading-tight truncate">
                          {pdf.docName}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {pdf.duration || "5 phút"}
                          </span>
                          <span>•</span>
                          <span>Tài liệu {originalIndex + 1}</span>
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${
                          selectedPdf === originalIndex 
                            ? 'text-primary-30 transform rotate-90' 
                            : 'text-border-dark group-hover:text-primary-30'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}

              {filteredPdfs.length === 0 && (
                <div className="p-8 text-center text-text-muted">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Không tìm thấy tài liệu phù hợp</p>
                </div>
              )}
            </div>

            {/* Nút hoàn thành */}
          </div>
        </Col>

        {/* Cột phải - Hiển thị PDF */}
        <Col lg={7}>
          <div className="bg-surface rounded-xl shadow-soft border border-border-light h-full flex flex-col">
            {/* Header PDF */}
            <div className="p-4 border-b border-border-light">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary-30" />
                  <div>
                    <h2 className="font-bold text-text-primary text-lg">
                      {pdfs[selectedPdf]?.docName}
                    </h2>
                    <p className="text-text-secondary text-sm">
                      Tài liệu {selectedPdf + 1} của {pdfs.length}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenPdf(pdfs[selectedPdf])}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-30 hover:bg-primary-dark text-white font-medium rounded-lg transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Mở Riêng
                  </button>
                  <button
                    onClick={() => handleDownload(pdfs[selectedPdf])}
                    className="flex items-center gap-2 px-4 py-2 bg-accent-10 hover:bg-accent-dark text-white font-medium rounded-lg transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Tải Về
                  </button>
                </div>
              </div>
            </div>

            {/* Nội dung PDF */}
            <div className="flex-1 p-4">
              {pdfs[selectedPdf]?.docUrl ? (
                <div className="w-full h-full rounded-lg border border-border-light overflow-hidden bg-white">
                  <iframe
                    src={pdfs[selectedPdf].docUrl}
                    width="100%"
                    height="100%"
                    title="PDF Viewer"
                    className="border-none"
                    style={{ minHeight: '500px', display: 'block' }}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-background rounded-lg border border-border-light">
                  <FileText className="w-16 h-16 text-border-main mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Không thể tải PDF
                  </h3>
                  <p className="text-text-muted mb-4">
                    Đường dẫn PDF không khả dụng
                  </p>
                  <button
                    onClick={() => handleDownload(pdfs[selectedPdf])}
                    className="px-4 py-2 bg-primary-30 hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
                  >
                    Thử Tải Về
                  </button>
                </div>
              )}
            </div>

            {/* Điều hướng đơn giản */}
            <div className="p-4 border-t border-border-light bg-background">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => selectedPdf > 0 && setSelectedPdf(selectedPdf - 1)}
                  disabled={selectedPdf === 0}
                  className="flex items-center gap-2 px-4 py-2 border border-border-light rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-30 transition-colors"
                >
                  ← Tài liệu trước
                </button>
                
                <span className="text-sm text-text-muted">
                  {selectedPdf + 1} / {pdfs.length}
                </span>
                
                <button
                  onClick={() => selectedPdf < pdfs.length - 1 && setSelectedPdf(selectedPdf + 1)}
                  disabled={selectedPdf === pdfs.length - 1}
                  className="flex items-center gap-2 px-4 py-2 border border-border-light rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-30 transition-colors"
                >
                  Tài liệu tiếp theo →
                </button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}