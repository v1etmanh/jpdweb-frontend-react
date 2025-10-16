import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  Image, 
  DollarSign, 
  Globe, 
  BookOpen,
  Target,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Save
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createNewCourse } from './api/ApiConnect';

// Component InputField tách riêng để tối ưu performance
const InputField = React.memo(({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  type = "text", 
  textarea = false, 
  placeholder, 
  required = false 
}) => (
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
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState(() => {
    // Khôi phục draft nếu có
    const draft = localStorage.getItem('courseDraft');
    return draft ? JSON.parse(draft) : {
      name: '',
      description: '',
      targetAudience: '',
      requirement: '',
      learningObject: '',
      language: 'Vietnamese',
      teachingLanguage:'',
      price: '',
      urlImg: '',
      courseType: '',
      imageFile: null
    };
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdateCertificate, setIsUpdateCertificate] = useState(() => {
    return localStorage.getItem('certificateUploaded') === 'true';
  });
 /*
 ENGLISH,
    VIETNAMESE,
    CHINESE,
    JAPANESE,
    KOREAN,
    FRENCH,
    GERMAN,
    SPANISH,
    ITALIAN,
    RUSSIAN,
*/ 
const languages = useMemo(() => [
  { value: 'ENGLISH', label: 'English' },
  { value: 'VIETNAMESE', label: 'Tiếng Việt' },
  { value: 'CHINESE', label: '中文' },
  { value: 'JAPANESE', label: '日本語' },
  { value: 'KOREAN', label: '한국어' },
  { value: 'FRENCH', label: 'Français' },
  { value: 'GERMAN', label: 'Deutsch' },
  { value: 'SPANISH', label: 'Español' },
  { value: 'ITALIAN', label: 'Italiano' },
  { value: 'RUSSIAN', label: 'Русский' }
], []);

const teachingLanguages = useMemo(() => [
  { value: 'ENGLISH', label: 'English' },
  { value: 'VIETNAMESE', label: 'Tiếng Việt' },
  { value: 'CHINESE', label: '中文' },
  { value: 'JAPANESE', label: '日本語' },
  { value: 'KOREAN', label: '한국어' },
  { value: 'FRENCH', label: 'Français' },
  { value: 'GERMAN', label: 'Deutsch' },
  { value: 'SPANISH', label: 'Español' },
  { value: 'ITALIAN', label: 'Italiano' },
  { value: 'RUSSIAN', label: 'Русский' }
], []);

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if (courseData.name || courseData.description) {
        localStorage.setItem('courseDraft', JSON.stringify(courseData));
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [courseData]);

  const handleInputChange = useCallback((field, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Xóa error khi user bắt đầu nhập
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

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
    
    // Xóa error image
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.image;
      return newErrors;
    });
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
        if (!courseData.courseType) {
          newErrors.courseType = 'Loại khóa học là bắt buộc';
        }
        
        // Chỉ validate price nếu là PAID
        if (courseData.courseType === 'PAID') {
          if (!courseData.price) {
            newErrors.price = 'Giá khóa học là bắt buộc';
          } else if (isNaN(courseData.price) || parseFloat(courseData.price) <= 0) {
            newErrors.price = 'Giá phải lớn hơn 0';
          }
        }

        if (!courseData.urlImg) {
          newErrors.image = 'Hình ảnh khóa học là bắt buộc';
        }
        break;

      default:
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

  const handlePrevStep = useCallback(() => {
    setCurrentStep(prev => prev - 1);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateStep(3)) return;
    
    setIsSubmitting(true);
    
    // Kiểm tra certificate cho PAID course
    if (courseData.courseType === "PAID" && !isUpdateCertificate) {
      localStorage.setItem('courseDraft', JSON.stringify(courseData));
      navigate("/upload_profile", { 
        state: { 
          redirectTo: '/create-course',
          message: 'Vui lòng cập nhật chứng chỉ và thông tin thanh toán để tạo khóa học có phí'
        } 
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      const formData = new FormData();
      
      // Append image file
      if (courseData.imageFile) {
        formData.append('imgFile', courseData.imageFile);
      }
      
      // Append course data
      formData.append('name', courseData.name.trim());
      formData.append('description', courseData.description.trim());
      formData.append('targetAudience', courseData.targetAudience.trim());
      formData.append('requirements', courseData.requirement.trim());
      formData.append('learningObject', courseData.learningObject.trim());
      formData.append('language', courseData.language);
      formData.append('teachingLanguage', courseData.teachingLanguage);
      formData.append('accessMode', courseData.courseType);
      
      // Append price (0 cho PUBLIC/PRIVATE, giá thực cho PAID)
      const priceValue = courseData.courseType === "PAID" 
        ? parseFloat(courseData.price) 
        : 0;
      formData.append('price', priceValue);

      // Debug log (chỉ trong development)
      if (process.env.NODE_ENV === 'development') {
        console.log('Submitting course data:', {
          name: courseData.name,
          courseType: courseData.courseType,
          price: priceValue,
          hasImage: !!courseData.imageFile
        });
      }

      const response = await createNewCourse(formData);
      
      if (response.status === 200 || response.status === 201) {
        // Clear draft
        localStorage.removeItem('courseDraft');
        
        alert('Khóa học đã được tạo thành công!');
        
        // Redirect tới trang quản lý khóa học
        navigate('/my-courses');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      
      let errorMessage = 'Có lỗi xảy ra khi tạo khóa học';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        switch(status) {
          case 403:
            errorMessage = 'Bạn cần cập nhật thông tin thanh toán và chứng chỉ trước khi tạo khóa học có phí';
            setTimeout(() => navigate("/upload_profile"), 2000);
            break;
            
          case 404:
            errorMessage = 'Không tìm thấy tài khoản hoặc hồ sơ giảng viên. Vui lòng đăng nhập lại';
            break;
            
          case 400:
            errorMessage = data?.error || data?.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin';
            break;
            
          case 500:
            errorMessage = 'Lỗi server. Vui lòng thử lại sau';
            break;
            
          default:
            errorMessage = data?.error || data?.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng';
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateStep, courseData, isUpdateCertificate, navigate]);

  const removeImage = useCallback(() => {
    setCourseData(prev => ({ 
      ...prev, 
      urlImg: '', 
      imageFile: null 
    }));
  }, []);

  const handleLanguageChange = useCallback((e) => {
    handleInputChange('language', e.target.value);
  }, [handleInputChange]);
const handleTeachingLanguageChange = useCallback((e) => {
    handleInputChange('teachingLanguage', e.target.value);
  }, [handleInputChange]);

  const handleCourseTypeChange = useCallback((e) => {
    const value = e.target.value;
    handleInputChange('courseType', value);
    
    // Reset price nếu chuyển từ PAID sang PUBLIC/PRIVATE
    if (value !== 'PAID' && courseData.price) {
      handleInputChange('price', '');
    }
  }, [handleInputChange, courseData.price]);

  // Tính toán doanh thu
  const revenueInfo = useMemo(() => {
    if (!courseData.price || courseData.courseType !== 'PAID') return null;
    
    const price = parseFloat(courseData.price);
    if (isNaN(price) || price <= 0) return null;
    
    const platformFee = price * 0.2;
    const userRevenue = price * 0.8;
    
    return { price, platformFee, userRevenue };
  }, [courseData.price, courseData.courseType]);

  // Step indicator component
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

  const handleBack = useCallback(() => {
    if (window.confirm('Bạn có chắc muốn rời khỏi trang? Dữ liệu đã nhập sẽ được lưu tạm thời.')) {
      navigate(-1);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={handleBack}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
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
                  Ngôn ngữ  <span className="text-red-500">*</span>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngôn ngữ giảng dạy <span className="text-red-500">*</span>
                </label>
                  <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={courseData.teachingLanguage}
                    onChange={handleTeachingLanguageChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {teachingLanguages.map(lang => (
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
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại khóa học <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={courseData.courseType}
                      onChange={handleCourseTypeChange}
                      className={`w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                        errors.courseType ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">-- Chọn loại khóa học --</option>
                      <option value="PUBLIC">Công khai (Miễn phí)</option>
                      <option value="PRIVATE">Riêng tư</option>
                      <option value="PAID">Có phí</option>
                    </select>
                    {errors.courseType && (
                      <div className="flex items-center mt-1 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.courseType}
                      </div>
                    )}
                  </div>

                  {courseData.courseType === 'PAID' && (
                    <>
                      <InputField
                        label="Giá khóa học (VNĐ)"
                        name="price"
                        value={courseData.price}
                        onChange={handleInputChange}
                        error={errors.price}
                        type="number"
                        placeholder="499000"
                        required
                      />

                      {revenueInfo && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Dự kiến thu nhập:</h4>
                          <div className="text-sm text-blue-700 space-y-1">
                            <p>Giá gốc: {revenueInfo.price.toLocaleString('vi-VN')} VNĐ</p>
                            <p>Phí nền tảng (20%): {revenueInfo.platformFee.toLocaleString('vi-VN')} VNĐ</p>
                            <p className="font-semibold">Bạn nhận được: {revenueInfo.userRevenue.toLocaleString('vi-VN')} VNĐ</p>
                          </div>
                        </div>
                      )}

                      {!isUpdateCertificate && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-yellow-800">
                              <p className="font-medium mb-1">Cần cập nhật thông tin</p>
                              <p>Để tạo khóa học có phí, bạn cần cập nhật chứng chỉ và thông tin thanh toán.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
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
                          title="Xóa ảnh"
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
          <h3 className="font-semibold text-blue-900 mb-3">Mẹo tạo khóa học thành công:</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>Tên khóa học nên rõ ràng, cụ thể và hấp dẫn</li>
            <li>Mô tả chi tiết giúp học viên hiểu rõ giá trị nhận được</li>
            <li>Hình ảnh chất lượng cao sẽ thu hút nhiều học viên hơn</li>
            <li>Định giá hợp lý dựa trên giá trị nội dung cung cấp</li>
            <li>Khóa học có phí yêu cầu cập nhật chứng chỉ và thông tin thanh toán</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateCourseForm;