import { CheckIcon, ChevronRightIcon, UploadIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";

export default function CreatorProfileComponent() {
    const states = [
        { key: 'info', title: 'Thông tin cá nhân', description: 'Điền thông tin cơ bản của bạn', required: true },
        { key: 'image', title: 'Ảnh đại diện', description: 'Tải lên ảnh profile của bạn', required: true },
        { key: 'noticeTime', title: 'Điều khoản', description: 'Đọc và đồng ý điều khoản', required: true },
        { key: 'certification', title: 'Chứng chỉ cá nhân', description: 'Chứng minh trình độ học vấn của bạn', required: false },
        { key: 'payment', title: 'Thanh toán', description: 'Thiết lập phương thức thanh toán', required: false }
    ];
    
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        bio: '',
        profileImage: null,
        agreedToTerms: false,
        certificates: [], // Array để lưu nhiều chứng chỉ
        paymentMethod: ''
    });

    const handleNext = () => {
        if (currentStep < states.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSkipStep = () => {
        if (!states[currentStep].required) {
            handleNext();
        }
    };

    const handleCertificateUpload = (e) => {
        const files = Array.from(e.target.files);
        const newCertificates = files.map(file => ({
            id: Date.now() + Math.random(),
            file: file,
            name: file.name
        }));
        
        setFormData({
            ...formData,
            certificates: [...formData.certificates, ...newCertificates]
        });
    };

    const removeCertificate = (id) => {
        setFormData({
            ...formData,
            certificates: formData.certificates.filter(cert => cert.id !== id)
        });
    };

    const renderStepContent = () => {
        switch (states[currentStep].key) {
            case 'info':
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Họ và tên *
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập họ và tên"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số điện thoại
                                </label>
                                <input
                                    type="tel"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0123456789"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giới thiệu bản thân
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows={3}
                                    placeholder="Chia sẻ về kinh nghiệm và chuyên môn của bạn..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'image':
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Ảnh đại diện</h3>
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                                {formData.profileImage ? (
                                    <img 
                                        src={URL.createObjectURL(formData.profileImage)} 
                                        alt="Profile" 
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-400">Chọn ảnh</span>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="profileImage"
                                onChange={(e) => setFormData({...formData, profileImage: e.target.files[0]})}
                            />
                            <label
                                htmlFor="profileImage"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                            >
                                Chọn ảnh đại diện
                            </label>
                            <p className="text-sm text-gray-500">Định dạng: JPG, PNG. Kích thước tối đa: 2MB</p>
                        </div>
                    </div>
                );

            case 'noticeTime':
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Điều khoản và điều kiện</h3>
                        <div className="bg-gray-50 p-4 rounded-md max-h-64 overflow-y-auto">
                            <p className="text-sm text-gray-700 mb-4">
                                Bằng việc tạo tài khoản giảng viên, bạn đồng ý với các điều khoản sau:
                            </p>
                            <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                                <li>Cam kết tạo nội dung chất lượng và phù hợp</li>
                                <li>Tuân thủ các quy định về bản quyền</li>
                                <li>Không vi phạm chính sách cộng đồng</li>
                                <li>Chịu trách nhiệm về nội dung được tạo</li>
                            </ul>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="agreeTerms"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                checked={formData.agreedToTerms}
                                onChange={(e) => setFormData({...formData, agreedToTerms: e.target.checked})}
                            />
                            <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-700">
                                Tôi đã đọc và đồng ý với các điều khoản trên
                            </label>
                        </div>
                    </div>
                );

            case 'certification':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">Chứng chỉ cá nhân</h3>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                Tùy chọn
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Tải lên các chứng chỉ, bằng cấp để chứng minh trình độ chuyên môn của bạn. 
                            Điều này sẽ giúp tăng độ tin cậy với học viên.
                        </p>
                        
                        {/* Upload Area */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                            <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                multiple
                                className="hidden"
                                id="certificateUpload"
                                onChange={handleCertificateUpload}
                            />
                            <label
                                htmlFor="certificateUpload"
                                className="cursor-pointer"
                            >
                                <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                    Nhấn để tải lên
                                </span>
                                <span className="text-sm text-gray-500"> hoặc kéo thả file vào đây</span>
                            </label>
                            <p className="text-xs text-gray-400 mt-2">
                                Hỗ trợ: JPG, PNG, PDF. Tối đa 5MB mỗi file
                            </p>
                        </div>

                        {/* Certificate List */}
                        {formData.certificates.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-gray-900">
                                    Chứng chỉ đã tải lên ({formData.certificates.length})
                                </h4>
                                {formData.certificates.map((certificate) => (
                                    <div 
                                        key={certificate.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center">
                                                {certificate.file.type.startsWith('image/') ? (
                                                    <img 
                                                        src={URL.createObjectURL(certificate.file)}
                                                        alt="Certificate"
                                                        className="w-full h-full object-cover rounded-md"
                                                    />
                                                ) : (
                                                    <span className="text-blue-600 text-xs font-medium">PDF</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {certificate.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {(certificate.file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeCertificate(certificate.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <XIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'payment':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">Phương thức thanh toán</h3>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                Tùy chọn
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Thiết lập phương thức nhận thanh toán khi có học viên mua khóa học của bạn.
                            Bạn có thể cập nhật thông tin này sau.
                        </p>
                        <div className="space-y-4">
                            {['PayPal', 'Thẻ tín dụng', 'Chuyển khoản ngân hàng'].map((method) => (
                                <div key={method} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={method}
                                        name="paymentMethod"
                                        value={method}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                        checked={formData.paymentMethod === method}
                                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                                    />
                                    <label htmlFor={method} className="ml-3 text-sm text-gray-700">
                                        {method}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const canProceed = () => {
        const currentState = states[currentStep];
        
        // Nếu bước hiện tại không bắt buộc, luôn cho phép tiếp tục
        if (!currentState.required) return true;
        
        // Kiểm tra validation cho các bước bắt buộc
        switch (currentState.key) {
            case 'info':
                return formData.fullName && formData.email;
            case 'image':
                return formData.profileImage;
            case 'noticeTime':
                return formData.agreedToTerms;
            default:
                return true;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white">
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {states.map((state, index) => (
                        <div key={state.key} className="flex items-center">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                index <= currentStep 
                                    ? 'bg-blue-600 border-blue-600 text-white' 
                                    : 'border-gray-300 text-gray-300'
                            }`}>
                                {index < currentStep ? (
                                    <CheckIcon className="w-5 h-5" />
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>
                            <div className="ml-3">
                                <div className="flex items-center space-x-2">
                                    <p className={`text-sm font-medium ${
                                        index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                                    }`}>
                                        {state.title}
                                    </p>
                                    {!state.required && (
                                        <span className="text-xs text-gray-400 bg-gray-100 px-1 rounded">
                                            tùy chọn
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">{state.description}</p>
                            </div>
                            {index < states.length - 1 && (
                                <ChevronRightIcon className="w-5 h-5 text-gray-400 mx-4" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={`px-6 py-2 rounded-md ${
                        currentStep === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                >
                    Quay lại
                </button>
                
                <div className="flex space-x-3">
                    {/* Skip Button - chỉ hiện với các bước không bắt buộc */}
                    {!states[currentStep].required && currentStep < states.length - 1 && (
                        <button
                            onClick={handleSkipStep}
                            className="px-6 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50"
                        >
                            Bỏ qua
                        </button>
                    )}
                    
                    <button
                        onClick={handleNext}
                        disabled={currentStep === states.length - 1 || (states[currentStep].required && !canProceed())}
                        className={`px-6 py-2 rounded-md ${
                            currentStep === states.length - 1
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : canProceed()
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {currentStep === states.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
                    </button>
                </div>
            </div>
        </div>
    );
}