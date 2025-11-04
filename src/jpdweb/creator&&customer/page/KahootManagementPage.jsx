import React, { useState, useEffect } from 'react';
import { Plus, Calendar, HelpCircle, Loader2, Trash2, Edit2, X, Check } from 'lucide-react';
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
 const nav=useNavigate()
  useEffect(() => {
    fetchKahoots();
  }, []);

  const fetchKahoots = async () => {
    try {
      setLoading(true);
      const response = await kahootApi.getAll();
      console.log('Response từ API:', response);
      
      // Kiểm tra nhiều trường hợp cấu trúc response khác nhau
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
      
      // Kiểm tra cấu trúc response và lấy data
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải danh sách Kahoot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Kahoot của tôi</h1>
            <p className="text-gray-600">Quản lý và tạo mới các bài quiz của bạn</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Tạo Kahoot mới
          </button>
        </div>

        {/* Kahoot Grid */}
        {kahoots.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Chưa có Kahoot nào
            </h3>
            <p className="text-gray-500 mb-6">
              Bắt đầu bằng cách tạo Kahoot đầu tiên của bạn
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Tạo Kahoot đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kahoots.map((kahoot, index) => (
              <div
                key={kahoot.id || index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6"
              >
                <div className="mb-4">
                  {editingId === kahoot.id ? (
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-800 line-clamp-2 flex-1">
                        {kahoot.title}
                      </h3>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => handleStartEdit(kahoot)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(kahoot.createDate)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-semibold text-gray-700">
                      {kahoot.numberQuestion} câu hỏi
                    </span>
                  </div>
                     <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm" onClick={()=>{
                     nav(`/creator/class/kahoot/${kahoot.id}/start`)}}>
                    start now
                  </button>
                  <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm" onClick={()=>{//path="/creator/class/kahoot/:id"
                    nav(`/creator/class/kahoot/${kahoot.id}`)
                  }}>
                    Xem chi tiết →
                  </button>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Tạo Kahoot mới
            </h2>
            <p className="text-gray-600 mb-6">
              Nhập tên cho Kahoot của bạn
            </p>
            <input
              type="text"
              value={newKahootTitle}
              onChange={(e) => setNewKahootTitle(e.target.value)}
              placeholder="Ví dụ: Kiến thức lịch sử Việt Nam"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent mb-6"
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
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={creating}
              >
                Hủy
              </button>
              <button
                onClick={handleCreateKahoot}
                disabled={creating || !newKahootTitle.trim()}
                className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
    </div>
  );
};

export default KahootList;