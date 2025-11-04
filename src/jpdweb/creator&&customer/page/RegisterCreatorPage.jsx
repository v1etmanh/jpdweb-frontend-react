import { CheckIcon, ChevronRightIcon, UploadIcon, XIcon, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../security/Authentication";
import { useNavigate } from "react-router-dom";
import { uploadProfile } from "../../api/ApiConnect";
import { customerApi } from "../../api/customer/customerApi";
import { API_RESPONSE_TYPES, showErrorNotification, showSuccessNotification, showWarningNotification } from "../../api/core/apiClient";

export default function CreatorProfileComponent() {
    // Chỉ còn 3 required steps
    const requiredSteps = [
        { key: 'info', title: 'Thông tin cá nhân', description: 'Điền thông tin cơ bản của bạn' },
        { key: 'image', title: 'Ảnh đại diện', description: 'Tải lên ảnh profile của bạn' },
        { key: 'terms', title: 'Điều khoản', description: 'Đọc và đồng ý điều khoản' }
    ];
    
    const [currentStep, setCurrentStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
   
    // Phase 1: Required fields only
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        bio: '',
        profileImage: null,
        agreedToTerms: false
    });

    const { setCreator, user, setCreatorInfor} = useAuth();
    const navigate = useNavigate();

    // Validation per field
    const validateField = (name, value) => {
        switch (name) {
            case 'fullName':
                if (!value || value.trim().length < 2) {
                    return 'Họ tên phải có ít nhất 2 ký tự';
                }
                if (value.length > 100) {
                    return 'Họ tên không được vượt quá 100 ký tự';
                }
                return '';
            
            case 'phone':
                if (!value) return 'Số điện thoại không được để trống';
                const phoneRegex = /^[0-9]{10,11}$/;
                if (!phoneRegex.test(value)) {
                    return 'Số điện thoại không hợp lệ (10-11 số)';
                }
                return '';
            
            case 'bio':
                if (!value || value.trim().length < 50) {
                    return 'Giới thiệu bản thân phải có ít nhất 50 ký tự';
                }
                if (value.length > 1000) {
                    return 'Giới thiệu không được vượt quá 1000 ký tự';
                }
                return '';
            
            case 'profileImage':
                if (!value) return 'Vui lòng chọn ảnh đại diện';
                if (value.size > 5 * 1024 * 1024) {
                    return 'Ảnh không được vượt quá 5MB';
                }
                if (!['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)) {
                    return 'Chỉ chấp nhận file JPG, PNG';
                }
                return '';
            
            case 'agreedToTerms':
                if (!value) return 'Bạn phải đồng ý với điều khoản';
                return '';
            
            default:
                return '';
        }
    };

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateCurrentStep = () => {
        const newErrors = {};
        const currentStepKey = requiredSteps[currentStep].key;

        switch (currentStepKey) {
            case 'info':
                ['fullName', 'phone', 'bio'].forEach(field => {
                    const error = validateField(field, formData[field]);
                    if (error) newErrors[field] = error;
                });
                break;
            
            case 'image':
                const imageError = validateField('profileImage', formData.profileImage);
                if (imageError) newErrors.profileImage = imageError;
                break;
            
            case 'terms':
                const termsError = validateField('agreedToTerms', formData.agreedToTerms);
                if (termsError) newErrors.agreedToTerms = termsError;
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateCurrentStep()) {
            if (currentStep < requiredSteps.length - 1) {
                setCurrentStep(prev => prev + 1);
                // Save to sessionStorage for persistence
                sessionStorage.setItem('creatorProfileDraft', JSON.stringify({
                    ...formData,
                    currentStep: currentStep + 1,
                    profileImage: null // Don't save file to sessionStorage
                }));
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            setErrors({});
        }
    };

    const handleSubmit = async () => {
  if (!validateCurrentStep()) return;

  setIsSubmitting(true);
  
  const formDataToSend = new FormData();
  formDataToSend.append('fullName', formData.fullName);
  formDataToSend.append('phone', formData.phone);
  formDataToSend.append('bio', formData.bio);
  formDataToSend.append('profileImage', formData.profileImage);
  formDataToSend.append('agreedToTerms', formData.agreedToTerms);

  const response = await customerApi.uploadProfile(formData);
  
  if (response.success) {
    // Clear draft
    sessionStorage.removeItem('creatorProfileDraft');
    
    // Update auth context
    setCreator(true);
    setCreatorInfor(response.data);
    
    // Show success and redirect
    showSuccessNotification('Chúc mừng! Bạn đã trở thành Creator');
    navigate('/creator/commercial/dashboard');
  } else {
    handleUploadProfileError(response);
  }
  
  setIsSubmitting(false);
};

// ✅ Hàm xử lý lỗi riêng cho upload creator profile
const handleUploadProfileError = (response) => {
  const message = response.message || 'Không thể tạo hồ sơ Creator';

  switch (response.responseType) {
    case API_RESPONSE_TYPES.VALIDATION_ERROR:
      // Dữ liệu form không hợp lệ
      showWarningNotification('Thông tin không hợp lệ. Vui lòng kiểm tra lại các trường');
      
      // Hiển thị chi tiết lỗi validation nếu có
      if (response.details) {
        console.error('Validation errors:', response.details);
        // Có thể set error cho từng field cụ thể
        // setFieldErrors(response.details);
      }
      break;

    case API_RESPONSE_TYPES.CONFLICT:
      // Đã là creator rồi / đang chờ duyệt
      showWarningNotification(message || 'Bạn đã đăng ký làm Creator trước đó. Vui lòng chờ phê duyệt');
      // Có thể redirect về trang chờ duyệt
      // navigate('/creator/pending-approval');
      break;

    case API_RESPONSE_TYPES.UNAUTHORIZED:
      // Session hết hạn / chưa login
      showWarningNotification('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      // Save draft trước khi redirect
      sessionStorage.setItem('creatorProfileDraft', JSON.stringify(formData));
      navigate('/login', { state: { from: '/creator/register' } });
      break;

    case API_RESPONSE_TYPES.SERVER_ERROR:
      // Lỗi upload ảnh / lưu database
      showErrorNotification('Hệ thống đang bận. Vui lòng thử lại sau vài phút');
      // Save draft để user không mất dữ liệu
      sessionStorage.setItem('creatorProfileDraft', JSON.stringify(formData));
      console.error('Upload Profile Server Error:', {
        status: response.status,
        code: response.code,
        traceId: response.traceId
      });
      break;

    default:
      // Lỗi khác
      showErrorNotification(message);
      // Save draft
      sessionStorage.setItem('creatorProfileDraft', JSON.stringify(formData));
      console.error('Upload Profile Error:', {
        status: response.status,
        code: response.code,
        traceId: response.traceId
      });
  }
};

    // Load draft on mount
    useState(() => {
        const draft = sessionStorage.getItem('creatorProfileDraft');
        if (draft) {
            try {
                const parsed = JSON.parse(draft);
                setFormData(prev => ({ ...prev, ...parsed }));
                setCurrentStep(parsed.currentStep || 0);
            } catch (e) {
                console.error('Failed to load draft');
            }
        }
    }, []);

    const renderStepContent = () => {
        switch (requiredSteps[currentStep].key) {
            case 'info':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Thông tin cá nhân
                            </h3>
                            <p className="text-sm text-gray-600">
                                Thông tin này sẽ hiển thị trên profile Creator của bạn
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Họ và tên *
                                </label>
                                <input
                                    type="text"
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Nguyễn Văn A"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                />
                                {errors.fullName && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.fullName}
                                    </p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số điện thoại *
                                </label>
                                <input
                                    type="tel"
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.phone ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="0123456789"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giới thiệu bản thân * (tối thiểu 50 ký tự)
                                </label>
                                <textarea
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.bio ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    rows={4}
                                    placeholder="Chia sẻ về kinh nghiệm, chuyên môn và lý do bạn muốn trở thành giảng viên..."
                                    value={formData.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <span className={`text-xs ${
                                        formData.bio.length < 50 ? 'text-gray-500' : 'text-green-600'
                                    }`}>
                                        {formData.bio.length}/1000 ký tự
                                    </span>
                                    {errors.bio && (
                                        <p className="text-sm text-red-600 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.bio}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'image':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Ảnh đại diện
                            </h3>
                            <p className="text-sm text-gray-600">
                                Ảnh profile giúp học viên nhận diện và tin tưởng bạn hơn
                            </p>
                        </div>
                        
                        <div className="flex flex-col items-center space-y-4">
                            <div className={`w-40 h-40 rounded-full border-2 border-dashed flex items-center justify-center bg-gray-50 ${
                                errors.profileImage ? 'border-red-500' : 'border-gray-300'
                            }`}>
                                {formData.profileImage ? (
                                    <img 
                                        src={URL.createObjectURL(formData.profileImage)} 
                                        alt="Profile Preview" 
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <span className="text-sm text-gray-400">Chưa có ảnh</span>
                                    </div>
                                )}
                            </div>
                            
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg"
                                className="hidden"
                                id="profileImage"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        handleInputChange('profileImage', file);
                                    }
                                }}
                            />
                            
                            <label
                                htmlFor="profileImage"
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
                            >
                                {formData.profileImage ? 'Thay đổi ảnh' : 'Chọn ảnh đại diện'}
                            </label>
                            
                            {errors.profileImage && (
                                <p className="text-sm text-red-600 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.profileImage}
                                </p>
                            )}
                            
                            <div className="text-center">
                                <p className="text-sm text-gray-500">
                                    Định dạng: JPG, PNG
                                </p>
                                <p className="text-sm text-gray-500">
                                    Kích thước tối đa: 5MB
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'terms':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Điều khoản và điều kiện
                            </h3>
                            <p className="text-sm text-gray-600">
                                Vui lòng đọc kỹ và đồng ý với các điều khoản dưới đây
                            </p>
                        </div>
                        
                        <div className="bg-gray-50 p-6 rounded-lg max-h-80 overflow-y-auto border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-3">
                                Quy định dành cho Creator
                            </h4>
                            <div className="space-y-3 text-sm text-gray-700">
                                <div>
                                    <h5 className="font-medium mb-1">1. Chất lượng nội dung</h5>
                                    <p>Cam kết tạo nội dung chất lượng, chính xác và có giá trị cho học viên</p>
                                </div>
                                <div>
                                    <h5 className="font-medium mb-1">2. Bản quyền</h5>
                                    <p>Tuân thủ quy định về bản quyền, không sao chép nội dung của người khác</p>
                                </div>
                                <div>
                                    <h5 className="font-medium mb-1">3. Chính sách cộng đồng</h5>
                                    <p>Không đăng tải nội dung vi phạm pháp luật, xúc phạm hoặc gây hại</p>
                                </div>
                                <div>
                                    <h5 className="font-medium mb-1">4. Trách nhiệm</h5>
                                    <p>Chịu trách nhiệm hoàn toàn về nội dung được tạo và đăng tải</p>
                                </div>
                                <div>
                                    <h5 className="font-medium mb-1">5. Hỗ trợ học viên</h5>
                                    <p>Cam kết hỗ trợ và giải đáp thắc mắc của học viên trong khóa học</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className={`flex items-start p-4 rounded-lg ${
                            errors.agreedToTerms ? 'bg-red-50 border border-red-200' : 'bg-blue-50'
                        }`}>
                            <input
                                type="checkbox"
                                id="agreeTerms"
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                                checked={formData.agreedToTerms}
                                onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
                            />
                            <label htmlFor="agreeTerms" className="ml-3 text-sm text-gray-700">
                                <span className="font-medium">
                                    Tôi đã đọc, hiểu và đồng ý với tất cả các điều khoản trên
                                </span>
                                <br />
                                <span className="text-gray-600">
                                    Bằng việc tích vào ô này, bạn chấp nhận tuân thủ các quy định của nền tảng
                                </span>
                            </label>
                        </div>
                        
                        {errors.agreedToTerms && (
                            <p className="text-sm text-red-600 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.agreedToTerms}
                            </p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Trở thành Creator
                    </h1>
                    <p className="text-gray-600">
                        Chỉ 3 bước đơn giản để bắt đầu chia sẻ kiến thức của bạn
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        {requiredSteps.map((step, index) => (
                            <div key={step.key} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                                        index < currentStep 
                                            ? 'bg-green-600 border-green-600 text-white' 
                                            : index === currentStep
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'border-gray-300 text-gray-300 bg-white'
                                    }`}>
                                        {index < currentStep ? (
                                            <CheckIcon className="w-6 h-6" />
                                        ) : (
                                            <span className="font-semibold">{index + 1}</span>
                                        )}
                                    </div>
                                    <p className={`mt-2 text-sm font-medium text-center ${
                                        index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                                    }`}>
                                        {step.title}
                                    </p>
                                </div>
                                {index < requiredSteps.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-4 ${
                                        index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
                    {renderStepContent()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`px-6 py-3 rounded-md font-medium transition-colors ${
                            currentStep === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Quay lại
                    </button>
                    
                    {currentStep < requiredSteps.length - 1 ? (
                        <button
                            onClick={handleNext}
                            className="px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                        >
                            Tiếp theo
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`px-8 py-3 rounded-md font-medium transition-colors ${
                                isSubmitting
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                        >
                            {isSubmitting ? 'Đang xử lý...' : 'Hoàn thành'}
                        </button>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div className="text-sm text-blue-900">
                            <p className="font-medium mb-1">Bạn có thể bổ sung thêm sau</p>
                            <p className="text-blue-700">
                                Sau khi hoàn thành đăng ký, bạn có thể thêm chứng chỉ và thiết lập phương thức thanh toán 
                                trong phần cài đặt tài khoản Creator.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}