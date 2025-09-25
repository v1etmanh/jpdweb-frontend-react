import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  Upload, 
  Image, 
  DollarSign, 
  Users, 
  Globe, 
  BookOpen,
  Target,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Component InputField được tách ra ngoài để tránh re-render
const InputField = React.memo(({ label, name, value, onChange, error, type = "text", textarea = false, placeholder, required = false }) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {textarea ? (
      <textarea
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        rows={4}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
    )}
    {error && (
      <div className="flex items-center mt-1 text-red-600 text-sm">
        <AlertCircle className="w-4 h-4 mr-1" />
        {error}
      </div>
    )}
  </div>
));

const CreateCourseForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    targetAudience: '',
    requirement: '',
    learningObject: '',
    language: 'Vietnamese',
    price: '',
    urlImg: '',
     courseType: '',
    imageFile: null
  });
  const[courseType,setCourseType]=useState(null)
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const[isShowPrice,setIsShowPrice]=useState(false)
  const languages = useMemo(() => [
    { value: 'Vietnamese', label: 'Tiếng Việt' },
    { value: 'English', label: 'English' },
    { value: 'Japanese', label: '日本語' },
    { value: 'Korean', label: '한국어' },
    { value: 'Chinese', label: '中文' }
  ], []);
  const[isUpdateCertifate,setIsUpdateCertificate]=useState(false)
  const nav=useNavigate()
useEffect(()=>{
if(courseType=="commercial")

  {
   setIsShowPrice(true)
  }
  else {
    setIsShowPrice(false)
  }

},[courseType])
  const handleInputChange = useCallback((field, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    setErrors(prev => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Vui lòng chọn file hình ảnh'
        }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Kích thước file không được vượt quá 5MB'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setCourseData(prev => ({
          ...prev,
          urlImg: e.target.result,
          imageFile: file
        }));
      };
      reader.readAsDataURL(file);
      
      // Clear image error
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    }
  }, []);

  const validateStep = useCallback((step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!courseData.name.trim()) {
          newErrors.name = 'Tên khóa học là bắt buộc';
        } else if (courseData.name.length < 10) {
          newErrors.name = 'Tên khóa học phải có ít nhất 10 ký tự';
        }

        if (!courseData.description.trim()) {
          newErrors.description = 'Mô tả khóa học là bắt buộc';
        } else if (courseData.description.length < 50) {
          newErrors.description = 'Mô tả phải có ít nhất 50 ký tự';
        }
        break;

      case 2:
        if (!courseData.targetAudience.trim()) {
          newErrors.targetAudience = 'Đối tượng học viên là bắt buộc';
        }

        if (!courseData.requirement.trim()) {
          newErrors.requirement = 'Yêu cầu tiên quyết là bắt buộc';
        }

        if (!courseData.learningObject.trim()) {
          newErrors.learningObject = 'Mục tiêu học tập là bắt buộc';
        }
        break;

      case 3:
        if (!courseData.price) {
          newErrors.price = 'Giá khóa học là bắt buộc';
        } else if (isNaN(courseData.price) || parseFloat(courseData.price) < 0) {
          newErrors.price = 'Giá phải là số dương';
        }

        if (!courseData.urlImg) {
          newErrors.image = 'Hình ảnh khóa học là bắt buộc';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [courseData]);

  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  }, [validateStep, currentStep]);

  const handleSubmit = useCallback(async () => {
    if (!validateStep(3)) return;
      
    setIsSubmitting(true);
   if(courseData.courseType == "commercial"){ // Sửa thành ===
    if(isUpdateCertifate == false){ // Sửa thành isUpdateCertificate và ===
      nav("/upload_profile")
      return; // Thêm return để thoát function
    }
  }
    try {
      // Here you would make API call to create course
      const formData = new FormData();
      Object.keys(courseData).forEach(key => {
        if (key === 'imageFile' && courseData[key]) {
          formData.append('image', courseData[key]);
        } else if (key !== 'imageFile' && key !== 'urlImg') {
          formData.append(key, courseData[key]);
        }
      }  );

      console.log('Course data:', courseData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Khóa học đã được tạo thành công!');
      // Reset form or redirect
      
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Có lỗi xảy ra khi tạo khóa học');
    } finally {
      setIsSubmitting(false);
    }
  }, [validateStep, courseData]);

  const StepIndicator = useMemo(() => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  ), [currentStep]);

  const removeImage = useCallback(() => {
    setCourseData(prev => ({ ...prev, urlImg: '', imageFile: null }));
  }, []);

  const handleLanguageChange = useCallback((e) => {
    handleInputChange('language', e.target.value);
  }, [handleInputChange]);

  const handlePrevStep = useCallback(() => {
    setCurrentStep(prev => prev - 1);
  }, []);

  // Tính toán doanh thu
  const revenueInfo = useMemo(() => {
    if (!courseData.price) return null;
    const price = parseInt(courseData.price);
    const platformFee = price * 0.2;
    const userRevenue = price * 0.8;
    return { price, platformFee, userRevenue };
  }, [courseData.price]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tạo khóa học mới</h1>
                <p className="text-gray-600 mt-1">Chia sẻ kiến thức và kiếm tiền từ khóa học của bạn</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Bước {currentStep}/3
            </div>
          </div>
        </div>

        {StepIndicator}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div>
              <div className="flex items-center mb-6">
                <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Thông tin cơ bản</h2>
              </div>

              <InputField
                label="Tên khóa học"
                name="name"
                value={courseData.name}
                onChange={handleInputChange}
                error={errors.name}
                placeholder="VD: React.js từ cơ bản đến nâng cao"
                required
              />

              <InputField
                label="Mô tả khóa học"
                name="description"
                value={courseData.description}
                onChange={handleInputChange}
                error={errors.description}
                textarea
                placeholder="Mô tả chi tiết về nội dung, lợi ích và giá trị mà học viên sẽ nhận được..."
                required
              />

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngôn ngữ giảng dạy <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={courseData.language}
                    onChange={handleLanguageChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {languages.map(lang => (
                      <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Learning Objectives */}
          {currentStep === 2 && (
            <div>
              <div className="flex items-center mb-6">
                <Target className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Mục tiêu & Đối tượng</h2>
              </div>

              <InputField
                label="Đối tượng học viên"
                name="targetAudience"
                value={courseData.targetAudience}
                onChange={handleInputChange}
                error={errors.targetAudience}
                textarea
                placeholder="VD: Lập trình viên mới bắt đầu, sinh viên CNTT, người muốn chuyển nghề..."
                required
              />

              <InputField
                label="Yêu cầu tiên quyết"
                name="requirement"
                value={courseData.requirement}
                onChange={handleInputChange}
                error={errors.requirement}
                textarea
                placeholder="VD: Kiến thức HTML/CSS cơ bản, biết sử dụng máy tính..."
                required
              />

              <InputField
                label="Mục tiêu học tập"
                name="learningObject"
                value={courseData.learningObject}
                onChange={handleInputChange}
                error={errors.learningObject}
                textarea
                placeholder="VD: Xây dựng được ứng dụng web hoàn chỉnh, nắm vững React hooks..."
                required
              />
            </div>
          )}

          {/* Step 3: Pricing & Media */}
          {currentStep === 3 && (
            <div>
              <div className="flex items-center mb-6">
                <DollarSign className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Định giá & Hình ảnh</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
             <select
    id="courseType"
    name="courseType"
    value={courseData.courseType}
   onChange={(e) => {
  const value = e.target.value;
  setCourseType(value);
  handleInputChange('courseType', value); // Cập nhật vào courseData
}}
    required
    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
  >
    <option value="">-- Select type --</option>
    <option value="public">Public</option>
    <option value="private">Private</option>
    <option value="commercial">Commercial</option>
  </select>
{isShowPrice&& <InputField label="Giá khóa học (VNĐ)" 
name="price" value={courseData.price} 
onChange={handleInputChange} error={errors.price} 
type="number" placeholder="499000" required />}
                  {revenueInfo && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Dự kiến thu nhập:</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p>• Giá gốc: {revenueInfo.price.toLocaleString('vi-VN')} VNĐ</p>
                        <p>• Phí nền tảng (20%): {revenueInfo.platformFee.toLocaleString('vi-VN')} VNĐ</p>
                        <p className="font-semibold">• Bạn nhận được: {revenueInfo.userRevenue.toLocaleString('vi-VN')} VNĐ</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình ảnh khóa học <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    {courseData.urlImg ? (
                      <div className="relative">
                        <img 
                          src={courseData.urlImg} 
                          alt="Course preview" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 w-6 h-6 flex items-center justify-center text-sm"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <div>
                          <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-2">Kéo thả hoặc click để tải ảnh lên</p>
                          <p className="text-sm text-gray-400">PNG, JPG tối đa 5MB</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  
                  {errors.image && (
                    <div className="flex items-center mt-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.image}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Quay lại
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Tiếp theo
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Tạo khóa học
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-blue-50 rounded-xl p-6 mt-8">
          <h3 className="font-semibold text-blue-900 mb-3">💡 Mẹo tạo khóa học thành công:</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Tên khóa học nên rõ ràng, cụ thể và hấp dẫn</li>
            <li>• Mô tả chi tiết giúp học viên hiểu rõ giá trị nhận được</li>
            <li>• Hình ảnh chất lượng cao sẽ thu hút nhiều học viên hơn</li>
            <li>• Định giá hợp lý dựa trên giá trị nội dung cung cấp</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateCourseForm;