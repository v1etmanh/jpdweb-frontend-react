import React, { useMemo, useState } from 'react';
import { CheckCircle, AlertCircle, User, Camera, FileText, Award, CreditCard, X, Edit3, Upload } from 'lucide-react';
import { useAuth } from './security/Authentication';
import { PayPalVerificationForm } from './PayPalVerificationForm';
import { CertificateUploadForm } from './CertificateUploadForm';
import { getCreatorAccount } from './api/ApiConnect';
import { creatorApi } from './api/creatorApi';
import { showErrorNotification } from './api/apiClient';

const CreatorAccountInfo = () => {
  const { setCreatorInfor, creatorInfor } = useAuth();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEditInfoPopup, setShowEditInfoPopup] = useState(false);
  const [showImageUploadPopup, setShowImageUploadPopup] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    phone: '',
    bio: ''
  });

  // Map creatorInfo data to states
  const states = useMemo(() => {
    if (!creatorInfor) return [];

    return [
      { 
        key: 'info', 
        title: 'Thông tin cá nhân', 
        description: 'Điền thông tin cơ bản của bạn', 
        required: true, 
        completed: !!(creatorInfor.fullName && creatorInfor.phone && creatorInfor.bio),
        data: {
          fullName: creatorInfor.fullName,
          phone: creatorInfor.phone,
          bio: creatorInfor.bio
        }
      },
      { 
        key: 'image', 
        title: 'Ảnh đại diện', 
        description: 'Tải lên ảnh profile của bạn', 
        required: true, 
        completed: !!creatorInfor.imgUrl,
        data: {
          imgUrl: creatorInfor.imgUrl
        }
      },
      { 
        key: 'noticeTime', 
        title: 'Điều khoản', 
        description: 'Đọc và đồng ý điều khoản', 
        required: true, 
        completed: true,
        data: null
      },
      { 
        key: 'certification', 
        title: 'Chứng chỉ cá nhân', 
        description: 'Chứng minh trình độ học vấn của bạn', 
        required: false, 
        completed: !!creatorInfor.certificateUrl,
        data: {
          certificateUrl: creatorInfor.certificateUrl
        }
      },
      { 
        key: 'payment', 
        title: 'Thanh toán', 
        description: 'Thiết lập phương thức thanh toán', 
        required: false, 
        completed: !!creatorInfor.paypalEmail,
        data: {
          paypalEmail: creatorInfor.paypalEmail
        }
      }
    ];
  }, [creatorInfor]);

  const [showPayPalForm, setShowPayPalForm] = useState(false);
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const handlePayPalSubmit = (data) => {
    console.log('PayPal verified:', data);
    setShowPayPalForm(false);
  };

  const handleCertificateSubmit = (files) => {
    console.log('Certificates uploaded:', files);
    setShowCertificateForm(false);
  };

  const reload = async () => {
    const response = await creatorApi.getAccount();
    if (response.success)
      setCreatorInfor(response.data)
    else {
      showErrorNotification('Không thể tải dữ liệu')
    }
  };

  const handleEditInfo = () => {
    setEditFormData({
      fullName: creatorInfor.fullName || '',
      phone: creatorInfor.phone || '',
      bio: creatorInfor.bio || ''
    });
    setShowEditInfoPopup(true);
    setSelectedItem(null);
  };

  const handleSaveInfo = async () => {
    // Call API to save info
    console.log('Saving info:', editFormData);
    // After successful save:
    setShowEditInfoPopup(false);
    await reload(); // Reload to get updated data
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a temporary URL for preview
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      // Here you would typically upload to your server
    }
  };

  const handleSaveImage = async () => {
    // Call API to save image
    console.log('Saving image:', imagePreview);
    // After successful save:
    setShowImageUploadPopup(false);
    await reload(); // Reload to get updated data
  };

  const getIcon = (key) => {
    const iconProps = { size: 24, className: "text-white" };
    switch (key) {
      case 'info': return <User {...iconProps} />;
      case 'image': return <Camera {...iconProps} />;
      case 'noticeTime': return <FileText {...iconProps} />;
      case 'certification': return <Award {...iconProps} />;
      case 'payment': return <CreditCard {...iconProps} />;
      default: return <User {...iconProps} />;
    }
  };

  const getStatusColor = (item) => {
    if (item.completed) return 'bg-[#06B6D4]';
    if (item.required) return 'bg-[#F97316]';
    return 'bg-gray-400';
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
  };

  const renderPopupContent = () => {
    if (!selectedItem) return null;

    switch (selectedItem.key) {
      case 'info':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                <p className="text-gray-900 text-lg font-medium p-3 bg-gray-50 rounded-lg">{selectedItem.data.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <p className="text-gray-900 text-lg font-medium p-3 bg-gray-50 rounded-lg">{selectedItem.data.phone}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giới thiệu bản thân</label>
              <p className="text-gray-900 leading-relaxed p-4 bg-gray-50 rounded-lg min-h-[120px]">{selectedItem.data.bio}</p>
            </div>
          </div>
        );
      
      case 'image':
        return (
          <div className="flex flex-col items-center">
            <img 
              src={selectedItem.data.imgUrl} 
              alt="Profile" 
              className="w-48 h-48 rounded-full object-cover border-4 border-[#06B6D4] shadow-lg"
            />
            <p className="mt-4 text-gray-600">Ảnh đại diện của bạn</p>
          </div>
        );
      
      case 'noticeTime':
        return (
          <div className="py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Đã đồng ý điều khoản</h3>
            <p className="text-gray-600">Bạn đã đọc và đồng ý với điều khoản dịch vụ của nền tảng</p>
          </div>
        );
      
      case 'certification':
        return selectedItem.data.certificateUrl ? (
          <div>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Award size={40} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chứng chỉ của bạn</h3>
            <a 
              href={selectedItem.data.certificateUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#06B6D4] text-white rounded-lg hover:bg-[#0891b2] transition-colors shadow-md"
            >
              <FileText size={20} />
              Xem chứng chỉ
            </a>
          </div>
        ) : (
          <div className="py-8">
            <p className="text-gray-600">Chưa có chứng chỉ nào được tải lên</p>
          </div>
        );
      
      case 'payment':
        return selectedItem.data.paypalEmail ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</label>
              <p className="text-gray-900 text-lg font-medium p-3 bg-gray-50 rounded-lg">PayPal</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email PayPal</label>
              <p className="text-gray-900 text-lg font-medium p-3 bg-gray-50 rounded-lg">{selectedItem.data.paypalEmail}</p>
            </div>
          </div>
        ) : (
          <div className="py-8">
            <p className="text-gray-600">Chưa thiết lập phương thức thanh toán</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  const completedRequired = states.filter(item => item.required && item.completed).length;
  const totalRequired = states.filter(item => item.required).length;
  const completedOptional = states.filter(item => !item.required && item.completed).length;
  const totalOptional = states.filter(item => !item.required).length;

  const progressPercentage = totalRequired > 0 ? (completedRequired / totalRequired) * 100 : 0;

  // Loading state
  if (!creatorInfor) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-card">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#F1F5F9] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-[#1E293B]">
              Thông tin tài khoản Creator
            </h1>
            <p className="text-gray-600">
              Hoàn thiện hồ sơ của bạn để trở thành creator chuyên nghiệp
            </p>
          </div>

          {/* Progress Summary */}
          <div className="mb-8 p-6 rounded-2xl bg-white shadow-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#1E293B] mb-2 md:mb-0">
                Tiến độ hoàn thành
              </h2>
              <div className="text-sm text-gray-600">
                {completedRequired}/{totalRequired} bắt buộc • {completedOptional}/{totalOptional} tùy chọn
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="h-3 rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${progressPercentage}%`,
                  backgroundColor: progressPercentage === 100 ? '#06B6D4' : '#F97316'
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {progressPercentage === 100 ? 
                'Tuyệt vời! Bạn đã hoàn thành tất cả thông tin bắt buộc.' : 
                `Còn ${totalRequired - completedRequired} mục bắt buộc cần hoàn thành.`
              }
            </p>
          </div>

          {/* Account Items */}
          <div className="space-y-4">
            {states.map((item) => (
              <div 
                key={item.key}
                className="flex items-center p-6 bg-white rounded-2xl shadow-card transition-all duration-300 hover:shadow-medium"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${getStatusColor(item)} shadow-md`}>
                  {getIcon(item.key)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h3 className="font-semibold text-lg mr-2 text-[#1E293B]">
                      {item.title}
                    </h3>
                    {item.completed && (
                      <CheckCircle size={20} className="text-green-500" />
                    )}
                    {item.required && (
                      <span className="px-2 py-1 text-xs font-medium text-white rounded-full bg-[#F97316] ml-2">
                        Bắt buộc
                      </span>
                    )}
                    {!item.required && (
                      <span className="px-2 py-1 text-xs font-medium text-white rounded-full bg-[#06B6D4] ml-2">
                        Tùy chọn
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>

                {/* Status */}
                <div className="ml-4 flex gap-2">
                  {item.completed && (
                    <button
                      onClick={() => handleViewDetails(item)}
                      className="px-4 py-2 rounded-lg font-medium transition-colors bg-[#06B6D4] text-white hover:bg-[#0891b2] shadow-sm"
                    >
                      Xem
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (item.key === 'payment') {
                        setShowPayPalForm(true);
                      } else if (item.key === 'certification') {
                        setShowCertificateForm(true);
                      } else if (item.key === 'info') {
                        handleEditInfo();
                      } else if (item.key === 'image') {
                        setShowImageUploadPopup(true);
                      } else if (item.completed) {
                        handleViewDetails(item);
                      } else {
                        handleViewDetails(item);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors shadow-sm ${
                      item.completed 
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                        : item.required 
                          ? 'bg-[#F97316] text-white hover:bg-[#ea580c]' 
                          : 'bg-[#06B6D4] text-white hover:bg-[#0891b2]'
                    }`}
                  >
                    {item.completed ? 'Chỉnh sửa' : 'Thiết lập'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
            <button className="px-6 py-3 border-2 rounded-xl font-medium transition-colors hover:bg-gray-50 border-[#06B6D4] text-[#06B6D4]">
              Lưu nháp
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => reload()}
                className="px-6 py-3 rounded-xl font-medium transition-colors bg-[#06B6D4] text-white hover:bg-[#0891b2] shadow-sm flex items-center gap-2"
              >
                <Edit3 size={18} />
                Tải lại
              </button>
              <button 
                className={`px-6 py-3 rounded-xl font-medium text-white transition-colors shadow-sm flex items-center gap-2 ${
                  progressPercentage === 100 ? 'hover:opacity-90 bg-[#F97316] hover:bg-[#ea580c]' : 'opacity-50 cursor-not-allowed bg-gray-400'
                }`}
                disabled={progressPercentage !== 100}
              >
                <CheckCircle size={18} />
                {progressPercentage === 100 ? 'Hoàn thành hồ sơ' : 'Cần hoàn thành các mục bắt buộc'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Details Popup */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={handleClosePopup}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(selectedItem)} shadow-sm`}>
                  {getIcon(selectedItem.key)}
                </div>
                <div className="flex items-center">
                  <h2 className="text-2xl font-bold text-[#1E293B]">
                    {selectedItem.title}
                  </h2>
                  {selectedItem.completed && (
                    <CheckCircle size={20} className="text-green-500 ml-2" />
                  )}
                </div>
              </div>
              <button 
                onClick={handleClosePopup}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Popup Content */}
            <div className="p-6">
              {renderPopupContent()}
            </div>

            {/* Popup Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={handleClosePopup}
                className="px-6 py-2 border-2 rounded-lg font-medium transition-colors hover:bg-gray-100 border-[#06B6D4] text-[#06B6D4]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Info Popup */}
      {showEditInfoPopup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setShowEditInfoPopup(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#06B6D4] shadow-sm">
                  <User size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#1E293B]">
                  Chỉnh sửa thông tin cá nhân
                </h2>
              </div>
              <button 
                onClick={() => setShowEditInfoPopup(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Popup Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={editFormData.fullName}
                      onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06B6D4] focus:border-transparent transition-all"
                      placeholder="Nhập họ và tên đầy đủ"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06B6D4] focus:border-transparent transition-all"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới thiệu bản thân <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    value={editFormData.bio}
                    onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06B6D4] focus:border-transparent transition-all resize-none"
                    placeholder="Mô tả về bản thân, kinh nghiệm giảng dạy, chuyên môn..."
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Hãy viết ít nhất 100 ký tự để giới thiệu bản thân một cách chuyên nghiệp
                  </p>
                </div>

                {/* Current Info Preview */}
                
              </div>
            </div>

            {/* Popup Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setShowEditInfoPopup(false)}
                className="px-6 py-3 border-2 rounded-lg font-medium transition-colors hover:bg-gray-100 border-[#06B6D4] text-[#06B6D4]"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveInfo}
                className="px-6 py-3 rounded-lg font-medium text-white transition-colors hover:bg-[#0891b2] bg-[#06B6D4] shadow-sm"
              >
                Lưu thông tin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Popup */}
      {showImageUploadPopup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setShowImageUploadPopup(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#06B6D4] shadow-sm">
                  <Camera size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#1E293B]">
                  Tải lên ảnh đại diện
                </h2>
              </div>
              <button 
                onClick={() => setShowImageUploadPopup(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Popup Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Current Avatar */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <img 
                      src={imagePreview || creatorInfor.imgUrl || '/default-avatar.png'} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#06B6D4] shadow-lg"
                    />
                  </div>
                  <p className="text-gray-600 text-sm">Ảnh đại diện hiện tại</p>
                </div>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#06B6D4] transition-colors">
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Kéo thả ảnh vào đây hoặc nhấn để chọn</p>
                  <input 
                    type="file" 
                    id="avatar-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <label 
                    htmlFor="avatar-upload"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#06B6D4] text-white rounded-lg hover:bg-[#0891b2] transition-colors cursor-pointer shadow-sm"
                  >
                    <Camera size={20} />
                    Chọn ảnh
                  </label>
                  <p className="text-xs text-gray-500 mt-3">
                    Định dạng: JPG, PNG, GIF • Tối đa: 5MB
                  </p>
                </div>

                {/* Preview New Image */}
                {imagePreview && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Ảnh mới đã được chọn</p>
                        <p className="text-sm text-green-600">Nhấn "Lưu ảnh" để cập nhật ảnh đại diện</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Popup Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setShowImageUploadPopup(false)}
                className="px-6 py-3 border-2 rounded-lg font-medium transition-colors hover:bg-gray-100 border-[#06B6D4] text-[#06B6D4]"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveImage}
                disabled={!imagePreview}
                className={`px-6 py-3 rounded-lg font-medium text-white transition-colors shadow-sm ${
                  imagePreview 
                    ? 'bg-[#06B6D4] hover:bg-[#0891b2]' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Lưu ảnh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PayPal and Certificate Forms */}
      {showPayPalForm && (
        <PayPalVerificationForm
          onSubmit={handlePayPalSubmit}
          onCancel={() => setShowPayPalForm(false)}
        />
      )}

      {showCertificateForm && (
        <CertificateUploadForm
          onSubmit={handleCertificateSubmit}
          onCancel={() => setShowCertificateForm(false)}
        />
      )}
    </>
  );
};

export default CreatorAccountInfo;