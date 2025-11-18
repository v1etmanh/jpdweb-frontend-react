import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { kahootApi } from "../../api/creator/kahootApi";
import { showSuccessNotification, showWarningNotification } from "../../api/core/apiClient";
import MixedQuestionForm from "../component/KahootForm";
import { kahootModuleContentApi } from "../../api/creator/kahootModuleContentApi";
import { BookOpen, Plus, Trash2, Edit3, Save, Loader2 } from "lucide-react";

export default function KahootSpecificContentPage() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [kahootTitle, setKahootTitle] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await kahootApi.getModuleContents(id);
            if (response.success) {
                setData(response.data);
            } else {
                showWarningNotification("Không thể tải dữ liệu");
            }
        } catch (error) {
            showWarningNotification("Lỗi khi tải dữ liệu");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleDeleteContent = async (mcId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa nội dung này?')) {
            const response = await kahootModuleContentApi.deleteOne(id, mcId);
            if (response.success) {
                showSuccessNotification("Xóa thành công");
                fetchData(); // Refresh data
            } else {
                showWarningNotification('Không thể xóa nội dung');
            }
        }
    };

    const saveModuleContent = async (contents) => {
        setIsSaving(true);
        try {
            const response = await kahootModuleContentApi.updateAll(id, contents);
            if (response.success) {
                showSuccessNotification("Lưu thành công");
            } else {
                showWarningNotification("Không thể lưu nội dung");
            }
        } catch (error) {
            showWarningNotification("Lỗi khi lưu nội dung");
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center font-sans">
                <div className="text-center">
                    <div className="w-16 h-16 bg-[#06B6D4] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                    <p className="text-gray-600 text-lg">Đang tải nội dung Kahoot...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F1F5F9] font-sans">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-[#06B6D4] rounded-xl">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Quản lý Nội dung Kahoot
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    Tạo và quản lý các câu hỏi tương tác cho bài học của bạn
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => document.getElementById('save-btn')?.click()}
                                disabled={isSaving}
                                className="flex items-center space-x-2 bg-[#F97316] hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                <span>{isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-[#06B6D4]/10 rounded-lg p-4 border border-[#06B6D4]/20">
                            <p className="text-sm text-[#06B6D4] font-medium">Tổng số câu hỏi</p>
                            <p className="text-2xl font-bold text-gray-900">{data.length}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <p className="text-sm text-green-600 font-medium">Đã hoàn thành</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <p className="text-sm text-blue-600 font-medium">Đang chỉnh sửa</p>
                            <p className="text-2xl font-bold text-gray-900">{data.length}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                            <p className="text-sm text-purple-600 font-medium">Trạng thái</p>
                            <p className="text-lg font-bold text-gray-900">Đang soạn</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Instructions Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-[#06B6D4] rounded-lg">
                            <Edit3 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Hướng dẫn tạo câu hỏi
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div className="space-y-2">
                                    <p>• Nhập câu hỏi rõ ràng và dễ hiểu</p>
                                    <p>• Thêm 4 lựa chọn cho mỗi câu hỏi</p>
                                    <p>• Đánh dấu đáp án đúng cho mỗi câu</p>
                                </div>
                                <div className="space-y-2">
                                    <p>• Sử dụng hình ảnh minh họa nếu cần</p>
                                    <p>• Đặt thời gian phù hợp cho mỗi câu</p>
                                    <p>• Kiểm tra kỹ đáp án trước khi lưu </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Questions Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Danh sách câu hỏi ({data.length})
                        </h2>
                        <button className="flex items-center space-x-2 bg-[#06B6D4] hover:bg-[#0891b2] text-white px-4 py-2 rounded-lg font-medium transition-all duration-300">
                            <Plus className="w-5 h-5" />
                            <span>Thêm câu hỏi</span>
                        </button>
                    </div>

                    {/* Questions Container */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        {data.length === 0 ? (
                            <div className="text-center py-12">
                                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    Chưa có câu hỏi nào
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Bắt đầu bằng cách thêm câu hỏi đầu tiên cho Kahoot của bạn
                                </p>
                                <button className="bg-[#06B6D4] hover:bg-[#0891b2] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                    Thêm câu hỏi đầu tiên
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {data.map((item, index) => (
                                    <div key={item.id || index} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-start space-x-4 flex-1">
                                                <div className="w-8 h-8 bg-[#06B6D4] text-white rounded-full flex items-center justify-center font-semibold text-sm mt-1">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                                        {item.question || "Câu hỏi chưa có tiêu đề"}
                                                    </h4>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {item.answers?.map((answer, ansIndex) => (
                                                            <div key={ansIndex} className={`p-3 rounded-lg border-2 ${
                                                                answer.isCorrect 
                                                                    ? 'border-green-500 bg-green-50' 
                                                                    : 'border-gray-200 bg-gray-50'
                                                            }`}>
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {answer.text || "Chưa có nội dung"}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2 ml-4">
                                                <button className="p-2 text-[#06B6D4] hover:bg-[#06B6D4]/10 rounded-lg transition-colors">
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteContent(item.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>Thời gian: {item.timeLimit || 30} giây</span>
                                            <span>Điểm: {item.points || 1000}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Hidden Save Button for MixedQuestionForm */}
                <div className="hidden">
                    <MixedQuestionForm
                        onSubmit={saveModuleContent}
                        initialData={data}
                        onDelete={handleDeleteContent}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                        Hủy bỏ
                    </button>
                    <button
                        onClick={() => document.getElementById('save-btn')?.click()}
                        disabled={isSaving}
                        className="px-8 py-3 bg-[#F97316] hover:bg-orange-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center space-x-2"
                    >
                        {isSaving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        <span>{isSaving ? 'Đang lưu...' : 'Lưu tất cả thay đổi'}</span>
                    </button>
                </div>
            </div>

            {/* Global Styles */}
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                
                .font-sans {
                    font-family: 'Inter', sans-serif;
                }
            `}</style>
        </div>
    );
}