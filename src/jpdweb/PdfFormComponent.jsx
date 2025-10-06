import React, { useState, useEffect, useRef } from 'react';
import { FileText, Upload, Trash2, ExternalLink, AlertCircle, RotateCcw, Loader2, X, Eye, EyeOff } from 'lucide-react';
import { savePdf } from './api/ApiConnect';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const PdfUploadForm = ({ onSubmit, initialData, onDelete }) => {
  const [pdfDocuments, setPdfDocuments] = useState([createEmptyDocument()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingIndexes, setUploadingIndexes] = useState(new Set());
  const [previewIndexes, setPreviewIndexes] = useState(new Set());
  const hasLoadedInitialData = useRef(false);

  // Helper function to create empty document
  function createEmptyDocument() {
    return {
      mcId: null,
      docUrl: '',
      docName: ''
    };
  }

  // Load initial data
  useEffect(() => {
    console.log(initialData)
    if (initialData && Array.isArray(initialData) && initialData.length > 0 && !hasLoadedInitialData.current) {
      const loadedDocuments = initialData.map(item => ({
        mcId: item.mcId || null,
        docUrl: item.docUrl || '',
        docName: item.docName || ''
      }));
      setPdfDocuments(loadedDocuments);
      hasLoadedInitialData.current = true;
    }
  }, [initialData]);

  // Extract document name from URL
  const extractDocName = (url) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      const pathname = decodeURIComponent(urlObj.pathname);
      const filename = pathname.split('/').pop();
      return filename.replace('.pdf', '');
    } catch (e) {
      return '';
    }
  };

  // Add new document
  const addDocument = () => {
    setPdfDocuments(prev => [...prev, createEmptyDocument()]);
  };

  // Remove document
  const removeDocument = async (index) => {
    const document = pdfDocuments[index];
    if (!document) return;

    const confirmed = window.confirm("Bạn có chắc muốn xóa tài liệu này?");
    if (!confirmed) return;

    try {
      if (document.mcId && onDelete) {
        await onDelete(document.mcId);
      }
      setPdfDocuments(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Lỗi khi xóa tài liệu:", err);
      alert("Xóa thất bại, vui lòng thử lại.");
    }
  };

  // Update document field
  const updateDocument = (index, field, value) => {
    setPdfDocuments(prev => prev.map((doc, i) =>
      i === index ? { ...doc, [field]: value } : doc
    ));
  };

  // Handle PDF file upload
  const handleFileUpload = async (index, file) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Chỉ chấp nhận file PDF!');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert(`Kích thước file không được vượt quá ${formatFileSize(MAX_FILE_SIZE)}!`);
      return;
    }

    setUploadingIndexes(prev => new Set([...prev, index]));

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      
      const response = await savePdf(formData);
      const downloadUrl = response.data;

      if (!downloadUrl) {
        throw new Error('Không nhận được URL từ server');
      }

      // Update docUrl with the returned URL
      updateDocument(index, 'docUrl', downloadUrl);
      
      // Auto-fill docName if empty
      const currentDoc = pdfDocuments[index];
      if (!currentDoc.docName) {
        updateDocument(index, 'docName', file.name.replace('.pdf', ''));
      }

      console.log(`PDF đã upload thành công: ${downloadUrl}`);
      
    } catch (error) {
      console.error('Lỗi khi upload PDF:', error);
      alert('Upload PDF thất bại. Vui lòng thử lại.');
    } finally {
      setUploadingIndexes(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  // Remove PDF
  const removePdf = (index) => {
    updateDocument(index, 'docUrl', '');
  };

  // Toggle preview
  const togglePreview = (index) => {
    setPreviewIndexes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Validate URL format
  const isValidUrl = (url) => {
  if (!url || !url.trim()) return false;
  try {
    const urlObj = new URL(url);
    // Accept Firebase Storage, S3, Cloudinary, or any URL containing 'pdf'
    return (
      url.toLowerCase().includes('pdf') ||
      urlObj.hostname.includes('firebase') ||
      urlObj.hostname.includes('cloudinary') ||
      urlObj.hostname.includes('s3.amazonaws')
    );
  } catch {
    return false;
  }
};

  // Validate form
  const validateForm = () => {
    const validDocuments = [];

    for (let i = 0; i < pdfDocuments.length; i++) {
      const doc = pdfDocuments[i];

      if (!doc.docName.trim()) continue;

      if (!doc.docUrl.trim()) continue;

      if (!isValidUrl(doc.docUrl)) {
        alert(`Tài liệu ${i + 1}: URL không hợp lệ hoặc không phải file PDF!`);
        return null;
      }

      validDocuments.push(doc);
    }

    if (validDocuments.length === 0) {
      alert('Vui lòng hoàn thiện ít nhất một tài liệu với đầy đủ thông tin!\n(Cần có tên tài liệu và URL/file PDF)');
      return null;
    }

    return validDocuments;
  };

  // Reset form
  const resetForm = () => {
    const confirmed = window.confirm("Bạn có chắc muốn làm mới form? Tất cả dữ liệu chưa lưu sẽ bị xóa.");
    if (!confirmed) return;

    setPdfDocuments([createEmptyDocument()]);
    setPreviewIndexes(new Set());
    hasLoadedInitialData.current = false;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validDocuments = validateForm();
    if (!validDocuments) return;

    setIsSubmitting(true);

    try {
      const documentsData = validDocuments.map(doc => ({
        mcId: doc.mcId,
        typeOfContent: "PDF",
        docUrl: doc.docUrl.trim(),
        docName: doc.docName.trim()
      }));

      await onSubmit(documentsData);

      setPdfDocuments([createEmptyDocument()]);
      setPreviewIndexes(new Set());
      hasLoadedInitialData.current = false;
      alert('Upload tài liệu PDF thành công!');
    } catch (error) {
      console.error('Error uploading PDF document:', error);
      alert(error.message || 'Có lỗi xảy ra khi upload tài liệu PDF!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <FileText className="w-7 h-7 text-red-600" />
          Quản lý Tài Liệu PDF
        </h2>
        <p className="text-gray-600">
          Upload tài liệu PDF cho module học tập
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {pdfDocuments.map((document, index) => (
          <div
            key={index}
            className="p-5 border-2 border-red-200 rounded-lg bg-gradient-to-br from-red-50 to-orange-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                Tài liệu #{index + 1}
              </h3>
              <div className="flex items-center gap-2">
                {document.docUrl && (
                  <>
                    <button
                      type="button"
                      onClick={() => togglePreview(index)}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                      title="Xem/Ẩn preview"
                    >
                      {previewIndexes.has(index) ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    <a
                      href={document.docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-full transition-colors"
                      title="Mở PDF trong tab mới"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </>
                )}
                {pdfDocuments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-200 rounded-full transition-colors"
                    title="Xóa tài liệu"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Document Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên tài liệu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={document.docName}
                onChange={(e) => updateDocument(index, 'docName', e.target.value)}
                placeholder="Nhập tên tài liệu..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
              />
            </div>

            {/* PDF Upload/URL Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                File PDF <span className="text-red-500">*</span>
              </label>

              {!document.docUrl ? (
                <div className="relative">
                  <input
                    type="file"
                    id={`pdf-${index}`}
                    accept=".pdf,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleFileUpload(index, file);
                      }
                    }}
                    disabled={uploadingIndexes.has(index)}
                    className="hidden"
                  />
                  <label
                    htmlFor={`pdf-${index}`}
                    className={`flex flex-col items-center justify-center gap-2 px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 hover:bg-red-50 transition-colors ${
                      uploadingIndexes.has(index) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploadingIndexes.has(index) ? (
                      <>
                        <Loader2 className="w-12 h-12 animate-spin text-red-600" />
                        <span className="text-sm text-red-600 font-medium">Đang upload...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400" />
                        <span className="text-sm text-gray-600 font-medium">
                          Click để chọn file PDF
                        </span>
                        <span className="text-xs text-gray-500">
                          Tối đa {formatFileSize(MAX_FILE_SIZE)}
                        </span>
                      </>
                    )}
                  </label>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">URL Tài liệu PDF</span>
                    <button
                      type="button"
                      onClick={() => removePdf(index)}
                      className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                    >
                      <X className="w-4 h-4" />
                      Xóa PDF
                    </button>
                  </div>
                       <input
                    type="url"
                    value={document.docUrl}
                    onChange={(e) => updateDocument(index, 'docUrl', e.target.value)}
                    placeholder="https://example.com/document.pdf"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  />
                  {document.docUrl && (
                    <div className="mt-3 border border-gray-300 rounded-lg overflow-hidden">
                      <iframe
                        src={`${document.docUrl}#view=FitH`}
                        title={`Preview PDF ${index + 1}`}
                        className="w-full h-96"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const errorDiv = document.createElement('div');
                          errorDiv.className = 'text-red-500 text-sm p-4 bg-red-50 rounded text-center';
                          errorDiv.textContent = '❌ Không thể hiển thị preview. Vui lòng click "Mở PDF" để xem.';
                          e.target.parentNode.appendChild(errorDiv);
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={addDocument}
            className="flex items-center gap-2 px-6 py-3 text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors font-medium"
          >
            <FileText className="w-5 h-5" />
            Thêm Tài Liệu
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Làm mới
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang gửi...
                </span>
              ) : (
                'Upload Tài Liệu'
              )}
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Thống kê</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded border-l-4 border-red-500">
              <div className="font-medium text-gray-700">Tổng tài liệu</div>
              <div className="text-2xl font-bold text-red-600">{pdfDocuments.length}</div>
            </div>
            <div className="bg-white p-3 rounded border-l-4 border-green-500">
              <div className="font-medium text-gray-700">Đã có PDF</div>
              <div className="text-2xl font-bold text-green-600">
                {pdfDocuments.filter(doc => doc.docUrl.trim()).length}
              </div>
            </div>
            <div className="bg-white p-3 rounded border-l-4 border-orange-500">
              <div className="font-medium text-gray-700">Hoàn thiện</div>
              <div className="text-2xl font-bold text-orange-600">
                {pdfDocuments.filter(doc => doc.docName.trim() && doc.docUrl.trim()).length}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PdfUploadForm;