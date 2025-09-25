import { Plus, Book, Search, RefreshCw, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

export default function DirectComponent(){
    const [display, setDisplay] = useState(false);
    const [meaning, SetMeaning] = useState('');
    const [description, setDescrip] = useState('');
    const [word, setWord] = useState('');
    const [activeTab, setActiveTab] = useState('add');
    const [myWords, setMyWords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');
    const [refresh, setRefresh] = useState(0);
    const [showWarn, setShowWarn] = useState(false);
    
    // Mock user authentication
    const mockAuth = {
        user: {
            customerId: 'mock-user-123'
        }
    };

    // Mock API functions
    const getMywords = async (customerId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: [
                        { rwId: 1, word: 'こんにちは', meaning: 'Xin chào', description: 'Lời chào thông dụng trong tiếng Nhật' },
                        { rwId: 2, word: 'ありがとう', meaning: 'Cảm ơn', description: 'Cách nói cảm ơn lịch sự' },
                        { rwId: 3, word: '学校', meaning: 'Trường học', description: 'Nơi để học tập' },
                        { rwId: 4, word: '友達', meaning: 'Bạn bè', description: 'Những người bạn thân thiết' },
                        { rwId: 5, word: '食べる', meaning: 'Ăn', description: 'Động từ chỉ hành động ăn uống' }
                    ]
                });
            }, 1000);
        });
    };

    const addNewWord = async (customerId, payload) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ status: 200, data: payload });
            }, 500);
        });
    };

    const deleteWords = async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ status: 204 });
            }, 500);
        });
    };

    const handleDelete = async (id) => {
        const response = await deleteWords(id);
        if(response.status === 404) {
            showAlertMessage('Xóa thất bại!', 'danger');
        }
        if(response.status === 204) {
            setMyWords(prevWords => prevWords.filter(word => word.rwId !== id));
            showAlertMessage('Xóa từ thành công!', 'success');
            setRefresh(refresh + 1);
        }
    };

    // Filter words based on search term
    const filteredWords = myWords.filter(wordItem =>
        wordItem.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wordItem.meaning?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const approachLimit = () => {
            if(myWords.length >= 19) {
                setShowWarn(true);
            } else {
                setShowWarn(false);
            }
        };
        approachLimit();
    }, [myWords]);

    const fetchMyWords = async () => {
        if (mockAuth.user) {
            setLoading(true);
            try {
                const response = await getMywords(mockAuth.user.customerId);
                setMyWords(response.data || []);
            } catch (error) {
                console.error("Error fetching words:", error);
                showAlertMessage("Lỗi khi tải từ điển!", "danger");
            } finally {
                setLoading(false);
            }
        }
    };

    const showAlertMessage = (message, type = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    useEffect(() => {
        if (activeTab === 'dictionary') {
            fetchMyWords();
        }
    }, [activeTab, mockAuth.user, refresh]);

    const handleClick = () => {
        setDisplay(!display);
    };

    const handleClick2 = async () => {
        if(myWords.length >= 20) {
            showAlertMessage("Bạn chỉ có thể lưu trữ 20 từ, hãy xóa một từ để thêm từ mới!", "warning");
            return;
        }
        if (!word.trim() || !meaning.trim()) {
            showAlertMessage("Vui lòng nhập đầy đủ từ và nghĩa!", "warning");
            return;
        }

        try {
            const payload = { 
                rwId: Date.now(),
                word: word.trim(), 
                meaning: meaning.trim(), 
                description: description.trim() 
            };
            await addNewWord(mockAuth.user.customerId, payload);
            
            // Add to local state
            setMyWords(prevWords => [...prevWords, payload]);
            
            setWord('');
            SetMeaning('');
            setDescrip('');
            setDisplay(false);
            
            showAlertMessage("Thêm từ thành công!", "success");
            
        } catch (error) {
            console.error("Error adding word:", error);
            showAlertMessage("Lỗi khi thêm từ!", "danger");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-600 mb-2 flex items-center justify-center gap-3">
                        <Book size={40} />
                        Từ Điển Cá Nhân
                    </h1>
                    <p className="text-xl text-gray-600">Quản lý và học từ vựng của bạn</p>
                </div>

                {/* Alert */}
                {showAlert && (
                    <div className={`mb-6 p-4 rounded-lg ${
                        alertType === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
                        alertType === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                        <div className="flex justify-between items-center">
                            <span>{alertMessage}</span>
                            <button 
                                onClick={() => setShowAlert(false)}
                                className="text-lg font-bold opacity-70 hover:opacity-100"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}

                {/* Navigation Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex justify-center">
                            <button
                                className={`px-6 py-4 text-sm font-medium border-b-2 flex items-center gap-2 ${
                                    activeTab === 'add' 
                                        ? 'border-blue-500 text-blue-600' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                                onClick={() => setActiveTab('add')}
                            >
                                <Plus size={18} />
                                Thêm từ mới
                            </button>
                            <button
                                className={`px-6 py-4 text-sm font-medium border-b-2 flex items-center gap-2 ${
                                    activeTab === 'dictionary' 
                                        ? 'border-blue-500 text-blue-600' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                                onClick={() => setActiveTab('dictionary')}
                            >
                                <Book size={18} />
                                Từ điển của tôi
                                {myWords.length > 0 && (
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        {myWords.length}
                                    </span>
                                )}
                                {showWarn && (
                                    <div className="text-orange-500 flex items-center gap-1">
                                        <AlertTriangle size={16} />
                                        <span className="text-xs">Gần đạt giới hạn</span>
                                    </div>
                                )}
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Add Word Tab */}
                {activeTab === 'add' && (
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Plus size={20} />
                                Thêm từ vựng mới
                            </h2>
                        </div>
                        <div className="p-6">
                            {!display ? (
                                <div className="text-center py-12">
                                    <Plus size={64} className="text-gray-400 mb-4 mx-auto" />
                                    <h4 className="text-xl text-gray-600 mb-4">Bắt đầu thêm từ vựng</h4>
                                    <button 
                                        onClick={handleClick} 
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                                    >
                                        <Plus size={20} />
                                        Thêm từ mới
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Từ vựng (日本語) <span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="text" 
                                                placeholder="Nhập từ tiếng Nhật..." 
                                                value={word}
                                                onChange={(e) => setWord(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                                style={{ 
                                                    fontFamily: '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif'
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Nghĩa (Tiếng Việt) <span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="text" 
                                                placeholder="Nhập nghĩa tiếng Việt..." 
                                                value={meaning}
                                                onChange={(e) => SetMeaning(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Mô tả (tuỳ chọn)
                                        </label>
                                        <textarea 
                                            rows={3}
                                            placeholder="Nhập mô tả, ví dụ câu, cách sử dụng hoặc ghi chú..." 
                                            value={description}
                                            onChange={(e) => setDescrip(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    
                                    {/* Preview */}
                                    {word && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h6 className="text-blue-600 mb-2 font-semibold">👀 Xem trước:</h6>
                                            <div className="flex items-center gap-3">
                                                <span 
                                                    className="text-2xl font-bold"
                                                    style={{ 
                                                        fontFamily: '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif'
                                                    }}
                                                >
                                                    {word}
                                                </span>
                                                {meaning && (
                                                    <>
                                                        <span className="text-gray-400">→</span>
                                                        <span className="text-green-600 font-semibold">{meaning}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3 justify-end">
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                setDisplay(false);
                                                setWord('');
                                                SetMeaning('');
                                                setDescrip('');
                                            }} 
                                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Hủy
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={handleClick2} 
                                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                        >
                                            <Plus size={18} />
                                            Lưu từ
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Dictionary Tab */}
                {activeTab === 'dictionary' && (
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="bg-cyan-600 text-white p-4 rounded-t-lg">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <Book size={20} />
                                    Từ điển của tôi ({myWords.length} từ)
                                </h2>
                                <button 
                                    onClick={fetchMyWords} 
                                    disabled={loading}
                                    className="bg-white text-cyan-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-600 border-t-transparent"></div>
                                    ) : (
                                        <RefreshCw size={16} />
                                    )}
                                    Làm mới
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            {/* Search Bar */}
                            {myWords.length > 0 && (
                                <div className="mb-6">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            placeholder="Tìm kiếm từ vựng..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            )}

                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-600 border-t-transparent mx-auto mb-4"></div>
                                    <p className="text-gray-600">Đang tải từ điển...</p>
                                </div>
                            ) : (
                                <>
                                    {filteredWords.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Book size={64} className="text-gray-400 mb-4 mx-auto" />
                                            <h4 className="text-xl text-gray-600 mb-2">
                                                {myWords.length === 0 
                                                    ? "Từ điển trống" 
                                                    : "Không tìm thấy từ nào"
                                                }
                                            </h4>
                                            <p className="text-gray-500">
                                                {myWords.length === 0 
                                                    ? "Hãy thêm từ vựng đầu tiên của bạn!" 
                                                    : "Thử tìm kiếm với từ khóa khác"
                                                }
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid lg:grid-cols-2 gap-4">
                                            {filteredWords.map((wordItem, index) => (
                                                <div key={wordItem.rwId} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h5 
                                                            className="text-xl font-bold text-blue-600"
                                                            style={{
                                                                fontFamily: '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif'
                                                            }}
                                                        >
                                                            {wordItem.word}
                                                        </h5>
                                                        <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded">
                                                            #{index + 1}
                                                        </span>
                                                    </div>
                                                    <div className="mb-2">
                                                        <strong className="text-green-600">Nghĩa:</strong>
                                                        <p className="mt-1 text-gray-800">{wordItem.meaning}</p>
                                                    </div>
                                                    {wordItem.description && (
                                                        <div className="mb-3">
                                                            <strong className="text-cyan-600">Mô tả:</strong>
                                                            <p className="mt-1 text-gray-600 text-sm">
                                                                {wordItem.description}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <button 
                                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                                                        onClick={() => handleDelete(wordItem.rwId)}
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}