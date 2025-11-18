import React, { useState, useEffect } from 'react';
import { Plus, Calendar, HelpCircle, Loader2, Trash2, Edit2, X, Check, Play, Users } from 'lucide-react';
import { kahootApi } from '../../api/creator/kahootApi';
import { useNavigate } from 'react-router-dom';

const KahootList = () => {
  const [kahoots, setKahoots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKahootTitle, setNewKahootTitle] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    fetchKahoots();
  }, []);

  const fetchKahoots = async () => {
    try {
      setLoading(true);
      const response = await kahootApi.getAll();
      console.log('Response từ API:', response);
      
      if (response && Array.isArray(response.data)) {
        setKahoots(response.data);
      } else if (response && Array.isArray(response)) {
        setKahoots(response);
      } else if (Array.isArray(response?.data?.data)) {
        setKahoots(response.data.data);
      } else {
        console.warn('Cấu trúc response không mong đợi:', response);
        setKahoots([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách Kahoot:', error);
      setKahoots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKahoot = async () => {
    if (!newKahootTitle.trim()) {
      alert('Vui lòng nhập tên Kahoot');
      return;
    }

    try {
      setCreating(true);
      const response = await kahootApi.create(newKahootTitle);
      console.log('Response từ create API:', response);
      
      const newKahoot = response?.data || response;
      
      if (newKahoot) {
        setKahoots([newKahoot, ...kahoots]);
        setNewKahootTitle('');
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Lỗi khi tạo Kahoot:', error);
      alert('Không thể tạo Kahoot. Vui lòng thử lại!');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteKahoot = async (kahootId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa Kahoot này?')) {
      return;
    }

    try {
      setDeletingId(kahootId);
      await kahootApi.delete(kahootId);
      setKahoots(kahoots.filter(k => k.id !== kahootId));
    } catch (error) {
      console.error('Lỗi khi xóa Kahoot:', error);
      alert('Không thể xóa Kahoot. Vui lòng thử lại!');
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartEdit = (kahoot) => {
    setEditingId(kahoot.id);
    setEditTitle(kahoot.title);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleSaveEdit = async (kahootId) => {
    if (!editTitle.trim()) {
      alert('Vui lòng nhập tên Kahoot');
      return;
    }

    try {
      await kahootApi.updateTitle(kahootId, editTitle);
      setKahoots(kahoots.map(k => 
        k.id === kahootId ? { ...k, title: editTitle } : k
      ));
      setEditingId(null);
      setEditTitle('');
    } catch (error) {
      console.error('Lỗi khi cập nhật Kahoot:', error);
      alert('Không thể cập nhật tên Kahoot. Vui lòng thử lại!');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center font-sans">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#06B6D4] mx-auto mb-4" />
          <p className="text-gray-600">Đang tải danh sách Kahoot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Kahoot</h1>
            <p className="text-gray-600">Tạo và quản lý các bài quiz tương tác của bạn</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-3 bg-[#06B6D4] hover:bg-[#0891b2] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Tạo Kahoot mới
          </button>
        </div>

        {/* Kahoot Grid */}
        {kahoots.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center transition-all duration-300 hover:shadow-xl">
            <HelpCircle className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Chưa có Kahoot nào
            </h3>
            <p className="text-gray-500 mb-8 text-lg">
              Bắt đầu hành trình tạo bài quiz tương tác đầu tiên của bạn
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#06B6D4] hover:bg-[#0891b2] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Tạo Kahoot đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {kahoots.map((kahoot, index) => (
              <div
                key={kahoot.id || index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-[#06B6D4]/20 group"
              >
                {/* Header với tiêu đề và actions */}
                <div className="mb-4">
                  {editingId === kahoot.id ? (
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-4 py-2 border border-[#06B6D4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:border-transparent"
                        autoFocus
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveEdit(kahoot.id);
                          } else if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                      />
                      <button
                        onClick={() => handleSaveEdit(kahoot.id)}
                        className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        title="Lưu"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition-colors"
                        title="Hủy"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1 pr-2">
                        {kahoot.title}
                      </h3>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleStartEdit(kahoot)}
                          className="p-2 text-[#06B6D4] hover:bg-[#06B6D4]/10 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteKahoot(kahoot.id)}
                          disabled={deletingId === kahoot.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Xóa"
                        >
                          {deletingId === kahoot.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Thông tin ngày tạo */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(kahoot.createDate)}</span>
                  </div>
                </div>

                {/* Stats và Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-[#06B6D4]" />
                      <span className="text-sm font-semibold text-gray-700">
                        {kahoot.numberQuestion || 0} câu hỏi
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#F97316]" />
                      <span className="text-sm font-semibold text-gray-700">
                        0 người chơi
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => nav(`/creator/class/kahoot/${kahoot.id}/start`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                  >
                    <Play className="w-4 h-4" />
                    Bắt đầu ngay
                  </button>
                  <button 
                    onClick={() => nav(`/creator/class/kahoot/${kahoot.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 border border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300"
                  >
                    Chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slideUp">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#06B6D4] rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tạo Kahoot mới
              </h2>
              <p className="text-gray-600">
                Đặt tên cho bài quiz tương tác của bạn
              </p>
            </div>
            
            <input
              type="text"
              value={newKahootTitle}
              onChange={(e) => setNewKahootTitle(e.target.value)}
              placeholder="Ví dụ: Kiến thức lịch sử Việt Nam"
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:border-transparent mb-6 text-lg"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !creating) {
                  handleCreateKahoot();
                }
              }}
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewKahootTitle('');
                }}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                disabled={creating}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleCreateKahoot}
                disabled={creating || !newKahootTitle.trim()}
                className="flex-1 px-6 py-3 bg-[#F97316] hover:bg-orange-600 text-white rounded-xl font-semibold transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  'Tạo Kahoot'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default KahootList;