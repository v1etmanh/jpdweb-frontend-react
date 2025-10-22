import { AlertCircle, Upload, X } from "lucide-react";
import { useState } from "react";
import { creatorApi } from "./api/creatorApi";
import { showErrorNotification, showSuccessNotification } from "./api/apiClient";

export const CertificateUploadForm = ({ onSubmit, onCancel }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const handleFileSelect = (selectedFiles) => {
    const validFiles = [];
    const errors = [];

    Array.from(selectedFiles).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Định dạng không hợp lệ`);
        return;
      }
      if (file.size > maxFileSize) {
        errors.push(`${file.name}: Kích thước vượt quá 5MB`);
        return;
      }
      validFiles.push(file);
    });

    if (errors.length > 0) {
      setError(errors.join(', '));
    } else {
      setError('');
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

 const handleSubmit = async (e) => {
  e.preventDefault(); // THIẾU dòng này!
  
  if (files.length === 0) {
    setError('Vui lòng chọn ít nhất một file');
    return;
  }

  setUploading(true);
  setError('');

  
    const response = await  creatorApi.uploadCertificate(files); // ✅ Đúng - truyền files vào
    
    if (response.success) { 
      showSuccessNotification("Bạn đã upload chứng chỉ thành công , hãy chờ admin phê duyệt hồ sơ của bạn")
      
      // Reset form
      setFiles([]);
      
      // Close modal
      if (onSubmit) onSubmit();
      onCancel();
    }
    else{
      showErrorNotification("quá trình upload gặp vấn đề ")
    }
  
    setUploading(false);
  
};

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500">
              <Upload size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold" style={{ color: '#243864' }}>
              Tải lên chứng chỉ
            </h2>
          </div>
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Kéo thả file vào đây hoặc
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
                <span className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 cursor-pointer inline-block transition-colors">
                  Chọn file
                </span>
              </label>
              <p className="text-sm text-gray-500 mt-3">
                Hỗ trợ: PDF, JPG, PNG (Tối đa 5MB mỗi file)
              </p>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">
                  File đã chọn ({files.length})
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Upload size={20} className="text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0 ml-2"
                      >
                        <X size={20} className="text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Info Box */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Vui lòng tải lên các chứng chỉ, bằng cấp liên quan đến lĩnh vực giảng dạy của bạn để tăng độ tin cậy.
              </p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border-2 rounded-lg font-medium transition-colors hover:bg-gray-50"
              style={{ borderColor: '#243864', color: '#243864' }}
              disabled={uploading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={uploading || files.length === 0}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? 'Đang tải lên...' : `Tải lên (${files.length})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};