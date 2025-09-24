import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { useRef, useState } from "react";


export default function CreatorProfileComponent() {
    const states = [
        { key: 'info', title: 'Thông tin cá nhân', description: 'Điền thông tin cơ bản của bạn' },
        { key: 'image', title: 'Ảnh đại diện', description: 'Tải lên ảnh profile của bạn' },
        { key: 'noticeTime', title: 'Điều khoản', description: 'Đọc và đồng ý điều khoản' },
        { key: 'payment', title: 'Thanh toán', description: 'Thiết lập phương thức thanh toán' }
    ];
    
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        bio: '',
        profileImage: null,
        agreedToTerms: false,
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

            case 'payment':
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Phương thức thanh toán</h3>
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
                                <p className={`text-sm font-medium ${
                                    index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                                }`}>
                                    {state.title}
                                </p>
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
                <button
                    onClick={handleNext}
                    disabled={currentStep === states.length - 1}
                    className={`px-6 py-2 rounded-md ${
                        currentStep === states.length - 1
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    {currentStep === states.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
                </button>
            </div>
        </div>
    );
}