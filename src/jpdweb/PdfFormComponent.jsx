import React, { useState } from 'react';
import { FileText, Upload } from 'lucide-react';

const PdfUploadForm = ({ onSubmit }) => {
  const [pdfDocument, setPdfDocument] = useState({ file: null, doc: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xử lý file upload
  const handleFileChange = (file) => {
    if (file) {
      setPdfDocument({
        file,
        doc: file.name.split('.')[0] // auto lấy tên file nếu chưa nhập
      });
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdfDocument.file || pdfDocument.doc.trim() === '') {
      alert('Vui lòng chọn file PDF và nhập tên tài liệu!');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(pdfDocument); // Gửi 1 object duy nhất
      setPdfDocument({ file: null, doc: '' }); // Reset sau khi upload
    } catch (error) {
      console.error('Error uploading PDF document:', error);
      alert('Có lỗi xảy ra khi upload tài liệu PDF!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FileText className="w-7 h-7 text-red-600" />
        Upload Tài Liệu PDF
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn File PDF <span className="text-red-500">*</span>
          </label>

          {!pdfDocument.file ? (
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-red-400 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 px-2">
                    <span>Chọn file PDF</span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="sr-only"
                      onChange={(e) => handleFileChange(e.target.files[0])}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Chỉ chấp nhận file PDF, tối đa 100MB
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {pdfDocument.file.name}
                  </span>
                  <span className="text-xs text-green-600">
                    ({formatFileSize(pdfDocument.file.size)})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPdfDocument({ ...pdfDocument, file: null })}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Xóa
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Document Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên tài liệu <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={pdfDocument.doc}
            onChange={(e) =>
              setPdfDocument({ ...pdfDocument, doc: e.target.value })
            }
            placeholder="Nhập tên tài liệu..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => setPdfDocument({ file: null, doc: '' })}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Làm mới
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang upload...' : 'Upload Tài Liệu'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PdfUploadForm;
