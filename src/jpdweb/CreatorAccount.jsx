import React, { useState } from 'react';
import { CheckCircle, AlertCircle, User, Camera, FileText, Award, CreditCard } from 'lucide-react';

const CreatorAccountInfo = () => {
  const [states] = useState([
    { key: 'info', title: 'Thông tin cá nhân', description: 'Điền thông tin cơ bản của bạn', required: true, completed: true },
    { key: 'image', title: 'Ảnh đại diện', description: 'Tải lên ảnh profile của bạn', required: true, completed: false },
    { key: 'noticeTime', title: 'Điều khoản', description: 'Đọc và đồng ý điều khoản', required: true, completed: true },
    { key: 'certification', title: 'Chứng chỉ cá nhân', description: 'Chứng minh trình độ học vấn của bạn', required: false, completed: false },
    { key: 'payment', title: 'Thanh toán', description: 'Thiết lập phương thức thanh toán', required: false, completed: true }
  ]);

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
    if (item.completed) return 'bg-blue-500'; // #1e88e5
    if (item.required) return 'bg-red-500'; // #e53935
    return 'bg-purple-900'; // #243864
  };

  const completedRequired = states.filter(item => item.required && item.completed).length;
  const totalRequired = states.filter(item => item.required).length;
  const completedOptional = states.filter(item => !item.required && item.completed).length;
  const totalOptional = states.filter(item => !item.required).length;

  const progressPercentage = (completedRequired / totalRequired) * 100;

  return (
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
        {states.map((item, index) => (
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
            <div className="ml-4">
              {item.completed ? (
                <div className="flex items-center text-blue-500">
                  <CheckCircle size={24} className="mr-2" />
                  <span className="font-medium">Hoàn thành</span>
                </div>
              ) : (
                <div className={`flex items-center ${item.required ? 'text-red-500' : 'text-gray-400'}`}>
                  <AlertCircle size={24} className="mr-2" />
                  <span className="font-medium">
                    {item.required ? 'Cần hoàn thành' : 'Chưa thiết lập'}
                  </span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              className={`ml-4 px-4 py-2 rounded-lg font-medium transition-colors ${
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
      </div>
    </div>
  );
};

export default CreatorAccountInfo;