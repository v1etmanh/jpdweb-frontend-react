import React, { useState } from 'react';
import { FileText, Download, Folder, ChevronRight, ExternalLink } from 'lucide-react';
import { Container, Row, Col } from "react-bootstrap";

export default function PdfContainer({ pdfs, onComplete }) {
  const [selectedPdf, setSelectedPdf] = useState(null);

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
    } else {
      alert("Không tìm thấy đường dẫn PDF!");
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  if (!pdfs || pdfs.length === 0) {
    return (
      <Container fluid className="py-6">
        <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-600 font-semibold">Không có tài liệu PDF nào.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-6 px-4">
      {/* Header */}
      <Row className="mb-6">
        <Col>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl">
              <Folder className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Tài Liệu PDF
              </h1>
              <p className="text-gray-600">
                {pdfs.length} tài liệu
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Main Content */}
      <Row className="gap-4">
        {/* Left - File List */}
        <Col lg={5}>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
              <h3 className="text-lg font-bold">Danh Sách Tài Liệu</h3>
            </div>
            
            <div className="max-h-[600px] overflow-y-auto">
              {pdfs.map((pdf, index) => (
                <div
                  key={index}
                  className={`border-b border-gray-200 transition-all cursor-pointer ${
                    selectedPdf === index
                      ? 'bg-blue-50 border-l-4 border-l-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPdf(index)}
                >
                  <div className="p-4 flex items-center gap-3">
                    <FileText className="w-6 h-6 text-red-500 flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate">
                        {pdf.docName}
                      </h4>
                      <p className="text-xs text-gray-500">
                        File {index + 1} / {pdfs.length}
                      </p>
                    </div>

                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                        selectedPdf === index ? 'transform rotate-90 text-blue-600' : ''
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Button */}
          <button
            onClick={handleComplete}
            className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-md"
          >
            Hoàn Thành
          </button>
        </Col>

        {/* Right - File Details & Preview */}
        <Col lg={7}>
          {selectedPdf !== null ? (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              {/* File Info Header */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-lg">
                    <FileText className="w-8 h-8 text-red-600" />
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {pdfs[selectedPdf].docName}
                    </h2>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>📄 Tài liệu {selectedPdf + 1}/{pdfs.length}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {/* Open PDF */}
                    <button
                      onClick={() => handleOpenPdf(pdfs[selectedPdf])}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Xem Tài Liệu
                    </button>

                    {/* Download */}
                    <button
                      onClick={() => handleDownload(pdfs[selectedPdf])}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
                    >
                      <Download className="w-5 h-5" />
                      Tải Về
                    </button>
                  </div>
                </div>
              </div>

              {/* File Info Section */}
              <div className="p-6 min-h-[500px] bg-gray-50 flex items-center justify-center text-center">
                <div>
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                    <FileText className="w-10 h-10 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {pdfs[selectedPdf].docName}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Nhấn “Xem Tài Liệu” để mở PDF trong tab mới hoặc “Tải Về” để tải xuống.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
              <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Chọn một tài liệu từ danh sách bên trái
              </p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
