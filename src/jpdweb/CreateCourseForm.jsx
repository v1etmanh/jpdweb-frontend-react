import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Image,
  DollarSign,
  Globe,
  BookOpen,
  Target,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Save,
  Users,
  Award,
  Layout,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "./security/Authentication";
import {
  API_RESPONSE_TYPES,
  showSuccessNotification,
  showWarningNotification,
} from "./api/apiClient";
import { creatorApi } from "./api/creatorApi";

// Component InputField tách riêng để tối ưu performance
const InputField = React.memo(
  ({
    label,
    name,
    value,
    onChange,
    error,
    type = "text",
    textarea = false,
    placeholder,
    required = false,
    icon: Icon,
  }) => (
    <div className="mb-8 animate-fade-in">
      <label className="block text-sm font-medium text-text-primary mb-3 flex items-center">
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          rows={4}
          className={`w-full px-4 py-3 border-2 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-main transition-all duration-300 text-text-primary placeholder-text-muted ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-border-light focus:border-primary-main"
          }`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border-2 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-main transition-all duration-300 text-text-primary placeholder-text-muted ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-border-light focus:border-primary-main"
          }`}
        />
      )}
      {error && (
        <div className="flex items-center mt-2 text-red-600 text-sm animate-scale-in">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  )
);

const CreateCourseForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState(() => {
    const draft = localStorage.getItem("courseDraft");
    return draft
      ? JSON.parse(draft)
      : {
          name: "",
          description: "",
          targetAudience: "",
          requirement: "",
          learningObject: "",
          language: "VIETNAMESE",
          teachingLanguage: "VIETNAMESE",
          price: "",
          urlImg: "",
          courseType: "",
          imageFile: null,
        };
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdateCertificate, setIsUpdateCertificate] = useState(() => {
    return localStorage.getItem("certificateUploaded") === "true";
  });
  const auth = useAuth();

  const languages = useMemo(
    () => [
      { value: "ENGLISH", label: "English" },
      { value: "VIETNAMESE", label: "Tiếng Việt" },
      { value: "CHINESE", label: "中文" },
      { value: "JAPANESE", label: "日本語" },
      { value: "KOREAN", label: "한국어" },
      { value: "FRENCH", label: "Français" },
      { value: "GERMAN", label: "Deutsch" },
      { value: "SPANISH", label: "Español" },
      { value: "ITALIAN", label: "Italiano" },
      { value: "RUSSIAN", label: "Русский" },
    ],
    []
  );

  const teachingLanguages = useMemo(
    () => [
      { value: "ENGLISH", label: "English" },
      { value: "VIETNAMESE", label: "Tiếng Việt" },
      { value: "CHINESE", label: "中文" },
      { value: "JAPANESE", label: "日本語" },
      { value: "KOREAN", label: "한국어" },
      { value: "FRENCH", label: "Français" },
      { value: "GERMAN", label: "Deutsch" },
      { value: "SPANISH", label: "Español" },
      { value: "ITALIAN", label: "Italiano" },
      { value: "RUSSIAN", label: "Русский" },
    ],
    []
  );

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if (courseData.name || courseData.description) {
        localStorage.setItem("courseDraft", JSON.stringify(courseData));
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [courseData]);

  const handleInputChange = useCallback(
    (field, value) => {
      setCourseData((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        image: "Vui lòng chọn file hình ảnh",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Kích thước file không được vượt quá 5MB",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setCourseData((prev) => ({
        ...prev,
        urlImg: e.target.result,
        imageFile: file,
      }));
    };
    reader.readAsDataURL(file);

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.image;
      return newErrors;
    });
  }, []);

  const validateStep = useCallback(
    (step) => {
      const newErrors = {};

      switch (step) {
        case 1:
          if (!courseData.name.trim()) {
            newErrors.name = "Tên khóa học là bắt buộc";
          } else if (courseData.name.length < 10) {
            newErrors.name = "Tên khóa học phải có ít nhất 10 ký tự";
          }

          if (!courseData.description.trim()) {
            newErrors.description = "Mô tả khóa học là bắt buộc";
          } else if (courseData.description.length < 50) {
            newErrors.description = "Mô tả phải có ít nhất 50 ký tự";
          }
          break;

        case 2:
          if (!courseData.targetAudience.trim()) {
            newErrors.targetAudience = "Đối tượng học viên là bắt buộc";
          }

          if (!courseData.requirement.trim()) {
            newErrors.requirement = "Yêu cầu tiên quyết là bắt buộc";
          }

          if (!courseData.learningObject.trim()) {
            newErrors.learningObject = "Mục tiêu học tập là bắt buộc";
          }
          break;

        case 3:
          if (!courseData.courseType) {
            newErrors.courseType = "Loại khóa học là bắt buộc";
          }

          if (courseData.courseType === "PAID") {
            if (!courseData.price) {
              newErrors.price = "Giá khóa học là bắt buộc";
            } else if (
              isNaN(courseData.price) ||
              parseFloat(courseData.price) <= 0
            ) {
              newErrors.price = "Giá phải lớn hơn 0";
            }
          }

          if (!courseData.urlImg) {
            newErrors.image = "Hình ảnh khóa học là bắt buộc";
          }
          break;
        case 4:
          if (!courseData.language || courseData.language === "") {
            newErrors.language = "Ngôn ngữ là bắt buộc";
          }
          break;
        case 5:
          if (
            !courseData.teachingLanguage ||
            courseData.teachingLanguage === ""
          ) {
            newErrors.teachingLanguage = "Ngôn ngữ giảng dạy là bắt buộc";
          }
          break;
        default:
          break;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [courseData]
  );

  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [validateStep, currentStep]);

  const handlePrevStep = useCallback(() => {
    setCurrentStep((prev) => prev - 1);
  }, []);

  const handleError = (response) => {
    switch (response.responseType) {
      case API_RESPONSE_TYPES.UNAUTHORIZED:
        showWarningNotification("Bạn không có quyền tao khoa hoc");
        break;
      case API_RESPONSE_TYPES.NOT_FOUND:
        showWarningNotification("không tìm thấy tài khoản của bạn");
        break;
      case API_RESPONSE_TYPES.CONFLICT:
        showWarningNotification("Dữ liệu đầu vào bị xung đột");
        break;
      default:
        showWarningNotification("Có lỗi xảy ra, vui lòng thử lại sau");
        console.error("Error:", response.traceId, response.message);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    console.log(auth.creatorInfor.status);
    if (
      courseData.courseType === "PAID" &&
      auth.creatorInfor.status !== "SUCCESS"
    ) {
      localStorage.setItem("courseDraft", JSON.stringify(courseData));
      navigate("/creator/profile", {
        state: {
          redirectTo: "/create-course",
          message:
            "Vui lòng cập nhật chứng chỉ và thông tin thanh toán để tạo khóa học có phí",
        },
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();

      if (courseData.imageFile) {
        formData.append("imgFile", courseData.imageFile);
      }

      formData.append("name", courseData.name.trim());
      formData.append("description", courseData.description.trim());
      formData.append("targetAudience", courseData.targetAudience.trim());
      formData.append("requirements", courseData.requirement.trim());
      formData.append("learningObject", courseData.learningObject.trim());
      formData.append("language", courseData.language);
      formData.append("teachingLanguage", courseData.teachingLanguage);
      formData.append("accessMode", courseData.courseType);

      const priceValue =
        courseData.courseType === "PAID" ? parseFloat(courseData.price) : 0;
      formData.append("price", priceValue);

      if (process.env.NODE_ENV === "development") {
        console.log("Submitting course data:", {
          name: courseData.name,
          courseType: courseData.courseType,
          price: priceValue,
          hasImage: !!courseData.imageFile,
        });
      }

      const response = await creatorApi.createCourse(formData);

      if (response.success) {
        localStorage.removeItem("courseDraft");
        showSuccessNotification("Khóa học đã được tạo thành công!");
        navigate("/creator/courseList");
      } else {
        handleError(response);
      }
    } catch (error) {
      showWarningNotification("Error creating course:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    validateStep,
    courseData,
    isUpdateCertificate,
    navigate,
    auth.creatorInfor.status,
  ]);

  const removeImage = useCallback(() => {
    setCourseData((prev) => ({
      ...prev,
      urlImg: "",
      imageFile: null,
    }));
  }, []);

  const handleLanguageChange = useCallback(
    (e) => {
      handleInputChange("language", e.target.value);
    },
    [handleInputChange]
  );

  const handleTeachingLanguageChange = useCallback(
    (e) => {
      handleInputChange("teachingLanguage", e.target.value);
    },
    [handleInputChange]
  );

  const handleCourseTypeChange = useCallback(
    (e) => {
      const value = e.target.value;
      handleInputChange("courseType", value);

      if (value !== "PAID" && courseData.price) {
        handleInputChange("price", "");
      }
    },
    [handleInputChange, courseData.price]
  );

  const revenueInfo = useMemo(() => {
    if (!courseData.price || courseData.courseType !== "PAID") return null;

    const price = parseFloat(courseData.price);
    if (isNaN(price) || price <= 0) return null;

    const platformFee = price * 0.2;
    const userRevenue = price * 0.8;

    return { price, platformFee, userRevenue };
  }, [courseData.price, courseData.courseType]);

  // Enhanced Step Indicator với animation
  const StepIndicator = useMemo(
    () => (
      <div className="flex items-center justify-center mb-12 animate-slide-up">
        {[
          { number: 1, label: "Thông tin cơ bản", icon: BookOpen },
          { number: 2, label: "Mục tiêu học tập", icon: Target },
          { number: 3, label: "Định giá & Media", icon: DollarSign },
        ].map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`flex flex-col items-center transition-all duration-500 ${
                step.number <= currentStep ? "scale-110" : "scale-100"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-semibold border-2 transition-all duration-500 shadow-soft ${
                  step.number <= currentStep
                    ? "bg-primary-main text-white border-primary-main shadow-medium"
                    : "bg-white text-text-muted border-border-light"
                }`}
              >
                {step.number < currentStep ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                  step.number <= currentStep
                    ? "text-primary-main"
                    : "text-text-muted"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < 2 && (
              <div
                className={`w-24 h-1 mx-4 transition-all duration-500 ${
                  step.number < currentStep
                    ? "bg-primary-main"
                    : "bg-border-light"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    ),
    [currentStep]
  );

  const handleBack = useCallback(() => {
    if (
      window.confirm(
        "Bạn có chắc muốn rời khỏi trang? Dữ liệu đã nhập sẽ được lưu tạm thời."
      )
    ) {
      navigate(-1);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background py-8 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-3xl shadow-soft border border-border-light p-8 mb-8 animate-scale-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="mr-6 p-3 hover:bg-primary-light rounded-2xl transition-all duration-300 group"
              >
                <ArrowLeft className="w-6 h-6 text-text-primary group-hover:text-primary-main transition-colors" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">
                  Tạo khóa học mới
                </h1>
                <p className="text-text-secondary mt-2 text-lg">
                  Chia sẻ kiến thức và kiếm tiền từ khóa học của bạn
                </p>
              </div>
            </div>
            <div className="text-lg font-semibold text-primary-main bg-primary-light px-4 py-2 rounded-2xl">
              Bước {currentStep}/3
            </div>
          </div>
        </div>

        {StepIndicator}

        <div className="bg-white rounded-3xl shadow-soft border border-border-light p-10 animate-fade-in">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-2">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-primary-light rounded-2xl mr-4">
                  <BookOpen className="w-8 h-8 text-primary-main" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">
                    Thông tin cơ bản
                  </h2>
                  <p className="text-text-secondary mt-1">
                    Thiết lập thông tin cơ bản cho khóa học của bạn
                  </p>
                </div>
              </div>

              <InputField
                label="Tên khóa học"
                name="name"
                value={courseData.name}
                onChange={handleInputChange}
                error={errors.name}
                placeholder="VD: React.js từ cơ bản đến nâng cao"
                required
                icon={Layout}
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
                icon={BookOpen}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3 flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Ngôn ngữ <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={courseData.language}
                      onChange={handleLanguageChange}
                      className="w-full px-4 py-3 border-2 border-border-light bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all duration-300 text-text-primary appearance-none"
                    >
                      {languages.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <Layout className="w-5 h-5 text-text-muted" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3 flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Ngôn ngữ giảng dạy{" "}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={courseData.teachingLanguage}
                      onChange={handleTeachingLanguageChange}
                      className="w-full px-4 py-3 border-2 border-border-light bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all duration-300 text-text-primary appearance-none"
                    >
                      {teachingLanguages.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <Layout className="w-5 h-5 text-text-muted" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Learning Objectives */}
          {currentStep === 2 && (
            <div className="space-y-2">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-primary-light rounded-2xl mr-4">
                  <Target className="w-8 h-8 text-primary-main" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">
                    Mục tiêu & Đối tượng
                  </h2>
                  <p className="text-text-secondary mt-1">
                    Xác định rõ mục tiêu và đối tượng học viên mục tiêu
                  </p>
                </div>
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
                icon={Users}
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
                icon={Award}
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
                icon={Target}
              />
            </div>
          )}

          {/* Step 3: Pricing & Media */}
          {currentStep === 3 && (
            <div className="space-y-2">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-primary-light rounded-2xl mr-4">
                  <DollarSign className="w-8 h-8 text-primary-main" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">
                    Định giá & Hình ảnh
                  </h2>
                  <p className="text-text-secondary mt-1">
                    Thiết lập mô hình kinh doanh và hình ảnh cho khóa học
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-text-primary mb-3 flex items-center">
                      <Layout className="w-4 h-4 mr-2" />
                      Loại khóa học <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      value={courseData.courseType}
                      onChange={handleCourseTypeChange}
                      className={`w-full px-4 py-3 border-2 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-main transition-all duration-300 text-text-primary ${
                        errors.courseType
                          ? "border-red-500 focus:ring-red-500"
                          : "border-border-light focus:border-primary-main"
                      }`}
                    >
                      <option value="">-- Chọn loại khóa học --</option>
                      <option value="PUBLIC">Công khai (Miễn phí)</option>
                      <option value="PRIVATE">Riêng tư</option>
                      <option value="PAID">Có phí</option>
                    </select>
                    {errors.courseType && (
                      <div className="flex items-center mt-2 text-red-600 text-sm animate-scale-in">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.courseType}
                      </div>
                    )}
                  </div>

                  {courseData.courseType === "PAID" && (
                    <div className="space-y-6 animate-slide-up">
                      <InputField
                        label="Giá khóa học (VNĐ)"
                        name="price"
                        value={courseData.price}
                        onChange={handleInputChange}
                        error={errors.price}
                        type="number"
                        placeholder="499000"
                        required
                        icon={DollarSign}
                      />

                      {revenueInfo && (
                        <div className="p-6 bg-primary-light rounded-2xl border border-primary-main animate-scale-in">
                          <h4 className="font-semibold text-primary-main mb-3 text-lg">
                            Dự kiến thu nhập:
                          </h4>
                          <div className="space-y-2 text-sm text-primary-dark">
                            <div className="flex justify-between">
                              <span>Giá gốc:</span>
                              <span className="font-semibold">
                                {revenueInfo.price.toLocaleString("vi-VN")} VNĐ
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Phí nền tảng (20%):</span>
                              <span className="font-semibold">
                                {revenueInfo.platformFee.toLocaleString(
                                  "vi-VN"
                                )}{" "}
                                VNĐ
                              </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-border-main">
                              <span className="font-bold">Bạn nhận được:</span>
                              <span className="font-bold text-lg text-primary-main">
                                {revenueInfo.userRevenue.toLocaleString(
                                  "vi-VN"
                                )}{" "}
                                VNĐ
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {!isUpdateCertificate && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-2xl animate-pulse">
                          <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-yellow-800">
                              <p className="font-medium mb-1">
                                Cần cập nhật thông tin
                              </p>
                              <p>
                                Để tạo khóa học có phí, bạn cần cập nhật chứng
                                chỉ và thông tin thanh toán.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <di className="animate-fade-in">
                  <label className="block text-sm font-medium text-text-primary mb-3 flex items-center">
                    Hình ảnh khóa học{" "}
                    <span className="text-red-500 ml-1">*</span>
                  </label>

                  <div className="relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-medium">
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
                          <p className="text-gray-600 mb-2">
                            Kéo thả hoặc click để tải ảnh lên
                          </p>
                          <p className="text-sm text-gray-400">
                            PNG, JPG tối đa 5MB
                          </p>
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
                </di>
              </div>
            </div>
          )}

          {/* Enhanced Navigation Buttons */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-border-light">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-text-primary border-2 border-border-light hover:bg-primary-light hover:border-primary-main hover:shadow-soft"
              }`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Quay lại
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-primary-main text-white rounded-2xl font-semibold hover:bg-primary-dark hover:shadow-medium transition-all duration-300 flex items-center group"
              >
                Tiếp theo
                <Layout className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 hover:shadow-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center group"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Tạo khóa học
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Tips Section */}
        <div className="bg-primary-light rounded-3xl p-8 mt-8 border border-primary-main animate-fade-in">
          <h3 className="font-bold text-primary-main text-xl mb-4 flex items-center">
            <Award className="w-6 h-6 mr-2" />
            Mẹo tạo khóa học thành công
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Tên khóa học nên rõ ràng, cụ thể và hấp dẫn",
              "Mô tả chi tiết giúp học viên hiểu rõ giá trị nhận được",
              "Hình ảnh chất lượng cao sẽ thu hút nhiều học viên hơn",
              "Định giá hợp lý dựa trên giá trị nội dung cung cấp",
              "Xác định rõ đối tượng học viên mục tiêu",
              "Khóa học có phí yêu cầu cập nhật chứng chỉ và thông tin thanh toán",
            ].map((tip, index) => (
              <div
                key={index}
                className="flex items-start p-3 bg-white rounded-2xl shadow-soft"
              >
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-text-primary">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourseForm;
