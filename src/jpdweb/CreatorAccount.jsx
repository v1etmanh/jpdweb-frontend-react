import React, { useMemo, useState } from 'react';
import { CheckCircle, AlertCircle, User, Camera, FileText, Award, CreditCard, X } from 'lucide-react';
import { useAuth } from './security/Authentication';
import { PayPalVerificationForm } from './PayPalVerificationForm';
import { CertificateUploadForm } from './CertificateUploadForm';
import { getCreatorAccount } from './api/ApiConnect';


const CreatorAccountInfo = () => {
  const {setCreatorInfor, creatorInfor } = useAuth();
  const [selectedItem, setSelectedItem] = useState(null);

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
const handlePayPalSubmit = (data) => {
  console.log('PayPal verified:', data);
  // Call API to save PayPal email
  setShowPayPalForm(false);
};

const handleCertificateSubmit = (files) => {
  console.log('Certificates uploaded:', files);
  // Call API to upload certificates
  setShowCertificateForm(false);
};
const reload=async()=>{
  try{
  const response=await getCreatorAccount();
  console.log(response)
  if(response.status==200)
    setCreatorInfor(response.data)
  else {
    console.error("error to fetch data")
  }
  }catch(e){
    console.error("daaaa",e)
  }
}
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
    if (item.completed) return 'bg-blue-500';
    if (item.required) return 'bg-red-500';
    return 'bg-purple-900';
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
          <div className="space-y-4">
            <div className="border-b pb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <p className="text-gray-900 text-lg">{selectedItem.data.fullName}</p>
            </div>
            <div className="border-b pb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <p className="text-gray-900 text-lg">{selectedItem.data.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giới thiệu bản thân</label>
              <p className="text-gray-900 leading-relaxed">{selectedItem.data.bio}</p>
            </div>
          </div>
        );
      
      case 'image':
        return (
          <div className="flex flex-col items-center">
            <img 
              src={selectedItem.data.imgUrl} 
              alt="Profile" 
              className="w-48 h-48 rounded-full object-cover border-4 border-blue-500 shadow-lg"
            />
            <p className="mt-4 text-gray-600">Ảnh đại diện của bạn</p>
          </div>
        );
      
      case 'noticeTime':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Đã đồng ý điều khoản</h3>
            <p className="text-gray-600">Bạn đã đọc và đồng ý với điều khoản dịch vụ của nền tảng</p>
          </div>
        );
      
      case 'certification':
        return selectedItem.data.certificateUrl ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award size={40} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chứng chỉ của bạn</h3>
            <a 
              href={selectedItem.data.certificateUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FileText size={20} />
              Xem chứng chỉ
            </a>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Chưa có chứng chỉ nào được tải lên</p>
          </div>
        );
      
      case 'payment':
        return selectedItem.data.paypalEmail ? (
          <div className="space-y-4">
            <div className="border-b pb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức thanh toán</label>
              <p className="text-gray-900 text-lg">PayPal</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email PayPal</label>
              <p className="text-gray-900 text-lg">{selectedItem.data.paypalEmail}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
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
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#243864' }}>
            Thông tin tài khoản Creator
          </h1>
          <p className="text-gray-600">
            Hoàn thiện hồ sơ của bạn để trở thành creator chuyên nghiệp
          </p>
        </div>

        {/* Progress Summary */}
        <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: '#f8f9ff' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold" style={{ color: '#243864' }}>
              Tiến độ hoàn thành
            </h2>
            <div className="text-sm text-gray-600">
              {completedRequired}/{totalRequired} bắt buộc • {completedOptional}/{totalOptional} tùy chọn
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="h-3 rounded-full transition-all duration-300"
              style={{ 
                width: `${progressPercentage}%`,
                backgroundColor: progressPercentage === 100 ? '#1e88e5' : '#e53935'
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
              className="flex items-center p-4 border rounded-lg transition-all duration-200 hover:shadow-md"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${getStatusColor(item)}`}>
                {getIcon(item.key)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <h3 className="font-semibold text-lg mr-2" style={{ color: '#243864' }}>
                    {item.title}
                  </h3>
                  {item.required && (
                    <span className="px-2 py-1 text-xs font-medium text-white rounded-full bg-red-500">
                      Bắt buộc
                    </span>
                  )}
                  {!item.required && (
                    <span className="px-2 py-1 text-xs font-medium text-white rounded-full" style={{ backgroundColor: '#243864' }}>
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
      className="px-4 py-2 rounded-lg font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600"
    >
      Xem
    </button>
  )}
  <button
    onClick={() => {
      // Thêm logic mở form ở đây
      if (item.key === 'payment') {
        setShowPayPalForm(true);
      } else if (item.key === 'certification') {
        setShowCertificateForm(true);
      }
      // Nếu đã completed thì mở popup để chỉnh sửa
      if (item.completed) {
        handleViewDetails(item);
      }
    }}
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
      item.completed 
        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
        : item.required 
          ? 'text-white hover:opacity-90' 
          : 'text-white hover:opacity-90'
    }`}
    style={{ 
      backgroundColor: item.completed 
        ? undefined 
        : item.required 
          ? '#e53935' 
          : '#1e88e5' 
    }}
  >
    {item.completed ? 'Chỉnh sửa' : 'Thiết lập'}
  </button>
</div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <button className="px-6 py-3 border-2 rounded-lg font-medium transition-colors hover:bg-gray-50" style={{ borderColor: '#243864', color: '#243864' }}>
            Lưu nháp
          </button>
          <button 
            className={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${
              progressPercentage === 100 ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'
            }`}
            style={{ backgroundColor: progressPercentage === 100 ? '#1e88e5' : '#9ca3af' }}
            disabled={progressPercentage !== 100}
          >
            {progressPercentage === 100 ? 'Hoàn thành hồ sơ' : 'Cần hoàn thành các mục bắt buộc'}
          </button>
           <button
      onClick={() => reload()}
      className="px-4 py-2 rounded-lg font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600"
    >
      reload
    </button>
        </div>
      </div>

      {/* Popup Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleClosePopup}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(selectedItem)}`}>
                  {getIcon(selectedItem.key)}
                </div>
                <h2 className="text-2xl font-bold" style={{ color: '#243864' }}>
                  {selectedItem.title}
                </h2>
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
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={handleClosePopup}
                className="px-6 py-2 border-2 rounded-lg font-medium transition-colors hover:bg-gray-100"
                style={{ borderColor: '#243864', color: '#243864' }}
              >
                Đóng
              </button>
              <button
                className="px-6 py-2 rounded-lg font-medium text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: '#1e88e5' }}
              >
                Chỉnh sửa
              </button>
              

 
            </div>
          </div>
        </div>
      )}
      {/* Thêm 2 form này vào đây */}
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